'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { ColorSwatch } from '@/components/ui/ColorSwatch';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCompareStore } from '@/store/compareStore';
import { useUIStore } from '@/store/uiStore';
import { formatPrice } from '@/utils/formatPrice';
import { cn } from '@/utils/cn';
import type { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addItem } = useCartStore();
  const { toggleItem: toggleWishlist, isInWishlist } = useWishlistStore();
  const { toggleItem: toggleCompare } = useCompareStore();
  const { openQuickView } = useUIStore();

  const primaryImage = product.images[0]?.src || '/fashion/products/placeholder.jpg';
  const secondaryImage = product.images[1]?.src || primaryImage;
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    const variant = product.variants[0];
    if (!variant) return;
    addItem({
      productId: product.id,
      variantId: variant.id,
      name: product.name,
      slug: product.slug,
      image: variant.image,
      color: variant.color,
      size: variant.size,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      quantity: 1,
      vendor: product.vendor,
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist({
      productId: product.id,
      name: product.name,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      image: primaryImage,
      image2: secondaryImage,
      slug: product.slug,
      badge: product.badge,
      colors: product.colors.map(c => ({ name: c.name, value: c.value })),
      vendor: product.vendor,
    });
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleCompare(product);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    openQuickView(product);
  };

  return (
    <div
      className={cn('group relative', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image container */}
      {/* Previous 3:4 aspect ratio commented out as requested
      <Link href={`/products/${product.slug}`} className="block relative aspect-[3/4] overflow-hidden rounded-[var(--radius-md)] bg-bg-light mb-[1.2rem]">
      */}
      {/* Previous contain with padding commented out as requested
      <Link href={`/products/${product.slug}`} className="block relative aspect-square overflow-hidden rounded-[var(--radius-md)] bg-white border border-[#f0f0f0] p-3 mb-[1.2rem]">
      */}
      <Link href={`/products/${product.slug}`} className="block relative aspect-square overflow-hidden rounded-[var(--radius-md)] bg-white border border-[#f0f0f0] mb-[1.2rem]">
        {/* Previous contain objectFit commented out as requested
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          className={cn('object-contain p-2 transition-opacity duration-500', isHovered ? 'opacity-0' : 'opacity-100')}
          sizes="(max-width: 749px) 50vw, (max-width: 991px) 50vw, 33vw"
        />
        */}
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          className={cn('object-cover object-center transition-opacity duration-500', isHovered ? 'opacity-0' : 'opacity-100')}
          sizes="(max-width: 749px) 50vw, (max-width: 991px) 50vw, 33vw"
        />
        {/* Previous contain objectFit commented out as requested
        <Image
          src={secondaryImage}
          alt={`${product.name} alternate`}
          fill
          className={cn('object-contain p-2 transition-opacity duration-500', isHovered ? 'opacity-100' : 'opacity-0')}
          sizes="(max-width: 749px) 50vw, (max-width: 991px) 50vw, 33vw"
        />
        */}
        <Image
          src={secondaryImage}
          alt={`${product.name} alternate`}
          fill
          className={cn('object-cover object-center transition-opacity duration-500', isHovered ? 'opacity-100' : 'opacity-0')}
          sizes="(max-width: 749px) 50vw, (max-width: 991px) 50vw, 33vw"
        />

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-[1rem] start-[1rem] z-10">
            <Badge variant={product.badge}>
              {product.badge === 'sale' && 'Sale'}
              {product.badge === 'new' && 'New'}
              {product.badge === 'pre-order' && 'Pre Order'}
            </Badge>
          </div>
        )}

        {/* Countdown timer */}
        {product.countdownEnd && (
          <div className="absolute bottom-[1rem] start-[1rem] z-10 flex gap-[0.4rem]">
            <span className="bg-dark/80 text-white text-[1rem] px-[0.6rem] py-[0.3rem] rounded-[0.3rem]">324 Days</span>
            <span className="bg-dark/80 text-white text-[1rem] px-[0.6rem] py-[0.3rem] rounded-[0.3rem]">8 Hrs</span>
          </div>
        )}

        {/* Action buttons on hover */}
        <div className={cn(
          'absolute end-[1rem] top-[1rem] flex flex-col gap-[0.6rem] transition-all duration-300 z-10',
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[1rem]'
        )}>
          <button
            onClick={handleWishlist}
            className={cn(
              'w-[3.4rem] h-[3.4rem] bg-white rounded-full shadow-md flex items-center justify-center text-[1.4rem] hover:bg-dark hover:text-white transition-colors',
              inWishlist && 'bg-primary text-white'
            )}
            aria-label="Add to wishlist"
          >
            ♥
          </button>
          {/* Add to compare button removed/commented out as requested
          <button
            onClick={handleCompare}
            className="w-[3.4rem] h-[3.4rem] bg-white rounded-full shadow-md flex items-center justify-center text-[1.4rem] hover:bg-dark hover:text-white transition-colors"
            aria-label="Add to compare"
          >
            ⇄
          </button>
          */}
          <button
            onClick={handleQuickView}
            className="w-[3.4rem] h-[3.4rem] bg-white rounded-full shadow-md flex items-center justify-center text-[1.4rem] hover:bg-dark hover:text-white transition-colors"
            aria-label="Quick view"
          >
            👁
          </button>
        </div>

        {/* Add to cart button on hover */}
        <div className={cn(
          'absolute bottom-0 inset-x-0 p-[1rem] transition-all duration-300',
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[1rem]'
        )}>
          <button
            onClick={handleAddToCart}
            className="w-full bg-dark text-white text-[1.3rem] font-medium py-[1rem] rounded-[var(--radius-md)] hover:bg-dark-hover transition-colors"
          >
            Add to cart
          </button>
        </div>
      </Link>

      {/* Product info */}
      <div>
        <Link href={`/products/${product.slug}`} className="block">
          <h3 className="text-[1.4rem] font-medium text-heading line-clamp-1 mb-[0.4rem] hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-[0.8rem] mb-[0.6rem]">
          {product.compareAtPrice && (
            <span className="text-[1.3rem] text-body line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
          <span className={cn('text-[1.4rem] font-semibold', product.compareAtPrice ? 'text-sale' : 'text-heading')}>
            {formatPrice(product.price)}
          </span>
        </div>

        {product.colors.length > 0 && (
          <ColorSwatch colors={product.colors} maxVisible={3} size="sm" />
        )}
      </div>
    </div>
  );
}
