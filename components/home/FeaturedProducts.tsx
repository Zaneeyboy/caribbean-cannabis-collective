import { getFeaturedProducts } from '@/lib/products-server';
import { type Product } from '@/lib/products';
import ProductCard from '@/components/shop/ProductCard';
import AnimateOnScroll from '@/components/ui/AnimateOnScroll';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default async function FeaturedProducts() {
  let products: Product[];
  try {
    products = await getFeaturedProducts();
  } catch {
    products = [];
  }

  return (
    <section className='bg-canopy border-b border-smoke/40 py-20 md:py-28'>
      <div className='max-w-7xl mx-auto px-6 md:px-12'>
        {/* Section header */}
        <AnimateOnScroll animation='reveal-left' className='flex items-end justify-between mb-12'>
          <div>
            <div className='flex items-center gap-3 mb-3'>
              <div className='w-2 h-2 rounded-full bg-lime shrink-0' aria-hidden='true' />
              <span className='text-xs font-bold tracking-[0.35em] uppercase text-lime'>Featured</span>
            </div>
            <h2 className='font-display text-6xl md:text-7xl text-cream leading-none'>Fresh Drops</h2>
          </div>
          <Link
            href='/shop'
            className='hidden sm:flex items-center gap-2 px-5 py-2.5 border border-smoke text-xs font-bold tracking-widest uppercase text-ivory hover:border-lime hover:text-lime transition-colors group'
          >
            View All
            <ArrowRight size={14} className='group-hover:translate-x-1 transition-transform' aria-hidden />
          </Link>
        </AnimateOnScroll>

        {/* Grid — staggered reveal */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
          {products.slice(0, 4).map((product, i) => (
            <AnimateOnScroll key={product.id} animation='reveal-scale' delay={i * 100} className='flex flex-col'>
              <ProductCard product={product} />
            </AnimateOnScroll>
          ))}
        </div>

        {/* Mobile view all */}
        <div className='mt-10 sm:hidden'>
          <Link
            href='/shop'
            className='flex items-center justify-center gap-2 py-3 border border-smoke text-xs font-bold tracking-widest uppercase text-ivory hover:border-lime hover:text-lime transition-colors group'
          >
            View All Products
            <ArrowRight size={14} className='group-hover:translate-x-1 transition-transform' aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
