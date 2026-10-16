import type { Metadata } from 'next';
import { CollectionsPageContent } from '@/features/shop/components/CollectionsPageContent';

export const metadata: Metadata = {
  title: 'Categories',
  description: 'Browse all product categories.',
};

export default function CategoriesPage() {
  return <CollectionsPageContent />;
}
