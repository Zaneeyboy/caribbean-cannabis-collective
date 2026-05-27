'use client';

import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return submitted ? (
    <div className='flex items-start gap-3 py-2'>
      <span className='w-8 h-8 flex items-center justify-center bg-lime/10 border border-lime/40 shrink-0'>
        <Check size={13} className='text-lime' aria-hidden />
      </span>
      <div>
        <p className='text-sm text-cream font-medium'>You&apos;re in.</p>
        <p className='text-xs text-mist mt-0.5'>Watch your inbox — the next drop is coming.</p>
      </div>
    </div>
  ) : (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
        // TODO: Wire up to Resend audience
      }}
    >
      <div className='flex items-stretch border border-smoke focus-within:border-lime transition-colors bg-canopy'>
        <input
          type='email'
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='your@email.com'
          className='flex-1 bg-transparent px-4 py-3 text-cream text-sm placeholder:text-mist focus:outline-none'
          aria-label='Email for newsletter'
        />
        <button type='submit' className='group/btn flex items-center justify-center w-12 hover:bg-lime border-l border-smoke transition-colors shrink-0' aria-label='Subscribe to newsletter'>
          <ArrowRight size={14} className='text-cream group-hover/btn:text-forest group-hover/btn:translate-x-0.5 transition-all' aria-hidden />
        </button>
      </div>
      <p className='text-xs text-mist mt-3'>
        No spam.{' '}
        <a href='/privacy' className='underline underline-offset-2 hover:text-cream transition-colors'>
          Privacy Policy
        </a>
        .
      </p>
    </form>
  );
}
