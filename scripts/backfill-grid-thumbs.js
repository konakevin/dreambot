/**
 * Backfill uploads.image_url_thumb — a small grid-tile thumbnail.
 *
 * The grid (3-col PostTile) currently downloads the 768px image_url_display,
 * which is ~2x the pixels a ~390px tile shows. This builds a dedicated
 * ~400x500 cover-cropped JPEG (matching the tile's contentFit="cover" 4:5 crop),
 * uploads it as `<key>.thumb.jpg`, and sets image_url_thumb. Cuts grid bytes
 * ~3x (~115KB -> ~35KB) with no visible change (the tile already crops to 4:5).
 *
 * Sources from image_url_display when present (small download, already resized)
 * and falls back to image_url. Idempotent (only NULL rows), additive (never
 * touches image_url/image_url_display), resumable — safe to run + re-run, and
 * safe to schedule alongside the display-variant backfill so NEW uploads get a
 * thumb shortly after posting.
 *
 *   export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && node scripts/backfill-grid-thumbs.js
 *
 * Flags: --limit N (cap total this run), --dry-run (no writes).
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
const BATCH = 100;
const CONCURRENCY = 6;
const THUMB_W = 400;
const THUMB_H = 500; // 4:5 portrait — matches the grid tile aspect + its cover crop

function keyFromPublicUrl(url) {
  const m = url && url.match(/\/object\/public\/uploads\/(.+)$/);
  return m ? decodeURIComponent(m[1]) : null;
}

async function processOne(row) {
  // Derive the thumb key from the ORIGINAL key so it sits next to the source and
  // is stable regardless of which variant we downscaled from.
  const srcKey = keyFromPublicUrl(row.image_url);
  if (!srcKey) return { skip: 'bad-url' };
  if (srcKey.includes('.thumb.')) return { skip: 'is-thumb' };

  // Download the smallest available source (display variant if present).
  const dl = row.image_url_display || row.image_url;
  const res = await fetch(dl);
  if (!res.ok) return { skip: `fetch-${res.status}` };
  const srcBuf = Buffer.from(await res.arrayBuffer());

  const thumbBuf = await sharp(srcBuf)
    .resize({
      width: THUMB_W,
      height: THUMB_H,
      fit: 'cover',
      position: 'centre',
      withoutEnlargement: true,
    })
    .jpeg({ quality: 78, mozjpeg: true })
    .toBuffer();

  const thumbKey = `${srcKey.replace(/\.[^.]+$/, '')}.thumb.jpg`;
  if (DRY_RUN) return { ok: true, kb: Math.round(thumbBuf.length / 1024), dry: true };

  const up = await sb.storage
    .from('uploads')
    .upload(thumbKey, thumbBuf, {
      contentType: 'image/jpeg',
      cacheControl: '2592000',
      upsert: true,
    });
  if (up.error) return { skip: `upload-${up.error.message}` };
  const thumbUrl = sb.storage.from('uploads').getPublicUrl(thumbKey).data.publicUrl;
  const { error: updErr } = await sb
    .from('uploads')
    .update({ image_url_thumb: thumbUrl })
    .eq('id', row.id);
  if (updErr) return { skip: `update-${updErr.message}` };
  return { ok: true, kb: Math.round(thumbBuf.length / 1024) };
}

async function main() {
  console.log(`Backfill grid thumbs${DRY_RUN ? ' (DRY RUN)' : ''} — limit=${LIMIT}`);
  let done = 0;
  let failed = 0;
  let kbTotal = 0;
  for (;;) {
    if (done >= LIMIT) break;
    const { data: rows, error } = await sb
      .from('uploads')
      .select('id, image_url, image_url_display')
      .is('image_url_thumb', null)
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
    console.log(
      `  …${done} done, ${failed} skipped (avg ${done ? Math.round(kbTotal / done) : 0}KB)`
    );
    if (DRY_RUN) break;
  }
  console.log(`\nDONE: ${done} grid thumbs created, ${failed} skipped.`);
}

main().catch((e) => {
  console.error('fatal:', e);
  process.exit(1);
});
