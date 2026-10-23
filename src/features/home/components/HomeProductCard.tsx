'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/utils/formatPrice';
import { useUIStore } from '@/store/uiStore';
import { useCompareStore } from '@/store/compareStore';
import { useWishlistStore } from '@/store/wishlistStore';
import type { Product } from '@/types/product';

function IconHeart({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M12.001 4.52853C14.35 2.42 17.98 2.49 20.2426 4.75736C22.5053 7.02472 22.583 10.637 20.4786 12.993L11.9999 21.485L3.52138 12.993C1.41705 10.637 1.49571 7.01901 3.75736 4.75736C6.02157 2.49315 9.64519 2.41687 12.001 4.52853ZM18.827 6.1701C17.3279 4.66794 14.9076 4.60701 13.337 6.01687L12.0019 7.21524L10.6661 6.01781C9.09098 4.60597 6.67506 4.66808 5.17157 6.17157C3.68183 7.66131 3.60704 10.0473 4.97993 11.6232L11.9999 18.6543L19.0201 11.6232C20.3935 10.0467 20.319 7.66525 18.827 6.1701Z" />
    </svg>
  );
}

function IconCompare({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth="1.7" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <polyline points="15 4 19 4 19 8" />
      <line x1="14.75" y1="9.25" x2="19" y2="4" />
      <line x1="5" y1="19" x2="9" y2="15" />
      <polyline points="15 19 19 19 19 15" />
      <line x1="5" y1="5" x2="19" y2="19" />
    </svg>
  );
}

function IconEye({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M12.0003 3C17.3924 3 21.8784 6.87976 22.8189 12C21.8784 17.1202 17.3924 21 12.0003 21C6.60812 21 2.12215 17.1202 1.18164 12C2.12215 6.87976 6.60812 3 12.0003 3ZM12.0003 19C16.2359 19 19.8603 16.052 20.7777 12C19.8603 7.94803 16.2359 5 12.0003 5C7.7646 5 4.14022 7.94803 3.22278 12C4.14022 16.052 7.7646 19 12.0003 19ZM12.0003 16.5C9.51498 16.5 7.50026 14.4853 7.50026 12C7.50026 9.51472 9.51498 7.5 12.0003 7.5C14.4855 7.5 16.5003 9.51472 16.5003 12C16.5003 14.4853 14.4855 16.5 12.0003 16.5ZM12.0003 14.5C13.381 14.5 14.5003 13.3807 14.5003 12C14.5003 10.6193 13.381 9.5 12.0003 9.5C10.6196 9.5 9.50026 10.6193 9.50026 12C9.50026 13.3807 10.6196 14.5 12.0003 14.5Z" />
    </svg>
  );
}

function IconBag({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M9 6H15C15 4.34315 13.6569 3 12 3C10.3431 3 9 4.34315 9 6ZM7 6C7 3.23858 9.23858 1 12 1C14.7614 1 17 3.23858 17 6H20C20.5523 6 21 6.44772 21 7V21C21 21.5523 20.5523 22 20 22H4C3.44772 22 3 21.5523 3 21V7C3 6.44772 3.44772 6 4 6H7ZM5 8V20H19V8H5ZM9 10C9 11.6569 10.3431 13 12 13C13.6569 13 15 11.6569 15 10H17C17 12.7614 14.7614 15 12 15C9.23858 15 7 12.7614 7 10H9Z" />
    </svg>
  );
}

interface CountdownTimerProps {
  backgroundColor?: string;
}

export function CountdownTimer({ backgroundColor = '#000' }: CountdownTimerProps = {}) {
  const [time, setTime] = useState({ days: 0, hrs: 0, min: 0, sec: 0 });

  useEffect(() => {
    const target = new Date('2027-10-04T12:00:00Z').getTime();
    const update = () => {
      const diff = Math.max(0, target - Date.now());
      setTime({
        days: Math.floor(diff / 86400000),
        hrs: Math.floor((diff % 86400000) / 3600000),
        min: Math.floor((diff % 3600000) / 60000),
        sec: Math.floor((diff % 60000) / 1000),
      });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="fc-countdown flex gap-[5px]">
      {[
        { val: time.days, label: 'Days' },
        { val: time.hrs, label: 'Hrs' },
        { val: time.min, label: 'Min' },
        { val: time.sec, label: 'Sec' },
      ].map((t) => (
        <div key={t.label} className="fc-countdown-cell text-[#fff] rounded-[4px] py-[6px] px-[10px] text-center min-w-[42px]" style={{ backgroundColor }}>
          <div className="fc-countdown-val text-[16px] font-bold leading-[1.3]">{t.val}</div>
          <div className="fc-countdown-lbl text-[11px] font-normal leading-[1.3] opacity-85">{t.label}</div>
        </div>
      ))}
    </div>
  );
}

export function ScrollingText() {
  return (
    <div className="overflow-hidden bg-[#000] py-[10px] px-0 w-full">
      <div className="animate-marquee flex whitespace-nowrap">
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} className="text-[14px] text-[#fff] font-medium mr-[40px] inline-flex items-center gap-[6px]">
            <span className="text-[16px]">★</span> HOT SALE ITEM &nbsp;&nbsp; <span className="text-[16px]">★</span> UP TO 50% OFF &nbsp;&nbsp;
          </span>
        ))}
      </div>
    </div>
  );
}

interface ProductCardProps {
  product: Product;
  index: number;
  hrefBase?: string;
  showCountdown?: boolean;
  showScrollText?: boolean;
  imageHeight?: string;
  themeColor?: string;
  countdownBg?: string;
  compact?: boolean;
}

export function HomeProductCard({
  product,
  index,
  hrefBase = '/products',
  showCountdown,
  showScrollText,
  imageHeight,
  themeColor,
  countdownBg,
  compact = false,
}: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);

  const { openQuickView } = useUIStore();
  const { toggleItem: toggleCompare, isInCompare } = useCompareStore();
  const { toggleItem: toggleWishlist, isInWishlist } = useWishlistStore();
  const inCompare = isInCompare(product.id);
  const inWishlist = isInWishlist(product.id);
  const defaultImg1 = product.images[0]?.src || '';
  const defaultImg2 = product.images[1]?.src || defaultImg1;
  const hasCountdown = showCountdown ?? false;
  const hasScrollText = showScrollText ?? false;
  const productHref = `${hrefBase}/${product.slug}`;
  const discount = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const colorImages = product.colors.reduce<Record<string, string>>((acc, c) => {
    const variant = product.variants.find(v => v.color === c.name);
    if (variant) acc[c.name] = variant.image;
    return acc;
  }, {});
  const activeColorImage = hoveredColor ? colorImages[hoveredColor] : null;

  const nameColor = themeColor ?? '#222';
  const priceColor = themeColor ?? `var(--color-product-price, ${product.compareAtPrice ? '#F15B41' : '#222'})`;
  const chipColor = themeColor ?? '#F15B41';
  const tooltipBg = themeColor ?? '#222';

  return (
    <div
      className={`fc-card relative w-full min-w-0 max-w-full${compact ? ' fc-card--compact' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setHoveredColor(null); }}
      style={{ ['--fc-tooltip-bg' as string]: tooltipBg }}
    >
      <Link
        href={productHref}
        className={`fc-card-img-link block relative overflow-hidden bg-[#eef2f6] rounded-[8px] border border-solid border-[#ededf0] mb-[14px] shadow-[0_8px_16px_-2px_rgba(24,62,132,0.12),4px_6px_10px_-2px_rgba(24,62,132,0.04),-4px_6px_10px_-2px_rgba(24,62,132,0.04)]${imageHeight ? '' : ' aspect-square'}`}
        style={imageHeight ? { height: imageHeight } : undefined}
      >
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Image
            src={defaultImg1}
            alt={product.name}
            fill
            className={`object-contain object-center transition-[opacity,transform] duration-500 ease-out ${hovered ? 'scale-108' : 'scale-100'} ${activeColorImage ? 'opacity-0' : 'opacity-100'}`}
            sizes="(max-width: 749px) 50vw, 25vw"
          />

          {Object.entries(colorImages).map(([colorName, imgSrc]) => (
            <Image
              key={colorName}
              src={imgSrc}
              alt={`${product.name} ${colorName}`}
              fill
              className={`object-contain object-center transition-[opacity,transform] duration-500 ease-out ${hovered ? 'scale-108' : 'scale-100'} ${
                hoveredColor === colorName ? 'opacity-100 z-[2]' : 'opacity-0 z-[1]'
              }`}
              sizes="(max-width: 749px) 50vw, 25vw"
            />
          ))}
        </div>

        {product.badge && (
          <span
            className={`absolute top-[12px] left-[12px] text-[#fff] text-[12px] font-semibold py-[4px] px-[12px] rounded-[3px] z-[3] capitalize ${
              product.badge === 'new' ? 'bg-[#222]' : 'bg-[#F15B41]'
            }`}
          >
            {product.badge}
          </span>
        )}

        <div
          className={`fc-actions-overlay absolute top-[12px] right-[12px] flex flex-col gap-[8px] z-[3] transition-[opacity,transform] duration-300 ease-in-out ${
            hovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[10px]'
          }`}
        >
          <div className="fc-tooltip-wrap relative">
            <button aria-label="Wishlist" className={`fc-action-btn ${inWishlist ? 'fc-action-btn-dark' : 'fc-action-btn-light'}`} onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist({ productId: product.id, name: product.name, price: product.price, compareAtPrice: product.compareAtPrice, image: defaultImg1, image2: defaultImg2, slug: product.slug, badge: product.badge, colors: product.colors.map(c => ({ name: c.name, value: c.value })), vendor: product.vendor }); }}>
              <IconHeart size={18} />
            </button>
            <span className="fc-tooltip">{inWishlist ? 'Already Wishlisted' : 'Wishlist'}</span>
          </div>
          <div className="fc-tooltip-wrap fc-quickview-wrap relative">
            <button aria-label="Quick view" className="fc-action-btn fc-action-btn-light" onClick={(e) => { e.preventDefault(); e.stopPropagation(); openQuickView(product); }}><IconEye size={18} /></button>
            <span className="fc-tooltip">Quick view</span>
          </div>
          <div className="fc-tooltip-wrap fc-quickadd-wrap relative">
            <button aria-label="Quick Add" className="fc-action-btn fc-action-btn-light" onClick={(e) => { e.preventDefault(); e.stopPropagation(); openQuickView(product); }}><IconBag size={18} /></button>
            <span className="fc-tooltip">Quick Add</span>
          </div>
        </div>

        {hasCountdown && (
          <div
            className={`absolute bottom-[14px] left-1/2 -translate-x-1/2 z-[3] transition-opacity duration-300 ease-in-out ${
              hovered ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
            }`}
          >
            <CountdownTimer backgroundColor={countdownBg} />
          </div>
        )}

        {hasScrollText && (
          <div
            className={`absolute bottom-0 left-0 right-0 z-[3] transition-opacity duration-300 ease-in-out ${
              hovered ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
            }`}
          >
            <ScrollingText />
          </div>
        )}

      </Link>

      <div className="text-center min-w-0 w-full overflow-hidden">
        <div className="fc-product-title-wrap relative w-full min-w-0">
          <Link
            href={productHref}
            title={product.name}
            className="fc-product-title-link line-clamp-1 text-[clamp(12.5px,1.25vw,13.5px)] font-medium no-underline transition-colors duration-150 ease-in-out bg-transparent overflow-hidden text-ellipsis break-all w-full py-0 px-[4px]"
            style={{ color: nameColor }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#F15B41'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = nameColor; }}
          >
            {product.name}
          </Link>
        </div>
        <div className="mt-[6px] flex items-baseline justify-center gap-[6px] flex-wrap">
          <span className="product-price-text text-[15px] font-bold" style={{ color: priceColor }}>
            {formatPrice(product.price)}
          </span>
          {discount > 0 && (
            <span className="text-[#F15B41] bg-[#fff0ed] text-[11px] font-bold px-[5px] py-[1px] rounded-[3px] leading-none">
              -{discount}%
            </span>
          )}
          {product.compareAtPrice && (
            <span className="text-[13px] text-[#999] line-through font-normal">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
        {product.colors.length > 0 && (
          <div className="mt-[8px] flex items-center justify-center gap-[6px] relative">
            {product.colors.slice(0, 3).map((c) => (
              <span
                key={c.name}
                onMouseEnter={() => setHoveredColor(c.name)}
                onMouseLeave={() => setHoveredColor(null)}
                className={`w-[16px] h-[16px] rounded-full inline-block cursor-pointer transition-[border-color,transform] duration-200 ease-in-out relative border-solid ${
                  hoveredColor === c.name
                    ? 'border-[2px] border-[#222] scale-[1.2]'
                    : c.value === '#FFFFFF'
                    ? 'border border-[#ddd] scale-100'
                    : 'border border-transparent scale-100'
                }`}
                style={{ backgroundColor: c.value }}
              />
            ))}
            {product.colors.length > 3 && <span className="text-[13px] font-medium" style={{ color: chipColor }}>+{product.colors.length - 3}</span>}
            {hoveredColor && (
              <span
                className="absolute bottom-[calc(100%+6px)] left-1/2 -translate-x-1/2 text-[#fff] text-[11px] font-medium py-[4px] px-[10px] rounded-[4px] whitespace-nowrap pointer-events-none animate-[fadeIn_150ms_ease]"
                style={{ backgroundColor: tooltipBg }}
              >
                {hoveredColor}
              </span>
            )}
          </div>
        )}
      </div>

      <style>{`
        .fc-action-btn {
          width: 40px !important;
          height: 40px !important;
          border-radius: 50% !important;
          border: none !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          cursor: pointer !important;
          padding: 0 !important;
          transition: background-color 200ms ease, color 200ms ease, transform 200ms ease, box-shadow 200ms ease !important;
        }
        .fc-action-btn:hover { transform: scale(1.08) !important; }

        .fc-action-btn-light {
          background-color: #fff !important;
          color: #333 !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08) !important;
        }
        .fc-action-btn-light:hover { background-color: #222 !important; color: #fff !important; }

        .fc-action-btn-dark {
          background-color: #222 !important;
          color: #fff !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15) !important;
        }
        .fc-action-btn-dark:hover { background-color: #000 !important; }

        .fc-tooltip {
          position: absolute !important;
          right: calc(100% + 8px) !important;
          top: 50% !important;
          transform: translateY(-50%) translateX(6px) !important;
          background-color: var(--fc-tooltip-bg, #222) !important;
          color: #fff !important;
          font-size: 12px !important;
          font-weight: 500 !important;
          padding: 6px 12px !important;
          border-radius: 4px !important;
          white-space: nowrap !important;
          opacity: 0 !important;
          pointer-events: none !important;
          transition: opacity 200ms ease, transform 200ms ease !important;
        }
        .fc-tooltip-wrap:hover .fc-tooltip {
          opacity: 1 !important;
          transform: translateY(-50%) translateX(0) !important;
        }

        .fc-product-title-tooltip {
          position: absolute;
          bottom: calc(100% + 6px);
          left: 50%;
          transform: translateX(-50%) translateY(4px);
          background-color: #0b1c3d;
          color: #fff;
          font-size: 12px;
          font-weight: 500;
          line-height: 1.4;
          padding: 6px 10px;
          border-radius: 5px;
          max-width: 240px;
          width: max-content;
          white-space: normal;
          text-align: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.18);
          opacity: 0;
          pointer-events: none;
          z-index: 20;
          transition: opacity 180ms ease, transform 180ms ease;
        }
        .fc-product-title-wrap:hover .fc-product-title-tooltip {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }


        
        .fc-mobile-actions {
          display: none;
        }

        
        @media (max-width: 991px) {
          .fc-card--compact .fc-actions-overlay {
            opacity: 1 !important;
            transform: none !important;
          }
          .fc-card--compact .fc-quickview-wrap,
          .fc-card--compact .fc-quickadd-wrap {
            display: none !important;
          }
          .fc-card--compact .fc-mobile-actions {
            display: grid;
            grid-template-columns: 1fr 1fr;
            border-top: 1px solid #eee;
            border-bottom: 1px solid #eee;
            margin-top: 0;
            margin-bottom: 14px;
          }
          .fc-card--compact .fc-mobile-action-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            height: clamp(38px, 5.2vw, 44px);
            background: #fff;
            border: none;
            color: #444;
            cursor: pointer;
            padding: 0;
            transition: background-color 180ms ease, color 180ms ease;
          }
          .fc-card--compact .fc-mobile-action-btn + .fc-mobile-action-btn {
            border-left: 1px solid #eee;
          }
          .fc-card--compact .fc-mobile-action-btn:hover {
            background: #f5f5f5;
          }
          
          .fc-card--compact > a:first-child img {
            object-fit: contain !important;
            background-color: #f5f5f5;
          }
        }

        
        @media (max-width: 749px) {
          .fc-card > a:first-child {
            height: clamp(200px, 44vw, 340px) !important;
            aspect-ratio: auto !important;
            margin-bottom: 10px !important;
          }
          .fc-card > a:first-child img {
            object-fit: contain !important;
            background-color: #f5f5f5;
          }
          .fc-actions-overlay {
            opacity: 1 !important;
            transform: none !important;
          }
          
          .fc-quickview-wrap,
          .fc-quickadd-wrap {
            display: none !important;
          }
          .fc-mobile-actions {
            display: grid;
            grid-template-columns: 1fr 1fr;
            border-top: 1px solid #eee;
            border-bottom: 1px solid #eee;
            margin-top: 0;
            margin-bottom: 14px;
          }
          .fc-mobile-action-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 44px;
            background: #fff;
            border: none;
            color: #444;
            cursor: pointer;
            padding: 0;
            transition: background-color 180ms ease, color 180ms ease;
          }
          .fc-mobile-action-btn + .fc-mobile-action-btn {
            border-left: 1px solid #eee;
          }
          .fc-mobile-action-btn:active {
            background: #f5f5f5;
          }
          .fc-action-btn:hover {
            transform: none !important;
          }
          .fc-action-btn-light:hover {
            background-color: #fff !important;
            color: #333 !important;
          }
          .fc-action-btn-dark:hover {
            background-color: #222 !important;
            color: #fff !important;
          }
          .fc-tooltip-wrap:hover .fc-tooltip {
            opacity: 0 !important;
          }

          
          .fc-countdown {
            gap: clamp(3px, 0.8vw, 5px) !important;
          }
          .fc-countdown-cell {
            padding: clamp(4px, 1.2vw, 6px) clamp(6px, 1.8vw, 10px) !important;
            min-width: clamp(30px, 8vw, 42px) !important;
            border-radius: 4px !important;
          }
          .fc-countdown-val {
            font-size: clamp(11px, 3vw, 16px) !important;
          }
          .fc-countdown-lbl {
            font-size: clamp(8px, 2vw, 11px) !important;
          }
        }
      `}</style>
    </div>
  );
}
