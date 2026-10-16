import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import { formatMongoProduct } from '@/lib/formatProduct';
import productsData from '@/data/products.json';
import { skinCareProducts } from '@/data/skin-care-products';
import { jewelleryProducts } from '@/data/jewellery-products';
import type { Product as ProductType } from '@/types/product';

const fashionProducts: ProductType[] = productsData as ProductType[];
const allFallbackProducts: ProductType[] = [...fashionProducts, ...skinCareProducts, ...jewelleryProducts];

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
      console.warn('MongoDB query warning in /api/products/[id]:', dbErr);
    }

    // 2. Fallback to local data if not found in MongoDB
    const fallbackProduct = allFallbackProducts.find((p) => p.id === id || p.slug === id);

    if (!fallbackProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product: fallbackProduct });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
