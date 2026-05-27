import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { brandImage } from '@/lib/brand-images';

export const metadata: Metadata = {
  title: 'Our Story — Caribbean Cannabis Collective',
  description: 'Caribbean Cannabis Collective is a movement built by Caribbean farmers, for Caribbean farmers. Learn where we came from and where we are going.',
};

const values = [
  {
    num: '01',
    label: 'Land & Legacy',
    body: 'Cannabis cultivation is ancestral knowledge across the Caribbean. Long before legalization debates, farmers in Jamaica, St. Lucia, Dominica, and beyond were feeding communities and building livelihoods with this plant. We exist to protect that heritage and ensure the coming legal market does not erase it.',
  },
  {
    num: '02',
    label: 'Community Before Capital',
    body: 'We are not venture-backed. We are not a hedge fund with a farming narrative. Every dollar that flows through CCC merchandise goes back into advocacy work and direct support for small cultivators who cannot afford lobbyists or lawyers.',
  },
  {
    num: '03',
    label: 'Pan-Caribbean Unity',
    body: 'From Jamaica to Trinidad, Barbados to Belize, St. Kitts to Suriname — the Caribbean is not one island. But on the question of who should benefit from cannabis legalization, we speak with one voice: small farmers, local families, the people the land belongs to.',
  },
  {
    num: '04',
    label: 'Transparency Always',
    body: 'We publish where revenue goes. We tell you who we work with. We are building trust in an industry that has historically had very little of it — and we take that responsibility seriously.',
  },
];

const stats = [
  { value: '12+', label: 'Islands represented' },
  { value: '200+', label: 'Farmers in the network' },
  { value: '5+', label: 'Years of advocacy' },
];

export default function AboutPage() {
  return (
    <main className='bg-forest min-h-screen'>
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className='relative min-h-[92vh] flex items-end overflow-hidden'>
        <Image src={brandImage('hero')} alt='Caribbean cannabis farm at sunrise' fill className='object-cover object-center' priority />
        {/* Gradient — dark at bottom, shows image at top */}
        <div className='absolute inset-0 bg-linear-to-t from-forest via-forest/75 to-forest/10' aria-hidden />
        <div className='absolute inset-x-0 top-0 h-px bg-lime/25' aria-hidden />

        <div className='relative z-10 max-w-7xl mx-auto px-4 md:px-8 pb-20 md:pb-28 w-full'>
          <div className='flex items-center gap-2 mb-6'>
            <span className='w-1.5 h-1.5 rounded-full bg-lime shrink-0' aria-hidden />
            <p className='text-[10px] font-bold tracking-[0.3em] uppercase text-cream'>Our Story</p>
          </div>
          <h1 className='font-display text-8xl md:text-[10rem] lg:text-[12rem] text-cream leading-none'>
            Farmers
            <br />
            Helping
            <br />
            <span className='text-lime'>Farmers.</span>
          </h1>
        </div>
      </section>

      {/* ── MANIFESTO ─────────────────────────────────────────────────────── */}
      <section className='bg-canopy border-b border-smoke/40'>
        <div className='max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-20'>
          <p className='font-heading text-xl md:text-2xl text-ivory/80 leading-relaxed max-w-3xl'>
            The Caribbean has cultivated cannabis for generations. What it has never had is a seat at the table when the profits are counted.{' '}
            <span className='text-cream'>Caribbean Cannabis Collective exists to change that.</span>
          </p>
        </div>
      </section>

      {/* ── ORIGIN ────────────────────────────────────────────────────────── */}
      <section className='max-w-7xl mx-auto px-4 md:px-8 py-20 md:py-32'>
        <div className='grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20'>
          {/* Left — heading + image, sticky on desktop */}
          <div className='md:col-span-5 md:sticky md:top-28 self-start'>
            <div className='flex items-center gap-2 mb-4'>
              <span className='w-1.5 h-1.5 rounded-full bg-lime shrink-0' aria-hidden />
              <p className='text-[10px] font-bold tracking-[0.3em] uppercase text-mist'>Where It Begins</p>
            </div>
            <h2 className='font-display text-5xl md:text-6xl text-cream leading-none mb-8'>
              Rooted in
              <br />
              the Caribbean.
            </h2>
            <div className='relative aspect-4/3 overflow-hidden'>
              <Image src={brandImage('story1', 'card')} alt='A farmer in the Caribbean highlands' fill className='object-cover' />
            </div>
          </div>

          {/* Right — story copy */}
          <div className='md:col-span-7 space-y-6 text-ivory/70 text-sm leading-relaxed md:pt-20'>
            <p>
              Caribbean Cannabis Collective started as a conversation between farmers — people who had been growing cannabis in the hills of Jamaica, the highlands of St. Lucia, and the interior of
              Trinidad for generations, watching legalization debates unfold around them while their livelihoods remained precarious and their voices went unheard.
            </p>
            <p>
              The legal cannabis industry was being built by people who had never touched soil. Capital was flowing in from North America and Europe, and the farmers who had grown, harvested, and
              sustained communities through decades of prohibition were being locked out of their own industry through regulation, licensing costs, and a lack of access to the infrastructure new
              markets demanded.
            </p>
            <p>
              We built CCC to change that narrative. To create economic pathways, share legal and agronomic knowledge, build community across island lines, and fund advocacy through culture — through
              clothing, connection, and collective pride.
            </p>

            {/* Pull quote */}
            <blockquote className='border-l-2 border-lime pl-6 py-2 mt-4'>
              <p className='font-heading text-xl text-cream leading-relaxed italic'>
                &ldquo;The land and the plant have sustained our communities for centuries. The future of cannabis in the Caribbean must honour that heritage.&rdquo;
              </p>
              <p className='text-mist text-[10px] font-bold tracking-[0.25em] uppercase mt-4'>— The Collective</p>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────────────── */}
      <section className='bg-canopy border-y border-smoke/40'>
        <div className='max-w-7xl mx-auto px-4 md:px-8'>
          <div className='grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-smoke/40'>
            {stats.map((s) => (
              <div key={s.label} className='py-14 px-4 md:px-12 first:pl-0 last:pr-0'>
                <p className='font-display text-7xl md:text-8xl text-lime leading-none mb-2'>{s.value}</p>
                <p className='text-[10px] font-bold tracking-[0.3em] uppercase text-mist'>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISSION — FULL BLEED IMAGE ────────────────────────────────────── */}
      <section className='relative min-h-[65vh] flex items-end overflow-hidden'>
        <Image src={brandImage('story2')} alt='Collective members at a farm' fill className='object-cover object-center' />
        <div className='absolute inset-0 bg-linear-to-t from-forest via-forest/70 to-forest/10' aria-hidden />

        <div className='relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-20 md:py-28 w-full'>
          <div className='max-w-2xl'>
            <div className='flex items-center gap-2 mb-4'>
              <span className='w-1.5 h-1.5 rounded-full bg-lime shrink-0' aria-hidden />
              <p className='text-[10px] font-bold tracking-[0.3em] uppercase text-cream'>The Mission</p>
            </div>
            <h2 className='font-display text-6xl md:text-8xl text-cream leading-none mb-6'>
              Culture
              <br />
              as currency.
            </h2>
            <p className='text-ivory/80 text-sm leading-relaxed'>
              CCC merchandise is advocacy in wearable form. When you buy a CCC piece, you are funding legal support for farmers who cannot afford it, community education programs, and the network
              infrastructure that connects growers across islands who previously had no way to speak to each other.
            </p>
          </div>
        </div>
      </section>

      {/* ── VALUES ────────────────────────────────────────────────────────── */}
      <section className='bg-canopy border-t border-smoke/40'>
        <div className='max-w-7xl mx-auto px-4 md:px-8 py-20 md:py-28'>
          <div className='grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 mb-14'>
            <div className='md:col-span-5'>
              <div className='flex items-center gap-2 mb-4'>
                <span className='w-1.5 h-1.5 rounded-full bg-lime shrink-0' aria-hidden />
                <p className='text-[10px] font-bold tracking-[0.3em] uppercase text-mist'>What We Stand For</p>
              </div>
              <h2 className='font-display text-5xl md:text-6xl text-cream leading-none'>Our Values.</h2>
            </div>
          </div>

          <div className='border-t border-smoke/40'>
            {values.map((v) => (
              <div key={v.label} className='grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-16 py-10 border-b border-smoke/40'>
                <div className='md:col-span-1'>
                  <span className='font-display text-3xl text-lime/50 leading-none'>{v.num}</span>
                </div>
                <div className='md:col-span-4'>
                  <h3 className='font-display text-2xl md:text-3xl text-cream leading-none'>{v.label}</h3>
                </div>
                <div className='md:col-span-7'>
                  <p className='text-ivory/60 text-sm leading-relaxed'>{v.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PHOTO + STATEMENT ─────────────────────────────────────────────── */}
      <section className='grid grid-cols-1 md:grid-cols-2'>
        <div className='relative aspect-4/3 md:aspect-auto md:min-h-[55vh] overflow-hidden'>
          <Image src={brandImage('story4', 'card')} alt='Caribbean landscape' fill className='object-cover object-center' />
        </div>
        <div className='bg-grove flex items-end p-10 md:p-16 min-h-[40vh]'>
          <div>
            <div className='w-12 h-px bg-lime mb-8' aria-hidden />
            <p className='font-display text-5xl md:text-6xl text-cream leading-none mb-6'>
              One Caribbean.
              <br />
              <span className='text-lime'>One Voice.</span>
            </p>
            <p className='text-ivory/60 text-sm leading-relaxed max-w-xs'>
              Twelve islands. Two hundred farmers. One collective fighting for the same thing — recognition, equity, and a future built on the soil we have always known.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className='bg-canopy border-t border-smoke/40'>
        <div className='max-w-7xl mx-auto px-4 md:px-8 py-20 md:py-28'>
          <div className='grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-end'>
            <div className='md:col-span-7'>
              <div className='flex items-center gap-2 mb-4'>
                <span className='w-1.5 h-1.5 rounded-full bg-lime shrink-0' aria-hidden />
                <p className='text-[10px] font-bold tracking-[0.3em] uppercase text-mist'>Join the Movement</p>
              </div>
              <h2 className='font-display text-6xl md:text-8xl leading-none mb-6' style={{ WebkitTextStroke: '2px #f4efe4', color: 'transparent' }}>
                Wear the
                <br />
                culture.
              </h2>
              <p className='text-ivory/60 text-sm leading-relaxed max-w-lg'>
                Every purchase is a direct investment in Caribbean farmers. Shop the collection and carry the movement wherever you are in the world.
              </p>
            </div>

            <div className='md:col-span-5 flex flex-col gap-4'>
              <Link href='/shop' className='flex items-center justify-center gap-2 py-4 bg-lime text-forest text-xs font-bold tracking-widest uppercase hover:bg-lime/90 transition-colors group'>
                Shop the Collection
                <ArrowRight size={13} className='group-hover:translate-x-0.5 transition-transform' aria-hidden />
              </Link>
              <Link
                href='/signup'
                className='flex items-center justify-center py-4 border border-smoke text-ivory text-xs font-bold tracking-widest uppercase hover:border-lime hover:text-lime transition-all'
              >
                Create an Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
