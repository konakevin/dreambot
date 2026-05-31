#!/usr/bin/env node
/**
 * Full face-swap viability matrix — every face-swap-eligible medium ×
 * every enabled AI model × {single, dual}. The goal: harden the paid
 * dream-creation + nightly-dream features by either confirming each
 * combination works or surfacing failures so we can fix or rule out.
 *
 * Scope: 12 mediums × 8 models × 2 modes = 192 renders.
 * Cost: ~$8 (~5¢/render avg + ~1¢ face-swap).
 * Time: ~30-45 min in waves of 8.
 *
 * All renders post to Kevin's profile as PRIVATE drafts (generate-dream
 * default) so they don't clutter the public feed — review in /(tabs)/profile
 * under "My Dreams". Each carries the model badge so failure modes are
 * easy to pin to a specific model.
 */
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const KEVIN = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';
const EMAIL = 'konakevin@gmail.com';
const SUPABASE_URL =
  process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://jimftynwrinwenonjrlj.supabase.co';
const sb = createClient(SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// All 8 enabled models from ALL_ENABLED_AI_MODELS.
const MODELS = [
  'google/gemini-2-image',
  'openai/gpt-image-2',
  'black-forest-labs/flux-dev',
  'black-forest-labs/flux-2-pro',
  'black-forest-labs/flux-1.1-pro',
  'black-forest-labs/flux-1.1-pro-ultra',
  'black-forest-labs/flux-2-flex',
  'black-forest-labs/flux-2-max',
];

// All 12 face-swap-eligible mediums (face_swaps=true + is_active=true).
const MEDIUMS = [
  // ── Has FACE_SWAP_FLUX_OVERRIDES (proven safe-ish) ──
  'fairytale',
  'storybook',
  'pencil',
  // ── No override today — high risk of "big eye" bleed-through ──
  'anime',
  'comics',
  // ── No override today — medium risk ──
  'vaporwave',
  'pop_art',
  'illustration',
  // ── No override today — low risk (already realistic-leaning) ──
  'canvas',
  'watercolor',
  'render',
  'hyperreal',
];

const VIBE = 'cinematic';
// No hint — pure test of medium + cast + vibe → Sonnet builds the scene.
// Confounding the audit with varied prompts would muddy the per-medium
// signal. Same intent as the chibibot model-test matrix earlier.

const WAVE_SIZE = 8;

async function getJwt() {
  const { data: linkData, error: e1 } = await sb.auth.admin.generateLink({
    type: 'magiclink',
    email: EMAIL,
  });
  if (e1) throw new Error('generateLink failed: ' + e1.message);
  const { data: otpData, error: e2 } = await sb.auth.verifyOtp({
    token_hash: linkData.properties.hashed_token,
    type: 'magiclink',
  });
  if (e2) throw new Error('verifyOtp failed: ' + e2.message);
  return otpData.session.access_token;
}

async function runOne(jwt, medium, model, mode, vibeProfile) {
  const label = `${medium.padEnd(13)} ${mode.padEnd(6)} ${model.split('/')[1]}`;
  const t0 = Date.now();
  const body = {
    mode: 'flux-dev', // render-pipeline mode (text-to-image)
    medium_key: medium,
    vibe_key: VIBE,
    force_model: model,
    force_cast_role: mode === 'dual' ? 'dual' : 'self',
    vibe_profile: vibeProfile,
  };
  let res, text;
  try {
    res = await fetch(`${SUPABASE_URL}/functions/v1/generate-dream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` },
      body: JSON.stringify(body),
    });
    text = await res.text();
  } catch (e) {
    const el = Math.round((Date.now() - t0) / 1000);
    return { ok: false, medium, model, mode, label, elapsed: el, error: 'net: ' + e.message };
  }
  const el = Math.round((Date.now() - t0) / 1000);
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    return {
      ok: false,
      medium,
      model,
      mode,
      label,
      elapsed: el,
      error: `non-JSON [${res.status}]: ${text.slice(0, 80)}`,
    };
  }
  if (!res.ok || data.error) {
    return {
      ok: false,
      medium,
      model,
      mode,
      label,
      elapsed: el,
      error: (data.error || text).slice(0, 200),
    };
  }
  return { ok: true, medium, model, mode, label, elapsed: el, image_url: data.image_url };
}

(async () => {
  console.log('Getting JWT for Kevin...');
  const jwt = await getJwt();
  console.log('Got JWT.');
  console.log('Loading vibe_profile (with dream_cast)...');
  const { data: recipeRow } = await sb
    .from('user_recipes')
    .select('recipe')
    .eq('user_id', KEVIN)
    .single();
  const vibeProfile = recipeRow?.recipe;
  const castCount = (vibeProfile?.dream_cast || []).length;
  console.log(`  dream_cast members: ${castCount}`);
  if (castCount < 2) {
    console.error('Need 2 cast members for the dual half of this audit. Found:', castCount);
    process.exit(1);
  }

  const combos = [];
  for (const medium of MEDIUMS) {
    for (const model of MODELS) {
      combos.push({ medium, model, mode: 'single' });
      combos.push({ medium, model, mode: 'dual' });
    }
  }
  console.log(
    `Total: ${combos.length} renders (${MEDIUMS.length} mediums × ${MODELS.length} models × 2 modes)`
  );
  console.log(`Wave size: ${WAVE_SIZE}\n`);

  const results = [];
  const start = Date.now();
  for (let i = 0; i < combos.length; i += WAVE_SIZE) {
    const wave = combos.slice(i, i + WAVE_SIZE);
    const elapsed = Math.round((Date.now() - start) / 1000);
    console.log(
      `\n=== WAVE ${Math.floor(i / WAVE_SIZE) + 1}/${Math.ceil(combos.length / WAVE_SIZE)} (${wave.length}, t=${elapsed}s) ===`
    );
    const r = await Promise.all(
      wave.map((c) => runOne(jwt, c.medium, c.model, c.mode, vibeProfile))
    );
    for (const x of r) {
      console.log(
        `  ${x.ok ? '✅' : '❌'} ${x.label}  (${x.elapsed}s)${x.error ? '  ' + x.error.slice(0, 100) : ''}`
      );
    }
    results.push(...r);
  }

  const totalSec = Math.round((Date.now() - start) / 1000);
  const ok = results.filter((r) => r.ok).length;
  console.log(`\n=== DONE — ${ok}/${results.length} succeeded in ${totalSec}s ===`);

  // Per-medium summary
  console.log('\n=== Per-medium success matrix ===');
  for (const medium of MEDIUMS) {
    const m = results.filter((r) => r.medium === medium);
    const mOk = m.filter((r) => r.ok).length;
    console.log(`  ${medium.padEnd(13)} ${mOk}/${m.length}`);
  }

  // Failure summary
  const fails = results.filter((r) => !r.ok);
  if (fails.length) {
    console.log(`\n=== Failures (${fails.length}) ===`);
    for (const f of fails) {
      console.log(`  ${f.label}  — ${(f.error || '').slice(0, 160)}`);
    }
  }
})();
