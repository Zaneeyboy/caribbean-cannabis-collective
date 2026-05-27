# Agent Handoff Notes — Caribbean Cannabis Collective

## For the Next Agent Picking This Up

Read this file top-to-bottom before touching any code. It reflects the **true current state** as of May 12 2026.

---

## Project Location

`C:\Users\zanem\OneDrive\Desktop\caribbean-cannabis-collective`

---

## Build Status ✅

`npm run build` passes cleanly — 21 routes, 0 TypeScript errors. Always verify after edits.

---

## Tech Stack

| Concern    | Tool                                                                                                  |
| ---------- | ----------------------------------------------------------------------------------------------------- |
| Framework  | Next.js 16.2.6 (App Router, Turbopack, TypeScript)                                                    |
| CSS        | Tailwind v4 — **CSS-only config in `app/globals.css`** (`@theme inline {}`). No `tailwind.config.ts`. |
| Fonts      | Bebas Neue → `font-display`, Playfair Display → `font-heading`, Inter → default                       |
| Auth       | Firebase Auth (client) + Firebase Admin SDK (server)                                                  |
| Database   | Firestore                                                                                             |
| Images     | Cloudflare Images CDN (`imagedelivery.net/{ACCOUNT_HASH}/{imageId}/{variant}`)                        |
| Cart State | Zustand + localStorage (`"ccc-cart"`) persisted, syncs to Firestore `carts/{uid}` on login            |
| Payments   | Stripe v22 (lazy singleton `getStripe()` in `lib/stripe.ts`)                                          |
| Email      | Resend (`lib/email.ts`)                                                                               |

---

## Color Tokens (Tailwind v4 — use these class names)

`bg-forest` `bg-canopy` `bg-grove` `bg-smoke` `text-cream` `text-ivory` `text-mist` `text-lime` `text-gold` `text-coral`

---

## Environment Variables Needed

```
# Stripe
STRIPE_SECRET_KEY, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, STRIPE_WEBHOOK_SECRET

# Firebase Client (public)
NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID, NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID, NEXT_PUBLIC_FIREBASE_APP_ID

# Firebase Admin (server-only)
FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY

# Cloudflare Images
NEXT_PUBLIC_CF_IMAGES_ACCOUNT_HASH, CF_IMAGES_ACCOUNT_ID, CF_IMAGES_API_TOKEN

# Resend
RESEND_API_KEY, RESEND_FROM_EMAIL

# App
NEXT_PUBLIC_SITE_URL
```

---

## Key Architecture Notes

### Firebase Admin

`lib/firebase-admin.ts` — `getFirebaseAdmin()` returns `{ db, auth }`. Import `getAuth` from `firebase-admin/auth`.

### Cloudflare Images

`lib/cloudflare-images.ts` — `cfImageUrl(imageId, variant)`. Variants: `public`, `thumbnail`, `product`, `product-sm`, `og`, `admin`. If imageId starts with `https://` (dev placeholder), returns
as-is.

### Stripe

`lib/stripe.ts` — `getStripe()` lazy singleton. **Never** `import stripe from './stripe'` — always call `getStripe()` inside handlers.

### Admin Role

Stored in Firestore `users/{uid}.role` = `'admin'` | `'customer'`. NOT Firebase custom claims. Admin check: `get(/databases/.../users/{uid}).data.role == 'admin'`.

### Cart Sync

`hooks/useCartSync.ts` — runs in `components/Providers.tsx` inside `app/layout.tsx`. On login: merges localStorage cart with Firestore `carts/{uid}`, remote wins conflicts.

### Auth Context

`contexts/AuthContext.tsx` — `useAuth()` hook. Provides: `{ user, profile, isAdmin, loading, signIn, signUp, signInWithGoogle, signOut, resetPassword }`.

---

## Routes Built

| Route                       | Type                     | Notes                                       |
| --------------------------- | ------------------------ | ------------------------------------------- |
| `/`                         | Static                   | Home page                                   |
| `/shop`                     | Static                   | Product listing with category filter        |
| `/shop/[slug]`              | Dynamic                  | Product detail                              |
| `/cart`                     | Static                   | Cart page                                   |
| `/order/[sessionId]`        | Dynamic                  | Post-checkout confirmation                  |
| `/signin`                   | Static                   | Email + Google auth                         |
| `/signup`                   | Static                   | Register                                    |
| `/admin`                    | Static (client-guarded)  | Dashboard with live Firestore stats         |
| `/admin/products`           | Static (client-guarded)  | Product list with delete                    |
| `/admin/products/new`       | Static                   | ProductForm (new)                           |
| `/admin/products/[id]/edit` | Dynamic                  | ProductForm (edit)                          |
| `/admin/orders`             | Static (client-guarded)  | Orders paginated, search, status update     |
| `/admin/users`              | Static (client-guarded)  | Users list, role management                 |
| `/account`                  | Static (client-guarded)  | Profile, order history, sign out            |
| `/admin/orders/[id]`        | Dynamic (client-guarded) | Order detail, line items, status + history  |
| `/admin/users/[id]`         | Dynamic (client-guarded) | User detail, order history, promote/demote  |
| `/admin/settings`           | Static (client-guarded)  | Store config (Firestore config/store)       |
| `/api/checkout`             | API                      | Stripe Checkout Session                     |
| `/api/webhooks/stripe`      | API                      | Stripe webhook → Firestore order            |
| `/api/admin/upload-image`   | API                      | CF Images upload (admin-only, Bearer token) |

---

## What Still Needs Building (Priority Order)

### P1 — Missing pages ✅ DONE

All sidebar-linked pages now exist:

- `app/account/page.tsx` — profile, order history, sign out
- `app/admin/orders/[id]/page.tsx` — order detail, line items, shipping, status history
- `app/admin/users/[id]/page.tsx` — user profile, order history, promote/demote
- `app/admin/settings/page.tsx` — store name, contact email, free shipping threshold

### P2 — Shop text search ✅ DONE

`app/shop/page.tsx` — search `<input>` above category filters, filters by name/description/tags client-side with a clear (×) button.

### P3 — Static content pages

- `app/about/page.tsx`, `app/shipping/page.tsx`, `app/contact/page.tsx`
- `app/faq/page.tsx`, `app/privacy/page.tsx`, `app/terms/page.tsx`

### P4 — Payment processor wiring

- Stripe Checkout is scaffolded but the client-side "Checkout" button in `/cart` needs to POST to `/api/checkout` and redirect to Stripe.
- Webhook at `/api/webhooks/stripe` saves orders to Firestore — verify field mapping matches admin orders view.

### P5 — Firestore indexes

- `firestore.indexes.json` may need composite indexes for queries: `orders` by `customer.email` + `createdAt desc`, `products` by `active` + `name`.

---

## Firestore Security Rules

`firestore.rules` is written and enforces:

- Users: owner read/write, can't self-promote role
- Products: public read (active only), admin write
- Orders: owner or admin read, server-only create, admin update
- Carts: owner only
- Config: any authenticated read, admin write

Deploy with: `firebase deploy --only firestore:rules`

---

## Caching Strategy

- `/shop/*` pages: `s-maxage=300, stale-while-revalidate=86400` via `next.config.ts` headers
- Static assets: handled by Next.js/Vercel automatically
- Cloudflare cache sits in front for `imagedelivery.net` assets (immutable by variant name)
- For ISR on shop pages, add `export const revalidate = 300;` to `app/shop/page.tsx` when products move from static seed data to Firestore

---

## Decisions Pending (Ask the User)

- **Cloudflare vs Firebase for auth/functions** — user is evaluating. See `PLANS/BACKEND_COMPARISON.md` for the full breakdown. Current implementation uses Firebase Auth + Firestore. Cloudflare
  Workers + D1/KV is the alternative.
- **Payment processor** — Stripe is scaffolded but not yet live. No credentials in `.env.local` yet.
- **Product data source** — currently `lib/products.ts` (static). Should move to Firestore when admin product CRUD is ready to use.
- See outline in `PLANS/ECOMMERCE_ARCHITECTURE.md`

---

## Key Design Decisions Already Made

1. **Static product data** for Phase 1 (no CMS, no database for products) — this keeps it simple and fast to ship
2. **Stripe Checkout** (hosted) — not custom payment form — reduces PCI scope dramatically
3. **Zustand** for cart — not Context API — simpler and supports localStorage persistence out of the box
4. **Firebase Firestore** for orders — already familiar to this team (used in PocketCard project)
5. **Two shipping zones only** — US and Caribbean. No per-island complexity yet.
6. **Resend** for transactional email — clean API, React Email for templates

---

## Brand Rules to Follow

- Background: always `#0A1A0A` (forest) or `#142414` (canopy) — **never white backgrounds**
- Headings font: Bebas Neue for display, Playfair Display for card/product titles
- Primary CTA colour: `#6DB33F` (lime green) — not the darker leaf green
- Gold accent `#C9A84C` — use sparingly for borders, highlights, secondary buttons
- ALL display text (Bebas Neue) should be uppercase automatically via CSS

---

## Files Not To Touch

- `PLANS/` — planning docs only, no code here
- `.env.local` — never commit, always set in Vercel dashboard
- `AGENTS.md` — auto-generated by create-next-app, leave as-is

---

## Questions to Clarify With Client Before Go-Live

1. Provide actual product photos (high-res, at least 1000x1000px per product)
2. Confirm exact product SKUs, names, prices, and available sizes/colors
3. Provide Stripe account access (or create new one for them)
4. Provide Firebase project credentials
5. Confirm Caribbean islands to ship to (see current list in `PLANS/ECOMMERCE_ARCHITECTURE.md`)
6. Provide `orders@caribbeancannabiscollective.com` email or domain email for transactional sending
7. Confirm return/refund policy wording for policy page
8. GoDaddy account access for DNS cutover

---

## Dev Commands

```bash
cd "C:\Users\zanem\OneDrive\Desktop\caribbean-cannabis-collective"

npm run dev          # Start dev server at localhost:3000
npm run build        # Production build
npm run lint         # ESLint check
npx vercel           # Deploy to Vercel (requires Vercel CLI)
npx vercel --prod    # Deploy to production domain
```
