#!/usr/bin/env node
/**
 * Final organized face-swap experiment — one model at a time so each
 * model's 6 renders (3 single + 3 dual) land back-to-back in Kevin's
 * profile timeline. 48 renders total. ~6-8 min wall time.
 *
 * Per-model wave: 6 renders fired in parallel. Wait for them to finish.
 * Move to next model. This guarantees per-model clustering by timestamp
 * in the album view without dragging total wall time to 24 min serial.
 *
 * Stack of fixes applied since the last run that informs THIS test:
 *  - cdingram-primary (commit f5a91a49 / 469c0fee): canned-output bug
 *    fixed; previous yan-ops-primary returned the same hardcoded scene
 *    8x in a row.
 *  - face_swap_* override now plumbed through CompilerInput
 *    (commit d2ef037b): fairytale renders use the watercolor-ink
 *    swap-friendly override, not the standard Disney/cel big-eye version.
 *  - force_cast_role='dual' now resolves BOTH cast members
 *    (commit d0cb1c7c): dual face swap actually swaps both faces.
 *  - singleBriefBuilder (commit 469c0fee): medium-shot waist-up framing
 *    on single face-swap (no more "no face found").
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

const MEDIUM = 'fairytale';
const VIBE = 'cinematic';
const REPS_PER_MODE = 3;

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

async function runOne(jwt, model, mode, vibeProfile, rep) {
  const label = `${mode}/${model.split('/')[1]} #${rep}`;
  const t0 = Date.now();
  let res, text;
  try {
    res = await fetch(`${SUPABASE_URL}/functions/v1/generate-dream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` },
      body: JSON.stringify({
        mode: 'flux-dev',
        medium_key: MEDIUM,
        vibe_key: VIBE,
        force_model: model,
        force_cast_role: mode === 'dual' ? 'dual' : 'self',
        vibe_profile: vibeProfile,
      }),
    });
    text = await res.text();
  } catch (e) {
    const el = Math.round((Date.now() - t0) / 1000);
    return { ok: false, model, mode, rep, label, elapsed: el, error: 'net: ' + e.message };
  }
  const el = Math.round((Date.now() - t0) / 1000);
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    return {
      ok: false,
      model,
      mode,
      rep,
      label,
      elapsed: el,
      error: `non-JSON [${res.status}]: ${text.slice(0, 80)}`,
    };
  }
  if (!res.ok || data.error) {
    return {
      ok: false,
      model,
      mode,
      rep,
      label,
      elapsed: el,
      error: (data.error || text).slice(0, 200),
    };
  }
  return { ok: true, model, mode, rep, label, elapsed: el, image_url: data.image_url };
}

(async () => {
  console.log('Getting JWT for Kevin...');
  const jwt = await getJwt();
  const { data: recipeRow } = await sb
    .from('user_recipes')
    .select('recipe')
    .eq('user_id', KEVIN)
    .single();
  const vibeProfile = recipeRow?.recipe;
  const castCount = (vibeProfile?.dream_cast || []).length;
  console.log(`Cast members: ${castCount}`);
  if (castCount < 2) {
    console.error('Need 2 cast members for dual half. Found:', castCount);
    process.exit(1);
  }
  console.log(
    `Plan: ${MODELS.length} models × (${REPS_PER_MODE} single + ${REPS_PER_MODE} dual) = ${MODELS.length * REPS_PER_MODE * 2} renders`
  );
  console.log(`Medium: ${MEDIUM}  Vibe: ${VIBE}\n`);

  const all = [];
  const start = Date.now();
  for (let mi = 0; mi < MODELS.length; mi++) {
    const model = MODELS[mi];
    const elapsed = Math.round((Date.now() - start) / 1000);
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`MODEL ${mi + 1}/${MODELS.length}: ${model}  (workflow t=${elapsed}s)`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    // Fire all 6 renders for this model in parallel — same model so
    // they cluster by timestamp in Kevin's profile timeline.
    const promises = [];
    for (let r = 1; r <= REPS_PER_MODE; r++) {
      promises.push(runOne(jwt, model, 'single', vibeProfile, r));
      promises.push(runOne(jwt, model, 'dual', vibeProfile, r));
    }
    const results = await Promise.all(promises);
    for (const x of results) {
      console.log(
        `  ${x.ok ? '✅' : '❌'} ${x.label.padEnd(36)}  (${String(x.elapsed).padStart(3)}s)${x.error ? '  ' + x.error.slice(0, 100) : ''}`
      );
    }
    const ok = results.filter((r) => r.ok).length;
    console.log(`  → ${ok}/${results.length} succeeded for this model`);
    all.push(...results);
  }

  const totalSec = Math.round((Date.now() - start) / 1000);
  const ok = all.filter((r) => r.ok).length;
  console.log(`\n\n=== DONE — ${ok}/${all.length} succeeded in ${totalSec}s ===\n`);

  // Per-model summary
  console.log('Per-model success matrix (S=single ok/3, D=dual ok/3):');
  for (const model of MODELS) {
    const m = all.filter((r) => r.model === model);
    const sok = m.filter((r) => r.ok && r.mode === 'single').length;
    const dok = m.filter((r) => r.ok && r.mode === 'dual').length;
    const tag = sok === REPS_PER_MODE && dok === REPS_PER_MODE ? '✅' : '⚠';
    console.log(
      `  ${tag}  ${model.padEnd(40)}  S=${sok}/${REPS_PER_MODE}  D=${dok}/${REPS_PER_MODE}`
    );
  }

  // Failure detail
  const fails = all.filter((r) => !r.ok);
  if (fails.length) {
    console.log(`\nFailures (${fails.length}):`);
    for (const f of fails) console.log(`  ${f.label}  — ${(f.error || '').slice(0, 160)}`);
  }
})();
