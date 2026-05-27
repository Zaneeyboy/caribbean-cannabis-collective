'use server';

import { revalidateTag, revalidatePath } from 'next/cache';
import { PRODUCTS_TAG } from '@/lib/products-server';

/**
 * Call this from any admin action that creates, updates, or deletes a product.
 * It busts the 'products' data cache and triggers regeneration of all
 * product-related pages on the next request.
 */
export async function revalidateProductsCache(): Promise<void> {
  revalidateTag(PRODUCTS_TAG, 'max');
  // Bust pre-rendered page HTML as well so static pages reflect the change
  revalidatePath('/', 'page');
  revalidatePath('/shop', 'page');
  revalidatePath('/shop/[slug]', 'page');
}
