import { Leaf, Globe, Users } from 'lucide-react';
import AnimateOnScroll from '@/components/ui/AnimateOnScroll';

const pillars = [
  {
    id: '01',
    title: 'Grown with Purpose',
    body: 'We work directly with small-scale Caribbean farmers, bringing their craft to the world stage without losing the soul of what they grow.',
  },
  {
    id: '02',
    title: 'Caribbean to the World',
    body: 'From the hills of Jamaica to the plains of Trinidad, our collective spans the islands — connected by culture, elevated together.',
  },
  {
    id: '03',
    title: 'Community First',
    body: 'Every purchase flows back into the growers and creators behind the movement. This is premium culture with a purpose.',
  },
];

export default function BrandStory() {
  return (
    <section className='bg-forest py-24 md:py-36 border-b border-smoke/40'>
      <div className='max-w-7xl mx-auto px-6 md:px-12'>
        {/* Eyebrow — same language as hero badges */}
        <AnimateOnScroll animation='reveal-left' className='flex items-center gap-3 mb-10'>
          <div className='w-2 h-2 rounded-full bg-lime shrink-0' aria-hidden='true' />
          <span className='text-xs font-bold tracking-[0.35em] uppercase text-lime'>Our Story</span>
        </AnimateOnScroll>

        {/* Two-column layout — left: identity, right: pillars */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-start'>
          {/* Left — heading + body copy + quote */}
          <AnimateOnScroll animation='reveal-left'>
            <h2 className='font-display text-7xl md:text-8xl lg:text-[6rem] leading-none mb-10' style={{ WebkitTextStroke: '2px #f4efe4', color: 'transparent' }}>
              The
              <br />
              Collective
            </h2>
            <p className='font-heading text-base md:text-lg text-ivory/80 leading-relaxed mb-10 max-w-md'>
              Caribbean Cannabis Collective was built on a simple belief — that the Caribbean produces some of the world&rsquo;s finest cannabis culture, and it deserves a global stage. We&rsquo;re a
              community of growers, creators, and culture-keepers, unified by deep respect for the plant and the people behind it.
            </p>
            {/* Quote — lime border, matches hero's lime accent language */}
            <blockquote className='border-l-2 border-lime pl-5'>
              <p className='font-heading italic text-base md:text-lg text-ivory/60 leading-relaxed'>
                &ldquo;We don&rsquo;t just sell merchandise &mdash; we carry a culture, a movement, and a shared inheritance.&rdquo;
              </p>
            </blockquote>
          </AnimateOnScroll>

          {/* Right — numbered manifesto list */}
          <div className='divide-y divide-smoke/40'>
            {pillars.map(({ id, title, body }, i) => (
              <AnimateOnScroll key={id} animation='reveal-right' delay={i * 130}>
                <div className='py-8 grid grid-cols-[3.5rem_1fr] gap-4 items-start'>
                  {/* Outlined lime number — same technique as hero outlined headline */}
                  <span className='font-display text-4xl leading-none select-none pt-0.5' style={{ WebkitTextStroke: '1.5px #6db33f', color: 'transparent' }} aria-hidden='true'>
                    {id}
                  </span>
                  <div>
                    <h3 className='font-display text-2xl md:text-3xl text-cream tracking-wide leading-none mb-2'>{title}</h3>
                    <p className='text-mist text-sm leading-relaxed'>{body}</p>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
