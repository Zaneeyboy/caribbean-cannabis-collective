# E-Commerce Architecture — Caribbean Cannabis Collective

## Data Flow Overview

```
User browses /shop
    ↓
Adds product to cart
    ↓ (Zustand store, persisted to localStorage)
Cart drawer shows updated items
    ↓
User proceeds to /cart
    ↓ (selects shipping zone: US | Caribbean)
Clicks "Checkout"
    ↓
POST /api/checkout → Stripe Checkout Session created
    ↓
Redirect to Stripe hosted checkout
    ↓ (user pays)
Stripe redirects to /order/[sessionId]?success=true
    ↓
Order Confirmation page fetches session details
    ↓
Stripe Webhook → POST /api/webhooks/stripe
    ↓
Firebase Firestore: orders/{orderId} written
    ↓
Resend: Order confirmation email sent to customer
```

---

## Product Data Model (Phase 1 — Static)

```typescript
// lib/products.ts

export interface ProductVariant {
  id: string;
  size?: string; // "S" | "M" | "L" | "XL" | "2XL" | "3XL"
  color?: string; // "Black" | "Forest Green" | "Natural"
  inventory: number; // 0 = sold out
  priceCents: number; // price override if different from base
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: 'apparel' | 'headwear' | 'drinkware' | 'accessories';
  description: string;
  priceCents: number; // base price in cents (USD)
  images: string[]; // Cloudinary URLs or /public paths
  variants: ProductVariant[];
  tags: string[]; // "new" | "bestseller" | "sale"
  salePriceCents?: number;
  featured: boolean;
}
```

### Seed Categories (Phase 1)

```typescript
categories = [
  { id: 'apparel', label: 'Apparel', icon: 'Shirt' },
  { id: 'headwear', label: 'Headwear', icon: 'HardHat' },
  { id: 'drinkware', label: 'Drinkware', icon: 'Cup' },
  { id: 'accessories', label: 'Accessories', icon: 'Tag' },
];
```

---

## Cart State (Zustand)

```typescript
// store/cartStore.ts

interface CartItem {
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
  shippingZone: 'US' | 'CARIBBEAN';
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantId: string) => void;
  updateQuantity: (productId: string, variantId: string, qty: number) => void;
  setShippingZone: (zone: 'US' | 'CARIBBEAN') => void;
  clearCart: () => void;
  totalCents: () => number;
  itemCount: () => number;
}
```

---

## Shipping Config

```typescript
// lib/shipping.ts

export const SHIPPING_ZONES = {
  US: {
    label: 'United States',
    options: [
      { id: 'us-standard', label: 'Standard (5–7 days)', priceCents: 899 },
      { id: 'us-expedited', label: 'Expedited (2–3 days)', priceCents: 1999 },
    ],
    freeThresholdCents: 7500, // Free standard over $75
  },
  CARIBBEAN: {
    label: 'Caribbean',
    options: [{ id: 'carib-standard', label: 'Standard (7–14 days)', priceCents: 2499 }],
    freeThresholdCents: null, // No free shipping threshold
    dutyNotice: 'Customer is responsible for any local import duties and taxes.',
    islands: [
      'Trinidad & Tobago',
      'Jamaica',
      'Barbados',
      'St. Lucia',
      'Guyana',
      'Antigua & Barbuda',
      'St. Kitts & Nevis',
      'Grenada',
      'Belize',
      'Dominica',
      'St. Vincent & The Grenadines',
      'Suriname',
      'Aruba',
      'Curaçao',
    ],
  },
} as const;
```

---

## Stripe Checkout API

```typescript
// app/api/checkout/route.ts (outline)

POST /api/checkout
Body: { items: CartItem[], shippingZone: "US" | "CARIBBEAN", shippingOptionId: string }

→ Creates Stripe Checkout Session with:
   - line_items from cart
   - shipping_options from zone config
   - success_url: /order/{CHECKOUT_SESSION_ID}?success=true
   - cancel_url: /cart

→ Returns { url: string } — redirect URL to Stripe
```

---

## Stripe Webhook Handler

```typescript
// app/api/webhooks/stripe/route.ts

Listens for: checkout.session.completed

On event:
1. Verify Stripe signature (STRIPE_WEBHOOK_SECRET)
2. Extract session data (customer email, amount, line items, shipping)
3. Write to Firestore: orders/{sessionId}
4. Send order confirmation email via Resend
5. Return 200 OK
```

---

## Firebase Firestore Order Document

```typescript
interface Order {
  id: string; // Stripe session ID
  stripeSessionId: string;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  customer: {
    name: string;
    email: string;
  };
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    country: string;
    postalCode: string;
  };
  shippingZone: 'US' | 'CARIBBEAN';
  shippingMethod: string;
  lineItems: {
    name: string;
    quantity: number;
    priceCents: number;
    image?: string;
  }[];
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  createdAt: Timestamp;
}
```

---

## Environment Variables

```env
# .env.local (never commit this file)

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Firebase (client)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase (admin / server-side)
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=

# Resend
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=orders@caribbeancannabiscollective.com

# Cloudinary (optional phase 1)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# App
NEXT_PUBLIC_SITE_URL=https://caribbeancannabiscollective.com
```

---

## File / Folder Structure

```
caribbean-cannabis-collective/
├── PLANS/                         ← All planning docs (this folder)
├── app/
│   ├── layout.tsx                 ← Root layout (Nav + Footer)
│   ├── page.tsx                   ← Home page
│   ├── globals.css                ← Tailwind + custom tokens
│   ├── shop/
│   │   ├── page.tsx               ← Product listing
│   │   └── [slug]/
│   │       └── page.tsx           ← Product detail
│   ├── cart/
│   │   └── page.tsx               ← Cart page
│   ├── order/
│   │   └── [sessionId]/
│   │       └── page.tsx           ← Order confirmation
│   ├── about/
│   │   └── page.tsx
│   ├── shipping/
│   │   └── page.tsx
│   ├── contact/
│   │   └── page.tsx
│   ├── faq/
│   │   └── page.tsx
│   └── api/
│       ├── checkout/
│       │   └── route.ts           ← Stripe Checkout Session creation
│       └── webhooks/
│           └── stripe/
│               └── route.ts       ← Stripe webhook handler
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── CartDrawer.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   └── Input.tsx
│   ├── shop/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── CategoryFilter.tsx
│   │   └── SizeSelector.tsx
│   ├── cart/
│   │   ├── CartItem.tsx
│   │   ├── CartSummary.tsx
│   │   └── ShippingZoneSelector.tsx
│   └── home/
│       ├── Hero.tsx
│       ├── FeaturedProducts.tsx
│       ├── BrandStory.tsx
│       └── Newsletter.tsx
├── lib/
│   ├── products.ts                ← Static product catalog
│   ├── shipping.ts                ← Shipping zones config
│   ├── stripe.ts                  ← Stripe client init
│   ├── firebase.ts                ← Firebase client init
│   ├── firebase-admin.ts          ← Firebase Admin init
│   └── utils.ts                   ← formatPrice, cn(), etc.
├── store/
│   └── cartStore.ts               ← Zustand cart store
├── emails/
│   └── OrderConfirmation.tsx      ← React Email template
└── public/
    ├── logo.svg
    ├── hero-bg.jpg                ← Placeholder hero image
    └── og-image.jpg               ← Open Graph image
```
