/**
 * strip-exif.mjs
 *
 * Strips ALL metadata (GPS, device info, timestamps, camera model, etc.)
 * from personal/brand images in the public/ folder before deployment.
 *
 * Does NOT touch product images — those go through Cloudflare Images
 * which handles metadata removal on its own.
 *
 * Usage:
 *   npm run strip-exif
 *
 * To process a specific folder:
 *   npm run strip-exif -- --dir public/images
 */

import sharp from 'sharp';
import { readdir, rename, unlink } from 'fs/promises';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ── Config ────────────────────────────────────────────────────────────────────

// Folders to process (relative to project root)
const TARGET_DIRS = ['public'];

// Subfolders to skip — product images live here, Cloudflare handles those
const SKIP_DIRS = ['products', 'node_modules', '.next'];

// Image extensions to process
const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.tif']);

// ── Helpers ───────────────────────────────────────────────────────────────────

async function collectImages(dir, results = []) {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (SKIP_DIRS.includes(entry.name)) continue;

    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      await collectImages(fullPath, results);
    } else if (IMAGE_EXTS.has(extname(entry.name).toLowerCase())) {
      results.push(fullPath);
    }
  }

  return results;
}

async function stripExif(filePath) {
  const ext = extname(filePath).toLowerCase();
  const tmp = filePath + '.tmp';

  // Write to a temp file first — sharp cannot read and write the same file
  let pipeline = sharp(filePath);

  if (ext === '.png') {
    pipeline = pipeline.png({ compressionLevel: 9 });
  } else if (ext === '.webp') {
    pipeline = pipeline.webp({ quality: 92 });
  } else {
    // jpg / jpeg / tiff
    pipeline = pipeline.jpeg({ quality: 92, mozjpeg: true });
  }

  const info = await pipeline.toFile(tmp);

  // Swap temp → original
  await unlink(filePath);
  await rename(tmp, filePath);

  return info;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const dirArgIdx = args.indexOf('--dir');
  const customDir = dirArgIdx !== -1 ? args[dirArgIdx + 1] : null;

  const dirs = customDir ? [join(ROOT, customDir)] : TARGET_DIRS.map((d) => join(ROOT, d));

  console.log('\n🌿 CCC — Strip EXIF Metadata\n');

  let totalFound = 0;
  let totalStripped = 0;
  let totalErrors = 0;

  for (const dir of dirs) {
    let images;
    try {
      images = await collectImages(dir);
    } catch {
      console.error(`  ✗ Could not read directory: ${dir}`);
      continue;
    }

    if (images.length === 0) {
      console.log(`  No images found in ${dir}`);
      continue;
    }

    console.log(`  Processing ${images.length} image(s) in ${dir.replace(ROOT, '.')}...\n`);
    totalFound += images.length;

    for (const imgPath of images) {
      const rel = imgPath.replace(ROOT + '\\', '').replace(ROOT + '/', '');
      try {
        const info = await stripExif(imgPath);
        console.log(`  ✓ ${rel}  (${info.width}×${info.height})`);
        totalStripped++;
      } catch (err) {
        console.error(`  ✗ ${rel}  — ${err.message}`);
        totalErrors++;
      }
    }
  }

  console.log(`\n─────────────────────────────────────────`);
  console.log(`  ${totalStripped}/${totalFound} images stripped`);
  if (totalErrors > 0) {
    console.log(`  ${totalErrors} error(s) — check output above`);
  }
  console.log(`  All GPS, device, and timestamp metadata removed.\n`);
}

main();
