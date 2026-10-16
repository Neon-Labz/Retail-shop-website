import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import ProductModel from '@/models/Product';
import { formatMongoProduct } from '@/lib/formatProduct';
import productsData from '@/data/products.json';
import type { Product } from '@/types/product';

const fallbackProducts: Product[] = productsData as Product[];

export async function GET(request: NextRequest) {
  try {
    const query = (request.nextUrl.searchParams.get('q') || request.nextUrl.searchParams.get('search') || '').trim();
    const limit = Math.min(20, parseInt(request.nextUrl.searchParams.get('limit') || '8'));

    // Try MongoDB Search first
    try {
      await connectDB();

      if (!query) {
        // Return featured or newest products when no query provided
        const popularDocs = await ProductModel.find({ status: 'active' })
          .sort({ isFeatured: -1, totalSold: -1, createdAt: -1 })
          .limit(limit)
          .lean();

        const formatted = popularDocs.map(formatMongoProduct);
        return NextResponse.json({
          products: formatted,
          suggestions: [],
        });
      }

      const searchRegex = new RegExp(query, 'i');
      const searchFilter: Record<string, any> = {
        status: { $ne: 'archived' },
        $or: [
          { name: { $regex: searchRegex } },
          { sku: { $regex: searchRegex } },
          { slug: { $regex: searchRegex } },
          { subcategory: { $regex: searchRegex } },
          { description: { $regex: searchRegex } },
        ],
      };

      const matchedDocs = await ProductModel.find(searchFilter)
        .sort({ isFeatured: -1, createdAt: -1 })
        .limit(limit)
        .lean();

      const formattedResults = matchedDocs.map(formatMongoProduct);

      // Generate helpful suggestions from matched product names, SKUs, and subcategories
      const suggestionsSet = new Set<string>();
      matchedDocs.forEach((doc: any) => {
        if (doc.name) suggestionsSet.add(doc.name);
        if (doc.subcategory) suggestionsSet.add(doc.subcategory);
        if (doc.sku) suggestionsSet.add(doc.sku);
      });

      const suggestions = Array.from(suggestionsSet).slice(0, 5);

      return NextResponse.json({
        products: formattedResults,
        suggestions,
      });
    } catch (dbErr) {
      console.warn('MongoDB query warning in /api/search, falling back to mock:', dbErr);
    }

    // Fallback search in local data
    if (!query) {
      const popular = fallbackProducts
        .slice()
        .sort((a, b) => b.reviewCount - a.reviewCount)
        .slice(0, limit);

      return NextResponse.json({
        products: popular,
        suggestions: [],
      });
    }

    const q = query.toLowerCase();
    const results = fallbackProducts
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.category.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q)
      )
      .slice(0, limit);

    const suggestions = Array.from(
      new Set(
        results
          .flatMap((p) => [p.name, p.sku, ...p.tags])
          .filter((s) => s && s.toLowerCase().includes(q))
      )
    ).slice(0, 5);

    return NextResponse.json({ products: results, suggestions });
  } catch (error) {
    console.error('Error in /api/search GET:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
