'use client';

import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import { SHIPPING_ZONES, getShippingCost } from '@/lib/shipping';
import Image from 'next/image';
import { cfImageUrl } from '@/lib/cloudflare-images';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Loader2, Lock } from 'lucide-react';
import { useState } from 'react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalCents, shippingZone, setShippingZone } = useCartStore();
  const [selectedShippingOption, setSelectedShippingOption] = useState(SHIPPING_ZONES[shippingZone].options[0].id);
  const [loading, setLoading] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  const subtotal = totalCents();
  const shippingCost = getShippingCost(shippingZone, selectedShippingOption, subtotal);
  const total = subtotal + shippingCost;

  const zoneConfig = SHIPPING_ZONES[shippingZone];

  const handleZoneChange = (zone: 'US' | 'CARIBBEAN' | 'CANADA' | 'WORLDWIDE') => {
    setShippingZone(zone);
    setSelectedShippingOption(SHIPPING_ZONES[zone].options[0].id);
  };

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          shippingZone,
          shippingOptionId: selectedShippingOption,
        }),
      });
      const data = await res.json();
      if (data.url) {
        // Fade to a branded overlay before handing off to Stripe
        setTransitioning(true);
        setTimeout(() => {
          window.location.href = data.url;
        }, 750);
      } else {
        alert('Checkout failed. Please try again.');
        setLoading(false);
      }
    } catch {
      alert('Checkout failed. Please try again.');
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className='min-h-[60vh] flex flex-col items-center justify-center px-4 text-center animate-fade-in-up'>
        <ShoppingBag size={64} className='text-smoke mb-6' aria-hidden />
        <h1 className='font-display text-4xl text-cream mb-3'>Your Cart is Empty</h1>
        <p className='text-mist mb-8'>Looks like you haven't added anything yet.</p>
        <Link href='/shop' className='px-8 py-3 bg-lime text-forest text-sm font-bold tracking-widest uppercase rounded-md hover:bg-lime/90 transition-colors'>
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className='max-w-7xl mx-auto px-4 md:px-8 py-12 animate-fade-in-up'>
      {/* Checkout transition overlay — fades in before Stripe redirect */}
      {transitioning && (
        <div className='fixed inset-0 z-[100] bg-forest/95 backdrop-blur-sm flex flex-col items-center justify-center animate-fade-in'>
          <div className='w-16 h-16 rounded-full border-2 border-lime border-t-transparent animate-spin mb-8' aria-hidden />
          <p className='font-display text-3xl text-cream mb-2 tracking-wider'>Heading to Checkout</p>
          <div className='flex items-center gap-1.5 text-mist'>
            <Lock size={12} aria-hidden />
            <p className='text-xs tracking-widest'>Secure payment powered by Stripe</p>
          </div>
        </div>
      )}
      {/* Header */}
      <div className='mb-8'>
        <Link href='/shop' className='flex items-center gap-2 text-xs text-mist hover:text-lime transition-colors mb-4'>
          <ArrowLeft size={14} aria-hidden />
          Continue Shopping
        </Link>
        <h1 className='font-display text-6xl text-cream'>Your Cart</h1>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-12'>
        {/* Items */}
        <div className='lg:col-span-2 space-y-4'>
          {items.map((item) => (
            <div key={`${item.productId}-${item.variantId}`} className='flex gap-4 bg-canopy rounded-lg p-4 border border-smoke'>
              {/* Image */}
              <div className='relative w-20 h-20 rounded-lg overflow-hidden bg-forest shrink-0'>
                <Image src={cfImageUrl(item.image, 'thumbnail')} alt={item.name} fill className='object-cover' sizes='80px' />
              </div>

              {/* Info */}
              <div className='flex-1 min-w-0'>
                <h3 className='font-heading text-cream text-sm leading-snug mb-1 truncate'>{item.name}</h3>
                {(item.size || item.color) && <p className='text-xs text-mist mb-2'>{[item.size, item.color].filter(Boolean).join(' · ')}</p>}
                <p className='text-lime font-bold text-sm'>{formatPrice(item.priceCents)}</p>
              </div>

              {/* Qty + remove */}
              <div className='flex flex-col items-end justify-between'>
                <button onClick={() => removeItem(item.productId, item.variantId)} className='text-mist hover:text-coral transition-colors p-1' aria-label='Remove item'>
                  <Trash2 size={16} aria-hidden />
                </button>
                <div className='flex items-center gap-2'>
                  <button
                    onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                    className='p-1.5 rounded bg-grove text-ivory hover:bg-gold hover:text-forest transition-colors'
                    aria-label='Decrease quantity'
                  >
                    <Minus size={12} aria-hidden />
                  </button>
                  <span className='text-sm font-bold text-cream w-5 text-center'>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                    className='p-1.5 rounded bg-grove text-ivory hover:bg-gold hover:text-forest transition-colors'
                    aria-label='Increase quantity'
                  >
                    <Plus size={12} aria-hidden />
                  </button>
                </div>
                <p className='text-xs text-mist'>{formatPrice(item.priceCents * item.quantity)}</p>
              </div>
            </div>
          ))}

          <button onClick={clearCart} className='text-xs text-mist hover:text-coral transition-colors underline mt-2'>
            Clear Cart
          </button>
        </div>

        {/* Summary */}
        <div className='bg-canopy rounded-lg border border-smoke p-6 h-fit space-y-6 sticky top-20'>
          <h2 className='font-display text-2xl text-cream'>Order Summary</h2>

          {/* Shipping Zone */}
          <div>
            <p className='text-xs font-bold tracking-widest uppercase text-gold mb-3'>Shipping Destination</p>
            <div className='grid grid-cols-2 gap-2'>
              {(['US', 'CARIBBEAN', 'CANADA', 'WORLDWIDE'] as const).map((zone) => (
                <button
                  key={zone}
                  onClick={() => handleZoneChange(zone)}
                  className={`py-2 px-3 rounded-md text-xs font-bold tracking-wider uppercase border transition-all ${
                    shippingZone === zone ? 'bg-lime text-forest border-lime' : 'bg-grove text-mist border-smoke hover:border-gold/50'
                  }`}
                >
                  {SHIPPING_ZONES[zone].flag} {SHIPPING_ZONES[zone].label}
                </button>
              ))}
            </div>

            {/* Shipping method */}
            {zoneConfig.options.length > 1 && (
              <div className='mt-3 space-y-2'>
                {zoneConfig.options.map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-start gap-3 p-3 rounded-md border cursor-pointer transition-all ${
                      selectedShippingOption === opt.id ? 'border-gold bg-grove' : 'border-smoke hover:border-smoke/80'
                    }`}
                  >
                    <input type='radio' name='shipping' value={opt.id} checked={selectedShippingOption === opt.id} onChange={() => setSelectedShippingOption(opt.id)} className='mt-0.5 accent-lime' />
                    <div className='flex-1'>
                      <p className='text-xs font-semibold text-ivory'>{opt.label}</p>
                      <p className='text-xs text-mist'>{opt.estimatedDays}</p>
                    </div>
                    <p className='text-xs font-bold text-cream'>{shippingCost === 0 && opt.id === selectedShippingOption ? 'FREE' : formatPrice(opt.priceCents)}</p>
                  </label>
                ))}
              </div>
            )}

            {zoneConfig.options.length === 1 && (
              <div className='mt-3 p-3 rounded-md bg-grove border border-smoke'>
                <p className='text-xs font-semibold text-ivory'>{zoneConfig.options[0].label}</p>
                <p className='text-xs text-mist'>{zoneConfig.options[0].estimatedDays}</p>
              </div>
            )}

            {/* Duty notice */}
            {zoneConfig.dutyNotice && <p className='text-xs text-mist mt-3 p-3 bg-amber/10 border border-amber/30 rounded-md'>{zoneConfig.dutyNotice}</p>}

            {/* Free shipping note */}
            {zoneConfig.freeThresholdCents && subtotal < zoneConfig.freeThresholdCents && (
              <p className='text-xs text-lime mt-3'>Add {formatPrice(zoneConfig.freeThresholdCents - subtotal)} more for free standard shipping!</p>
            )}
          </div>

          {/* Totals */}
          <div className='space-y-3 pt-4 border-t border-smoke'>
            <div className='flex justify-between text-sm text-ivory'>
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className='flex justify-between text-sm text-ivory'>
              <span>Shipping</span>
              <span>{shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}</span>
            </div>
            <div className='flex justify-between font-bold text-cream pt-3 border-t border-smoke'>
              <span>Total</span>
              <div className='text-right'>
                <span className='text-lime text-lg'>{formatPrice(total)}</span>
                <span className='ml-1.5 text-[10px] font-bold tracking-widest text-mist align-middle'>USD</span>
              </div>
            </div>
          </div>

          {/* Checkout */}
          <button
            onClick={handleCheckout}
            disabled={loading}
            className='w-full py-4 bg-lime text-forest text-sm font-bold tracking-widest uppercase rounded-md hover:bg-lime/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2'
          >
            {loading && !transitioning && <Loader2 size={16} className='animate-spin' aria-hidden />}
            {transitioning ? 'Redirecting to Stripe…' : loading ? 'Preparing checkout…' : 'Proceed to Checkout'}
          </button>

          <p className='text-xs text-mist text-center'>Secure checkout powered by Stripe · All prices in USD</p>
        </div>
      </div>
    </div>
  );
}
