'use client';

import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { cfImageUrl } from '@/lib/cloudflare-images';
import Link from 'next/link';
import { useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { checkOutOfStockItems } from '@/app/actions/inventory';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalCents } = useCartStore();
  const drawerRef = useRef<HTMLDivElement>(null);
  const total = totalCents();

  // When the cart opens, silently validate inventory against live Firestore data.
  // Any items that are sold out or whose product was removed/deactivated are
  // removed automatically and the user is notified via toast.
  const validateInventory = useCallback(async () => {
    if (items.length === 0) return;
    try {
      const { outOfStockItems } = await checkOutOfStockItems(items);
      if (outOfStockItems.length === 0) return;
      outOfStockItems.forEach((item) => removeItem(item.productId, item.variantId));
      const noun = outOfStockItems.length === 1 ? 'item' : 'items';
      toast.error(`${outOfStockItems.length} sold-out ${noun} removed from your cart.`);
    } catch {
      // Non-critical — silently ignore if the check fails
    }
  }, [items, removeItem]);

  // Trap focus & close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    // Validate inventory each time the cart opens
    validateInventory();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, closeCart, validateInventory]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className='fixed inset-0 z-50 bg-black/60 backdrop-blur-sm backdrop-enter' onClick={closeCart} aria-hidden='true' />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role='dialog'
        aria-modal='true'
        aria-label='Shopping cart'
        className='fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-canopy border-l border-smoke flex flex-col cart-drawer-enter'
      >
        {/* Header */}
        <div className='flex items-center justify-between px-5 py-4 border-b border-smoke'>
          <div className='flex items-center gap-2'>
            <ShoppingBag size={18} className='text-lime' aria-hidden />
            <h2 className='font-display text-xl text-cream tracking-wider'>Your Cart</h2>
            {items.length > 0 && <span className='ml-1 bg-lime text-forest text-xs font-bold px-2 py-0.5 rounded-full'>{items.reduce((s, i) => s + i.quantity, 0)}</span>}
          </div>
          <button onClick={closeCart} className='p-1.5 rounded-md text-mist hover:text-cream hover:bg-grove transition-colors' aria-label='Close cart'>
            <X size={20} aria-hidden />
          </button>
        </div>

        {/* Body */}
        <div className='flex-1 overflow-y-auto px-5 py-4'>
          {items.length === 0 ? (
            <div className='flex flex-col items-center justify-center h-full text-center'>
              <ShoppingBag size={48} className='text-smoke mb-4' aria-hidden />
              <p className='font-heading text-lg text-ivory mb-2'>Your cart is empty</p>
              <p className='text-sm text-mist mb-6'>Add some gear and come back.</p>
              <button onClick={closeCart} className='px-6 py-2 bg-lime text-forest text-xs font-bold tracking-widest uppercase rounded-md hover:bg-lime/90 transition-colors'>
                Shop Now
              </button>
            </div>
          ) : (
            <ul className='space-y-4'>
              {items.map((item) => (
                <li key={`${item.productId}-${item.variantId}`} className='flex gap-3 bg-grove rounded-lg p-3'>
                  {/* Product image */}
                  <div className='relative w-16 h-16 rounded-md overflow-hidden bg-forest shrink-0'>
                    <Image src={cfImageUrl(item.image, 'thumbnail')} alt={item.name} fill className='object-cover' sizes='64px' />
                  </div>

                  {/* Item info */}
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium text-cream truncate'>{item.name}</p>
                    {(item.size || item.color) && <p className='text-xs text-mist mt-0.5'>{[item.size, item.color].filter(Boolean).join(' · ')}</p>}
                    <p className='text-sm font-bold text-lime mt-1'>{formatPrice(item.priceCents)}</p>

                    {/* Qty controls */}
                    <div className='flex items-center gap-2 mt-2'>
                      <button
                        onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                        className='p-1 rounded bg-smoke text-ivory hover:bg-gold hover:text-forest transition-colors'
                        aria-label='Decrease quantity'
                      >
                        <Minus size={12} aria-hidden />
                      </button>
                      <span className='text-xs font-bold text-cream w-5 text-center'>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                        className='p-1 rounded bg-smoke text-ivory hover:bg-gold hover:text-forest transition-colors'
                        aria-label='Increase quantity'
                      >
                        <Plus size={12} aria-hidden />
                      </button>
                      <button onClick={() => removeItem(item.productId, item.variantId)} className='ml-auto p-1 rounded text-mist hover:text-coral transition-colors' aria-label='Remove item'>
                        <Trash2 size={14} aria-hidden />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className='border-t border-smoke px-5 py-5 space-y-4'>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-ivory'>Subtotal</span>
              <div className='text-right'>
                <span className='font-bold text-cream'>{formatPrice(total)}</span>
                <span className='ml-1 text-[10px] font-bold tracking-widest text-mist align-middle'>USD</span>
              </div>
            </div>
            <p className='text-xs text-mist'>Shipping &amp; duties calculated at checkout.</p>
            <Link
              href='/cart'
              onClick={closeCart}
              className='block w-full text-center py-3 bg-lime text-forest text-sm font-bold tracking-widest uppercase rounded-md hover:bg-lime/90 transition-colors'
            >
              View Cart & Checkout
            </Link>
            <button onClick={closeCart} className='block w-full text-center text-xs text-mist hover:text-ivory transition-colors underline'>
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
