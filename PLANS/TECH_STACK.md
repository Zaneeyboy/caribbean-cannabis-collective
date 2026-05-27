# Tech Stack — Caribbean Cannabis Collective

## Core Framework

| Layer     | Choice                      | Reason                                            |
| --------- | --------------------------- | ------------------------------------------------- |
| Framework | **Next.js 16** (App Router) | SSR/SSG, Vercel-native, file-based routing        |
| Language  | **TypeScript**              | Type safety, maintainability                      |
| Styling   | **Tailwind CSS v4**         | Utility-first, works perfectly with custom tokens |
| Runtime   | **Node.js 20+**             | Vercel default                                    |

---

## E-Commerce Layer

| Concern       | Choice                                      | Notes                                         |
| ------------- | ------------------------------------------- | --------------------------------------------- |
| Payments      | **Stripe**                                  | Checkout Sessions — no PCI burden on us       |
| Cart State    | **Zustand + localStorage**                  | Client-side persistence between page loads    |
| Product Data  | **Static JSON / lib/products.ts** (Phase 1) | Migrate to CMS later                          |
| Orders        | **Firebase Firestore**                      | Lightweight, no separate backend needed       |
| Shipping Calc | **Manual zones config**                     | Two zones: US + Caribbean (see shipping plan) |

---

## Payments — Stripe Integration

- Use **Stripe Checkout Sessions** (hosted page) for simplicity and PCI compliance
- Stripe **Webhooks** → Firebase Firestore for order recording
- `stripe` npm package (server) + `@stripe/stripe-js` (client)
- Environment variables:
  - `STRIPE_SECRET_KEY`
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - `STRIPE_WEBHOOK_SECRET`

---

## Database — Firebase Firestore

Collections:

```
orders/
  {orderId}/
    customerName, email, shippingAddress, zone (US | CARIBBEAN)
    lineItems[], total, status, createdAt, stripeSessionId

products/          ← optional, for future admin panel
  {productId}/
    name, slug, price, images[], variants[], inventory
```

Environment variables:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `FIREBASE_ADMIN_PRIVATE_KEY`
- `FIREBASE_ADMIN_CLIENT_EMAIL`

---

## Image Handling

| Concern        | Choice                        |
| -------------- | ----------------------------- |
| Product images | **Cloudinary** (free tier)    |
| Hero/brand     | Local `/public/` + Next/Image |
| Placeholder    | `placehold.co` during dev     |

---

## Email / Transactional

| Trigger            | Tool                               |
| ------------------ | ---------------------------------- |
| Order Confirmation | **Resend** (free tier up to 3k/mo) |
| Template           | React Email components             |

---

## Deployment

| Layer   | Service                              |
| ------- | ------------------------------------ |
| Hosting | **Vercel** (Hobby or Pro)            |
| CDN     | Vercel Edge Network (included)       |
| Domain  | GoDaddy → point NS to Vercel         |
| SSL     | Vercel auto-provisions Let's Encrypt |

---

## Dev Tools

| Tool       | Purpose                      |
| ---------- | ---------------------------- |
| ESLint     | Linting                      |
| Prettier   | Formatting                   |
| Turbopack  | Fast dev server (Next.js 16) |
| Vercel CLI | Local dev + deploy preview   |

---

## Key npm Packages to Install

```bash
# E-commerce / payments
npm install stripe @stripe/stripe-js

# State management (cart)
npm install zustand

# Firebase
npm install firebase firebase-admin

# Email
npm install resend @react-email/components

# UI utilities
npm install clsx tailwind-merge lucide-react

# Fonts
npm install @next/font  # (included in next)

# Image upload (Cloudinary)
npm install cloudinary next-cloudinary

# Form handling
npm install react-hook-form zod @hookform/resolvers
```
