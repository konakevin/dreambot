#!/usr/bin/env node
'use strict';

/**
 * medium-batch.js — One dream per active medium, posted to Kevin's feed.
 *
 * Usage:
 *   node scripts/medium-batch.js
 *   node scripts/medium-batch.js --prompt "a castle on a hill at sunset"
 *   node scripts/medium-batch.js --vibe epic
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envFile = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    if (!process.env[trimmed.slice(0, eq).trim()])
      process.env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
}

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const KEVIN_ID = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';
const KEVIN_EMAIL = 'konakevin@gmail.com';

const args = process.argv.slice(2);
const getArg = (name, fallback) => {
  const i = args.indexOf('--' + name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const TEST_PROMPT = getArg('prompt', 'a castle on a hill at sunset');
const TEST_VIBE = getArg('vibe', 'cinematic');
const RENDER_MODE_FILTER = args.includes('--embodied')
  ? 'embodied'
  : args.includes('--natural')
    ? 'natural'
    : null;

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
const userClient = createClient(SUPABASE_URL, ANON_KEY);

async function main() {
  const { data: linkData, error: linkErr } = await supabase.auth.admin.generateLink({
    type: 'magiclink',
    email: KEVIN_EMAIL,
  });
  if (linkErr) {
    console.error('Magic link failed:', linkErr.message);
    process.exit(1);
  }
  const { data: auth, error: authErr } = await userClient.auth.verifyOtp({
    token_hash: linkData.properties.hashed_token,
    type: 'magiclink',
  });
  if (authErr) {
    console.error('OTP exchange failed:', authErr.message);
    process.exit(1);
  }

  let mediumsQuery = supabase
    .from('dream_mediums')
    .select('key,label,character_render_mode,face_swaps')
    .eq('is_active', true)
    .eq('is_public', true)
    .order('sort_order');
  if (RENDER_MODE_FILTER) {
    mediumsQuery = mediumsQuery.eq('character_render_mode', RENDER_MODE_FILTER);
  }
  const { data: mediums, error: mErr } = await mediumsQuery;
  if (mErr) {
    console.error('Mediums fetch failed:', mErr.message);
    process.exit(1);
  }

  // Fetch Kevin's vibe profile — self-insert reads dream_cast from this.
  // Without vibe_profile in the request body, the self-insert path silently
  // falls through because vibeProfile?.dream_cast?.find(...) returns undefined.
  const { data: recipeRow, error: recipeErr } = await supabase
    .from('user_recipes')
    .select('recipe')
    .eq('user_id', KEVIN_ID)
    .single();
  if (recipeErr) {
    console.error('Profile fetch failed:', recipeErr.message);
    process.exit(1);
  }
  const vibeProfile = recipeRow?.recipe;
  const castSize = vibeProfile?.dream_cast?.length ?? 0;

  console.log(`\nBatch render`);
  console.log(`  prompt:  "${TEST_PROMPT}"`);
  console.log(`  vibe:    ${TEST_VIBE}`);
  console.log(`  mediums: ${mediums.length}`);
  console.log(`  cast:    ${castSize} member(s)\n`);

  for (let i = 0; i < mediums.length; i++) {
    const m = mediums[i];
    const t0 = Date.now();
    process.stdout.write(`  [${String(i + 1).padStart(2)}/${mediums.length}] ${m.label.padEnd(14)} `);

    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/generate-dream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.session.access_token}`,
          apikey: ANON_KEY,
        },
        body: JSON.stringify({
          mode: 'flux-dev',
          medium_key: m.key,
          vibe_key: TEST_VIBE,
          hint: TEST_PROMPT,
          vibe_profile: vibeProfile,
          persist: true,
        }),
      });
      const data = await res.json();
      const elapsed = Date.now() - t0;

      if (!data.image_url) {
        console.log(`FAIL ${data.error || 'no image'} (${elapsed}ms)`);
        continue;
      }

      // The Edge Function already creates the upload row (as a draft with
      // is_public: false). Flip it public and rewrite the caption for testing.
      if (data.upload_id) {
        await supabase
          .from('uploads')
          .update({
            caption: `batch: ${m.label}`,
            is_public: true,
          })
          .eq('id', data.upload_id);
      }

      console.log(`OK ${elapsed}ms`);
    } catch (e) {
      console.log(`FAIL ${e.message}`);
    }

    if (i < mediums.length - 1) await new Promise((r) => setTimeout(r, 500));
  }
  console.log('');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
