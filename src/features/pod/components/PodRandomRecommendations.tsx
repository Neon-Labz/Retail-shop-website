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

export function PodRandomRecommendations() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchRandomProducts = () => {
    setIsLoading(true);
    fetch('/api/recommendations/random?limit=4')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        if (data.success && Array.isArray(data.products)) {
          setProducts(data.products);
        }
      })
      .catch((err) => {
        console.error('Error fetching random recommendations:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchRandomProducts();
  }, []);

  return (
    <section className="pod-random-recommendations-section">
      <div className="container-main">
        <div className="flex flex-col items-start mb-[32px] text-left">
          <h2 className="text-[clamp(22px,3vw,28px)] font-semibold text-[#222]">
            Recommended For You
          </h2>
          <p className="text-[15px] text-[#666] mt-[6px]">
            Randomly picked gear and trending selections tailored to inspire
          </p>
        </div>

        <div className="pod-random-grid">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : products.map((product, i) => (
                <HomeProductCard key={product.id} product={product} index={i} />
              ))}
        </div>

        <div className="text-center mt-[40px] flex justify-center gap-[16px]">
          <Link
            href="/products"
            className="py-[11px] px-[26px] text-[14px] font-semibold text-[#fff] bg-[#222] border-[1.5px] border-solid border-[#222] rounded-[4px] no-underline inline-flex items-center transition-all duration-200 ease-in-out"
          >
            Explore All Products
          </Link>
        </div>
      </div>

      <style>{`
        .pod-random-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }
        .pod-random-grid > * { min-width: 0; }

        @media (min-width: 750px) {
          .pod-random-grid { grid-template-columns: repeat(4, 1fr); gap: 20px; }
        }

        
        .pod-random-grid .fc-card > a:first-child {
          width: 100%;
          aspect-ratio: 1 / 1;
          margin: 0 auto 14px;
        }
        .pod-random-grid .fc-card > a:first-child img {
          object-fit: cover !important;
          background-color: #fff;
          padding: 0 !important;
        }

        .pod-refresh-btn:hover {
          background-color: #F15B41 !important;
          color: #fff !important;
        }
      `}</style>
    </section>
  );
}

export default PodRandomRecommendations;
