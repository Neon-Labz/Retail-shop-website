'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { formatPrice } from '@/utils/formatPrice';

export function ProfilePageContent() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout, checkAuth } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!user) return;
    let isMounted = true;
    setOrdersLoading(true);

    const query = user.id ? `customerId=${user.id}` : `email=${encodeURIComponent(user.email)}`;
    fetch(`/api/orders?${query}&limit=10`)
      .then((r) => r.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.success && Array.isArray(data.orders)) {
          setOrders(data.orders);
        }
      })
      .catch((err) => {
        console.error('Error fetching order history:', err);
      })
      .finally(() => {
        if (isMounted) setOrdersLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-[1.6rem] text-[#666666]">Loading your profile...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const defaultAddress =
    Array.isArray(user.addresses) && user.addresses.length > 0
      ? user.addresses.find((a: any) => a.isDefault) || user.addresses[0]
      : null;

  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email.split('@')[0];

  return (
    <div className="w-full">
      {/* ── Hero Banner ── */}
      <div className="bg-gradient-to-br from-white via-[#fdf4f0] to-[#fde8df] py-[5rem] text-center">
        <h1 className="text-[3.8rem] font-normal text-[#222222] tracking-[0.01em]">
          My Profile
        </h1>
      </div>

      <div className="max-w-[1320px] mx-auto px-[1.6rem] pt-[5rem] pb-[8rem]">
        <div className="grid grid-cols-1 md:grid-cols-[32rem_1fr] gap-[3.5rem] items-start">
          {/* ── Left Sidebar / User Card ── */}
          <aside className="bg-white border border-[#ebebeb] rounded-[0.8rem] p-[3.5rem_2.5rem] text-center shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
            <div className="w-[8rem] h-[8rem] bg-[#fde8df] text-[#c96742] text-[3.2rem] font-bold rounded-full flex items-center justify-center mx-auto mb-[1.8rem]">
              {fullName.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-[2.2rem] font-semibold text-[#222222] mb-[0.6rem]">{fullName}</h2>
            <p className="text-[1.4rem] text-[#777777] mb-[2.4rem] break-all">{user.email}</p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-[1.2rem] py-[2rem] border-y border-[#eeeeee] mb-[2.4rem]">
              <div className="text-center">
                <span className="block text-[2.2rem] font-bold text-[#222222]">{user.totalOrders ?? orders.length ?? 0}</span>
                <span className="block text-[1.25rem] text-[#888888] mt-[0.3rem]">Total Orders</span>
              </div>
              <div className="text-center border-l border-[#eeeeee]">
                <span className="block text-[2.2rem] font-bold text-[#F15B41]">{formatPrice(user.totalSpent || 0)}</span>
                <span className="block text-[1.25rem] text-[#888888] mt-[0.3rem]">Total Spent</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full bg-[#fef2f2] hover:bg-[#fee2e2] text-[#dc2626] border border-[#fee2e2] rounded-[0.4rem] p-[1.2rem] text-[1.45rem] font-semibold transition-colors cursor-pointer"
            >
              Log Out
            </button>
          </aside>

          {/* ── Right Content: Account Details, Orders & Saved Address ── */}
          <main className="bg-white border border-[#ebebeb] rounded-[0.8rem] p-[2.5rem] sm:p-[4rem] shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col gap-[3.5rem]">
            {/* Personal Details */}
            <div>
              <h3 className="text-[2rem] font-bold text-[#222222] mb-[2rem]">Personal Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[2.2rem]">
                <div className="flex flex-col gap-[0.6rem]">
                  <span className="text-[1.3rem] font-semibold text-[#888888] uppercase tracking-[0.04em]">First Name</span>
                  <span className="text-[1.6rem] font-medium text-[#222222]">{user.firstName || '—'}</span>
                </div>
                <div className="flex flex-col gap-[0.6rem]">
                  <span className="text-[1.3rem] font-semibold text-[#888888] uppercase tracking-[0.04em]">Last Name</span>
                  <span className="text-[1.6rem] font-medium text-[#222222]">{user.lastName || '—'}</span>
                </div>
                <div className="flex flex-col gap-[0.6rem]">
                  <span className="text-[1.3rem] font-semibold text-[#888888] uppercase tracking-[0.04em]">Email Address</span>
                  <span className="text-[1.6rem] font-medium text-[#222222]">{user.email}</span>
                </div>
                <div className="flex flex-col gap-[0.6rem]">
                  <span className="text-[1.3rem] font-semibold text-[#888888] uppercase tracking-[0.04em]">Phone Number</span>
                  <span className="text-[1.6rem] font-medium text-[#222222]">{user.phone || '—'}</span>
                </div>
              </div>
            </div>

            <div className="h-[1px] bg-[#eeeeee]" />

            {/* Order History */}
            <div>
              <div className="flex items-center justify-between mb-[2rem]">
                <h3 className="text-[2rem] font-bold text-[#222222]">Order History</h3>
                <span className="text-[1.3rem] text-[#777] font-medium">
                  {orders.length} order{orders.length !== 1 ? 's' : ''}
                </span>
              </div>

              {ordersLoading ? (
                <div className="p-[3rem] text-center text-[#888] text-[1.4rem]">
                  Loading your order history...
                </div>
              ) : orders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#e5e5e5] text-[1.3rem] font-semibold text-[#666] uppercase tracking-[0.03em]">
                        <th className="pb-[1.2rem] pr-[1.6rem]">Order #</th>
                        <th className="pb-[1.2rem] px-[1.6rem]">Date</th>
                        <th className="pb-[1.2rem] px-[1.6rem]">Status</th>
                        <th className="pb-[1.2rem] px-[1.6rem]">Items</th>
                        <th className="pb-[1.2rem] pl-[1.6rem] text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f0f0f0] text-[1.45rem] text-[#333]">
                      {orders.map((ord) => (
                        <tr key={ord._id || ord.orderNumber} className="hover:bg-[#fafafa]">
                          <td className="py-[1.4rem] pr-[1.6rem] font-bold text-[#222]">
                            #{ord.orderNumber || ord._id.slice(-6)}
                          </td>
                          <td className="py-[1.4rem] px-[1.6rem] text-[#666]">
                            {new Date(ord.createdAt).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </td>
                          <td className="py-[1.4rem] px-[1.6rem]">
                            <span
                              className={`inline-block px-[1rem] py-[0.3rem] rounded-full text-[1.15rem] font-semibold uppercase ${
                                ord.status === 'delivered'
                                  ? 'bg-[#ecfdf5] text-[#059669]'
                                  : ord.status === 'cancelled'
                                  ? 'bg-[#fef2f2] text-[#dc2626]'
                                  : 'bg-[#fffbeb] text-[#d97706]'
                              }`}
                            >
                              {ord.status || 'Pending'}
                            </span>
                          </td>
                          <td className="py-[1.4rem] px-[1.6rem] text-[#666]">
                            {ord.items?.length || 1} item{(ord.items?.length || 1) !== 1 ? 's' : ''}
                          </td>
                          <td className="py-[1.4rem] pl-[1.6rem] text-right font-bold text-[#F15B41]">
                            {formatPrice(ord.total || 0)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-[#fbfbfb] border border-dashed border-[#d5d5d5] rounded-[0.6rem] p-[3rem] text-center text-[1.5rem] text-[#666666]">
                  <p>You haven&apos;t placed any orders yet.</p>
                  <p className="text-[1.3rem] text-[#999999] mt-[0.6rem]">
                    Your past purchases and tracking numbers will appear here once you place an order.
                  </p>
                </div>
              )}
            </div>

            <div className="h-[1px] bg-[#eeeeee]" />

            {/* Saved Address */}
            <div>
              <h3 className="text-[2rem] font-bold text-[#222222] mb-[2rem]">Saved Address</h3>
              {defaultAddress ? (
                <div className="relative bg-[#fafafa] border border-[#e9e9e9] rounded-[0.6rem] p-[2.5rem] leading-[1.7]">
                  <div className="inline-block bg-[#e0f2fe] text-[#0369a1] text-[1.15rem] font-bold px-[1rem] py-[0.2rem] rounded-[1rem] mb-[1.2rem] uppercase tracking-[0.03em]">
                    Default Address
                  </div>
                  <p className="text-[1.45rem] text-[#444444] my-[0.4rem]">
                    <strong>Street:</strong> {defaultAddress.line1}
                  </p>
                  <p className="text-[1.45rem] text-[#444444] my-[0.4rem]">
                    <strong>Town / City:</strong> {defaultAddress.city}
                  </p>
                  <p className="text-[1.45rem] text-[#444444] my-[0.4rem]">
                    <strong>Country / Region:</strong> {defaultAddress.country}
                  </p>
                </div>
              ) : (
                <div className="bg-[#fbfbfb] border border-dashed border-[#d5d5d5] rounded-[0.6rem] p-[3rem] text-center text-[1.5rem] text-[#666666]">
                  <p>No address saved yet.</p>
                  <p className="text-[1.3rem] text-[#999999] mt-[0.6rem]">
                    When you place an order at checkout, your address will automatically appear here.
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-[1.4rem] items-center pt-[1rem]">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-[0.8rem] bg-[#111111] hover:bg-[#2d2d2d] text-white border-2 border-[#111111] hover:border-[#2d2d2d] px-[2.8rem] py-[1.3rem] text-[1.45rem] font-semibold rounded-[0.6rem] shadow-[0_4px_14px_rgba(0,0,0,0.12)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.2)] hover:-translate-y-[2px] active:translate-y-0 transition-all duration-200 no-underline cursor-pointer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                <span>Browse Products</span>
              </Link>

              <Link
                href="/checkout"
                className="inline-flex items-center justify-center gap-[0.8rem] bg-white hover:bg-[#111111] text-[#111111] hover:text-white border-2 border-[#111111] px-[2.8rem] py-[1.3rem] text-[1.45rem] font-semibold rounded-[0.6rem] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:-translate-y-[2px] active:translate-y-0 transition-all duration-200 no-underline cursor-pointer"
              >
                <span>Go to Checkout</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
