#!/usr/bin/env node

/**
 * Test Kontext cast injection — generates dreams with the user's cast photo
 * placed into surreal Sonnet templates via Flux Kontext Pro.
 *
 * Saves results as real dreams on Kevin's account (visible in the app).
 *
 * Usage:
 *   node scripts/test-kontext-cast.js
 *   node scripts/test-kontext-cast.js --count 3
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const Anthropic = require('@anthropic-ai/sdk');

const SUPABASE_URL = 'https://jimftynwrinwenonjrlj.supabase.co';
const sb = createClient(SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const REPLICATE_TOKEN = process.env.REPLICATE_API_TOKEN;
const KEVIN_ID = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';
const COUNT = parseInt(process.argv.find((_, i, a) => a[i - 1] === '--count') ?? '5', 10);

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const TEMPLATE_CATEGORIES = [
  'cosmic',
  'impossible_architecture',
  'peaceful_absurdity',
  'bioluminescence',
  'joyful_chaos',
  'overgrown',
  'broken_gravity',
  'beautiful_melancholy',
  'merged_worlds',
  'underwater',
  'cinematic',
];

const SHOT_DIRECTIONS = [
  'extreme low angle looking up, dramatic forced perspective',
  'wide establishing shot, tiny subject in vast environment, epic scale',
  'symmetrical dead-center composition, Wes Anderson framing',
  'macro lens close-up, shallow depth of field, creamy bokeh',
  'silhouette against blazing backlight, rim lighting',
  'candid snapshot feeling, slightly off-center, caught mid-moment',
];

async function main() {
  console.log(`\n🧪 Kontext Cast Test — generating ${COUNT} dreams\n`);

  // 1. Load Kevin's profile
  const { data: recipeRow, error: recipeErr } = await sb
    .from('user_recipes')
    .select('recipe')
    .eq('user_id', KEVIN_ID)
    .single();

  if (recipeErr || !recipeRow?.recipe) {
    console.error('No profile found. Go through onboarding first.');
    process.exit(1);
  }

  const profile = recipeRow.recipe;
  const cast = (profile.dream_cast ?? []).filter((m) => m.description && m.thumb_url);
  const seeds = profile.dream_seeds ?? { characters: [], places: [], things: [] };

  if (cast.length === 0) {
    console.error('No described cast members found. Go through onboarding with photos first.');
    process.exit(1);
  }

  console.log(`Cast members: ${cast.map((m) => m.role).join(', ')}`);
  console.log(
    `Seeds: ${[...seeds.characters, ...seeds.places, ...seeds.things].join(', ') || '(none)'}\n`
  );

  for (let i = 0; i < COUNT; i++) {
    const castPick = pick(cast);
    const category = pick(TEMPLATE_CATEGORIES);

    console.log(`[${i + 1}/${COUNT}] Category: ${category} | Cast: ${castPick.role}`);

    // 2. Pick a template from DB
    const { data: rows } = await sb
      .from('dream_templates')
      .select('template')
      .eq('category', category)
      .eq('disabled', false)
      .limit(200);

    if (!rows?.length) {
      console.log('  No templates, skipping');
      continue;
    }

    const template = pick(rows).template;
    const character = seeds.characters.length > 0 ? pick(seeds.characters) : 'a figure';
    const place = seeds.places.length > 0 ? pick(seeds.places) : 'a forgotten city';
    const thing = seeds.things.length > 0 ? pick(seeds.things) : 'glowing fragments';

    const filledTemplate = template
      .replace(/\$\{character\}/g, character)
      .replace(/\$\{place\}/g, place)
      .replace(/\$\{thing\}/g, thing);

    console.log(`  Template: ${filledTemplate.slice(0, 100)}...`);

    // 3. Build the cast context
    const roleLabel =
      castPick.role === 'self'
        ? 'the dreamer themselves'
        : castPick.role === 'pet'
          ? 'their beloved pet'
          : castPick.relationship === 'significant_other'
            ? 'their romantic partner'
            : `their ${castPick.relationship ?? 'companion'}`;

    // 4. Sonnet writes a Kontext instruction (not a Flux prompt — different format)
    const shotDirection = pick(SHOT_DIRECTIONS);
    const brief = `You are writing an instruction for Flux Kontext Pro, an AI model that takes a PHOTO of a real person and transforms the scene around them.

The model KEEPS the person's face and likeness from the input photo. Your job is to describe the SCENE to build around them.

PERSON IN PHOTO: ${roleLabel} — ${castPick.description}

DREAM SCENE TO BUILD AROUND THEM:
${filledTemplate}

CAMERA: ${shotDirection}

Write the Kontext instruction. 40-60 words. Rules:
1. Start with "Transform this photo:"
2. Describe the surreal environment to place the person IN — they are the protagonist
3. Keep their face, expression, and core identity — change everything else
4. Describe lighting, materials, atmosphere with specific nouns
5. The person should feel naturally embedded in the scene, not pasted on
6. End with the art style and quality terms

Output ONLY the instruction.`;

    let kontextPrompt;
    try {
      const msg = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 150,
        messages: [{ role: 'user', content: brief }],
      });
      kontextPrompt = msg.content?.[0]?.text?.trim() ?? '';
      if (kontextPrompt.length < 20) throw new Error('too short');
    } catch (err) {
      console.log(`  Sonnet failed: ${err.message}`);
      kontextPrompt = `Transform this photo: place this person in ${filledTemplate.slice(0, 100)}. Keep their face. Surreal dreamlike atmosphere, gorgeous lighting, portrait 9:16.`;
    }

    console.log(`  Kontext prompt: ${kontextPrompt.slice(0, 120)}...`);

    // 5. Generate via Kontext Pro
    let imageUrl;
    try {
      const createRes = await fetch(
        'https://api.replicate.com/v1/models/black-forest-labs/flux-kontext-pro/predictions',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${REPLICATE_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            input: {
              prompt: kontextPrompt,
              input_image: castPick.thumb_url,
              aspect_ratio: '9:16',
              output_format: 'jpg',
            },
          }),
        }
      );

      if (!createRes.ok) throw new Error(`Kontext create failed: ${createRes.status}`);
      const pred = await createRes.json();
      if (!pred.id) throw new Error('No prediction ID');

      // Poll
      for (let p = 0; p < 60; p++) {
        await new Promise((r) => setTimeout(r, 2000));
        const pollRes = await fetch(`https://api.replicate.com/v1/predictions/${pred.id}`, {
          headers: { Authorization: `Bearer ${REPLICATE_TOKEN}` },
        });
        const pollData = await pollRes.json();
        if (pollData.status === 'succeeded') {
          imageUrl = typeof pollData.output === 'string' ? pollData.output : pollData.output?.[0];
          break;
        }
        if (pollData.status === 'failed') throw new Error(`Failed: ${pollData.error}`);
      }
      if (!imageUrl) throw new Error('Timed out');
    } catch (err) {
      console.log(`  ❌ Generation failed: ${err.message}`);
      continue;
    }

    // 6. Persist to Supabase Storage
    const imgResp = await fetch(imageUrl);
    if (!imgResp.ok) {
      console.log('  ❌ Failed to download image');
      continue;
    }
    const imgBuf = Buffer.from(await imgResp.arrayBuffer());
    const fileName = `${KEVIN_ID}/${Date.now()}.jpg`;

    const { error: storageErr } = await sb.storage
      .from('uploads')
      .upload(fileName, imgBuf, { contentType: 'image/jpeg' });
    if (storageErr) {
      console.log(`  ❌ Storage upload failed: ${storageErr.message}`);
      continue;
    }

    const { data: urlData } = sb.storage.from('uploads').getPublicUrl(fileName);
    const permanentUrl = urlData.publicUrl;

    // 7. Insert as a dream on Kevin's account
    const { data: upload, error: uploadErr } = await sb
      .from('uploads')
      .insert({
        user_id: KEVIN_ID,
        categories: ['art'],
        image_url: permanentUrl,
        caption: null,
        ai_prompt: kontextPrompt,
        bot_message: `[kontext cast test] ${castPick.role} | ${category}`,
        is_approved: true,
        is_active: true,
      })
      .select('id')
      .single();

    if (uploadErr) {
      console.log(`  ❌ DB insert failed: ${uploadErr.message}`);
      continue;
    }

    console.log(`  ✅ Dream saved (id: ${upload.id})\n`);
  }

  console.log('Done! Check your feed in the app.');
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
