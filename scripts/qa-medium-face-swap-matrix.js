#!/usr/bin/env node
/**
 * Medium × face-swap verification matrix (2026-05-29 audit).
 *
 * For every active user-pickable medium, renders BOTH:
 *   - single-cast (force_cast_role='self')      → swaps in Kevin's self photo
 *   - dual-cast   (force_cast_role='dual')      → swaps in BOTH self + plus_one
 *
 * Two medium families to verify:
 *   • face-swap mediums (face_swaps=true)        — actual face_swap pipeline
 *   • embodied / character mediums (LEGO etc.)    — rebuild from cast.description
 *
 * Routing through the nightly-dreams Edge Function with persist:true so the
 * renders land in Kevin's PRIVATE "My Dreams" album (is_posted=false) where
 * he can swipe through them. Each upload row gets its caption rewritten to
 * `auto-qa: medium-faceswap <medium> × <cast>` so the matrix is easy to
 * grep / scroll. We also download each persisted image to /tmp/medium-audit/
 * for programmatic visual grading.
 *
 * Runs SEQUENTIALLY — Replicate and Anthropic concurrency budgets are
 * shared with prod traffic; firing 36 calls in parallel would spike error
 * rates. ~25s per render × 36 = ~15min wall clock.
 *
 *   node scripts/qa-medium-face-swap-matrix.js
 *   node scripts/qa-medium-face-swap-matrix.js --only=lego,anime  (filter)
 *   node scripts/qa-medium-face-swap-matrix.js --cast=self        (skip dual)
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const https = require('https');

const env = Object.fromEntries(
  fs
    .readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('='))
    .map((l) => {
      const i = l.indexOf('=');
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);
const sb = createClient('https://jimftynwrinwenonjrlj.supabase.co', env.SUPABASE_SERVICE_ROLE_KEY);

const KEVIN_USER_ID = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';
const NIGHTLY_URL = 'https://jimftynwrinwenonjrlj.supabase.co/functions/v1/nightly-dreams';
const WORKER_TOKEN = env.DREAM_QUEUE_WORKER_TOKEN;
if (!WORKER_TOKEN) {
  console.error('DREAM_QUEUE_WORKER_TOKEN missing from .env.local');
  process.exit(1);
}

const OUT_DIR = '/tmp/medium-audit';
fs.mkdirSync(OUT_DIR, { recursive: true });
const REPORT_PATH = path.join(OUT_DIR, '_report.json');

// CLI filters
const ARGS = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v ?? true];
  })
);
const ONLY = ARGS.only ? ARGS.only.split(',') : null;
const CAST_FILTER = ARGS.cast ? [ARGS.cast] : ['self', 'dual'];

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const out = fs.createWriteStream(dest);
    https
      .get(url, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
          return;
        }
        res.pipe(out);
        out.on('finish', () => out.close(() => resolve(dest)));
      })
      .on('error', (e) => {
        fs.unlink(dest, () => reject(e));
      });
  });
}

async function renderOne(medium, castRole) {
  const body = {
    user_id: KEVIN_USER_ID,
    // persist:true (default) — lands in Kevin's private My Dreams album
    // so he can visually review each. We rewrite the caption after the
    // upload row lands so the matrix is identifiable in-app.
    force_medium: medium.key,
    force_cast_role: castRole,
    // force_face_swap_eligible pins the medium pool when no force_medium is
    // set; redundant when we're already forcing the medium, but harmless.
    force_face_swap_eligible: true,
  };
  const start = Date.now();
  const res = await fetch(NIGHTLY_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${WORKER_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const elapsed = Math.round((Date.now() - start) / 1000);
  let payload;
  try {
    payload = await res.json();
  } catch {
    payload = { error: await res.text() };
  }
  if (!res.ok || !payload.image_url) {
    return {
      ok: false,
      elapsed_s: elapsed,
      status: res.status,
      error: payload.error ?? `no image_url (${res.status})`,
      payload,
    };
  }
  // Stamp the upload's caption with the audit tag so Kevin can identify
  // them in My Dreams. Default caption is the first 200 chars of the
  // Flux prompt — replace it with something grep-able for the matrix.
  const captionTag = `auto-qa: medium-faceswap ${medium.key} × ${castRole}`;
  if (payload.upload_id) {
    const { error: capErr } = await sb
      .from('uploads')
      .update({ caption: captionTag })
      .eq('id', payload.upload_id);
    if (capErr) console.warn(`  ! caption update failed: ${capErr.message}`);
  }
  // Download the persisted Supabase Storage URL too — outlives Replicate's
  // ~24h temp storage and gives us a stable local copy for programmatic
  // visual grading.
  const filename = `${medium.key}-${castRole}.jpg`;
  const localPath = path.join(OUT_DIR, filename);
  try {
    await downloadImage(payload.image_url, localPath);
  } catch (e) {
    return {
      ok: false,
      elapsed_s: elapsed,
      error: `download failed: ${e.message}`,
      image_url: payload.image_url,
      upload_id: payload.upload_id,
      prompt: payload.prompt_used,
    };
  }
  return {
    ok: true,
    elapsed_s: elapsed,
    image_url: payload.image_url,
    upload_id: payload.upload_id,
    local_path: localPath,
    caption: captionTag,
    prompt: payload.prompt_used,
    resolved_medium: payload.resolved_medium,
    resolved_vibe: payload.resolved_vibe,
  };
}

async function main() {
  // Pull every active user-pickable medium with face_swaps OR embodied
  // OR is_character_only (the universe of mediums that integrate cast).
  // Skip plain `photography` — face_swaps=false AND natural mode AND
  // explicitly banned from nightly per NIGHTLY_BANNED_MEDIUMS.
  const { data: mediums } = await sb
    .from('dream_mediums')
    .select('key,label,face_swaps,is_character_only,character_render_mode')
    .eq('is_active', true)
    .eq('is_bot_only', false)
    .neq('key', 'photography')
    .order('sort_order');

  const filtered = ONLY ? mediums.filter((m) => ONLY.includes(m.key)) : mediums;

  console.log(`\n=== Medium × face-swap matrix ===`);
  console.log(`Mediums: ${filtered.map((m) => m.key).join(', ')}`);
  console.log(`Cast configs: ${CAST_FILTER.join(', ')}`);
  console.log(`Output: ${OUT_DIR}\n`);

  const results = [];
  let i = 0;
  const total = filtered.length * CAST_FILTER.length;

  for (const medium of filtered) {
    for (const castRole of CAST_FILTER) {
      i++;
      const family = medium.face_swaps
        ? 'face-swap'
        : medium.is_character_only || medium.character_render_mode === 'embodied'
          ? 'embodied'
          : 'natural';
      process.stdout.write(`[${i}/${total}] ${medium.key.padEnd(13)} × ${castRole.padEnd(4)} (${family})… `);
      const out = await renderOne(medium, castRole);
      results.push({ medium: medium.key, label: medium.label, family, cast_role: castRole, ...out });
      if (out.ok) {
        console.log(`✓ ${out.elapsed_s}s → ${path.basename(out.local_path)}`);
      } else {
        console.log(`✗ ${out.elapsed_s}s ${out.error}`);
      }
      // Best-effort jitter between calls to keep upstream concurrency calm.
      await new Promise((r) => setTimeout(r, 1500));
    }
  }

  fs.writeFileSync(REPORT_PATH, JSON.stringify(results, null, 2));
  console.log(`\nReport: ${REPORT_PATH}`);
  const ok = results.filter((r) => r.ok).length;
  console.log(`\nDone: ${ok}/${results.length} succeeded.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
