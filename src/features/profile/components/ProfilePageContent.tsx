'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { formatPrice } from '@/utils/formatPrice';

const ACCENT = '#c96742';
const DARK = '#111111';

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
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontSize: '1.6rem', color: '#666' }}>Loading your profile...</p>
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
    <>
      {/* ── Hero Banner ── */}
      <div className="prof-hero">
        <h1 className="prof-hero-title">My Profile</h1>
      </div>

      <div className="container-main" style={{ paddingTop: '5rem', paddingBottom: '8rem' }}>
        <div className="prof-layout">
          {/* ── Left Sidebar / User Card ── */}
          <aside className="prof-card">
            <div className="prof-avatar">
              {fullName.charAt(0).toUpperCase()}
            </div>
            <h2 className="prof-name">{fullName}</h2>
            <p className="prof-email">{user.email}</p>
            {user.phone && <p className="prof-phone">{user.phone}</p>}

            <div className="prof-role-badge">
              {user.role === 'admin' ? 'Administrator' : 'Customer Account'}
            </div>

            <div className="prof-divider" />

            <div className="prof-stats-grid">
              <div className="prof-stat">
                <span className="prof-stat-num">{user.totalOrders || 0}</span>
                <span className="prof-stat-lbl">Orders</span>
              </div>
              <div className="prof-stat">
                <span className="prof-stat-num">{formatPrice(user.totalSpent || 0)}</span>
                <span className="prof-stat-lbl">Total Spent</span>
              </div>
            </div>

            <button type="button" onClick={handleLogout} className="prof-logout-btn">
              Log Out
            </button>
          </aside>

          {/* ── Right Content: Account Details & Saved Address ── */}
          <main className="prof-main-card">
            <h3 className="prof-section-title">Personal Details</h3>
            <div className="prof-info-grid">
              <div className="prof-info-item">
                <span className="prof-info-label">First Name</span>
                <span className="prof-info-value">{user.firstName || '—'}</span>
              </div>
              <div className="prof-info-item">
                <span className="prof-info-label">Last Name</span>
                <span className="prof-info-value">{user.lastName || '—'}</span>
              </div>
              <div className="prof-info-item">
                <span className="prof-info-label">Email Address</span>
                <span className="prof-info-value">{user.email}</span>
              </div>
              <div className="prof-info-item">
                <span className="prof-info-label">Phone Number</span>
                <span className="prof-info-value">{user.phone || '—'}</span>
              </div>
            </div>

            <div className="prof-divider" style={{ margin: '3.5rem 0 3rem' }} />

            <h3 className="prof-section-title">Saved Address</h3>
            {defaultAddress ? (
              <div className="prof-address-card">
                <div className="prof-address-badge">Default Address</div>
                <p className="prof-address-line">
                  <strong>Street:</strong> {defaultAddress.line1}
                </p>
                <p className="prof-address-line">
                  <strong>Town / City:</strong> {defaultAddress.city}
                </p>
                <p className="prof-address-line">
                  <strong>Country / Region:</strong> {defaultAddress.country}
                </p>
              </div>
            ) : (
              <div className="prof-empty-address">
                <p>No address saved yet.</p>
                <p className="prof-empty-tip">
                  When you place an order at checkout, your address will automatically appear here.
                </p>
              </div>
            )}

            <div style={{ marginTop: '3.5rem', display: 'flex', gap: '1.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <Link
                href="/shop"
                className="prof-shop-btn"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.8rem',
                  backgroundColor: '#111111',
                  color: '#ffffff',
                  padding: '1.3rem 2.8rem',
                  fontSize: '1.45rem',
                  fontWeight: 600,
                  borderRadius: '0.6rem',
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.12)',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  border: '2px solid #111111',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#2d2d2d';
                  e.currentTarget.style.borderColor = '#2d2d2d';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#111111';
                  e.currentTarget.style.borderColor = '#111111';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.12)';
                }}
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
                className="prof-checkout-btn"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.8rem',
                  backgroundColor: '#ffffff',
                  color: '#111111',
                  border: '2px solid #111111',
                  padding: '1.3rem 2.8rem',
                  fontSize: '1.45rem',
                  fontWeight: 600,
                  borderRadius: '0.6rem',
                  textDecoration: 'none',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#111111';
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.color = '#111111';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
                }}
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

      <style dangerouslySetInnerHTML={{ __html: `
        .prof-hero {
          background: linear-gradient(135deg, #ffffff 0%, #fdf4f0 50%, #fde8df 100%);
          padding: 5rem 0;
          text-align: center;
        }
        .prof-hero-title {
          font-size: 3.8rem;
          font-weight: 400;
          color: var(--color-heading);
          letter-spacing: 0.01em;
        }
        .prof-layout {
          display: grid;
          grid-template-columns: 32rem 1fr;
          gap: 3.5rem;
          align-items: start;
        }
        .prof-card {
          background: #ffffff;
          border: 1px solid #ebebeb;
          border-radius: 0.8rem;
          padding: 3.5rem 2.5rem;
          text-align: center;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
        }
        .prof-avatar {
          width: 8rem;
          height: 8rem;
          background: #fde8df;
          color: ${ACCENT};
          font-size: 3.2rem;
          font-weight: 700;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.8rem;
        }
        .prof-name {
          font-size: 2rem;
          font-weight: 700;
          color: var(--color-heading);
          margin-bottom: 0.4rem;
        }
        .prof-email {
          font-size: 1.4rem;
          color: #666;
          word-break: break-all;
          margin-bottom: 0.4rem;
        }
        .prof-phone {
          font-size: 1.4rem;
          color: #666;
          margin-bottom: 1.4rem;
        }
        .prof-role-badge {
          display: inline-block;
          background: #f3f4f6;
          color: #374151;
          font-size: 1.2rem;
          font-weight: 600;
          padding: 0.4rem 1.4rem;
          border-radius: 2rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-top: 0.5rem;
        }
        .prof-divider {
          height: 1px;
          background: #eee;
          margin: 2.5rem 0;
        }
        .prof-stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }
        .prof-stat {
          background: #fafafa;
          border-radius: 0.6rem;
          padding: 1.4rem 1rem;
        }
        .prof-stat-num {
          display: block;
          font-size: 2rem;
          font-weight: 700;
          color: var(--color-heading);
        }
        .prof-stat-lbl {
          display: block;
          font-size: 1.25rem;
          color: #888;
          margin-top: 0.3rem;
        }
        .prof-logout-btn {
          width: 100%;
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fee2e2;
          border-radius: 0.4rem;
          padding: 1.2rem;
          font-size: 1.45rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s;
        }
        .prof-logout-btn:hover {
          background: #fee2e2;
        }
        .prof-main-card {
          background: #ffffff;
          border: 1px solid #ebebeb;
          border-radius: 0.8rem;
          padding: 4rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
        }
        .prof-section-title {
          font-size: 2rem;
          font-weight: 700;
          color: var(--color-heading);
          margin-bottom: 2rem;
        }
        .prof-info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2.2rem;
        }
        .prof-info-item {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .prof-info-label {
          font-size: 1.3rem;
          font-weight: 600;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .prof-info-value {
          font-size: 1.6rem;
          color: var(--color-heading);
          font-weight: 500;
        }
        .prof-address-card {
          position: relative;
          background: #fafafa;
          border: 1px solid #e9e9e9;
          border-radius: 0.6rem;
          padding: 2.5rem;
          line-height: 1.7;
        }
        .prof-address-badge {
          display: inline-block;
          background: #e0f2fe;
          color: #0369a1;
          font-size: 1.15rem;
          font-weight: 700;
          padding: 0.2rem 1rem;
          border-radius: 1rem;
          margin-bottom: 1.2rem;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
        .prof-address-line {
          font-size: 1.45rem;
          color: #444;
          margin: 0.4rem 0;
        }
        .prof-empty-address {
          background: #fbfbfb;
          border: 1px dashed #d5d5d5;
          border-radius: 0.6rem;
          padding: 3rem;
          text-align: center;
          font-size: 1.5rem;
          color: #666;
        }
        .prof-empty-tip {
          font-size: 1.3rem;
          color: #999;
          margin-top: 0.6rem;
        }
        .prof-shop-btn {
          display: inline-flex !important;
          align-items: center;
          justify-content: center;
          gap: 0.8rem;
          background: #111111 !important;
          color: #ffffff !important;
          border: 2px solid #111111;
          padding: 1.3rem 2.8rem;
          font-size: 1.45rem;
          font-weight: 600;
          border-radius: 0.6rem;
          text-decoration: none !important;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .prof-shop-btn:hover {
          background: #2d2d2d !important;
          border-color: #2d2d2d;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        }
        .prof-checkout-btn {
          display: inline-flex !important;
          align-items: center;
          justify-content: center;
          gap: 0.8rem;
          background: #ffffff !important;
          color: #111111 !important;
          border: 2px solid #111111;
          padding: 1.3rem 2.8rem;
          font-size: 1.45rem;
          font-weight: 600;
          border-radius: 0.6rem;
          text-decoration: none !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .prof-checkout-btn:hover {
          background: #111111 !important;
          color: #ffffff !important;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }
        @media (max-width: 850px) {
          .prof-layout {
            grid-template-columns: 1fr;
          }
          .prof-info-grid {
            grid-template-columns: 1fr;
          }
          .prof-main-card {
            padding: 2.5rem;
          }
        }
      ` }} />
    </>
  );
}
