#!/usr/bin/env node
/**
 * 8 models × {single, dual} face-swap experiment for Kevin's profile.
 *
 * Holds medium + vibe + prompt constant; varies ONLY the model + cast_role.
 * Each render goes through generate-dream (the standard user-dream path),
 * lands on Kevin's profile as a normal post, gets the model badge from
 * the migration-211 chain.
 *
 * Tests:
 *   - Native OpenAI (gpt-image-2) face swap end-to-end (uses the new
 *     ensureHttpsImageUrl data-URL → temp-HTTPS conversion shipped 2026-05-30)
 *   - Native Gemini (nano-banana) same
 *   - All 6 Flux variants in the picker lineup (baseline)
 *
 * Cost: ~$1.20-$1.50. Time: ~3-6 min at 4-wide parallel.
 */
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const KEVIN = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';
const EMAIL = 'konakevin@gmail.com';
const SUPABASE_URL =
  process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://jimftynwrinwenonjrlj.supabase.co';
const sb = createClient(SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

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

const MEDIUM = 'fairytale'; // heavy face-swap pedigree + FACE_SWAP_FLUX_OVERRIDES
const VIBE = 'cinematic';
const SINGLE_PROMPT = 'wandering through an enchanted twilight forest';
const DUAL_PROMPT = 'with my partner exploring an enchanted twilight forest';

const WAVE_SIZE = 4;

async function getJwt() {
  // Same admin-magic-link pattern other test scripts use to obtain a real
  // user JWT (generate-dream reads userId from the bearer JWT).
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

async function runOne(jwt, model, mode, vibeProfile) {
  const label = `${mode}/${model.split('/')[1]}`;
  const t0 = Date.now();
  const body = {
    // RENDER pipeline mode (text-to-image vs Kontext photo edit) — NOT a
    // UX mode. force_model + force_cast_role are what actually steer this
    // experiment.
    mode: 'flux-dev',
    medium_key: MEDIUM,
    vibe_key: VIBE,
    force_model: model,
    force_cast_role: mode === 'dual' ? 'dual' : 'self',
    // Engine field is `hint`, not `user_prompt`. `hint` flows into the
    // Sonnet brief as the user's scene direction (per the body schema in
    // generate-dream/index.ts).
    hint: mode === 'dual' ? DUAL_PROMPT : SINGLE_PROMPT,
    // CRITICAL: cast is loaded from vibe_profile.dream_cast (generate-dream
    // line 770). Without this, the engine has no cast members → no face
    // swap fires → Sonnet writes a generic scene with a small figure.
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
    const elapsed = Math.round((Date.now() - t0) / 1000);
    console.log(`  ❌ ${label.padEnd(28)} (${elapsed}s) network error: ${e.message}`);
    return { ok: false, label, error: e.message };
  }
  const elapsed = Math.round((Date.now() - t0) / 1000);
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    console.log(
      `  ❌ ${label.padEnd(28)} (${elapsed}s) non-JSON [${res.status}]: ${text.slice(0, 100)}`
    );
    return { ok: false, label, status: res.status };
  }
  if (!res.ok || data.error) {
    console.log(
      `  ❌ ${label.padEnd(28)} (${elapsed}s) [${res.status}]: ${(data.error || text).slice(0, 150)}`
    );
    return { ok: false, label, error: data.error || text.slice(0, 200) };
  }
  console.log(`  ✅ ${label.padEnd(28)} (${elapsed}s) upload=${(data.image_url || '').slice(-30)}`);
  return { ok: true, label, elapsed, image_url: data.image_url };
}

(async () => {
  console.log('Getting JWT for Kevin...');
  const jwt = await getJwt();
  console.log('Got JWT.');
  console.log('Loading vibe_profile (includes dream_cast)...');
  const { data: recipeRow } = await sb
    .from('user_recipes')
    .select('recipe')
    .eq('user_id', KEVIN)
    .single();
  const vibeProfile = recipeRow?.recipe;
  const castCount = (vibeProfile?.dream_cast || []).length;
  console.log(`  vibe_profile loaded — dream_cast members: ${castCount}`);
  if (!castCount) {
    console.error('No cast members in user_recipes.recipe.dream_cast — face swap will not fire.');
    process.exit(1);
  }

  const combos = [];
  for (const model of MODELS) {
    combos.push({ model, mode: 'single' });
    combos.push({ model, mode: 'dual' });
  }
  console.log(`Total combinations: ${combos.length}`);
  console.log(`Wave size: ${WAVE_SIZE}`);
  console.log(`Medium: ${MEDIUM}  Vibe: ${VIBE}\n`);

  const results = [];
  const start = Date.now();
  for (let i = 0; i < combos.length; i += WAVE_SIZE) {
    const wave = combos.slice(i, i + WAVE_SIZE);
    console.log(`\n=== WAVE ${Math.floor(i / WAVE_SIZE) + 1} (${wave.length} renders) ===`);
    const r = await Promise.all(wave.map((c) => runOne(jwt, c.model, c.mode, vibeProfile)));
    results.push(...r);
  }
  const totalSec = Math.round((Date.now() - start) / 1000);
  const ok = results.filter((r) => r.ok).length;
  console.log(`\n=== DONE — ${ok}/${results.length} succeeded in ${totalSec}s ===`);
  for (const r of results) {
    console.log(
      `  ${r.ok ? '✅' : '❌'} ${r.label}${r.error ? ' — ' + r.error.slice(0, 120) : ''}`
    );
  }
})();
