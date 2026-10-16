'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { HomeProductCard } from '@/features/home/components/HomeProductCard';
import type { Product } from '@/types/product';

function ProductCardSkeleton() {
  return (
    <div>
      <div className="animate-shimmer" style={{ aspectRatio: '3 / 4', borderRadius: '4px', marginBottom: '14px' }} />
      <div className="animate-shimmer" style={{ height: '16px', width: '70%', margin: '0 auto 8px', borderRadius: '4px' }} />
      <div className="animate-shimmer" style={{ height: '14px', width: '40%', margin: '0 auto 8px', borderRadius: '4px' }} />
    </div>
  );
}

export function PodRecentlyViewed() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/recommendations/recently-viewed?limit=4')
      .then((r) => r.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.success && Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products);
        }
      })
      .catch((err) => {
        console.error('Error fetching recently viewed products:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // If not loading and no products found, do not take up space
  if (!isLoading && products.length === 0) {
    return null;
  }

  return (
    <section className="pod-recently-viewed-section">
      <div className="container-main">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 600, color: '#222' }}>
            Recently Viewed Products
          </h2>
          <p style={{ fontSize: '15px', color: '#666', marginTop: '6px' }}>
            Products you recently browsed and checked out
          </p>
        </div>

        <div className="pod-rv-grid">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : products.map((product, i) => (
                /* Previous fixed imageHeight 350px commented out as requested
                <HomeProductCard key={product.id} product={product} index={i} imageHeight="350px" />
                */
                <HomeProductCard key={product.id} product={product} index={i} />
              ))}
        </div>
      </div>

      <style>{`
        .pod-rv-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }
        .pod-rv-grid > * { min-width: 0; }

        @media (min-width: 750px) {
          .pod-rv-grid { grid-template-columns: repeat(4, 1fr); gap: 20px; }
        }

        /* Clean square frame with edge-to-edge cover fit (no gaps) */
        .pod-rv-grid .fc-card > a:first-child {
          width: 100%;
          aspect-ratio: 1 / 1;
          margin: 0 auto 14px;
        }
        .pod-rv-grid .fc-card > a:first-child img {
          /* Previous contain/padding commented out as requested
          object-fit: contain !important;
          background-color: #fff;
          padding: 8px;
          */
          object-fit: cover !important;
          background-color: #fff;
          padding: 0 !important;
        }
      `}</style>
    </section>
  );
}

export default PodRecentlyViewed;
