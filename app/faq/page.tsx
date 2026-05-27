import type { Metadata } from 'next';
import Link from 'next/link';
import AnimateOnScroll from '@/components/ui/AnimateOnScroll';

export const metadata: Metadata = {
  title: 'FAQ — Caribbean Cannabis Collective',
  description: 'Frequently asked questions about CCC merchandise, orders, shipping, and returns.',
};

const FAQS = [
  {
    section: 'Orders & Payment',
    items: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit and debit cards (Visa, Mastercard, Amex, Discover) via Stripe. Apple Pay and Google Pay are also supported at checkout on compatible devices.',
      },
      {
        q: 'Can I change or cancel my order after placing it?',
        a: 'Orders can be cancelled or modified within 1 hour of placement. After that, your order will have entered processing. Please contact us immediately at hello@caribbeancannabiscollective.com or via Instagram DM.',
      },
      {
        q: 'Is my payment information secure?',
        a: 'Yes. All payments are processed by Stripe, a PCI-DSS Level 1 certified payment processor. We never store your card details on our servers.',
      },
      {
        q: 'Will I receive an order confirmation?',
        a: "Yes — a confirmation email is sent to the address you provide at checkout within minutes of your order being placed. Check your spam folder if you don't see it.",
      },
    ],
  },
  {
    section: 'Shipping',
    items: [
      {
        q: 'Where do you ship to?',
        a: 'We ship worldwide. Our primary markets are the United States, Canada, and the Caribbean — but we deliver to 50+ countries across Europe, the UK, Asia, Africa, the Middle East, and Latin America. At checkout, select your shipping destination and only the countries we serve for that zone will be available.',
      },
      {
        q: 'How long does shipping take?',
        a: 'Delivery times vary by destination. US orders: 5–7 business days standard, 2–3 business days expedited. Canada: 7–12 days standard, 3–5 days express. Caribbean: 7–14 business days. Worldwide: 10–21 days standard, 5–8 days express. All orders receive tracking as soon as they ship.',
      },
      {
        q: 'Do you offer free shipping?',
        a: 'Yes — US orders over $75 USD qualify for free standard shipping, and Canadian orders over $150 USD qualify for free standard shipping. Free shipping is applied automatically at checkout.',
      },
      {
        q: 'Will I have to pay customs duties on international orders?',
        a: "Orders shipped to Canada, the Caribbean, and all other international destinations may be subject to local import duties, taxes, and customs fees. These charges are not included in our shipping rates and are the responsibility of the recipient. We recommend checking your country's import thresholds before ordering.",
      },
      {
        q: 'All prices are in USD?',
        a: 'Yes — all prices on the site and at checkout are in US Dollars (USD). Your bank or card provider will handle the currency conversion at their current exchange rate.',
      },
    ],
  },
  {
    section: 'Products & Sizing',
    items: [
      {
        q: 'How do your shirts fit?',
        a: "Our apparel runs true to size in a slightly relaxed fit. If you're between sizes or prefer a fitted look, size down. Detailed measurements are listed on each product page.",
      },
      {
        q: 'What materials are your garments made from?',
        a: 'We use 100% heavyweight ring-spun cotton for our tees and hoodies — no synthetic blends. This ensures durability, breathability, and a premium feel.',
      },
      {
        q: 'Are products restocked once sold out?',
        a: 'Popular items are restocked regularly. You can contact us to be added to a restock notification list for any specific item.',
      },
    ],
  },
  {
    section: 'Returns & Exchanges',
    items: [
      {
        q: 'What is your return policy?',
        a: 'We accept returns of unworn, unwashed items in original condition within 30 days of delivery. Sale items and custom orders are final sale.',
      },
      {
        q: 'How do I start a return or exchange?',
        a: "Email hello@caribbeancannabiscollective.com with your order number and reason for return. We'll send you a prepaid return label for US orders.",
      },
      {
        q: 'How long does a refund take?',
        a: 'Once we receive and inspect your return (typically 3–5 business days), your refund will be issued to the original payment method within 5–10 business days.',
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <div className='min-h-screen bg-forest'>
      {/* Hero */}
      <section className='bg-canopy border-b border-smoke py-16 md:py-24 px-4 relative'>
        <div className='max-w-3xl mx-auto text-center'>
          <p className='text-xs font-bold tracking-[0.3em] uppercase text-gold mb-4 animate-fade-in-up delay-75'>Support</p>
          <h1 className='font-display text-6xl md:text-7xl text-cream mb-4 animate-fade-in-up delay-150'>FAQ</h1>
          <p className='text-mist text-lg max-w-xl mx-auto animate-fade-in-up delay-300'>
            Everything you need to know. If your question isn&apos;t here,{' '}
            <Link href='/contact' className='text-lime hover:underline'>
              contact us
            </Link>
            .
          </p>
        </div>
        <div className='absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gold to-transparent' />
      </section>

      <div className='max-w-3xl mx-auto px-4 md:px-8 py-12 md:py-16 space-y-12'>
        {FAQS.map((section, si) => (
          <AnimateOnScroll key={section.section} animation='reveal' delay={si * 60}>
            <section>
              <h2 className='font-display text-3xl text-gold mb-6 pb-3 border-b border-smoke'>{section.section}</h2>
              <div className='space-y-3'>
                {section.items.map((item) => (
                  <details key={item.q} className='group bg-canopy border border-smoke rounded-xl overflow-hidden'>
                    <summary className='flex items-center justify-between px-6 py-5 cursor-pointer list-none hover:bg-grove transition-colors gap-4'>
                      <span className='text-cream font-medium text-sm leading-snug'>{item.q}</span>
                      <span className='text-mist group-open:text-lime transition-colors shrink-0 text-lg leading-none select-none'>
                        <svg className='w-4 h-4 transition-transform duration-300 group-open:rotate-45' fill='none' stroke='currentColor' viewBox='0 0 24 24' aria-hidden>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
                        </svg>
                      </span>
                    </summary>
                    <div className='faq-body'>
                      <div className='px-6 pb-5 text-mist text-sm leading-relaxed border-t border-smoke pt-4'>{item.a}</div>
                    </div>
                  </details>
                ))}
              </div>
            </section>
          </AnimateOnScroll>
        ))}

        {/* Still have questions */}
        <AnimateOnScroll animation='reveal-scale'>
          <div className='bg-canopy border border-smoke rounded-xl p-8 text-center'>
            <h3 className='font-display text-3xl text-cream mb-2'>Still have questions?</h3>
            <p className='text-mist text-sm mb-6'>Our team is here to help. Reach out any time.</p>
            <Link href='/contact' className='inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-lime text-forest font-bold tracking-widest uppercase text-sm hover:bg-lime/90 transition-colors'>
              Contact Us
            </Link>
          </div>
        </AnimateOnScroll>
      </div>
    </div>
  );
}
