#!/usr/bin/env node

/**
 * test-distant-faceswap.js — POC: separated positioning double face swap
 *
 * Same crop→swap→paste pipeline but the two people are NOT standing together.
 * They're in distinct left/right positions with real distance between them.
 *
 * Usage:  node scripts/test-distant-faceswap.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://jimftynwrinwenonjrlj.supabase.co';
const sb = createClient(SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const REPLICATE = process.env.REPLICATE_API_TOKEN;
const USER_ID = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';
const OUT_DIR = '/tmp/distant-faceswap';
const FACE_SWAP_VERSION = '278a81e7ebb22db98bcba54de985d22cc1abeead2754eb1f2af717247be69b34';

// ── Replicate helpers ───────────────────────────────────────────────────────

async function replicateGenerate(prompt) {
  const res = await fetch(
    'https://api.replicate.com/v1/models/black-forest-labs/flux-dev/predictions',
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${REPLICATE}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: { prompt, aspect_ratio: '9:16', output_format: 'jpg', output_quality: 90 },
      }),
    }
  );
  const pred = await res.json();
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 1500));
    const poll = await fetch(`https://api.replicate.com/v1/predictions/${pred.id}`, {
      headers: { Authorization: `Bearer ${REPLICATE}` },
    });
    const data = await poll.json();
    if (data.status === 'succeeded') {
      return Array.isArray(data.output) ? data.output[0] : data.output;
    }
    if (data.status === 'failed') throw new Error(`Generation failed: ${data.error}`);
    process.stdout.write('.');
  }
  throw new Error('Generation timed out');
}

async function faceSwapWithBuffer(sourceUrl, targetBuffer) {
  const b64 = `data:image/jpeg;base64,${targetBuffer.toString('base64')}`;
  const res = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${REPLICATE}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      version: FACE_SWAP_VERSION,
      input: { swap_image: sourceUrl, input_image: b64 },
    }),
  });
  const pred = await res.json();
  if (!pred.id) throw new Error(`No prediction ID: ${JSON.stringify(pred).slice(0, 200)}`);
  for (let i = 0; i < 45; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const poll = await fetch(`https://api.replicate.com/v1/predictions/${pred.id}`, {
      headers: { Authorization: `Bearer ${REPLICATE}` },
    });
    const data = await poll.json();
    if (data.status === 'succeeded') {
      return typeof data.output === 'string' ? data.output : data.output?.[0];
    }
    if (data.status === 'failed') throw new Error(`Face swap failed: ${data.error}`);
    process.stdout.write('.');
  }
  throw new Error('Face swap timed out');
}

async function downloadBuffer(url) {
  const res = await fetch(url);
  return Buffer.from(await res.arrayBuffer());
}

async function persistBufferAndPost(buf, caption, prompt) {
  const fn = `${USER_ID}/${Date.now()}_${Math.random().toString(36).slice(2, 6)}.jpg`;
  await sb.storage.from('uploads').upload(fn, buf, { contentType: 'image/jpeg' });
  const { data: pub } = sb.storage.from('uploads').getPublicUrl(fn);
  const { error } = await sb.from('uploads').insert({
    user_id: USER_ID,
    image_url: pub.publicUrl,
    caption,
    ai_prompt: prompt.slice(0, 500),
    dream_medium: 'watercolor',
    dream_vibe: 'cinematic',
    is_public: false,
    width: 768,
    height: 1344,
  });
  if (error) console.error('   Post error:', error.message);
  else console.log(`   📱 Posted: ${caption}`);
}

// ── Crop → swap → paste ────────────────────────────────────────────────────

async function cropSwapPaste(baseBuf, selfThumbUrl, plusThumbUrl) {
  const meta = await sharp(baseBuf).metadata();
  const W = meta.width;
  const H = meta.height;
  const midX = Math.round(W * 0.5);

  const leftW = Math.round(W * 0.55);
  const leftCrop = await sharp(baseBuf)
    .extract({ left: 0, top: 0, width: leftW, height: H })
    .jpeg({ quality: 95 })
    .toBuffer();

  const rightStart = Math.round(W * 0.45);
  const rightW = W - rightStart;
  const rightCrop = await sharp(baseBuf)
    .extract({ left: rightStart, top: 0, width: rightW, height: H })
    .jpeg({ quality: 95 })
    .toBuffer();

  console.log('   🔄 Swapping self → left crop...');
  const leftSwapUrl = await faceSwapWithBuffer(selfThumbUrl, leftCrop);
  let leftSwapBuf = await downloadBuffer(leftSwapUrl);
  leftSwapBuf = await sharp(leftSwapBuf)
    .resize(leftW, H, { fit: 'fill' })
    .jpeg({ quality: 95 })
    .toBuffer();

  console.log('   🔄 Swapping plus_one → right crop...');
  const rightSwapUrl = await faceSwapWithBuffer(plusThumbUrl, rightCrop);
  let rightSwapBuf = await downloadBuffer(rightSwapUrl);
  rightSwapBuf = await sharp(rightSwapBuf)
    .resize(rightW, H, { fit: 'fill' })
    .jpeg({ quality: 95 })
    .toBuffer();

  const leftHalf = await sharp(leftSwapBuf)
    .extract({ left: 0, top: 0, width: midX, height: H })
    .jpeg({ quality: 95 })
    .toBuffer();

  const rightHalfOffset = midX - rightStart;
  const rightHalf = await sharp(rightSwapBuf)
    .extract({ left: rightHalfOffset, top: 0, width: W - midX, height: H })
    .jpeg({ quality: 95 })
    .toBuffer();

  const stitched = await sharp({
    create: { width: W, height: H, channels: 3, background: { r: 0, g: 0, b: 0 } },
  })
    .composite([
      { input: leftHalf, left: 0, top: 0 },
      { input: rightHalf, left: midX, top: 0 },
    ])
    .jpeg({ quality: 95 })
    .toBuffer();

  console.log('   ✅ Both faces swapped and stitched');
  return stitched;
}

// ── Composition rules — separated, not standing together ────────────────────

const SEPARATED_RULES = `
MANDATORY COMPOSITION:
- Exactly two people in the scene.
- Person A is positioned in the LEFT portion of the frame.
- Person B is positioned in the RIGHT portion of the frame.
- They are NOT standing next to each other — real physical distance between them.
- Both faces at least three-quarter view toward camera. No full profiles, no faces turned away.
- All facial features (eyes, nose, mouth) must be clearly visible on BOTH people.
- Sharp focus on both faces, even lighting across both.
- No face overlap, no obstructions blocking either face.`;

function extractPhysicalTraits(description) {
  const traits = [];
  // Hair — try color-first, then length-first, then any mention
  const hairMatch = description.match(/((?:rich |light |dark )?[a-z\-]+\s*(?:brown|blonde|black|red|auburn|gray|grey|dark|light|sandy|chestnut|golden)[a-z\-]*\s+hair[^,.]*)/i);
  if (hairMatch) traits.push(hairMatch[1].trim());
  const hairLength = description.match(/(shoulder[- ]length|short|medium[- ]length|long|waist[- ]length|chin[- ]length)/i);
  if (hairLength && hairMatch && !hairMatch[0].toLowerCase().includes(hairLength[0].toLowerCase())) {
    traits.push(hairLength[1].trim() + ' hair length');
  } else if (!hairMatch) {
    const hairAlt = description.match(/((?:short|medium|long|shoulder[- ]length|curly|wavy|straight)[^,.]* hair[^,.]*)/i);
    if (hairAlt) traits.push(hairAlt[1].trim());
  }
  // Facial hair
  const beardMatch = description.match(/((?:full|trimmed|short|thick|thin|well-groomed|neat)[^,.]*beard[^,.]*)/i);
  if (beardMatch) traits.push(beardMatch[1].trim());
  const stacheMatch = description.match(/((?:full|trimmed|thin|thick)[^,.]*mustache[^,.]*)/i);
  if (stacheMatch) traits.push(stacheMatch[1].trim());
  // Skin tone
  const skinMatch = description.match(/((?:fair|light|medium|olive|tan|dark|brown|deep|warm|cool)[^,.]*(?:skin|complexion)[^,.]*)/i);
  if (skinMatch) traits.push(skinMatch[1].trim());
  // Age
  const ageMatch = description.match(/((?:mid-|early |late )?\d0s|\d+-\d+ years old|approximately \d+)/i);
  if (ageMatch) traits.push(ageMatch[0].trim());
  // Build
  const buildMatch = description.match(/((?:athletic|slim|stocky|muscular|petite|average|solid|broad)[^,.]*build[^,.]*)/i);
  if (buildMatch) traits.push(buildMatch[1].trim());
  // Eye color
  const eyeMatch = description.match(/((?:brown|blue|green|hazel|gray|grey|greenish|amber|dark|light|clear)[^,.]*eyes[^,.]*)/i)
    || description.match(/eyes\s+with\s+a\s+((?:greenish|brownish|bluish|warm|cool|dark|light)[^,.]*tone)/i);
  if (eyeMatch) traits.push(eyeMatch[1].trim());

  return traits.join('. ');
}

function buildPrompt(scene, selfDesc, plusDesc) {
  const selfTraits = extractPhysicalTraits(selfDesc);
  const plusTraits = extractPhysicalTraits(plusDesc);

  return `${scene}

PERSON A (left, a man): ${selfDesc}
CRITICAL — Person A MUST have: ${selfTraits}. Do NOT make him bald, clean-shaven, or change his hair color.

PERSON B (right, a woman): ${plusDesc}
CRITICAL — Person B MUST have: ${plusTraits}. Do NOT change her hair color, length, or style.
${SEPARATED_RULES}

Portrait 9:16, photorealistic, DSLR quality, natural skin texture.`;
}

// ── Test scenes — people far apart in interesting compositions ───────────────

const SCENES = [
  {
    name: 'Campfire in the mountains — across the fire',
    scene: `Two people at a remote mountain campfire at dusk. The man sits on a log on the LEFT side of the fire, holding a tin mug of coffee, wearing a flannel shirt and hiking boots, backpack beside him. The woman sits on a camp chair on the RIGHT side of the fire, wrapped in a wool blanket, roasting a marshmallow on a stick. The campfire crackles between them. Snow-capped peaks in the background, purple twilight sky with early stars, warm orange firelight on their faces. Peaceful wilderness isolation.`,
  },
  {
    name: 'Bookshop — different floors',
    scene: `A charming two-story old bookshop with a wrought iron spiral staircase in the center. The man is on the LEFT side of the ground floor, leaning against a bookshelf reading an open hardcover, wearing a cable-knit sweater with sleeves pushed up. The woman is on the RIGHT side on the mezzanine level above, sitting on the iron railing with legs dangling, holding a paperback, wearing an oversized cardigan and reading glasses. Towering shelves stuffed with books, warm pendant lamps, afternoon light through dusty windows. Cozy literary atmosphere.`,
  },
  {
    name: 'Poolside at a luxury villa',
    scene: `A stunning infinity pool at a Mediterranean cliffside villa at sunset. The man is on the LEFT side, sitting on the pool edge with feet in the water, wearing swim trunks and sunglasses pushed up on his forehead, a cocktail in hand. The woman is on the RIGHT side, lounging on a poolside daybed under a white canopy, wearing a flowing cover-up and wide sun hat, reading a magazine. Azure sea and rocky coastline behind the infinity edge. Warm golden hour light, luxury vacation atmosphere, Mediterranean blues and whites.`,
  },
  {
    name: 'Train platform — waiting on benches',
    scene: `A picturesque European train station platform on a foggy morning. The man sits on an old wooden bench on the LEFT side, wearing a peacoat and leather satchel at his feet, checking a pocket watch. The woman stands by a luggage cart on the RIGHT side, wearing a long wool coat and beret, holding a vintage suitcase, looking down the tracks. Ornate iron pillars and a glass canopy overhead, fog rolling across the platform, a distant train headlight approaching. Moody cinematic atmosphere, cool blue-grey tones with warm lamp accents.`,
  },
  {
    name: 'Night market in Marrakech',
    scene: `A vibrant Moroccan night market (souk) with colorful hanging lanterns and textiles. The man is on the LEFT side, haggling at a spice stall piled with pyramids of colorful spices, wearing a linen shirt with rolled sleeves. The woman is on the RIGHT side at a jewelry vendor's table, holding up an ornate silver necklace to examine it, wearing a flowing maxi dress. Crowded market lane between them with other shoppers blurred in the background. Warm golden lantern light, rich saturated colors, exotic bustling energy.`,
  },
];

// ── Main ────────────────────────────────────────────────────────────────────

(async () => {
  try {
    fs.mkdirSync(OUT_DIR, { recursive: true });
    const t0 = Date.now();

    console.log('Loading dream cast...');
    const { data: recipeRow } = await sb
      .from('user_recipes')
      .select('recipe')
      .eq('user_id', USER_ID)
      .single();
    const cast = recipeRow.recipe.dream_cast || [];
    const selfCast = cast.find((m) => m.role === 'self');
    const plusCast = cast.find((m) => m.role === 'plus_one');

    if (!selfCast?.thumb_url || !plusCast?.thumb_url || !selfCast?.description || !plusCast?.description) {
      console.error('Need both cast members with thumb photos and descriptions');
      process.exit(1);
    }

    const selfDesc = selfCast.description.split('\n').slice(0, 3).join(', ').slice(0, 200);
    const plusDesc = plusCast.description.split('\n').slice(0, 3).join(', ').slice(0, 200);
    console.log('  Self:', selfDesc.slice(0, 80));
    console.log('  Plus:', plusDesc.slice(0, 80));

    let idx = 0;
    for (const { name, scene } of SCENES) {
      idx++;
      const label = String(idx).padStart(2, '0');
      console.log(`\n${'═'.repeat(60)}`);
      console.log(`${label}/${SCENES.length}: ${name}`);
      console.log('═'.repeat(60));

      const prompt = buildPrompt(scene, selfDesc, plusDesc);

      process.stdout.write('   Generating');
      const baseUrl = await replicateGenerate(prompt);
      console.log('');
      const baseBuf = await downloadBuffer(baseUrl);
      fs.writeFileSync(path.join(OUT_DIR, `${label}_base.jpg`), baseBuf);
      await persistBufferAndPost(baseBuf, `[DIST] ${label}a — ${name} (base)`, prompt);

      try {
        const result = await cropSwapPaste(baseBuf, selfCast.thumb_url, plusCast.thumb_url);
        fs.writeFileSync(path.join(OUT_DIR, `${label}_swapped.jpg`), result);
        await persistBufferAndPost(result, `[DIST] ${label}b — ${name} (swapped)`, prompt);
      } catch (err) {
        console.error(`   ❌ Swap failed: ${err.message}`);
      }

      const elapsed = ((Date.now() - t0) / 1000).toFixed(0);
      console.log(`   ⏱ Running total: ${elapsed}s`);
    }

    const elapsed = ((Date.now() - t0) / 1000).toFixed(0);
    console.log(`\n${'═'.repeat(60)}`);
    console.log(`DONE — ${SCENES.length} scenes in ${elapsed}s`);
    console.log(`${SCENES.length * 2} posts to your feed`);
    console.log(`Output: ${OUT_DIR}`);
  } catch (err) {
    console.error('❌ Fatal:', err.message);
    console.error(err.stack);
    process.exit(1);
  }
})();
