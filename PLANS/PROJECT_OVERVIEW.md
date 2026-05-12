# Caribbean Cannabis Collective — Project Overview

## Client Brief (from voicenote, May 2026)

> "I'm trying to put together the Caribbean Cannabis Collective site with an online store for merchandise only right now — t-shirts, hats, buckler beers, sleeves, things like that. I'm trying to do a US and Caribbean drop site, so where we could ship to within the Caribbean, and I'll have my guys in New York and Miami ship throughout the US."

---

## Project Goals

1. **Merchandise-only e-commerce store** (Phase 1 — no cannabis products sold)
2. **Dual shipping zones**: United States (NY & Miami distribution) and Caribbean islands
3. **Brand-representative design**: Dark, premium, Caribbean cannabis culture aesthetic
4. **Deploy on Vercel**, eventually pointed to GoDaddy domain `caribbeancannabiscollective.com`

---

## Brand Identity (extracted from existing site)

| Element       | Detail                                               |
|---------------|------------------------------------------------------|
| Brand Name    | Caribbean Cannabis Collective                        |
| Tagline       | "Farmers Helping Farmers"                            |
| Existing URL  | https://caribbeancannabiscollective.com              |
| Current State | GoDaddy "Launching Soon" placeholder page            |
| Logo Style    | Bold condensed all-caps serif wordmark, white on dark |
| Hero Imagery  | Close-up macro cannabis bud photography              |
| Mood          | Dark, earthy, premium, tropical                      |

---

## Color Palette

| Token              | Hex       | Usage                                      |
|--------------------|-----------|--------------------------------------------|
| `--color-forest`   | `#0A1A0A` | Primary background (near-black green)      |
| `--color-canopy`   | `#142414` | Card/surface backgrounds                   |
| `--color-leaf`     | `#2D5A27` | Primary brand green                        |
| `--color-lime`     | `#6DB33F` | Accent / CTA buttons                       |
| `--color-gold`     | `#C9A84C` | Caribbean gold — highlights & borders      |
| `--color-coral`    | `#E05C2A` | Tropical accent / sale badges              |
| `--color-cream`    | `#F4EFE4` | Primary text on dark                       |
| `--color-mist`     | `#B8B0A2` | Secondary / muted text                     |

---

## Typography

| Role       | Font Family        | Source            |
|------------|--------------------|-------------------|
| Display    | Bebas Neue         | Google Fonts      |
| Heading    | Playfair Display   | Google Fonts      |
| Body       | Inter              | Google Fonts      |
| Mono       | JetBrains Mono     | Google Fonts      |

---

## Merchandise Catalog (Phase 1)

| Category   | Items                                          |
|------------|------------------------------------------------|
| Apparel    | T-Shirts (unisex, S–3XL), Hoodies, Tank Tops  |
| Headwear   | Snapback Hats, Bucket Hats, Beanies            |
| Drinkware  | Can Koozies ("Buckler Beer Sleeves"), Tumblers |
| Accessories| Tote Bags, Stickers, Patches                   |

> **Note**: Products will initially be static/seeded data. Client will provide actual product photos and SKU details before go-live.

---

## Shipping Zones

### Zone 1 — United States
- Fulfillment hubs: **New York** and **Miami**
- Standard: 5–7 business days
- Expedited: 2–3 business days
- Carriers: USPS, UPS, FedEx

### Zone 2 — Caribbean
- Islands: Trinidad & Tobago, Jamaica, Barbados, St. Lucia, Guyana, Antigua, St. Kitts, Grenada, Belize, and others (configurable)
- Estimated delivery: 7–14 business days
- Note: Customer responsible for any local import duties
- Carrier: DHL Express (recommended for Caribbean)

---

## Pages Planned

| Route             | Page                    | Priority |
|-------------------|-------------------------|----------|
| `/`               | Home / Landing          | P0       |
| `/shop`           | Product Listing         | P0       |
| `/shop/[slug]`    | Product Detail          | P0       |
| `/cart`           | Shopping Cart           | P0       |
| `/checkout`       | Checkout                | P0       |
| `/order/[id]`     | Order Confirmation      | P0       |
| `/about`          | About / Our Story       | P1       |
| `/shipping`       | Shipping Info           | P1       |
| `/contact`        | Contact                 | P1       |
| `/faq`            | FAQ                     | P2       |

---

## Key Stakeholders

| Role             | Notes                                              |
|------------------|----------------------------------------------------|
| Client           | Caribbean Cannabis Collective owner                |
| US Distribution  | Team in New York & Miami                           |
| Developer        | PocketCard / this team                             |
| Domain Registrar | GoDaddy (caribbeancannabiscollective.com)          |
