import AnimateOnScroll from '@/components/ui/AnimateOnScroll';

const zones = [
  {
    region: 'United States',
    lines: ['Fulfilled from our NY & Miami hubs', 'Free standard shipping on orders over $75 USD'],
    detail: 'Standard 5–7 days · Expedited 2–3 days',
  },
  {
    region: 'Caribbean',
    lines: ['Ships to Trinidad & Tobago, Jamaica, Barbados,', 'St. Lucia, Guyana, and across the region'],
    detail: 'Standard 7–14 business days',
  },
  {
    region: 'Canada',
    lines: ['Standard and express options available', 'Free standard shipping on orders over $150 USD'],
    detail: 'Standard 7–12 days · Express 3–5 days',
  },
  {
    region: 'Rest of World',
    lines: ['Europe, UK, Australia, Africa, Asia, and beyond', "Duties & taxes are the recipient's responsibility"],
    detail: 'Standard 10–21 days · Express 5–8 days',
  },
];

export default function ShippingZonesBanner() {
  return (
    <section className='bg-forest border-b border-smoke/40 py-20 md:py-28'>
      <div className='max-w-7xl mx-auto px-6 md:px-12'>
        {/* Header */}
        <AnimateOnScroll animation='reveal-left' className='mb-14'>
          <div className='flex items-center gap-3 mb-3'>
            <div className='w-2 h-2 rounded-full bg-lime shrink-0' aria-hidden='true' />
            <span className='text-xs font-bold tracking-[0.35em] uppercase text-lime'>Delivery</span>
          </div>
          <h2 className='font-display text-6xl md:text-7xl text-cream leading-none'>
            We Ship
            <br className='sm:hidden' /> Worldwide
          </h2>
        </AnimateOnScroll>

        {/* Zone rows — borderless manifesto style */}
        <div className='divide-y divide-smoke/40'>
          {zones.map(({ region, lines, detail }, i) => (
            <AnimateOnScroll key={region} animation='reveal' delay={i * 120}>
              <div className='py-8 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 md:gap-12 items-center group'>
                <div className='grid grid-cols-1 sm:grid-cols-[14rem_1fr] gap-2 sm:gap-8 items-start'>
                  {/* Region name */}
                  <h3 className='font-display text-2xl md:text-3xl text-cream tracking-wide leading-none'>{region}</h3>
                  {/* Detail lines */}
                  <div>
                    {lines.map((line) => (
                      <p key={line} className='text-sm text-mist leading-relaxed'>
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
                {/* Timing — right side, lime accent */}
                <p className='text-xs font-bold tracking-widest uppercase text-lime whitespace-nowrap'>{detail}</p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
