import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import categoriesData from '@/data/categories.json';

export async function GET() {
  try {
    const conn = await connectDB();
    const db = conn.connection.db;
    if (!db) throw new Error('Database not connected');

    const mongoCats = await db.collection('categories').find({}).toArray();

    if (mongoCats && mongoCats.length > 0) {
      // Fetch distinct subcategories for each category
      /* Previous projection without images/name commented out as requested
      const products = await db
        .collection('products')
        .find({}, { projection: { category: 1, subcategory: 1 } })
        .toArray();
      */
      const products = await db
        .collection('products')
        .find({}, { projection: { category: 1, subcategory: 1, images: 1, name: 1 } })
        .toArray();

      const catSubMap = new Map<string, Set<string>>();
      mongoCats.forEach((c) => catSubMap.set(c._id.toString(), new Set<string>()));

      products.forEach((p) => {
        const catId = p.category ? p.category.toString() : '';
        if (catSubMap.has(catId) && p.subcategory) {
          catSubMap.get(catId)!.add(p.subcategory);
        }
      });

      /* Previous categoriesWithSubs without image/productCount commented out as requested
      const categoriesWithSubs = mongoCats.map((c) => {
        const subSet = catSubMap.get(c._id.toString()) || new Set();
        return {
          id: c._id.toString(),
          name: c.name,
          slug: c.slug,
          description: c.description || '',
          subcategories: Array.from(subSet),
        };
      });
      */
      const categoriesWithSubs = mongoCats.map((c) => {
        const subSet = catSubMap.get(c._id.toString()) || new Set();
        const catIdStr = c._id.toString();

        // Find all products belonging to this category or its subcategories
        const matchingProducts = products.filter((p) => {
          const pCat = p.category ? p.category.toString() : '';
          const pSub = p.subcategory ? p.subcategory.toString() : '';
          return (
            pCat === catIdStr ||
            pCat.toLowerCase() === c.name.toLowerCase() ||
            pCat.toLowerCase() === c.slug.toLowerCase() ||
            subSet.has(pCat) ||
            (pSub && subSet.has(pSub))
          );
        });

        /* Previous image extraction supporting only { src } commented out as requested:
        const firstProductWithImg = matchingProducts.find((p) => p.images && p.images[0]?.src);
        const image = c.image || firstProductWithImg?.images[0]?.src || '/pod/shop-by-categories-slider/shop-by-categories-1.webp';
        */
        /* Previous product image fallback logic commented out as requested:
        const firstProductWithImg = matchingProducts.find((p) => {
          if (!p.images || !Array.isArray(p.images) || p.images.length === 0) return false;
          const img0 = p.images[0];
          return typeof img0 === 'string' ? img0.length > 0 : Boolean(img0?.src);
        });
        const resolvedProductImg = firstProductWithImg
          ? (typeof firstProductWithImg.images[0] === 'string' ? firstProductWithImg.images[0] : firstProductWithImg.images[0]?.src)
          : '';
        const image = c.image || resolvedProductImg || '/pod/shop-by-categories-slider/shop-by-categories-1.webp';
        */
        // Connect strictly to MongoDB category document image (set from Admin panel)
        const image = (c.image && typeof c.image === 'string' && c.image.trim() !== '')
          ? c.image
          : '/pod/shop-by-categories-slider/shop-by-categories-1.webp';

        return {
          id: catIdStr,
          name: c.name,
          slug: c.slug,
          description: c.description || '',
          image,
          productCount: matchingProducts.length,
          subcategories: Array.from(subSet),
        };
      });

      // Also generate subcategory items for granular category carousels
      const subcategoryItems: Array<{ id: string; name: string; slug: string; categoryName: string; image: string; count: number }> = [];
      const seenSubs = new Set<string>();

      products.forEach((p) => {
        const sub = p.subcategory || p.category;
        if (sub && typeof sub === 'string' && !seenSubs.has(sub.toLowerCase())) {
          seenSubs.add(sub.toLowerCase());
          const subProducts = products.filter(
            (sp) =>
              (sp.subcategory && sp.subcategory.toLowerCase() === sub.toLowerCase()) ||
              (sp.category && sp.category.toString().toLowerCase() === sub.toLowerCase())
          );
          /* Previous subcategory image extraction commented out as requested:
          const firstImg = subProducts.find((sp) => sp.images && sp.images[0]?.src)?.images[0]?.src;
          */
          const firstImgProd = subProducts.find((sp) => {
            if (!sp.images || !Array.isArray(sp.images) || sp.images.length === 0) return false;
            const img0 = sp.images[0];
            return typeof img0 === 'string' ? img0.length > 0 : Boolean(img0?.src);
          });
          const firstImg = firstImgProd
            ? (typeof firstImgProd.images[0] === 'string' ? firstImgProd.images[0] : firstImgProd.images[0]?.src)
            : '';
          if (firstImg) {
            subcategoryItems.push({
              id: `sub-${sub.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
              name: sub,
              slug: sub.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              categoryName: typeof p.category === 'string' ? p.category : '',
              image: firstImg,
              count: subProducts.length,
            });
          }
        }
      });

      return NextResponse.json({
        categories: categoriesWithSubs,
        subcategories: subcategoryItems,
      });
    }
  } catch (err) {
    console.warn('MongoDB categories query warning, falling back:', err);
  }

  return NextResponse.json({ categories: categoriesData });
}
