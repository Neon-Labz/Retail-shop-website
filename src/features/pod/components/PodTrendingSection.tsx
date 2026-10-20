'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

/* Ported 1:1 from PCTabSection.tsx (Phone Case) — layout, typography,
   spacing, tab behavior, animations, hover effects, and responsive
   behavior must stay pixel-identical per spec. Class prefix renamed
   pctab-* -> pdtab-*; only copy and imagery swapped for POD. */

function IconRadioDot({ size = 13 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width={size} height={size}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" fill="currentColor" />
    </svg>
  );
}

function IconArrowUpRight({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M16.0037 9.41421L7.39712 18.0208L5.98291 16.6066L14.5895 8H7.00373V6H18.0037V17H16.0037V9.41421Z" />
    </svg>
  );
}

function IconArrowRight({ size = 13 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3647L8.22192 16.9505L13.1717 12.0007Z" />
    </svg>
  );
}

/* Original POD tabs commented out as requested:
const tabs = [
  {
    id: 'style',
    title: 'Personalized Products for Every Style',
    description: 'From apparel to accessories, every piece is printed on demand with vivid, fade-resistant colors — designed around your ideas, not a warehouse shelf.',
    mediaSrc: '/pod/tab/tab-1.webp',
  },
  {
    id: 'hoodie',
    title: 'Create a Hoodie that Speaks Volumes',
    description: 'Bold graphics or subtle monograms — our print process holds fine detail wash after wash, so your design stays sharp no matter how often it gets worn.',
    mediaSrc: '/pod/tab/tab-2.webp',
  },
  {
    id: 'totes',
    title: 'Custom Totes for Every Adventure',
    description: 'Durable canvas, edge-to-edge printing, and a fast turnaround — build a tote that matches your everyday carry and holds up to daily use.',
    mediaSrc: '/pod/tab/tab-3.webp',
  },
];
*/

const defaultTabs = [
  {
    id: 'wholesale',
    step: '01',
    tag: 'Direct Importer Pricing',
    stat: 'Up to 40% Wholesale Savings',
    title: 'Wholesale & Bulk Orders at Direct Importer Prices',
    description: 'Special discounted tiers for retail shops, resellers, and bulk buyers across Sri Lanka.',
    mediaSrc: 'https://pub-a517fd63737142cbb39ca30df8bc77f0.r2.dev/products/1792484380387-7310740e-b8ef-4b14-a5c4-5c194b845b5a.png',
  },
  {
    id: 'delivery',
    step: '02',
    tag: 'Islandwide Fast Dispatch',
    stat: 'All 25 Districts Covered',
    title: 'Fast & Safe Islandwide Delivery',
    description: 'Carefully packed and dispatched quickly to your doorstep or business anywhere in Sri Lanka.',
    mediaSrc: 'https://pub-a517fd63737142cbb39ca30df8bc77f0.r2.dev/products/1792407167386-42072d33-a778-40dc-9045-1879d3235c02.png',
  },
  {
    id: 'quality',
    step: '03',
    tag: '100% Quality Verified',
    stat: 'Handpicked Premium Stock',
    title: '100% Quality-Checked Everyday Products',
    description: 'From hardware & home essentials to stationery, jewelry, and electronics—handpicked for durability and value.',
    mediaSrc: 'https://pub-a517fd63737142cbb39ca30df8bc77f0.r2.dev/products/1792484317347-7da77223-4a96-4b72-b8e6-9cd39b1aa356.png',
  },
];

export function PodTrendingSection() {
  const [activeTab, setActiveTab] = useState(0);
  const [dbImages, setDbImages] = useState<string[]>([]);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/products?limit=6')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        if (!isMounted) return;
        if (data.products && Array.isArray(data.products)) {
          const imgs: string[] = [];
          for (const p of data.products) {
            const raw = p.images?.[0];
            const src = typeof raw === 'string' ? raw : raw?.src;
            if (src && !src.includes('/pod/tab/')) {
              imgs.push(src);
            }
            if (imgs.length >= 3) break;
          }
          if (imgs.length > 0) setDbImages(imgs);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const tabs = defaultTabs.map((tab, idx) => ({
    ...tab,
    mediaSrc: dbImages[idx] || tab.mediaSrc,
  }));

  return (
    <section className="pdtab-section">
      <div className="container-main">
        <div className="pdtab-grid">

          {/* LEFT — content area */}
          <div className="pdtab-content">

            {/* Eyebrow */}
            <div className="pdtab-eyebrow">
              <IconRadioDot size={13} />
              {/* Original: TRENDING */}
              WHY CHOOSE RKF
            </div>

            {/* Tab list */}
            <div className="pdtab-tabs-list">
              {tabs.map((tab, i) => {
                const isActive = activeTab === i;
                return (
                  <div
                    key={tab.id}
                    onMouseEnter={() => setActiveTab(i)}
                    onClick={() => setActiveTab(i)}
                    className={`pdtab-row${isActive ? ' is-active' : ''}`}
                  >
                    <div className="pdtab-row-header">
                      <span className={`pdtab-step-badge${isActive ? ' is-active' : ''}`}>
                        {tab.step}
                      </span>
                      <div style={{ flex: 1 }}>
                        <h3 className="pdtab-row-title">
                          {tab.title}
                        </h3>
                        {isActive && (
                          <p className="pdtab-inline-desc">
                            {tab.description}
                          </p>
                        )}
                      </div>
                    </div>
                    {/* Arrow button removed/commented out as requested:
                    <span className={`pdtab-arrow-btn${activeTab === i ? ' is-active' : ''}`}>
                      <IconArrowUpRight size={16} />
                    </span>
                    */}
                  </div>
                );
              })}
            </div>

            {/* CTA navigation link commented out as requested (stay on home page without navigating):
            <Link href="/shop" className="pdtab-cta">
              SHOP NOW <IconArrowRight size={13} />
            </Link>
            */}

          </div>

          {/* RIGHT — database product image showcase */}
          <div className="pdtab-media">
            {tabs.map((tab, i) => (
              <div
                key={tab.id}
                className="pdtab-slide"
                style={{
                  opacity: activeTab === i ? 1 : 0,
                  transform: activeTab === i ? 'scale(1)' : 'scale(0.97)',
                  transition: 'opacity 450ms ease, transform 450ms ease',
                  pointerEvents: activeTab === i ? 'auto' : 'none',
                }}
              >
                {/* Framed product stage so any DB product image fits 100% cleanly without cropping */}
                <div className="pdtab-image-frame">
                  <div className="pdtab-image-inner">
                    <Image
                      src={tab.mediaSrc}
                      alt={tab.title}
                      fill
                      unoptimized
                      style={{ objectFit: 'contain', objectPosition: 'center', padding: '16px' }}
                      sizes="(min-width: 750px) 45vw, 90vw"
                      priority={i === 0}
                    />
                  </div>
                </div>

                {/* Bottom highlight badge neatly below the image frame */}
                <div className="pdtab-media-badge">
                  <span className="pdtab-media-tag">{tab.tag}</span>
                  <span className="pdtab-media-stat">{tab.stat}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      <style>{`
        .pdtab-grid {
          display: grid;
          grid-template-columns: 1fr;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(11, 28, 61, 0.09);
          border: 1px solid #e5e7eb;
        }

        /* ── Left: content ── */
        .pdtab-content {
          background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
          display: flex;
          flex-direction: column;
          padding: 40px 28px;
        }

        /* Eyebrow */
        .pdtab-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #ffffff;
          background: linear-gradient(135deg, #0b1c3d 0%, #183e84 100%);
          padding: 7px 16px;
          border-radius: 999px;
          align-self: flex-start;
          margin-bottom: 28px;
          box-shadow: 0 4px 14px rgba(11, 28, 61, 0.18);
        }

        /* Tab rows */
        .pdtab-tabs-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .pdtab-row {
          padding: 20px 22px;
          border-radius: 14px;
          border: 1.5px solid #e2e8f0;
          background: #ffffff;
          cursor: pointer;
          transition: all 300ms ease;
        }
        .pdtab-row:hover {
          border-color: #cbd5e1;
          transform: translateX(4px);
        }
        .pdtab-row.is-active {
          border-color: #183e84;
          background: linear-gradient(135deg, rgba(11, 28, 61, 0.03) 0%, rgba(24, 62, 132, 0.07) 100%);
          box-shadow: 0 10px 26px rgba(11, 28, 61, 0.07);
          transform: translateX(6px);
        }
        .pdtab-row-header {
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }
        .pdtab-step-badge {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.04em;
          color: #64748b;
          background: #f1f5f9;
          flex-shrink: 0;
          transition: all 300ms ease;
        }
        .pdtab-step-badge.is-active {
          background: linear-gradient(135deg, #F15B41 0%, #d94a32 100%);
          color: #ffffff;
          box-shadow: 0 6px 14px rgba(241, 91, 65, 0.3);
        }
        .pdtab-row-title {
          font-size: clamp(17px, 2vw, 22px);
          font-weight: 700;
          color: #1e293b;
          margin: 4px 0 0;
          line-height: 1.35;
          letter-spacing: -0.015em;
          transition: color 250ms ease;
        }
        .pdtab-row.is-active .pdtab-row-title {
          color: #0b1c3d;
        }
        .pdtab-inline-desc {
          font-size: 14.5px;
          color: #475569;
          line-height: 1.7;
          margin: 10px 0 0;
          font-weight: 400;
          animation: pdtabFadeIn 320ms ease;
        }
        @keyframes pdtabFadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Right: media ── */
        .pdtab-media {
          position: relative;
          min-height: 380px;
          overflow: hidden;
          background: linear-gradient(135deg, #0b1c3d 0%, #112d62 55%, #183e84 100%);
        }
        .pdtab-slide {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          padding: clamp(20px, 3vw, 28px);
          gap: 16px;
        }
        .pdtab-image-frame {
          position: relative;
          flex: 1;
          min-height: 0;
          width: 100%;
          background: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.22);
          border: 1px solid rgba(255, 255, 255, 0.85);
        }
        .pdtab-image-inner {
          position: absolute;
          inset: 0;
        }
        .pdtab-media-badge {
          flex-shrink: 0;
          padding: 14px 20px;
          border-radius: 14px;
          background: rgba(11, 28, 61, 0.65);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(147, 197, 253, 0.3);
          display: flex;
          flex-direction: column;
          gap: 4px;
          color: #fff;
        }
        .pdtab-media-tag {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #93c5fd;
        }
        .pdtab-media-stat {
          font-size: 17px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.01em;
        }

        /* ── Desktop: 50/50 side by side ── */
        @media (min-width: 750px) {
          .pdtab-grid {
            grid-template-columns: 1.08fr 0.92fr;
            min-height: 540px;
          }
          .pdtab-content {
            padding: 44px 40px;
            justify-content: center;
          }
          .pdtab-media { height: auto; min-height: 540px; }
        }
        @media (min-width: 992px) {
          .pdtab-grid { min-height: 560px; }
          .pdtab-content { padding: 52px 48px; }
          .pdtab-media { min-height: 560px; }
        }
      `}</style>
    </section>
  );
}
