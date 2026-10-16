import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import ProductModel from '@/models/Product';
import RecentlyViewedModel from '@/models/RecentlyViewed';
import { formatMongoProduct } from '@/lib/formatProduct';
import { podProducts } from '@/data/pod-products';

// Helper to get or generate customer ID from query or cookies
function resolveCustomerId(request: NextRequest): { customerId: string; isNew: boolean } {
  const param = request.nextUrl.searchParams.get('customerId') || request.nextUrl.searchParams.get('userId');
  if (param) return { customerId: param, isNew: false };

  const cookieId = request.cookies.get('customer_id')?.value;
  if (cookieId) return { customerId: cookieId, isNew: false };

  // Generate guest session customer ID
  const newId = 'cust_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
  return { customerId: newId, isNew: true };
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.max(1, parseInt(searchParams.get('limit') || '8'));
    const idsParam = searchParams.get('ids');
    const { customerId } = resolveCustomerId(request);

    await connectDB();

    let productIds: string[] = [];

    // Case 1: Client passed specific comma-separated product IDs
    if (idsParam) {
      productIds = idsParam
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }
    // Case 2: Retrieve from server-side database browsing history
    else if (customerId) {
      const historyDocs = await RecentlyViewedModel.find({ customerId })
        .sort({ viewedAt: -1 })
        .limit(limit)
        .lean();

      productIds = historyDocs.map((doc) => doc.productId.toString());
    }

    if (productIds.length > 0) {
      const validObjectIds = productIds
        .filter((id) => mongoose.Types.ObjectId.isValid(id))
        .map((id) => new mongoose.Types.ObjectId(id));

      if (validObjectIds.length > 0) {
        const foundDocs = await ProductModel.find({
          _id: { $in: validObjectIds },
          status: { $ne: 'archived' },
        }).lean();

        // Preserve chronological order of viewing
        const docMap = new Map(foundDocs.map((d) => [d._id.toString(), d]));
        const orderedDocs = productIds
          .map((id) => docMap.get(id))
          .filter(Boolean) as typeof foundDocs;

        const formatted = orderedDocs.map(formatMongoProduct);

        return NextResponse.json({
          success: true,
          source: 'mongodb',
          customerId,
          count: formatted.length,
          products: formatted,
        });
      }
    }

    // Fallback if no server-side history yet
    return NextResponse.json({
      success: true,
      source: 'empty',
      customerId,
      count: 0,
      products: [],
      message: 'No recently viewed products recorded yet for this customer.',
    });
  } catch (error) {
    console.error('Error in /api/recommendations/recently-viewed GET:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    let customerId = body.customerId;
    const productId = body.productId;

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'productId is required' },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid productId format' },
        { status: 400 }
      );
    }

    let isNewCookie = false;
    if (!customerId) {
      const resolved = resolveCustomerId(request);
      customerId = resolved.customerId;
      isNewCookie = resolved.isNew;
    }

    await connectDB();

    // Upsert into recently viewed collection
    const updated = await RecentlyViewedModel.findOneAndUpdate(
      {
        customerId,
        productId: new mongoose.Types.ObjectId(productId),
      },
      {
        viewedAt: new Date(),
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    const response = NextResponse.json({
      success: true,
      message: 'Product view recorded in server-side browsing history',
      customerId,
      productId,
      viewedAt: updated.viewedAt,
    });

    if (isNewCookie) {
      response.cookies.set('customer_id', customerId, {
        path: '/',
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 365, // 1 year
        sameSite: 'lax',
      });
    }

    return response;
  } catch (error) {
    console.error('Error in /api/recommendations/recently-viewed POST:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
