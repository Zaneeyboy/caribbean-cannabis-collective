'use client';

import { Product } from '@/lib/products';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import Image from 'next/image';
import Link from 'next/link';
import { X, ShoppingCart, Check, ArrowRight, MoveDown } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

interface Props {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickAddModal({ product, isOpen, onClose }: Props) {
  const { addItem } = useCartStore();

  const colors = [...new Set(product.variants.map((v) => v.color).filter(Boolean))] as string[];
  const allSizes = [...new Set(product.variants.map((v) => v.size).filter(Boolean))] as string[];
  const hasColors = colors.length > 0;
  const hasSizes = allSizes.length > 0;

  const [selectedColor, setSelectedColor] = useState<string | null>(colors.length === 1 ? colors[0] : null);
  const [selectedSize, setSelectedSize] = useState<string | null>(allSizes.length === 1 ? allSizes[0] : null);
  const [added, setAdded] = useState(false);

  // Animation state â€” separate from isOpen so we can animate the exit
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  const displayPrice = product.salePriceCents ?? product.priceCents;
  const isSale = !!product.salePriceCents;

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

  const currentImage = (selectedColor && product.colorImages?.[selectedColor]?.[0]) ?? product.images[0];

  const selectedVariant =
    product.variants.find((v) => {
      if (selectedColor && v.color !== selectedColor) return false;
      if (selectedSize && v.size !== selectedSize) return false;
      return true;
    }) ?? null;

  const needsSize = hasSizes && availableSizes.length > 1;
  const isOutOfStock = selectedVariant ? selectedVariant.inventory === 0 : product.variants.every((v) => v.inventory === 0);
  const canAdd = !isOutOfStock && (!hasColors || selectedColor !== null) && (!needsSize || selectedSize !== null) && selectedVariant !== null;

  const needsColorSelect = hasColors && colors.length > 1 && !selectedColor;
  const needsSizeSelect = needsSize && !selectedSize;

  // Contextual step instruction â€” only shown when a selection is still required
  let instruction: string | null = null;
  if (!isOutOfStock && !canAdd) {
    if (needsColorSelect && needsSizeSelect) instruction = 'Choose a color, then select your size to continue';
    else if (needsColorSelect) instruction = 'Choose a color to continue';
    else if (needsSizeSelect) instruction = 'Now select your size';
  }

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
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
      image: currentImage,
      priceCents: displayPrice,
      size: selectedVariant.size,
      color: selectedVariant.color,
    });
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  // Mount â†’ wait one frame â†’ fade in. On close â†’ fade out â†’ unmount.
  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      const t = setTimeout(() => setVisible(true), 10);
      return () => clearTimeout(t);
    } else {
      setVisible(false);
      const t = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  // Reset selections each time the modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedColor(colors.length === 1 ? colors[0] : null);
      setSelectedSize(allSizes.length === 1 ? allSizes[0] : null);
      setAdded(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-0 z-60 flex items-end sm:items-center justify-center sm:p-4 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
      role='dialog'
      aria-modal='true'
      aria-labelledby='quick-add-title'
    >
      {/* Backdrop */}
      <div className='absolute inset-0 bg-forest/90 backdrop-blur-sm' onClick={onClose} aria-hidden='true' />

      {/* Panel â€” slides up from below */}
      <div
        className={`relative bg-canopy border border-smoke/60 w-full sm:max-w-2xl max-h-[92vh] sm:max-h-[88vh] overflow-y-auto transition-all duration-300 ease-out ${
          visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        {/* Close button */}
        <button onClick={onClose} className='absolute top-4 right-4 z-10 p-1.5 text-mist hover:text-cream transition-colors' aria-label='Close'>
          <X size={20} />
        </button>

        <div className='grid grid-cols-1 sm:grid-cols-2'>
          {/* Image */}
          <div className='relative aspect-square bg-forest'>
            <Image src={currentImage} alt={product.name} fill className='object-cover transition-opacity duration-300' sizes='(max-width: 640px) 100vw, 50vw' />
          </div>

          {/* Info panel */}
          <div className='p-6 flex flex-col'>
            <p className='text-[10px] font-bold tracking-[0.35em] uppercase text-lime mb-1'>{product.category}</p>
            <h2 id='quick-add-title' className='font-display text-2xl text-cream leading-none mb-2'>
              {product.name}
            </h2>

            {/* Price */}
            <div className='flex items-baseline gap-2 mb-4'>
              <span className='text-xl font-bold text-lime'>{formatPrice(displayPrice)}</span>
              {isSale && <span className='text-sm text-mist line-through'>{formatPrice(product.priceCents)}</span>}
            </div>

            {/* Step instruction â€” guides user, disappears when ready */}
            <div className={`overflow-hidden transition-all duration-300 ${instruction ? 'max-h-16 mb-4 opacity-100' : 'max-h-0 mb-0 opacity-0'}`} aria-live='polite'>
              <div className='flex items-center gap-2 px-3 py-2.5 border-l-2 border-gold/60 bg-grove/20 text-[11px] text-ivory/80 leading-snug'>
                <MoveDown size={11} className='shrink-0 text-gold/70' aria-hidden />
                <span>{instruction}</span>
              </div>
            </div>

            {/* Color selector */}
            {hasColors && colors.length > 1 && (
              <div className='mb-4'>
                <p className={`text-[10px] font-bold tracking-widest uppercase mb-2 transition-colors duration-200 ${needsColorSelect ? 'text-gold' : 'text-mist'}`}>
                  Color: <span className='normal-case tracking-normal font-normal text-cream'>{selectedColor ?? <span className='text-gold/60 italic'>not selected</span>}</span>
                </p>
                <div className='flex flex-wrap gap-2'>
                  {colors.map((color) => {
                    const hasStock = product.variants.some((v) => v.color === color && v.inventory > 0);
                    return (
                      <button
                        key={color}
                        onClick={() => handleColorChange(color)}
                        disabled={!hasStock}
                        className={`px-3 py-1.5 text-xs border transition-all duration-200 ${
                          selectedColor === color
                            ? 'border-lime bg-grove text-cream'
                            : !hasStock
                              ? 'border-smoke/30 text-smoke/40 cursor-not-allowed line-through'
                              : needsColorSelect
                                ? 'border-gold/40 text-ivory hover:border-lime hover:text-cream hover:bg-grove/30'
                                : 'border-smoke text-mist hover:border-lime/50 hover:text-ivory'
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
              <div className='mb-4'>
                <p className={`text-[10px] font-bold tracking-widest uppercase mb-2 transition-colors duration-200 ${needsSizeSelect && !needsColorSelect ? 'text-gold' : 'text-mist'}`}>
                  Size: <span className='normal-case tracking-normal font-normal text-cream'>{selectedSize ?? <span className='text-gold/60 italic'>not selected</span>}</span>
                </p>
                <div className='flex flex-wrap gap-1.5'>
                  {availableSizes.map((size) => {
                    const variant = product.variants.find((v) => v.size === size && (!selectedColor || v.color === selectedColor));
                    const outOfStock = !variant || variant.inventory === 0;
                    return (
                      <button
                        key={size}
                        onClick={() => !outOfStock && setSelectedSize(size)}
                        disabled={outOfStock}
                        className={`min-w-11 h-10 px-2 text-xs font-bold border transition-all duration-200 ${
                          selectedSize === size
                            ? 'border-lime bg-grove text-cream'
                            : outOfStock
                              ? 'border-smoke/30 text-smoke/40 cursor-not-allowed line-through'
                              : needsSizeSelect && !needsColorSelect
                                ? 'border-gold/40 text-ivory hover:border-lime hover:text-cream hover:bg-grove/30'
                                : 'border-smoke text-mist hover:border-lime/50 hover:text-ivory'
                        }`}
                        aria-label={`Size ${size}${outOfStock ? ', sold out' : ''}`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Add to cart â€” prominent, changes state clearly */}
            <div className='mt-auto flex flex-col gap-3 pt-5 border-t border-smoke/40'>
              <button
                onClick={handleAddToCart}
                disabled={added || isOutOfStock}
                className={`flex items-center justify-center gap-2.5 py-4 text-sm font-bold tracking-widest uppercase transition-all duration-300 ${
                  added
                    ? 'bg-lime text-forest'
                    : isOutOfStock
                      ? 'bg-smoke/30 text-mist cursor-not-allowed'
                      : canAdd
                        ? 'bg-lime text-forest hover:bg-lime/90 active:scale-[0.99] shadow-[0_0_24px_rgba(109,179,63,0.3)] hover:shadow-[0_0_36px_rgba(109,179,63,0.5)]'
                        : 'bg-transparent border border-smoke/40 text-smoke cursor-default'
                }`}
                aria-disabled={!canAdd && !isOutOfStock}
              >
                {added ? (
                  <>
                    <Check size={16} aria-hidden /> Added to Cart
                  </>
                ) : isOutOfStock ? (
                  'Sold Out'
                ) : canAdd ? (
                  <>
                    <ShoppingCart size={16} aria-hidden />
                    Add to Cart â€” {formatPrice(displayPrice)}
                  </>
                ) : (
                  <>
                    <ShoppingCart size={15} className='opacity-25' aria-hidden />
                    <span className='opacity-40'>Select options above</span>
                  </>
                )}
              </button>

              <Link
                href={`/shop/${product.slug}`}
                onClick={onClose}
                className='flex items-center justify-center gap-2 py-3 border border-smoke text-xs font-bold tracking-widest uppercase text-ivory hover:border-cream hover:text-cream transition-colors group'
              >
                View Full Details
                <ArrowRight size={12} className='group-hover:translate-x-0.5 transition-transform' aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
