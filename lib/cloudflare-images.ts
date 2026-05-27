/**
 * Cloudflare Images integration
 *
 * Delivery URL format:
 *   https://imagedelivery.net/{accountHash}/{imageId}/{variant}
 *
 * Variants are defined in Cloudflare dashboard:
 *   - hero          (1920w, scale-down) — full-bleed hero backgrounds
 *   - card          (600×600 cover)    — product grid cards
 *   - product       (800×800 contain)  — main product image
 *   - productsm     (400×400 contain)  — product image (mobile / retina cards)
 *   - thumbnail     (200×200 cover)    — cart items, small previews
 *   - og            (1200×630 cover)   — Open Graph / social sharing
 *   - admin         (240×240 crop)     — admin list thumbnails
 *   - public        (original size)    — raw/unresized access
 *
 * Folder structure (custom IDs used on upload):
 *   ccc/products/{uuid}   — product images
 *   ccc/hero/{uuid}       — homepage / hero banners
 *   ccc/brand/{uuid}      — logos, brand assets
 *   ccc/misc/{uuid}       — everything else
 *
 * Set NEXT_PUBLIC_CF_IMAGES_ACCOUNT_HASH in .env.local
 */

const ACCOUNT_HASH = process.env.NEXT_PUBLIC_CF_IMAGES_ACCOUNT_HASH ?? '';
const CDN_BASE = `https://imagedelivery.net/${ACCOUNT_HASH}`;

export type CfImageVariant = 'hero' | 'card' | 'product' | 'productsm' | 'thumbnail' | 'og' | 'admin' | 'public';

/** Folder prefixes for all CCC assets inside Cloudflare Images */
export const CF_FOLDERS = {
  products: 'ccc/products',
  hero: 'ccc/hero',
  brand: 'ccc/brand',
  misc: 'ccc/misc',
} as const;

export type CfFolder = (typeof CF_FOLDERS)[keyof typeof CF_FOLDERS];

/**
 * Returns a Cloudflare Images delivery URL.
 * Falls back to the imageId itself if no account hash is configured (dev mode).
 */
export function cfImageUrl(imageId: string, variant: CfImageVariant = 'product'): string {
  if (!ACCOUNT_HASH || imageId.startsWith('https://') || imageId.startsWith('http://')) {
    // Already a full URL (dev placeholder) — return as-is
    return imageId;
  }
  return `${CDN_BASE}/${imageId}/${variant}`;
}

/**
 * Uploads an image to Cloudflare Images via the REST API.
 * Assigns a custom ID with folder prefix so images are organised in CF dashboard.
 * Call this from a server-side API route only (uses CF_IMAGES_API_TOKEN).
 *
 * @param file     - File or Blob to upload
 * @param folder   - Destination folder (default: ccc/products)
 * @param metadata - Optional key/value metadata stored alongside the image
 */
export async function uploadImageToCloudflare(file: File | Blob, folder: CfFolder = CF_FOLDERS.products, metadata?: Record<string, string>): Promise<{ id: string }> {
  const accountId = process.env.CF_IMAGES_ACCOUNT_ID;
  const apiToken = process.env.CF_IMAGES_API_TOKEN;

  if (!accountId || !apiToken) {
    throw new Error('CF_IMAGES_ACCOUNT_ID and CF_IMAGES_API_TOKEN must be set');
  }

  // Build a folder-prefixed custom ID so images appear grouped in CF dashboard
  const customId = `${folder}/${crypto.randomUUID()}`;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('id', customId);
  if (metadata) {
    formData.append('metadata', JSON.stringify(metadata));
  }

  const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Cloudflare Images upload failed: ${errorText}`);
  }

  const data = (await response.json()) as {
    result: { id: string; variants: string[] };
    success: boolean;
    errors: { message: string }[];
  };

  if (!data.success) {
    throw new Error(`Cloudflare Images error: ${data.errors.map((e) => e.message).join(', ')}`);
  }

  // Return the image ID only — callers construct variant URLs at render time
  // via cfImageUrl(id, variant). Storing the ID (not a baked-in URL) means
  // any variant can be requested for the same image.
  return {
    id: data.result.id,
  };
}

/**
 * Lists images from Cloudflare Images, optionally filtered by folder prefix.
 * Server-side only (uses CF_IMAGES_API_TOKEN).
 *
 * @param folder - Optional folder prefix to filter (e.g. "ccc/products")
 * @param page   - 1-based page number
 * @param perPage - Results per page (max 100)
 */
export async function listCfImages(folder?: CfFolder | string, page = 1, perPage = 100): Promise<{ id: string; url: string; uploaded: string }[]> {
  const accountId = process.env.CF_IMAGES_ACCOUNT_ID;
  const apiToken = process.env.CF_IMAGES_API_TOKEN;

  if (!accountId || !apiToken) {
    throw new Error('CF_IMAGES_ACCOUNT_ID and CF_IMAGES_API_TOKEN must be set');
  }

  const url = new URL(`https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`);
  url.searchParams.set('page', String(page));
  url.searchParams.set('per_page', String(perPage));

  const response = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${apiToken}` },
    // Disable Next.js fetch cache — always return fresh image list
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Cloudflare Images list failed: ${await response.text()}`);
  }

  const data = (await response.json()) as {
    result: { images: { id: string; uploaded: string }[] };
    success: boolean;
    errors: { message: string }[];
  };

  if (!data.success) {
    throw new Error(`Cloudflare Images error: ${data.errors.map((e) => e.message).join(', ')}`);
  }

  const images = data.result.images ?? [];

  // Filter by folder prefix if requested
  const filtered = folder ? images.filter((img) => img.id.startsWith(folder + '/')) : images;

  return filtered.map((img) => ({
    id: img.id,
    url: cfImageUrl(img.id, 'thumbnail'),
    uploaded: img.uploaded,
  }));
}

/**
 * Deletes an image from Cloudflare Images.
 * Call from server-side only.
 */
export async function deleteImageFromCloudflare(imageId: string): Promise<void> {
  const accountId = process.env.CF_IMAGES_ACCOUNT_ID;
  const apiToken = process.env.CF_IMAGES_API_TOKEN;

  if (!accountId || !apiToken) return;

  await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1/${imageId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${apiToken}` },
  });
}
