# Development Roadmap — Caribbean Cannabis Collective

## Phase 0 — Foundation (Week 1)

**Goal**: Working skeleton deployed to Vercel with brand design system

- [x] Scaffold Next.js 16 project with TypeScript + Tailwind v4
- [ ] Install all npm dependencies (Stripe, Zustand, Firebase, Resend, etc.)
- [ ] Configure Tailwind with brand color tokens and typography
- [ ] Set up Google Fonts (Bebas Neue, Playfair Display, Inter)
- [ ] Create global layout with Nav + Footer
- [ ] Build shared UI components (Button, Badge, Card)
- [ ] Set up `.env.local` with all environment variable placeholders
- [ ] Configure `vercel.json` for deployment
- [ ] Initial Vercel deploy — get a preview URL for client

---

## Phase 1 — Core Store (Weeks 2–3)

**Goal**: Fully browsable store with checkout

- [ ] Seed static product data in `lib/products.ts`
- [ ] Build `/shop` — Product Listing page (grid layout, filter by category)
- [ ] Build `/shop/[slug]` — Product Detail page (image, variants, size selector, add-to-cart)
- [ ] Build cart state with Zustand (persisted to localStorage)
- [ ] Build Cart drawer / sidebar (slide-out)
- [ ] Build `/cart` — Cart page (line items, quantity +/-, remove, shipping zone selector)
- [ ] Integrate Stripe Checkout Session API (`/api/checkout/route.ts`)
- [ ] Build `/order/[id]` — Order Confirmation page (success state after Stripe redirect)
- [ ] Configure Stripe Webhook handler (`/api/webhooks/stripe/route.ts`)
- [ ] Set up Firebase Firestore to record orders from webhook

---

## Phase 2 — Shipping Logic (Week 3)

**Goal**: Correct shipping rates for US vs Caribbean

- [ ] Define shipping zones config (`lib/shipping.ts`)
  - US: Standard (5–7d, $8.99), Expedited (2–3d, $19.99), Free over $75
  - Caribbean: Standard (7–14d, $24.99), No free threshold
- [ ] Add shipping zone selector to cart / checkout
- [ ] Pass selected zone + address to Stripe Checkout as shipping options
- [ ] Display shipping estimate on product and cart pages

---

## Phase 3 — Supporting Pages (Week 4)

**Goal**: Professional, complete site

- [ ] Build `/` — Home / Landing page
  - Hero section (full-bleed dark background + tagline "Farmers Helping Farmers")
  - Featured products strip
  - Brand story teaser ("Cultivating Caribbean Culture")
  - Newsletter / waitlist signup
  - Instagram feed teaser (static placeholder initially)
- [ ] Build `/about` — Our Story
- [ ] Build `/shipping` — Shipping Information page (zones, timelines, duties notice)
- [ ] Build `/contact` — Contact form (sends email via Resend)
- [ ] Build `/faq` — FAQ accordion

---

## Phase 4 — Polish & Pre-Launch (Week 5)

**Goal**: Production-ready

- [ ] Transactional emails via Resend
  - Order confirmation email (React Email template)
  - Shipping update placeholder
- [ ] SEO: `generateMetadata()` on all pages, OG images
- [ ] Sitemap + `robots.ts`
- [ ] Accessibility audit (colour contrast, keyboard nav, ARIA)
- [ ] Mobile responsiveness pass
- [ ] Performance: Image optimisation, lazy loading, bundle analysis
- [ ] Error pages: `error.tsx`, `not-found.tsx`
- [ ] Analytics: Vercel Analytics (free, privacy-friendly)

---

## Phase 5 — Go-Live (Week 6)

**Goal**: Live on GoDaddy domain

- [ ] Client provides: product photos, real SKUs, Stripe keys, Firebase project
- [ ] Replace placeholder product data with real catalog
- [ ] Point GoDaddy domain NS records to Vercel
- [ ] Configure custom domain in Vercel dashboard
- [ ] Final smoke test on production
- [ ] Handoff documentation

---

## Future Phases (Post-Launch)

| Feature                             | Priority |
| ----------------------------------- | -------- |
| Admin dashboard (order mgmt)        | High     |
| Inventory tracking                  | High     |
| Discount codes / promotions         | Medium   |
| Instagram/social feed embed         | Medium   |
| Loyalty / points program            | Low      |
| CMS integration (Sanity/Contentful) | Low      |
| Mobile app (React Native)           | Low      |
