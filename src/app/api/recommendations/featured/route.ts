import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import ProductModel from '@/models/Product';
import { formatMongoProduct } from '@/lib/formatProduct';
import { podProducts } from '@/data/pod-products';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const limit = Math.max(1, parseInt(searchParams.get('limit') || '8'));
    const exclude = searchParams.get('exclude');

    await connectDB();

    const baseFilter: Record<string, any> = {
      status: { $ne: 'archived' },
    };

    if (exclude && mongoose.Types.ObjectId.isValid(exclude)) {
      baseFilter._id = { $ne: new mongoose.Types.ObjectId(exclude) };
    }

    // Resolve category filter
    if (category && category !== 'all') {
      if (mongoose.Types.ObjectId.isValid(category)) {
        baseFilter.category = new mongoose.Types.ObjectId(category);
      } else {
        // Look up category in categories collection by name or slug
        try {
          const db = mongoose.connection.db;
          const categoryDoc = db
            ? await db
                .collection('categories')
                .findOne({
                  $or: [
                    { slug: category.toLowerCase() },
                    { name: { $regex: new RegExp(`^${category}$`, 'i') } },
                  ],
                })
            : null;

          if (categoryDoc) {
            baseFilter.category = categoryDoc._id;
          } else {
            baseFilter.subcategory = { $regex: new RegExp(category, 'i') };
          }
        } catch {
          baseFilter.subcategory = { $regex: new RegExp(category, 'i') };
        }
      }
    }

    if (subcategory && subcategory !== 'all') {
      baseFilter.subcategory = { $regex: new RegExp(`^${subcategory}$`, 'i') };
    }

    // 1. Fetch products marked as featured
    const featuredFilter: Record<string, any> = {
      ...baseFilter,
      isFeatured: true,
    };

    let mongoDocs = await ProductModel.find(featuredFilter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    // 2. If fewer than limit featured items found, backfill with top active products in the same category
    if (mongoDocs.length < limit) {
      const existingIds = mongoDocs.map((d) => d._id);
      const backfillLimit = limit - mongoDocs.length;

      const backfillFilter: Record<string, any> = {
        ...baseFilter,
        _id: { $nin: existingIds },
      };

      const backfillDocs = await ProductModel.find(backfillFilter)
        .sort({ totalSold: -1, createdAt: -1 })
        .limit(backfillLimit)
        .lean();

      mongoDocs = [...mongoDocs, ...backfillDocs];
    }

    let products = mongoDocs.map(formatMongoProduct);

    // 3. Fallback to mock products if database returned empty
    if (products.length === 0) {
      let filteredMock = podProducts.filter((p) => {
        if (category && category !== 'all') {
          return p.category.toLowerCase().includes(category.toLowerCase());
        }
        return true;
      });
      if (exclude) {
        filteredMock = filteredMock.filter((p) => p.id !== exclude);
      }
      products = filteredMock.slice(0, limit);
    }

    return NextResponse.json({
      success: true,
      category: category || 'all',
      count: products.length,
      products,
    });
  } catch (error) {
    console.error('Error in /api/recommendations/featured GET:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
