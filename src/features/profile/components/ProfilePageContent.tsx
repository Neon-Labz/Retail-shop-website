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
        <p className="text-base sm:text-lg text-gray-500">Loading your profile...</p>
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
      <div className="bg-gradient-to-br from-white via-[#fdf4f0] to-[#fde8df] py-14 sm:py-16 text-center">
        <h1 className="text-3xl sm:text-5xl font-normal text-gray-900 tracking-wide">
          My Profile
        </h1>
      </div>

      <div className="max-w-[1320px] mx-auto px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 sm:gap-10 items-start">
          {/* ── Left Sidebar / User Card ── */}
          <aside className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 text-center shadow-xs">
            <div className="w-20 h-20 bg-[#fde8df] text-[#c96742] text-3xl font-bold rounded-full flex items-center justify-center mx-auto mb-4">
              {fullName.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">{fullName}</h2>
            <p className="text-sm text-gray-500 break-all mb-1">{user.email}</p>
            {user.phone && <p className="text-sm text-gray-500 mb-3">{user.phone}</p>}

            <div className="inline-block bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mt-1">
              {user.role === 'admin' ? 'Administrator' : 'Customer Account'}
            </div>

            <div className="h-px bg-gray-200 my-6" />

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-gray-50 rounded-lg p-3.5">
                <span className="block text-xl font-bold text-gray-900">{user.totalOrders || 0}</span>
                <span className="block text-xs text-gray-500 mt-1">Orders</span>
              </div>
              <div className="bg-gray-50 rounded-lg p-3.5">
                <span className="block text-xl font-bold text-gray-900">{formatPrice(user.totalSpent || 0)}</span>
                <span className="block text-xs text-gray-500 mt-1">Total Spent</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg py-3 text-sm font-semibold transition-colors cursor-pointer"
            >
              Log Out
            </button>
          </aside>

          {/* ── Right Content: Account Details & Saved Address ── */}
          <main className="bg-white border border-gray-200 rounded-xl p-6 sm:p-10 shadow-xs">
            <h3 className="text-xl font-bold text-gray-900 mb-5">Personal Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">First Name</span>
                <span className="text-base font-medium text-gray-900">{user.firstName || '—'}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Last Name</span>
                <span className="text-base font-medium text-gray-900">{user.lastName || '—'}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email Address</span>
                <span className="text-base font-medium text-gray-900">{user.email}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Phone Number</span>
                <span className="text-base font-medium text-gray-900">{user.phone || '—'}</span>
              </div>
            </div>

            <div className="h-px bg-gray-200 my-8" />

            <h3 className="text-xl font-bold text-gray-900 mb-5">Saved Address</h3>
            {defaultAddress ? (
              <div className="relative bg-gray-50 border border-gray-200 rounded-lg p-5 leading-relaxed">
                <div className="inline-block bg-sky-100 text-sky-700 text-xs font-bold px-2.5 py-0.5 rounded-full mb-3 uppercase tracking-wider">
                  Default Address
                </div>
                <p className="text-sm text-gray-700 my-1">
                  <strong>Street:</strong> {defaultAddress.line1}
                </p>
                <p className="text-sm text-gray-700 my-1">
                  <strong>Town / City:</strong> {defaultAddress.city}
                </p>
                <p className="text-sm text-gray-700 my-1">
                  <strong>Country / Region:</strong> {defaultAddress.country}
                </p>
              </div>
            ) : (
              <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-8 text-center text-sm text-gray-500">
                <p>No address saved yet.</p>
                <p className="text-xs text-gray-400 mt-1.5">
                  When you place an order at checkout, your address will automatically appear here.
                </p>
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-4 items-center">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 bg-[#111111] hover:bg-[#2d2d2d] text-white border-2 border-[#111111] hover:border-[#2d2d2d] px-7 py-3 text-sm font-semibold rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 no-underline cursor-pointer"
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
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-[#111111] text-[#111111] hover:text-white border-2 border-[#111111] px-7 py-3 text-sm font-semibold rounded-lg shadow-2xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 no-underline cursor-pointer"
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
