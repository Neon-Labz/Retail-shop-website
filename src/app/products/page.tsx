import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ShopPageContent } from '@/features/shop/components/ShopPageContent';

export const metadata: Metadata = {
  title: 'Products - RKF Wholesale & Retail Distributer',
  description: 'Browse our complete catalog of products at wholesale and retail prices.',
};

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container-main py-[4rem] text-center text-[1.6rem] text-body">Loading...</div>}>
      <ShopPageContent basePath="/products" title="PRODUCTS" breadcrumbLabel="Products" />
    </Suspense>
  );
}
