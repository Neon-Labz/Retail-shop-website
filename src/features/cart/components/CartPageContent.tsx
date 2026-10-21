'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, type ReactNode } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { QuantitySelector } from '@/components/ui/QuantitySelector';
import { FeaturedSlider } from '@/features/home/components/FeaturedSlider';
import { formatPrice } from '@/utils/formatPrice';
import { GIFT_WRAP_PRICE } from '@/lib/constants';

const ACCENT = '#c96742';

const SHIP_COUNTRIES = [
  { value: '', label: '---' },
  { value: 'US', label: 'United States' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'CA', label: 'Canada' },
  { value: 'AU', label: 'Australia' },
  { value: 'BD', label: 'Bangladesh' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'IN', label: 'India' },
  { value: 'JP', label: 'Japan' },
  { value: 'SG', label: 'Singapore' },
  { value: 'AE', label: 'United Arab Emirates' },
];

/* ── Icons ───────────────────────────────────────────────────── */

function IcoTruck({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="1" y="3" width="14" height="12" rx="1" />
      <path d="M15 8h4l3 3.5V18h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2" />
      <circle cx="18.5" cy="18.5" r="2" />
    </svg>
  );
}

function IcoReturn({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 .49-4.13" />
    </svg>
  );
}

function IcoShield({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

function IcoGift({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <polyline points="20 12 20 22 4 22 4 12" />
      <rect x="2" y="7" width="20" height="5" />
      <line x1="12" y1="22" x2="12" y2="7" />
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </svg>
  );
}

function IcoPercent() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <line x1="19" y1="5" x2="5" y2="19" />
      <circle cx="6.5" cy="6.5" r="2.5" />
      <circle cx="17.5" cy="17.5" r="2.5" />
    </svg>
  );
}

function IcoDoc() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function IcoLock() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function IcoKeyboard() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M7 16h10" />
    </svg>
  );
}

function IcoClose() {
  return (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IcoChevron({ open }: { open: boolean }) {
  return (
    <svg
      width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
      style={{ transform: open ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.3s ease', flexShrink: 0 }}
    >
      <polyline points="18 15 12 9 6 15" />
    </svg>
  );
}

/* ── Shared sub-components ───────────────────────────────────── */

function TrustBadges() {
  const badges = [
    { Icon: IcoTruck, title: 'Free Shipping', desc: 'On orders over $100' },
    { Icon: IcoReturn, title: 'Easy Returns', desc: '30-day return policy' },
    { Icon: IcoShield, title: 'Secure Payment', desc: 'SSL encrypted' },
  ];
  return (
    <div className="cp-trust">
      {badges.map(({ Icon, title, desc }) => (
        <div key={title} className="cp-trust-card">
          <Icon />
          <p className="cp-trust-title">{title}</p>
          <p className="cp-trust-desc">{desc}</p>
        </div>
      ))}
    </div>
  );
}

function GiftOptions({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="cp-gift-box">
      <h3 className="cp-gift-heading">
        <IcoGift /> Gift Options
      </h3>
      <label className="cp-gift-label">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="cp-gift-check"
        />
        <span>
          For <strong>{formatPrice(GIFT_WRAP_PRICE)}</strong> per item, please wrap the products in this order.
        </span>
      </label>
    </div>
  );
}

function AccordionSection({
  icon, title, children, defaultOpen = true,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="cp-accord">
      <button className="cp-accord-head" onClick={() => setOpen(!open)}>
        <span className="cp-accord-icon">{icon}</span>
        <span className="cp-accord-title">{title}</span>
        <IcoChevron open={open} />
      </button>
      <div style={{
        display: 'grid',
        gridTemplateRows: open ? '1fr' : '0fr',
        transition: 'grid-template-rows 320ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }}>
        <div style={{ overflow: 'hidden' }}>
          <div className="cp-accord-body">{children}</div>
        </div>
      </div>
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────── */

export function CartPageContent() {
  const { items, removeItem, updateQuantity, getSubtotal } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  // Promo code, shipping estimate, and instructions removed from cart as requested
  const [giftWrap, setGiftWrap] = useState(false);

  const subtotal = getSubtotal();
  const giftTotal = giftWrap ? items.reduce((s, i) => s + i.quantity, 0) * GIFT_WRAP_PRICE : 0;
  const total = subtotal + giftTotal;

  /* ── Empty state ─────────────────────────────────── */
  if (items.length === 0) {
    return (
      <>
        <div className="container-main" style={{ paddingTop: '3.6rem', paddingBottom: '6rem' }}>
          {/* Header & Breadcrumb */}
          <div style={{ textAlign: 'center', marginBottom: '3.6rem' }}>
            <h1 className="cp-page-title" style={{ textAlign: 'center', marginBottom: '0.8rem' }}>
              Your Shopping Cart
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '1.4rem', color: '#888' }}>
              <Link href="/" style={{ color: '#666', textDecoration: 'none' }}>Home</Link>
              <span>/</span>
              <span style={{ color: '#222' }}>Cart</span>
            </div>
          </div>

          {/* Clean Centered Empty Card */}
          <div className="cp-empty-card">
            <div className="cp-empty-icon-wrap">
              <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>

            <h2 className="cp-empty-title">Your cart is currently empty</h2>
            <p className="cp-empty-desc">
              Before you can proceed to checkout, you must add some items to your shopping cart.
              Browse our collections to find something you love!
            </p>

            <Link href="/shop" className="cp-continue-btn">
              <span>Continue Shopping</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>

            <div className="cp-empty-shortcuts">
              <span className="cp-shortcuts-label">Popular Categories:</span>
              <div className="cp-shortcuts-list">
                <Link href="/shop" className="cp-shortcut-pill">All Products</Link>
                <Link href="/categories" className="cp-shortcut-pill">Categories</Link>
                <Link href="/wishlist" className="cp-shortcut-pill">Wishlist</Link>
              </div>
            </div>

            {!isAuthenticated && (
              <p className="cp-empty-auth-hint">
                Have an account? <Link href="/login" className="cp-login-link">Log in</Link> to view your saved items.
              </p>
            )}
          </div>
        </div>

        <div style={{ paddingBottom: '8rem' }}>
          <FeaturedSlider title="Trending Products" />
        </div>
        <style>{cpStyles}</style>
      </>
    );
  }

  /* ── Filled cart ─────────────────────────────────── */
  return (
    <>
      <div className="container-main" style={{ paddingTop: '3.6rem', paddingBottom: '8rem' }}>
        <h1 className="cp-page-title">Your Shopping Cart</h1>

        <div className="cp-layout">

          {/* ── Left column ── */}
          <div className="cp-left">

            {/* Cart items box */}
            <div className="cp-cart-box">
              <div className="cp-cart-head">
                <span className="cp-cart-label">Your cart</span>
                <span className="cp-cart-count">{items.length} product{items.length !== 1 ? 's' : ''}</span>
              </div>

              {items.map((item) => (
                <div key={`${item.productId}-${item.variantId}`} className="cp-item" style={{ position: 'relative' }}>
                  <Link href={`/products/${item.slug}`} className="cp-item-img">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="100px"
                      style={{ objectFit: 'contain' }}
                    />
                  </Link>
                  <div className="cp-item-body">
                    {item.vendor && <span className="cp-item-vendor">{item.vendor}</span>}
                    <p className="cp-item-name">{item.name}</p>
                    {item.color && <p className="cp-item-attr">Color:{item.color}</p>}
                    {item.size && item.size !== 'default' && (
                      <p className="cp-item-attr">Size:{item.size}</p>
                    )}
                    <div className="cp-item-foot">
                      <QuantitySelector
                        value={item.quantity}
                        onChange={(qty) => updateQuantity(item.productId, item.variantId, qty)}
                      />
                      <span className="cp-item-price">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId, item.variantId)}
                    className="cp-item-x"
                    aria-label="Remove item"
                    style={{ position: 'absolute', top: '1.8rem', right: '2rem' }}
                  >
                    <IcoClose />
                  </button>
                </div>
              ))}
            </div>

            {/* Trust badges and Gift options removed as requested */}
          </div>

          {/* ── Right sidebar: Order Summary ── */}
          <div className="cp-right">
            {/* Order summary */}
            <div className="cp-summary">
              <h3 className="cp-summary-title">Order Summary</h3>

              <div className="cp-totals" style={{ borderTop: 'none', paddingTop: 0 }}>
                <div className="cp-total-row">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {giftWrap && (
                  <div className="cp-total-row">
                    <span>Gift wrapping</span>
                    <span>{formatPrice(giftTotal)}</span>
                  </div>
                )}
                <div className="cp-total-row cp-total-bold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <p className="cp-tax-note">Shipping calculated at checkout</p>

              <Link href="/checkout" className="cp-checkout-btn">
                <IcoLock /> Secure Checkout
              </Link>
            </div>

          </div>
        </div>
      </div>

      <FeaturedSlider title="You may also like" />
      <style>{cpStyles}</style>
    </>
  );
}

/* ── Styles ──────────────────────────────────────────────────── */

const cpStyles = `
  /* page title */
  .cp-page-title {
    font-size: 2.6rem;
    font-weight: 700;
    color: var(--color-heading);
    margin-bottom: 8rem;
  }

  /* ── Clean Empty State Card ── */
  .cp-empty-card {
    max-width: 62rem;
    margin: 0 auto;
    padding: 4.8rem 3.2rem;
    background: #ffffff;
    border: 1px solid #ededed;
    border-radius: 1.6rem;
    box-shadow: 0 4px 25px rgba(0, 0, 0, 0.03);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .cp-empty-icon-wrap {
    width: 8.8rem;
    height: 8.8rem;
    border-radius: 50%;
    background: #fdf2f0;
    color: ${ACCENT};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 2.2rem;
    border: 1px solid rgba(201, 103, 66, 0.15);
  }
  .cp-empty-title {
    font-size: 2.4rem;
    font-weight: 700;
    color: var(--color-heading, #111827);
    margin: 0 0 1.2rem;
    letter-spacing: -0.02em;
  }
  .cp-empty-desc {
    font-size: 1.5rem;
    color: #6b7280;
    line-height: 1.65;
    max-width: 46rem;
    margin: 0 0 3rem;
  }
  .cp-continue-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    background: #111827;
    color: #ffffff;
    font-size: 1.5rem;
    font-weight: 600;
    padding: 1.4rem 3.6rem;
    border-radius: 9999px;
    text-decoration: none;
    transition: all 0.2s ease;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
  }
  .cp-continue-btn:hover {
    background: ${ACCENT};
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(201, 103, 66, 0.25);
    color: #ffffff;
  }
  .cp-empty-shortcuts {
    margin-top: 3.2rem;
    padding-top: 2.4rem;
    border-top: 1px solid #f0f0f0;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.2rem;
  }
  .cp-shortcuts-label {
    font-size: 1.25rem;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 600;
  }
  .cp-shortcuts-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.8rem;
  }
  .cp-shortcut-pill {
    padding: 0.7rem 1.8rem;
    border-radius: 9999px;
    border: 1px solid #e5e7eb;
    background: #fafafa;
    font-size: 1.35rem;
    font-weight: 500;
    color: #4b5563;
    text-decoration: none;
    transition: all 0.15s ease;
  }
  .cp-shortcut-pill:hover {
    border-color: #111827;
    color: #111827;
    background: #ffffff;
  }
  .cp-empty-auth-hint {
    font-size: 1.35rem;
    color: #6b7280;
    margin: 2.4rem 0 0;
  }
  .cp-empty-auth-hint .cp-login-link {
    color: #111827;
    font-weight: 600;
    text-decoration: underline;
  }
  .cp-empty-auth-hint .cp-login-link:hover {
    color: ${ACCENT};
  }

  /* ── trust badges ── */
  .cp-trust {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.4rem;
    margin: 0;
  }
  .cp-trust-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    border: 1px solid #e8e8e8;
    border-radius: 0.8rem;
    padding: 2.4rem 1.8rem;
    color: #666;
  }
  .cp-trust-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-heading);
    margin-top: 1.2rem;
    margin-bottom: 0.5rem;
  }
  .cp-trust-desc {
    font-size: 1.35rem;
    color: ${ACCENT};
  }

  /* ── gift options ── */
  .cp-gift-box {
    border: 1px solid #e8e8e8;
    border-radius: 0.8rem;
    padding: 2rem 2.4rem;
  }
  .cp-gift-heading {
    display: flex;
    align-items: center;
    gap: 0.9rem;
    font-size: 1.65rem;
    font-weight: 700;
    color: var(--color-heading);
    margin-bottom: 1.4rem;
  }
  .cp-gift-label {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 1.5rem;
    color: var(--color-body);
    cursor: pointer;
  }
  .cp-gift-check {
    width: 1.7rem;
    height: 1.7rem;
    flex-shrink: 0;
    cursor: pointer;
    accent-color: ${ACCENT};
  }

  /* ── two-column layout ── */
  .cp-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 30%;
    gap: 2.4rem;
    align-items: start;
  }
  /* 80px gap between left-column sections */
  .cp-left { display: flex; flex-direction: column; gap: 8rem; }

  /* right sidebar: bordered card + sticky */
  .cp-right {
    position: sticky;
    top: 2rem;
    max-height: calc(100vh - 4rem);
    overflow-y: auto;
    border: 1px solid #e5e5e5;
    border-radius: 1rem;
    background: #fff;
    scrollbar-width: none;
  }
  .cp-right::-webkit-scrollbar { display: none; }

  /* ── your cart box ── */
  .cp-cart-box {
    border: 1px solid #e8e8e8;
    border-radius: 0.8rem;
    overflow: hidden;
  }
  .cp-cart-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.8rem 2.4rem;
    border-bottom: 1px solid #e8e8e8;
  }
  .cp-cart-label {
    font-size: 1.65rem;
    font-weight: 700;
    color: var(--color-heading);
  }
  .cp-cart-count {
    font-size: 1.45rem;
    color: #888;
  }

  /* ── cart item row ── */
  .cp-item {
    display: flex;
    gap: 1.8rem;
    padding: 2.2rem 2.4rem 2.2rem 2rem;
    border-bottom: 1px solid #e8e8e8;
  }
  .cp-item:last-child { border-bottom: none; }
  .cp-item-img {
    position: relative;
    width: 10rem;
    height: 11rem;
    flex-shrink: 0;
    background: #f5f5f5;
    border-radius: 0.6rem;
    overflow: hidden;
    display: block;
  }
  .cp-item-body {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    padding-right: 3.4rem;
  }
  .cp-item-vendor {
    font-size: 1.25rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${ACCENT};
    margin-bottom: 0.35rem;
  }
  .cp-item-x {
    width: 2.6rem;
    height: 2.6rem;
    flex-shrink: 0;
    border: 1px solid #d0d0d0;
    border-radius: 50%;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #888;
    transition: background 0.18s, border-color 0.18s, color 0.18s;
  }
  .cp-item-x:hover { background: #f5f5f5; border-color: #999; color: #333; }
  .cp-item-name {
    font-size: 1.65rem;
    font-weight: 600;
    color: var(--color-heading);
    line-height: 1.4;
    margin-bottom: 0.35rem;
  }
  .cp-item-attr {
    font-size: 1.45rem;
    color: ${ACCENT};
    line-height: 1.6;
  }
  .cp-item-foot {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
    padding-top: 1.4rem;
  }
  .cp-item-price {
    font-size: 1.75rem;
    font-weight: 600;
    color: var(--color-heading);
  }

  /* ── accordion sections (inside bordered cp-right card) ── */
  .cp-accord {
    border-bottom: 1px solid #e5e5e5;
  }
  .cp-accord:last-of-type {
    border-bottom: none;
  }
  .cp-accord-head {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.9rem;
    padding: 1.7rem 2rem;
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
  }
  .cp-accord-head:hover { background: #fafafa; }
  .cp-accord-icon {
    display: flex;
    align-items: center;
    color: #666;
    flex-shrink: 0;
  }
  .cp-accord-title {
    flex: 1;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--color-heading);
  }
  .cp-accord-body {
    padding: 0 2rem 2rem;
  }

  /* ── promo code ── */
  .cp-promo-row { display: flex; gap: 0.9rem; align-items: center; }
  .cp-promo-input {
    flex: 1;
    height: 4.4rem;
    border: 1px solid #e0e0e0;
    border-radius: 9999px;
    padding: 0 1.6rem;
    font-size: 1.45rem;
    color: var(--color-heading);
    outline: none;
    font-family: inherit;
    background: #fff;
    min-width: 0;
  }
  .cp-promo-input::placeholder { color: #aaa; }
  .cp-promo-input:focus { border-color: #bbb; }
  .cp-apply-btn {
    background: ${ACCENT};
    color: #fff;
    font-size: 1.45rem;
    font-weight: 600;
    padding: 0 2.2rem;
    height: 4.4rem;
    border: none;
    border-radius: 9999px;
    cursor: pointer;
    white-space: nowrap;
    flex-shrink: 0;
    transition: opacity 0.2s;
    font-family: inherit;
  }
  .cp-apply-btn:hover { opacity: 0.85; }

  /* ── estimate shipping ── */
  .cp-ship-fields { display: flex; flex-direction: column; gap: 0.9rem; }
  .cp-field-label {
    font-size: 1.35rem;
    font-weight: 500;
    color: var(--color-heading);
    margin-bottom: 0.1rem;
  }
  .cp-select {
    width: 100%;
    height: 4.2rem;
    border: 1px solid #e0e0e0;
    border-radius: 0.6rem;
    padding: 0 1.2rem;
    font-size: 1.45rem;
    color: #555;
    background: #fff;
    outline: none;
    cursor: pointer;
    font-family: inherit;
  }
  .cp-select:focus { border-color: #bbb; }
  .cp-input-wrap { position: relative; }
  .cp-text-input {
    width: 100%;
    height: 4.2rem;
    border: 1px solid #e0e0e0;
    border-radius: 0.6rem;
    padding: 0 3.8rem 0 1.2rem;
    font-size: 1.45rem;
    color: var(--color-heading);
    outline: none;
    background: #fff;
    font-family: inherit;
  }
  .cp-text-input::placeholder { color: #aaa; }
  .cp-text-input:focus { border-color: #bbb; }
  .cp-input-icon {
    position: absolute;
    right: 1.2rem;
    top: 50%;
    transform: translateY(-50%);
    color: #aaa;
    display: flex;
    pointer-events: none;
  }
  .cp-calc-btn {
    width: 100%;
    background: ${ACCENT};
    color: #fff;
    font-size: 1.55rem;
    font-weight: 600;
    height: 4.6rem;
    border: none;
    border-radius: 9999px;
    cursor: pointer;
    transition: opacity 0.2s;
    font-family: inherit;
    margin-top: 0.6rem;
  }
  .cp-calc-btn:hover { opacity: 0.85; }

  /* ── order instructions ── */
  .cp-notes-wrap { display: flex; flex-direction: column; gap: 0.7rem; }
  .cp-notes-area {
    width: 100%;
    border: 1px solid #e0e0e0;
    border-radius: 0.6rem;
    padding: 1.1rem 1.3rem;
    font-size: 1.45rem;
    color: var(--color-heading);
    outline: none;
    resize: vertical;
    font-family: inherit;
    line-height: 1.5;
    background: #fff;
    min-height: 9rem;
  }
  .cp-notes-area:focus { border-color: #bbb; }
  .cp-char-count { font-size: 1.25rem; color: #aaa; text-align: right; }

  /* ── order summary card ── */
  .cp-summary {
    padding: 2.4rem;
  }
  .cp-summary-title {
    font-size: 1.7rem;
    font-weight: 700;
    color: var(--color-heading);
    margin-bottom: 1.4rem;
  }
  .cp-ship-msg {
    font-size: 1.45rem;
    color: #666;
    line-height: 1.6;
    margin-bottom: 1.4rem;
  }
  .cp-progress-track {
    position: relative;
    width: 100%;
    height: 0.5rem;
    background: #e8e8e8;
    border-radius: 9999px;
    overflow: visible;
    margin-bottom: 2.8rem;
    margin-top: 0.4rem;
  }
  .cp-progress-fill {
    height: 100%;
    background: #e87070;
    border-radius: 9999px;
    transition: width 0.5s ease;
  }
  .cp-progress-thumb {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 2.8rem;
    height: 2.8rem;
    background: #fff;
    border: 2px solid #e87070;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #e87070;
    transition: left 0.5s ease;
    z-index: 1;
  }
  .cp-totals {
    border-top: 1px solid #e8e8e8;
    padding-top: 1.2rem;
    display: flex;
    flex-direction: column;
    gap: 0;
  }
  .cp-total-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1.5rem;
    color: #666;
    padding: 0.55rem 0;
  }
  .cp-total-row span:last-child { color: var(--color-heading); }
  .cp-total-bold {
    border-top: 1px solid #e8e8e8;
    margin-top: 0.6rem;
    padding-top: 1rem;
    font-size: 1.65rem;
    font-weight: 700;
  }
  .cp-total-bold span { color: var(--color-heading) !important; font-weight: 700; }
  .cp-tax-note {
    font-size: 1.3rem;
    color: #aaa;
    margin: 1.1rem 0 1.8rem;
    line-height: 1.4;
  }
  .cp-checkout-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.9rem;
    width: 100%;
    background: #111;
    color: #fff;
    font-size: 1.6rem;
    font-weight: 600;
    height: 5.4rem;
    border: none;
    border-radius: 9999px;
    cursor: pointer;
    transition: background 0.2s;
    font-family: inherit;
    letter-spacing: 0.01em;
    text-decoration: none;
  }
  .cp-checkout-btn:hover { background: #2d2d2d; color: #fff; }

  /* ── responsive ── */
  @media (max-width: 749px) {
    .cp-layout { grid-template-columns: 1fr; }
    .cp-trust { grid-template-columns: 1fr; }
    .cp-left { gap: 4rem; }
    .cp-right {
      position: static;
      max-height: none;
      overflow-y: visible;
    }
  }
  @media (min-width: 750px) and (max-width: 1023px) {
    .cp-layout { grid-template-columns: minmax(0, 1fr) 28rem; }
  }
`;
