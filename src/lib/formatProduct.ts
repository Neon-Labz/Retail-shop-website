import type { Product } from '@/types/product';

const CATEGORY_ID_MAP: Record<string, string> = {
  '6ad5f26d8c37efc3ddcb1a03': 'Toys & Games',
  '6ad5f2708c37efc3ddcb1a08': 'Party & Celebrations',
  '6ad5f2738c37efc3ddcb1a0b': 'Home & Living',
  '6ad5f2758c37efc3ddcb1a0f': 'Stationery & School',
  '6ad5f2788c37efc3ddcb1a11': 'Electronics & Gadgets',
  '6ad5f27a8c37efc3ddcb1a13': 'Fashion & Accessories',
};

const SUBCATEGORY_TO_CATEGORY: Record<string, string> = {
  'Action & Toy Vehicles': 'Toys & Games',
  'Outdoor & Bubble Play': 'Toys & Games',
  'Figures & Collectibles': 'Toys & Games',
  'Kids Activities & Games': 'Toys & Games',
  'Party Supplies & Effects': 'Party & Celebrations',
  'Cake Accessories': 'Party & Celebrations',
  'Dining & Tableware': 'Home & Living',
  'Furniture & Storage': 'Home & Living',
  'Clocks & Home Decor': 'Home & Living',
  'Kids Stationery Sets': 'Stationery & School',
  'Fans & Cooling': 'Electronics & Gadgets',
  'Jewelry & Accessories': 'Fashion & Accessories',
};

function resolveCategory(doc: any): string {
  if (typeof doc.category === 'object' && doc.category && doc.category.name) {
    return doc.category.name;
  }
  const catId = doc.category?.toString?.() || (typeof doc.category === 'string' ? doc.category : '');
  if (catId && CATEGORY_ID_MAP[catId]) {
    return CATEGORY_ID_MAP[catId];
  }
  if (doc.subcategory && SUBCATEGORY_TO_CATEGORY[doc.subcategory]) {
    return SUBCATEGORY_TO_CATEGORY[doc.subcategory];
  }
  if (typeof doc.category === 'string' && doc.category.length > 0 && !/^[0-9a-fA-F]{24}$/.test(doc.category)) {
    return doc.category;
  }
  return doc.subcategory || 'General';
}

export function formatMongoProduct(doc: any): Product {
  const rawImages: string[] = Array.isArray(doc.images) ? doc.images : [];
  const images = rawImages.map((src: string, index: number) => ({
    id: `img-${index}`,
    src,
    alt: doc.name || 'Product Image',
  }));

  if (images.length === 0) {
    images.push({
      id: 'img-placeholder',
      src: '/placeholder.png',
      alt: doc.name || 'Product Image',
    });
  }

  const inStock = (doc.stock ?? 0) > 0;
  const isSale = doc.salePrice && doc.salePrice > 0 && doc.salePrice < doc.price;

  const productId = doc._id?.toString() || doc.id || '';
  const finalPrice = isSale ? doc.salePrice : (doc.price ?? 0);
  const compareAtPrice = isSale ? doc.price : null;

  const defaultVariant = {
    id: `v-default-${productId}`,
    color: '',
    size: '',
    price: finalPrice,
    compareAtPrice,
    image: images[0]?.src || '/placeholder.png',
    available: inStock,
    sku: doc.sku || '',
  };

  const resolvedCategory = resolveCategory(doc);

  return {
    id: productId,
    slug: doc.slug,
    name: doc.name,
    vendor: doc.subcategory || resolvedCategory || 'Store',
    brand: doc.subcategory || resolvedCategory || 'Store',
    price: finalPrice,
    compareAtPrice: compareAtPrice,
    currency: 'LKR',
    images,
    variants: [defaultVariant],
    colors: [],
    sizes: [],
    category: resolvedCategory,
    subcategory: doc.subcategory || '',
    tags: [doc.subcategory, resolvedCategory].filter(Boolean) as string[],
    availability: inStock ? 'in-stock' : 'out-of-stock',
    badge: isSale ? 'sale' : doc.isFeatured ? 'new' : null,
    description: doc.description || '',
    features: (doc.specifications || []).map((s: any) => `${s.key}: ${s.value}`),
    rating: 5,
    reviewCount: 0,
    reviews: [],
    relatedProducts: [],
    pairsWellWith: [],
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
    sku: doc.sku || '',
    countdownEnd: null,
  };
}
