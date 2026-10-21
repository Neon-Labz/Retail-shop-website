import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import ProductModel from '@/models/Product';
import RecentlyViewedModel from '@/models/RecentlyViewed';
import { formatMongoProduct } from '@/lib/formatProduct';

function resolveCustomerId(request: NextRequest): { customerId: string; isNew: boolean } {
  const param = request.nextUrl.searchParams.get('customerId') || request.nextUrl.searchParams.get('userId');
  if (param) return { customerId: param, isNew: false };

  const cookieId = request.cookies.get('customer_id')?.value;
  if (cookieId) return { customerId: cookieId, isNew: false };

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

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { success: false, error: 'Valid MongoDB productId is required' },
        { status: 400 }
      );
    }

    let isNewCustomer = false;
    if (!customerId) {
      const resolved = resolveCustomerId(request);
      customerId = resolved.customerId;
      isNewCustomer = resolved.isNew;
    }

    await connectDB();

    const productObjectId = new mongoose.Types.ObjectId(productId);

    await RecentlyViewedModel.findOneAndUpdate(
      { customerId, productId: productObjectId },
      { $set: { viewedAt: new Date() } },
      { upsert: true, new: true }
    );

    const allForUser = await RecentlyViewedModel.find({ customerId })
      .sort({ viewedAt: -1 })
      .skip(30)
      .select('_id')
      .lean();

    if (allForUser.length > 0) {
      await RecentlyViewedModel.deleteMany({
        _id: { $in: allForUser.map((d) => d._id) },
      });
    }

    const response = NextResponse.json({
      success: true,
      customerId,
      productId,
    });

    if (isNewCustomer) {
      response.cookies.set('customer_id', customerId, {
        maxAge: 60 * 60 * 24 * 90, // 90 days
        path: '/',
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
