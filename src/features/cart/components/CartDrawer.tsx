'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/utils/formatPrice';
import { FREE_SHIPPING_THRESHOLD } from '@/lib/constants';
import { getStorefrontFromPath, getStorefrontOfSlug, productHrefBaseFor, shopHrefFor } from '@/utils/storefront';

/* ── Icons ── */

function IconClose({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconShipping({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

/* ── Cart Drawer ── */

export function CartDrawer() {
  const { items: allItems, isDrawerOpen, closeDrawer, removeItem, updateQuantity } = useCartStore();
  const pathname = usePathname();
  const storefront = getStorefrontFromPath(pathname);
  const items = allItems.filter((i) => getStorefrontOfSlug(i.slug) === storefront);
  const productHrefBase = productHrefBaseFor(storefront);
  const shopHref = shopHrefFor(storefront);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const shippingPercent = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isDrawerOpen]);

  useEffect(() => {
    if (!isDrawerOpen) return;
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') closeDrawer(); };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isDrawerOpen, closeDrawer]);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={closeDrawer}
        style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)',
          zIndex: 9999, transition: 'opacity 250ms ease',
          opacity: isDrawerOpen ? 1 : 0, pointerEvents: isDrawerOpen ? 'auto' : 'none',
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, width: '460px', maxWidth: '100vw',
          backgroundColor: '#fff', zIndex: 9999, display: 'flex', flexDirection: 'column',
          transition: 'transform 350ms ease',
          transform: isDrawerOpen ? 'translateX(0)' : 'translateX(100%)',
          boxShadow: isDrawerOpen ? '-4px 0 24px rgba(0,0,0,0.1)' : 'none',
        }}
      >
        {/* Header — close button always, title only when items exist */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: items.length > 0 ? 'space-between' : 'flex-end', padding: '20px 24px', borderBottom: items.length > 0 ? '1px solid #f0f0f0' : 'none' }}>
          {items.length > 0 && <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#222' }}>Item added to your cart</h3>}
          <button onClick={closeDrawer} style={{ display: 'flex', background: 'none', border: 'none', cursor: 'pointer', color: '#222' }} aria-label="Close cart">
            <IconClose size={22} />
          </button>
        </div>

        {/* Free shipping bar — only when items exist */}
        {items.length > 0 && <div style={{ padding: '16px 24px', borderBottom: '1px solid #f0f0f0' }}>
          <p style={{ fontSize: '15px', color: '#555', marginBottom: '10px' }}>
            {shippingRemaining > 0
              ? <>{formatPrice(shippingRemaining)} away from Free Standard Shipping.</>
              : <span style={{ color: '#22c55e', fontWeight: 600 }}>You qualify for Free Standard Shipping!</span>
            }
          </p>
          <div style={{ position: 'relative', height: '8px', backgroundColor: '#e5e5e5', borderRadius: '40px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${shippingPercent}%`, background: 'linear-gradient(90deg, #4ECDC4, #44B09E)', borderRadius: '40px', transition: 'width 500ms ease' }} />
          </div>
          <div style={{ position: 'relative', marginTop: '-14px', left: `calc(${Math.min(shippingPercent, 95)}% - 14px)`, width: '28px', height: '28px', borderRadius: '50%', border: '2px solid #44B09E', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'left 500ms ease' }}>
            <IconShipping size={14} />
          </div>
        </div>}

        {/* Cart items — scrollable */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px' }}>
          {items.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingTop: '60px' }}>
              <p style={{ fontSize: '18px', fontWeight: 600, color: '#222', marginBottom: '20px' }}>Your cart is currently empty.</p>
              <Link
                href={shopHref}
                onClick={closeDrawer}
                style={{
                  display: 'inline-block', padding: '14px 36px', backgroundColor: '#F15B41',
                  color: '#fff', fontSize: '16px', fontWeight: 600, borderRadius: '40px',
                  textDecoration: 'none', transition: 'background-color 250ms ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#000'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F15B41'; }}
              >
                Return to shop
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={`${item.productId}-${item.variantId}`} style={{ display: 'flex', gap: '16px', padding: '20px 0', borderBottom: '1px solid #f0f0f0' }}>
                {/* Thumbnail */}
                <Link href={`${productHrefBase}/${item.slug}`} onClick={closeDrawer} style={{ width: '90px', height: '110px', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#f5f5f5', flexShrink: 0, position: 'relative', display: 'block' }}>
                  <Image src={item.image} alt={item.name} fill style={{ objectFit: 'cover' }} sizes="90px" />
                </Link>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '17px', fontWeight: 600, color: '#222', marginBottom: '5px' }}>{item.name}</h4>
                  <p style={{ fontSize: '15px', color: '#666', marginBottom: '3px' }}>
                    <span style={{ fontWeight: 600, color: '#222' }}>Color:</span> {item.color} &nbsp;&nbsp;
                    <span style={{ fontWeight: 600, color: '#222' }}>Size:</span> {item.size}
                  </p>
                  <p style={{ fontSize: '17px', fontWeight: 600, color: '#F15B41', marginBottom: '12px' }}>{formatPrice(item.price)}</p>

                  {/* Quantity + remove */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid #e5e5e5', borderRadius: '4px' }}>
                      <button
                        onClick={() => updateQuantity(item.productId, item.variantId, Math.max(1, item.quantity - 1))}
                        style={{ width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#222' }}
                      >−</button>
                      <span style={{ width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: 500, color: '#222', borderLeft: '1px solid #e5e5e5', borderRight: '1px solid #e5e5e5' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                        style={{ width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#222' }}
                      >+</button>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId, item.variantId)}
                      style={{ fontSize: '15px', color: '#222', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontWeight: 500 }}
                    >
                      remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}

        </div>

        {/* Footer — subtotal + buttons */}
        {items.length > 0 && (
          <div style={{ borderTop: '1px solid #e5e5e5', padding: '20px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '26px', fontWeight: 700, color: '#222' }}>Subtotal</span>
              <span style={{ fontSize: '20px', fontWeight: 600, color: '#222' }}>{formatPrice(subtotal)} USD</span>
            </div>
            <p style={{ fontSize: '15px', color: '#777', marginBottom: '18px' }}>Taxes and shipping calculated at checkout</p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <Link
                href="/cart"
                onClick={closeDrawer}
                style={{
                  flex: 1, textAlign: 'center', padding: '14px 0', border: '1.5px solid #222',
                  borderRadius: '40px', fontSize: '15px', fontWeight: 600, color: '#222',
                  textDecoration: 'none', transition: 'all 250ms ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#222'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#222'; }}
              >
                View cart
              </Link>
              <Link
                href="/checkout"
                onClick={closeDrawer}
                style={{
                  flex: 1, textAlign: 'center', padding: '14px 0', backgroundColor: '#F15B41',
                  color: '#fff', border: 'none', borderRadius: '40px', fontSize: '15px',
                  fontWeight: 600, textDecoration: 'none', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  transition: 'background-color 250ms ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#000'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F15B41'; }}
              >
                Check out
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
