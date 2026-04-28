#!/usr/bin/env node

/**
 * test-sidebyside-faceswap.js — POC: forced side-by-side double face swap
 *
 * Tests whether forcing side-by-side composition + crop→swap→paste
 * reliably handles double face swap across varied/complex prompts.
 *
 * Every prompt gets the same composition injection:
 *   - Left/right positioning, clear separation, both faces front-facing
 *   - Cast descriptions as body templates
 *
 * Usage:  node scripts/test-sidebyside-faceswap.js
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
const OUT_DIR = '/tmp/sidebyside-faceswap';
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

  // Left crop: left 55% (overlaps center slightly for margin)
  const leftW = Math.round(W * 0.55);
  const leftCrop = await sharp(baseBuf)
    .extract({ left: 0, top: 0, width: leftW, height: H })
    .jpeg({ quality: 95 })
    .toBuffer();

  // Right crop: right 55% (overlaps center slightly for margin)
  const rightStart = Math.round(W * 0.45);
  const rightW = W - rightStart;
  const rightCrop = await sharp(baseBuf)
    .extract({ left: rightStart, top: 0, width: rightW, height: H })
    .jpeg({ quality: 95 })
    .toBuffer();

  // Swap self onto left crop
  console.log('   🔄 Swapping self → left crop...');
  const leftSwapUrl = await faceSwapWithBuffer(selfThumbUrl, leftCrop);
  let leftSwapBuf = await downloadBuffer(leftSwapUrl);
  leftSwapBuf = await sharp(leftSwapBuf)
    .resize(leftW, H, { fit: 'fill' })
    .jpeg({ quality: 95 })
    .toBuffer();

  // Swap plus_one onto right crop
  console.log('   🔄 Swapping plus_one → right crop...');
  const rightSwapUrl = await faceSwapWithBuffer(plusThumbUrl, rightCrop);
  let rightSwapBuf = await downloadBuffer(rightSwapUrl);
  rightSwapBuf = await sharp(rightSwapBuf)
    .resize(rightW, H, { fit: 'fill' })
    .jpeg({ quality: 95 })
    .toBuffer();

  // Take left half from left-swapped, right half from right-swapped
  const leftHalf = await sharp(leftSwapBuf)
    .extract({ left: 0, top: 0, width: midX, height: H })
    .jpeg({ quality: 95 })
    .toBuffer();

  const rightHalfOffset = midX - rightStart;
  const rightHalf = await sharp(rightSwapBuf)
    .extract({ left: rightHalfOffset, top: 0, width: W - midX, height: H })
    .jpeg({ quality: 95 })
    .toBuffer();

  // Stitch
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

// ── Composition injection ───────────────────────────────────────────────────

const SIDE_BY_SIDE_RULES = `
MANDATORY COMPOSITION (override all other positioning):
- Exactly two people in the scene.
- Person A stands on the LEFT side of the frame.
- Person B stands on the RIGHT side of the frame.
- Clear gap between them — no overlapping bodies or faces.
- Both faces fully visible, angled toward camera.
- Medium shot, waist-up minimum.
- Sharp focus on both faces, even lighting across both.
- No motion blur on faces.`;

function buildPrompt(scene, selfDesc, plusDesc) {
  return `${scene}

PERSON A (left, a man): ${selfDesc}
PERSON B (right, a woman): ${plusDesc}
${SIDE_BY_SIDE_RULES}

Portrait 9:16, photorealistic, DSLR quality, natural skin texture.`;
}

// ── Test scenes ─────────────────────────────────────────────────────────────

const SCENES = [
  {
    name: 'Wizard & witch in a magical library',
    scene: `A couple dressed as fantasy characters in a grand magical library. Towering bookshelves filled with glowing tomes, floating candles, swirling magical dust motes, stained glass windows casting colored light. He wears dark wizard robes with silver embroidery and holds an ornate staff. She wears an emerald witch's cloak with golden clasps, a spell book tucked under her arm. Mystical purple-blue atmosphere, dramatic chiaroscuro lighting.`,
  },
  {
    name: 'Neon-lit Tokyo street at night',
    scene: `A couple walking through a rain-soaked Tokyo alley at night, surrounded by dense neon signage in Japanese and holographic advertisements. Puddles reflect pink and cyan neon. He wears a black leather jacket and dark jeans. She wears an oversized vintage bomber jacket and combat boots. Cyberpunk atmosphere, lens flare from neon, steam rising from grates, moody cinematic feel, Blade Runner vibes.`,
  },
  {
    name: 'Viking feast in a great hall',
    scene: `A couple at a roaring Viking feast inside a massive timber great hall. Long wooden tables loaded with roasted meat, mead goblets, furs draped everywhere, a fire pit blazing in the center, antler chandeliers overhead, warriors celebrating around them. He wears leather and chainmail with a fur-trimmed cloak, a battle axe resting on the table. She wears layered Viking dress with a braided leather belt and bone necklace. Warm firelight, smoky atmosphere, epic scale.`,
  },
  {
    name: 'Underwater fantasy in coral reef',
    scene: `A couple floating in a magical underwater coral reef scene, surrounded by bioluminescent jellyfish, colorful tropical fish, towering coral formations in electric blues, purples, and oranges. Shafts of sunlight pierce down from the surface above. He wears an ornate underwater warrior's armor with flowing seaweed cape. She wears a shimmering iridescent gown that floats and ripples like a jellyfish. Ethereal aquatic lighting, dreamlike and surreal, volumetric light rays through water.`,
  },
  {
    name: 'Jazz club in 1920s Harlem',
    scene: `A glamorous couple at a smoky 1920s jazz club in Harlem. A saxophone player on a small stage behind them, dim amber spotlights, dark wood paneling, velvet curtains, cocktails on a round table between them. He wears a sharp pinstripe three-piece suit with a fedora tipped back. She wears a beaded flapper dress with a feathered headband and long pearl necklace. Art deco details everywhere, warm golden tones, intimate smoky atmosphere, film noir lighting.`,
  },
  {
    name: 'Astronauts on Mars base',
    scene: `A couple standing outside a futuristic Mars colony base, rusty red Martian landscape stretching to the horizon, multiple domed habitats behind them, Earth visible as a tiny blue dot in the dusty pink sky. He wears a rugged space suit with the helmet retracted, mission patches on the chest. She wears a sleek modern space suit with a transparent visor flipped up, a tablet in one hand. Harsh directional sunlight casting long shadows, sci-fi grandeur, desolate beauty.`,
  },
  {
    name: 'Enchanted autumn forest with lanterns',
    scene: `A couple standing on an ancient stone bridge over a crystal stream in an enchanted autumn forest. Hundreds of floating paper lanterns drift through the canopy, casting warm amber light. Massive ancient trees with red, gold, and orange leaves. Fireflies and falling leaves swirl around them. He wears a cozy dark wool coat and scarf. She wears a flowing burgundy dress with a knit cardigan. Magical golden hour light, mist rising from the stream, storybook atmosphere.`,
  },
];

// ── Main ────────────────────────────────────────────────────────────────────

(async () => {
  try {
    fs.mkdirSync(OUT_DIR, { recursive: true });
    const t0 = Date.now();

    // Load cast
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

      // Generate
      process.stdout.write('   Generating');
      const baseUrl = await replicateGenerate(prompt);
      console.log('');
      const baseBuf = await downloadBuffer(baseUrl);
      fs.writeFileSync(path.join(OUT_DIR, `${label}_base.jpg`), baseBuf);
      await persistBufferAndPost(baseBuf, `[SBS] ${label}a — ${name} (base)`, prompt);

      // Crop → swap → paste
      try {
        const result = await cropSwapPaste(baseBuf, selfCast.thumb_url, plusCast.thumb_url);
        fs.writeFileSync(path.join(OUT_DIR, `${label}_swapped.jpg`), result);
        await persistBufferAndPost(result, `[SBS] ${label}b — ${name} (swapped)`, prompt);
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
