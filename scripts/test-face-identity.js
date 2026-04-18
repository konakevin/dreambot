#!/usr/bin/env node
'use strict';

/**
 * test-face-identity.js — Compare face identity models on Replicate.
 * Generates the same scene with the same face reference across multiple models.
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
const REPLICATE = process.env.REPLICATE_API_TOKEN;
const KEVIN_ID = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

const args = process.argv.slice(2);
const getArg = (name, fallback) => {
  const i = args.indexOf('--' + name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};

const PROMPT = getArg('prompt', 'watercolor painting on cold-press paper, a person standing on a pretty golf course with trees and warm sun, facing the camera smiling, transparent pigment washes, visible paper texture, soft bleeding edges, Sargent-style elegance, portrait 9:16');
const CAST = getArg('cast', 'self');

async function pollPrediction(predId) {
  for (let i = 0; i < 60; i++) {
    await new Promise(r => setTimeout(r, 2000));
    const poll = await fetch(`https://api.replicate.com/v1/predictions/${predId}`, {
      headers: { Authorization: `Bearer ${REPLICATE}` },
    });
    const p = await poll.json();
    if (p.status === 'succeeded') {
      return typeof p.output === 'string' ? p.output : Array.isArray(p.output) ? p.output[0] : null;
    }
    if (p.status === 'failed') throw new Error(p.error || 'failed');
  }
  throw new Error('timeout');
}

async function saveResult(url, label) {
  const img = await fetch(url);
  const buf = await img.arrayBuffer();
  const fn = `${KEVIN_ID}/${Date.now()}.jpg`;
  await supabase.storage.from('uploads').upload(fn, buf, { contentType: 'image/jpeg' });
  const { data: pub } = supabase.storage.from('uploads').getPublicUrl(fn);
  await supabase.from('uploads').insert({
    user_id: KEVIN_ID,
    image_url: pub.publicUrl,
    caption: label,
    ai_prompt: PROMPT.slice(0, 200),
    dream_medium: 'watercolor',
    dream_vibe: 'cozy',
    is_public: false,
    width: 768,
    height: 1664,
  });
}

async function main() {
  const { data: rec } = await supabase.from('user_recipes').select('recipe').eq('user_id', KEVIN_ID).single();
  const member = (rec.recipe.dream_cast || []).find(m => m.role === CAST);
  if (!member) { console.error('No cast photo for', CAST); process.exit(1); }
  const faceUrl = member.thumb_url;
  console.log('Face:', faceUrl.slice(0, 60));
  console.log('Prompt:', PROMPT.slice(0, 80) + '...\n');

  const models = [
    {
      label: 'PuLID',
      run: async () => {
        const res = await fetch('https://api.replicate.com/v1/models/zsxkib/pulid/predictions', {
          method: 'POST',
          headers: { Authorization: `Bearer ${REPLICATE}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            input: {
              prompt: PROMPT,
              main_face_image: faceUrl,
              num_steps: 20,
              identity_scale: 0.8,
              num_samples: 1,
              image_width: 768,
              image_height: 1344,
              negative_prompt: 'ugly, deformed, blurry, low quality',
            },
          }),
        });
        const pred = await res.json();
        return pollPrediction(pred.id);
      },
    },
    {
      label: 'PhotoMaker-Style',
      run: async () => {
        const res = await fetch('https://api.replicate.com/v1/models/tencentarc/photomaker-style/predictions', {
          method: 'POST',
          headers: { Authorization: `Bearer ${REPLICATE}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            input: {
              prompt: 'a person img standing on a pretty golf course with trees and warm sun, facing the camera smiling, watercolor painting style, transparent pigment washes, visible paper texture, Sargent-style',
              input_image: faceUrl,
              style_name: 'Watercolor',
              num_steps: 50,
              style_strength_ratio: 35,
              num_outputs: 1,
              guidance_scale: 5,
              negative_prompt: 'ugly, deformed, blurry',
            },
          }),
        });
        const pred = await res.json();
        return pollPrediction(pred.id);
      },
    },
    {
      label: 'InstantID',
      run: async () => {
        const res = await fetch('https://api.replicate.com/v1/models/zsxkib/instant-id/predictions', {
          method: 'POST',
          headers: { Authorization: `Bearer ${REPLICATE}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            input: {
              image: faceUrl,
              prompt: PROMPT,
              num_outputs: 1,
              guidance_scale: 5,
              ip_adapter_scale: 0.8,
              num_inference_steps: 30,
              negative_prompt: 'ugly, deformed, blurry, low quality',
              enhance_nonface_region: true,
            },
          }),
        });
        const pred = await res.json();
        return pollPrediction(pred.id);
      },
    },
  ];

  for (const m of models) {
    process.stdout.write(`${m.label}: `);
    const t0 = Date.now();
    try {
      const url = await m.run();
      if (!url) { console.log('FAIL: no output'); continue; }
      await saveResult(url, `${m.label} watercolor test`);
      console.log(`OK ${Date.now() - t0}ms`);
    } catch (e) {
      console.log(`FAIL ${Date.now() - t0}ms: ${e.message.slice(0, 100)}`);
    }
  }
  console.log('\nDone — check feed');
}

main().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
