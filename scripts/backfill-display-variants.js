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
const PL = require('./lib/postcardLayout');
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

// ── Holiday POSTCARD backfill (mig 479, HOLIDAY_DAY_OF_PLAN.md §7b) ─────────────────────────
// The in-isolate holiday-postcard composite refuses / fails on large sources (seedream-4's
// 1440×2560 PNGs → HTTP 546). The render sets uploads.postcard_pending = <holiday>; this pass
// composites the overlay with sharp (the same placement + scrim math as the edge function, via
// scripts/lib/postcardLayout.js), writes a NEW stamped HQ JPEG + display variant (new keys — the
// old ones may already be CDN-cached), updates the upload, appends postcard:<key>:backfilled to
// the generation log and clears the marker. Runs BEFORE the display pass so the display copy is
// built from the stamped bytes.
const holidayCache = new Map();
async function holidayAssets(key) {
  if (holidayCache.has(key)) return holidayCache.get(key);
  const { data: row } = await sb
    .from('holidays')
    .select('postcard_overlay_url,postcard_anchor,postcard_width_pct,postcard_margin_pct,postcard_scrim')
    .eq('key', key)
    .maybeSingle();
  let assets = null;
  if (row && row.postcard_overlay_url) {
    const res = await fetch(row.postcard_overlay_url);
    if (res.ok) {
      const buf = Buffer.from(await res.arrayBuffer());
      const meta = await sharp(buf).metadata();
      assets = { overlay: buf, overlayW: meta.width, overlayH: meta.height, layout: PL.layoutFromHolidayRow(row) };
    }
  }
  holidayCache.set(key, assets);
  return assets;
}

function scrimSvg(base, band, layout) {
  // A vertical gradient reproducing applyScrim's smoothstep feather (sampled per row).
  const { y0, y1, feather } = PL.scrimBand(base, band, layout.anchor);
  const stops = [];
  const steps = 24;
  for (let i = 0; i <= steps; i++) {
    const y = y0 + ((y1 - y0) * i) / steps;
    const mul = PL.scrimMultiplier(Math.floor(y), band, layout.anchor, feather);
    stops.push(`<stop offset="${((i / steps) * 100).toFixed(2)}%" stop-color="black" stop-opacity="${(1 - mul).toFixed(4)}"/>`);
  }
  const h = Math.max(1, y1 - y0);
  return {
    top: y0,
    svg: Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${base.width}" height="${h}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">${stops.join('')}</linearGradient></defs><rect width="${base.width}" height="${h}" fill="url(#g)"/></svg>`
    ),
  };
}

async function processPostcard(row) {
  const assets = await holidayAssets(row.postcard_pending);
  if (!assets) return { skip: `no-artwork-${row.postcard_pending}` };
  const srcKey = keyFromPublicUrl(row.image_url);
  if (!srcKey) return { skip: 'bad-url' };
  const res = await fetch(row.image_url);
  if (!res.ok) return { skip: `fetch-${res.status}` };
  const srcBuf = Buffer.from(await res.arrayBuffer());
  const meta = await sharp(srcBuf).metadata();
  const base = { width: meta.width, height: meta.height };
  const size = PL.overlaySize(base, { width: assets.overlayW, height: assets.overlayH }, assets.layout);
  const placed = PL.placeOverlay(base, size, assets.layout);
  const overlayBuf = await sharp(assets.overlay).resize(size.width, size.height).png().toBuffer();
  const layers = [];
  if (assets.layout.scrim) {
    const sc = scrimSvg(base, { y: placed.y, height: size.height }, assets.layout);
    layers.push({ input: sc.svg, top: sc.top, left: 0 });
  }
  layers.push({ input: overlayBuf, top: placed.y, left: placed.x });
  const stamped = await sharp(srcBuf).composite(layers).jpeg({ quality: 92, mozjpeg: true }).toBuffer();
  const displayBuf = await sharp(stamped).resize({ width: 768, withoutEnlargement: true }).jpeg({ quality: 80, mozjpeg: true }).toBuffer();
  if (DRY_RUN) return { ok: true, kb: Math.round(stamped.length / 1024), dry: true };
  const stem = srcKey.replace(/\.[^.]+$/, '');
  const hqKey = `${stem}-postcard.jpg`;
  const displayKey = `${stem}-postcard.display.jpg`;
  const up1 = await sb.storage.from('uploads').upload(hqKey, stamped, { contentType: 'image/jpeg', cacheControl: '2592000', upsert: true });
  if (up1.error) return { skip: `upload-hq-${up1.error.message}` };
  const up2 = await sb.storage.from('uploads').upload(displayKey, displayBuf, { contentType: 'image/jpeg', cacheControl: '2592000', upsert: true });
  if (up2.error) return { skip: `upload-display-${up2.error.message}` };
  const hqUrl = sb.storage.from('uploads').getPublicUrl(hqKey).data.publicUrl;
  const displayUrl = sb.storage.from('uploads').getPublicUrl(displayKey).data.publicUrl;
  const { error: updErr } = await sb
    .from('uploads')
    .update({ image_url: hqUrl, image_url_display: displayUrl, postcard_pending: null })
    .eq('id', row.id);
  if (updErr) return { skip: `update-${updErr.message}` };
  // Forensics: the day-of monitor counts postcard:<key>:backfilled as applied.
  const { data: log } = await sb.from('ai_generation_log').select('id,fallback_reasons').eq('upload_id', row.id).order('created_at', { ascending: false }).limit(1).maybeSingle();
  if (log) {
    await sb.from('ai_generation_log').update({ fallback_reasons: [...(log.fallback_reasons || []), `postcard:${row.postcard_pending}:backfilled`] }).eq('id', log.id);
  }
  return { ok: true, kb: Math.round(stamped.length / 1024) };
}

async function backfillPostcards() {
  const { data: rows, error } = await sb
    .from('uploads')
    .select('id, image_url, postcard_pending')
    .not('postcard_pending', 'is', null)
    .order('created_at', { ascending: false })
    .limit(200);
  if (error) {
    console.error('postcard query error:', error.message);
    return;
  }
  if (!rows || rows.length === 0) return;
  console.log(`Postcard backfill: ${rows.length} pending`);
  let ok = 0;
  let failed = 0;
  for (let i = 0; i < rows.length; i += 3) {
    const slice = rows.slice(i, i + 3);
    const results = await Promise.all(slice.map((r) => processPostcard(r).catch((e) => ({ skip: e.message }))));
    for (const r of results) {
      if (r.ok) ok++;
      else {
        failed++;
        if (failed <= 20) console.warn('  postcard skip:', r.skip);
      }
    }
  }
  console.log(`  postcards: ${ok} stamped, ${failed} skipped`);
}

async function main() {
  await backfillPostcards();
  console.log(`Backfill display variants${DRY_RUN ? ' (DRY RUN)' : ''} — limit=${LIMIT}`);
  let done = 0;
  let failed = 0;
  let kbTotal = 0;
  for (;;) {
    if (done >= LIMIT) break;
    // 2026-06-04: was filtered to `.png` only, but the render pipeline
    // switched to JPEG q95 originals on 2026-05-29 — that left ~11,585
    // JPEG-original uploads without a display variant. Sharp's resize+q80
    // produces a meaningfully-smaller variant regardless of source format
    // (1-2 MB JPEG → ~150 KB JPEG), so process anything missing.
    const { data: rows, error } = await sb
      .from('uploads')
      .select('id, image_url')
      .is('image_url_display', null)
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
