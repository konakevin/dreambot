#!/usr/bin/env node
/**
 * QA loop runner — nightly scene-only path.
 *
 * Fires N nightly-dreams renders for Kevin's profile forced to scene-only
 * (force_cast_role: null). Tags each upload with caption "auto-qa: nightly-scene R<round>"
 * for easy retrieval later. Posts to feed.
 *
 * Usage:
 *   node scripts/qa-nightly-scene.js --round 1 --count 5
 *   node scripts/qa-nightly-scene.js --round 2 --count 5
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

function readEnvFile() {
  try {
    const lines = fs.readFileSync('.env.local', 'utf8').split('\n');
    const env = {};
    for (const line of lines) {
      const eq = line.indexOf('=');
      if (eq > 0) env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
    }
    return env;
  } catch {
    return {};
  }
}
const envFile = readEnvFile();
const getKey = (n) => process.env[n] || envFile[n];
const SB_URL = 'https://jimftynwrinwenonjrlj.supabase.co';
const KEY = getKey('SUPABASE_SERVICE_ROLE_KEY');
const ANON = getKey('EXPO_PUBLIC_SUPABASE_ANON_KEY') || KEY;
if (!KEY) {
  console.error('SUPABASE_SERVICE_ROLE_KEY missing');
  process.exit(1);
}

const args = process.argv.slice(2);
const flag = (n, fb) => {
  const i = args.indexOf('--' + n);
  return i >= 0 ? args[i + 1] : fb;
};
const ROUND = parseInt(flag('round', '1'), 10);
const COUNT = parseInt(flag('count', '5'), 10);
const FORCE_MEDIUM = flag('medium', null);
const FORCE_VIBE = flag('vibe', null);
const FORCE_MODEL = flag('model', null); // e.g. 'black-forest-labs/flux-1.1-pro'
const FORCE_LOCATION = flag('location', null); // override profile.dream_seeds.places[0]
const CAST_MODE = flag('cast', 'none'); // 'none' | 'single' | 'dual' | 'self' | 'plus_one' | 'pet'
const USER_ID = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';

(async () => {
  const sb = createClient(SB_URL, KEY);

  // Mint user JWT
  const { data: u } = await sb.from('users').select('email').eq('id', USER_ID).single();
  const { data: linkData } = await sb.auth.admin.generateLink({
    type: 'magiclink',
    email: u.email,
  });
  const userClient = createClient(SB_URL, ANON);
  const { data: sess } = await userClient.auth.verifyOtp({
    email: u.email,
    token: linkData.properties.email_otp,
    type: 'email',
  });
  const jwt = sess.session.access_token;
  console.log('JWT minted ✓');

  // Load profile
  const { data: r } = await sb.from('user_recipes').select('recipe').eq('user_id', USER_ID).single();
  const profile = r.recipe;
  if (FORCE_LOCATION) {
    profile.dream_seeds = profile.dream_seeds || {};
    profile.dream_seeds.places = [FORCE_LOCATION];
    console.log(`[override] location forced to "${FORCE_LOCATION}"`);
  }

  // Output dir
  const outDir = `/tmp/qa-nightly-scene-R${ROUND}`;
  fs.mkdirSync(outDir, { recursive: true });

  console.log(`\n━━━ Round ${ROUND} — ${COUNT}× nightly scene-only ━━━`);
  const results = [];

  for (let i = 0; i < COUNT; i++) {
    // Clear AI budget so render isn't gated
    const today = new Date().toISOString().slice(0, 10);
    await sb.from('ai_generation_budget').delete().eq('user_id', USER_ID).eq('date', today);

    const t0 = Date.now();
    // CAST_MODE behavior:
    //   'natural' | 'random' / 'auto' / unset → omit force_cast_role entirely
    //                                            → rollDream picks naturally
    //   'none'   → force_cast_role: null       → scene-only (no character)
    //   'single' → force_cast_role: 'self'     → single self
    //   'dual'   → force_cast_role: 'dual'     → both self + plus_one
    //   '<role>' → force_cast_role: '<role>'   → specific role (self/plus_one/pet)
    const naturalCastMode = !CAST_MODE || CAST_MODE === 'natural' || CAST_MODE === 'random' || CAST_MODE === 'auto';
    const forceCastBody = naturalCastMode
      ? {} // omit force_cast_role → algorithm rolls naturally
      : {
          force_cast_role:
            CAST_MODE === 'none'
              ? null
              : CAST_MODE === 'single'
                ? 'self'
                : CAST_MODE === 'dual'
                  ? 'dual'
                  : CAST_MODE,
        };
    const res = await fetch(`${SB_URL}/functions/v1/nightly-dreams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` },
      body: JSON.stringify({
        vibe_profile: profile,
        ...forceCastBody,
        ...(FORCE_MEDIUM ? { force_medium: FORCE_MEDIUM } : {}),
        ...(FORCE_VIBE ? { force_vibe: FORCE_VIBE } : {}),
        ...(FORCE_MODEL ? { force_model: FORCE_MODEL } : {}),
      }),
    });
    const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.log(`  [${i + 1}/${COUNT}] ${elapsed}s | non-JSON ${res.status}: ${text.slice(0, 100)}`);
      continue;
    }
    if (!res.ok) {
      console.log(`  [${i + 1}/${COUNT}] ${elapsed}s | ✗ ${data.error || res.status}`);
      continue;
    }

    // Tag the upload row with caption for QA trail
    if (data.upload_id) {
      await sb
        .from('uploads')
        .update({ caption: `auto-qa: nightly-scene R${ROUND}` })
        .eq('id', data.upload_id);
    }

    results.push({
      n: i + 1,
      upload_id: data.upload_id,
      url: data.image_url,
      medium: data.resolved_medium,
      vibe: data.resolved_vibe,
      path: data.nightly_path,
      composition: data.composition,
      composition_mode: data.composition_mode,
      prompt: data.ai_prompt,
    });
    console.log(
      `  [${i + 1}/${COUNT}] ${elapsed}s | ${data.resolved_medium}/${data.resolved_vibe} | ${data.composition || data.composition_mode || ''}`
    );
    console.log(`         ${data.image_url}`);

    // Save image locally
    if (data.image_url) {
      try {
        const buf = await fetch(data.image_url).then((rr) => rr.arrayBuffer());
        const fname = `${String(i + 1).padStart(2, '0')}.jpg`;
        fs.writeFileSync(path.join(outDir, fname), Buffer.from(buf));
      } catch (err) {
        console.log(`         (save failed: ${err.message})`);
      }
    }
  }

  // Save metadata
  fs.writeFileSync(
    path.join(outDir, 'meta.json'),
    JSON.stringify({ round: ROUND, count: COUNT, results }, null, 2)
  );
  console.log(`\nSaved ${results.length}/${COUNT} to ${outDir}/`);
  console.log(`Caption tag: "auto-qa: nightly-scene R${ROUND}"`);
})();
