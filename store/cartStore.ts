'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  productId: string;
  variantId: string;
  name: string;
  image: string;
  priceCents: number;
  quantity: number;
  size?: string;
  color?: string;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  shippingZone: 'US' | 'CARIBBEAN' | 'CANADA' | 'WORLDWIDE';
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (productId: string, variantId: string) => void;
  updateQuantity: (productId: string, variantId: string, qty: number) => void;
  setShippingZone: (zone: 'US' | 'CARIBBEAN' | 'CANADA' | 'WORLDWIDE') => void;
  openCart: () => void;
  closeCart: () => void;
  clearCart: () => void;
  totalCents: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      shippingZone: 'US',

      addItem: (incoming) => {
        const qty = incoming.quantity ?? 1;
        set((state) => {
          const existing = state.items.find((i) => i.productId === incoming.productId && i.variantId === incoming.variantId);
          if (existing) {
            return {
              items: state.items.map((i) => (i.productId === incoming.productId && i.variantId === incoming.variantId ? { ...i, quantity: i.quantity + qty } : i)),
            };
          }
          return { items: [...state.items, { ...incoming, quantity: qty }] };
        });
        get().openCart();
      },

      removeItem: (productId, variantId) =>
        set((state) => ({
          items: state.items.filter((i) => !(i.productId === productId && i.variantId === variantId)),
        })),

      updateQuantity: (productId, variantId, qty) => {
        if (qty <= 0) {
          get().removeItem(productId, variantId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) => (i.productId === productId && i.variantId === variantId ? { ...i, quantity: qty } : i)),
        }));
      },

      setShippingZone: (zone) => set({ shippingZone: zone }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      clearCart: () => set({ items: [] }),

      totalCents: () => get().items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0),

      itemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: 'ccc-cart',
      partialize: (state) => ({
        items: state.items,
        shippingZone: state.shippingZone,
      }),
    },
  ),
);
