'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { useProducts } from '@/features/products/hooks/useProducts';
import { HomeProductCard } from '@/features/home/components/HomeProductCard';

import 'swiper/css';

function IconArrowLeftS({ size = 20 }: { size?: number }) {
  return (<svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}><path d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z" /></svg>);
}
function IconArrowRightS({ size = 20 }: { size?: number }) {
  return (<svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}><path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z" /></svg>);
}

function ProductCardSkeleton() {
  return (
    <div>
      <div className="animate-shimmer aspect-[3/4] rounded-[4px] mb-[14px]" />
      <div className="animate-shimmer h-[16px] w-[70%] mx-auto mb-[8px] rounded-[4px]" />
      <div className="animate-shimmer h-[14px] w-[40%] mx-auto mb-[8px] rounded-[4px]" />
    </div>
  );
}

export function PodNewArrivals() {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const { data, isLoading } = useProducts({ limit: 8, page: 2 }, { endpoint: '/api/pod-products' });

  const products = data?.products.slice(0, 8) || [];

  return (
    <section className="pdna-section">
      <div className="container-main">
        <div className="flex items-center justify-between mb-[32px]">
          <h2 className="text-[clamp(22px,3vw,28px)] font-semibold text-[#222]">New Arrivals</h2>
          <Link
            href="/shop?sort=newest"
            className="text-[14px] font-medium text-[#222] underline underline-offset-[3px] whitespace-nowrap"
          >
            View All →
          </Link>
        </div>

        <div className="relative">
          {isLoading ? (
            <div className="pdna-grid">
              {Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : (
            <Swiper
              modules={[Navigation]}
              onSwiper={setSwiperInstance}
              slidesPerView={2}
              breakpoints={{
                750: { slidesPerView: 3 },
                992: { slidesPerView: 4 },
              }}
              spaceBetween={20}
              loop
              speed={600}
              className="overflow-hidden"
            >
              {products.map((product, i) => (
                <SwiperSlide key={product.id}>
                  <HomeProductCard product={product} index={i} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}

          <button onClick={() => swiperInstance?.slidePrev()} aria-label="Previous" className="pdna-nav-prev">
            <IconArrowLeftS size={20} />
          </button>
          <button onClick={() => swiperInstance?.slideNext()} aria-label="Next" className="pdna-nav-next">
            <IconArrowRightS size={20} />
          </button>
        </div>
      </div>

      <style>{`
        .pdna-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }
        .pdna-grid > * { min-width: 0; }
        @media (min-width: 750px) {
          .pdna-grid { grid-template-columns: repeat(4, 1fr); gap: 20px; }
        }

        
        .pdna-section .fc-card > a:first-child {
          width: 100%;
          aspect-ratio: 1 / 1;
          margin: 0 auto 14px;
        }
        .pdna-section .fc-card > a:first-child img {
          object-fit: cover !important;
          background-color: #fff;
          padding: 0 !important;
        }

        .pdna-nav-prev, .pdna-nav-next {
          position: absolute;
          top: 40%;
          transform: translateY(-50%);
          z-index: 10;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1.5px solid #e0e0e0;
          background-color: #fff;
          color: #222;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 400ms ease, transform 400ms ease, background-color 250ms ease, border-color 250ms ease, color 250ms ease;
        }
        .pdna-nav-prev { left: -8px; }
        .pdna-nav-next { right: -8px; }
        .pdna-section:hover .pdna-nav-prev,
        .pdna-section:hover .pdna-nav-next { opacity: 1; }
        .pdna-nav-prev:hover, .pdna-nav-next:hover { background-color: #000; border-color: #000; color: #fff; }

        @media (max-width: 749px) {
          .pdna-nav-prev, .pdna-nav-next { display: none; }
        }
      `}</style>
    </section>
  );
}
