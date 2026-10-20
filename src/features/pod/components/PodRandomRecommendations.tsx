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

export function PodRandomRecommendations() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchRandomProducts = () => {
    setIsLoading(true);
    /* Original fetch commented out:
    fetch('/api/recommendations/random?limit=4')
      .then((r) => r.json())
    */
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
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '40px',
            textAlign: 'center',
          }}
        >
          <h2 style={{ fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 600, color: '#222' }}>
            Recommended For You
          </h2>
          <p style={{ fontSize: '15px', color: '#666', marginTop: '6px' }}>
            Randomly picked gear and trending selections tailored to inspire
          </p>
        </div>

        <div className="pod-random-grid">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : products.map((product, i) => (
                /* Previous fixed imageHeight 350px commented out as requested
                <HomeProductCard key={product.id} product={product} index={i} imageHeight="350px" />
                */
                <HomeProductCard key={product.id} product={product} index={i} />
              ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px', display: 'flex', justifyContent: 'center', gap: '16px' }}>
          {/* Shuffle More Products button commented out as requested:
          <button
            type="button"
            onClick={fetchRandomProducts}
            className="pod-refresh-btn"
            style={{
              padding: '11px 26px',
              fontSize: '14px',
              fontWeight: 600,
              color: '#F15B41',
              backgroundColor: '#fff',
              border: '1.5px solid #F15B41',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'all 200ms ease',
            }}
          >
            ↻ Shuffle More Products
          </button>
          */}
          <Link
            href="/shop"
            style={{
              padding: '11px 26px',
              fontSize: '14px',
              fontWeight: 600,
              color: '#fff',
              backgroundColor: '#222',
              border: '1.5px solid #222',
              borderRadius: '4px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              transition: 'all 200ms ease',
            }}
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

        /* Clean square frame with edge-to-edge cover fit (no gaps) */
        .pod-random-grid .fc-card > a:first-child {
          width: 100%;
          aspect-ratio: 1 / 1;
          margin: 0 auto 14px;
        }
        .pod-random-grid .fc-card > a:first-child img {
          /* Previous contain/padding commented out as requested
          object-fit: contain !important;
          background-color: #fff;
          padding: 8px;
          */
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
