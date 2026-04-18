#!/usr/bin/env node
'use strict';

/**
 * test-restyle-variants.js — Run multiple Kontext restyle variants on the same photo.
 * Used to A/B test different prompt instructions for a medium.
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

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

const VARIANTS = [
  {
    label: 'A: Wet loose watercolor',
    prompt: `Transform this photo into a loose wet watercolor painting. Diluted transparent pigment on soaked cotton paper. Colors bleed and flow freely — edges are soft and feathered, never sharp. Skin is pale washes with paper white showing through. Hair is wet-on-wet strokes bleeding into the background. The whole image should look WET — like the paper is still damp and the paint is still moving. Visible paper grain everywhere. Muted, airy, atmospheric. Keep the same person and pose.`,
  },
  {
    label: 'B: Vibrant watercolor illustration',
    prompt: `Transform this photo into a vibrant watercolor illustration. Bold confident brushstrokes with rich saturated color. Decisive gestural linework defines the face and features. Colors are vivid — not washed out. Visible paper texture and brushstroke direction. The style feels fresh and immediate, like a skilled illustrator painted this in one sitting. Keep the same person and pose. Portrait 9:16.`,
  },
  {
    label: 'C: Classic watercolor portrait',
    prompt: `Transform this photo into a classical watercolor portrait in the tradition of John Singer Sargent. Transparent layered washes building form through light and shadow. Skin rendered with warm peachy washes over cool blue undertones. Eyes and focal features painted with precision, while hair and clothing dissolve into looser, more abstract washes. White paper preserved for brightest highlights. Elegant, luminous, painterly. Keep the same person and pose.`,
  },
];

async function main() {
  const { data: rec } = await supabase.from('user_recipes').select('recipe').eq('user_id', KEVIN_ID).single();
  const self = (rec.recipe.dream_cast || []).find(m => m.role === 'self');
  if (!self) { console.error('No self cast'); process.exit(1); }

  for (const v of VARIANTS) {
    console.log(`[${v.label}] Generating...`);
    const t0 = Date.now();

    // Call Kontext directly via Replicate
    const res = await fetch('https://api.replicate.com/v1/models/black-forest-labs/flux-kontext-max/predictions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${REPLICATE_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: {
          prompt: v.prompt,
          input_image: self.thumb_url,
          aspect_ratio: '9:16',
          output_quality: 90,
          safety_tolerance: 2,
        },
      }),
    });
    const pred = await res.json();

    // Poll
    for (let i = 0; i < 30; i++) {
      await new Promise(r => setTimeout(r, 2000));
      const poll = await fetch(`https://api.replicate.com/v1/predictions/${pred.id}`, {
        headers: { Authorization: `Bearer ${REPLICATE_TOKEN}` },
      });
      const p = await poll.json();
      if (p.status === 'succeeded') {
        const url = typeof p.output === 'string' ? p.output : p.output?.[0];

        // Persist to storage
        const imgRes = await fetch(url);
        const buf = await imgRes.arrayBuffer();
        const fileName = `${KEVIN_ID}/${Date.now()}.jpg`;
        await supabase.storage.from('uploads').upload(fileName, buf, { contentType: 'image/jpeg' });
        const { data: pubUrl } = supabase.storage.from('uploads').getPublicUrl(fileName);

        // Create upload row
        await supabase.from('uploads').insert({
          user_id: KEVIN_ID,
          image_url: pubUrl.publicUrl,
          caption: v.label,
          ai_prompt: v.prompt.slice(0, 200),
          dream_medium: 'watercolor',
          dream_vibe: 'cinematic',
          is_public: false,
          width: 768,
          height: 1664,
        });

        console.log(`  OK ${Date.now() - t0}ms`);
        break;
      }
      if (p.status === 'failed') {
        console.log(`  FAIL: ${p.error}`);
        break;
      }
    }
  }
  console.log('Done — 3 variants in feed');
}

main().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
