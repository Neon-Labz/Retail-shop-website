'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

/* ── Person Icon SVG (matches design from image) ── */
function IconUser() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={22} height={22}>
      <path d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22H18C18 18.6863 15.3137 16 12 16C8.68629 16 6 18.6863 6 22H4ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11Z" />
    </svg>
  );
}

function IconProfile() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function IconLogout() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function IconLogin() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10 17 15 12 10 7" />
      <line x1="15" y1="12" x2="3" y2="12" />
    </svg>
  );
}

function IconRegister() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <line x1="20" y1="8" x2="20" y2="14" />
      <line x1="23" y1="11" x2="17" y2="11" />
    </svg>
  );
}

interface AccountDropdownProps {
  className?: string;
  iconColor?: string;
  hoverColor?: string;
}

export function AccountDropdown({
  className = '',
  iconColor = '#222',
  hoverColor = '#F15B41',
}: AccountDropdownProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated, checkAuth, logout } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    router.push('/login');
  };

  const displayName =
    user?.firstName ||
    (user?.email ? user.email.split('@')[0] : 'User');

  return (
    <div
      ref={dropdownRef}
      className={`account-dropdown-wrap ${className}`}
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
    >
      {/* Account Icon Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Account menu"
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="account-btn"
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: iconColor,
          cursor: 'pointer',
          background: 'none',
          border: 'none',
          padding: 0,
          transition: 'color 150ms ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = hoverColor;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = iconColor;
        }}
      >
        <IconUser />
        {isAuthenticated && (
          <span
            style={{
              position: 'absolute',
              bottom: '-2px',
              right: '-2px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              border: '1.5px solid #fff',
            }}
          />
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="account-menu"
          style={{
            position: 'absolute',
            top: 'calc(100% + 12px)',
            right: 0,
            width: '220px',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            border: '1px solid #f0f0f0',
            zIndex: 9999,
            overflow: 'hidden',
            animation: 'accountFadeIn 150ms ease-out',
          }}
        >
          {isAuthenticated ? (
            /* ── Logged In: Profile + Logout ── */
            <>
              <div
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#fafafa',
                  borderBottom: '1px solid #f0f0f0',
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#111827',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {displayName}
                </p>
                <p
                  style={{
                    margin: '2px 0 0',
                    fontSize: '12px',
                    color: '#6b7280',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {user?.email}
                </p>
              </div>

              <div style={{ padding: '6px 0' }}>
                {/* 1. Profile */}
                <Link
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className="account-menu-item"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 16px',
                    fontSize: '14px',
                    color: '#374151',
                    textDecoration: 'none',
                    transition: 'background 150ms ease, color 150ms ease',
                  }}
                >
                  <span style={{ color: '#6b7280', display: 'flex' }}>
                    <IconProfile />
                  </span>
                  Profile
                </Link>

                {/* 2. Logout */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="account-menu-item account-logout-item"
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 16px',
                    fontSize: '14px',
                    color: '#ef4444',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: 'inherit',
                    transition: 'background 150ms ease',
                  }}
                >
                  <span style={{ color: '#ef4444', display: 'flex' }}>
                    <IconLogout />
                  </span>
                  Logout
                </button>
              </div>
            </>
          ) : (
            /* ── Not Logged In: Login + Register ── */
            <>
              <div
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#fafafa',
                  borderBottom: '1px solid #f0f0f0',
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#111827',
                  }}
                >
                  Welcome
                </p>
                <p
                  style={{
                    margin: '2px 0 0',
                    fontSize: '12px',
                    color: '#6b7280',
                  }}
                >
                  Manage account & orders
                </p>
              </div>

              <div style={{ padding: '6px 0' }}>
                {/* 1. Login */}
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="account-menu-item"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 16px',
                    fontSize: '14px',
                    color: '#374151',
                    textDecoration: 'none',
                    transition: 'background 150ms ease, color 150ms ease',
                  }}
                >
                  <span style={{ color: '#6b7280', display: 'flex' }}>
                    <IconLogin />
                  </span>
                  Login
                </Link>

                {/* 2. Register */}
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="account-menu-item"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 16px',
                    fontSize: '14px',
                    color: '#374151',
                    textDecoration: 'none',
                    transition: 'background 150ms ease, color 150ms ease',
                  }}
                >
                  <span style={{ color: '#6b7280', display: 'flex' }}>
                    <IconRegister />
                  </span>
                  Register
                </Link>
              </div>
            </>
          )}
        </div>
      )}

      <style jsx global>{`
        @keyframes accountFadeIn {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .account-menu-item:hover {
          background-color: #f3f4f6 !important;
          color: #111827 !important;
        }
        .account-logout-item:hover {
          background-color: #fef2f2 !important;
          color: #dc2626 !important;
        }
      `}</style>
    </div>
  );
}
export default AccountDropdown;
