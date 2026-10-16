'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { formatPrice } from '@/utils/formatPrice';

export function ProfilePageContent() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

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
            <h2 className="text-[2rem] font-bold text-[#222222] mb-[0.4rem]">{fullName}</h2>
            <p className="text-[1.4rem] text-[#666666] break-all mb-[0.4rem]">{user.email}</p>
            {user.phone && <p className="text-[1.4rem] text-[#666666] mb-[1.4rem]">{user.phone}</p>}

            <div className="inline-block bg-[#f3f4f6] text-[#374151] text-[1.2rem] font-semibold px-[1.4rem] py-[0.4rem] rounded-[2rem] uppercase tracking-[0.05em] mt-[0.5rem]">
              {user.role === 'admin' ? 'Administrator' : 'Customer Account'}
            </div>

            <div className="h-[1px] bg-[#eeeeee] my-[2.5rem]" />

            <div className="grid grid-cols-2 gap-[1.5rem] mb-[2.5rem]">
              <div className="bg-[#fafafa] rounded-[0.6rem] p-[1.4rem_1rem]">
                <span className="block text-[2rem] font-bold text-[#222222]">{user.totalOrders || 0}</span>
                <span className="block text-[1.25rem] text-[#888888] mt-[0.3rem]">Orders</span>
              </div>
              <div className="bg-[#fafafa] rounded-[0.6rem] p-[1.4rem_1rem]">
                <span className="block text-[2rem] font-bold text-[#222222]">{formatPrice(user.totalSpent || 0)}</span>
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

          {/* ── Right Content: Account Details & Saved Address ── */}
          <main className="bg-white border border-[#ebebeb] rounded-[0.8rem] p-[2.5rem] sm:p-[4rem] shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
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

            <div className="h-[1px] bg-[#eeeeee] my-[3.5rem]" />

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

            <div className="mt-[3.5rem] flex flex-wrap gap-[1.4rem] items-center">
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
