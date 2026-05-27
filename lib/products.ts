export interface ProductVariant {
  id: string;
  size?: string;
  color?: string;
  inventory: number;
  priceCents?: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: 'apparel' | 'headwear' | 'drinkware' | 'accessories';
  description: string;
  priceCents: number;
  salePriceCents?: number;
  /** Default images â€” shown on cards and when no color is selected */
  images: string[];
  /** Per-color image arrays â€” key must match the color string used in variants */
  colorImages?: Record<string, string[]>;
  variants: ProductVariant[];
  tags: string[];
  featured: boolean;
}

// â”€â”€â”€ Placeholder image helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
/** Tailwind CSS ecommerce demo t-shirt images (1â€“6) */
const TW = (n: number) => `https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-02-image-card-0${n}.jpg`;
/** Consistent random photo â€” same seed always returns the same image */
const ps = (seed: string) => `https://picsum.photos/seed/${seed}/600/600`;

/** Build size+color variant rows for apparel */
const sv = (color: string, abbr: string, sizes: string[], inv: number[]): ProductVariant[] =>
  sizes.map((size, i) => ({
    id: `v-${abbr}-${size.toLowerCase().replace('/', '')}`,
    size,
    color,
    inventory: inv[i] ?? 10,
  }));

export const products: Product[] = [
  // â”€â”€â”€ APPAREL â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'ccc-tee-001',
    slug: 'ccc-logo-tee',
    name: 'CCC Logo Tee',
    category: 'apparel',
    description: 'The essential Caribbean Cannabis Collective tee. 100% heavyweight ring-spun cotton, printed with our signature logo. Available in Black, White, and Charcoal.',
    priceCents: 3500,
    images: [TW(1)], // group shot showing all color options
    colorImages: {
      Black: [TW(2)],
      White: [TW(3)],
      Charcoal: [TW(4)],
    },
    variants: [
      ...sv('Black', 'blk', ['S', 'M', 'L', 'XL', '2XL'], [12, 20, 18, 15, 8]),
      ...sv('White', 'wht', ['S', 'M', 'L', 'XL', '2XL'], [10, 16, 14, 12, 6]),
      ...sv('Charcoal', 'cha', ['S', 'M', 'L', 'XL', '2XL'], [8, 14, 12, 10, 5]),
    ],
    tags: ['bestseller', 'new'],
    featured: true,
  },
  {
    id: 'ccc-tee-002',
    slug: 'ccc-linework-tee',
    name: 'Linework Artwork Tee',
    category: 'apparel',
    description: 'Our signature linework design â€” hand-drawn artwork celebrating Caribbean flora. Available in Slate, White, and Forest Green.',
    priceCents: 3800,
    images: [TW(6)],
    colorImages: {
      Slate: [TW(6)],
      White: [TW(3)],
      'Forest Green': [TW(5)],
    },
    variants: [
      ...sv('Slate', 'slt', ['S', 'M', 'L', 'XL', '2XL'], [10, 15, 12, 10, 5]),
      ...sv('White', 'wht', ['S', 'M', 'L', 'XL', '2XL'], [8, 12, 10, 8, 4]),
      ...sv('Forest Green', 'fgn', ['S', 'M', 'L', 'XL', '2XL'], [8, 12, 10, 8, 4]),
    ],
    tags: ['new'],
    featured: true,
  },
  {
    id: 'ccc-hoodie-001',
    slug: 'ccc-collective-hoodie',
    name: 'CCC Collective Hoodie',
    category: 'apparel',
    description: 'Premium heavyweight pullover hoodie with embroidered CCC logo. Built for Caribbean evenings and NYC winters alike. Available in Black and Forest Green.',
    priceCents: 6500,
    images: [ps('ccc-hoodie-main')],
    colorImages: {
      Black: [ps('ccc-hoodie-black'), ps('ccc-hoodie-black-b')],
      'Forest Green': [ps('ccc-hoodie-green'), ps('ccc-hoodie-green-b')],
    },
    variants: [...sv('Black', 'blk', ['S', 'M', 'L', 'XL', '2XL'], [8, 14, 12, 10, 5]), ...sv('Forest Green', 'fgn', ['S', 'M', 'L', 'XL', '2XL'], [6, 10, 8, 7, 3])],
    tags: ['new'],
    featured: true,
  },
  {
    id: 'ccc-tank-001',
    slug: 'ccc-island-tank',
    name: 'Island Vibes Tank',
    category: 'apparel',
    description: 'Lightweight tank for the heat of the islands. Unisex fit, CCC leaf logo on chest. Available in Natural and Black.',
    priceCents: 2500,
    salePriceCents: 2000,
    images: [ps('ccc-tank-main')],
    colorImages: {
      Natural: [ps('ccc-tank-natural')],
      Black: [ps('ccc-tank-black')],
    },
    variants: [...sv('Natural', 'nat', ['S', 'M', 'L', 'XL'], [10, 14, 12, 8]), ...sv('Black', 'blk', ['S', 'M', 'L', 'XL'], [8, 12, 10, 6])],
    tags: ['sale'],
    featured: false,
  },

  // â”€â”€â”€ HEADWEAR â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'ccc-snap-001',
    slug: 'ccc-snapback',
    name: 'CCC Snapback Hat',
    category: 'headwear',
    description: 'Structured 6-panel snapback with embroidered CCC logo. One size fits most. Premium wool blend. Available in Black and Forest Green.',
    priceCents: 3000,
    images: [ps('ccc-snap-main')],
    colorImages: {
      Black: [ps('ccc-snap-black')],
      'Forest Green': [ps('ccc-snap-green')],
    },
    variants: [
      { id: 'v-snap-blk', size: 'One Size', color: 'Black', inventory: 20 },
      { id: 'v-snap-fgn', size: 'One Size', color: 'Forest Green', inventory: 15 },
    ],
    tags: ['bestseller'],
    featured: true,
  },
  {
    id: 'ccc-bucket-001',
    slug: 'ccc-bucket-hat',
    name: 'Farmers Bucket Hat',
    category: 'headwear',
    description: 'The bucket hat for the culture. Woven CCC label on the brim, unstructured cotton twill. Perfect for sun, surf, or city.',
    priceCents: 2800,
    images: [ps('ccc-bucket-main'), ps('ccc-bucket-side')],
    variants: [
      { id: 'v-bucket-sm', size: 'S/M', color: 'Forest Green', inventory: 18 },
      { id: 'v-bucket-lx', size: 'L/XL', color: 'Forest Green', inventory: 15 },
    ],
    tags: ['new'],
    featured: false,
  },
  {
    id: 'ccc-beanie-001',
    slug: 'ccc-ribbed-beanie',
    name: 'CCC Ribbed Beanie',
    category: 'headwear',
    description: 'Tight-knit ribbed beanie with subtle embroidered CCC leaf on the cuff. Charcoal with gold stitching.',
    priceCents: 2200,
    images: [ps('ccc-beanie-main'), ps('ccc-beanie-detail')],
    variants: [{ id: 'v-beanie', size: 'One Size', color: 'Charcoal/Gold', inventory: 25 }],
    tags: [],
    featured: false,
  },

  // â”€â”€â”€ DRINKWARE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'ccc-koozie-001',
    slug: 'ccc-can-koozie',
    name: 'CCC Can Koozie â€” 3-Pack',
    category: 'drinkware',
    description: 'Keep your Buckler cold from first sip to last. Neoprene can koozies with CCC logo. Pack of 3 in black, forest, and gold.',
    priceCents: 1800,
    images: [ps('ccc-koozie-main'), ps('ccc-koozie-detail')],
    variants: [{ id: 'v-koozie', inventory: 40 }],
    tags: ['bestseller'],
    featured: false,
  },
  {
    id: 'ccc-tumbler-001',
    slug: 'ccc-insulated-tumbler',
    name: 'CCC Insulated Tumbler â€” 20oz',
    category: 'drinkware',
    description: 'Double-wall vacuum insulated tumbler. Keeps drinks cold 24hrs, hot 12hrs. Matte black with gold CCC logo laser engraved.',
    priceCents: 3800,
    images: [ps('ccc-tumbler-main'), ps('ccc-tumbler-detail')],
    variants: [{ id: 'v-tumbler', color: 'Matte Black', inventory: 15 }],
    tags: ['new'],
    featured: false,
  },

  // â”€â”€â”€ ACCESSORIES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'ccc-tote-001',
    slug: 'ccc-canvas-tote',
    name: 'CCC Canvas Tote Bag',
    category: 'accessories',
    description: 'Heavy-duty natural canvas tote with CCC logo screenprinted in gold. Oversized for market days, beach runs, or whatever the island calls for.',
    priceCents: 2200,
    images: [ps('ccc-tote-main'), ps('ccc-tote-detail')],
    variants: [{ id: 'v-tote', color: 'Natural Canvas', inventory: 30 }],
    tags: ['new'],
    featured: false,
  },
  {
    id: 'ccc-sticker-pack',
    slug: 'ccc-sticker-pack',
    name: 'CCC Sticker Pack â€” 5pc',
    category: 'accessories',
    description: 'Five die-cut vinyl stickers. Waterproof, UV-resistant. Stick them anywhere.',
    priceCents: 1000,
    images: [ps('ccc-stickers-main'), ps('ccc-stickers-detail')],
    variants: [{ id: 'v-sticker', inventory: 100 }],
    tags: ['bestseller'],
    featured: false,
  },
];

export const categories = [
  { id: 'all', label: 'All Products' },
  { id: 'apparel', label: 'Apparel' },
  { id: 'headwear', label: 'Headwear' },
  { id: 'drinkware', label: 'Drinkware' },
  { id: 'accessories', label: 'Accessories' },
] as const;

export type CategoryId = (typeof categories)[number]['id'];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: CategoryId): Product[] {
  if (category === 'all') return products;
  return products.filter((p) => p.category === category);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}
