'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Leaf } from 'lucide-react';
import { toast } from 'sonner';

export default function SignUpPage() {
  const { signUp, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [newsletterOptIn, setNewsletterOptIn] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      await signUp(email, password, name, newsletterOptIn);
      toast.success('Welcome to the Collective!');
      router.push('/account');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Sign up failed';
      const displayMsg = msg.includes('email-already-in-use') ? 'An account with this email already exists. Sign in instead.' : msg;
      toast.error(displayMsg);
      setError(displayMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    try {
      const { isNewUser } = await signInWithGoogle(newsletterOptIn);
      toast.success(isNewUser ? 'Welcome to the Collective!' : 'Welcome back!');
      router.push('/account');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google sign in failed';
      toast.error(msg);
      setError(msg);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center px-4 py-20'>
      <div className='w-full max-w-md animate-fade-in-up'>
        <div className='text-center mb-8'>
          <div className='inline-flex items-center justify-center w-14 h-14 rounded-full bg-lime/10 border border-lime/30 mb-4 animate-scale-in delay-100'>
            <Leaf size={24} className='text-lime' />
          </div>
          <h1 className='font-display text-4xl text-cream'>Join the Collective</h1>
          <p className='text-mist text-sm mt-1'>Create your CCC account</p>
        </div>

        <div className='bg-canopy border border-smoke rounded-xl p-8 space-y-5 animate-fade-in-up delay-100'>
          {error && <p className='text-xs text-coral bg-coral/10 border border-coral/20 rounded-lg px-4 py-3'>{error}</p>}

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label className='block text-xs font-bold tracking-widest uppercase text-gold mb-1.5'>Full Name</label>
              <input
                type='text'
                required
                autoComplete='name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='w-full px-3 py-2.5 rounded-lg bg-grove border border-smoke text-cream text-sm placeholder:text-mist focus:outline-none focus:border-lime transition-colors'
                placeholder='Your name'
              />
            </div>
            <div>
              <label className='block text-xs font-bold tracking-widest uppercase text-gold mb-1.5'>Email</label>
              <input
                type='email'
                required
                autoComplete='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full px-3 py-2.5 rounded-lg bg-grove border border-smoke text-cream text-sm placeholder:text-mist focus:outline-none focus:border-lime transition-colors'
                placeholder='your@email.com'
              />
            </div>
            <div>
              <label className='block text-xs font-bold tracking-widest uppercase text-gold mb-1.5'>Password</label>
              <input
                type='password'
                required
                autoComplete='new-password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full px-3 py-2.5 rounded-lg bg-grove border border-smoke text-cream text-sm placeholder:text-mist focus:outline-none focus:border-lime transition-colors'
                placeholder='Min. 8 characters'
              />
            </div>
            <div>
              <label className='block text-xs font-bold tracking-widest uppercase text-gold mb-1.5'>Confirm Password</label>
              <input
                type='password'
                required
                autoComplete='new-password'
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className='w-full px-3 py-2.5 rounded-lg bg-grove border border-smoke text-cream text-sm placeholder:text-mist focus:outline-none focus:border-lime transition-colors'
                placeholder='••••••••'
              />
            </div>

            {/* Newsletter opt-in */}
            <label className='flex items-start gap-3 cursor-pointer group'>
              <span className='relative shrink-0 mt-0.5'>
                <input type='checkbox' className='sr-only peer' checked={newsletterOptIn} onChange={(e) => setNewsletterOptIn(e.target.checked)} />
                <span className='flex w-4 h-4 border border-smoke bg-grove peer-checked:bg-lime peer-checked:border-lime transition-colors items-center justify-center'>
                  {newsletterOptIn && (
                    <svg width='10' height='8' viewBox='0 0 10 8' fill='none' aria-hidden>
                      <path d='M1 4l2.5 2.5L9 1' stroke='#0a1a0a' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
                    </svg>
                  )}
                </span>
              </span>
              <span className='text-xs text-ivory/70 leading-relaxed group-hover:text-ivory transition-colors'>
                Send me new releases, island events, and collective news. No spam, unsubscribe anytime.
              </span>
            </label>

            <button
              type='submit'
              disabled={loading}
              className='w-full py-3 bg-lime text-forest font-bold text-sm tracking-widest uppercase rounded-lg hover:bg-lime/90 disabled:opacity-50 transition-colors'
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <div className='relative flex items-center gap-3'>
            <div className='flex-1 h-px bg-smoke' />
            <span className='text-xs text-mist'>or</span>
            <div className='flex-1 h-px bg-smoke' />
          </div>

          <button
            onClick={handleGoogle}
            className='w-full py-3 border border-smoke text-cream text-sm font-medium rounded-lg hover:border-gold hover:text-gold transition-colors flex items-center justify-center gap-3'
          >
            <svg width='18' height='18' viewBox='0 0 24 24' aria-hidden='true'>
              <path fill='#4285F4' d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z' />
              <path fill='#34A853' d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z' />
              <path fill='#FBBC05' d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z' />
              <path fill='#EA4335' d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z' />
            </svg>
            Continue with Google
          </button>
          <p className='text-center text-[11px] text-mist/60'>Newsletter preference above applies to Google sign-up too.</p>

          <p className='text-center text-xs text-mist'>
            Already have an account?{' '}
            <Link href='/signin' className='text-lime hover:underline'>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
