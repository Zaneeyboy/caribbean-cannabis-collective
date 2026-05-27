# Design System — Caribbean Cannabis Collective

## Visual Direction

**Mood Board Keywords**: Dark luxury, tropical earthiness, craft culture, premium streetwear, diaspora pride

The design takes cues from the existing site's dark macro cannabis photography and bold typography, elevated to a full e-commerce experience. Think high-end streetwear brand meets Caribbean heritage —
like Supreme meets Bob Marley's estate shop, but cleaner.

---

## Color Tokens

```css
/* In tailwind.config.ts / globals.css */
:root {
  --color-forest: #0a1a0a; /* Primary bg — near-black green */
  --color-canopy: #142414; /* Surface / card bg */
  --color-grove: #1e3a1e; /* Elevated surface, hover states */
  --color-leaf: #2d5a27; /* Primary brand green */
  --color-lime: #6db33f; /* Accent green — CTAs, links */
  --color-gold: #c9a84c; /* Caribbean gold — borders, highlights */
  --color-amber: #8b6914; /* Muted gold — secondary accents */
  --color-coral: #e05c2a; /* Tropical orange-red — sale, hot badges */
  --color-cream: #f4efe4; /* Primary text on dark */
  --color-ivory: #d4ccb8; /* Secondary text */
  --color-mist: #8a8278; /* Muted / placeholder text */
  --color-smoke: #3d3830; /* Dividers, borders */
}
```

### Semantic Colour Usage

| Purpose             | Token            |
| ------------------- | ---------------- |
| Page background     | `forest`         |
| Card background     | `canopy`         |
| Card hover          | `grove`          |
| Primary CTA button  | `lime`           |
| Secondary button    | `gold` (outline) |
| Danger / sale badge | `coral`          |
| Borders             | `smoke`          |
| Headings            | `cream`          |
| Body text           | `ivory`          |
| Muted / captions    | `mist`           |
| Brand accent border | `gold`           |

---

## Typography

### Font Stack

```css
/* Display — used for hero, section titles */
font-family: 'Bebas Neue', sans-serif;

/* Heading — used for product names, card headings */
font-family: 'Playfair Display', serif;

/* Body — used for paragraphs, UI labels */
font-family: 'Inter', sans-serif;
```

### Type Scale

| Class         | Size | Weight | Font       | Usage                   |
| ------------- | ---- | ------ | ---------- | ----------------------- |
| `.display-xl` | 96px | 400    | Bebas Neue | Hero headline           |
| `.display-lg` | 64px | 400    | Bebas Neue | Section title           |
| `.display-md` | 48px | 400    | Bebas Neue | Page title              |
| `.heading-xl` | 36px | 700    | Playfair   | Feature heading         |
| `.heading-lg` | 28px | 600    | Playfair   | Product name            |
| `.heading-md` | 22px | 600    | Playfair   | Card title              |
| `.body-lg`    | 18px | 400    | Inter      | Lead paragraph          |
| `.body-md`    | 16px | 400    | Inter      | Default body            |
| `.body-sm`    | 14px | 400    | Inter      | Captions, labels        |
| `.label`      | 12px | 600    | Inter      | Tags, badges, nav items |

---

## Component Library

### Buttons

```
Primary   — bg-lime text-forest font-bold uppercase tracking-widest
Secondary — border border-gold text-gold bg-transparent hover:bg-gold hover:text-forest
Ghost     — text-cream underline
Danger    — bg-coral text-white
```

### Product Card

```
bg-canopy rounded-lg overflow-hidden border border-smoke
hover:border-gold hover:shadow-[0_0_20px_rgba(201,168,76,0.2)] transition

├── Image (aspect-ratio: 1/1, object-cover)
├── Badge row (NEW | SALE | SOLD OUT)
├── Product Name (Playfair Display, cream)
├── Category (label, mist)
├── Price (Inter bold, lime | cream)
└── Add to Cart button (full width, Primary)
```

### Navigation Bar

```
bg-forest/95 backdrop-blur-sm border-b border-smoke sticky top-0 z-50

├── Logo (Bebas Neue wordmark, white)
├── Nav links (label, ivory, hover:text-lime)
├── Cart icon + badge (lime bubble)
└── Mobile: Hamburger → full-screen overlay menu
```

### Cart Drawer

```
Fixed right panel, 380px wide, bg-canopy border-l border-smoke
Slides in from right with Tailwind translate animation

├── Header: "Your Cart" + close button
├── Line items (product thumb, name, variant, qty controls, price)
├── Subtotal
├── Shipping zone selector (US | Caribbean)
├── Checkout button (Primary, full width)
└── Continue Shopping link
```

### Hero Section

```
Full viewport height
Background: dark overlay on cannabis macro photo
Text centered / left-aligned

├── Eyebrow: "Caribbean Cannabis Collective" (label, gold)
├── H1: "CULTIVATE YOUR CULTURE" (Bebas Neue, 96px, cream)
├── Tagline: "Farmers Helping Farmers" (Playfair italic, ivory)
├── CTA: "Shop Now" (Primary button, large)
└── Scroll indicator (animated chevron, mist)
```

---

## Spacing & Layout

- Base unit: 4px (Tailwind default)
- Container max-width: `1280px`
- Page padding: `px-4 md:px-8 lg:px-16`
- Section spacing: `py-16 md:py-24`
- Product grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`

---

## Motion & Transitions

- Default transition: `transition-all duration-200 ease-in-out`
- Card hover lift: `hover:-translate-y-1 hover:shadow-lg`
- Cart drawer: `translate-x-full → translate-x-0` (300ms ease-out)
- Page transitions: Subtle fade via Next.js layout animations

---

## Iconography

Use **Lucide React** for all UI icons — consistent stroke weight, easily customizable.

Key icons:

- `ShoppingCart` — nav cart
- `X` — close / remove
- `Plus`, `Minus` — quantity controls
- `ChevronDown` — dropdowns, accordions
- `MapPin` — shipping zones
- `Package` — orders
- `Instagram`, `Facebook` — social links
- `Leaf` — brand icon accent

---

## Image Guidelines

| Context         | Aspect Ratio | Treatment                                |
| --------------- | ------------ | ---------------------------------------- |
| Hero            | 16:9 or full | Dark overlay (bg-black/50), object-cover |
| Product listing | 1:1          | object-cover, rounded-t-lg               |
| Product detail  | 4:5          | Gallery with thumbnail row               |
| About / Story   | 16:9         | Warm colour grade preferred              |

---

## Mobile-First Breakpoints

```
xs:  0px    (base)
sm:  640px  (tablet portrait)
md:  768px  (tablet landscape)
lg:  1024px (desktop)
xl:  1280px (wide desktop)
2xl: 1536px (ultra-wide)
```
