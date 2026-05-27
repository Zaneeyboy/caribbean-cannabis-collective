'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import Link from 'next/link';

const faqs = [
  {
    q: 'Where do you ship to?',
    a: 'We ship worldwide. Our primary markets are the United States, Canada, and the Caribbean — but we deliver to over 50 countries across Europe, Asia, Africa, Latin America, and beyond. See our Shipping Info page for the full breakdown.',
  },
  {
    q: 'How long does shipping take?',
    a: 'US orders arrive in 5–7 business days (standard) or 2–3 days (expedited). Canada: 7–12 days standard or 3–5 days express. Caribbean: 7–14 business days. Rest of world: 10–21 days standard or 5–8 days express. Tracking is sent as soon as your order ships.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit and debit cards (Visa, Mastercard, Amex, Discover) processed securely via Stripe. We do not store your card details.',
  },
  {
    q: 'Can I return or exchange an item?',
    a: 'Yes — we accept returns within 30 days of delivery on unworn, unwashed items with original tags attached. Contact us to start a return. Sale items are final.',
  },
  {
    q: 'Are your products cannabis-infused?',
    a: 'No. Caribbean Cannabis Collective is a lifestyle and apparel brand celebrating cannabis culture. We sell clothing, accessories, and drinkware — not cannabis products.',
  },
  {
    q: 'How do I find my size?',
    a: 'Each product page includes a size guide with measurements. When in doubt, size up — our apparel runs true to size with a relaxed Caribbean fit.',
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className='border-b border-smoke/40'>
      <button onClick={() => setOpen((v) => !v)} className='w-full flex items-center justify-between gap-4 py-5 text-left group' aria-expanded={open}>
        <span className='text-sm font-medium text-ivory/90 group-hover:text-cream transition-colors leading-snug'>{q}</span>
        <span className='shrink-0 text-mist group-hover:text-lime transition-colors'>{open ? <Minus size={16} aria-hidden /> : <Plus size={16} aria-hidden />}</span>
      </button>

      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-40 opacity-100 pb-5' : 'max-h-0 opacity-0'}`}>
        <p className='text-sm text-mist leading-relaxed'>{a}</p>
      </div>
    </div>
  );
}

export default function HomeFAQ() {
  return (
    <section className='bg-canopy border-t border-smoke/40'>
      <div className='max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28'>
        <div className='grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-start'>
          {/* Left: label + heading */}
          <div className='md:col-span-4'>
            <div className='flex items-center gap-2 mb-3'>
              <span className='w-1.5 h-1.5 rounded-full bg-lime shrink-0' aria-hidden />
              <p className='text-[10px] font-bold tracking-[0.3em] uppercase text-mist'>FAQ</p>
            </div>
            <h2 className='font-display text-5xl md:text-6xl text-cream leading-none mb-6'>Got questions?</h2>
            <p className='text-ivory/60 text-sm leading-relaxed mb-8'>Everything you need to know about ordering, shipping, and the collective.</p>
            <Link href='/faq' className='inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-lime hover:text-lime/80 transition-colors'>
              View all FAQs →
            </Link>
          </div>

          {/* Right: accordion */}
          <div className='md:col-span-8 border-t border-smoke/40'>
            {faqs.map((item) => (
              <FAQItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
