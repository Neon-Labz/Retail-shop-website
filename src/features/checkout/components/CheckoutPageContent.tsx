'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/utils/formatPrice';
import { getClientCookie, setClientCookie, USER_COOKIE_NAME, ONE_DAY_SECONDS } from '@/lib/cookies';

const ACCENT = '#c96742';
const DARK = '#111111';

const COUNTRIES = [
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

type PaymentMethod = 'bank' | 'cod';

function IcoCheck() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function CheckoutPageContent() {
  const { items, getSubtotal, clearCart } = useCartStore();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  // const [discountCode, setDiscountCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bank');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState<{
    orderNumber: string;
    message?: string;
  } | null>(null);

  useEffect(() => {
    // 1. Immediately prefill from 1-day user cookie if available (fast feedback)
    try {
      const savedCheckout = localStorage.getItem('customer_checkout_details');
      const cookieUser = getClientCookie(USER_COOKIE_NAME);
      const u = savedCheckout ? JSON.parse(savedCheckout) : cookieUser ? JSON.parse(cookieUser) : null;
      if (u) {
        if (u.firstName) setFirstName((prev) => prev || u.firstName);
        if (u.lastName) setLastName((prev) => prev || u.lastName);
        if (u.email) setEmail((prev) => prev || u.email);
        if (u.phone) setPhone((prev) => prev || u.phone);
        if (u.country) setCountry((prev) => prev || u.country);
        if (u.city) setCity((prev) => prev || u.city);
        if (u.address) setAddress((prev) => prev || u.address);
        if (u.line1) setAddress((prev) => prev || u.line1);
      }
    } catch {
      // Ignore parse errors
    }

    // Clean up any legacy long-lived localStorage user data
    try {
      localStorage.removeItem('customer_user');
    } catch {}

    // 2. Fetch fresh details of authenticated customer from /api/auth/me
    let isMounted = true;
    async function loadCustomer() {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted && data.success && data.user) {
          const u = data.user;
          if (u.firstName) setFirstName(u.firstName);
          if (u.lastName) setLastName(u.lastName);
          if (u.email) setEmail(u.email);
          if (u.phone) setPhone(u.phone);

          if (Array.isArray(u.addresses) && u.addresses.length > 0) {
            const defaultAddr =
              u.addresses.find((a: any) => a.isDefault) || u.addresses[0];
            if (defaultAddr.city) setCity(defaultAddr.city);
            if (defaultAddr.line1) setAddress(defaultAddr.line1);
            if (defaultAddr.country) {
              const matchedCountry = COUNTRIES.find(
                (c) =>
                  c.value.toLowerCase() === defaultAddr.country.toLowerCase() ||
                  c.label.toLowerCase() === defaultAddr.country.toLowerCase()
              );
              setCountry(matchedCountry ? matchedCountry.value : defaultAddr.country);
            }
          }

          try {
            setClientCookie(USER_COOKIE_NAME, JSON.stringify(u), ONE_DAY_SECONDS);
          } catch {}
        }
      } catch (err) {
        console.debug('No logged-in user profile:', err);
      }
    }

    loadCustomer();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleEmailBlur = async () => {
    if (!email || !email.includes('@') || !email.includes('.')) return;
    try {
      const res = await fetch(`/api/auth/lookup?email=${encodeURIComponent(email.trim())}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.success && data.customer) {
        const c = data.customer;
        if (!firstName && c.firstName) setFirstName(c.firstName);
        if (!lastName && c.lastName) setLastName(c.lastName);
        if (!phone && c.phone) setPhone(c.phone);

        const addr = c.defaultAddress || (c.addresses && c.addresses[0]);
        if (addr) {
          if (!address && addr.line1) setAddress(addr.line1);
          if (!city && addr.city) setCity(addr.city);
          if (!country && addr.country) {
            const matchedCountry = COUNTRIES.find(
              (cntry) =>
                cntry.value.toLowerCase() === addr.country.toLowerCase() ||
                cntry.label.toLowerCase() === addr.country.toLowerCase()
            );
            setCountry(matchedCountry ? matchedCountry.value : addr.country);
          }
        }
      }
    } catch {
      // Ignore lookup error
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderError(null);

    if (items.length === 0) {
      setOrderError('Your cart is empty. Please add items to your cart.');
      return;
    }
    if (!firstName.trim()) {
      setOrderError('Please enter your First Name.');
      return;
    }
    if (!country) {
      setOrderError('Please select your Country/Region.');
      return;
    }
    if (!city.trim()) {
      setOrderError('Please enter your Town/City.');
      return;
    }
    if (!address.trim()) {
      setOrderError('Please enter your Address.');
      return;
    }
    if (!phone.trim()) {
      setOrderError('Please enter your Phone Number.');
      return;
    }
    if (!email.trim()) {
      setOrderError('Please enter your Email.');
      return;
    }
    if (!agreeTerms) {
      setOrderError('Please agree to the website terms and conditions.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          country: country.trim(),
          city: city.trim(),
          address: address.trim(),
          phone: phone.trim(),
          email: email.trim(),
          notes: notes.trim(),
          paymentMethod,
          items,
          subtotal,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setOrderError(data.error || 'Failed to place order. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Save checkout details for next time so address, city, country are remembered
      try {
        localStorage.setItem(
          'customer_checkout_details',
          JSON.stringify({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            country: country.trim(),
            city: city.trim(),
            address: address.trim(),
            phone: phone.trim(),
            email: email.trim(),
          })
        );
      } catch {}

      // Clear the cart
      clearCart();

      setOrderSuccess({
        orderNumber: data.orderNumber,
        message: data.message || 'Your order has been placed successfully!',
      });
      setIsSubmitting(false);
    } catch {
      setOrderError('A network error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  const subtotal = getSubtotal();

  return (
    <>
      {/* ── Hero Banner ── */}
      <div className="co-hero">
        <h1 className="co-hero-title">Check Out</h1>
      </div>

      {/* ── Main Content ── */}
      {orderSuccess ? (
        <div className="container-main" style={{ paddingTop: '6rem', paddingBottom: '8rem' }}>
          <div className="co-success-card">
            <div className="co-success-icon-wrap">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="co-success-title">Thank You For Your Order!</h2>
            <p className="co-success-subtitle">
              Your order has been received and is currently being processed.
            </p>
            <div className="co-success-order-num">
              Order Number: <span>#{orderSuccess.orderNumber}</span>
            </div>
            <div className="co-success-grid">
              <div className="co-success-box">
                <span className="co-success-box-title">Shipping & Billing Address</span>
                <p><strong>{firstName} {lastName}</strong></p>
                <p>{address}</p>
                <p>{city}, {country}</p>
                <p>Phone: {phone}</p>
                <p>Email: {email}</p>
              </div>
              <div className="co-success-box">
                <span className="co-success-box-title">Order Information</span>
                <p>Payment: {paymentMethod === 'bank' ? 'Direct Bank Transfer' : 'Cash on Delivery'}</p>
                <p>Payment Status: Pending</p>
                <p>Order Total: <strong>{formatPrice(subtotal)}</strong></p>
              </div>
            </div>
            <div style={{ marginTop: '3.5rem', textAlign: 'center' }}>
              <Link href="/shop" className="co-continue-btn">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="container-main" style={{ paddingTop: '6rem', paddingBottom: '8rem' }}>
          <div className="co-layout">

            {/* ── LEFT: Billing Details ── */}
            <section>
              <h2 className="co-section-title">Billing details</h2>
              <div className="co-fields">

                {/* First + Last name */}
                <div className="co-row-2">
                  <div className="co-field">
                    <label className="co-label">First Name<span className="co-req">*</span></label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder=""
                      className="co-input"
                    />
                  </div>
                  <div className="co-field">
                    <label className="co-label">Last Name<span className="co-req">*</span></label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="co-input"
                    />
                  </div>
                </div>

                {/* Country/Region */}
                <div className="co-field">
                  <label className="co-label">Country/Region<span className="co-req">*</span></label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="co-select"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>

                {/* Town/City */}
                <div className="co-field">
                  <label className="co-label">Town/City<span className="co-req">*</span></label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="co-input"
                  />
                </div>

                {/* Address */}
                <div className="co-field">
                  <label className="co-label">Address<span className="co-req">*</span></label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="co-input"
                  />
                </div>

                {/* Phone Number */}
                <div className="co-field">
                  <label className="co-label">Phone Number<span className="co-req">*</span></label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+94 77 123 4567"
                    className="co-input"
                  />
                </div>

                {/* Email */}
                <div className="co-field">
                  <label className="co-label">Email<span className="co-req">*</span></label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={handleEmailBlur}
                    className="co-input"
                  />
                </div>

                {/* Order notes */}
                <div className="co-field">
                  <label className="co-label">Order notes (optional)<span className="co-req">*</span></label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="co-textarea"
                    rows={5}
                  />
                </div>

              </div>
            </section>

            {/* ── RIGHT: Your Order ── */}
            <aside className="co-order-aside">
              <h2 className="co-section-title">Your order</h2>

              {/* Cart items card */}
              <div className="co-order-card">
                {items.length === 0 ? (
                  <div className="co-empty-state">
                    <p className="co-empty-text">Your shop cart is empty</p>
                    <Link href="/shop" className="co-explore-btn">Explore Products!</Link>
                  </div>
                ) : (
                  <>
                    <div className="co-order-head">
                      <span>Product</span>
                      <span>Subtotal</span>
                    </div>
                    {items.map((item) => (
                      <div key={`${item.productId}-${item.variantId}`} className="co-order-row">
                        <span className="co-order-name">
                          {item.name}{' '}
                          <span className="co-order-qty">× {item.quantity}</span>
                        </span>
                        <span className="co-order-price">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                    <div className="co-order-subtotal">
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Discount code — merged bottom edge of order card
              <div className="co-discount-row">
                <input
                  type="text"
                  placeholder="Discount code"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  className="co-discount-input"
                />
                <button className="co-discount-apply">Apply</button>
              </div>
              */}

              {/* Total */}
              <div className="co-total-bar">
                <span className="co-total-label">Total</span>
                <span className="co-total-amount">{formatPrice(subtotal)}</span>
              </div>

              {/* Payment methods */}
              <div className="co-payment-wrap">
                {(
                  [
                    { value: 'bank' as PaymentMethod, label: 'Direct bank transfer' },
                    { value: 'cod' as PaymentMethod, label: 'Cash on delivery' },
                  ] as const
                ).map(({ value, label }) => (
                  <label
                    key={value}
                    className="co-payment-opt"
                    onClick={() => setPaymentMethod(value)}
                  >
                    <span className={`co-radio-dot${paymentMethod === value ? ' co-radio-on' : ''}`}>
                      {paymentMethod === value && <IcoCheck />}
                    </span>
                    <span className="co-payment-text">{label}</span>
                  </label>
                ))}
              </div>

              {/* Privacy text */}
              <p className="co-privacy">
                Your personal data will be used to process your order, support your
                experience throughout this website, and for other purposes described in
                our{' '}
                <Link href="/pages/privacy-policy" className="co-link">
                  privacy policy
                </Link>
                .
              </p>

              {/* Terms checkbox */}
              <label className="co-terms">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="co-terms-check"
                />
                <span>
                  I have read and agree to the website{' '}
                  <Link href="#" className="co-link">terms and conditions</Link>
                </span>
              </label>

              {/* Error Alert */}
              {orderError && (
                <div className="co-alert-error" role="alert">
                  <span>{orderError}</span>
                </div>
              )}

              {/* Place order */}
              <button
                type="button"
                className="co-place-order"
                disabled={!agreeTerms || isSubmitting}
                onClick={handlePlaceOrder}
              >
                {isSubmitting ? 'Placing order...' : 'Place order'}
              </button>

            </aside>
          </div>
        </div>
      )}

      <style>{coStyles}</style>
    </>
  );
}

/* ── Styles ──────────────────────────────────────────────────── */

const coStyles = `
  /* ── Hero ── */
  .co-hero {
    background: linear-gradient(135deg, #ffffff 0%, #fdf4f0 50%, #fde8df 100%);
    padding: 5.5rem 0;
    text-align: center;
  }
  .co-hero-title {
    font-size: 4rem;
    font-weight: 400;
    color: var(--color-heading);
    letter-spacing: 0.01em;
  }

  /* ── Two-column layout ── */
  .co-layout {
    display: grid;
    grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
    gap: 5rem;
    align-items: start;
  }

  /* ── Section titles ── */
  .co-section-title {
    font-size: 2.2rem;
    font-weight: 700;
    color: var(--color-heading);
    margin-bottom: 3rem;
  }

  /* ── Billing form ── */
  .co-fields { display: flex; flex-direction: column; gap: 2rem; }
  .co-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.8rem; }
  .co-field { display: flex; flex-direction: column; gap: 0.7rem; }
  .co-label {
    font-size: 1.6rem;
    font-weight: 500;
    color: var(--color-heading);
  }
  .co-req { color: #e84d1c; margin-left: 0.15rem; }
  .co-input {
    width: 100%;
    height: 4.8rem;
    border: 1px solid #ddd;
    border-radius: 0.4rem;
    padding: 0 1.4rem;
    font-size: 1.4rem;
    color: var(--color-heading);
    background: #fff;
    outline: none;
    font-family: inherit;
    transition: border-color 0.2s;
  }
  .co-input::placeholder { color: #bbb; }
  .co-input:focus { border-color: #999; }
  .co-select {
    width: 100%;
    height: 4.8rem;
    border: 1px solid #ddd;
    border-radius: 0.4rem;
    padding: 0 1.4rem;
    font-size: 1.4rem;
    color: #555;
    background: #fff;
    outline: none;
    cursor: pointer;
    font-family: inherit;
    transition: border-color 0.2s;
  }
  .co-select:focus { border-color: #999; }
  .co-textarea {
    width: 100%;
    border: 1px solid #ddd;
    border-radius: 0.4rem;
    padding: 1.2rem 1.4rem;
    font-size: 1.4rem;
    color: var(--color-heading);
    background: #fff;
    outline: none;
    resize: vertical;
    font-family: inherit;
    line-height: 1.5;
    min-height: 13rem;
    transition: border-color 0.2s;
  }
  .co-textarea:focus { border-color: #999; }

  /* ── Sticky aside ── */
  .co-order-aside {
    position: sticky;
    top: 2rem;
    max-height: calc(100vh - 4rem);
    overflow-y: auto;
    scrollbar-width: none;
  }
  .co-order-aside::-webkit-scrollbar { display: none; }

  /* ── Order card (cart items) ── */
  .co-order-card {
    background: #f7f7f7;
    border: 1px solid #e5e5e5;
    border-radius: 0.6rem;
    overflow: hidden;
    margin-bottom: 1.6rem;
  }
  .co-empty-state {
    padding: 4rem 2.4rem;
    text-align: center;
  }
  .co-empty-text {
    font-size: 1.5rem;
    color: #666;
    margin-bottom: 2rem;
  }
  .co-explore-btn {
    display: block;
    background: ${DARK};
    color: #fff;
    font-size: 1.5rem;
    font-weight: 600;
    padding: 1.4rem 0;
    border-radius: 0.4rem;
    text-decoration: none;
    text-align: center;
    transition: background 0.2s;
  }
  .co-explore-btn:hover { background: #333; }
  .co-order-head {
    display: flex;
    justify-content: space-between;
    padding: 1.2rem 2rem;
    background: #fafafa;
    border-bottom: 1px solid #e0e0e0;
    font-size: 1.3rem;
    font-weight: 600;
    color: #666;
  }
  .co-order-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 1.2rem 2rem;
    border-bottom: 1px solid #f0f0f0;
    gap: 1rem;
  }
  .co-order-name {
    font-size: 1.35rem;
    color: var(--color-heading);
    flex: 1;
    line-height: 1.4;
  }
  .co-order-qty { color: #888; }
  .co-order-price {
    font-size: 1.35rem;
    font-weight: 500;
    color: var(--color-heading);
    white-space: nowrap;
  }
  .co-order-subtotal {
    display: flex;
    justify-content: space-between;
    padding: 1.2rem 2rem;
    background: #fafafa;
    border-top: 1px solid #e0e0e0;
    font-size: 1.4rem;
    font-weight: 600;
    color: var(--color-heading);
  }

  /* ── Discount code ── */
  .co-discount-row {
    display: flex;
    border: 1px solid #e0e0e0;
    border-radius: 0.4rem;
    overflow: hidden;
    margin-bottom: 2rem;
  }
  .co-discount-input {
    flex: 1;
    height: 4.8rem;
    border: none;
    border-right: 1px solid #e0e0e0;
    padding: 0 1.6rem;
    font-size: 1.4rem;
    color: var(--color-heading);
    outline: none;
    font-family: inherit;
    background: #fff;
    min-width: 0;
  }
  .co-discount-input::placeholder { color: #aaa; }
  .co-discount-apply {
    background: ${DARK};
    color: #fff;
    font-size: 1.45rem;
    font-weight: 600;
    padding: 0 2.4rem;
    height: 4.8rem;
    border: none;
    cursor: pointer;
    white-space: nowrap;
    font-family: inherit;
    flex-shrink: 0;
    transition: background 0.2s;
  }
  .co-discount-apply:hover { background: #333; }

  /* ── Total bar ── */
  .co-total-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.6rem 0 2rem;
    border-top: 1px solid #e0e0e0;
    border-bottom: 1px solid #e0e0e0;
    margin-bottom: 2.4rem;
  }
  .co-total-label {
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-heading);
  }
  .co-total-amount {
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-heading);
  }

  /* ── Payment methods ── */
  .co-payment-wrap {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    margin-bottom: 2.2rem;
    padding-bottom: 2.2rem;
    border-bottom: 1px solid #e0e0e0;
  }
  .co-payment-opt {
    display: flex;
    align-items: center;
    gap: 1rem;
    cursor: pointer;
    user-select: none;
  }
  .co-radio-dot {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    border: 2px solid #ccc;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: #fff;
    transition: border-color 0.18s, background 0.18s;
  }
  .co-radio-on {
    background: #e84d1c;
    border-color: #e84d1c;
  }
  .co-payment-text {
    font-size: 1.4rem;
    font-weight: 500;
    color: var(--color-heading);
  }

  /* ── Privacy & terms ── */
  .co-privacy {
    font-size: 1.3rem;
    color: #666;
    line-height: 1.65;
    margin-bottom: 1.8rem;
  }
  .co-link {
    color: ${ACCENT};
    text-decoration: underline;
    text-underline-offset: 2px;
  }
  .co-terms {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    font-size: 1.35rem;
    color: var(--color-body);
    cursor: pointer;
    margin-bottom: 2.6rem;
    line-height: 1.5;
  }
  .co-terms-check {
    width: 1.6rem;
    height: 1.6rem;
    flex-shrink: 0;
    margin-top: 0.1rem;
    cursor: pointer;
    accent-color: #e84d1c;
  }

  /* ── Place order button ── */
  .co-place-order {
    width: 100%;
    background: ${DARK};
    color: #fff;
    font-size: 1.55rem;
    font-weight: 600;
    height: 5.6rem;
    border: none;
    border-radius: 0.4rem;
    cursor: pointer;
    font-family: inherit;
    letter-spacing: 0.01em;
    transition: background 0.2s;
  }
  .co-place-order:hover:not(:disabled) { background: #333; }
  .co-place-order:disabled { opacity: 0.45; cursor: not-allowed; }

  /* ── Alert Error ── */
  .co-alert-error {
    background-color: #fdf2f2;
    border: 1px solid #f8b4b4;
    color: #9b1c1c;
    padding: 1.2rem 1.6rem;
    border-radius: 0.4rem;
    font-size: 1.35rem;
    margin-bottom: 2rem;
    line-height: 1.4;
  }

  /* ── Success Card ── */
  .co-success-card {
    max-width: 68rem;
    margin: 0 auto;
    background: #fff;
    border: 1px solid #e5e5e5;
    border-radius: 0.8rem;
    padding: 5rem 4rem;
    text-align: center;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  }
  .co-success-icon-wrap {
    width: 6.8rem;
    height: 6.8rem;
    background: #ecfdf5;
    border: 2px solid #a7f3d0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 2rem;
  }
  .co-success-title {
    font-size: 2.8rem;
    font-weight: 700;
    color: var(--color-heading);
    margin-bottom: 1rem;
  }
  .co-success-subtitle {
    font-size: 1.5rem;
    color: #666;
    margin-bottom: 2.2rem;
  }
  .co-success-order-num {
    display: inline-block;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    padding: 0.8rem 2rem;
    border-radius: 2rem;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--color-heading);
    margin-bottom: 3rem;
  }
  .co-success-order-num span {
    color: #e84d1c;
    font-family: monospace;
    font-size: 1.6rem;
  }
  .co-success-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    text-align: left;
    margin-top: 1rem;
    border-top: 1px solid #eee;
    padding-top: 2.5rem;
  }
  .co-success-box {
    background: #fafafa;
    border: 1px solid #efefef;
    padding: 2rem;
    border-radius: 0.6rem;
    font-size: 1.35rem;
    color: #444;
    line-height: 1.65;
  }
  .co-success-box-title {
    display: block;
    font-weight: 700;
    font-size: 1.45rem;
    color: var(--color-heading);
    margin-bottom: 1rem;
    border-bottom: 1px solid #e5e5e5;
    padding-bottom: 0.6rem;
  }
  .co-continue-btn {
    display: inline-block;
    background: ${DARK};
    color: #fff !important;
    padding: 1.4rem 3.6rem;
    font-size: 1.5rem;
    font-weight: 600;
    border-radius: 0.4rem;
    text-decoration: none;
    transition: background 0.2s;
  }
  .co-continue-btn:hover {
    background: #333;
  }

  /* ── Responsive ── */
  @media (max-width: 749px) {
    .co-layout { grid-template-columns: 1fr; gap: 4rem; }
    .co-row-2 { grid-template-columns: 1fr; }
    .co-hero-title { font-size: 3rem; }
    .co-success-grid { grid-template-columns: 1fr; }
    .co-success-card { padding: 3rem 2rem; }
  }
  @media (min-width: 750px) and (max-width: 1023px) {
    .co-layout { grid-template-columns: 1fr 1fr; gap: 3rem; }
  }
`;
