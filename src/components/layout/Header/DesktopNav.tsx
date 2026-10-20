'use client';

import { useState, useRef, useMemo, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { MegaMenu } from './MegaMenu';
import { DropdownMenu } from './DropdownMenu';
import { CategoriesCascadingMenu } from './CategoriesCascadingMenu';
import navigationData from '@/data/navigation.json';
import navigationGlasses from '@/data/navigation-glasses.json';
import navigationPlumbingSupplies from '@/data/navigation-plumbing-supplies.json';
import navigationBook from '@/data/navigation-book.json';
import navigationJewelry2 from '@/data/navigation-jewelry-2.json';
import navigationCoffee from '@/data/navigation-coffee.json';
import navigationCraftDecore from '@/data/navigation-craft-and-decore.json';
import navigationToys from '@/data/navigation-toys.json';
import navigationSocks from '@/data/navigation-socks.json';
import navigationPod from '@/data/navigation-pod.json';
import { getStorefrontFromPath } from '@/utils/storefront';
import { singleProductProducts } from '@/data/single-product-products';
import { activeWearProducts } from '@/data/active-wear-products';
import type { SliderProduct } from './MegaMenu';
import type { NavigationItem, MegaMenuColumn } from '@/types/common';

const SP_SHOP_MEGA_IMAGE = '/single -product/shop-mega-menu/shop-mega-menu-1.webp';
const SP_CATEGORY_IMAGE = (i: number) => `/single -product/categories-mega-menu/categories-mega-menu-${i + 1}.webp`;
const SP_SLUGS = singleProductProducts.map((p) => p.slug);
const SP_SLIDER_PRODUCTS = singleProductProducts as SliderProduct[];

const AW_SHOP_MEGA_IMAGE = '/active-wear/shop-mega-menu/shop-mega-menu-1.avif';
const AW_CATEGORY_IMAGE = (i: number) => `/active-wear/categories-mega-menu/categories-mega-menu-${i + 1}.webp`;
const AW_SLUGS = activeWearProducts.map((p) => p.slug);
const AW_SLIDER_PRODUCTS = activeWearProducts as SliderProduct[];

/* Backpack / Basketball reuse the fashion nav structure but swap the Shop promo
   image and Categories card images for their own assets. (Note the backpack shop
   image filename carries a "sjop" typo that exists on disk — preserve it.) */
const BP_SHOP_MEGA_IMAGE = '/backpack/shop-mega-menu/sjop-mega-menu-1.webp';
const BP_CATEGORY_IMAGE = (i: number) => `/backpack/categories-mega-menu/categories-mega-menu-${i + 1}.webp`;

const BB_SHOP_MEGA_IMAGE = '/basketball/shop-mega-menu/shop-mega-menu-1.webp';
const BB_CATEGORY_IMAGE = (i: number) => `/basketball/categories-mega-menu/categories-mega-menu-${i + 1}.webp`;

/* Swap only the Shop mega image and Categories card images to storefront assets;
   the Products mega-menu is left untouched. Every other storefront is unaffected. */
function withMegaMenuImages(
  items: NavigationItem[],
  shopImage: string,
  categoryImage: (i: number) => string,
): NavigationItem[] {
  return items.map((item) => {
    if (item.megaImage) {
      return { ...item, megaImage: { ...item.megaImage, src: shopImage } };
    }
    if (item.megaCategoryCards) {
      return {
        ...item,
        megaCategoryCards: item.megaCategoryCards.map((c, i) => ({ ...c, image: categoryImage(i) })),
      };
    }
    return item;
  });
}

/* Active Wear reuses the fashion nav structure but with its own data:
   Shop promo image, Categories card images, and the Products mega-menu links/
   slider point at active-wear assets/products. Isolated like withSingleProductData. */
function withActiveWearData(items: NavigationItem[]): NavigationItem[] {
  return items.map((item) => {
    if (item.megaImage) {
      return { ...item, megaImage: { ...item.megaImage, src: AW_SHOP_MEGA_IMAGE } };
    }
    if (item.megaCategoryCards) {
      return {
        ...item,
        megaCategoryCards: item.megaCategoryCards.map((c, i) => ({ ...c, image: AW_CATEGORY_IMAGE(i) })),
      };
    }
    if (item.megaProductSlider && item.megaMenu) {
      let k = 0;
      const megaMenu = item.megaMenu.map((col) => ({
        ...col,
        links: col.links.map((link) => {
          const href = `/products/${AW_SLUGS[k % AW_SLUGS.length]}`;
          k++;
          return { ...link, href };
        }),
      }));
      return { ...item, href: `/products/${AW_SLUGS[0]}`, megaMenu };
    }
    return item;
  });
}

/* Single Product reuses the fashion nav structure but with its own data:
   Shop promo image, Categories card images, and the Products mega-menu links/
   slider point at single-product products. Every other storefront sharing this
   nav is untouched. */
function withSingleProductData(items: NavigationItem[]): NavigationItem[] {
  return items.map((item) => {
    if (item.megaImage) {
      return { ...item, megaImage: { ...item.megaImage, src: SP_SHOP_MEGA_IMAGE } };
    }
    if (item.megaCategoryCards) {
      return {
        ...item,
        megaCategoryCards: item.megaCategoryCards.map((c, i) => ({ ...c, image: SP_CATEGORY_IMAGE(i) })),
      };
    }
    if (item.megaProductSlider && item.megaMenu) {
      let k = 0;
      const megaMenu = item.megaMenu.map((col) => ({
        ...col,
        links: col.links.map((link) => {
          const href = `/products/${SP_SLUGS[k % SP_SLUGS.length]}`;
          k++;
          return { ...link, href };
        }),
      }));
      return { ...item, href: `/products/${SP_SLUGS[0]}`, megaMenu };
    }
    return item;
  });
}

function IconChevronDown() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={16} height={16}>
      <path d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z" />
    </svg>
  );
}

const FALLBACK_CATEGORY_COLUMNS: MegaMenuColumn[] = [
  {
    title: 'Electronics',
    links: [
      { id: 'el-1', label: 'Audio & Headphones', href: '/shop?category=Electronics&subcategory=Audio+%26+Headphones' },
      { id: 'el-2', label: 'Laptops & Computers', href: '/shop?category=Electronics&subcategory=Laptops+%26+Computers' },
      { id: 'el-3', label: 'Smart Watches', href: '/shop?category=Electronics&subcategory=Smart+Watches' },
      { id: 'el-4', label: 'Smartphones', href: '/shop?category=Electronics&subcategory=Smartphones' },
      { id: 'el-5', label: 'Television', href: '/shop?category=Electronics&subcategory=Television' },
    ],
  },
  {
    title: 'Home & Kitchen',
    links: [
      { id: 'hk-1', label: 'Kitchen Appliances', href: '/shop?category=Home+%26+Kitchen&subcategory=Kitchen+Appliances' },
      { id: 'hk-2', label: 'Cookware & Dining', href: '/shop?category=Home+%26+Kitchen&subcategory=Cookware+%26+Dining' },
      { id: 'hk-3', label: 'Coffee Makers', href: '/shop?category=Home+%26+Kitchen&subcategory=Coffee+Makers' },
      { id: 'hk-4', label: 'Home Decor', href: '/shop?category=Home+%26+Kitchen&subcategory=Home+Decor' },
      { id: 'hk-5', label: 'Cleaning & Care', href: '/shop?category=Home+%26+Kitchen&subcategory=Cleaning+%26+Care' },
    ],
  },
  {
    title: 'Fashion',
    links: [
      { id: 'fa-1', label: "Men's Clothing", href: "/shop?category=Fashion&subcategory=Men's+Clothing" },
      { id: 'fa-2', label: "Women's Clothing", href: "/shop?category=Fashion&subcategory=Women's+Clothing" },
      { id: 'fa-3', label: 'Footwear', href: '/shop?category=Fashion&subcategory=Footwear' },
      { id: 'fa-4', label: 'Accessories', href: '/shop?category=Fashion&subcategory=Accessories' },
      { id: 'fa-5', label: 'Eyewear & Accessories', href: '/shop?category=Fashion&subcategory=Eyewear+%26+Accessories' },
    ],
  },
  {
    title: 'Sports & Outdoors',
    links: [
      { id: 'sp-1', label: 'Fitness & Gym', href: '/shop?category=Sports+%26+Outdoors&subcategory=Fitness+%26+Gym' },
      { id: 'sp-2', label: 'Strength Training', href: '/shop?category=Sports+%26+Outdoors&subcategory=Strength+Training' },
      { id: 'sp-3', label: 'Cycling', href: '/shop?category=Sports+%26+Outdoors&subcategory=Cycling' },
      { id: 'sp-4', label: 'Camping & Hiking', href: '/shop?category=Sports+%26+Outdoors&subcategory=Camping+%26+Hiking' },
      { id: 'sp-5', label: 'Yoga & Fitness', href: '/shop?category=Sports+%26+Outdoors&subcategory=Yoga+%26+Fitness' },
    ],
  },
];

export function DesktopNav() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [dbCategoryColumns, setDbCategoryColumns] = useState<MegaMenuColumn[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
  const pathname = usePathname();

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
          const cols: MegaMenuColumn[] = data.categories.slice(0, 4).map((cat: any) => ({
            title: cat.name,
            links: (cat.subcategories || []).map((sub: string, idx: number) => ({
              id: `${cat.slug || cat.id}-${idx}`,
              label: sub,
              href: `/shop?category=${encodeURIComponent(cat.name)}&subcategory=${encodeURIComponent(sub)}`,
            })),
          }));
          setDbCategoryColumns(cols);
        }
      })
      .catch((err) => {
        console.error('Error fetching categories for Products mega menu:', err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const productMegaColumns = dbCategoryColumns.length > 0 ? dbCategoryColumns : FALLBACK_CATEGORY_COLUMNS;
  const storefront = getStorefrontFromPath(pathname);
  const isSingleProduct = storefront === 'single-product';
  const isActiveWear = storefront === 'active-wear';
  const isBackpack = storefront === 'backpack';
  const isBasketball = storefront === 'basketball';
  const isGlasses = storefront === 'glasses';
  const isPlumbingSupplies = storefront === 'plumbing-supplies';
  const isBook = storefront === 'book';
  const isJewelry2 = storefront === 'jewelry-2';
  const isCoffee = storefront === 'coffee';
  const isCraftDecore = storefront === 'craft-and-decore';
  const isToys = storefront === 'toys';
  const isSocks = storefront === 'socks';
  const isPod = storefront === 'pod';
  const navItems = useMemo(() => {
    const base = navigationData as NavigationItem[];
    if (isSingleProduct) return withSingleProductData(base);
    if (isActiveWear) return withActiveWearData(base);
    if (isBackpack) return withMegaMenuImages(base, BP_SHOP_MEGA_IMAGE, BP_CATEGORY_IMAGE);
    if (isBasketball) return withMegaMenuImages(base, BB_SHOP_MEGA_IMAGE, BB_CATEGORY_IMAGE);
    if (isGlasses) return navigationGlasses as NavigationItem[];
    if (isPlumbingSupplies) return navigationPlumbingSupplies as NavigationItem[];
    if (isBook) return navigationBook as NavigationItem[];
    if (isJewelry2) return navigationJewelry2 as NavigationItem[];
    if (isCoffee) return navigationCoffee as NavigationItem[];
    if (isCraftDecore) return navigationCraftDecore as NavigationItem[];
    if (isToys) return navigationToys as NavigationItem[];
    if (isSocks) return navigationSocks as NavigationItem[];
    if (isPod) return navigationPod as NavigationItem[];
    return base;
  }, [isSingleProduct, isActiveWear, isBackpack, isBasketball, isGlasses, isPlumbingSupplies, isBook, isJewelry2, isCoffee, isCraftDecore, isToys, isSocks, isPod]);

  /* Plumbing Supplies themes its nav in the brand navy instead of the default
     black text + coral accent. Other storefronts keep the fashion defaults. */
  const navColor = isPlumbingSupplies ? '#0a2540' : '#222';
  const navAccent = isPlumbingSupplies ? '#3a5f8a' : '#F15B41';

  const handleMouseEnter = (id: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(id);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setActiveMenu(null), 150);
  };

  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '32px',
      }}
    >
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
        const itemLabel = isAboutUs ? 'About us' : item.label;
        const itemHref = isAboutUs ? '/pages/about' : (item.id === 'nav-products' ? '/shop' : item.href);

        return (
          <div
            key={item.id}
            style={{ position: 'static' }}
            onMouseEnter={() => handleMouseEnter(item.id)}
            onMouseLeave={handleMouseLeave}
          >
          <Link
            href={itemHref}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '17px',
              fontWeight: 500,
              color: activeMenu === item.id ? navAccent : navColor,
              textDecoration: 'none',
              padding: '8px 0',
              transition: 'color 150ms ease',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = navAccent; }}
            onMouseLeave={(e) => {
              if (activeMenu !== item.id) e.currentTarget.style.color = navColor;
            }}
          >
            {itemLabel}
            {/* Show chevron only for items that have dropdown/megamenu. Categories and About us are direct navigation links */}
            {!isAboutUs && item.id !== 'nav-categories' && (item.type === 'dropdown' || item.type === 'megamenu') && (
              <span
                style={{
                  display: 'inline-flex',
                  transition: 'transform 300ms ease',
                  transform: activeMenu === item.id ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              >
                <IconChevronDown />
              </span>
            )}
          </Link>

          {/* Original Categories cascading menu inside navbar commented out; moved to dedicated button near logo per request:
          {item.id === 'nav-categories' && activeMenu === item.id && (
            <CategoriesCascadingMenu onClose={() => setActiveMenu(null)} />
          )}
          */}

          {/* Mega Menu (Preserved for non-categories, do not remove) */}
          {item.id !== 'nav-categories' && item.type === 'megamenu' && (item.megaMenu || item.megaCategoryCards) && activeMenu === item.id && (
            <MegaMenu
              /* Original dummy template columns commented out; replaced with real categories as requested:
              columns={item.megaMenu}
              */
              columns={item.id === 'nav-products' ? productMegaColumns : item.megaMenu}
              promoImage={item.megaImage}
              showProductSlider={item.megaProductSlider}
              categoryCards={item.megaCategoryCards}
              /* Previous undefined sliderProducts fallback commented out as requested:
              sliderProducts={isSingleProduct ? SP_SLIDER_PRODUCTS : isActiveWear ? AW_SLIDER_PRODUCTS : undefined}
              */
              sliderProducts={isSingleProduct ? SP_SLIDER_PRODUCTS : isActiveWear ? AW_SLIDER_PRODUCTS : [
                {
                  id: '6ad5f6860e445000414fa0d5',
                  slug: 'gold-silver-plated-granted-charm-bracelet',
                  name: 'Gold & Silver Plated Granted Charm Bracelet (European Pandora Style)',
                  price: 1250,
                  compareAtPrice: 1550,
                  images: [{ src: 'https://pub-a517fd63737142cbb39ca30df8bc77f0.r2.dev/products/1792484317347-7da77223-4a96-4b72-b8e6-9cd39b1aa356.png' }],
                },
                {
                  id: '6ad5f6820e445000414fa0cf',
                  slug: 'mini-handheld-fan-daisy-flower-accent-with-removable-stand',
                  name: 'Mini Handheld Fan (Daisy Flower Accent with Removable Stand)',
                  price: 450,
                  compareAtPrice: 650,
                  images: [{ src: 'https://pub-a517fd63737142cbb39ca30df8bc77f0.r2.dev/products/1792407158549-a3f3ec62-1010-46dc-8868-547b807584d4.png' }],
                },
                {
                  id: '6ad5f67e0e445000414fa0c9',
                  slug: 'portable-desktop-fan-ultra-thin-folding-stand',
                  name: 'Portable Desktop Fan (Ultra-Thin Folding Stand)',
                  price: 475,
                  compareAtPrice: 600,
                  images: [{ src: 'https://pub-a517fd63737142cbb39ca30df8bc77f0.r2.dev/products/1792407167386-42072d33-a778-40dc-9045-1879d3235c02.png' }],
                },
                {
                  id: '6ad5f6750e445000414fa0c4',
                  slug: 'sweet-bunny-kids-stationery-set-with-coin-purse',
                  name: 'Sweet Bunny Kids Stationery Set with Coin Purse',
                  price: 240,
                  compareAtPrice: 320,
                  images: [{ src: 'https://pub-a517fd63737142cbb39ca30df8bc77f0.r2.dev/products/1792407140539-02d7d3ca-9078-4b58-9d90-dbd2c5dadc8a.png' }],
                },
              ]}
              sliderHrefBase={isSingleProduct || isActiveWear ? '/products' : undefined}
            />
          )}

          {/* Dropdown: Pages dropdown items (Contact, FAQ, Store Location, Wishlist, Compare, 404, Privacy, Terms, Refund) commented out as requested to show only About us:
          {item.type === 'dropdown' && item.children && activeMenu === item.id && (
            <DropdownMenu items={item.children} />
          )}
          */}
          {!isAboutUs && item.type === 'dropdown' && item.children && activeMenu === item.id && (
            <DropdownMenu items={item.children} />
          )}
        </div>
        );
      })}
    </nav>
  );
}
