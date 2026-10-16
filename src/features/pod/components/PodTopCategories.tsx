'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';

/* Shop by categories — circular icon slider. Card design (circle, label)
   is POD's own, unchanged; the Swiper mechanics/nav-button behavior below
   are ported 1:1 from PCCategoriesSection.tsx (Phone Case) per spec:
   the 480/750/992/1200 breakpoint ladder with per-tier spaceBetween, the
   overflow:hidden-wrapper + overflow:'visible'-Swiper pattern, and
   always-visible (non-hover-gated) box-shadow nav buttons. */

function IconArrowLeftS({ size = 20 }: { size?: number }) {
  return (<svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}><path d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z" /></svg>);
}
function IconArrowRightS({ size = 20 }: { size?: number }) {
  return (<svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}><path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z" /></svg>);
}

/* Previous demo placeholder categories commented out as requested
const categories = [
  { id: 'pod-store', label: 'Pod Store', image: '/pod/shop-by-categories-slider/shop-by-categories-1.webp', href: '/shop' },
  { id: 'tshirt', label: 'T-shirt', image: '/pod/shop-by-categories-slider/shop-by-categories-2.webp', href: '/shop?category=Apparel' },
  { id: 'mugs', label: 'Mugs', image: '/pod/shop-by-categories-slider/shop-by-categories-3.webp', href: '/shop?category=Drinkware' },
  { id: 'printing', label: 'Printing stores', image: '/pod/shop-by-categories-slider/shop-by-categories-4.webp', href: '/shop?category=Wall Art' },
  { id: 'gaming', label: 'Gaming', image: '/pod/hero-slider/hero-slider-4.webp', href: '/shop?category=Accessories' },
  { id: 'pod-store-2', label: 'Pod Store', image: '/pod/shop-by-categories-slider/shop-by-categories-1.webp', href: '/shop' },
  { id: 'tshirt-2', label: 'T-shirt', image: '/pod/shop-by-categories-slider/shop-by-categories-2.webp', href: '/shop?category=Apparel' },
];
*/

// Real initial categories matching MongoDB store
const categories = [
  {
    id: 'smartphones',
    label: 'Smartphones',
    image: 'https://pub-a517fd63737142cbb39ca30df8bc77f0.r2.dev/products/1791966954507-a1a32f6c-039f-47ed-b048-da5814f55792.jpg',
    href: '/shop?category=Smartphones',
  },
  {
    id: 'audio-sound',
    label: 'Audio & Sound',
    image: 'https://pub-a517fd63737142cbb39ca30df8bc77f0.r2.dev/products/1791966952878-bf86ccc9-8a85-4464-9dd7-4ccc18cd9bd3.jpg',
    href: '/shop?category=Audio',
  },
  {
    id: 'television',
    label: 'Television & 4K',
    image: 'https://pub-a517fd63737142cbb39ca30df8bc77f0.r2.dev/products/1791966955598-c5cfe1ec-4be8-4894-a049-752829bb4baa.jpg',
    href: '/shop?category=Television',
  },
  {
    id: 'cookware',
    label: 'Cookware',
    image: 'https://pub-a517fd63737142cbb39ca30df8bc77f0.r2.dev/products/1791966958756-79b10052-9b26-4a0d-86ac-adf1fedb31c8.jpg',
    href: '/shop?category=Cookware',
  },
  {
    id: 'kitchen-appliances',
    label: 'Kitchen Appliances',
    image: 'https://pub-a517fd63737142cbb39ca30df8bc77f0.r2.dev/products/1791966956693-21e4ff56-b56f-410e-a935-fbc13f5407fe.jpg',
    href: '/shop?category=Kitchen%20Appliances',
  },
  {
    id: 'coffee-makers',
    label: 'Coffee Makers',
    image: 'https://pub-a517fd63737142cbb39ca30df8bc77f0.r2.dev/products/1791966957688-e551b2a0-ccf5-4bfd-b1ae-f9f8b3f3e72b.jpg',
    href: '/shop?category=Coffee%20Makers',
  },
  {
    id: 'footwear',
    label: 'Footwear',
    image: 'https://pub-a517fd63737142cbb39ca30df8bc77f0.r2.dev/products/1791966963823-3484f99a-4acb-4543-a98d-ab586e364b41.jpg',
    href: '/shop?category=Footwear',
  },
  {
    id: 'fitness-gear',
    label: 'Fitness & Gear',
    image: 'https://pub-a517fd63737142cbb39ca30df8bc77f0.r2.dev/products/1791966965028-371522e0-662b-4c34-a61f-a85048d26b73.jpg',
    href: '/shop?category=Fitness%20Trackers',
  },
];

export function PodTopCategories() {
  const swiperRef = useRef<SwiperType | null>(null);
  const [categoryItems, setCategoryItems] = useState(categories);

  // Fetch live categories from MongoDB
  useEffect(() => {
    let isMounted = true;
    fetch('/api/categories')
      .then((r) => r.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.categories && Array.isArray(data.categories) && data.categories.length > 0) {
          const liveCats = data.categories.map((c: any) => ({
            id: c.id,
            label: c.name,
            image: c.image || '/pod/shop-by-categories-slider/shop-by-categories-1.webp',
            href: `/shop?category=${encodeURIComponent(c.name)}`,
          }));
          const padded = liveCats.length < 6 ? [...liveCats, ...liveCats] : liveCats;
          setCategoryItems(padded);
        }
      })
      .catch((err) => console.error('Error fetching live categories from MongoDB:', err));

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="pdcat-section">
      <div className="container-main">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <h2 style={{ fontSize: 'clamp(22px, 3vw, 28px)', fontWeight: 600, color: '#222' }}>Shop by categories</h2>
          <Link
            href="/collections"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '16px', fontWeight: 500, color: '#222', textDecoration: 'underline', textUnderlineOffset: '3px', whiteSpace: 'nowrap' }}
          >
            View All Categories
            <IconArrowRightS size={22} />
          </Link>
        </div>

        <div className="pdcat-slider-outer">
          <div style={{ overflow: 'hidden', padding: '4px 0 8px' }}>
            <Swiper
              modules={[Navigation]}
              onSwiper={(s) => { swiperRef.current = s; }}
              slidesPerView={2}
              breakpoints={{
                480: { slidesPerView: 2, spaceBetween: 16 },
                750: { slidesPerView: 3, spaceBetween: 20 },
                992: { slidesPerView: 4, spaceBetween: 20 },
                1200: { slidesPerView: 5, spaceBetween: 24 },
              }}
              spaceBetween={14}
              loop
              speed={600}
              style={{ overflow: 'visible' }}
            >
              {/* Previous static categories mapping commented out as requested
              categories.map((cat) => (
              */}
              {categoryItems.map((cat, idx) => (
                <SwiperSlide key={`${cat.id}-${idx}`}>
                  <Link href={cat.href} className="pd-cat-item">
                    <div className="pd-cat-circle">
                      {/* Previous contain objectFit commented out as requested
                      <Image
                        src={cat.image}
                        alt={cat.label}
                        fill
                        className="pd-cat-img"
                        style={{ objectFit: 'contain' }}
                        sizes="272px"
                      />
                      */}
                      <Image
                        src={cat.image}
                        alt={cat.label}
                        fill
                        className="pd-cat-img"
                        style={{ objectFit: 'cover' }}
                        sizes="272px"
                      />
                    </div>
                    <span className="pd-cat-label">{cat.label}</span>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <button onClick={() => swiperRef.current?.slidePrev()} aria-label="Previous" className="pdcat-nav pdcat-nav-prev">
            <IconArrowLeftS size={20} />
          </button>
          <button onClick={() => swiperRef.current?.slideNext()} aria-label="Next" className="pdcat-nav pdcat-nav-next">
            <IconArrowRightS size={20} />
          </button>
        </div>
      </div>

      <style>{`
        .pd-cat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          text-decoration: none;
          gap: 12px;
        }
        .pd-cat-circle {
          position: relative;
          width: clamp(96px, 22vw, 272px);
          height: clamp(96px, 22vw, 272px);
          border-radius: 50%;
          overflow: hidden;
          background-color: #f0f0f0;
          margin: 0 auto;
        }
        .pd-cat-img { transition: transform 400ms ease; }
        .pd-cat-item:hover .pd-cat-img { transform: scale(1.08); }
        .pd-cat-label {
          font-size: clamp(13px, 1.2vw, 15px);
          font-weight: 500;
          color: #222;
        }

        /* ── Slider outer — ported from PCCategoriesSection.tsx ── */
        .pdcat-slider-outer {
          position: relative;
        }
        .pdcat-nav {
          position: absolute;
          top: 42%;
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
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          transition: background-color 250ms ease, border-color 250ms ease, color 250ms ease, box-shadow 250ms ease;
        }
        .pdcat-nav-prev { left: -22px; }
        .pdcat-nav-next { right: -22px; }
        .pdcat-nav:hover {
          background-color: #111;
          border-color: #111;
          color: #fff;
          box-shadow: 0 4px 14px rgba(0,0,0,0.15);
        }

        @media (max-width: 749px) {
          .pdcat-nav { display: none; }
        }
      `}</style>
    </section>
  );
}
