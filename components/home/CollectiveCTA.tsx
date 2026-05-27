import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import AnimateOnScroll from '@/components/ui/AnimateOnScroll';

export default function CollectiveCTA() {
  return (
    <section className='bg-canopy py-24 md:py-36'>
      <div className='max-w-7xl mx-auto px-6 md:px-12'>
        {/* Eyebrow */}
        <AnimateOnScroll animation='reveal-left' className='flex items-center gap-3 mb-10'>
          <div className='w-2 h-2 rounded-full bg-lime shrink-0' aria-hidden='true' />
          <span className='text-xs font-bold tracking-[0.35em] uppercase text-lime'>Join Us</span>
        </AnimateOnScroll>

        {/* Bold left-aligned split */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-end'>
          {/* Left — outlined headline */}
          <AnimateOnScroll animation='reveal-left'>
            <h2 className='font-display text-7xl md:text-8xl lg:text-[6.5rem] leading-none' style={{ WebkitTextStroke: '2px #f4efe4', color: 'transparent' }}>
              Join the
              <br />
              Collective
            </h2>
          </AnimateOnScroll>

          {/* Right — copy + CTAs */}
          <AnimateOnScroll animation='reveal-right' className='flex flex-col gap-8'>
            <p className='font-heading text-base md:text-lg text-ivory/75 leading-relaxed max-w-md'>
              Premium cannabis culture, rooted in the Caribbean and built for the world. Create an account to track orders, save favourites, and become part of the movement.
            </p>
            <div className='flex flex-col sm:flex-row gap-4'>
              <Link
                href='/signup'
                className='flex items-center justify-center gap-2 px-8 py-4 bg-lime text-forest text-xs font-bold tracking-widest uppercase hover:bg-lime/90 transition-all hover:shadow-[0_0_32px_rgba(109,179,63,0.40)] active:scale-95 group'
              >
                Create Account
                <ArrowRight size={14} className='group-hover:translate-x-1 transition-transform' aria-hidden />
              </Link>
              <Link
                href='/shop'
                className='flex items-center justify-center px-8 py-4 border border-smoke text-xs font-bold tracking-widest uppercase text-ivory hover:border-cream hover:text-cream transition-colors'
              >
                Shop the Collection
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
