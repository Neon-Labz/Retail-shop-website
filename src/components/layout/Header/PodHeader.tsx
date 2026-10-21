'use client';

import { AnnouncementBar } from './AnnouncementBar';
import { Logo } from './Logo';
import { DesktopNav } from './DesktopNav';
import { HeaderActions } from './HeaderActions';
import { MobileNav } from './MobileNav';
import { HeaderCategoriesButton } from './HeaderCategoriesButton';
import { HeaderLanguageCurrency } from './HeaderLanguageCurrency';
import { useUIStore } from '@/store/uiStore';

function IconMenu() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={24} height={24}>
      <path d="M3 4H21V6H3V4ZM3 11H21V13H3V11ZM3 18H21V20H3V18Z" />
    </svg>
  );
}

export function PodHeader() {
  const { openMobileMenu } = useUIStore();

  return (
    <>

      <header
        className="pd-main-header"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 200,
          backgroundColor: '#fff',
          height: '90px',
          overflow: 'visible',
        }}
      >
        <div
          className="container-main"
          style={{
            height: '100%',
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifySelf: 'start' }}>
            <button
              onClick={openMobileMenu}
              aria-label="Open menu"
              style={{
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#222',
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                padding: 0,
              }}
              className="pd-mobile-menu-btn"
            >
              <IconMenu />
            </button>

            <div className="pd-logo-desktop">
              <Logo href="/home/pod-shop" />
            </div>

            <div className="pd-header-categories-desktop">
              <HeaderCategoriesButton />
            </div>
          </div>

          <div className="pd-desktop-nav-wrapper">
            <DesktopNav />
          </div>

          <div className="pd-logo-mobile">
            <Logo href="/home/pod-shop" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '22px', justifySelf: 'end' }}>
            <div className="pd-header-lang-desktop">
              <HeaderLanguageCurrency />
            </div>
            <HeaderActions />
          </div>
        </div>
      </header>

      <MobileNav />

      <style>{`
        .pd-main-header {
          border-bottom: 1px solid #e5e5e5;
        }
        .pd-header-lang-desktop {
          display: flex;
          align-items: center;
        }
        @media (min-width: 992px) {
          .pd-main-header {
            position: -webkit-sticky !important;
            position: sticky !important;
            top: 0 !important;
            z-index: 200 !important;
            will-change: transform;
          }
        }
        .pd-logo-mobile {
          display: none;
        }
        @media (max-width: 991px) {
          .pd-header-lang-desktop {
            display: none !important;
          }
          .pd-header-categories-desktop {
            display: none !important;
          }
        }
        @media (max-width: 715px) {
          .pd-mobile-menu-btn {
            display: flex !important;
          }
          .pd-desktop-nav-wrapper {
            display: none !important;
          }
          .pd-logo-desktop {
            display: none !important;
          }
          .pd-logo-mobile {
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      `}</style>
    </>
  );
}
