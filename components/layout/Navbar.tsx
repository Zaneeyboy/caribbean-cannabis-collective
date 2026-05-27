'use client';

import Link from 'next/link';
import { ShoppingCart, Leaf, Menu, X, User, ShieldCheck } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/about', label: 'Our Story' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const { itemCount, openCart } = useCartStore();
  const { user, isAdmin } = useAuth();
  const count = itemCount();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function openMenu() {
    document.body.style.overflow = 'hidden';
    setMobileOpen(true);
    requestAnimationFrame(() => setMenuVisible(true));
  }
  function closeMenu() {
    document.body.style.overflow = '';
    setMenuVisible(false);
    closeTimer.current = setTimeout(() => setMobileOpen(false), 350);
  }
  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
      document.body.style.overflow = '';
    },
    [],
  );
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-forest/98 shadow-lg border-b border-smoke' : 'bg-forest/95 border-b border-smoke/50'} backdrop-blur-md`}>
        <div className='max-w-7xl mx-auto px-4 md:px-8'>
          <div className='flex items-center justify-between h-16'>
            {/* Logo */}
            <Link href='/' className='flex items-center gap-2 group' aria-label='Caribbean Cannabis Collective home'>
              <Leaf className='text-lime group-hover:rotate-12 transition-transform duration-300' size={22} aria-hidden />
              <span className='font-display text-xl text-cream tracking-widest leading-none'>CCC</span>
            </Link>

            {/* Desktop Nav */}
            <nav className='hidden md:flex items-center gap-8' aria-label='Main navigation'>
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className='text-xs font-semibold tracking-widest uppercase text-ivory hover:text-lime transition-colors duration-200'>
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className='flex items-center gap-3'>
              {/* Admin link */}
              {isAdmin && (
                <Link
                  href='/admin'
                  className='hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold tracking-widest uppercase text-gold border border-gold/40 rounded-md hover:bg-gold/10 transition-colors'
                  title='Admin Panel'
                >
                  <ShieldCheck size={13} />
                  Admin
                </Link>
              )}

              {/* Auth */}
              {user ? (
                <Link href='/account' className='hidden md:flex p-2 text-ivory hover:text-lime transition-colors' aria-label='My Account'>
                  <User size={20} aria-hidden />
                </Link>
              ) : (
                <div className='hidden md:flex items-center gap-3'>
                  <Link href='/signin' className='text-xs font-semibold tracking-widest uppercase text-ivory hover:text-lime transition-colors'>
                    Sign In
                  </Link>
                  <Link href='/signup' className='px-4 py-2 bg-lime text-forest text-xs font-bold tracking-widest uppercase hover:bg-lime/90 transition-colors'>
                    Join
                  </Link>
                </div>
              )}

              {/* Cart button */}
              <button onClick={openCart} className='relative p-2 text-ivory hover:text-lime transition-colors' aria-label={`Cart — ${count} item${count !== 1 ? 's' : ''}`}>
                <ShoppingCart size={22} aria-hidden />
                {count > 0 && (
                  <span className='absolute -top-0.5 -right-0.5 bg-lime text-forest text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none'>
                    {count > 99 ? '99+' : count}
                  </span>
                )}
              </button>

              {/* Mobile menu toggle */}
              <button
                className='md:hidden p-2 text-ivory hover:text-lime transition-colors'
                onClick={() => (mobileOpen ? closeMenu() : openMenu())}
                aria-label='Toggle mobile menu'
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X size={22} aria-hidden /> : <Menu size={22} aria-hidden />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div
          className={`fixed inset-0 z-40 flex flex-col pt-20 px-8 pb-10 md:hidden transition-all duration-300 ease-out ${
            menuVisible ? 'bg-forest translate-x-0 opacity-100' : 'translate-x-full opacity-0'
          }`}
          role='dialog'
          aria-label='Mobile navigation'
          aria-modal='true'
        >
          {/* Main nav */}
          <nav className='flex flex-col' aria-label='Site navigation'>
            {navLinks.map((link, i) => {
              const active = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className={`group flex items-center gap-4 py-4 border-b border-smoke/40 transition-colors ${active ? 'text-lime' : 'text-cream hover:text-lime'}`}
                  style={{
                    opacity: menuVisible ? 1 : 0,
                    transform: menuVisible ? 'translateY(0)' : 'translateY(16px)',
                    transition: `opacity 0.3s ease ${80 + i * 55}ms, transform 0.3s ease ${80 + i * 55}ms`,
                  }}
                  aria-current={active ? 'page' : undefined}
                >
                  <span className='text-[9px] font-bold tracking-[0.25em] text-lime/50 font-sans tabular-nums w-5 shrink-0'>{String(i + 1).padStart(2, '0')}</span>
                  <span className='font-display text-4xl tracking-wider leading-none'>{link.label}</span>
                  {active && <span className='ml-auto w-1.5 h-1.5 rounded-full bg-lime shrink-0' aria-hidden='true' />}
                </Link>
              );
            })}
          </nav>

          {/* Account section */}
          <div
            className='mt-8'
            style={{
              opacity: menuVisible ? 1 : 0,
              transform: menuVisible ? 'translateY(0)' : 'translateY(16px)',
              transition: `opacity 0.3s ease ${80 + navLinks.length * 55}ms, transform 0.3s ease ${80 + navLinks.length * 55}ms`,
            }}
          >
            <p className='text-[9px] font-bold tracking-[0.3em] uppercase text-mist mb-4'>Account</p>
            {user ? (
              <Link href='/account' onClick={closeMenu} className='font-display text-3xl text-cream hover:text-lime transition-colors tracking-wider'>
                My Account
              </Link>
            ) : (
              <div className='flex items-center gap-6'>
                <Link href='/signin' onClick={closeMenu} className='font-display text-3xl text-cream hover:text-lime transition-colors tracking-wider'>
                  Sign In
                </Link>
                <Link href='/signup' onClick={closeMenu} className='px-5 py-2.5 bg-lime text-forest font-bold text-[10px] tracking-widest uppercase hover:bg-lime/90 transition-colors'>
                  Join the Collective
                </Link>
              </div>
            )}
            {isAdmin && (
              <Link href='/admin' onClick={closeMenu} className='mt-3 block font-display text-2xl text-gold hover:text-gold/80 transition-colors tracking-wider'>
                Admin Panel
              </Link>
            )}
          </div>

          {/* Footer bar */}
          <div
            className='mt-auto pt-6 border-t border-smoke/40 flex items-center justify-between'
            style={{
              opacity: menuVisible ? 1 : 0,
              transition: 'opacity 0.3s ease 420ms',
            }}
          >
            <div className='flex items-center gap-2'>
              <span className='w-1 h-1 rounded-full bg-lime' aria-hidden='true' />
              <p className='text-mist text-[10px] font-bold tracking-[0.3em] uppercase'>Farmers Helping Farmers</p>
            </div>
            <button
              onClick={() => {
                closeMenu();
                openCart();
              }}
              className='flex items-center gap-2 text-ivory hover:text-lime transition-colors'
              aria-label={`Open cart — ${count} item${count !== 1 ? 's' : ''}`}
            >
              <ShoppingCart size={18} aria-hidden='true' />
              {count > 0 && <span className='text-lime text-xs font-bold tabular-nums'>{count}</span>}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
