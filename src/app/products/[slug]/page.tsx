import type { Metadata } from 'next';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import ProductModel from '@/models/Product';
import { formatMongoProduct } from '@/lib/formatProduct';
import { ProductDetailContent } from '@/features/products/components/ProductDetailContent';
import type { Product } from '@/types/product';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

async function fetchProductBySlugOrId(slug: string): Promise<Product | null> {
  try {
    await connectDB();
    const decodedSlug = decodeURIComponent(slug).trim();
    const normalizedSlug = decodedSlug.toLowerCase().replace(/[\u2013\u2014]/g, '-');
    const isMongoId = mongoose.Types.ObjectId.isValid(slug) && slug.length === 24;

    const orConditions: any[] = [
      { slug: decodedSlug },
      { slug },
    ];
    if (normalizedSlug !== decodedSlug) {
      orConditions.push({ slug: normalizedSlug });
    }
    if (isMongoId) {
      orConditions.push({ _id: slug });
    }

    let doc = await ProductModel.findOne({ $or: orConditions }).lean();

    if (!doc && !isMongoId) {
      const escaped = decodedSlug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/-/g, '[-–— ]');
      const flexibleRegex = new RegExp(`^${escaped}$`, 'i');
      doc = await ProductModel.findOne({
        $or: [{ slug: flexibleRegex }, { name: flexibleRegex }],
      }).lean();
    }

    if (doc) {
      return formatMongoProduct(doc);
    }
  } catch {
    // Ignore DB errors during metadata generation
  }
  return null;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProductBySlugOrId(slug);

  if (!product) {
    return { title: 'Product Details' };
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images.map((img) => ({ url: img.src })),
      type: 'website',
    },
  };
}

function getApiEndpoint(slug: string): string {
  if (slug.startsWith('ef-')) return '/api/elegant-fashion-products';
  if (slug.startsWith('jw-')) return '/api/jewellery-products';
  if (slug.startsWith('sn-')) return '/api/sneaker-products';
  if (slug.startsWith('fu-')) return '/api/furniture-products';
  if (slug.startsWith('ls-')) return '/api/lipstain-products';
  if (slug.startsWith('hp-')) return '/api/headphones-products';
  if (slug.startsWith('sk-')) return '/api/skin-care-products';
  if (slug.startsWith('es2-')) return '/api/electronics-store-products';
  if (slug.startsWith('fw-')) return '/api/footwear-products';
  if (slug.startsWith('f4-')) return '/api/fashion-04-products';
  if (slug.startsWith('f3-')) return '/api/fashion-03-products';
  if (slug.startsWith('aw-')) return '/api/active-wear-products';
  if (slug.startsWith('bp-')) return '/api/backpack-products';
  if (slug.startsWith('bb-')) return '/api/basketball-products';
  if (slug.startsWith('gl-')) return '/api/glasses-products';
  if (slug.startsWith('pl-')) return '/api/plumbing-supplies-products';
  if (slug.startsWith('bk-')) return '/api/book-products';
  if (slug.startsWith('jz-')) return '/api/jewelry-2-products';
  if (slug.startsWith('cf-')) return '/api/coffee-products';
  if (slug.startsWith('cd-')) return '/api/craft-and-decore-products';
  if (slug.startsWith('toy-')) return '/api/toys-products';
  if (slug.startsWith('sock-')) return '/api/socks-products';
  if (slug.startsWith('pod-')) return '/api/pod-products';
  return '/api/products';
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const apiEndpoint = getApiEndpoint(slug);
  const product = await fetchProductBySlugOrId(slug);

  return (
    <>
      {product && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getStructuredData(product)),
          }}
        />
      )}
      <ProductDetailContent slug={slug} apiEndpoint={apiEndpoint} />
    </>
  );
}

function getStructuredData(product: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images.map((img) => img.src),
    description: product.description,
    brand: { '@type': 'Brand', name: product.vendor },
    sku: product.sku,
    offers: {
      '@type': 'Offer',
      price: product.price.toFixed(2),
      priceCurrency: product.currency,
      availability:
        product.availability === 'in-stock'
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
    },
    aggregateRating:
      product.reviewCount > 0
        ? {
            '@type': 'AggregateRating',
            ratingValue: product.rating.toString(),
            reviewCount: product.reviewCount.toString(),
          }
        : undefined,
  };
}
