/**
 * Brand image registry
 *
 * All static brand/editorial images (hero, story photos, etc.) are hosted on
 * Cloudflare Images. CF handles resizing, format conversion (WebP/AVIF), and
 * global CDN delivery — Next.js image optimization is bypassed (unoptimized: true).
 *
 * Setup:
 *   1. Run `npm run upload-brand-images` — uploads images from public/ to CF
 *      and prints the env vars to copy.
 *   2. Paste those vars into .env.local (and Vercel env config for production).
 *   3. Restart the dev server — images will now load from CF.
 *
 * Fallback:
 *   When CF env vars are not configured, images fall back to /public/ local files
 *   so development works without a CF connection.
 *
 * Usage:
 *   import { brandImage } from '@/lib/brand-images';
 *   <Image src={brandImage('hero')} ... />
 *   <Image src={brandImage('story1', 'card')} ... />
 */

import { cfImageUrl, type CfImageVariant } from './cloudflare-images';

// ── CF Image IDs ──────────────────────────────────────────────────────────────
// These are set by `npm run upload-brand-images` then pasted into .env.local.
// Until uploaded the value will be an empty string — triggering local fallback.
const CF_IDS = {
  hero: process.env.NEXT_PUBLIC_CF_BRAND_HERO ?? '',
  story1: process.env.NEXT_PUBLIC_CF_BRAND_STORY_1 ?? '',
  story2: process.env.NEXT_PUBLIC_CF_BRAND_STORY_2 ?? '',
  story3: process.env.NEXT_PUBLIC_CF_BRAND_STORY_3 ?? '',
  story4: process.env.NEXT_PUBLIC_CF_BRAND_STORY_4 ?? '',
} as const;

// ── Local fallbacks (development / pre-upload) ────────────────────────────────
const LOCAL_FALLBACKS: Record<keyof typeof CF_IDS, string> = {
  hero: '/Hero.jpeg',
  story1: '/img1.jpeg',
  story2: '/img2.jpeg',
  story3: '/img3.jpeg',
  story4: '/img4.jpeg',
};

export type BrandImageKey = keyof typeof CF_IDS;

/**
 * Returns the delivery URL for a brand image.
 * - When a CF image ID is configured → Cloudflare Images CDN URL
 * - When no CF ID is set → /public/ local file path (dev fallback)
 *
 * @param key     - Image identifier (hero | story1 | story2 | story3 | story4)
 * @param variant - CF variant name (default: 'hero' — 1920w scale-down)
 */
export function brandImage(key: BrandImageKey, variant: CfImageVariant = 'hero'): string {
  const id = CF_IDS[key];
  if (id) return cfImageUrl(id, variant);
  return LOCAL_FALLBACKS[key];
}
