#!/usr/bin/env node
'use strict';

/**
 * test-dual-faceswap-v4.js — Test 5 V4 dual face swap prompts + 5 nightly
 * dual face swap dreams, posted sequentially to Kevin's feed.
 *
 * Usage:
 *   node scripts/test-dual-faceswap-v4.js
 *   node scripts/test-dual-faceswap-v4.js --v4-only
 *   node scripts/test-dual-faceswap-v4.js --nightly-only
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
const V4_ONLY = args.includes('--v4-only');
const NIGHTLY_ONLY = args.includes('--nightly-only');

const V4_PROMPTS = [
  { medium: 'photography', vibe: 'dreamy', hint: 'me and my wife at a tropical beach at sunset' },
  { medium: 'watercolor', vibe: 'epic', hint: 'me and my partner exploring ancient ruins in the jungle' },
  { medium: 'canvas', vibe: 'cinematic', hint: 'me and my wife dancing under the stars' },
  { medium: 'comics', vibe: 'playful', hint: 'me and my partner as superheroes saving the city' },
  { medium: 'fairytale', vibe: 'whimsical', hint: 'me and my wife in an enchanted forest' },
];

const NIGHTLY_MEDIUMS = ['photography', 'watercolor', 'render', 'canvas', 'comics'];
const NIGHTLY_VIBES = ['cinematic', 'dreamy', 'epic', 'dramatic', 'whimsical'];

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
const userClient = createClient(SUPABASE_URL, ANON_KEY);

async function main() {
  const { data: linkData, error: linkErr } = await supabase.auth.admin.generateLink({
    type: 'magiclink',
    email: KEVIN_EMAIL,
  });
  if (linkErr) { console.error('Magic link failed:', linkErr.message); process.exit(1); }

  const { data: auth, error: authErr } = await userClient.auth.verifyOtp({
    token_hash: linkData.properties.hashed_token,
    type: 'magiclink',
  });
  if (authErr) { console.error('OTP exchange failed:', authErr.message); process.exit(1); }

  const { data: recipeRow, error: recipeErr } = await supabase
    .from('user_recipes')
    .select('recipe')
    .eq('user_id', KEVIN_ID)
    .single();
  if (recipeErr) { console.error('Profile fetch failed:', recipeErr.message); process.exit(1); }
  const vibeProfile = recipeRow?.recipe;

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${auth.session.access_token}`,
    apikey: ANON_KEY,
  };

  console.log('\n=== DUAL FACE SWAP TEST ===\n');

  // ── V4 prompts (generate-dream) ──
  if (!NIGHTLY_ONLY) {
    console.log('── V4 PATH (generate-dream) ──');
    console.log('These use selfInsertDetector to detect "me and my wife/partner"\n');
    for (let i = 0; i < V4_PROMPTS.length; i++) {
      const p = V4_PROMPTS[i];
      const num = i + 1;
      const t0 = Date.now();
      process.stdout.write(`  [${num}/5] ${p.medium.padEnd(14)} ${p.vibe.padEnd(12)} "${p.hint}" ... `);

      try {
        const res = await fetch(`${SUPABASE_URL}/functions/v1/generate-dream`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            mode: 'flux-dev',
            medium_key: p.medium,
            vibe_key: p.vibe,
            hint: p.hint,
            vibe_profile: vibeProfile,
            persist: true,
          }),
        });
        const txt = await res.text();
        let data;
        try { data = JSON.parse(txt); } catch {
          console.log(`FAIL non-JSON ${res.status} (${Date.now() - t0}ms)`);
          continue;
        }

        if (!data.image_url) {
          console.log(`FAIL ${data.error || 'no image'} (${Date.now() - t0}ms)`);
          if (data.error) console.log(`       error: ${data.error}`);
          continue;
        }

        if (data.upload_id) {
          await supabase.from('uploads').update({
            caption: `dual-v4 #${num}: ${p.medium} + ${p.vibe}`,
            is_public: true,
          }).eq('id', data.upload_id);
        }

        const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
        const hasDual = data.axes?.dualFaceSwap ? 'DUAL' : 'SINGLE';
        const swapResult = data.axes?.faceSwapResult || 'none';
        console.log(`OK ${elapsed}s [${hasDual}] swap=${swapResult}`);
      } catch (e) {
        console.log(`FAIL ${e.message}`);
      }
    }
    console.log('');
  }

  // ── Nightly path (nightly-dreams) ──
  if (!V4_ONLY) {
    console.log('── NIGHTLY PATH (nightly-dreams, force_cast_role=dual) ──');
    console.log('These force both self + plus_one through the nightly pipeline\n');
    for (let i = 0; i < NIGHTLY_MEDIUMS.length; i++) {
      const medium = NIGHTLY_MEDIUMS[i];
      const vibe = NIGHTLY_VIBES[i];
      const num = i + 1;
      const t0 = Date.now();
      process.stdout.write(`  [${num}/5] ${medium.padEnd(14)} ${vibe.padEnd(12)} (nightly dual) ... `);

      try {
        const res = await fetch(`${SUPABASE_URL}/functions/v1/nightly-dreams`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            vibe_profile: vibeProfile,
            force_cast_role: 'dual',
            force_medium: medium,
            force_vibe: vibe,
          }),
        });
        const txt = await res.text();
        let data;
        try { data = JSON.parse(txt); } catch {
          console.log(`FAIL non-JSON ${res.status} (${Date.now() - t0}ms)`);
          console.log(`       response: ${txt.slice(0, 200)}`);
          continue;
        }

        if (data.error) {
          console.log(`FAIL ${data.error} (${Date.now() - t0}ms)`);
          continue;
        }

        if (!data.image_url && !data.upload_id) {
          console.log(`FAIL no image (${Date.now() - t0}ms)`);
          console.log(`       data: ${JSON.stringify(data).slice(0, 200)}`);
          continue;
        }

        const uploadId = data.upload_id;
        if (uploadId) {
          await supabase.from('uploads').update({
            caption: `dual-nightly #${num}: ${medium} + ${vibe}`,
            is_public: true,
          }).eq('id', uploadId);
        }

        const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
        console.log(`OK ${elapsed}s`);
      } catch (e) {
        console.log(`FAIL ${e.message}`);
      }
    }
    console.log('');
  }

  console.log('=== DONE ===\n');
}

main().catch((e) => { console.error(e); process.exit(1); });
