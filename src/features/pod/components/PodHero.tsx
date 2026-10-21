'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';

import { useProducts } from '@/features/products/hooks/useProducts';

function IconArrowLeftS({ size = 22 }: { size?: number }) {
  return (<svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}><path d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z" /></svg>);
}
function IconArrowRightS({ size = 22 }: { size?: number }) {
  return (<svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}><path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z" /></svg>);
}

const ambientSlidesMeta = [
  {
    bgGradient: 'linear-gradient(150deg, #e8ebf0 0%, #dce1e9 50%, #d0d7e3 100%)',
    badge: '🔥 #1 BEST SELLER',
    tagline: 'Most loved by our customers',
  },
  {
    bgGradient: 'linear-gradient(150deg, #e5e8ed 0%, #d7dce4 50%, #cad1dd 100%)',
    badge: '⭐ TOP TRENDING',
    tagline: 'Hot selling this week',
  },
  {
    bgGradient: 'linear-gradient(150deg, #e9ecf2 0%, #dde2eb 50%, #d2d9e4 100%)',
    badge: '✨ CUSTOMER FAVORITE',
    tagline: 'Handpicked top recommendation',
  },
  {
    bgGradient: 'linear-gradient(150deg, #e3e7ee 0%, #d5dbe4 50%, #c7cfdc 100%)',
    badge: '💥 POPULAR CHOICE',
    tagline: 'Fast moving customer pick',
  },
];

export function PodHero() {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const { data, isLoading } = useProducts({ sort: 'popular', limit: 6 });

  const rawProducts = data?.products && data.products.length > 0 ? data.products : null;

  const activeSlides = rawProducts
    ? rawProducts
        .slice(0, Math.max(4, Math.min(rawProducts.length, 6)))
        .map((p, i) => {
          const meta = ambientSlidesMeta[i % ambientSlidesMeta.length];
          const rawImg = p.images?.[0] as any;
          const imgSrc = (typeof rawImg === 'string' ? rawImg : rawImg?.src) || '';
          return {
            id: p.id || `prod-${i}`,
            name: p.name,
            slug: p.slug,
            price: p.price,
            compareAtPrice: p.compareAtPrice ?? null,
            image: imgSrc,
            badge: meta.badge,
            tagline: meta.tagline,
            bgGradient: meta.bgGradient,
          };
        })
        .filter((s) => Boolean(s.image))
    : [];

  return (
    <section className="pdhero-section">

      <div className="container-main">
        <div className="pdhero-wrapper">
          {isLoading || activeSlides.length === 0 ? (
            <div className="pdhero-skeleton-grid">
              {[0, 1, 2].map((idx) => (
                <div key={idx} className="pdhero-skeleton-card">
                  <div className="pdhero-skeleton-shimmer" />
                  <div className="pdhero-skeleton-content">
                    <div className="pdhero-skeleton-line short" />
                    <div className="pdhero-skeleton-line title" />
                    <div className="pdhero-skeleton-line btn" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <Swiper
                modules={[Autoplay]}
                onSwiper={setSwiper}
                slidesPerView={1}
                spaceBetween={12}
                breakpoints={{
                  750: { slidesPerView: 2, spaceBetween: 12 },
                  992: { slidesPerView: 3, spaceBetween: 14 },
                }}
                loop
                speed={700}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
              >
            {activeSlides.map((slide, i) => (
              <SwiperSlide key={slide.id}>
                <div
                  className="pdhero-slide"
                  style={{ background: slide.bgGradient }}
                >

                  <div className="pdhero-stage">
                    <Link
                      href={slide.slug && slide.slug !== 'shop' ? `/products/${slide.slug}` : '/shop'}
                      className="pdhero-stage-link"
                    >
                      <Image
                        src={slide.image}
                        alt={slide.name}
                        fill
                        sizes="(max-width: 749px) 100vw, (max-width: 991px) 50vw, 33vw"
                        priority={i < 3}
                        className="pdhero-img object-contain"
                      />
                    </Link>
                  </div>

                  <div className="pdhero-overlay" />

                  <div className="pdhero-content">
                    <span className="pdhero-tagline">{slide.tagline}</span>
                    <h2 className="pdhero-title" title={slide.name}>
                      {slide.name}
                    </h2>
                    <Link
                      href={slide.slug && slide.slug !== 'shop' ? `/products/${slide.slug}` : '/shop'}
                      className="pdhero-btn"
                    >
                      Shop Now
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

              <button onClick={() => swiper?.slidePrev()} aria-label="Previous slide" className="pdhero-nav pdhero-nav-prev">
                <IconArrowLeftS size={22} />
              </button>
              <button onClick={() => swiper?.slideNext()} aria-label="Next slide" className="pdhero-nav pdhero-nav-next">
                <IconArrowRightS size={22} />
              </button>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes pdheroShimmerAnim {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .pdhero-skeleton-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
          width: 100%;
        }
        @media (min-width: 750px) {
          .pdhero-skeleton-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
        }
        @media (min-width: 992px) {
          .pdhero-skeleton-grid { grid-template-columns: repeat(3, 1fr); gap: 14px; }
        }
        .pdhero-skeleton-card {
          position: relative;
          width: 100%;
          height: 680px;
          min-height: 680px;
          border-radius: 16px;
          background: linear-gradient(150deg, #e8ebf0 0%, #dce1e9 50%, #d0d7e3 100%);
          overflow: hidden;
        }
        .pdhero-skeleton-shimmer {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.45) 50%, transparent 100%);
          animation: pdheroShimmerAnim 1.8s infinite;
        }
        .pdhero-skeleton-content {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 32px 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          z-index: 2;
        }
        .pdhero-skeleton-line {
          background: rgba(255, 255, 255, 0.55);
          border-radius: 6px;
        }
        .pdhero-skeleton-line.short { width: 45%; height: 13px; }
        .pdhero-skeleton-line.title { width: 85%; height: 26px; border-radius: 8px; }
        .pdhero-skeleton-line.btn { width: 130px; height: 44px; border-radius: 30px; margin-top: 8px; }

        .pdhero-section {
          position: relative;
          width: 100%;
          overflow: hidden;
        }
        .pdhero-wrapper {
          position: relative;
          width: 100%;
        }
        .pdhero-slide {
          position: relative;
          width: 100%;
          height: 680px !important;
          min-height: 680px !important;
          border-radius: 16px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform 500ms ease;
        }

        
        .pdhero-badge-wrap {
          position: absolute;
          top: 22px;
          left: 22px;
          z-index: 5;
        }
        .pdhero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(8px);
          color: #111;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 6px 14px;
          border-radius: 999px;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.85);
        }

        
        .pdhero-stage {
          position: absolute;
          inset: 0;
          padding: 34px 24px 190px;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pdhero-stage-link {
          position: relative !important;
          display: block !important;
          width: 100% !important;
          height: 100% !important;
        }
        .pdhero-img {
          transition: transform 650ms cubic-bezier(0.16, 1, 0.3, 1), filter 400ms ease !important;
          filter: drop-shadow(0 18px 28px rgba(0, 0, 0, 0.12));
        }
        .pdhero-slide:hover .pdhero-img {
          transform: scale(1.06) translateY(-4px);
        }

        
        .pdhero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(11, 26, 56, 0) 54%, rgba(11, 26, 56, 0.45) 76%, rgba(11, 26, 56, 0.88) 100%);
          z-index: 3;
          pointer-events: none;
        }

        .pdhero-content {
          position: absolute;
          left: 0;
          right: 0;
          bottom: clamp(24px, 3.8vw, 36px);
          z-index: 4;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 0 20px;
          text-align: center;
        }
        .pdhero-tagline {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: rgba(255, 255, 255, 0.9);
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
        }
        .pdhero-title {
          color: #fff;
          font-size: clamp(18px, 2vw, 24px);
          font-weight: 700;
          line-height: 1.25;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.6);
          max-width: 90%;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin: 0;
        }
        .pdhero-price {
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 2px;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
        }
        .pdhero-price-sale {
          color: #ffd27a;
          font-weight: 700;
        }
        .pdhero-price-orig {
          text-decoration: line-through;
          opacity: 0.7;
          font-size: 12px;
        }
        .pdhero-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background-color: #fff;
          color: #111;
          font-size: 13.5px;
          font-weight: 600;
          padding: 10px 32px;
          border-radius: 4px;
          text-decoration: none;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.18);
          transition: background-color 250ms ease, color 250ms ease, transform 250ms ease, box-shadow 250ms ease;
        }
        .pdhero-btn:hover {
          background-color: #111;
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
        }

        .pdhero-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          width: 46px;
          height: 46px;
          border-radius: 50%;
          border: none;
          background-color: #fff;
          color: #222;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.12);
          transition: background-color 250ms ease, color 250ms ease, transform 250ms ease;
        }
        .pdhero-nav-prev { left: 16px; }
        .pdhero-nav-next { right: 16px; }
        .pdhero-nav:hover { background-color: #111; color: #fff; transform: translateY(-50%) scale(1.05); }

        @media (max-width: 749px) {
          .pdhero-slide { height: 490px !important; min-height: 490px !important; }
          .pdhero-stage { padding: 36px 16px 180px; }
          .pdhero-nav { width: 28px; height: 28px; }
          .pdhero-nav svg { width: 15px; height: 15px; }
          .pdhero-nav-prev { left: 6px; }
          .pdhero-nav-next { right: 6px; }
        }
      `}</style>
    </section>
  );
}
