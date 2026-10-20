'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';

import testimonials from '@/data/testimonials.json';
import type { Testimonial } from '@/types/common';

const data = testimonials as Testimonial[];

/* ── Chat Quote Icon ── */

function ChatIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="52" height="46" viewBox="0 0 52.472 45.687" style={{ opacity: 0.11 }}>
      <path d="M105.2,149.979a16.71,16.71,0,0,0,3.8-15.4,18.87,18.87,0,0,0-8.881-11.694,25.79,25.79,0,0,0-17.343-3.676,23.55,23.55,0,0,0-15.238,7.706,16.673,16.673,0,0,0-4.108,15.7,40.137,40.137,0,0,1,1.547,7.124,15.559,15.559,0,0,1-1.727,8.677c-.228.414-.486.81-.744,1.229.1.036.15.066.192.06a26.1,26.1,0,0,0,11.034-3.862.865.865,0,0,1,.983-.132A26.582,26.582,0,0,0,91,157.853a23.243,23.243,0,0,0,14.194-7.874Zm9.5,13.924a8.286,8.286,0,0,1-.911-1.3,11.272,11.272,0,0,1-.354-9.049,12.317,12.317,0,0,0-.486-9.4c-.4-.846-.935-1.625-1.493-2.591-.108.408-.162.582-.2.762a18.517,18.517,0,0,1-2.968,7.076c-4.234,6.141-10.236,9.427-17.468,10.65-1.283.216-2.591.288-3.916.432a.579.579,0,0,0,.126.168c.33.216.648.438,1,.624a19.172,19.172,0,0,0,17.037.846,1.037,1.037,0,0,1,.8,0,18.573,18.573,0,0,0,6.033,2.291,11.879,11.879,0,0,0,2.519.246C115.079,164.647,115.115,164.419,114.7,163.9Z" transform="translate(-62.5 -118.975)" fill="currentColor" />
    </svg>
  );
}

/* ── Component ── */

const TOTAL_DOTS = 5;

interface TestimonialSectionProps {
  heading?: string;
  backgroundColor?: string;
  sectionPadding?: string;
}

export function TestimonialSection({
  heading = 'Testimonial',
  backgroundColor = 'rgb(247, 248, 252)',
  sectionPadding = '80px 0',
}: TestimonialSectionProps = {}) {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Exactly 5 dots, mapped evenly across the slide list.
  // Click dot i → jump to slide `Math.round(i * totalSlides / 5)`.
  // Active dot follows the current slide through the same inverse mapping.
  const total = data.length;
  const currentPage = Math.min(
    TOTAL_DOTS - 1,
    Math.floor((activeIndex * TOTAL_DOTS) / Math.max(1, total)),
  );

  const goToPage = (page: number) => {
    const target = Math.round((page * total) / TOTAL_DOTS);
    swiperInstance?.slideToLoop(Math.min(target, total - 1));
  };

  return (
    <section className="ts-section" style={{ backgroundColor, padding: sectionPadding }}>
      <div className="container-main">
        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 600, color: '#222' }}>{heading}</h2>
        </div>

        {/* Testimonials — Swiper with Left/Right Arrow Buttons */}
        <div className="ts-slider-outer" style={{ position: 'relative' }}>
          <Swiper
            modules={[Autoplay]}
            onSwiper={setSwiperInstance}
            onSlideChange={(s) => setActiveIndex(s.realIndex)}
            slidesPerView={1}
            slidesPerGroup={1}
            autoplay={{
              delay: 3200,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            breakpoints={{
              750: { slidesPerView: 2, slidesPerGroup: 1 },
              992: { slidesPerView: 3, slidesPerGroup: 1 },
            }}
            spaceBetween={24}
            loop
            speed={650}
            style={{ overflow: 'hidden' }}
          >
            {data.map((item, idx) => {
              const initials = item.name
                .trim()
                .split(/\s+/)
                .slice(0, 2)
                .map((w) => Array.from(w)[0] || '')
                .join('')
                .toUpperCase();
              const isPlaceholderAvatar = item.avatar.startsWith('/fashion/testimonials/');

              return (
              <SwiperSlide key={item.id} style={{ height: 'auto' }}>
                <div
                  className="ts-card"
                  style={{
                    backgroundColor: 'rgb(255, 255, 255)',
                    borderRadius: '12px',
                    padding: '36px 28px 28px',
                    textAlign: 'center',
                    position: 'relative',
                    minHeight: '390px',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 4px 20px rgba(11, 28, 61, 0.06)',
                    border: '1px solid #eef2f6',
                  }}
                >
                  {/* Avatar */}
                  <div
                    style={{
                      width: '82px',
                      height: '82px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      margin: '0 auto 18px',
                      border: '3px solid #e2e8f0',
                      position: 'relative',
                      background: idx % 2 === 0
                        ? 'linear-gradient(135deg, #0b1c3d 0%, #183e84 100%)'
                        : 'linear-gradient(135deg, #F15B41 0%, #d94a32 100%)',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      fontSize: '24px',
                      fontWeight: 700,
                      boxShadow: '0 6px 16px rgba(11, 28, 61, 0.14)',
                    }}
                  >
                    {/* Original template placeholder avatar commented out to avoid grey 75x75 box:
                    <Image
                      src={item.avatar}
                      alt={item.name}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="90px"
                    />
                    */}
                    {!isPlaceholderAvatar ? (
                      <Image
                        src={item.avatar}
                        alt={item.name}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="82px"
                      />
                    ) : (
                      <span>{initials}</span>
                    )}
                  </div>

                  {/* Name */}
                  <h4 style={{ fontSize: '19px', fontWeight: 700, color: '#0b1c3d', marginBottom: '6px', lineHeight: 1.35 }}>
                    {item.name}
                  </h4>

                  {/* Role */}
                  <p style={{ fontSize: '13.5px', fontWeight: 600, color: '#F15B41', marginBottom: '16px' }}>
                    {item.role}
                  </p>

                  {/* Description */}
                  <p style={{ fontSize: '15px', color: '#475569', lineHeight: '26px', flex: 1 }}>
                    &ldquo;{item.text}&rdquo;
                  </p>

                  {/* Rating stars centered + Chat icon bottom-right */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px' }}>
                    <div style={{ display: 'flex', gap: '4px', flex: 1, justifyContent: 'center' }}>
                      {Array.from({ length: 5 }).map((_, si) => (
                        <span
                          key={si}
                          style={{
                            fontSize: '22px',
                            color: si < item.rating ? '#F5C518' : '#ddd',
                          }}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <div style={{ color: '#ccc', flexShrink: 0 }}>
                      <ChatIcon />
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              );
            })}
          </Swiper>

          {/* Left & Right Arrow Buttons */}
          <button
            type="button"
            onClick={() => swiperInstance?.slidePrev()}
            aria-label="Previous testimonial"
            className="ts-nav ts-nav-prev"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width={20} height={20}>
              <path d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => swiperInstance?.slideNext()}
            aria-label="Next testimonial"
            className="ts-nav ts-nav-next"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width={20} height={20}>
              <path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z" />
            </svg>
          </button>
        </div>

        {/* Pagination dots — visuals preserved from the original design; always 5 dots */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '36px' }}>
          {Array.from({ length: TOTAL_DOTS }).map((_, i) => (
            <button
              key={i}
              onClick={() => goToPage(i)}
              aria-label={`Page ${i + 1}`}
              style={{
                width: currentPage === i ? '16px' : '10px',
                height: currentPage === i ? '16px' : '10px',
                borderRadius: '50%',
                border: currentPage === i ? '2px solid #222' : '2px solid #ccc',
                backgroundColor: 'transparent',
                padding: 0,
                cursor: 'pointer',
                transition: 'all 300ms ease',
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        .ts-nav {
          position: absolute;
          top: 50%;
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
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          transition: background-color 250ms ease, border-color 250ms ease, color 250ms ease, box-shadow 250ms ease;
        }
        .ts-nav-prev { left: -22px; }
        .ts-nav-next { right: -22px; }
        .ts-nav:hover {
          background-color: #111;
          border-color: #111;
          color: #fff;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
        }
        @media (max-width: 749px) {
          .ts-nav-prev { left: 4px; }
          .ts-nav-next { right: 4px; }
        }
      `}</style>
    </section>
  );
}
