import { Suspense } from 'react';
import { getAllProducts } from '@/lib/products-server';
import { type Product } from '@/lib/products';
import ShopContent from './_content';

export default async function ShopPage() {
  // Products are fetched server-side from Firestore, cached with 'use cache',
  // and only re-fetched when the admin creates / updates / deletes a product.
  let products: Product[];
  try {
    products = await getAllProducts();
  } catch {
    products = [];
  }

  return (
    <Suspense fallback={<div className='min-h-screen bg-forest' />}>
      <ShopContent products={products} />
    </Suspense>
  );
}
