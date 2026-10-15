import type { Metadata } from 'next';
import { WishlistPageContent } from '@/features/wishlist/components/WishlistPageContent';

export const metadata: Metadata = {
  title: 'Wishlist',
  description: 'Your saved products.',
};

export default function WishlistPage() {
  return <WishlistPageContent storefront="fashion" />;
}
