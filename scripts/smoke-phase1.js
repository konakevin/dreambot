#!/usr/bin/env node
'use strict';

/**
 * smoke-phase1.js — Verify Phase 1 observability landed correctly.
 *
 * Runs 2 generations against generate-dream (self-insert + text directive),
 * then queries ai_generation_log to confirm the new observability columns
 * populate with real data. Tagged with `smoke:` caption prefix for cleanup.
 *
 * Usage: node scripts/smoke-phase1.js
 * Cleanup:
 *   DELETE FROM uploads WHERE user_id = '<kevin>' AND caption LIKE 'smoke:%'
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
    const k = trimmed.slice(0, eq).trim();
    if (!process.env[k]) process.env[k] = trimmed.slice(eq + 1).trim();
  }
}

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const KEVIN_ID = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';
const KEVIN_EMAIL = 'konakevin@gmail.com';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
const userClient = createClient(SUPABASE_URL, ANON_KEY);

async function signIn() {
  const { data: linkData, error: linkErr } = await supabase.auth.admin.generateLink({
    type: 'magiclink',
    email: KEVIN_EMAIL,
  });
  if (linkErr) throw new Error('Magic link failed: ' + linkErr.message);
  const { data: auth, error: authErr } = await userClient.auth.verifyOtp({
    token_hash: linkData.properties.hashed_token,
    type: 'magiclink',
  });
  if (authErr) throw new Error('OTP exchange failed: ' + authErr.message);
  return auth.session.access_token;
}

async function loadVibeProfile() {
  const { data, error } = await supabase
    .from('user_recipes')
    .select('recipe')
    .eq('user_id', KEVIN_ID)
    .single();
  if (error) throw new Error('Load recipe failed: ' + error.message);
  return data.recipe;
}

async function invoke(path, body, token) {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      apikey: ANON_KEY,
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${path} ${res.status}: ${text.slice(0, 300)}`);
  return JSON.parse(text);
}

async function main() {
  console.log('— Phase 1 smoke test —');
  const token = await signIn();
  const vibeProfile = await loadVibeProfile();

  const startedAt = new Date().toISOString();

  const cases = [
    {
      label: 'self-insert (natural, face-swap eligible)',
      body: {
        mode: 'flux-dev',
        vibe_profile: vibeProfile,
        medium_key: 'photography',
        vibe_key: 'cinematic',
        prompt: 'smoke: put me in a foggy forest at dawn',
      },
      expectSonnet: true,
    },
    {
      label: 'text directive (pure scene, no cast)',
      body: {
        mode: 'flux-dev',
        vibe_profile: vibeProfile,
        medium_key: 'watercolor',
        vibe_key: 'peaceful',
        prompt: 'smoke: a fox in a forest at sunset',
      },
      expectSonnet: true,
    },
  ];

  const results = [];
  for (const c of cases) {
    console.log(`\n[run] ${c.label}`);
    const t0 = Date.now();
    try {
      const out = await invoke('generate-dream', c.body, token);
      const ms = Date.now() - t0;
      console.log(`  ✓ ${ms}ms — ${(out.image_url || '').slice(0, 70)}`);
      console.log(`  prompt: ${(out.enhanced_prompt || '').slice(0, 120)}`);
      results.push({ ...c, ok: true, out });
    } catch (err) {
      console.error(`  ✗ ${err.message}`);
      results.push({ ...c, ok: false, err: err.message });
    }
  }

  console.log('\n— Verifying ai_generation_log observability columns —');
  // Wait a beat for the log inserts to flush
  await new Promise((r) => setTimeout(r, 2000));

  const { data: logs, error: logErr } = await supabase
    .from('ai_generation_log')
    .select(
      'id,created_at,enhanced_prompt,model_used,sonnet_brief,sonnet_raw_response,vision_description,fallback_reasons,replicate_prediction_id'
    )
    .eq('user_id', KEVIN_ID)
    .gte('created_at', startedAt)
    .order('created_at', { ascending: true });

  if (logErr) {
    console.error('Log query failed:', logErr.message);
    process.exit(1);
  }

  console.log(`Found ${logs.length} new log rows since ${startedAt}`);

  let allPass = true;
  for (const row of logs) {
    const checks = {
      sonnet_brief: row.sonnet_brief && row.sonnet_brief.length > 50,
      sonnet_raw_response: row.sonnet_raw_response && row.sonnet_raw_response.length > 10,
      fallback_reasons: Array.isArray(row.fallback_reasons),
      replicate_prediction_id:
        row.replicate_prediction_id && row.replicate_prediction_id.length > 5,
    };
    const pass = Object.values(checks).every(Boolean);
    if (!pass) allPass = false;
    console.log(`\nrow ${row.id} (${row.model_used}):`);
    console.log(`  sonnet_brief:            ${checks.sonnet_brief ? '✓' : '✗'} (${(row.sonnet_brief || '').length} chars)`);
    console.log(`  sonnet_raw_response:     ${checks.sonnet_raw_response ? '✓' : '✗'} (${(row.sonnet_raw_response || '').length} chars)`);
    console.log(`  vision_description:      ${row.vision_description ? '✓' : '·'} (nullable, ${(row.vision_description || '').length} chars)`);
    console.log(`  fallback_reasons:        ${checks.fallback_reasons ? '✓' : '✗'} [${(row.fallback_reasons || []).join(', ') || 'empty'}]`);
    console.log(`  replicate_prediction_id: ${checks.replicate_prediction_id ? '✓' : '✗'} ${row.replicate_prediction_id || 'null'}`);
  }

  console.log(`\n— ${allPass && results.every((r) => r.ok) ? 'PASS ✓' : 'FAIL ✗'} —`);
  console.log(`Cleanup: DELETE FROM uploads WHERE user_id = '${KEVIN_ID}' AND caption LIKE 'smoke:%';`);
  process.exit(allPass && results.every((r) => r.ok) ? 0 : 1);
}

main().catch((e) => {
  console.error('FATAL:', e.message);
  process.exit(1);
});
