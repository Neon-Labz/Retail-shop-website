'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Drawer } from '@/components/ui/Drawer';
import { useUIStore } from '@/store/uiStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { getStorefrontFromPath, isGrocerySlug, isPetFoodSlug, isNutritionSlug, isMegastoreSlug, isPhoneCaseSlug, isSmartWatchesSlug, type Storefront } from '@/utils/storefront';
import { ALL_CATEGORIES } from './AllCategoriesButton';
import { MEGASTORE_CATEGORIES } from './MegastoreAllCategoriesButton';
import { HeaderLanguageCurrency } from './HeaderLanguageCurrency';
import { formatPrice } from '@/utils/formatPrice';

import navigationFashion from '@/data/navigation.json';
import navigationGrocery from '@/data/navigation-grocery.json';
import navigationPetFood from '@/data/navigation-pet-food.json';
import navigationNutrition from '@/data/navigation-nutrition.json';
import navigationMegastore from '@/data/navigation-megastore.json';
import navigationPhoneCase from '@/data/navigation-phone-case.json';
import navigationSmartWatches from '@/data/navigation-smart-watches.json';
import navigationFootwear from '@/data/navigation-footwear.json';
import navigationGlasses from '@/data/navigation-glasses.json';
import navigationPlumbingSupplies from '@/data/navigation-plumbing-supplies.json';
import navigationBook from '@/data/navigation-book.json';
import navigationJewelry2 from '@/data/navigation-jewelry-2.json';
import navigationCoffee from '@/data/navigation-coffee.json';
import navigationCraftDecore from '@/data/navigation-craft-and-decore.json';
import navigationToys from '@/data/navigation-toys.json';
import navigationSocks from '@/data/navigation-socks.json';
import navigationPod from '@/data/navigation-pod.json';

import type { NavigationItem, MegaMenuColumn } from '@/types/common';

/* ── Icons ── */

function IconPlus({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      fill="none"
      viewBox="0 0 10 10"
      width="16"
      height="16"
      style={{
        position: 'absolute',
        transition: 'opacity 350ms ease, transform 350ms ease',
        opacity: open ? 0 : 1,
        transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
      }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1 4.51a.5.5 0 000 1h3.5l.01 3.5a.5.5 0 001-.01V5.5l3.5-.01a.5.5 0 00-.01-1H5.5L5.49.99a.5.5 0 00-1 .01v3.5l-3.5.01H1z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconMinus({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      fill="none"
      viewBox="0 0 10 2"
      width="16"
      height="16"
      style={{
        position: 'absolute',
        transition: 'opacity 350ms ease, transform 350ms ease',
        opacity: open ? 1 : 0,
        transform: open ? 'rotate(0deg)' : 'rotate(-90deg)',
      }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M.5 1C.5.7.7.5 1 .5h8a.5.5 0 110 1H1A.5.5 0 01.5 1z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconHeart({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M12.001 4.52853C14.35 2.42 17.98 2.49 20.2426 4.75736C22.5053 7.02472 22.583 10.637 20.4786 12.993L11.9999 21.485L3.52138 12.993C1.41705 10.637 1.49571 7.01901 3.75736 4.75736C6.02157 2.49315 9.64519 2.41687 12.001 4.52853ZM18.827 6.1701C17.3279 4.66794 14.9076 4.60701 13.337 6.01687L12.0019 7.21524L10.6661 6.01781C9.09098 4.60597 6.67506 4.66808 5.17157 6.17157C3.68183 7.66131 3.60704 10.0473 4.97993 11.6232L11.9999 18.6543L19.0201 11.6232C20.3935 10.0467 20.319 7.66525 18.827 6.1701Z" />
    </svg>
  );
}

function IconUser({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22H18C18 18.6863 15.3137 16 12 16C8.68629 16 6 18.6863 6 22H4ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11Z" />
    </svg>
  );
}

function IconClose({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M12 10.5858L16.9497 5.63604L18.364 7.05025L13.4142 12L18.364 16.9497L16.9497 18.364L12 13.4142L7.05025 18.364L5.63604 16.9497L10.5858 12L5.63604 7.05025L7.05025 5.63604L12 10.5858Z" />
    </svg>
  );
}

/* ── Helpers ── */

function pickNav(storefront: Storefront): NavigationItem[] {
  switch (storefront) {
    case 'grocery':        return navigationGrocery as NavigationItem[];
    case 'pet-food':       return navigationPetFood as NavigationItem[];
    case 'nutrition':      return navigationNutrition as NavigationItem[];
    case 'megastore':      return navigationMegastore as NavigationItem[];
    case 'phone-case':     return navigationPhoneCase as NavigationItem[];
    case 'smart-watches':  return navigationSmartWatches as NavigationItem[];
    case 'footwear':       return navigationFootwear as NavigationItem[];
    case 'glasses':        return navigationGlasses as NavigationItem[];
    case 'plumbing-supplies': return navigationPlumbingSupplies as NavigationItem[];
    case 'book':           return navigationBook as NavigationItem[];
    case 'jewelry-2':      return navigationJewelry2 as NavigationItem[];
    case 'coffee':         return navigationCoffee as NavigationItem[];
    case 'craft-and-decore': return navigationCraftDecore as NavigationItem[];
    case 'toys':            return navigationToys as NavigationItem[];
    case 'socks':           return navigationSocks as NavigationItem[];
    case 'pod':             return navigationPod as NavigationItem[];
    default:               return navigationFashion as NavigationItem[];
  }
}

function storefrontAccent(storefront: Storefront) {
  switch (storefront) {
    case 'grocery':   return { primary: 'rgb(27, 128, 87)', text: 'rgb(27, 128, 87)' };
    case 'pet-food':  return { primary: 'rgb(10, 66, 83)',  text: 'rgb(10, 66, 83)' };
    case 'nutrition': return { primary: '#0e1a0a',          text: '#0e1a0a' };
    case 'megastore': return { primary: '#f26522',          text: '#111' };
    default:          return { primary: '#222',             text: '#222' };
  }
}

function wishlistHrefFor(storefront: Storefront): string {
  switch (storefront) {
    case 'grocery':        return '/grocery/wishlist';
    case 'pet-food':       return '/pet-food/wishlist';
    case 'nutrition':      return '/nutrition/wishlist';
    case 'megastore':      return '/megastore/wishlist';
    case 'phone-case':     return '/phone-case/wishlist';
    case 'smart-watches':  return '/smart-watches/wishlist';
    case 'footwear':       return '/wishlist';
    default:               return '/wishlist';
  }
}

function filterWishlistForStorefront(items: { slug: string }[], storefront: Storefront) {
  if (storefront === 'grocery')        return items.filter((i) => isGrocerySlug(i.slug));
  if (storefront === 'pet-food')       return items.filter((i) => isPetFoodSlug(i.slug));
  if (storefront === 'nutrition')      return items.filter((i) => isNutritionSlug(i.slug));
  if (storefront === 'megastore')      return items.filter((i) => isMegastoreSlug(i.slug));
  if (storefront === 'phone-case')     return items.filter((i) => isPhoneCaseSlug(i.slug));
  if (storefront === 'smart-watches')  return items.filter((i) => isSmartWatchesSlug(i.slug));
  return items.filter(
    (i) =>
      !isGrocerySlug(i.slug) &&
      !isPetFoodSlug(i.slug) &&
      !isNutritionSlug(i.slug) &&
      !isMegastoreSlug(i.slug) &&
      !isPhoneCaseSlug(i.slug) &&
      !isSmartWatchesSlug(i.slug),
  );
}

/* Per-storefront colors for the Categories tab — replaces the hard-coded grocery values
   that used to live inline in the Categories render block. */
function categoriesTheme(storefront: Storefront) {
  if (storefront === 'megastore') {
    return {
      iconCircleBg: '#f5f5f5',
      labelColor: '#111',
      l1ToggleColor: '#f26522',
      l2RowBg: '#fafafa',
      l3RowBg: '#f5f5f5',
      l2ToggleColor: '#555',
    };
  }
  /* grocery defaults */
  return {
    iconCircleBg: '#f0f5f0',
    labelColor: '#1B8057',
    l1ToggleColor: '#1B8057',
    l2RowBg: '#f9faf8',
    l3RowBg: '#f4f6f3',
    l2ToggleColor: '#555',
  };
}

/* ── Collapse — grid-template-rows 0fr→1fr, auto-sizes around nested content ── */

function Collapse({ open, children }: { open: boolean; children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateRows: open ? '1fr' : '0fr',
        opacity: open ? 1 : 0,
        transition:
          'grid-template-rows 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }}
    >
      <div style={{ overflow: 'hidden', minHeight: 0 }}>{children}</div>
    </div>
  );
}

/* ── Toggle icon wrapper (shared between Menu and Categories accordions) ── */

function ToggleIcon({ open, color = '#555' }: { open: boolean; color?: string }) {
  return (
    <span
      style={{
        position: 'relative',
        width: '16px',
        height: '16px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color,
      }}
    >
      <IconPlus open={open} />
      <IconMinus open={open} />
    </span>
  );
}

/* ── AccordionRow — used by the Menu tab ── */

interface AccordionRowProps {
  label: string;
  href?: string;
  isOpen: boolean;
  onToggle: () => void;
  onNavigate: () => void;
  accent: { primary: string; text: string };
  depth?: 0 | 1;
  hasChildren: boolean;
}

function AccordionRow({
  label, href, isOpen, onToggle, onNavigate, accent, depth = 0, hasChildren,
}: AccordionRowProps) {
  const paddingInline = depth === 0 ? '20px' : '36px';
  const fontSize     = depth === 0 ? '15px' : '14px';
  const color        = depth === 0 ? accent.text : accent.primary;

  return (
    <div style={{ display: 'flex', alignItems: 'stretch', justifyContent: 'space-between', borderBottom: '1px solid #eee' }}>
      {href ? (
        <Link
          href={href}
          onClick={onNavigate}
          style={{ flex: 1, display: 'flex', alignItems: 'center', padding: `16px ${paddingInline}`, fontSize, fontWeight: 500, color, textDecoration: 'none' }}
        >
          {label}
        </Link>
      ) : (
        <span style={{ flex: 1, display: 'flex', alignItems: 'center', padding: `16px ${paddingInline}`, fontSize, fontWeight: 500, color }}>
          {label}
        </span>
      )}
      {hasChildren && (
        <button
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-label={isOpen ? `Collapse ${label}` : `Expand ${label}`}
          style={{ width: '54px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <ToggleIcon open={isOpen} color={accent.text} />
        </button>
      )}
    </div>
  );
}

/* ── Main component ── */

export function MobileNav() {
  const { mobileMenuOpen, closeMobileMenu } = useUIStore();
  const pathname  = usePathname();
  const storefront = getStorefrontFromPath(pathname);
  const navItems   = pickNav(storefront);
  const accent     = storefrontAccent(storefront);
  const wishlistHref = wishlistHrefFor(storefront);
  const wishlistItems  = useWishlistStore((s) => s.items);
  const visibleWishlist = filterWishlistForStorefront(wishlistItems, storefront);

  /* Menu tab accordion state */
  const [openTop, setOpenTop] = useState<Record<string, boolean>>({});
  const [openCol, setOpenCol] = useState<Record<string, boolean>>({});
  const toggleTop = (id: string)  => setOpenTop((p) => ({ ...p, [id]: !p[id] }));
  const toggleCol = (key: string) => setOpenCol((p) => ({ ...p, [key]: !p[key] }));

  /* Live MongoDB categories and products for mobile navigation */
  const [dbCategories, setDbCategories] = useState<Array<{ id: string; name: string; slug: string; subcategories: string[] }>>([]);
  const [dbProducts, setDbProducts] = useState<Array<{ id: string; name: string; slug: string; price: number; compareAtPrice?: number | null; image: string }>>([]);

  useEffect(() => {
    let isMounted = true;

    fetch('/api/categories')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        if (!isMounted) return;
        if (data.categories && Array.isArray(data.categories) && data.categories.length > 0) {
          setDbCategories(
            data.categories.map((c: any) => ({
              id: c.id || c._id || c.name,
              name: c.name,
              slug: c.slug || c.name,
              subcategories: Array.isArray(c.subcategories) ? c.subcategories : [],
            }))
          );
        }
      })
      .catch((err) => console.error('Error fetching categories for MobileNav:', err));

    fetch('/api/products?limit=10')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        if (!isMounted) return;
        if (data.products && Array.isArray(data.products) && data.products.length > 0) {
          setDbProducts(
            data.products.map((p: any) => {
              const rawImg = p.images?.[0];
              const imgSrc = (typeof rawImg === 'string' ? rawImg : rawImg?.src) || '';
              return {
                id: p.id || p._id || p.slug,
                name: p.name,
                slug: p.slug,
                price: p.price,
                compareAtPrice: p.compareAtPrice,
                image: imgSrc,
              };
            })
          );
        }
      })
      .catch((err) => console.error('Error fetching products for MobileNav:', err));

    return () => {
      isMounted = false;
    };
  }, []);

  /* Grocery Categories tab state */
  const [activeTab,  setActiveTab]  = useState<'menu' | 'categories'>('menu');
  const [openCatL1,  setOpenCatL1]  = useState<Record<string, boolean>>({});
  const [openCatL2,  setOpenCatL2]  = useState<Record<string, boolean>>({});

  const close = () => {
    closeMobileMenu();
    setTimeout(() => {
      setOpenTop({});
      setOpenCol({});
      setActiveTab('menu');
      setOpenCatL1({});
      setOpenCatL2({});
    }, 400);
  };

  /* Storefronts that ship a Categories tab (grocery + megastore today). */
  const hasCategoriesTab = storefront === 'grocery' || storefront === 'megastore';

  /* Pick the categories dataset for the current storefront. The two arrays have
     slightly different icon shapes — grocery uses `icon: string` (image path),
     megastore uses `iconNode: ReactNode` — but the rest of the CategoryEntry
     shape (id/label/href/megaColumns/subItems) matches, so we use a structural
     union below in the render block. */
  type AnyCategoryEntry = {
    id: string;
    label: string;
    href: string;
    icon?: string;
    iconNode?: React.ReactNode;
    megaColumns?: { heading: string; items: Array<{ label: string; href: string }> }[];
    subItems?: Array<{ label: string; href: string; children?: Array<{ label: string; href: string }> }>;
  };
  const categoriesData: AnyCategoryEntry[] =
    storefront === 'megastore' ? (MEGASTORE_CATEGORIES as AnyCategoryEntry[]) : (ALL_CATEGORIES as AnyCategoryEntry[]);
  const catTheme = categoriesTheme(storefront);

  /* Build flat L2 list from a category entry */
  function getCatL2(cat: AnyCategoryEntry) {
    if (cat.megaColumns) {
      return cat.megaColumns.map((col, i) => ({
        key: `${cat.id}-${i}`,
        label: col.heading,
        href: cat.href,
        l3: col.items as Array<{ label: string; href: string }>,
      }));
    }
    if (cat.subItems) {
      return cat.subItems.map((sub, i) => ({
        key: `${cat.id}-${i}`,
        label: sub.label,
        href: sub.href,
        l3: (sub.children ?? []) as Array<{ label: string; href: string }>,
      }));
    }
    return [];
  }

  return (
    <Drawer isOpen={mobileMenuOpen} onClose={close} side="start" width="55rem">

      {/* ── Header ── */}
      {hasCategoriesTab ? (
        /* Storefronts with a Categories tab (grocery, megastore): [Menu] [Categories] × */
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px', borderBottom: '1px solid #eee', flexShrink: 0 }}>
          <button
            onClick={() => setActiveTab('menu')}
            style={{
              padding: '8px 20px',
              fontSize: '14px',
              fontWeight: 600,
              borderRadius: '40px',
              border: activeTab === 'menu' ? 'none' : '1.5px solid #d0d0d0',
              background: activeTab === 'menu' ? '#222' : 'transparent',
              color: activeTab === 'menu' ? '#fff' : '#222',
              cursor: 'pointer',
              transition: 'background 200ms ease, color 200ms ease',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            Menu
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            style={{
              padding: '8px 20px',
              fontSize: '14px',
              fontWeight: 600,
              borderRadius: '40px',
              border: activeTab === 'categories' ? 'none' : '1.5px solid #d0d0d0',
              background: activeTab === 'categories' ? '#222' : 'transparent',
              color: activeTab === 'categories' ? '#fff' : '#222',
              cursor: 'pointer',
              transition: 'background 200ms ease, color 200ms ease',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            Categories
          </button>
          <button
            onClick={close}
            aria-label="Close menu"
            style={{ marginLeft: 'auto', width: '44px', height: '44px', border: 'none', background: 'transparent', color: '#222', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <IconClose size={26} />
          </button>
        </div>
      ) : (
        /* Other storefronts: logo + close */
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 12px 18px 20px', borderBottom: '1px solid #eee' }}>
          <Link href="/" onClick={close} style={{ display: 'inline-flex' }}>
            <Image src="/fashion/logo/logo1.webp" alt="Ambaz" width={100} height={28} style={{ objectFit: 'contain' }} />
          </Link>
          <button
            onClick={close}
            aria-label="Close menu"
            style={{ width: '44px', height: '44px', marginRight: '-4px', border: 'none', background: 'transparent', color: accent.text, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <IconClose size={30} />
          </button>
        </div>
      )}

      {/* ── Menu tab ── */}
      {(!hasCategoriesTab || activeTab === 'menu') && (
        <>
          <nav>
            {navItems.map((item) => {
              /* Shop button commented out as requested because Shop and Products navigate to the same page:
              if (item.id === 'nav-shop') { ... }
              */
              if (item.id === 'nav-shop') return null;

              /* Blog button commented out as requested:
              if (item.id === 'nav-blog') return null;
              */
              if (item.id === 'nav-blog') return null;

              // Only Home, Categories, Products, and About us are shown per request:
              const isAboutUs = item.id === 'nav-pages';
              const isCategoriesItem = item.id === 'nav-categories';
              const isProductsItem = item.id === 'nav-products';
              const itemLabel = isAboutUs ? 'About us' : item.label;
              /* Original linkHref commented out:
              const linkHref = isAboutUs ? '/pages/about' : (item.href && item.href !== '#' ? item.href : undefined);
              */
              const linkHref = isAboutUs
                ? '/pages/about'
                : isProductsItem
                  ? '/shop'
                  : (item.href && item.href !== '#' ? item.href : undefined);

              /* Original static columns/categoryCards commented out; connected to MongoDB below:
              const columns: MegaMenuColumn[] = isAboutUs ? [] : (item.megaMenu ?? []);
              const flatChildren = isAboutUs ? [] : (item.children ?? []);
              const categoryCards = isAboutUs ? [] : (item.megaCategoryCards ?? []);
              const hasChildren = columns.length > 0 || flatChildren.length > 0 || categoryCards.length > 0;
              */
              const columns: MegaMenuColumn[] = isAboutUs
                ? []
                : isCategoriesItem && dbCategories.length > 0
                  ? dbCategories.map((cat) => ({
                      title: cat.name,
                      links: cat.subcategories.map((sub, idx) => ({
                        id: `${cat.id}-sub-${idx}`,
                        label: sub,
                        href: `/shop?category=${encodeURIComponent(cat.name)}&subcategory=${encodeURIComponent(sub)}`,
                      })),
                    }))
                  : isProductsItem
                    ? []
                    : (item.megaMenu ?? []);
              const flatChildren = isAboutUs ? [] : (item.children ?? []);
              const categoryCards = isAboutUs || isCategoriesItem ? [] : (item.megaCategoryCards ?? []);
              const hasChildren =
                columns.length > 0 ||
                flatChildren.length > 0 ||
                categoryCards.length > 0 ||
                (isProductsItem && dbProducts.length > 0);
              const isTopOpen = !!openTop[item.id];

              return (
                <div key={item.id}>
                  <AccordionRow
                    label={itemLabel}
                    href={linkHref}
                    isOpen={isTopOpen}
                    onToggle={() => toggleTop(item.id)}
                    onNavigate={close}
                    accent={accent}
                    depth={0}
                    hasChildren={hasChildren}
                  />
                  {hasChildren && (
                    <Collapse open={isTopOpen}>
                      {columns.map((col, ci) => {
                        const colKey = `${item.id}::${ci}`;
                        const isColOpen = !!openCol[colKey];
                        const hasLinks = col.links.length > 0;
                        const colHref = isCategoriesItem
                          ? `/shop?category=${encodeURIComponent(col.title)}`
                          : undefined;
                        return (
                          <div key={colKey}>
                            <AccordionRow
                              label={col.title}
                              href={colHref}
                              isOpen={isColOpen}
                              onToggle={() => toggleCol(colKey)}
                              onNavigate={close}
                              accent={accent}
                              depth={1}
                              hasChildren={hasLinks}
                            />
                            {hasLinks && (
                              <Collapse open={isColOpen}>
                                {col.links.map((l) => (
                                  <Link
                                    key={l.id}
                                    href={l.href}
                                    onClick={(e) => {
                                      if (l.comingSoon) {
                                        e.preventDefault();
                                      } else {
                                        close();
                                        window.scrollTo({ top: 0, behavior: 'instant' });
                                      }
                                    }}
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 52px', fontSize: '14px', fontWeight: 500, color: accent.text, textDecoration: 'none', borderBottom: '1px solid #f0f0f0', cursor: l.comingSoon ? 'default' : undefined }}
                                  >
                                    {l.label}
                                    {l.comingSoon && (
                                      <span style={{ fontSize: '10px', fontWeight: 600, color: '#fff', backgroundColor: 'rgba(107, 114, 128, 0.8)', padding: '2px 6px', borderRadius: '4px', letterSpacing: '0.3px', lineHeight: 1.4, flexShrink: 0 }}>
                                        Coming Soon
                                      </span>
                                    )}
                                  </Link>
                                ))}
                              </Collapse>
                            )}
                          </div>
                        );
                      })}
                      {/* Live MongoDB Products list inside mobile Products accordion */}
                      {isProductsItem && dbProducts.length > 0 && (
                        <div>
                          {dbProducts.map((prod) => (
                            <Link
                              key={prod.id}
                              href={`/products/${prod.slug}`}
                              onClick={() => {
                                close();
                                window.scrollTo({ top: 0, behavior: 'instant' });
                              }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '10px 20px 10px 32px',
                                textDecoration: 'none',
                                color: accent.text,
                                borderBottom: '1px solid #f0f0f0',
                              }}
                            >
                              <div
                                style={{
                                  position: 'relative',
                                  width: '44px',
                                  height: '44px',
                                  borderRadius: '6px',
                                  overflow: 'hidden',
                                  backgroundColor: '#f7f7f7',
                                  flexShrink: 0,
                                  border: '1px solid #eee',
                                }}
                              >
                                {prod.image ? (
                                  <Image
                                    src={prod.image}
                                    alt={prod.name}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    sizes="44px"
                                    unoptimized
                                  />
                                ) : null}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <p
                                  style={{
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    color: '#222',
                                    margin: '0 0 2px',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                  }}
                                >
                                  {prod.name}
                                </p>
                                <span className="product-price-text" style={{ fontSize: '13px', fontWeight: 700, color: '#F15B41' }}>
                                  {formatPrice(prod.price)}
                                </span>
                              </div>
                            </Link>
                          ))}
                          <Link
                            href="/shop"
                            onClick={close}
                            style={{
                              display: 'block',
                              padding: '14px 32px',
                              fontSize: '14px',
                              fontWeight: 600,
                              color: '#F15B41',
                              textDecoration: 'none',
                              borderBottom: '1px solid #eee',
                            }}
                          >
                            View All Products →
                          </Link>
                        </div>
                      )}
                      {flatChildren.map((c) => (
                        <Link
                          key={c.id}
                          href={c.href}
                          onClick={close}
                          style={{ display: 'block', padding: '14px 36px', fontSize: '14px', fontWeight: 500, color: accent.text, textDecoration: 'none', borderBottom: '1px solid #f0f0f0' }}
                        >
                          {c.label}
                        </Link>
                      ))}
                      {categoryCards.map((c) => (
                        <Link
                          key={c.id}
                          href={c.href}
                          onClick={close}
                          style={{ display: 'block', padding: '14px 36px', fontSize: '14px', fontWeight: 500, color: accent.text, textDecoration: 'none', borderBottom: '1px solid #f0f0f0' }}
                        >
                          {c.label}
                        </Link>
                      ))}
                    </Collapse>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Wishlist row */}
          <Link
            href={wishlistHref}
            onClick={close}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '18px 20px', borderBottom: '1px solid #eee', color: accent.text, textDecoration: 'none', fontSize: '15px', fontWeight: 500 }}
          >
            <span style={{ position: 'relative', display: 'inline-flex' }}>
              <IconHeart size={22} />
              <span
                style={{ position: 'absolute', top: '-8px', right: '-10px', minWidth: '18px', height: '18px', padding: '0 5px', borderRadius: '9999px', background: accent.primary, color: '#fff', fontSize: '10px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff', lineHeight: 1 }}
              >
                {visibleWishlist.length}
              </span>
            </span>
            Wishlist
          </Link>

          {/* Previous placement of language/currency selector above My account commented out as requested:
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid #eee',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#fafbfc',
            }}
          >
            <HeaderLanguageCurrency />
          </div>
          */}

          {/* My account block */}
          <div style={{ padding: '28px 20px 20px' }}>
            <h4 style={{ fontSize: '22px', fontWeight: 700, color: accent.text, margin: '0 0 18px' }}>My account</h4>
            <button
              type="button"
              onClick={close}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%', background: accent.primary, color: '#fff', border: 'none', borderRadius: '40px', padding: '15px 24px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', marginBottom: '12px' }}
            >
              <IconUser size={18} />
              Log in
            </button>
            <button
              type="button"
              onClick={close}
              style={{ display: 'block', width: '100%', background: 'transparent', color: accent.text, border: `1.5px solid ${accent.primary}`, borderRadius: '40px', padding: '14px 24px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', marginBottom: '20px' }}
            >
              Register
            </button>

            {/* Sri Lanka LKR | English language and currency moved to the very bottom as requested */}
            <div
              style={{
                paddingTop: '16px',
                borderTop: '1px solid #eee',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}
            >
              <HeaderLanguageCurrency />
            </div>
          </div>
        </>
      )}

      {/* ── Categories tab (grocery + megastore) ── */}
      {hasCategoriesTab && activeTab === 'categories' && (
        <div>
          {categoriesData.map((cat) => {
            const isL1Open  = !!openCatL1[cat.id];
            const hasChildren = !!(cat.megaColumns?.length || cat.subItems?.length);
            const l2Items   = getCatL2(cat);

            const iconCell = (
              <span style={{ position: 'relative', width: '32px', height: '32px', borderRadius: '50%', background: catTheme.iconCircleBg, overflow: 'hidden', flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: catTheme.labelColor }}>
                {cat.iconNode
                  ? cat.iconNode
                  : cat.icon
                    ? <Image src={cat.icon} alt={cat.label} fill style={{ objectFit: 'contain' }} sizes="32px" />
                    : null}
              </span>
            );

            const labelCell = (
              <span style={{ fontSize: '15px', fontWeight: 600, color: catTheme.labelColor, flex: 1, minWidth: 0 }}>
                {cat.label}
              </span>
            );

            const innerStyle: React.CSSProperties = {
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '12px 16px',
              minHeight: '56px',
              textDecoration: 'none',
            };

            return (
              <div key={cat.id} style={{ borderBottom: '1px solid #eee' }}>

                {/* L1 row */}
                <div style={{ display: 'flex', alignItems: 'stretch' }}>
                  {hasChildren ? (
                    <span style={innerStyle}>
                      {iconCell}
                      {labelCell}
                    </span>
                  ) : (
                    <Link href={cat.href} onClick={close} style={innerStyle}>
                      {iconCell}
                      {labelCell}
                    </Link>
                  )}
                  {hasChildren && (
                    <button
                      onClick={() => setOpenCatL1((p) => ({ ...p, [cat.id]: !p[cat.id] }))}
                      aria-expanded={isL1Open}
                      aria-label={isL1Open ? `Collapse ${cat.label}` : `Expand ${cat.label}`}
                      style={{ width: '52px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}
                    >
                      <ToggleIcon open={isL1Open} color={catTheme.l1ToggleColor} />
                    </button>
                  )}
                </div>

                {/* L2 + L3 */}
                {hasChildren && (
                  <Collapse open={isL1Open}>
                    {l2Items.map((l2) => {
                      const isL2Open = !!openCatL2[l2.key];
                      const hasL3    = l2.l3.length > 0;

                      return (
                        <div key={l2.key} style={{ background: catTheme.l2RowBg }}>

                          {/* L2 row */}
                          <div style={{ display: 'flex', alignItems: 'stretch', borderTop: '1px solid #efefef' }}>
                            {hasL3 ? (
                              <span style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '14px 16px 14px 50px', fontSize: '14px', fontWeight: 500, color: '#333', minHeight: '50px' }}>
                                {l2.label}
                              </span>
                            ) : (
                              <Link href={l2.href} onClick={close} style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '14px 16px 14px 50px', fontSize: '14px', fontWeight: 500, color: '#333', minHeight: '50px', textDecoration: 'none' }}>
                                {l2.label}
                              </Link>
                            )}
                            {hasL3 && (
                              <button
                                onClick={() => setOpenCatL2((p) => ({ ...p, [l2.key]: !p[l2.key] }))}
                                aria-expanded={isL2Open}
                                aria-label={isL2Open ? `Collapse ${l2.label}` : `Expand ${l2.label}`}
                                style={{ width: '52px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}
                              >
                                <ToggleIcon open={isL2Open} color={catTheme.l2ToggleColor} />
                              </button>
                            )}
                          </div>

                          {/* L3 links */}
                          {hasL3 && (
                            <Collapse open={isL2Open}>
                              {l2.l3.map((l3, idx) => (
                                <Link
                                  key={`${l2.key}-l3-${idx}`}
                                  href={l3.href}
                                  onClick={close}
                                  style={{ display: 'block', padding: '12px 16px 12px 66px', fontSize: '13px', fontWeight: 400, color: '#666', textDecoration: 'none', borderTop: '1px solid #efefef', background: catTheme.l3RowBg }}
                                >
                                  {l3.label}
                                </Link>
                              ))}
                            </Collapse>
                          )}
                        </div>
                      );
                    })}
                  </Collapse>
                )}
              </div>
            );
          })}
        </div>
      )}

    </Drawer>
  );
}
