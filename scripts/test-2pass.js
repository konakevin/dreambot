#!/usr/bin/env node
'use strict';

/**
 * test-2pass.js — Two-pass render: Flux (with face swap) → Kontext restyle.
 *
 * Usage:
 *   node scripts/test-2pass.js --medium watercolor --vibe cozy --models flux2-dev
 *   node scripts/test-2pass.js --medium watercolor --models flux1-dev,flux1-pro,flux2-dev,flux2-pro
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
const REPLICATE_TOKEN = process.env.REPLICATE_API_TOKEN;
const KEVIN_ID = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';
const KEVIN_EMAIL = 'konakevin@gmail.com';

const args = process.argv.slice(2);
const getArg = (name, fallback) => {
  const i = args.indexOf('--' + name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};

const MEDIUM = getArg('medium', 'watercolor');
const VIBE = getArg('vibe', 'cozy');
const PROMPT = getArg('prompt', 'Show me standing above a vast valley in zions national park with a sunset in the background and epic scenery all around, show me smiling at the camera');
const MODELS_FLAG = getArg('models', 'flux2-dev');
const MODELS = MODELS_FLAG.split(',').map(tag => {
  const registry = {
    'flux1-dev': 'black-forest-labs/flux-dev',
    'flux1-pro': 'black-forest-labs/flux-1.1-pro',
    'flux2-dev': 'black-forest-labs/flux-2-dev',
    'flux2-pro': 'black-forest-labs/flux-2-pro',
  };
  return { tag: tag.trim(), slug: registry[tag.trim()] || tag.trim() };
});

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
const userClient = createClient(SUPABASE_URL, ANON_KEY);

async function kontextPass(imageUrl, prompt) {
  const res = await fetch('https://api.replicate.com/v1/models/black-forest-labs/flux-kontext-pro/predictions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${REPLICATE_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ input: { prompt, input_image: imageUrl, aspect_ratio: '9:16', output_quality: 90, safety_tolerance: 2 } }),
  });
  const pred = await res.json();
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 2000));
    const poll = await fetch(`https://api.replicate.com/v1/predictions/${pred.id}`, {
      headers: { Authorization: `Bearer ${REPLICATE_TOKEN}` },
    });
    const p = await poll.json();
    if (p.status === 'succeeded') return typeof p.output === 'string' ? p.output : p.output?.[0];
    if (p.status === 'failed') throw new Error(p.error || 'failed');
  }
  throw new Error('timeout');
}

async function main() {
  // Sign in
  const { data: linkData } = await supabase.auth.admin.generateLink({ type: 'magiclink', email: KEVIN_EMAIL });
  const { data: auth } = await userClient.auth.verifyOtp({ token_hash: linkData.properties.hashed_token, type: 'magiclink' });
  const token = auth.session.access_token;

  // Get recipe + kontext directive
  const { data: rec } = await supabase.from('user_recipes').select('recipe').eq('user_id', KEVIN_ID).single();
  const { data: med } = await supabase.from('dream_mediums').select('kontext_directive').eq('key', MEDIUM).single();
  const kontextPrompt = med.kontext_directive;

  console.log(`2-pass: ${MEDIUM}/${VIBE} × ${MODELS.length} models`);
  console.log(`Prompt: "${PROMPT.slice(0, 80)}..."`);
  console.log(`Kontext: "${kontextPrompt.slice(0, 80)}..."\n`);

  for (const m of MODELS) {
    process.stdout.write(`${m.tag}: `);

    // Step 1: Flux + face swap
    const t0 = Date.now();
    const res = await fetch(`${SUPABASE_URL}/functions/v1/generate-dream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, apikey: ANON_KEY },
      body: JSON.stringify({
        mode: 'flux-dev',
        medium_key: MEDIUM,
        vibe_key: VIBE,
        hint: PROMPT,
        vibe_profile: rec.recipe,
        force_model: m.slug,
      }),
    });
    const data = await res.json();
    if (!data.image_url) { console.log('FAIL step1:', data.error || 'no image'); continue; }
    const step1ms = Date.now() - t0;
    console.log(`flux ${step1ms}ms → `);

    // Step 2: Kontext pass on the face-swapped result
    const t1 = Date.now();
    try {
      const kontextUrl = await kontextPass(data.image_url, kontextPrompt);
      const img = await fetch(kontextUrl);
      const buf = await img.arrayBuffer();
      const fn = `${KEVIN_ID}/${Date.now()}.jpg`;
      await supabase.storage.from('uploads').upload(fn, buf, { contentType: 'image/jpeg' });
      const { data: pub } = supabase.storage.from('uploads').getPublicUrl(fn);
      await supabase.from('uploads').insert({
        user_id: KEVIN_ID,
        image_url: pub.publicUrl,
        caption: `${MEDIUM} 2-pass ${m.tag}`,
        ai_prompt: `2-pass: ${m.tag} + Kontext ${MEDIUM}`,
        dream_medium: MEDIUM,
        dream_vibe: VIBE,
        is_public: false,
        width: 768,
        height: 1664,
      });
      console.log(`  kontext ${Date.now() - t1}ms → OK (total ${Date.now() - t0}ms)`);
    } catch (e) {
      console.log(`  kontext FAIL: ${e.message}`);
    }
  }
  console.log('\nDone');
}

main().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
