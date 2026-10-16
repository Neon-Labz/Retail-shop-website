import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import ProductModel from '@/models/Product';
import { formatMongoProduct } from '@/lib/formatProduct';
import { podProducts } from '@/data/pod-products';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.max(1, Math.min(50, parseInt(searchParams.get('limit') || '8')));
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const excludeParam = searchParams.get('exclude');

    await connectDB();

    const matchQuery: Record<string, any> = {
      status: { $ne: 'archived' },
    };

    // Exclude specific product IDs (e.g. currently viewed product)
    if (excludeParam) {
      const excludeIds = excludeParam
        .split(',')
        .map((s) => s.trim())
        .filter((s) => mongoose.Types.ObjectId.isValid(s))
        .map((s) => new mongoose.Types.ObjectId(s));

      if (excludeIds.length > 0) {
        matchQuery._id = { $nin: excludeIds };
      }
    }

    // Category filter
    if (category && category !== 'all') {
      if (mongoose.Types.ObjectId.isValid(category)) {
        matchQuery.category = new mongoose.Types.ObjectId(category);
      } else {
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
            matchQuery.category = categoryDoc._id;
          } else {
            matchQuery.subcategory = { $regex: new RegExp(category, 'i') };
          }
        } catch {
          matchQuery.subcategory = { $regex: new RegExp(category, 'i') };
        }
      }
    }

    if (subcategory && subcategory !== 'all') {
      matchQuery.subcategory = { $regex: new RegExp(`^${subcategory}$`, 'i') };
    }

    // Use MongoDB's native $sample aggregation for random selection
    const randomDocs = await ProductModel.aggregate([
      { $match: matchQuery },
      { $sample: { size: limit } },
    ]);

    let products = (randomDocs || []).map(formatMongoProduct);

    // Fallback if DB is empty
    if (products.length === 0) {
      let pool = [...podProducts];
      if (category && category !== 'all') {
        pool = pool.filter((p) => p.category.toLowerCase().includes(category.toLowerCase()));
      }
      if (excludeParam) {
        const excludedSet = new Set(excludeParam.split(',').map((s) => s.trim()));
        pool = pool.filter((p) => !excludedSet.has(p.id));
      }
      // Shuffle array randomly
      const shuffled = [...pool].sort(() => 0.5 - Math.random());
      products = shuffled.slice(0, limit);
    }

    return NextResponse.json({
      success: true,
      count: products.length,
      limit,
      products,
    });
  } catch (error) {
    console.error('Error in /api/recommendations/random GET:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
