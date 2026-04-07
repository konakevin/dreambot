#!/usr/bin/env node

/**
 * Autonomous cast dream quality tester.
 *
 * Generates cast dreams, evaluates each with Sonnet vision, scores them,
 * and logs what works vs what doesn't. Adjusts the Kontext prompt approach
 * between rounds based on findings.
 *
 * Usage:
 *   node scripts/test-cast-quality.js
 *   node scripts/test-cast-quality.js --count 10
 *   node scripts/test-cast-quality.js --role self     # only test self
 *   node scripts/test-cast-quality.js --role plus_one
 *   node scripts/test-cast-quality.js --role pet
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const Anthropic = require('@anthropic-ai/sdk');

const sb = createClient(
  'https://jimftynwrinwenonjrlj.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const REPLICATE_TOKEN = process.env.REPLICATE_API_TOKEN;
const KEVIN_ID = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';
const COUNT = parseInt(process.argv.find((_, i, a) => a[i - 1] === '--count') ?? '5', 10);
const ROLE_FILTER = process.argv.find((_, i, a) => a[i - 1] === '--role') ?? null;

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const MEDIUMS = {
  pixel_art:
    '16-bit pixel art, carefully placed pixels, limited harmonious color palette, dithered gradients, retro game aesthetic',
  // watercolor removed — Kontext restyle consistently fails to transform
  oil_painting:
    'Oil painting on canvas, thick impasto brushstrokes, visible palette knife texture, rich layered glazes',
  anime:
    'Anime illustration, clean ink linework, cel-shaded coloring, expressive detailed eyes, dynamic hair flow',
  lego: 'LEGO brick diorama, everything constructed from LEGO pieces, plastic studs visible, minifigure characters',
  claymation:
    'Claymation stop-motion animation, smooth sculpted clay characters, visible fingerprint textures',
  '3d_render':
    'Pixar-quality 3D render, soft rounded appealing shapes, subsurface scattering, volumetric lighting',
  ghibli:
    'Studio Ghibli animation style, soft painterly rendering, warm natural color palette, Miyazaki quality',
  comic_book:
    'Comic book art, bold ink outlines, dynamic composition, halftone Ben-Day dots, saturated flat colors',
  disney:
    'Classic Disney 2D animation, hand-drawn cel animation, clean flowing ink outlines, rich painted colors',
  tim_burton:
    'Tim Burton gothic style, spindly elongated limbs, spiral motifs, black and white with purple accents',
  neon: 'Neon-lit night scene, glowing tube lights, electric cyan and hot pink, rain-slicked reflective surfaces, cyberpunk noir',
  stained_glass:
    'Stained glass window artwork, bold black leading lines, jewel-tone translucent colors glowing with backlight',
  embroidery:
    'Hand embroidery on linen fabric, cross-stitch and satin stitch techniques, visible thread texture, rich DMC floss colors',
  pencil_sketch:
    'Detailed pencil sketch on textured paper, confident graphite linework, hatching and cross-hatching, dramatic tonal range',
  sack_boy:
    'LittleBigPlanet Sack Boy style, knitted fabric characters, button eyes, zipper details, cardboard and craft material world',
  funko_pop:
    'Funko Pop vinyl figure style, oversized head, tiny body, glossy plastic surface, dot eyes, no mouth',
  pop_art:
    'Pop art style, Andy Warhol screen print, bold flat primary colors, Ben-Day halftone dots, thick black outlines',
  minecraft:
    'Minecraft voxel style, everything built from cubic blocks, pixelated block textures, square character heads',
  '8bit':
    'NES 8-bit pixel art, extremely limited color palette, large chunky pixels, very low resolution, retro 1985 gaming',
  felt: 'Needle-felted stop-motion puppet, visible wool fiber texture, hand-crafted miniature set, Laika Studios Coraline quality',
};

const VIBES = {
  cinematic:
    'This is a frame from an Oscar-winning film. Motivated lighting, teal-and-orange grade, frozen narrative tension.',
  dreamy:
    'Everything floats in a soft, ethereal haze. Light emanates from within the scene itself, gentle omnidirectional glow.',
  dark: 'Embrace the shadows. Deep shadow, rich velvety blacks. Light is rare and precious.',
  chaos:
    "Rules don't exist here. Multiple conflicting light sources in impossible colors. Perspective bends.",
  cozy: 'Everything is warm and close. Intimate space, soft warm lighting, candlelight, string lights.',
  minimal:
    'Less is everything. One subject, vast negative space. Single tone or subtle gradient background.',
  epic: 'SCALE. The subject exists within something impossibly vast — towering mountains, endless skies, cosmic expanses.',
  nostalgic:
    'This is a memory being remembered fondly. Warm golden tones, late afternoon in eternal summer.',
  psychedelic:
    'Reality is melting, breathing, pulsing with impossible color. Fractals, mandalas, maximum saturation.',
  peaceful:
    'Absolute stillness. Perfect calm — still water reflecting sky, windless fields, quiet dawn light.',
  whimsical:
    'Physics are optional and reality is playful. Objects are the wrong size, candy-bright colors, floating islands.',
};

const CATEGORIES = [
  'cosmic',
  'impossible_architecture',
  'peaceful_absurdity',
  'bioluminescence',
  'joyful_chaos',
  'overgrown',
  'broken_gravity',
  'merged_worlds',
  'underwater',
  'cinematic',
];

const SHOT_DIRECTIONS = [
  'extreme low angle looking up, dramatic forced perspective',
  'wide establishing shot, tiny subject in vast environment, epic scale',
  'symmetrical dead-center composition, Wes Anderson framing',
  'silhouette against blazing backlight, rim lighting',
  'candid snapshot feeling, slightly off-center, caught mid-moment',
  'dutch angle, dramatic tension, off-kilter framing',
];

async function generateFluxDev(prompt) {
  const res = await fetch(
    'https://api.replicate.com/v1/models/black-forest-labs/flux-dev/predictions',
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${REPLICATE_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: { prompt, aspect_ratio: '9:16', num_outputs: 1, output_format: 'jpg' },
      }),
    }
  );
  if (!res.ok) throw new Error(`Flux Dev create failed: ${res.status}`);
  const pred = await res.json();
  if (!pred.id) throw new Error('No prediction ID');
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const poll = await fetch(`https://api.replicate.com/v1/predictions/${pred.id}`, {
      headers: { Authorization: `Bearer ${REPLICATE_TOKEN}` },
    });
    const data = await poll.json();
    if (data.status === 'succeeded') return data.output?.[0];
    if (data.status === 'failed') throw new Error(`Failed: ${data.error}`);
  }
  throw new Error('Timed out');
}

async function generateKontext(prompt, inputImageUrl) {
  const res = await fetch(
    'https://api.replicate.com/v1/models/black-forest-labs/flux-kontext-pro/predictions',
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${REPLICATE_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: { prompt, input_image: inputImageUrl, aspect_ratio: '9:16', output_format: 'jpg' },
      }),
    }
  );
  if (!res.ok) throw new Error(`Kontext create failed: ${res.status}`);
  const pred = await res.json();
  if (!pred.id) throw new Error('No prediction ID');
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const poll = await fetch(`https://api.replicate.com/v1/predictions/${pred.id}`, {
      headers: { Authorization: `Bearer ${REPLICATE_TOKEN}` },
    });
    const data = await poll.json();
    if (data.status === 'succeeded')
      return typeof data.output === 'string' ? data.output : data.output?.[0];
    if (data.status === 'failed') throw new Error(`Failed: ${data.error}`);
  }
  throw new Error('Timed out');
}

async function persistImage(tempUrl) {
  const resp = await fetch(tempUrl);
  const buf = Buffer.from(await resp.arrayBuffer());
  const fileName = `${KEVIN_ID}/${Date.now()}.jpg`;
  await sb.storage.from('uploads').upload(fileName, buf, { contentType: 'image/jpeg' });
  const { data } = sb.storage.from('uploads').getPublicUrl(fileName);
  return data.publicUrl;
}

async function evaluateWithVision(imageUrl, promptUsed, castDescription, mediumKey) {
  const imgResp = await fetch(imageUrl);
  const imgBuf = Buffer.from(await imgResp.arrayBuffer());
  const base64 = imgBuf.toString('base64');

  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 300,
    messages: [
      {
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: base64 } },
          {
            type: 'text',
            text: `You are a quality evaluator for AI-generated dream images. Score this image.

KONTEXT PROMPT USED: "${promptUsed}"

CAST MEMBER DESCRIPTION: "${castDescription}"

INTENDED MEDIUM: ${mediumKey}

Score each dimension 1-5 and explain briefly:

1. LIKENESS: Does the person/pet from the input photo appear recognizable? (5 = clearly them, 1 = unrecognizable or missing)
2. TRANSFORMATION: Is the scene genuinely transformed into a surreal dream, or does it look like the original photo with a filter? (5 = completely new world, 1 = barely changed)
3. INTEGRATION: Does the person look naturally embedded in the scene, or pasted on / awkward? (5 = seamless, 1 = obvious composite)
4. MEDIUM: Does the art style match the intended medium (${mediumKey})? (5 = perfect style match, 1 = wrong style entirely)
5. WOW_FACTOR: Would someone stop scrolling to look at this? (5 = jaw-dropping, 1 = generic)

Output JSON only: {"likeness":N,"transformation":N,"integration":N,"medium":N,"wow":N,"notes":"brief explanation of what worked and what didn't"}`,
          },
        ],
      },
    ],
  });

  const text = msg.content?.[0]?.text?.trim() ?? '';
  try {
    const match = text.match(/\{[\s\S]*\}/);
    return JSON.parse(match?.[0] ?? text);
  } catch {
    return { likeness: 0, transformation: 0, integration: 0, medium: 0, wow: 0, notes: text };
  }
}

async function main() {
  console.log(`\n🔬 Cast Dream Quality Test — ${COUNT} dreams\n`);

  // Load profile
  const { data: row } = await sb
    .from('user_recipes')
    .select('recipe')
    .eq('user_id', KEVIN_ID)
    .single();
  const profile = row?.recipe;
  if (!profile) {
    console.error('No profile');
    process.exit(1);
  }

  const seeds = profile.dream_seeds ?? { characters: [], places: [], things: [] };
  let cast = (profile.dream_cast ?? []).filter(
    (m) => m.description && m.thumb_url?.startsWith('http')
  );

  if (ROLE_FILTER) cast = cast.filter((m) => m.role === ROLE_FILTER);
  if (!cast.length) {
    console.error(
      'No described cast with http URLs. Run test-full-dream.js first to fix cast photos.'
    );
    process.exit(1);
  }

  console.log(
    `Cast: ${cast.map((m) => `${m.role} (${m.description?.slice(0, 30)}...)`).join(', ')}\n`
  );

  const results = [];

  // Cycle through mediums instead of random to guarantee variety
  const allMediumKeys = Object.keys(MEDIUMS).sort(() => Math.random() - 0.5);

  for (let i = 0; i < COUNT; i++) {
    const castMember = pick(cast);
    const mediumKey = allMediumKeys[i % allMediumKeys.length];
    const mediumFragment = MEDIUMS[mediumKey];
    const vibeKey = pick(Object.keys(VIBES));
    const vibeDirective = VIBES[vibeKey];
    const category = pick(CATEGORIES);

    console.log(`[${i + 1}/${COUNT}] ${castMember.role} | ${mediumKey} | ${vibeKey} | ${category}`);

    // Get template
    const { data: rows } = await sb
      .from('dream_templates')
      .select('template')
      .eq('category', category)
      .eq('disabled', false)
      .limit(200);
    if (!rows?.length) {
      console.log('  No templates, skip');
      continue;
    }

    const template = pick(rows).template;
    const character = castMember.role === 'pet' ? 'a small creature' : 'a lone figure';
    const place = seeds.places.length > 0 ? pick(seeds.places) : 'a forgotten city';
    const thing = seeds.things.length > 0 ? pick(seeds.things) : 'glowing fragments';
    const filledTemplate = template
      .replace(/\$\{character\}/g, character)
      .replace(/\$\{place\}/g, place)
      .replace(/\$\{thing\}/g, thing);

    const roleLabel =
      castMember.role === 'self'
        ? 'the dreamer themselves'
        : castMember.role === 'pet'
          ? 'their beloved pet'
          : castMember.relationship === 'significant_other'
            ? 'their romantic partner'
            : `their ${castMember.relationship ?? 'companion'}`;

    const shotDirection = pick(SHOT_DIRECTIONS);

    // ── THREE DREAM COMPOSITION PATHS ──
    const shortCastDesc =
      castMember.description?.split(',')[0] ??
      (castMember.role === 'pet' ? 'a small creature' : 'a figure');
    const mediumStyle = mediumKey.replace(/_/g, ' ');

    // Cycle through all 3 paths evenly
    const paths = ['character', 'pure_scene', 'epic_tiny'];
    const dreamPath = paths[i % 3];

    let promptBrief;

    if (dreamPath === 'character') {
      promptBrief = `You are a ${mediumStyle} artist. Write a Flux AI prompt (60-90 words, comma-separated).\n\nMEDIUM: ${mediumFragment}\n\nCreate a scene where a ${mediumStyle}-style ${shortCastDesc} is the main character experiencing this dream:\n${filledTemplate}\n\nThe character is rendered fully in ${mediumStyle} style — NOT photorealistic. They are DOING something in the scene, not just standing and staring at the camera. Show them interacting with the surreal environment.\n\nCAMERA: ${shotDirection}\nMOOD: ${vibeDirective}\n\nStart with the art medium. End with: no text, no words, no letters, no watermarks, hyper detailed.\nOutput ONLY the prompt.`;
    } else if (dreamPath === 'epic_tiny') {
      promptBrief = `You are a cinematographer composing an EPIC, VAST scene. Write a Flux AI prompt (60-90 words, comma-separated).\n\nMEDIUM: ${mediumFragment}\n\nDREAM SCENE (this is the ENTIRE focus — describe in maximum vivid detail):\n${filledTemplate}\n\nSomewhere in this vast scene, barely visible, is a tiny ${mediumStyle}-style ${shortCastDesc}. They occupy less than 5% of the image. The scene is EVERYTHING.\n\nCAMERA: ${shotDirection}\nMOOD: ${vibeDirective}\n\nWrite the prompt:\n1. Start with the art medium\n2. Spend 90% of words on the ENVIRONMENT\n3. Mention the tiny character in ONE short phrase at the very end\n4. End with: no text, no words, no letters, no watermarks, hyper detailed\nOutput ONLY the prompt.`;
    } else {
      promptBrief = `You are a cinematographer composing a single breathtaking frame. Write a Flux AI prompt (60-90 words, comma-separated).\n\nMEDIUM: ${mediumFragment}\n\nDREAM SCENE (this is sacred — do NOT water it down):\n${filledTemplate}\n\nCAMERA/COMPOSITION: ${shotDirection}\nMOOD: ${vibeDirective}\n\nWrite the prompt:\n1. Start with the art medium\n2. Describe the EXACT scene — every surreal detail preserved\n3. NO PEOPLE. NO CHARACTERS. NO FIGURES. Pure environment.\n4. Name specific materials, textures, light sources (NOUNS not adjectives)\n5. End with: no text, no words, no letters, no watermarks, hyper detailed, masterwork composition\nOutput ONLY the prompt.`;
    }

    let promptUsed;
    let imageUrl;
    const engine = `flux-dev-${dreamPath}`;

    try {
      const msg = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 200,
        messages: [{ role: 'user', content: promptBrief }],
      });
      promptUsed = msg.content?.[0]?.text?.trim() ?? '';
      if (promptUsed.length < 20) throw new Error('too short');
    } catch {
      promptUsed = `${mediumFragment}, ${filledTemplate}, no text, hyper detailed`;
    }

    console.log(`  [${dreamPath}] ${promptUsed.slice(0, 100)}...`);

    try {
      const tempUrl = await generateFluxDev(promptUsed);
      imageUrl = await persistImage(tempUrl);
    } catch (err) {
      console.log(`  ❌ Flux Dev failed: ${err.message}\n`);
      continue;
    }

    // Evaluate
    let scores;
    try {
      scores = await evaluateWithVision(imageUrl, promptUsed, castMember.description, mediumKey);
    } catch (err) {
      console.log(`  ⚠️ Evaluation failed: ${err.message}`);
      scores = {
        likeness: 0,
        transformation: 0,
        integration: 0,
        medium: 0,
        wow: 0,
        notes: 'eval failed',
      };
    }

    // Ensure all scores are numbers (Sonnet sometimes omits fields)
    scores.likeness = scores.likeness || 0;
    scores.transformation = scores.transformation || 0;
    scores.integration = scores.integration || 0;
    scores.medium = scores.medium || 0;
    scores.wow = scores.wow || 0;

    const avg = (
      (scores.likeness + scores.transformation + scores.integration + scores.medium + scores.wow) /
      5
    ).toFixed(1);

    console.log(
      `  Scores: like=${scores.likeness} trans=${scores.transformation} integ=${scores.integration} med=${scores.medium} wow=${scores.wow} | AVG=${avg}`
    );
    console.log(`  Notes: ${scores.notes}`);
    console.log();

    // Save dream
    await sb.from('uploads').insert({
      user_id: KEVIN_ID,
      categories: ['art'],
      image_url: imageUrl,
      ai_prompt: promptUsed,
      dream_medium: mediumKey,
      dream_vibe: vibeKey,
      bot_message: `[${engine}] ${castMember.role}|avg=${avg}`,
      is_approved: true,
      is_active: true,
    });

    results.push({
      role: castMember.role,
      medium: mediumKey,
      vibe: vibeKey,
      category,
      ...scores,
      avg: parseFloat(avg),
      prompt: promptUsed,
    });
  }

  // Summary
  console.log('\n══════════════════════════════════════');
  console.log('SUMMARY');
  console.log('══════════════════════════════════════\n');

  if (results.length === 0) {
    console.log('No results.');
    return;
  }

  const avgAll = (results.reduce((a, r) => a + r.avg, 0) / results.length).toFixed(1);
  console.log(`Overall average: ${avgAll}/5.0 across ${results.length} dreams\n`);

  // Best and worst
  results.sort((a, b) => b.avg - a.avg);
  console.log(
    'BEST:',
    results[0].medium,
    '|',
    results[0].vibe,
    '|',
    results[0].role,
    `(${results[0].avg})`,
    '-',
    results[0].notes?.slice(0, 80)
  );
  console.log(
    'WORST:',
    results[results.length - 1].medium,
    '|',
    results[results.length - 1].vibe,
    '|',
    results[results.length - 1].role,
    `(${results[results.length - 1].avg})`,
    '-',
    results[results.length - 1].notes?.slice(0, 80)
  );

  // Patterns
  console.log('\nBy dimension (avg):');
  const dims = ['likeness', 'transformation', 'integration', 'medium', 'wow'];
  for (const dim of dims) {
    const avg = (results.reduce((a, r) => a + (r[dim] || 0), 0) / results.length).toFixed(1);
    console.log(`  ${dim}: ${avg}/5`);
  }

  // By medium
  console.log('\nBy medium:');
  const byMedium = {};
  for (const r of results) {
    if (!byMedium[r.medium]) byMedium[r.medium] = [];
    byMedium[r.medium].push(r.avg);
  }
  Object.entries(byMedium)
    .sort(
      (a, b) =>
        b[1].reduce((x, y) => x + y, 0) / b[1].length -
        a[1].reduce((x, y) => x + y, 0) / a[1].length
    )
    .forEach(([m, scores]) =>
      console.log(
        `  ${m}: ${(scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)} (${scores.length} dreams)`
      )
    );

  // By role
  console.log('\nBy cast role:');
  const byRole = {};
  for (const r of results) {
    if (!byRole[r.role]) byRole[r.role] = [];
    byRole[r.role].push(r.avg);
  }
  Object.entries(byRole).forEach(([role, scores]) =>
    console.log(
      `  ${role}: ${(scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)} (${scores.length} dreams)`
    )
  );

  // Problems to fix
  const lowTrans = results.filter((r) => r.transformation <= 2);
  const lowInteg = results.filter((r) => r.integration <= 2);
  const lowMedium = results.filter((r) => r.medium <= 2);
  if (lowTrans.length)
    console.log(
      `\n⚠️ ${lowTrans.length} dreams had weak transformation (looked like original photo)`
    );
  if (lowInteg.length)
    console.log(`⚠️ ${lowInteg.length} dreams had poor integration (person looked pasted on)`);
  if (lowMedium.length) console.log(`⚠️ ${lowMedium.length} dreams had wrong art style`);

  console.log('\nDone! Check the app for results.');
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
