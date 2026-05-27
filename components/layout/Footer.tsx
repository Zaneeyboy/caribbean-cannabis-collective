import Link from 'next/link';
import NewsletterForm from '@/components/layout/NewsletterForm';
import CopyrightYear from '@/components/layout/CopyrightYear';
import { Suspense } from 'react';

const InstagramIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={1.75} strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
    <rect x='2' y='2' width='20' height='20' rx='5' ry='5' />
    <circle cx='12' cy='12' r='4' />
    <circle cx='17.5' cy='6.5' r='1' fill='currentColor' stroke='none' />
  </svg>
);

const TikTokIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'>
    <path d='M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.19 8.19 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z' />
  </svg>
);

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/about', label: 'Our Story' },
  { href: '/contact', label: 'Contact' },
  { href: '/faq', label: 'FAQ' },
  { href: '/shipping', label: 'Shipping Info' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
];

export default function Footer() {
  return (
    <footer className='bg-forest border-t border-smoke/40 mt-auto'>
      <div className='max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-10'>
        <div className='grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8'>
          {/* Brand column */}
          <div className='md:col-span-4'>
            <Link href='/' className='inline-block mb-5'>
              <span className='font-display text-5xl text-cream leading-none tracking-wide'>CCC</span>
            </Link>
            <div className='flex items-center gap-2 mb-3'>
              <span className='w-1.5 h-1.5 rounded-full bg-lime shrink-0' aria-hidden />
              <p className='text-[10px] font-bold tracking-[0.3em] uppercase text-mist'>Caribbean Cannabis Collective</p>
            </div>
            <p className='text-ivory/70 text-sm leading-relaxed mb-6 max-w-xs'>Premium cannabis culture, rooted in the Caribbean. Farmers helping farmers — one drop at a time.</p>
            <div className='flex items-center gap-4'>
              <a href='https://instagram.com/caribbeancannabiscollective' target='_blank' rel='noopener noreferrer' className='text-mist hover:text-lime transition-colors' aria-label='Instagram'>
                <InstagramIcon size={18} />
              </a>
              <a href='https://tiktok.com/@caribbeancannabiscollective' target='_blank' rel='noopener noreferrer' className='text-mist hover:text-lime transition-colors' aria-label='TikTok'>
                <TikTokIcon size={16} />
              </a>
            </div>
          </div>

          {/* Navigation links */}
          <div className='md:col-span-4'>
            <p className='text-[10px] font-bold tracking-[0.3em] uppercase text-mist mb-5'>Navigate</p>
            <ul className='grid grid-cols-2 gap-x-4 gap-y-3'>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className='text-sm text-ivory/60 hover:text-lime transition-colors'>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className='md:col-span-4'>
            <p className='text-[10px] font-bold tracking-[0.3em] uppercase text-cream mb-5'>Stay in the loop</p>
            <p className='text-sm text-ivory/60 leading-relaxed mb-4'>New drops, island events, and collective news — straight to your inbox.</p>
            <NewsletterForm />
          </div>
        </div>

        {/* Bottom bar */}
        <div className='mt-14 pt-6 border-t border-smoke/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2'>
          <p className='text-[11px] text-mist/60'>
            ©{' '}
            <Suspense fallback={2025}>
              <CopyrightYear />
            </Suspense>{' '}
            Caribbean Cannabis Collective. All rights reserved.
          </p>
          <p className='text-[11px] text-mist/40'>
            Built by{' '}
            <a href='https://instagram.com/zane_mohd' target='_blank' rel='noopener noreferrer' className='hover:text-mist/70 transition-colors underline underline-offset-2'>
              Zane Mohd
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
