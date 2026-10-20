import type { Product } from '@/types/product';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  // Default variant for MongoDB products that do not store nested variants array
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

  return {
    id: productId,
    slug: doc.slug,
    name: doc.name,
    vendor: doc.subcategory || 'Store',
    brand: doc.subcategory || 'Store',
    price: finalPrice,
    compareAtPrice: compareAtPrice,
    currency: 'LKR',
    images,
    /* Original empty variants commented out:
    variants: [],
    */
    variants: [defaultVariant],
    colors: [],
    sizes: [],
    category: typeof doc.category === 'object' && doc.category?.name ? doc.category.name : (doc.subcategory || 'General'),
    tags: [doc.subcategory].filter(Boolean) as string[],
    availability: inStock ? 'in-stock' : 'out-of-stock',
    badge: isSale ? 'sale' : doc.isFeatured ? 'new' : null,
    description: doc.description || '',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
