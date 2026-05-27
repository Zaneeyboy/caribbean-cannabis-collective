'use client';

/**
 * useCartSync — merges localStorage cart with Firestore cart on sign-in.
 * Import and call this hook once inside a client component in the root layout.
 */

import { useEffect, useRef } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useCartStore, type CartItem } from '@/store/cartStore';
import { useAuth } from '@/contexts/AuthContext';
import { getFirebaseDb } from '@/lib/firebase-client';

export function useCartSync() {
  const { user } = useAuth();
  const { items, clearCart, addItem } = useCartStore();
  const prevUid = useRef<string | null>(null);

  useEffect(() => {
    if (!user) {
      prevUid.current = null;
      return;
    }

    // Only run when uid changes (sign-in event)
    if (prevUid.current === user.uid) return;
    prevUid.current = user.uid;

    const sync = async () => {
      try {
        const db = getFirebaseDb();
        const cartRef = doc(db, 'carts', user.uid);
        const snap = await getDoc(cartRef);

        const localItems = [...items]; // capture current localStorage items
        const remoteItems: CartItem[] = snap.exists() ? (snap.data().items ?? []) : [];

        // Merge: start with remote items, then add local items (increase qty if same variant)
        const merged = [...remoteItems];
        for (const local of localItems) {
          const existing = merged.find((r) => r.productId === local.productId && r.variantId === local.variantId);
          if (existing) {
            existing.quantity = Math.max(existing.quantity, local.quantity);
          } else {
            merged.push(local);
          }
        }

        // Replace local cart with merged result
        clearCart();
        for (const item of merged) {
          addItem(item);
        }

        // Persist merged cart back to Firestore
        await setDoc(cartRef, { items: merged, updatedAt: new Date().toISOString() }, { merge: true });
      } catch (err) {
        console.warn('Cart sync failed:', err);
      }
    };

    sync();
  }, [user, items, clearCart, addItem]);
}
