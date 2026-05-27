'use client';

import Link from 'next/link';
import { CheckCircle, Package, UserPlus } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState, type FormEvent } from 'react';

const INPUT = 'w-full bg-grove border border-smoke focus:border-lime focus:outline-none text-cream placeholder:text-mist px-4 py-3 text-sm';

export default function OrderContent({ sessionId, customerEmail }: { sessionId: string; customerEmail: string | null }) {
  const { clearCart } = useCartStore();
  const { user, signUp } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState(customerEmail ?? '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  async function handleSignUp(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signUp(email, password, name);
      setJoined(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='min-h-[70vh] flex items-center justify-center px-6 py-16'>
      <div className='max-w-lg w-full'>
        {/* Success icon */}
        <div className='w-20 h-20 rounded-full bg-lime/10 border border-lime/30 flex items-center justify-center mx-auto mb-6 animate-scale-in'>
          <CheckCircle size={40} className='text-lime' aria-hidden />
        </div>

        {/* Heading */}
        <div className='text-center mb-8 animate-fade-in-up delay-100'>
          <h1 className='font-display text-5xl text-cream mb-3'>Order Confirmed!</h1>
          <p className='font-heading italic text-ivory text-lg'>Farmers Helping Farmers — thank you for your support.</p>
        </div>

        {/* Order reference */}
        <div className='bg-canopy border border-smoke p-5 mb-6 animate-fade-in-up delay-200'>
          <div className='flex items-center gap-3 mb-3'>
            <Package size={18} className='text-gold' aria-hidden />
            <p className='text-xs font-bold tracking-widest uppercase text-gold'>Order Reference</p>
          </div>
          <p className='font-mono text-sm text-lime break-all'>{sessionId.slice(-16).toUpperCase()}</p>
          <p className='text-xs text-mist mt-2'>A confirmation email has been sent to you. Please check your inbox.</p>
        </div>

        {/* What happens next */}
        <div className='bg-grove border border-smoke p-5 mb-6 space-y-3 animate-fade-in-up delay-300'>
          <p className='text-xs font-bold tracking-widest uppercase text-gold mb-4'>What happens next?</p>
          {[
            "You'll receive an order confirmation email shortly.",
            'Your order will be picked, packed, and dispatched from our NY or Miami hub (US orders) or via DHL (Caribbean).',
            "You'll receive tracking information once your order ships.",
          ].map((step, i) => (
            <div key={i} className='flex gap-3'>
              <span className='text-lime font-bold text-sm shrink-0'>{i + 1}.</span>
              <p className='text-sm text-mist'>{step}</p>
            </div>
          ))}
        </div>

        {/* Post-purchase sign-up prompt — only shown to guests */}
        {!user && (
          <div className='bg-canopy border border-smoke p-6 mb-6 animate-fade-in-up delay-400'>
            {joined ? (
              /* Success state */
              <div className='text-center py-2'>
                <CheckCircle size={32} className='text-lime mx-auto mb-3' aria-hidden />
                <p className='font-display text-2xl text-cream mb-1'>You&apos;re in the Collective.</p>
                <p className='text-sm text-mist mb-4'>This order is now linked to your account.</p>
                <Link href='/account' className='inline-block text-lime text-xs font-bold tracking-widest uppercase hover:underline'>
                  View My Account →
                </Link>
              </div>
            ) : (
              <>
                {/* Prompt header */}
                <div className='flex items-center gap-2 mb-1'>
                  <UserPlus size={14} className='text-lime' aria-hidden />
                  <p className='text-[10px] font-bold tracking-[0.3em] uppercase text-lime'>Join the Collective</p>
                </div>
                <h2 className='font-display text-2xl text-cream mb-1'>Track this order &amp; all future ones</h2>
                <p className='text-sm text-mist mb-5'>Create an account in 30 seconds. This order will be linked to your account automatically.</p>

                {error && <p className='text-red-400 text-xs mb-3'>{error}</p>}

                <form onSubmit={handleSignUp} className='flex flex-col gap-3'>
                  <input type='text' placeholder='Your name' value={name} onChange={(e) => setName(e.target.value)} required className={INPUT} />
                  <input
                    type='email'
                    placeholder='Email address'
                    value={email}
                    readOnly={!!customerEmail}
                    onChange={(e) => {
                      if (!customerEmail) setEmail(e.target.value);
                    }}
                    required
                    className={`${INPUT} ${customerEmail ? 'opacity-60 cursor-default' : ''}`}
                  />
                  <input type='password' placeholder='Choose a password (8+ characters)' value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} className={INPUT} />
                  <button
                    type='submit'
                    disabled={loading}
                    className='w-full py-3 bg-lime text-forest text-xs font-bold tracking-widest uppercase hover:bg-lime/90 transition-colors disabled:opacity-60'
                  >
                    {loading ? 'Creating Account…' : 'Create Account'}
                  </button>
                </form>

                <p className='text-center text-xs text-mist mt-4'>
                  Already have an account?{' '}
                  <Link href={`/signin?redirect=/order/${sessionId}`} className='text-lime hover:underline'>
                    Sign in
                  </Link>
                </p>
              </>
            )}
          </div>
        )}

        {/* Actions */}
        <div className='flex flex-col sm:flex-row gap-3 animate-fade-in-up delay-500'>
          <Link href='/shop' className='flex-1 text-center px-6 py-3 bg-lime text-forest text-sm font-bold tracking-widest uppercase hover:bg-lime/90 transition-colors'>
            Continue Shopping
          </Link>
          <Link href='/' className='flex-1 text-center px-6 py-3 border border-gold text-gold text-sm font-bold tracking-widest uppercase hover:bg-gold hover:text-forest transition-colors'>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
