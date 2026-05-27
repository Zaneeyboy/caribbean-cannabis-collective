import type { Metadata } from 'next';
import Link from 'next/link';
import { Plane, MapPin, Clock, Package, AlertCircle } from 'lucide-react';
import AnimateOnScroll from '@/components/ui/AnimateOnScroll';

export const metadata: Metadata = {
  title: 'Shipping — Caribbean Cannabis Collective',
  description: 'Shipping information for CCC merchandise — US and Caribbean delivery zones, rates, and timelines.',
};

const US_RATES = [
  { name: 'Standard Shipping', time: '5–8 business days', price: '$6.99' },
  { name: 'Priority Shipping', time: '2–3 business days', price: '$14.99' },
  { name: 'Free Standard Shipping', time: '5–8 business days', price: 'Free on orders over $100' },
];

const CARIB_RATES = [
  { name: 'Caribbean Standard', time: '10–21 business days', price: '$19.99' },
  { name: 'Caribbean Express', time: '5–10 business days', price: '$34.99' },
  { name: 'Free Caribbean Shipping', time: '10–21 business days', price: 'Free on orders over $150' },
];

const CARIB_ISLANDS = [
  'Jamaica',
  'Trinidad & Tobago',
  'Barbados',
  'St. Lucia',
  'Grenada',
  'Antigua & Barbuda',
  'St. Kitts & Nevis',
  'Dominica',
  'St. Vincent & the Grenadines',
  'Guyana',
  'Belize',
  'The Bahamas',
  'Haiti',
  'Dominican Republic',
  'Turks & Caicos',
  'British Virgin Islands',
  'US Virgin Islands',
  'Cayman Islands',
  'Bermuda',
  'Aruba',
  'Curaçao',
  'Martinique',
  'Guadeloupe',
];

export default function ShippingPage() {
  return (
    <div className='min-h-screen bg-forest'>
      {/* Hero */}
      <section className='bg-canopy border-b border-smoke py-16 md:py-24 px-4 relative'>
        <div className='max-w-4xl mx-auto text-center'>
          <p className='text-xs font-bold tracking-[0.3em] uppercase text-gold mb-4 animate-fade-in-up delay-75'>Worldwide Delivery</p>
          <h1 className='font-display text-6xl md:text-7xl text-cream mb-4 animate-fade-in-up delay-150'>Shipping</h1>
          <p className='text-mist text-lg max-w-xl mx-auto animate-fade-in-up delay-300'>
            We ship to the United States and throughout the Caribbean basin. All orders are fulfilled from our NY and Miami distribution hubs.
          </p>
        </div>
        <div className='absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent' />
      </section>

      <div className='max-w-5xl mx-auto px-4 md:px-8 py-12 md:py-16 space-y-12'>
        {/* US Shipping */}
        <AnimateOnScroll animation='reveal'>
          <section>
            <div className='flex items-center gap-3 mb-6'>
              <div className='w-10 h-10 rounded-lg bg-lime/10 border border-lime/30 flex items-center justify-center'>
                <MapPin size={18} className='text-lime' />
              </div>
              <div>
                <h2 className='font-display text-3xl text-cream'>United States</h2>
                <p className='text-mist text-xs'>All 50 states + DC</p>
              </div>
            </div>
            <div className='bg-canopy border border-smoke rounded-xl overflow-hidden'>
              <table className='w-full text-sm'>
                <thead className='border-b border-smoke'>
                  <tr>
                    {['Service', 'Estimated Delivery', 'Rate'].map((h) => (
                      <th key={h} className='px-5 py-3.5 text-left text-[10px] font-bold tracking-widest uppercase text-mist'>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className='divide-y divide-smoke'>
                  {US_RATES.map((r) => (
                    <tr key={r.name} className='hover:bg-grove transition-colors'>
                      <td className='px-5 py-4 text-cream font-medium'>{r.name}</td>
                      <td className='px-5 py-4 text-mist flex items-center gap-1.5'>
                        <Clock size={13} className='text-gold' />
                        {r.time}
                      </td>
                      <td className='px-5 py-4 text-gold font-semibold'>{r.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </AnimateOnScroll>

        {/* Caribbean Shipping */}
        <AnimateOnScroll animation='reveal' delay={80}>
          <section>
            <div className='flex items-center gap-3 mb-6'>
              <div className='w-10 h-10 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-center'>
                <Plane size={18} className='text-gold' />
              </div>
              <div>
                <h2 className='font-display text-3xl text-cream'>Caribbean</h2>
                <p className='text-mist text-xs'>Island-wide delivery</p>
              </div>
            </div>
            <div className='bg-canopy border border-smoke rounded-xl overflow-hidden mb-6'>
              <table className='w-full text-sm'>
                <thead className='border-b border-smoke'>
                  <tr>
                    {['Service', 'Estimated Delivery', 'Rate'].map((h) => (
                      <th key={h} className='px-5 py-3.5 text-left text-[10px] font-bold tracking-widest uppercase text-mist'>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className='divide-y divide-smoke'>
                  {CARIB_RATES.map((r) => (
                    <tr key={r.name} className='hover:bg-grove transition-colors'>
                      <td className='px-5 py-4 text-cream font-medium'>{r.name}</td>
                      <td className='px-5 py-4 text-mist flex items-center gap-1.5'>
                        <Clock size={13} className='text-gold' />
                        {r.time}
                      </td>
                      <td className='px-5 py-4 text-gold font-semibold'>{r.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className='bg-canopy border border-smoke rounded-xl p-6'>
              <h3 className='text-cream font-semibold text-sm mb-3'>Islands We Ship To</h3>
              <div className='flex flex-wrap gap-2'>
                {CARIB_ISLANDS.map((island) => (
                  <span key={island} className='text-xs bg-grove text-mist px-2.5 py-1 rounded-md border border-smoke'>
                    {island}
                  </span>
                ))}
              </div>
              <p className='text-mist text-xs mt-4'>
                Don&apos;t see your island?{' '}
                <Link href='/contact' className='text-lime hover:underline'>
                  Contact us
                </Link>{' '}
                — we may still be able to ship to you.
              </p>
            </div>
          </section>
        </AnimateOnScroll>

        {/* Order processing */}
        <AnimateOnScroll animation='reveal' delay={120}>
          <section>
            <div className='flex items-center gap-3 mb-6'>
              <div className='w-10 h-10 rounded-lg bg-coral/10 border border-coral/30 flex items-center justify-center'>
                <Package size={18} className='text-coral' />
              </div>
              <h2 className='font-display text-3xl text-cream'>Order Processing</h2>
            </div>
            <div className='grid sm:grid-cols-2 gap-4'>
              {[
                { label: 'Processing Time', value: '1–3 business days after payment confirmation' },
                { label: 'Tracking', value: 'Email with tracking link sent when your order ships' },
                { label: 'Packaging', value: 'Eco-friendly packaging — minimal plastic, recycled materials' },
                { label: 'Customs & Duties', value: 'Caribbean shipments may be subject to local customs fees (not included in shipping rate)' },
              ].map((item) => (
                <div key={item.label} className='bg-canopy border border-smoke rounded-xl p-5'>
                  <p className='text-[10px] font-bold tracking-widest uppercase text-mist mb-1.5'>{item.label}</p>
                  <p className='text-cream text-sm leading-relaxed'>{item.value}</p>
                </div>
              ))}
            </div>
          </section>
        </AnimateOnScroll>

        {/* Notice */}
        <AnimateOnScroll animation='reveal-scale'>
          <div className='flex gap-3 bg-gold/5 border border-gold/20 rounded-xl p-5'>
            <AlertCircle size={18} className='text-gold shrink-0 mt-0.5' />
            <div>
              <p className='text-cream text-sm font-semibold mb-1'>Important Notice</p>
              <p className='text-mist text-sm leading-relaxed'>
                Caribbean delivery timelines are estimates and may vary due to island customs, local postal service schedules, and weather. For time-sensitive orders, we recommend Express shipping.
                Questions?{' '}
                <Link href='/contact' className='text-lime hover:underline'>
                  Contact our team.
                </Link>
              </p>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </div>
  );
}
