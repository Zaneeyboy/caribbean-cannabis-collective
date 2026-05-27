'use client';

import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import Badge from '@/components/ui/Badge';
import Image from 'next/image';
import { cfImageUrl } from '@/lib/cloudflare-images';
import Link from 'next/link';
import { useState } from 'react';
import { ShoppingCart, ArrowLeft, Check } from 'lucide-react';
import type { Product } from '@/lib/products';

export default function ProductDetail({ product }: { product: Product }) {
  const { addItem } = useCartStore();

  // Derive unique colors and sizes from all variants
  const colors = [...new Set(product.variants.map((v) => v.color).filter(Boolean))] as string[];
  const allSizes = [...new Set(product.variants.map((v) => v.size).filter(Boolean))] as string[];
  const hasColors = colors.length > 0;
  const hasSizes = allSizes.length > 0;

  // Track color and size independently so switching color can reset invalid size
  const [selectedColor, setSelectedColor] = useState<string | null>(colors.length === 1 ? colors[0] : null);
  const [selectedSize, setSelectedSize] = useState<string | null>(allSizes.length === 1 ? allSizes[0] : null);
  const [mainImage, setMainImage] = useState(0);
  const [added, setAdded] = useState(false);

  const displayPrice = product.salePriceCents ?? product.priceCents;
  const isSale = !!product.salePriceCents;

  // Sizes available for the currently selected color
  const availableSizes = selectedColor
    ? ([
        ...new Set(
          product.variants
            .filter((v) => v.color === selectedColor)
            .map((v) => v.size)
            .filter(Boolean),
        ),
      ] as string[])
    : allSizes;

  // Images to display — switch based on selected color
  const currentImages = selectedColor && product.colorImages?.[selectedColor] ? product.colorImages[selectedColor] : product.images;

  // Derive the specific variant from both selections
  const selectedVariant =
    product.variants.find((v) => {
      if (selectedColor && v.color !== selectedColor) return false;
      if (selectedSize && v.size !== selectedSize) return false;
      return true;
    }) ?? null;

  const isOutOfStock = selectedVariant ? selectedVariant.inventory === 0 : product.variants.every((v) => v.inventory === 0);

  const needsSize = hasSizes && availableSizes.length > 1;
  const canAdd = !isOutOfStock && (!hasColors || selectedColor !== null) && (!needsSize || selectedSize !== null) && selectedVariant !== null;

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    setMainImage(0); // reset to first image for new color
    const sizesForColor = product.variants
      .filter((v) => v.color === color)
      .map((v) => v.size)
      .filter(Boolean) as string[];
    if (selectedSize && !sizesForColor.includes(selectedSize)) setSelectedSize(null);
  };

  const handleAddToCart = () => {
    if (!selectedVariant || !canAdd) return;
    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      image: currentImages[0],
      priceCents: displayPrice,
      size: selectedVariant.size,
      color: selectedVariant.color,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className='max-w-7xl mx-auto px-4 md:px-8 py-12'>
      {/* Breadcrumb */}
      <nav className='mb-8 flex items-center gap-2 text-xs text-mist' aria-label='Breadcrumb'>
        <Link href='/shop' className='hover:text-lime transition-colors flex items-center gap-1'>
          <ArrowLeft size={12} aria-hidden />
          Back to Shop
        </Link>
        <span>/</span>
        <span className='capitalize text-ivory'>{product.category}</span>
        <span>/</span>
        <span className='text-cream'>{product.name}</span>
      </nav>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
        {/* Images */}
        <div>
          {/* Main image — updates when color changes */}
          <div className='relative aspect-square rounded-xl overflow-hidden bg-canopy border border-smoke mb-4'>
            <Image
              src={cfImageUrl(currentImages[mainImage] ?? currentImages[0], 'product')}
              alt={product.name}
              fill
              className='object-cover transition-opacity duration-200'
              sizes='(max-width: 768px) 100vw, 50vw'
              priority
            />
            {/* Badges */}
            <div className='absolute top-4 left-4 flex flex-col gap-2'>
              {isOutOfStock && <Badge variant='soldout' />}
              {!isOutOfStock && isSale && <Badge variant='sale' />}
              {!isOutOfStock && product.tags.includes('new') && !isSale && <Badge variant='new' />}
              {!isOutOfStock && product.tags.includes('bestseller') && <Badge variant='bestseller' />}
            </div>
          </div>

          {/* Thumbnails */}
          {currentImages.length > 1 && (
            <div className='flex gap-3'>
              {currentImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setMainImage(i)}
                  className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${mainImage === i ? 'border-gold' : 'border-smoke hover:border-gold/50'}`}
                  aria-label={`View image ${i + 1}`}
                >
                  <Image src={cfImageUrl(img, 'thumbnail')} alt='' fill className='object-cover' sizes='64px' aria-hidden />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <p className='text-xs font-bold tracking-[0.3em] uppercase text-gold mb-3'>{product.category}</p>
          <h1 className='font-heading text-3xl md:text-4xl text-cream mb-4 leading-tight'>{product.name}</h1>

          {/* Price */}
          <div className='flex items-baseline gap-3 mb-6'>
            <span className='text-2xl font-bold text-lime'>{formatPrice(displayPrice)}</span>
            {isSale && <span className='text-lg text-mist line-through'>{formatPrice(product.priceCents)}</span>}
          </div>

          {/* Description */}
          <p className='text-ivory leading-relaxed mb-8'>{product.description}</p>

          {/* Color selector */}
          {hasColors && colors.length > 1 && (
            <div className='mb-6'>
              <p className='text-xs font-bold tracking-widest uppercase text-mist mb-3'>
                Color: <span className='text-cream normal-case tracking-normal font-normal'>{selectedColor ?? <span className='text-gold/70 italic'>select a color</span>}</span>
              </p>
              <div className='flex flex-wrap gap-2'>
                {colors.map((color) => {
                  const hasStock = product.variants.some((v) => v.color === color && v.inventory > 0);
                  return (
                    <button
                      key={color}
                      onClick={() => handleColorChange(color)}
                      disabled={!hasStock}
                      className={`px-4 py-2 rounded-md text-sm border transition-all ${
                        selectedColor === color
                          ? 'border-gold bg-grove text-cream'
                          : !hasStock
                            ? 'border-smoke text-smoke line-through cursor-not-allowed'
                            : 'border-smoke text-mist hover:border-gold/60 hover:text-ivory'
                      }`}
                    >
                      {color}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Size selector */}
          {needsSize && (
            <div className='mb-8'>
              <p className='text-xs font-bold tracking-widest uppercase text-mist mb-3'>
                Size: <span className='text-cream normal-case tracking-normal font-normal'>{selectedSize ?? <span className='text-gold/70 italic'>select a size</span>}</span>
              </p>
              <div className='flex flex-wrap gap-2'>
                {availableSizes.map((size) => {
                  const variant = product.variants.find((v) => v.size === size && (!selectedColor || v.color === selectedColor));
                  const outOfStock = !variant || variant.inventory === 0;
                  return (
                    <button
                      key={size}
                      onClick={() => !outOfStock && setSelectedSize(size)}
                      disabled={outOfStock}
                      className={`w-12 h-12 rounded-md text-sm font-bold border transition-all ${
                        selectedSize === size
                          ? 'border-gold bg-grove text-cream'
                          : outOfStock
                            ? 'border-smoke text-smoke line-through cursor-not-allowed'
                            : 'border-smoke text-mist hover:border-gold/60 hover:text-ivory'
                      }`}
                      aria-label={`Size ${size}${outOfStock ? ' — sold out' : ''}`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Validation hint */}
          {!canAdd && !isOutOfStock && (
            <p className='text-xs text-gold/80 mb-4 italic'>
              {!selectedColor && hasColors && colors.length > 1 ? 'Please select a color to continue' : !selectedSize && needsSize ? 'Please select a size to continue' : ''}
            </p>
          )}

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            disabled={!canAdd || added}
            className={`w-full flex items-center justify-center gap-3 py-4 rounded-md text-sm font-bold tracking-widest uppercase transition-all ${
              added ? 'bg-lime/80 text-forest cursor-default' : !canAdd ? 'bg-smoke text-mist cursor-not-allowed' : 'bg-lime text-forest hover:bg-lime/90 active:scale-[0.99]'
            }`}
          >
            {added ? (
              <>
                <Check size={18} aria-hidden /> Added to Cart
              </>
            ) : isOutOfStock ? (
              'Sold Out'
            ) : (
              <>
                <ShoppingCart size={18} aria-hidden /> Add to Cart
              </>
            )}
          </button>

          {/* Shipping note */}
          <p className='text-xs text-mist mt-4 text-center'>Ships to the US & Caribbean · Free US shipping on orders over $75</p>
        </div>
      </div>
    </div>
  );
}
