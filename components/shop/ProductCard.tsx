'use client';

import { Product } from '@/lib/products';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import Badge from '@/components/ui/Badge';
import Image from 'next/image';
import { cfImageUrl } from '@/lib/cloudflare-images';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import QuickAddModal from './QuickAddModal';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isOutOfStock = product.variants.every((v) => v.inventory === 0);
  const isSale = !!product.salePriceCents;
  const isNew = product.tags.includes('new');
  const isBestseller = product.tags.includes('bestseller');

  const displayPrice = product.salePriceCents ?? product.priceCents;

  // Does the user need to make a choice before adding?
  const colors = [...new Set(product.variants.map((v) => v.color).filter(Boolean))];
  const sizes = [...new Set(product.variants.map((v) => v.size).filter(Boolean))];
  const needsSelection = colors.length > 1 || sizes.length > 1;

  const handleQuickAdd = () => {
    if (isOutOfStock) return;
    if (needsSelection) {
      setIsModalOpen(true);
      return;
    }
    // Single variant — add directly
    const defaultVariant = product.variants.find((v) => v.inventory > 0);
    if (!defaultVariant) return;
    addItem({
      productId: product.id,
      variantId: defaultVariant.id,
      name: product.name,
      image: product.images[0],
      priceCents: displayPrice,
      size: defaultVariant.size,
      color: defaultVariant.color,
    });
  };

  return (
    <>
      <article className='group bg-canopy rounded-lg overflow-hidden border border-smoke hover:border-gold hover:shadow-[0_0_20px_rgba(201,168,76,0.15)] transition-all duration-300 flex flex-col h-full shimmer-hover'>
        {/* Image */}
        <Link href={`/shop/${product.slug}`} className='relative block aspect-square bg-forest overflow-hidden' tabIndex={-1} aria-hidden>
          <Image
            src={cfImageUrl(product.images[0], 'card')}
            alt={product.name}
            fill
            className='object-cover group-hover:scale-105 transition-transform duration-500'
            sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
          />
          {/* Badges */}
          <div className='absolute top-3 left-3 flex flex-col gap-1.5'>
            {isOutOfStock && <Badge variant='soldout' />}
            {!isOutOfStock && isSale && <Badge variant='sale' />}
            {!isOutOfStock && isNew && !isSale && <Badge variant='new' />}
            {!isOutOfStock && isBestseller && !isNew && <Badge variant='bestseller' />}
          </div>
        </Link>

        {/* Info */}
        <div className='p-4 flex flex-col flex-1'>
          <Link href={`/shop/${product.slug}`} className='flex-1'>
            <p className='text-[10px] font-bold tracking-widest uppercase text-mist mb-1'>{product.category}</p>
            <h2 className='font-heading text-base text-cream leading-snug group-hover:text-lime transition-colors line-clamp-2'>{product.name}</h2>
          </Link>

          {/* Color count hint */}
          {colors.length > 1 && <p className='text-[10px] text-mist mt-1'>{colors.length} colors</p>}

          {/* Price + CTA */}
          <div className='flex items-center justify-between mt-3'>
            <div>
              <span className='font-bold text-lime text-sm'>{formatPrice(displayPrice)}</span>
              {isSale && <span className='ml-2 text-xs text-mist line-through'>{formatPrice(product.priceCents)}</span>}
            </div>

            <button
              onClick={handleQuickAdd}
              disabled={isOutOfStock}
              className='p-2 rounded-md bg-grove text-lime hover:bg-lime hover:text-forest transition-colors disabled:opacity-40 disabled:cursor-not-allowed'
              aria-label={needsSelection ? `Select options for ${product.name}` : `Add ${product.name} to cart`}
            >
              <ShoppingCart size={16} aria-hidden />
            </button>
          </div>
        </div>
      </article>

      <QuickAddModal product={product} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
