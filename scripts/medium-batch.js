#!/usr/bin/env node
'use strict';

/**
 * medium-batch.js — Test renders across mediums, optionally across multiple
 * Flux models, interleaved so the feed scrolls A/B-comparable output.
 *
 * Usage:
 *   node scripts/medium-batch.js
 *   node scripts/medium-batch.js --prompt "a castle on a hill at sunset"
 *   node scripts/medium-batch.js --vibe epic
 *   node scripts/medium-batch.js --embodied            # only embodied mediums
 *   node scripts/medium-batch.js --natural             # only face-swap natural mediums
 *   node scripts/medium-batch.js --medium-key photography   # single medium
 *   node scripts/medium-batch.js --models flux1-dev,flux1-pro,flux2-dev,flux2-pro
 *
 * When --models is set, the script iterates per medium × per model, producing
 * the 4 variants of each medium consecutively in your feed for easy comparison.
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

// Known tag → Replicate slug map. Keep in sync with pickModel()'s default case.
const MODEL_REGISTRY = {
  'flux1-dev': 'black-forest-labs/flux-dev',
  'flux1-pro': 'black-forest-labs/flux-1.1-pro',
  'flux2-dev': 'black-forest-labs/flux-2-dev',
  'flux2-pro': 'black-forest-labs/flux-2-pro',
  'flux2-max': 'black-forest-labs/flux-2-max',
};

const args = process.argv.slice(2);
const getArg = (name, fallback) => {
  const i = args.indexOf('--' + name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const TEST_PROMPT = getArg('prompt', 'a castle on a hill at sunset');
const TEST_VIBE = getArg('vibe', 'cinematic');
const SINGLE_TAG = getArg('tag', null); // legacy single-model tag mode
const MODELS_FLAG = getArg('models', null); // e.g. "flux1-dev,flux1-pro,flux2-dev,flux2-pro"
const MEDIUM_KEY_FILTER = getArg('medium-key', null); // single medium for debugging
const RENDER_MODE_FILTER = args.includes('--embodied')
  ? 'embodied'
  : args.includes('--natural')
    ? 'natural'
    : null;

const MODELS = MODELS_FLAG
  ? MODELS_FLAG.split(',').map((tag) => {
      const slug = MODEL_REGISTRY[tag.trim()];
      if (!slug) {
        console.error(`Unknown model tag: ${tag}. Known: ${Object.keys(MODEL_REGISTRY).join(', ')}`);
        process.exit(1);
      }
      return { tag: tag.trim(), slug };
    })
  : [{ tag: SINGLE_TAG, slug: null }]; // single pass, deployed default model

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
  if (RENDER_MODE_FILTER) mediumsQuery = mediumsQuery.eq('character_render_mode', RENDER_MODE_FILTER);
  if (MEDIUM_KEY_FILTER) mediumsQuery = mediumsQuery.eq('key', MEDIUM_KEY_FILTER);
  const { data: mediums, error: mErr } = await mediumsQuery;
  if (mErr) {
    console.error('Mediums fetch failed:', mErr.message);
    process.exit(1);
  }
  if (!mediums.length) {
    console.error('No mediums matched filters. Exiting.');
    process.exit(1);
  }

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

  const totalRenders = mediums.length * MODELS.length;
  console.log(`\nBatch render`);
  console.log(`  prompt:  "${TEST_PROMPT}"`);
  console.log(`  vibe:    ${TEST_VIBE}`);
  console.log(`  mediums: ${mediums.length}${MEDIUM_KEY_FILTER ? ` (filter: ${MEDIUM_KEY_FILTER})` : ''}`);
  console.log(`  models:  ${MODELS.map((m) => m.tag || '(deployed default)').join(', ')}`);
  console.log(`  cast:    ${castSize} member(s)`);
  console.log(`  total:   ${totalRenders} renders`);
  console.log('');

  let idx = 0;
  for (const m of mediums) {
    for (const model of MODELS) {
      idx++;
      const tag = model.tag;
      const t0 = Date.now();
      const label = tag ? `${m.label.padEnd(14)} ${tag.padEnd(10)}` : m.label.padEnd(14);
      process.stdout.write(`  [${String(idx).padStart(3)}/${totalRenders}] ${label} `);

      try {
        const body = {
          mode: 'flux-dev',
          medium_key: m.key,
          vibe_key: TEST_VIBE,
          hint: TEST_PROMPT,
          vibe_profile: vibeProfile,
          persist: true,
        };
        if (model.slug) body.force_model = model.slug;

        const res = await fetch(`${SUPABASE_URL}/functions/v1/generate-dream`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.session.access_token}`,
            apikey: ANON_KEY,
          },
          body: JSON.stringify(body),
        });
        const txt = await res.text();
        let data;
        try {
          data = JSON.parse(txt);
        } catch {
          console.log(`FAIL non-JSON ${res.status} (${Date.now() - t0}ms)`);
          continue;
        }
        const elapsed = Date.now() - t0;

        if (!data.image_url) {
          console.log(`FAIL ${data.error || 'no image'} (${elapsed}ms)`);
          continue;
        }

        if (data.upload_id) {
          const prefix = tag || 'batch';
          const updates = {
            caption: `${prefix}: ${m.label}`,
            is_public: true,
            dream_medium: `${prefix}-${m.key}`,
          };
          await supabase.from('uploads').update(updates).eq('id', data.upload_id);
        }

        console.log(`OK ${elapsed}ms`);
      } catch (e) {
        console.log(`FAIL ${e.message}`);
      }

      if (idx < totalRenders) await new Promise((r) => setTimeout(r, 500));
    }
  }
  console.log('');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
