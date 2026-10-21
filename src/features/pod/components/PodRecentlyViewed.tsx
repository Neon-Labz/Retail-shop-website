'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { HomeProductCard } from '@/features/home/components/HomeProductCard';
import type { Product } from '@/types/product';

function ProductCardSkeleton() {
  return (
    <div>
      <div className="animate-shimmer aspect-[3/4] rounded-[4px] mb-[14px]" />
      <div className="animate-shimmer h-[16px] w-[70%] mx-auto mb-[8px] rounded-[4px]" />
      <div className="animate-shimmer h-[14px] w-[40%] mx-auto mb-[8px] rounded-[4px]" />
    </div>
  );
}

export function PodRecentlyViewed() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/recommendations/recently-viewed?limit=4')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
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

  if (!isLoading && products.length === 0) {
    return null;
  }

  return (
    <section className="pod-recently-viewed-section">
      <div className="container-main">
        <div className="mb-[32px] text-left">
          <h2 className="text-[clamp(22px,3vw,28px)] font-semibold text-[#222]">
            Recently Viewed Products
          </h2>
          <p className="text-[15px] text-[#666] mt-[6px]">
            Products you recently browsed and checked out
          </p>
        </div>

        <div className="pod-rv-grid">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : products.map((product, i) => (
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

        
        .pod-rv-grid .fc-card > a:first-child {
          width: 100%;
          aspect-ratio: 1 / 1;
          margin: 0 auto 14px;
        }
        .pod-rv-grid .fc-card > a:first-child img {
          object-fit: cover !important;
          background-color: #fff;
          padding: 0 !important;
        }
      `}</style>
    </section>
  );
}

export default PodRecentlyViewed;
