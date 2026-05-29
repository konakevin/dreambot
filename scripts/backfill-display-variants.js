/**
 * Backfill uploads.image_url_display for existing posts.
 *
 * Every already-posted image is a 1-2MB PNG with no small display variant, so
 * the feed serves the full PNG until backfilled. This script, for each upload
 * whose image_url_display IS NULL, downloads the original, encodes a ~150-260KB
 * JPEG (sharp q80), uploads it next to the original as `<key>.display.jpg`, and
 * sets image_url_display.
 *
 * Safe to run + re-run: idempotent (only touches NULL rows), additive (never
 * modifies image_url or deletes anything), batched with small concurrency, and
 * resumable (just re-run — it picks up where it left off).
 *
 *   export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && node scripts/backfill-display-variants.js
 *
 * Flags: --limit N (cap total processed this run), --dry-run (no writes).
 */

const { createClient } = require('@supabase/supabase-js');
const sharp = require('sharp');
require('dotenv').config({ path: '.env.local' });

const sb = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://jimftynwrinwenonjrlj.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const LIMIT = (() => {
  const i = args.indexOf('--limit');
  return i >= 0 ? parseInt(args[i + 1], 10) : Infinity;
})();
const BATCH = 100; // rows fetched per page
const CONCURRENCY = 6; // images processed in parallel

// Derive the storage object key (path within the bucket) from a public URL.
function keyFromPublicUrl(url) {
  const m = url.match(/\/object\/public\/uploads\/(.+)$/);
  return m ? decodeURIComponent(m[1]) : null;
}

async function processOne(row) {
  const srcKey = keyFromPublicUrl(row.image_url);
  if (!srcKey) return { skip: 'bad-url' };
  // Only originals we know are large rasters; skip if it's already a .display.jpg
  if (srcKey.includes('.display.')) return { skip: 'is-display' };

  // Download the original bytes
  const res = await fetch(row.image_url);
  if (!res.ok) return { skip: `fetch-${res.status}` };
  const srcBuf = Buffer.from(await res.arrayBuffer());

  // Encode the small display JPEG
  const displayBuf = await sharp(srcBuf)
    .resize({ width: 768, withoutEnlargement: true })
    .jpeg({ quality: 80, mozjpeg: true })
    .toBuffer();

  const displayKey = `${srcKey.replace(/\.[^.]+$/, '')}.display.jpg`;
  if (DRY_RUN) {
    return { ok: true, kb: Math.round(displayBuf.length / 1024), dry: true };
  }
  const up = await sb.storage
    .from('uploads')
    .upload(displayKey, displayBuf, {
      contentType: 'image/jpeg',
      cacheControl: '2592000',
      upsert: true,
    });
  if (up.error) return { skip: `upload-${up.error.message}` };
  const displayUrl = sb.storage.from('uploads').getPublicUrl(displayKey).data.publicUrl;
  const { error: updErr } = await sb
    .from('uploads')
    .update({ image_url_display: displayUrl })
    .eq('id', row.id);
  if (updErr) return { skip: `update-${updErr.message}` };
  return { ok: true, kb: Math.round(displayBuf.length / 1024) };
}

async function main() {
  console.log(`Backfill display variants${DRY_RUN ? ' (DRY RUN)' : ''} — limit=${LIMIT}`);
  let done = 0;
  let failed = 0;
  let kbTotal = 0;
  for (;;) {
    if (done >= LIMIT) break;
    const { data: rows, error } = await sb
      .from('uploads')
      .select('id, image_url')
      .is('image_url_display', null)
      .ilike('image_url', '%.png')
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
        slice.map((r) => processOne(r).catch((e) => ({ skip: e.message })))
      );
      for (const r of results) {
        if (r.ok) {
          done++;
          kbTotal += r.kb || 0;
        } else {
          failed++;
          if (failed <= 20) console.warn('  skip:', r.skip);
        }
      }
      if (done >= LIMIT) break;
    }
    console.log(`  …${done} done, ${failed} skipped (avg ${done ? Math.round(kbTotal / done) : 0}KB)`);
    // DRY RUN can't advance the NULL cursor (no write), so stop after one page.
    if (DRY_RUN) break;
  }
  console.log(`\nDONE: ${done} display variants created, ${failed} skipped.`);
}

main().catch((e) => {
  console.error('fatal:', e);
  process.exit(1);
});
