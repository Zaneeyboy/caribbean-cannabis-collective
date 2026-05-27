/**
 * Server-only product fetching — uses Firebase Admin SDK so it works in
 * Server Components, Server Actions, and API routes without client credentials.
 *
 * Results are cached with the 'use cache' directive and tagged 'products'.
 * Call revalidateProductsCache() (app/actions/products.ts) after any admin
 * create / update / delete to bust the cache on-demand.
 */

import { cacheTag } from 'next/cache';
import { getFirebaseAdmin } from './firebase-admin';
import type { Product } from './products';

export const PRODUCTS_TAG = 'products';

/**
 * Fetches all active products from Firestore.
 * Result is cached indefinitely and only invalidated via revalidateTag('products').
 */
export async function getAllProducts(): Promise<Product[]> {
  'use cache';
  cacheTag(PRODUCTS_TAG);

  const { db } = await getFirebaseAdmin();
  const snap = await db.collection('products').where('active', '==', true).get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Product);
}

/** Returns only products marked featured: true. Shares the getAllProducts cache. */
export async function getFeaturedProducts(): Promise<Product[]> {
  const all = await getAllProducts();
  return all.filter((p) => p.featured);
}

/** Returns a single product by slug, or undefined if not found. */
export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const all = await getAllProducts();
  return all.find((p) => p.slug === slug);
}

/** Returns a single product by Firestore document ID, or undefined if not found. */
export async function getProductById(id: string): Promise<Product | undefined> {
  const all = await getAllProducts();
  return all.find((p) => p.id === id);
}

/**
 * Returns all product slugs — used by generateStaticParams to pre-render
 * product detail pages at build time.
 */
export async function getAllProductSlugs(): Promise<string[]> {
  const all = await getAllProducts();
  return all.map((p) => p.slug);
}
