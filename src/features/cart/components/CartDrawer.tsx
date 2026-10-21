'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/utils/formatPrice';
import { FREE_SHIPPING_THRESHOLD } from '@/lib/constants';
import { getStorefrontFromPath, getStorefrontOfSlug, productHrefBaseFor, shopHrefFor } from '@/utils/storefront';

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

function IconCoupon({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M10.9042 2.1001L20.8037 3.51431L22.2179 13.4138L13.0255 22.6062C12.635 22.9967 12.0019 22.9967 11.6113 22.6062L1.71184 12.7067C1.32131 12.3162 1.32131 11.683 1.71184 11.2925L10.9042 2.1001ZM11.6113 4.22142L3.83316 11.9996L12.3184 20.4849L20.0966 12.7067L18.9833 4.33473L11.6113 4.22142ZM13.7327 10.5854C12.9516 9.80433 12.9516 8.53799 13.7327 7.75695C14.5137 6.9759 15.7801 6.9759 16.5611 7.75695C17.3422 8.53799 17.3422 9.80433 16.5611 10.5854C15.7801 11.3664 14.5137 11.3664 13.7327 10.5854Z" />
    </svg>
  );
}

type TabType = 'none' | 'note' | 'shipping' | 'coupon';

function NotePanel({ onClose }: { onClose: () => void }) {
  const { orderNote, setOrderNote } = useCartStore();
  const [note, setNote] = useState(orderNote);
  const [saved, setSaved] = useState(false);

  const handleApply = () => {
    setOrderNote(note);
    setSaved(true);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <div className="p-[24px]">
      <h4 className="text-[18px] font-bold text-[#222] mb-[16px]">Order special instructions</h4>
      <textarea
        value={note}
        onChange={(e) => {
          setNote(e.target.value);
          setSaved(false);
        }}
        placeholder="Special instructions for seller (delivery preferences, gift notes, etc.)"
        className="w-full min-h-[120px] p-[14px] text-[15px] border border-[#e5e5e5] rounded-[8px] outline-none resize-y text-[#222]"
      />
      <button
        onClick={handleApply}
        className="w-full p-[14px] bg-[#F15B41] text-white text-[16px] font-semibold border-none rounded-[40px] cursor-pointer mt-[20px] hover:bg-[#d94a32] transition-colors"
      >
        {saved ? 'Saved!' : 'Apply Note'}
      </button>
      <button onClick={onClose} className="block mt-[14px] mx-auto mb-0 text-[15px] font-medium text-[#222] bg-transparent border-none cursor-pointer underline">
        Cancel
      </button>
    </div>
  );
}

function ShippingPanel({ onClose }: { onClose: () => void }) {
  const [calculated, setCalculated] = useState(false);
  const { getSubtotal } = useCartStore();
  const subtotal = getSubtotal();
  const isFree = subtotal >= FREE_SHIPPING_THRESHOLD;

  return (
    <div className="p-[24px]">
      <h4 className="text-[18px] font-bold text-[#222] mb-[16px]">Estimate shipping rates</h4>
      <select className="w-full p-[14px] text-[15px] border border-[#e5e5e5] rounded-[40px] outline-none text-[#222] mb-[14px] appearance-auto">
        <option>All 25 Districts (Sri Lanka)</option>
      </select>
      <input
        placeholder="Postal/ZIP code (Optional)"
        className="w-full p-[14px] text-[15px] border border-[#e5e5e5] rounded-[40px] outline-none text-[#222]"
      />
      <button
        onClick={() => setCalculated(true)}
        className="w-full p-[14px] bg-[#F15B41] text-white text-[16px] font-semibold border-none rounded-[40px] cursor-pointer mt-[20px] hover:bg-[#d94a32] transition-colors"
      >
        Calculate
      </button>
      {calculated && (
        <div className="mt-[16px] p-[12px] bg-[#f8fafc] border border-[#e2e8f0] rounded-[8px] text-[14px] text-[#334155]">
          <p className="font-semibold text-[#0f172a]">Islandwide Fast Delivery:</p>
          <p className="mt-[4px]">
            {isFree ? (
              <span className="text-[#16a34a] font-bold">FREE Delivery qualified!</span>
            ) : (
              <span>Standard delivery fee calculated at checkout.</span>
            )}
          </p>
        </div>
      )}
      <button onClick={onClose} className="block mt-[14px] mx-auto mb-0 text-[15px] font-medium text-[#222] bg-transparent border-none cursor-pointer underline">
        Close
      </button>
    </div>
  );
}

function CouponPanel({ onClose }: { onClose: () => void }) {
  const { couponCode, discount, applyCoupon, removeCoupon } = useCartStore();
  const [code, setCode] = useState(couponCode);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleApply = () => {
    if (!code.trim()) return;
    const res = applyCoupon(code);
    setIsError(!res.success);
    setMessage(res.message);
  };

  return (
    <div className="p-[24px]">
      <h4 className="text-[18px] font-bold text-[#222] mb-[16px]">Apply a discount code</h4>
      {couponCode ? (
        <div className="p-[14px] bg-[#ecfdf5] border border-[#a7f3d0] rounded-[8px] text-[14px] flex items-center justify-between text-[#065f46]">
          <span>Applied: <strong>{couponCode}</strong> ({formatPrice(discount)} off)</span>
          <button
            onClick={() => {
              removeCoupon();
              setCode('');
              setMessage('');
            }}
            className="text-[12px] text-[#dc2626] font-semibold underline cursor-pointer"
          >
            Remove
          </button>
        </div>
      ) : (
        <>
          <div className="flex gap-[10px]">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter discount code"
              className="flex-1 py-[14px] px-[18px] text-[15px] border border-[#e5e5e5] rounded-[40px] outline-none text-[#222]"
            />
            <button
              onClick={handleApply}
              className="py-[14px] px-[28px] bg-[#F15B41] text-white text-[15px] font-semibold border-none rounded-[40px] cursor-pointer whitespace-nowrap hover:bg-[#d94a32] transition-colors"
            >
              Apply
            </button>
          </div>
          {message && (
            <p className={`text-[13px] mt-[10px] font-medium ${isError ? 'text-[#ef4444]' : 'text-[#10b981]'}`}>
              {message}
            </p>
          )}
          <p className="text-[12px] text-[#999] mt-[8px]">Tip: Try <strong>WELCOME10</strong> for 10% off or <strong>RKF500</strong>!</p>
        </>
      )}
      <button onClick={onClose} className="block mt-[14px] mx-auto mb-0 text-[15px] font-medium text-[#222] bg-transparent border-none cursor-pointer underline">
        Close
      </button>
    </div>
  );
}

export function CartDrawer() {
  const { items: allItems, isDrawerOpen, closeDrawer, removeItem, updateQuantity, discount, couponCode, getTotal } = useCartStore();
  const pathname = usePathname();
  const storefront = getStorefrontFromPath(pathname);
  const items = allItems.filter((i) => getStorefrontOfSlug(i.slug) === storefront);
  const productHrefBase = productHrefBaseFor(storefront);
  const shopHref = shopHrefFor(storefront);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = Math.max(0, subtotal - (discount || 0));
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

  const [activeTab, setActiveTab] = useState<TabType>('none');
  const toggleTab = (t: TabType) => setActiveTab((prev) => (prev === t ? 'none' : t));

  return (
    <>
      <div
        onClick={closeDrawer}
        className={`fixed inset-0 bg-black/40 z-[9999] transition-opacity duration-250 ease-in-out ${
          isDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      <div
        className={`fixed top-0 right-0 bottom-0 w-[420px] max-w-[90vw] bg-white z-[10000] flex flex-col shadow-[-4px_0_20px_rgba(0,0,0,0.15)] transition-transform duration-350 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between py-[20px] px-[24px] border-b border-[#e5e5e5]">
          <span className="text-[20px] font-bold text-[#222]">Shopping cart</span>
          <button
            onClick={closeDrawer}
            aria-label="Close cart"
            className="flex items-center justify-center p-[6px] text-[#222] bg-transparent border-none cursor-pointer rounded-full transition-colors duration-150 hover:bg-[#f0f0f0]"
          >
            <IconClose />
          </button>
        </div>

        {items.length > 0 && (
          <div className="py-[16px] px-[24px] bg-[#fdf8f7] border-b border-[#f5e6e3]">
            <p className="text-[14px] text-[#222] mb-[8px]">
              {shippingRemaining === 0 ? (
                <span className="font-semibold text-[#2e7d32]">Congratulations! You get free shipping.</span>
              ) : (
                <>
                  Spend <strong className="text-[#F15B41]">{formatPrice(shippingRemaining)}</strong> more to get <strong>Free Shipping</strong>
                </>
              )}
            </p>
            <div className="h-[6px] bg-[#e5e5e5] rounded-[3px] overflow-hidden">
              <div
                className="h-full bg-[#F15B41] rounded-[3px] transition-[width] duration-300 ease-in-out"
                style={{ width: `${shippingPercent}%` }}
              />
            </div>
          </div>
        )}

        {items.length > 0 && (
          <div className="flex border-b border-[#e5e5e5]">
            <button
              onClick={() => toggleTab('note')}
              className={`flex-1 py-[12px] px-0 flex items-center justify-center gap-[6px] text-[13px] font-semibold border-none cursor-pointer border-r border-[#e5e5e5] transition-colors duration-150 ${
                activeTab === 'note' ? 'bg-[#f5f5f5] text-[#F15B41]' : 'bg-transparent text-[#222]'
              }`}
            >
              <span className="text-[16px]">✎</span> Note
            </button>
            <button
              onClick={() => toggleTab('shipping')}
              className={`flex-1 py-[12px] px-0 flex items-center justify-center gap-[6px] text-[13px] font-semibold border-none cursor-pointer border-r border-[#e5e5e5] transition-colors duration-150 ${
                activeTab === 'shipping' ? 'bg-[#f5f5f5] text-[#F15B41]' : 'bg-transparent text-[#222]'
              }`}
            >
              <IconShipping /> Shipping
            </button>
            <button
              onClick={() => toggleTab('coupon')}
              className={`flex-1 py-[12px] px-0 flex items-center justify-center gap-[6px] text-[13px] font-semibold border-none cursor-pointer transition-colors duration-150 ${
                activeTab === 'coupon' ? 'bg-[#f5f5f5] text-[#F15B41]' : 'bg-transparent text-[#222]'
              }`}
            >
              <IconCoupon /> Coupon
            </button>
          </div>
        )}

        {activeTab === 'note' && <NotePanel onClose={() => setActiveTab('none')} />}
        {activeTab === 'shipping' && <ShippingPanel onClose={() => setActiveTab('none')} />}
        {activeTab === 'coupon' && <CouponPanel onClose={() => setActiveTab('none')} />}

        <div className="flex-1 overflow-y-auto p-[24px]">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-[40px] px-0">
              <span className="text-[48px] text-[#ccc] mb-[16px]">🛒</span>
              <p className="text-[18px] font-semibold text-[#222] mb-[8px]">Your cart is empty</p>
              <p className="text-[14px] text-[#777] mb-[24px]">Looks like you haven&apos;t added any items yet.</p>
              <Link
                href={shopHref}
                onClick={closeDrawer}
                className="py-[12px] px-[28px] bg-[#222] text-white text-[14px] font-semibold rounded-[40px] no-underline transition-colors duration-150 hover:bg-[#F15B41]"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.productId}-${item.variantId}`}
                className="flex gap-[16px] py-[16px] px-0 border-b border-[#f0f0f0]"
              >
                <Link
                  href={`${productHrefBase}/${item.slug}`}
                  onClick={closeDrawer}
                  className="w-[80px] h-[80px] rounded-[6px] overflow-hidden relative bg-[#f5f5f5] shrink-0"
                >
                  <Image
                    src={item.image || '/placeholder.png'}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <Link
                    href={`${productHrefBase}/${item.slug}`}
                    onClick={closeDrawer}
                    className="text-[15px] font-medium text-[#222] no-underline block truncate mb-[4px] hover:text-[#F15B41] transition-colors"
                  >
                    {item.name}
                  </Link>

                  {(item.color || item.size) && (
                    <p className="text-[13px] text-[#888] mb-[8px]">
                      {[item.color, item.size].filter(Boolean).join(' / ')}
                    </p>
                  )}

                  <p className="text-[15px] font-bold text-[#222] mb-[10px]">
                    {formatPrice(item.price)}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-[#e5e5e5] rounded-[4px] overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                        className="w-[28px] h-[28px] flex items-center justify-center bg-transparent border-none text-[16px] cursor-pointer hover:bg-[#f0f0f0]"
                      >
                        -
                      </button>
                      <span className="w-[32px] text-center text-[13px] font-semibold text-[#222]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                        className="w-[28px] h-[28px] flex items-center justify-center bg-transparent border-none text-[16px] cursor-pointer hover:bg-[#f0f0f0]"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.productId, item.variantId)}
                      className="text-[13px] text-[#999] bg-transparent border-none cursor-pointer underline hover:text-[#e53935]"
                    >
                      remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-[#e5e5e5] py-[20px] px-[24px]">
            <div className="flex items-center justify-between mb-[6px]">
              <span className="text-[16px] font-bold text-[#666]">Subtotal</span>
              <span className="text-[16px] font-semibold text-[#222]">{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex items-center justify-between mb-[6px] text-[#059669]">
                <span className="text-[14px] font-medium">Discount ({couponCode})</span>
                <span className="text-[14px] font-semibold">-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex items-center justify-between mb-[6px]">
              <span className="text-[22px] font-bold text-[#222]">Total</span>
              <span className="text-[20px] font-bold text-[#F15B41]">{formatPrice(total)}</span>
            </div>
            <p className="text-[14px] text-[#777] mb-[18px]">Taxes and delivery fee calculated at checkout</p>

            <div className="flex gap-[12px]">
              <Link
                href="/cart"
                onClick={closeDrawer}
                className="flex-1 text-center py-[14px] px-0 border-[1.5px] border-[#222] rounded-[40px] text-[15px] font-semibold text-[#222] no-underline transition-all duration-250 ease-in-out hover:bg-[#222] hover:text-[#fff]"
              >
                View cart
              </Link>
              <Link
                href="/checkout"
                onClick={closeDrawer}
                className="flex-1 text-center py-[14px] px-0 bg-[#F15B41] text-white border-none rounded-[40px] text-[15px] font-semibold no-underline flex items-center justify-center transition-[background-color] duration-250 ease-in-out hover:bg-[#000]"
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
