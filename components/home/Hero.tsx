import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, Leaf } from 'lucide-react';

const badges = ['Worldwide Shipping', 'Premium Merch', 'Secure Checkout'];

export default function Hero() {
  return (
    <section className='relative min-h-screen flex items-end md:items-center overflow-hidden bg-forest'>
      {/* Full-bleed background -- single layout for all screen sizes */}
      <div className='absolute inset-0'>
        <Image
          src='https://imagedelivery.net/ecdEo-DBm7G7aeUYmdFLBA/14eab96a-cae2-4896-f770-eda8e7d13200/public'
          alt='Premium purple cannabis flower grown in the Caribbean'
          fill
          priority
          className='object-cover object-[center_25%]'
          sizes='100vw'
        />
        <div className='absolute inset-0' style={{ background: 'rgba(60,10,100,0.15)' }} aria-hidden='true' />
        <div
          className='absolute inset-x-0 bottom-0'
          style={{ height: '55%', background: 'linear-gradient(to top, rgba(10,26,10,0.95) 0%, rgba(10,26,10,0.80) 35%, rgba(10,26,10,0.40) 65%, transparent 100%)' }}
          aria-hidden='true'
        />
        <div className='absolute inset-x-0 top-0 h-24' style={{ background: 'linear-gradient(to bottom, rgba(10,26,10,0.55) 0%, transparent 100%)' }} aria-hidden='true' />
      </div>

      {/* Brand label — top-left corner */}
      <div className='absolute top-6 left-6 md:left-12 flex items-center gap-3 z-10 animate-fade-in-left' style={{ animationDelay: '100ms' }}>
        <div className='h-px w-10 bg-cream shrink-0' aria-hidden='true' />
        <span className='text-xs md:text-sm font-bold tracking-[0.25em] uppercase text-cream drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)]'>Caribbean Cannabis Collective</span>
      </div>

      {/* Text content */}
      <div className='relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-16 md:pb-0 md:py-24'>
        <h1 className='font-display leading-none mb-4 md:mb-5'>
          <span
            className='block animate-fade-in-up text-[clamp(4rem,16vw,9rem)] md:text-[clamp(4rem,10vw,9rem)]'
            style={{ animationDelay: '200ms', WebkitTextStroke: '2px #f4efe4', color: 'transparent' }}
          >
            Cultivate
          </span>
          <span className='block text-lime animate-fade-in-up text-[clamp(4rem,16vw,9rem)] md:text-[clamp(4rem,10vw,9rem)]' style={{ animationDelay: '350ms' }}>
            Your
          </span>
          <span
            className='block animate-fade-in-up text-[clamp(4rem,16vw,9rem)] md:text-[clamp(4rem,10vw,9rem)]'
            style={{ animationDelay: '500ms', WebkitTextStroke: '2px #f4efe4', color: 'transparent' }}
          >
            Culture
          </span>
        </h1>

        <p className='font-heading italic text-sm md:text-lg text-ivory mb-6 leading-relaxed animate-fade-in-up max-w-sm md:max-w-lg' style={{ animationDelay: '650ms' }}>
          Premium cannabis culture, rooted in the Caribbean.
        </p>

        <div className='flex gap-3 md:gap-4 mb-6 animate-fade-in-up max-w-sm md:max-w-none' style={{ animationDelay: '800ms' }}>
          <Link
            href='/shop'
            className='flex-1 md:flex-none md:px-8 text-center py-3.5 bg-lime text-forest text-sm font-bold tracking-widest uppercase rounded-md hover:bg-lime/90 transition-all hover:shadow-[0_0_28px_rgba(109,179,63,0.45)] active:scale-95'
          >
            Shop Now
          </Link>
          <Link
            href='/about'
            className='flex-1 md:flex-none md:px-8 text-center py-3.5 border border-gold text-gold text-sm font-bold tracking-widest uppercase rounded-md hover:bg-gold hover:text-forest transition-all active:scale-95'
          >
            Our Story
          </Link>
        </div>

        <div className='flex flex-wrap gap-x-5 gap-y-2 pt-5 border-t border-smoke/40 animate-fade-in-up' style={{ animationDelay: '950ms' }}>
          {badges.map((badge) => (
            <div key={badge} className='flex items-center gap-2'>
              <Leaf size={12} className='text-lime shrink-0' aria-hidden />
              <span className='text-xs text-ivory tracking-wider'>{badge}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className='absolute bottom-4 md:bottom-8 right-6 md:right-12 flex flex-col items-center gap-2 text-mist animate-fade-in-up z-20' style={{ animationDelay: '1100ms' }}>
        <span className='text-[10px] tracking-widest uppercase'>Scroll</span>
        <div className='flex flex-col items-center gap-1 animate-bounce'>
          <div className='w-1.5 h-1.5 rounded-full bg-lime/70' />
          <ChevronDown size={14} aria-hidden />
        </div>
      </div>
    </section>
  );
}
