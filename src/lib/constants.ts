export const SITE_NAME = 'RKF';
export const SITE_DESCRIPTION = 'RKF - Shop the latest products with fast delivery.';
export const SITE_URL = 'https://ambaz-nextjs-project.vercel.app';

export const FREE_SHIPPING_THRESHOLD = 150;
export const GIFT_WRAP_PRICE = 10;
export const PRODUCTS_PER_PAGE = 12;
export const MAX_COMPARE_ITEMS = 4;

export const SORT_OPTIONS = [
  { label: 'Featured', value: 'featured' },
  // { label: 'Best selling', value: 'best-selling' }, // Removed/commented out as requested
  { label: 'Alphabetically, A-Z', value: 'name-asc' },
  { label: 'Alphabetically, Z-A', value: 'name-desc' },
  { label: 'Price, low to high', value: 'price-asc' },
  { label: 'Price, high to low', value: 'price-desc' },
  { label: 'Date, old to new', value: 'date-asc' },
  { label: 'Date, new to old', value: 'newest' },
] as const;

export const POPULAR_SEARCHES = ['T-Shirt', 'Blue', 'Jacket', 'Dress', 'Shorts'];

export const GROCERY_POPULAR_SEARCHES = ['Fruits', 'Vegetables', 'Dairy', 'Organic', 'Meat'];

export const PET_FOOD_POPULAR_SEARCHES = ['Dog food', 'Cat food', 'Kitten', 'Puppy', 'Treats'];

export const MEGASTORE_POPULAR_SEARCHES = ['Headphones', 'Smart Watch', 'Laptop', 'Camera', 'Speaker'];

export const PIZZA_POPULAR_SEARCHES = ['Pepperoni', 'BBQ Pizza', 'Margherita', 'Veggie', 'Chicken'];

export const PLANT_GARDEN_POPULAR_SEARCHES = ['Indoor plants', 'Succulents', 'Pots', 'Seeds', 'Garden tools'];

export const SKIN_CARE_POPULAR_SEARCHES = ['Vitamin C', 'Serum', 'Moisturizer', 'Sunscreen', 'Retinol'];

export const JEWELLERY_POPULAR_SEARCHES = ['Rings', 'Necklaces', 'Diamond', 'Gold', 'Earrings'];

export const PHONE_CASE_POPULAR_SEARCHES = ['Phone Case', 'Leather Case', 'Slim Case', 'Wallet Case', 'Clear Case'];

export const SMART_WATCHES_POPULAR_SEARCHES = ['Smart Watch', 'Fitness Tracker', 'Luxury Watch', 'Digital Watch', 'Sports Watch'];

export const FOOTWEAR_POPULAR_SEARCHES = ['Sneakers', 'Running', 'Boots', 'Loafers', 'Sports Shoe'];

export const TRUST_BADGES = [
  { icon: 'truck', title: 'Free Shipping & Return', description: 'On orders over $100' },
  { icon: 'refresh', title: 'Easy Returns', description: '30-day return policy' },
  { icon: 'shield', title: 'Secure Payment', description: 'SSL encrypted' },
  { icon: 'headphones', title: '24/7 Online Support', description: 'Dedicated support' },
] as const;

export const STORE_EMAIL = 'rkfdistributors2002@gmail.com';
export const STORE_PHONE = '+94 78 991 5587';
export const STORE_ADDRESS = 'Play Ground Road, Kopay South, Jaffna';
export const STORE_HOURS = '9:00 AM – 6:00 PM (All Days)';
export const STORE_FACEBOOK = 'https://web.facebook.com/profile.php?id=61587176139721';
export const STORE_INSTAGRAM = 'https://www.instagram.com/rkfdistributorspvtltd/?hl=en';
export const STORE_TIKTOK = 'https://www.tiktok.com/@rkf.distributors.p';

export const SOCIAL_LINKS = [
  { name: 'Facebook', href: STORE_FACEBOOK, icon: 'facebook' },
  { name: 'Instagram', href: STORE_INSTAGRAM, icon: 'instagram' },
  { name: 'TikTok', href: STORE_TIKTOK, icon: 'tiktok' },
] as const;

export const FOOTER_LINKS = {
  quickLinks: [
    { label: 'Home', href: '/' },
    { label: 'Categories', href: '/categories' },
    { label: 'Products', href: '/shop' },
  ],
  company: [
    { label: 'Wishlist', href: '/wishlist' },
    { label: 'My account', href: '/profile' },
    { label: 'Cart', href: '/cart' },
    { label: 'About us', href: '/pages/about' },
  ],
  support: [
    { label: 'Privacy Policy', href: '/pages/privacy-policy' },
    { label: 'Terms of Service', href: '/pages/terms-of-service' },
    { label: 'Shipping Policy', href: '/pages/shipping-policy' },
    { label: 'Contact Us', href: '/pages/contact' },
  ],
} as const;

export const PAYMENT_METHODS = ['visa', 'mastercard', 'amex', 'paypal', 'discover', 'shopify'] as const;
