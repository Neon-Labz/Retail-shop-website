'use client';

import { useState, useEffect } from 'react';
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
    <svg xmlns="http://www.w3.org/2000/svg" width="52" height="46" viewBox="0 0 52.472 45.687" className="opacity-[0.11]">
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
  const [testimonialsList, setTestimonialsList] = useState<Testimonial[]>(data);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/reviews?limit=10')
      .then((r) => r.json())
      .then((res) => {
        if (!isMounted) return;
        if (res.success && Array.isArray(res.reviews) && res.reviews.length > 0) {
          const mapped: Testimonial[] = res.reviews.map((r: any, idx: number) => ({
            id: r.id || `rev-${idx}`,
            name: r.author || 'Verified Buyer',
            role: r.productName ? `Reviewed: ${r.productName}` : 'Verified Customer',
            avatar: r.avatar || '',
            rating: r.rating || 5,
            text: r.body || r.title || 'Excellent product and quality!',
          }));
          const padded = mapped.length < 3 ? [...mapped, ...mapped, ...mapped].slice(0, 6) : mapped;
          setTestimonialsList(padded);
        }
      })
      .catch((err) => console.error('Error fetching testimonials from reviews API:', err));

    return () => {
      isMounted = false;
    };
  }, []);

  // Exactly 5 dots, mapped evenly across the slide list.
  // Click dot i → jump to slide `Math.round(i * totalSlides / 5)`.
  // Active dot follows the current slide through the same inverse mapping.
  const total = testimonialsList.length;
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
        <div className="text-center mb-[48px]">
          <h2 className="text-[36px] font-semibold text-[#222]">{heading}</h2>
        </div>

        {/* Testimonials — Swiper with Left/Right Arrow Buttons */}
        <div className="ts-slider-outer relative">
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
            className="overflow-hidden"
          >
            {testimonialsList.map((item, idx) => {
              const initials = item.name
                .trim()
                .split(/\s+/)
                .slice(0, 2)
                .map((w) => Array.from(w)[0] || '')
                .join('')
                .toUpperCase() || 'RK';
              const isPlaceholderAvatar = !item.avatar || item.avatar.startsWith('/fashion/testimonials/');
              const shortText =
                item.text.length > 100
                  ? `${item.text.slice(0, 100).trim()}...`
                  : item.text;

              return (
              <SwiperSlide key={item.id} className="!h-auto">
                <div className="ts-card bg-[rgb(255,255,255)] rounded-[12px] pt-[22px] px-[22px] pb-[18px] text-center relative h-[248px] min-h-[248px] max-h-[248px] w-full flex flex-col items-center justify-start shadow-[0_4px_20px_rgba(11,28,61,0.06)] border border-solid border-[#eef2f6] overflow-hidden">
                  {/* Top & Middle Content */}
                  <div className="w-full flex flex-col items-center">
                    {/* Avatar */}
                    <div
                      className={`w-[62px] h-[62px] rounded-full overflow-hidden mx-auto mb-[10px] border-[3px] border-solid border-[#e2e8f0] relative shrink-0 flex items-center justify-center text-[#ffffff] text-[18px] font-bold shadow-[0_6px_16px_rgba(11,28,61,0.14)] ${
                        idx % 2 === 0
                          ? 'bg-[linear-gradient(135deg,#0b1c3d_0%,#183e84_100%)]'
                          : 'bg-[linear-gradient(135deg,#F15B41_0%,#d94a32_100%)]'
                      }`}
                    >
                      {!isPlaceholderAvatar ? (
                        <Image
                          src={item.avatar}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="62px"
                        />
                      ) : (
                        <span>{initials}</span>
                      )}
                    </div>

                    {/* Name */}
                    <h4
                      title={item.name}
                      className="text-[16px] font-bold text-[#0b1c3d] mb-[2px] leading-[1.3] whitespace-nowrap overflow-hidden text-ellipsis max-w-full"
                    >
                      {item.name}
                    </h4>

                    {/* Role */}
                    <p
                      title={item.role}
                      className="text-[12.5px] font-semibold text-[#F15B41] mb-[10px] whitespace-nowrap overflow-hidden text-ellipsis max-w-full"
                    >
                      {item.role}
                    </p>

                    {/* Description (strictly limited to 100 chars, no flex:1 gap) */}
                    <p
                      title={item.text}
                      className="text-[13.5px] text-[#475569] leading-[20px] m-0 line-clamp-3 overflow-hidden text-ellipsis max-w-full"
                    >
                      &ldquo;{shortText}&rdquo;
                    </p>
                  </div>

                  {/* Rating stars 100% centered on the card's center axis + Chat icon absolute bottom-right */}
                  <div className="w-full flex items-center justify-center mt-[10px] shrink-0">
                    <div className="flex gap-[3px] justify-center">
                      {Array.from({ length: 5 }).map((_, si) => (
                        <span
                          key={si}
                          className={`text-[18px] leading-none ${si < item.rating ? 'text-[#F5C518]' : 'text-[#ddd]'}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="absolute right-[18px] bottom-[12px] text-[#ccc] pointer-events-none">
                    <ChatIcon />
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

        <div className="flex items-center justify-center gap-[12px] mt-[18px]">
          {Array.from({ length: TOTAL_DOTS }).map((_, i) => (
            <button
              key={i}
              onClick={() => goToPage(i)}
              aria-label={`Page ${i + 1}`}
              className={`rounded-full border-[2px] border-solid bg-transparent p-0 cursor-pointer transition-all duration-300 ease-in-out ${
                currentPage === i
                  ? 'w-[16px] h-[16px] border-[#222]'
                  : 'w-[10px] h-[10px] border-[#ccc]'
              }`}
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
          .ts-nav {
            width: 28px;
            height: 28px;
          }
          .ts-nav svg {
            width: 15px;
            height: 15px;
          }
          .ts-nav-prev { left: 4px; }
          .ts-nav-next { right: 4px; }
        }
      `}</style>
    </section>
  );
}
