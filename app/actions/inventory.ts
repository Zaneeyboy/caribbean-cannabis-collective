'use server';

import { getFirebaseAdmin } from '@/lib/firebase-admin';
import type { CartItem } from '@/store/cartStore';

export interface InventoryCheckResult {
  validItems: CartItem[];
  outOfStockItems: CartItem[];
}

type ProductDoc = {
  active: boolean;
  variants: Array<{ id: string; inventory: number }>;
};

/**
 * Checks each cart item's variant inventory against live Firestore data.
 * Returns two lists: items that still have stock, and items that should be removed.
 * Calls Firebase Admin SDK — safe to use in server actions, bypasses Firestore rules.
 */
export async function checkOutOfStockItems(items: CartItem[]): Promise<InventoryCheckResult> {
  if (!items.length) return { validItems: [], outOfStockItems: [] };

  const { db } = await getFirebaseAdmin();

  // Batch fetch one doc per unique product (minimises Firestore reads)
  const productIds = [...new Set(items.map((i) => i.productId))];
  const productSnaps = await Promise.all(productIds.map((id) => db.collection('products').doc(id).get()));

  const productMap = new Map<string, ProductDoc>();
  productSnaps.forEach((snap) => {
    if (snap.exists) {
      productMap.set(snap.id, snap.data() as ProductDoc);
    }
  });

  const validItems: CartItem[] = [];
  const outOfStockItems: CartItem[] = [];

  for (const item of items) {
    const product = productMap.get(item.productId);

    // Product removed or deactivated
    if (!product || product.active === false) {
      outOfStockItems.push(item);
      continue;
    }

    const variant = product.variants?.find((v) => v.id === item.variantId);

    if (!variant || variant.inventory <= 0) {
      outOfStockItems.push(item);
    } else {
      validItems.push(item);
    }
  }

  return { validItems, outOfStockItems };
}
