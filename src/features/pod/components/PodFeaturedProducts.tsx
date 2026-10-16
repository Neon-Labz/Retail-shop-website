'use client';

import Link from 'next/link';
import { useProducts } from '@/features/products/hooks/useProducts';
import { HomeProductCard } from '@/features/home/components/HomeProductCard';

function ProductCardSkeleton() {
  return (
    <div>
      <div className="animate-shimmer" style={{ aspectRatio: '3 / 4', borderRadius: '4px', marginBottom: '14px' }} />
      <div className="animate-shimmer" style={{ height: '16px', width: '70%', margin: '0 auto 8px', borderRadius: '4px' }} />
      <div className="animate-shimmer" style={{ height: '14px', width: '40%', margin: '0 auto 8px', borderRadius: '4px' }} />
    </div>
  );
}

export function PodFeaturedProducts() {
  const { data, isLoading } = useProducts({ limit: 8 }, { endpoint: '/api/pod-products' });

  const products = data?.products.slice(0, 8) || [];

  return (
    <section>
      <div className="container-main">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 600, color: '#222' }}>Featured Products</h2>
        </div>

        <div className="pdfp-grid">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : products.map((product, i) => (
                /* Previous fixed imageHeight 350px commented out as requested
                <HomeProductCard key={product.id} product={product} index={i} imageHeight="350px" />
                */
                <HomeProductCard key={product.id} product={product} index={i} />
              ))
          }
        </div>

        <div style={{ textAlign: 'center', marginTop: '44px' }}>
          <Link href="/shop" className="pdfp-shop-now">Shop Now</Link>
        </div>
      </div>

      <style>{`
        .pdfp-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }
        .pdfp-grid > * { min-width: 0; }

        @media (min-width: 750px) {
          .pdfp-grid { grid-template-columns: repeat(4, 1fr); gap: 20px; }
        }

        /* Clean square frame with edge-to-edge cover fit (no gaps) */
        .pdfp-grid .fc-card > a:first-child {
          width: 100%;
          aspect-ratio: 1 / 1;
          margin: 0 auto 14px;
        }
        .pdfp-grid .fc-card > a:first-child img {
          /* Previous contain/padding commented out as requested
          object-fit: contain !important;
          background-color: #fff;
          padding: 8px;
          */
          object-fit: cover !important;
          background-color: #fff;
          padding: 0 !important;
        }

        .pdfp-shop-now {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 12px 34px;
          font-size: 15px;
          font-weight: 500;
          color: #222;
          border: 1.5px solid #222;
          border-radius: 4px;
          text-decoration: none;
          transition: background-color 250ms ease, color 250ms ease;
        }
        .pdfp-shop-now:hover { background-color: #222; color: #fff; }
      `}</style>
    </section>
  );
}
