/**
 * upload-brand-images.mjs
 *
 * Uploads brand/editorial images from public/ to Cloudflare Images and prints
 * the env vars to paste into .env.local (and Vercel dashboard).
 *
 * Usage:
 *   npm run upload-brand-images
 *
 * Prerequisites:
 *   CF_IMAGES_ACCOUNT_ID and CF_IMAGES_API_TOKEN must be set in .env.local
 *
 * Re-running is safe — if an image was already uploaded with the same custom ID
 * Cloudflare returns a conflict and the script treats it as a success.
 */

import { readFile } from 'fs/promises';
import { join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

// Load .env.local without requiring dotenv to be installed separately
const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dir, '..');

async function loadEnv() {
  try {
    const envText = await readFile(join(ROOT, '.env.local'), 'utf8');
    for (const line of envText.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const val = trimmed
        .slice(eq + 1)
        .trim()
        .replace(/^["']|["']$/g, '');
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    // .env.local not found — rely on process.env already being set
  }
}

await loadEnv();

const ACCOUNT_ID = process.env.CF_IMAGES_ACCOUNT_ID;
const API_TOKEN = process.env.CF_IMAGES_API_TOKEN;

if (!ACCOUNT_ID || !API_TOKEN) {
  console.error('\n  ✗ CF_IMAGES_ACCOUNT_ID and CF_IMAGES_API_TOKEN must be set in .env.local\n');
  process.exit(1);
}

// ── Images to upload ──────────────────────────────────────────────────────────
// key:  the env var name to add to .env.local
// file: filename inside public/
// id:   custom image ID stored in Cloudflare (folder/name convention)
const IMAGES = [
  { key: 'NEXT_PUBLIC_CF_BRAND_HERO', file: 'Hero.jpeg', id: 'ccc/brand/hero-main', mime: 'image/jpeg' },
  { key: 'NEXT_PUBLIC_CF_BRAND_STORY_1', file: 'img1.jpeg', id: 'ccc/brand/story-1', mime: 'image/jpeg' },
  { key: 'NEXT_PUBLIC_CF_BRAND_STORY_2', file: 'img2.jpeg', id: 'ccc/brand/story-2', mime: 'image/jpeg' },
  { key: 'NEXT_PUBLIC_CF_BRAND_STORY_3', file: 'img3.jpeg', id: 'ccc/brand/story-3', mime: 'image/jpeg' },
  { key: 'NEXT_PUBLIC_CF_BRAND_STORY_4', file: 'img4.jpeg', id: 'ccc/brand/story-4', mime: 'image/jpeg' },
];

// ── Upload helper ─────────────────────────────────────────────────────────────
async function uploadImage(file, customId, mime) {
  const buffer = await readFile(join(ROOT, 'public', file));
  const blob = new Blob([buffer], { type: mime });

  const form = new FormData();
  form.append('file', blob, file);
  form.append('id', customId);

  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/images/v1`, { method: 'POST', headers: { Authorization: `Bearer ${API_TOKEN}` }, body: form });

  const json = await res.json();

  if (!json.success) {
    const msgs = json.errors?.map((e) => e.message).join(', ') ?? 'Unknown error';
    // 409 = image ID already exists — treat as success
    if (res.status === 409 || msgs.toLowerCase().includes('already exist')) {
      return { id: customId, alreadyExisted: true };
    }
    throw new Error(msgs);
  }

  return { id: json.result.id, alreadyExisted: false };
}

// ── Main ──────────────────────────────────────────────────────────────────────
console.log('\n🌿 CCC — Upload Brand Images to Cloudflare Images\n');

const envLines = [];
let ok = 0;
let skip = 0;
let fail = 0;

for (const img of IMAGES) {
  process.stdout.write(`  Uploading ${img.file}...`);
  try {
    const result = await uploadImage(img.file, img.id, img.mime);
    if (result.alreadyExisted) {
      console.log(` ✓ already exists (${result.id})`);
      skip++;
    } else {
      console.log(` ✓ ${result.id}`);
      ok++;
    }
    envLines.push(`${img.key}=${result.id}`);
  } catch (err) {
    console.error(` ✗ ${err.message}`);
    envLines.push(`# ${img.key}=UPLOAD_FAILED — fix manually`);
    fail++;
  }
}

console.log(`\n─────────────────────────────────────────`);
console.log(`  ${ok} uploaded, ${skip} already existed, ${fail} failed\n`);

if (fail === 0) {
  console.log('  Paste these into .env.local and Vercel environment variables:\n');
} else {
  console.log('  Partial results — fix failures then re-run. Paste into .env.local:\n');
}

for (const line of envLines) {
  console.log('  ' + line);
}

console.log('');
