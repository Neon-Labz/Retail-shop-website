import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import { formatMongoProduct } from '@/lib/formatProduct';
import { podProducts } from '@/data/pod-products';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Try querying MongoDB first
    try {
      await connectDB();
      const isMongoId = mongoose.Types.ObjectId.isValid(id);
      const query = isMongoId
        ? { $or: [{ _id: id }, { slug: id }] }
        : { slug: id };

      const mongoProduct = await Product.findOne(query).lean();

      if (mongoProduct) {
        const formatted = formatMongoProduct(mongoProduct);
        return NextResponse.json({ product: formatted });
      }
    } catch (dbErr) {
      console.warn('MongoDB query warning in /api/pod-products/[id]:', dbErr);
    }

    // 2. Fallback to local podProducts
    const fallbackProduct = podProducts.find((p) => p.id === id || p.slug === id);

    if (!fallbackProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product: fallbackProduct });
  } catch (error) {
    console.error('Error fetching POD product:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
