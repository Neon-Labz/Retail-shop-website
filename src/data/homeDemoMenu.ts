import type { MegaMenuColumn } from '@/types/common';

/**
 * Demo lists shown under the "Home" dropdown mega menu.
 * Per user request: Only POD and Mega Store are active. All other demos are commented out below.
 */
export const HOME_DEMO_COLUMNS: MegaMenuColumn[] = [
  {
    title: 'Demo list 1',
    links: [
      {
        label: 'Mega Store',
        href: '/home/megastore-shop',
        id: 'hm-2',
      },
      /* ── Commented out other demo stores in Demo list 1 ── */
      // { label: 'Elegant Fashion', href: '/home/elegant-fashion-shop', id: 'hm-1' },
      // { label: 'Default Fashion', href: '/', id: 'hm-3' },
      // { label: 'Headphones', href: '/home/headphones-shop', id: 'hm-6' },
      // { label: 'Sneaker', href: '/home/sneaker-shop', id: 'hm-10' },
      // { label: 'Nutrition', href: '/home/nutrition-shop', id: 'hm-16' },
      // { label: 'Pizza', href: '/home/pizza-shop', id: 'hm-17' },
    ],
  },
  {
    title: 'Demo list 2',
    links: [
      {
        label: 'POD',
        href: '/home/pod-shop',
        id: 'hm-35',
      },
      /* ── Commented out other demo stores in Demo list 5 ── */
      // { label: 'Glasses', href: '/home/glasses-shop', id: 'hm-36' },
      // { label: 'Plumbing Supplies', href: '/home/plumbing-supplies-shop', id: 'hm-37' },
      // { label: 'Craft and Decore', href: '/home/craft-and-decore-shop', id: 'hm-38' },
      // { label: 'Socks', href: '/home/socks-shop', id: 'hm-40' },
      // { label: 'Toys', href: '/home/toys-shop', id: 'hm-41' },
      // { label: 'RTL Demo', href: '/home/rtl-demo-shop', id: 'hm-39' },
    ],
  },

  /* ── Commented out Demo list 2, 3, 4 per request ── */
  // {
  //   title: 'Demo list 2',
  //   links: [
  //     { label: 'Grocery Shop', href: '/home/grocery-shop', id: 'hm-19' },
  //     { label: 'Pet Food', href: '/home/pet-food-shop', id: 'hm-23' },
  //     { label: 'Skin Care', href: '/home/skin-care-shop', id: 'hm-24' },
  //     { label: 'Lipstain', href: '/home/lipstain-shop', id: 'hm-25' },
  //     { label: 'Jewelry 1', href: '/home/jewellery-shop', id: 'hm-26' },
  //     { label: 'Car Accessories', href: '/home/car-accessories-shop', id: 'hm-29' },
  //     { label: 'Furniture', href: '/home/furniture-shop', id: 'hm-33' },
  //   ],
  // },
  // {
  //   title: 'Demo list 3',
  //   links: [
  //     { label: 'Plant & Garden', href: '/home/plant-garden-shop', id: 'hm-34' },
  //     { label: 'Fashion 04', href: '/home/fashion-04-shop', id: 'hm-13' },
  //     { label: 'Boutique Fashion', href: '/home/boutique-fashion-shop', id: 'hm-4' },
  //     { label: 'Phone Case', href: '/home/phone-case-shop', id: 'hm-5' },
  //     { label: 'Smart Watches', href: '/home/smart-watches-shop', id: 'hm-7' },
  //     { label: 'Electronics store 2', href: '/home/electronics-store-2-shop', id: 'hm-8' },
  //     { label: 'Single Product', href: '/home/single-product-shop', id: 'hm-9' },
  //   ],
  // },
  // {
  //   title: 'Demo list 4',
  //   links: [
  //     { label: 'Footwear', href: '/home/footwear-shop', id: 'hm-11' },
  //     { label: 'Fashion 03', href: '/home/fashion-03-shop', id: 'hm-12' },
  //     { label: 'Activewear', href: '/home/active-wear-shop', id: 'hm-15' },
  //     { label: 'Coffee', href: '/home/coffee-shop', id: 'hm-18' },
  //     { label: 'Basketball', href: '/home/basketball-shop', id: 'hm-30' },
  //     { label: 'Backpack', href: '/home/backpack-shop', id: 'hm-22' },
  //     { label: 'Jewelry 2', href: '/home/jewelry-2-shop', id: 'hm-27' },
  //   ],
  // },
];
