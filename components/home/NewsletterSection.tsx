'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowRight, Check } from 'lucide-react';
import { brandImage } from '@/lib/brand-images';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id='newsletter' className='relative min-h-[70vh] flex items-end overflow-hidden'>
      {/* Background image */}
      <Image src={brandImage('story3')} alt='' fill className='object-cover object-center' aria-hidden priority={false} />

      {/* Gradient overlay — dark at bottom where the copy lives, lighter at top */}
      <div className='absolute inset-0 bg-linear-to-t from-forest via-forest/80 to-forest/20' aria-hidden />

      {/* Thin lime top border */}
      <div className='absolute inset-x-0 top-0 h-px bg-lime/30' aria-hidden />

      <div className='relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28'>
        <div className='max-w-2xl'>
          {/* Eyebrow */}
          <div className='flex items-center gap-2 mb-8'>
            <span className='w-1.5 h-1.5 rounded-full bg-lime shrink-0' aria-hidden />
            <p className='text-[10px] font-bold tracking-[0.3em] uppercase text-cream'>The Collective</p>
          </div>

          {/* Headline */}
          <h2 className='font-display text-6xl md:text-8xl text-cream leading-none mb-6'>
            Don&apos;t miss
            <br />
            the next
            <br />
            <span className='text-lime'>drop.</span>
          </h2>

          {/* Subtext */}
          <p className='text-ivory/60 text-sm leading-relaxed mb-10 max-w-sm'>New releases, island events, and stories from the farmers we work with — straight to your inbox.</p>

          {/* Form */}
          {submitted ? (
            <div className='flex items-start gap-4'>
              <span className='w-10 h-10 flex items-center justify-center bg-lime/10 border border-lime/40 shrink-0 mt-0.5'>
                <Check size={16} className='text-lime' aria-hidden />
              </span>
              <div>
                <p className='font-display text-3xl text-cream leading-none mb-1'>You&apos;re in.</p>
                <p className='text-sm text-mist'>Watch your inbox — the next drop is coming.</p>
              </div>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
                // TODO: POST to /api/newsletter with { email }
              }}
            >
              <div className='flex items-stretch max-w-md border border-smoke focus-within:border-lime transition-colors bg-canopy'>
                <input
                  type='email'
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='your@email.com'
                  className='flex-1 bg-transparent px-5 py-4 text-cream text-sm placeholder:text-mist focus:outline-none'
                  aria-label='Email address for the CCC mailing list'
                />
                <button type='submit' className='group/btn flex items-center justify-center w-14 hover:bg-lime border-l border-smoke transition-colors shrink-0' aria-label='Join the mailing list'>
                  <ArrowRight size={15} className='text-cream group-hover/btn:text-forest group-hover/btn:translate-x-0.5 transition-all' aria-hidden />
                </button>
              </div>

              <p className='text-xs text-mist mt-4'>
                No spam.{' '}
                <a href='/privacy' className='underline underline-offset-2 hover:text-cream transition-colors'>
                  Privacy Policy
                </a>
                .
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
