'use client';

import { useState } from 'react';
import { Mail, Link2, MessageCircle, Send, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      // POST to a simple contact API — we'll wire Resend on the backend
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed');
      setStatus('sent');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <div className='min-h-screen bg-forest'>
      {/* Hero */}
      <section className='bg-canopy border-b border-smoke py-16 md:py-24 px-4 relative'>
        <div className='max-w-4xl mx-auto text-center'>
          <p className='text-xs font-bold tracking-[0.3em] uppercase text-gold mb-4 animate-fade-in-up delay-75'>Get In Touch</p>
          <h1 className='font-display text-6xl md:text-7xl text-cream mb-4 animate-fade-in-up delay-150'>Contact</h1>
          <p className='text-mist text-lg max-w-xl mx-auto animate-fade-in-up delay-300'>Questions about orders, wholesale inquiries, press, or just want to connect with the collective?</p>
        </div>
        <div className='absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent' />
      </section>

      <div className='max-w-5xl mx-auto px-4 md:px-8 py-12 md:py-16'>
        <div className='grid md:grid-cols-5 gap-10'>
          {/* Form */}
          <div className='md:col-span-3 animate-fade-in-up delay-200'>
            {status === 'sent' ? (
              <div className='flex flex-col items-center justify-center text-center py-16 gap-4'>
                <div className='w-16 h-16 rounded-full bg-lime/10 border border-lime/30 flex items-center justify-center'>
                  <CheckCircle size={32} className='text-lime' />
                </div>
                <h2 className='font-display text-3xl text-cream'>Message Sent!</h2>
                <p className='text-mist max-w-sm'>We&apos;ll get back to you within 1–2 business days. One love.</p>
                <button onClick={() => setStatus('idle')} className='mt-4 text-xs text-lime hover:underline'>
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className='space-y-5'>
                <div className='grid sm:grid-cols-2 gap-5'>
                  <div>
                    <label htmlFor='name' className='block text-[10px] font-bold tracking-widest uppercase text-mist mb-2'>
                      Your Name
                    </label>
                    <input
                      id='name'
                      type='text'
                      required
                      value={form.name}
                      onChange={set('name')}
                      placeholder='Jane Doe'
                      className='w-full px-4 py-3 rounded-xl bg-canopy border border-smoke text-cream text-sm placeholder-mist/50 focus:outline-none focus:border-lime transition-colors'
                    />
                  </div>
                  <div>
                    <label htmlFor='email' className='block text-[10px] font-bold tracking-widest uppercase text-mist mb-2'>
                      Email Address
                    </label>
                    <input
                      id='email'
                      type='email'
                      required
                      value={form.email}
                      onChange={set('email')}
                      placeholder='jane@example.com'
                      className='w-full px-4 py-3 rounded-xl bg-canopy border border-smoke text-cream text-sm placeholder-mist/50 focus:outline-none focus:border-lime transition-colors'
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor='subject' className='block text-[10px] font-bold tracking-widest uppercase text-mist mb-2'>
                    Subject
                  </label>
                  <select
                    id='subject'
                    required
                    value={form.subject}
                    onChange={set('subject')}
                    className='w-full px-4 py-3 rounded-xl bg-canopy border border-smoke text-cream text-sm focus:outline-none focus:border-lime transition-colors'
                  >
                    <option value=''>Select a topic…</option>
                    <option value='order'>Order question</option>
                    <option value='wholesale'>Wholesale / bulk inquiry</option>
                    <option value='press'>Press / media</option>
                    <option value='collab'>Collaboration</option>
                    <option value='advocacy'>Advocacy / partnership</option>
                    <option value='other'>Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor='message' className='block text-[10px] font-bold tracking-widest uppercase text-mist mb-2'>
                    Message
                  </label>
                  <textarea
                    id='message'
                    required
                    rows={6}
                    value={form.message}
                    onChange={set('message')}
                    placeholder="Tell us what's on your mind…"
                    className='w-full px-4 py-3 rounded-xl bg-canopy border border-smoke text-cream text-sm placeholder-mist/50 focus:outline-none focus:border-lime transition-colors resize-none'
                  />
                </div>

                {status === 'error' && (
                  <p className='text-xs text-coral bg-coral/10 border border-coral/20 rounded-lg px-4 py-3'>
                    Something went wrong. Please email us directly at{' '}
                    <a href='mailto:hello@caribbeancannabiscollective.com' className='underline'>
                      hello@caribbeancannabiscollective.com
                    </a>
                  </p>
                )}

                <button
                  type='submit'
                  disabled={status === 'sending'}
                  className='flex items-center gap-2 w-full sm:w-auto px-8 py-3.5 rounded-xl bg-lime text-forest font-bold tracking-widest uppercase text-sm hover:bg-lime/90 transition-colors disabled:opacity-60 justify-center'
                >
                  <Send size={15} />
                  {status === 'sending' ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <div className='md:col-span-2 space-y-4 animate-fade-in-right delay-300'>
            <div className='bg-canopy border border-smoke rounded-xl p-6 space-y-5'>
              <h3 className='text-cream font-semibold text-sm'>Other ways to reach us</h3>

              <a href='mailto:hello@caribbeancannabiscollective.com' className='flex items-center gap-3 group'>
                <div className='w-9 h-9 rounded-lg bg-grove flex items-center justify-center group-hover:bg-lime/10 transition-colors'>
                  <Mail size={16} className='text-mist group-hover:text-lime transition-colors' />
                </div>
                <div>
                  <p className='text-[10px] font-bold tracking-widest uppercase text-mist'>Email</p>
                  <p className='text-cream text-sm group-hover:text-lime transition-colors'>hello@caribbeancannabiscollective.com</p>
                </div>
              </a>

              <a href='https://instagram.com/caribbeancannabiscollective' target='_blank' rel='noopener noreferrer' className='flex items-center gap-3 group'>
                <div className='w-9 h-9 rounded-lg bg-grove flex items-center justify-center group-hover:bg-lime/10 transition-colors'>
                  <Link2 size={16} className='text-mist group-hover:text-lime transition-colors' />
                </div>
                <div>
                  <p className='text-[10px] font-bold tracking-widest uppercase text-mist'>Instagram</p>
                  <p className='text-cream text-sm group-hover:text-lime transition-colors'>@caribbeancannabiscollective</p>
                </div>
              </a>

              <a href='https://wa.me/18005550100' target='_blank' rel='noopener noreferrer' className='flex items-center gap-3 group'>
                <div className='w-9 h-9 rounded-lg bg-grove flex items-center justify-center group-hover:bg-lime/10 transition-colors'>
                  <MessageCircle size={16} className='text-mist group-hover:text-lime transition-colors' />
                </div>
                <div>
                  <p className='text-[10px] font-bold tracking-widest uppercase text-mist'>WhatsApp</p>
                  <p className='text-cream text-sm group-hover:text-lime transition-colors'>+1 (800) 555-0100</p>
                </div>
              </a>
            </div>

            <div className='bg-canopy border border-smoke rounded-xl p-6'>
              <p className='text-[10px] font-bold tracking-widest uppercase text-mist mb-2'>Response Time</p>
              <p className='text-cream text-sm leading-relaxed'>
                We respond to all messages within <span className='text-lime font-semibold'>1–2 business days</span>. For urgent order issues, DM us on Instagram for the fastest response.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
