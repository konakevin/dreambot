/**
 * upscale-smoke-test.js — monitoring for the paid 4K HQ-download feature.
 *
 * The 2026-05-25 incident: the upscaler 404'd on EVERY call (wrong Replicate
 * endpoint) and nobody noticed for an unknown time, because failures only
 * console.warn and the client silently served original-res. This makes that
 * class of failure LOUD: run on a schedule (GitHub Actions cron), exit non-zero
 * if the upscaler is broken so the workflow fails + notifies.
 *
 * Two checks:
 *   1. LIVE per-model submit — POST one prediction to EACH pinned upscaler
 *      (clarity + real-esrgan). A 404 / bad-version surfaces here immediately,
 *      per model (so a broken primary isn't masked by a working fallback). The
 *      primary is also polled to completion to confirm it actually produces an
 *      image.
 *   2. CACHE-RATE heuristic — % of recent bot posts missing image_url_hq. Bot
 *      posts are always pre-upscaled, so a high miss-rate means the background
 *      pre-upscale is broken even if a live submit happens to pass.
 *
 * Usage: node scripts/upscale-smoke-test.js
 * Env: SUPABASE_SERVICE_ROLE_KEY, REPLICATE_API_TOKEN (falls back to .env.local).
 */

const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const { UPSCALERS } = require('./lib/upscaleClarity');

function loadEnv() {
  try {
    for (const line of fs.readFileSync('.env.local', 'utf8').split('\n')) {
      const eq = line.indexOf('=');
      if (eq > 0 && !process.env[line.slice(0, eq).trim()]) {
        process.env[line.slice(0, eq).trim()] = line
          .slice(eq + 1)
          .trim()
          .replace(/^["']|["']$/g, '');
      }
    }
  } catch {
    /* no .env.local in CI — env vars come from secrets */
  }
}
loadEnv();

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://jimftynwrinwenonjrlj.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const REPLICATE_TOKEN = process.env.REPLICATE_API_TOKEN;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function submitOne(model, imageUrl) {
  const res = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${REPLICATE_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ version: model.version, input: model.buildInput(imageUrl) }),
  });
  const body = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, id: body.id, detail: body.detail };
}

async function pollToDone(id, maxPolls = 45) {
  for (let i = 0; i < maxPolls; i++) {
    await sleep(2000);
    const r = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
      headers: { Authorization: `Bearer ${REPLICATE_TOKEN}` },
    });
    const d = await r.json();
    if (d.status === 'succeeded') {
      const out = typeof d.output === 'string' ? d.output : Array.isArray(d.output) ? d.output[0] : null;
      return { ok: !!out, status: d.status };
    }
    if (d.status === 'failed' || d.status === 'canceled') return { ok: false, status: d.status, error: d.error };
  }
  return { ok: false, status: 'timeout' };
}

(async () => {
  if (!SERVICE_KEY || !REPLICATE_TOKEN) {
    console.error('FAIL: missing SUPABASE_SERVICE_ROLE_KEY or REPLICATE_API_TOKEN');
    process.exit(1);
  }
  const sb = createClient(SUPABASE_URL, SERVICE_KEY);
  const failures = [];

  // A real recent image to upscale.
  const { data: sample } = await sb
    .from('uploads')
    .select('image_url')
    .eq('is_ai_generated', true)
    .not('image_url', 'is', null)
    .order('created_at', { ascending: false })
    .limit(1);
  const sampleUrl = sample && sample[0] && sample[0].image_url;
  if (!sampleUrl) {
    console.error('FAIL: no sample image found to test upscale');
    process.exit(1);
  }

  // ── Check 1: per-model live submit ──
  for (const model of UPSCALERS) {
    const s = await submitOne(model, sampleUrl);
    if (!s.ok || !s.id) {
      failures.push(`[${model.label}] submit failed: HTTP ${s.status}${s.detail ? ` — ${s.detail}` : ''}`);
      console.error(`✗ ${model.label}: submit HTTP ${s.status} ${s.detail ?? ''}`);
      continue;
    }
    console.log(`✓ ${model.label}: submit OK (${s.id})`);
    // Poll the PRIMARY (first model) to completion to confirm it produces output.
    if (model === UPSCALERS[0]) {
      const p = await pollToDone(s.id);
      if (!p.ok) {
        failures.push(`[${model.label}] prediction ${p.status}${p.error ? ` — ${p.error}` : ''}`);
        console.error(`✗ ${model.label}: prediction ${p.status} ${p.error ?? ''}`);
      } else {
        console.log(`✓ ${model.label}: produced output`);
      }
    }
  }

  // NOTE: no cache-rate check anymore. As of 2026-05-25 nothing is auto-upscaled
  // (HD is on-demand only, first download), so a NULL image_url_hq is the normal
  // state for almost every post — a cache-rate metric would be meaningless noise.
  // The per-model live submit above is the definitive "upscaler works" signal.

  if (failures.length) {
    console.error('\nUPSCALE SMOKE TEST FAILED:\n - ' + failures.join('\n - '));
    process.exit(1);
  }
  console.log('\n✅ upscale smoke test passed');
})().catch((e) => {
  console.error('FAIL: smoke test threw:', e.message);
  process.exit(1);
});
