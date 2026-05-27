'use client';

import { categories, type CategoryId, type Product } from '@/lib/products';
import ProductCard from '@/components/shop/ProductCard';
import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';

interface Props {
  products: Product[];
}

export default function ShopContent({ products }: Props) {
  const searchParams = useSearchParams();
  const initialCategory = (searchParams.get('category') as CategoryId) ?? 'all';
  const [activeCategory, setActiveCategory] = useState<CategoryId>(initialCategory);
  const [sort, setSort] = useState<'default' | 'price-asc' | 'price-desc'>('default');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let list = activeCategory === 'all' ? products : products.filter((p) => p.category === activeCategory);

    if (q) {
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q)));
    }

    if (sort === 'price-asc') list = [...list].sort((a, b) => (a.salePriceCents ?? a.priceCents) - (b.salePriceCents ?? b.priceCents));
    if (sort === 'price-desc') list = [...list].sort((a, b) => (b.salePriceCents ?? b.priceCents) - (a.salePriceCents ?? a.priceCents));

    return list;
  }, [activeCategory, sort, searchQuery, products]);

  return (
    <div className='max-w-7xl mx-auto px-4 md:px-8 py-12'>
      {/* Page header */}
      <div className='mb-10 animate-fade-in-up'>
        <p className='text-xs font-bold tracking-[0.3em] uppercase text-gold mb-2'>Official Merchandise</p>
        <h1 className='font-display text-6xl md:text-7xl text-cream'>Shop</h1>
      </div>

      {/* Search input */}
      <div className='relative mb-5'>
        <Search size={15} className='absolute left-4 top-1/2 -translate-y-1/2 text-mist pointer-events-none' />
        <input
          type='text'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder='Search products by name, description, or tag…'
          className='w-full pl-11 pr-10 py-3 rounded-xl bg-canopy border border-smoke text-cream text-sm placeholder-mist focus:outline-none focus:border-lime transition-colors'
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className='absolute right-3 top-1/2 -translate-y-1/2 text-mist hover:text-cream transition-colors' aria-label='Clear search'>
            <X size={15} />
          </button>
        )}
      </div>

      {/* Filter bar */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-smoke'>
        {/* Category filters */}
        <div className='flex flex-wrap gap-2'>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as CategoryId)}
              className={`px-4 py-1.5 rounded-md text-xs font-bold tracking-widest uppercase transition-all ${
                activeCategory === cat.id ? 'bg-lime text-forest' : 'bg-grove text-mist hover:text-cream border border-smoke'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className='flex items-center gap-2'>
          <label htmlFor='sort' className='text-xs text-mist tracking-wider uppercase'>
            Sort:
          </label>
          <select
            id='sort'
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className='bg-grove border border-smoke text-ivory text-xs rounded-md px-3 py-1.5 focus:outline-none focus:border-lime transition-colors'
          >
            <option value='default'>Featured</option>
            <option value='price-asc'>Price: Low → High</option>
            <option value='price-desc'>Price: High → Low</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      <p className='text-xs text-mist mb-6 tracking-wide'>
        {filtered.length} product{filtered.length !== 1 ? 's' : ''}
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className='text-center py-24 text-mist'>
          <p className='font-heading text-xl mb-2'>No products found</p>
          <p className='text-sm'>{searchQuery ? 'Try different search terms or clear the search.' : 'Try a different category.'}</p>
        </div>
      )}
    </div>
  );
}
