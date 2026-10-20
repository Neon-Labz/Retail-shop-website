'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useProducts } from '@/features/products/hooks/useProducts';

function IconChevronRight({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z" />
    </svg>
  );
}

const pad = (n: number) => String(n).padStart(2, '0');

function CountdownTimer() {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date('2029-01-01T00:00:00').getTime();
    const update = () => {
      const diff = Math.max(0, target - Date.now());
      setTime({
        days: Math.floor(diff / 86_400_000),
        hours: Math.floor((diff % 86_400_000) / 3_600_000),
        minutes: Math.floor((diff % 3_600_000) / 60_000),
        seconds: Math.floor((diff % 60_000) / 1_000),
      });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="pddb-countdown">
      {[
        { val: pad(time.days), label: 'Days' },
        { val: pad(time.hours), label: 'Hrs' },
        { val: pad(time.minutes), label: 'Min' },
        { val: pad(time.seconds), label: 'Sec' },
      ].map(({ val, label }) => (
        <div key={label} className="pddb-cd-cell">
          <span className="pddb-cd-val">{val}</span>
          <span className="pddb-cd-lbl">{label}</span>
        </div>
      ))}
    </div>
  );
}

/* Previous static thumbs commented out as requested:
const thumbs = [
  '/pod/products/product-4.webp',
  '/pod/products/product-5.webp',
  '/pod/products/product-8.webp',
];
*/

// Fallback items while loading
const fallbackThumbs = [
  { slug: 'shop', name: 'Special Weekend Deal', image: '/pod/products/product-4.webp' },
  { slug: 'shop', name: 'Special Weekend Deal', image: '/pod/products/product-5.webp' },
  { slug: 'shop', name: 'Special Weekend Deal', image: '/pod/products/product-8.webp' },
];

export function PodDealBanner() {
  const { data } = useProducts({ limit: 3, sort: 'popular' });
  const rawProducts = data?.products && data.products.length > 0 ? data.products.slice(0, 3) : null;

  const displayProducts = rawProducts
    ? rawProducts.map((p, idx) => ({
        id: p.id || `prod-${idx}`,
        name: p.name,
        slug: p.slug,
        image: p.images?.[0]?.src || '/pod/products/product-4.webp',
      }))
    : fallbackThumbs;

  return (
    <section>
      <div className="container-main">
        <div className="pddb-panel">
          <div className="pddb-grid">
            <div className="pddb-left">
              <div className="pddb-thumbs">
                {/* Previous static thumbs mapping commented out as requested:
                {thumbs.map((src, i) => (
                  <div key={i} className="pddb-thumb">
                    <Image src={src} alt={`Deal product ${i + 1}`} fill style={{ objectFit: 'cover' }} sizes="100px" />
                  </div>
                ))}
                */}
                {displayProducts.map((prod, i) => (
                  <Link
                    key={prod.slug + i}
                    href={`/products/${prod.slug}`}
                    className="pddb-thumb"
                    title={prod.name}
                  >
                    <Image
                      src={prod.image}
                      alt={prod.name || `Deal product ${i + 1}`}
                      fill
                      style={{ objectFit: 'contain', padding: '6px' }}
                      sizes="110px"
                    />
                  </Link>
                ))}
              </div>

              <div className="pddb-text">
                <p className="pddb-label">Special Weekend Deal</p>
                <p className="pddb-heading">Save an Extra 20%!</p>
                <Link href="/shop" className="pddb-link">
                  Shop Now
                  <IconChevronRight size={16} />
                </Link>
              </div>
            </div>

            <CountdownTimer />
          </div>
        </div>
      </div>

      <style>{`
        /* Previous .pddb-panel background-color: #e9cd5c commented out as requested for RKF logo blue:
        .pddb-panel {
          background-color: #e9cd5c;
          border-radius: 14px;
          padding: clamp(24px, 4vw, 40px);
        }
        */
        .pddb-panel {
          background: linear-gradient(135deg, #0b1c3d 0%, #112d62 55%, #183e84 100%);
          border-radius: 14px;
          padding: clamp(24px, 4vw, 40px);
          box-shadow: 0 10px 30px rgba(11, 28, 61, 0.16);
        }
        .pddb-grid {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: clamp(20px, 3vw, 32px);
        }
        .pddb-left {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: clamp(20px, 3vw, 32px);
        }
        .pddb-thumbs {
          display: flex;
          gap: 12px;
        }
        /* Previous .pddb-thumb commented out:
        .pddb-thumb {
          position: relative;
          flex-shrink: 0;
          width: clamp(72px, 9vw, 100px);
          height: clamp(72px, 9vw, 100px);
          background-color: #fff;
          border-radius: 8px;
          overflow: hidden;
          box-sizing: border-box;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
        */
        .pddb-thumb {
          position: relative;
          display: block;
          flex-shrink: 0;
          width: clamp(72px, 9vw, 100px);
          height: clamp(72px, 9vw, 100px);
          background-color: #ffffff;
          border-radius: 10px;
          overflow: hidden;
          box-sizing: border-box;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.18);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .pddb-thumb:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 8px 22px rgba(0, 0, 0, 0.28);
        }
        .pddb-text {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }
        /* Previous .pddb-label color: #6b5a1f commented out:
        .pddb-label {
          font-size: clamp(15px, 1.3vw, 16px);
          font-weight: 500;
          color: #6b5a1f;
        }
        */
        .pddb-label {
          font-size: clamp(13px, 1.2vw, 14px);
          font-weight: 600;
          color: #93c5fd;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }
        /* Previous .pddb-heading color: #171717 commented out:
        .pddb-heading {
          font-size: clamp(20px, 2.2vw, 26px);
          font-weight: 700;
          color: #171717;
          line-height: 1.2;
        }
        */
        .pddb-heading {
          font-size: clamp(20px, 2.2vw, 26px);
          font-weight: 700;
          color: #ffffff;
          line-height: 1.2;
        }
        /* Previous .pddb-link color: #171717 commented out:
        .pddb-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: clamp(14px, 1.2vw, 15px);
          font-weight: 500;
          color: #171717;
          text-decoration: underline;
          text-underline-offset: 3px;
          margin-top: 2px;
        }
        */
        .pddb-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: clamp(13px, 1.2vw, 14px);
          font-weight: 600;
          color: #ffffff;
          background-color: rgba(255, 255, 255, 0.12);
          padding: 8px 18px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.24);
          text-decoration: none;
          margin-top: 4px;
          transition: all 0.2s ease;
        }
        .pddb-link:hover {
          background-color: #ffffff;
          color: #0b1c3d;
        }
        .pddb-countdown {
          display: flex;
          gap: clamp(10px, 1.6vw, 16px);
        }
        /* Previous .pddb-cd-cell commented out:
        .pddb-cd-cell {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 1.5px solid rgba(23, 23, 23, 0.3);
          border-radius: 6px;
          width: clamp(60px, 7vw, 78px);
          height: clamp(60px, 7vw, 78px);
          box-sizing: border-box;
        }
        .pddb-cd-val {
          font-size: clamp(20px, 2.2vw, 26px);
          font-weight: 700;
          color: #171717;
          line-height: 1;
          font-variant-numeric: tabular-nums;
        }
        .pddb-cd-lbl {
          font-size: 13px;
          color: #6b5a1f;
          margin-top: 6px;
        }
        */
        .pddb-cd-cell {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(8px);
          border: 1.5px solid rgba(255, 255, 255, 0.22);
          border-radius: 8px;
          width: clamp(60px, 7vw, 78px);
          height: clamp(60px, 7vw, 78px);
          box-sizing: border-box;
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.15);
        }
        .pddb-cd-val {
          font-size: clamp(20px, 2.2vw, 26px);
          font-weight: 700;
          color: #ffffff;
          line-height: 1;
          font-variant-numeric: tabular-nums;
        }
        .pddb-cd-lbl {
          font-size: 12px;
          color: #cbd5e1;
          margin-top: 6px;
          font-weight: 500;
        }

        @media (min-width: 992px) {
          .pddb-panel {
            height: 190px;
            display: flex;
            align-items: center;
            padding: 0 clamp(28px, 3.4vw, 48px);
          }
          .pddb-grid {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            text-align: left;
            width: 100%;
            gap: clamp(28px, 3.4vw, 48px);
          }
          /* Content sits directly beside the thumbnails (not spread across
             the whole row) and is vertically centered against them. */
          .pddb-left {
            flex-direction: row;
            align-items: center;
            gap: clamp(20px, 2.4vw, 32px);
          }
          .pddb-thumbs { gap: 16px; }
          .pddb-thumb { width: 110px; height: 110px; padding: 0; border-radius: 10px; }
          .pddb-text { align-items: flex-start; gap: 6px; }
          .pddb-label { font-size: clamp(12px, 1.1vw, 13px); }
          .pddb-heading { font-size: clamp(21px, 2.3vw, 26px); }
          .pddb-link { font-size: clamp(13px, 1.2vw, 14px); }
          .pddb-countdown { gap: clamp(14px, 2vw, 22px); }
          .pddb-cd-cell { width: 92px; height: 92px; border-radius: 8px; }
          .pddb-cd-val { font-size: clamp(22px, 2.4vw, 26px); }
          .pddb-cd-lbl { font-size: 12px; margin-top: 6px; }
        }
      `}</style>
    </section>
  );
}
