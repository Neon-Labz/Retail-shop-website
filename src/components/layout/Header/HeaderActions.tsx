'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUIStore } from '@/store/uiStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { getStorefrontFromPath, getStorefrontOfSlug } from '@/utils/storefront';
import { AccountDropdown } from './AccountDropdown';
import { NotificationDropdown } from './NotificationDropdown';
import { IconSearch, IconHeart } from '@/lib/icons';

function CountBadge({ count, color = '#F15B41' }: { count: number; color?: string }) {
  if (count <= 0) return null;

  return (
    <span
      className="absolute top-[-6px] right-[-8px] min-w-[18px] h-[18px] px-[4px] py-0 rounded-full text-white text-[10px] font-bold flex items-center justify-center leading-none"
      style={{ backgroundColor: color }}
    >
      {count}
    </span>
  );
}

const iconBtnClass =
  'relative flex items-center justify-center text-[#222] cursor-pointer bg-transparent border-none p-0 transition-[color] duration-150 ease-in-out';

function hoverIn(e: React.MouseEvent<HTMLElement>) { e.currentTarget.style.color = '#F15B41'; }
function hoverOut(e: React.MouseEvent<HTMLElement>) { e.currentTarget.style.color = '#222'; }

export function HeaderActions() {
  const { openSearch } = useUIStore();
  const wishlistItems = useWishlistStore((s) => s.items);

  const storefront = getStorefrontFromPath(usePathname());
  const storefrontWishlistItems = wishlistItems.filter((i) => getStorefrontOfSlug(i.slug) === storefront);

  const badgeColor = storefront === 'plumbing-supplies' ? '#0a2540' : '#F15B41';

  return (
    <>
      <div className="header-actions flex items-center gap-[18px] justify-self-end">
        <button onClick={openSearch} className={iconBtnClass} aria-label="Open search" onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
          <IconSearch />
        </button>

        <AccountDropdown className="fha-hide-mobile" />

        <Link href="/wishlist" className={`fha-hide-mobile ${iconBtnClass} no-underline`} aria-label="Wishlist" onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
          <IconHeart />
          <CountBadge count={storefrontWishlistItems.length} color={badgeColor} />
        </Link>

        <NotificationDropdown badgeColor={badgeColor} />
      </div>

      <style>{`
        @media (max-width: 715px) {
          .fha-hide-mobile {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
