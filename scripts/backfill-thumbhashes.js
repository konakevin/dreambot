#!/usr/bin/env node
/**
 * Backfill uploads.thumbhash for existing posts.
 *
 * Migration 219 added a `thumbhash` column to uploads — a ~25-byte base64
 * preview hash fed to expo-image's `placeholder` prop so cards show a
 * sharp blurry preview during load instead of a black/surface-tinted
 * void. New renders (generate-dream / nightly-dreams / restyle-photo /
 * botEngine) write it on insert; legacy rows stay NULL until this script
 * fills them in.
 *
 * For each upload with thumbhash IS NULL, this script:
 *   1. Downloads the SMALLEST URL it has (image_url_display ~150 KB if
 *      backfilled, else image_url 1-2 MB) — image_url_display is the
 *      faster source since it's a tenth the size.
 *   2. Decodes via sharp to RGBA at ≤100×100 (thumbhash spec).
 *   3. Computes thumbhash via the npm `thumbhash` package.
 *   4. Writes the base64 string to uploads.thumbhash.
 *
 * Safe + resumable: only touches NULL rows, idempotent on re-run, never
 * modifies image_url or deletes anything. Batched with bounded
 * concurrency. ~30 KB/row download (display variant) × 6 in-flight =
 * negligible bandwidth vs the display-variant backfill.
 *
 * Run AFTER scripts/backfill-display-variants.js — display variants are
 * smaller + faster to download, so backfilling those first gives us a
 * fast input for this script.
 *
 *   export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh"
 *   node scripts/backfill-thumbhashes.js [--limit N] [--dry-run]
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const sharp = require('sharp');
const { rgbaToThumbHash } = require('thumbhash');

const sb = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://jimftynwrinwenonjrlj.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const LIMIT = (() => {
  const i = args.indexOf('--limit');
  return i >= 0 ? parseInt(args[i + 1], 10) : Infinity;
})();
const BATCH = 100;
const CONCURRENCY = 6;
const MAX_DIM = 100;

async function processOne(row) {
  // Prefer the small display variant — it's a tenth the size of the original.
  // Fall back to image_url if display hasn't been backfilled yet.
  const src = row.image_url_display || row.image_url;
  if (!src) return { skip: 'no-url' };

  const res = await fetch(src);
  if (!res.ok) return { skip: `fetch-${res.status}` };
  const srcBuf = Buffer.from(await res.arrayBuffer());

  const meta = await sharp(srcBuf).metadata();
  if (!meta.width || !meta.height) return { skip: 'no-dims' };

  const ratio = Math.min(MAX_DIM / meta.width, MAX_DIM / meta.height, 1);
  const tw = Math.max(1, Math.round(meta.width * ratio));
  const th = Math.max(1, Math.round(meta.height * ratio));

  const { data: rgba } = await sharp(srcBuf)
    .resize(tw, th, { fit: 'fill' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const hashBytes = rgbaToThumbHash(tw, th, rgba);
  const thumbhash = Buffer.from(hashBytes).toString('base64');

  if (DRY_RUN) {
    return { ok: true, dry: true, hashLen: thumbhash.length };
  }
  const { error } = await sb.from('uploads').update({ thumbhash }).eq('id', row.id);
  if (error) return { skip: `update-${error.message}` };
  return { ok: true, hashLen: thumbhash.length };
}

async function main() {
  console.log(`Backfill thumbhashes${DRY_RUN ? ' (DRY RUN)' : ''} — limit=${LIMIT}`);
  let done = 0;
  let failed = 0;
  for (;;) {
    if (done >= LIMIT) break;
    const { data: rows, error } = await sb
      .from('uploads')
      .select('id, image_url, image_url_display')
      .is('thumbhash', null)
      .order('created_at', { ascending: false })
      .limit(BATCH);
    if (error) {
      console.error('query error:', error.message);
      break;
    }
    if (!rows || rows.length === 0) break;

    for (let i = 0; i < rows.length; i += CONCURRENCY) {
      const slice = rows.slice(i, i + CONCURRENCY);
      const results = await Promise.all(
        slice.map((r) => processOne(r).catch((e) => ({ skip: e.message }))),
      );
      for (const r of results) {
        if (r.ok) {
          done++;
        } else {
          failed++;
          if (failed <= 20) console.warn('  skip:', r.skip);
        }
      }
      if (done >= LIMIT) break;
    }
    console.log(`  …${done} done, ${failed} skipped`);
    if (DRY_RUN) break;
  }
  console.log(`\nDONE: ${done} thumbhashes filled, ${failed} skipped.`);
}

main().catch((e) => {
  console.error('fatal:', e);
  process.exit(1);
});
