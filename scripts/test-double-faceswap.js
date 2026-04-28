#!/usr/bin/env node

/**
 * test-double-faceswap.js — Two-person face swap experiment
 *
 * Tests two approaches for swapping both faces in a two-person scene:
 *   A) Naive sequential: swap self → swap plus_one on result (may hit wrong face)
 *   B) Crop→swap→paste: crop each half, swap individually, stitch back (deterministic)
 *
 * Posts all results (base, approach A, approach B) to Kevin's feed for phone review.
 *
 * Usage:  node scripts/test-double-faceswap.js
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
const OUT_DIR = '/tmp/double-faceswap-test';
const FACE_SWAP_VERSION = '278a81e7ebb22db98bcba54de985d22cc1abeead2754eb1f2af717247be69b34';

// ── Replicate helpers ───────────────────────────────────────────────────────

async function replicateGenerate(prompt) {
  console.log('\n🎨 Generating scene with Flux Dev...');
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
      const url = Array.isArray(data.output) ? data.output[0] : data.output;
      console.log('   ✅ Image generated');
      return url;
    }
    if (data.status === 'failed') throw new Error(`Generation failed: ${data.error}`);
    process.stdout.write('.');
  }
  throw new Error('Generation timed out');
}

async function faceSwap(sourceUrl, targetUrl, label) {
  console.log(`   🔄 Face swap: ${label}...`);
  const res = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${REPLICATE}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      version: FACE_SWAP_VERSION,
      input: { swap_image: sourceUrl, input_image: targetUrl },
    }),
  });
  const pred = await res.json();
  if (!pred.id) throw new Error('No prediction ID');
  for (let i = 0; i < 45; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const poll = await fetch(`https://api.replicate.com/v1/predictions/${pred.id}`, {
      headers: { Authorization: `Bearer ${REPLICATE}` },
    });
    const data = await poll.json();
    if (data.status === 'succeeded') {
      const url = typeof data.output === 'string' ? data.output : data.output?.[0];
      console.log(`   ✅ ${label} done`);
      return url;
    }
    if (data.status === 'failed') throw new Error(`Face swap failed: ${data.error}`);
    process.stdout.write('.');
  }
  throw new Error('Face swap timed out');
}

// Face swap using a base64 data URL as target (for cropped images)
async function faceSwapWithBuffer(sourceUrl, targetBuffer, label) {
  const b64 = `data:image/jpeg;base64,${targetBuffer.toString('base64')}`;
  console.log(`   🔄 Face swap (crop): ${label}...`);
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
      const url = typeof data.output === 'string' ? data.output : data.output?.[0];
      console.log(`   ✅ ${label} done`);
      return url;
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

async function persistAndPost(imageUrl, caption, prompt) {
  const buf = await downloadBuffer(imageUrl);
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
  return pub.publicUrl;
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
  return pub.publicUrl;
}

// ── Main ────────────────────────────────────────────────────────────────────

(async () => {
  try {
    fs.mkdirSync(OUT_DIR, { recursive: true });
    const t0 = Date.now();

    // 1. Load cast
    console.log('Loading dream cast...');
    const { data: recipeRow } = await sb
      .from('user_recipes')
      .select('recipe')
      .eq('user_id', USER_ID)
      .single();
    const cast = recipeRow.recipe.dream_cast || [];
    const selfCast = cast.find((m) => m.role === 'self');
    const plusCast = cast.find((m) => m.role === 'plus_one');

    if (!selfCast?.thumb_url || !plusCast?.thumb_url) {
      console.error('Need both self and plus_one with thumb photos');
      process.exit(1);
    }
    if (!selfCast?.description || !plusCast?.description) {
      console.error('Need both cast members to have descriptions');
      process.exit(1);
    }

    const selfDesc = selfCast.description.split('\n').slice(0, 3).join(', ').slice(0, 200);
    const plusDesc = plusCast.description.split('\n').slice(0, 3).join(', ').slice(0, 200);
    console.log('  Self:', selfDesc.slice(0, 80));
    console.log('  Plus:', plusDesc.slice(0, 80));

    // 2. Generate base scene — descriptions as template, strict left/right composition
    const scenePrompt = `Photorealistic photo of two people relaxing on a beautiful tropical beach, holding margarita cocktails.

LEFT PERSON (a man): ${selfDesc}. Wearing a casual linen shirt, relaxed posture.
RIGHT PERSON (a woman): ${plusDesc}. Wearing a light sundress, holding a margarita.

COMPOSITION RULES:
- Two people only, clear separation, no overlap.
- LEFT person on the left third, RIGHT person on the right third.
- Both faces fully visible, looking toward camera, natural smiles.
- Medium shot, waist-up framing.
- Sharp focus on both faces, even lighting.
- Golden hour warm light, turquoise ocean, white sand background.
- Both people relaxed and happy.

Portrait 9:16, DSLR quality, natural skin texture, 35mm lens.`;

    console.log('\n📝 Prompt:', scenePrompt.slice(0, 200), '...');

    const baseUrl = await replicateGenerate(scenePrompt);
    const baseBuf = await downloadBuffer(baseUrl);
    fs.writeFileSync(path.join(OUT_DIR, '00_base.jpg'), baseBuf);

    // Post base scene
    await persistAndPost(baseUrl, '[FACESWAP TEST] 00 — Base scene (no swap)', scenePrompt);

    // Get image dimensions
    const meta = await sharp(baseBuf).metadata();
    const W = meta.width;
    const H = meta.height;
    console.log(`\n📐 Image: ${W}x${H}`);

    // ═══════════════════════════════════════════════════════════════════════
    // APPROACH A: Naive sequential swap
    // ═══════════════════════════════════════════════════════════════════════
    console.log('\n══ APPROACH A: Naive sequential swap ══');

    // Swap self first
    const afterSelfUrl = await faceSwap(selfCast.thumb_url, baseUrl, 'self → base');
    const afterSelfBuf = await downloadBuffer(afterSelfUrl);
    fs.writeFileSync(path.join(OUT_DIR, '01_naive_self.jpg'), afterSelfBuf);
    await persistAndPost(afterSelfUrl, '[FACESWAP TEST] 01 — Naive: self swapped', scenePrompt);

    // Swap plus_one onto result of self swap
    const afterBothNaiveUrl = await faceSwap(
      plusCast.thumb_url,
      afterSelfUrl,
      'plus_one → after-self'
    );
    const afterBothNaiveBuf = await downloadBuffer(afterBothNaiveUrl);
    fs.writeFileSync(path.join(OUT_DIR, '02_naive_both.jpg'), afterBothNaiveBuf);
    await persistAndPost(
      afterBothNaiveUrl,
      '[FACESWAP TEST] 02 — Naive: both swapped (sequential)',
      scenePrompt
    );

    // ═══════════════════════════════════════════════════════════════════════
    // APPROACH B: Crop → swap → paste
    // ═══════════════════════════════════════════════════════════════════════
    console.log('\n══ APPROACH B: Crop → swap → paste ══');

    // Crop left 55% (overlap in middle for blending margin)
    const leftW = Math.round(W * 0.55);
    const rightStart = Math.round(W * 0.45);
    const rightW = W - rightStart;

    console.log(`   Cropping: left=${leftW}px, right starts at ${rightStart}px (${rightW}px wide)`);

    const leftCropBuf = await sharp(baseBuf).extract({ left: 0, top: 0, width: leftW, height: H }).jpeg({ quality: 95 }).toBuffer();
    const rightCropBuf = await sharp(baseBuf).extract({ left: rightStart, top: 0, width: rightW, height: H }).jpeg({ quality: 95 }).toBuffer();

    fs.writeFileSync(path.join(OUT_DIR, '03_crop_left.jpg'), leftCropBuf);
    fs.writeFileSync(path.join(OUT_DIR, '04_crop_right.jpg'), rightCropBuf);

    // Face swap self onto left crop (only one face visible)
    const leftSwappedUrl = await faceSwapWithBuffer(
      selfCast.thumb_url,
      leftCropBuf,
      'self → left crop'
    );
    const leftSwappedBuf = await downloadBuffer(leftSwappedUrl);
    fs.writeFileSync(path.join(OUT_DIR, '05_left_swapped.jpg'), leftSwappedBuf);

    // Face swap plus_one onto right crop (only one face visible)
    const rightSwappedUrl = await faceSwapWithBuffer(
      plusCast.thumb_url,
      rightCropBuf,
      'plus_one → right crop'
    );
    const rightSwappedBuf = await downloadBuffer(rightSwappedUrl);
    fs.writeFileSync(path.join(OUT_DIR, '06_right_swapped.jpg'), rightSwappedBuf);

    // Resize swapped crops back to original crop dimensions (model may resize)
    const leftResized = await sharp(leftSwappedBuf).resize(leftW, H, { fit: 'fill' }).jpeg({ quality: 95 }).toBuffer();
    const rightResized = await sharp(rightSwappedBuf).resize(rightW, H, { fit: 'fill' }).jpeg({ quality: 95 }).toBuffer();

    // Create gradient blend mask for the overlap zone (10% of width)
    const overlapW = leftW - rightStart; // overlap region width
    const blendPoint = rightStart; // where right crop starts

    // Simple stitch: take left half from left-swapped, right half from right-swapped
    // Hard cut at the midpoint
    const midX = Math.round(W * 0.5);

    const leftHalf = await sharp(leftResized)
      .extract({ left: 0, top: 0, width: midX, height: H })
      .jpeg({ quality: 95 })
      .toBuffer();

    const rightHalfOffset = midX - rightStart; // offset within the right crop
    const rightHalf = await sharp(rightResized)
      .extract({ left: rightHalfOffset, top: 0, width: W - midX, height: H })
      .jpeg({ quality: 95 })
      .toBuffer();

    // Stitch them together
    const stitched = await sharp({
      create: { width: W, height: H, channels: 3, background: { r: 0, g: 0, b: 0 } },
    })
      .composite([
        { input: leftHalf, left: 0, top: 0 },
        { input: rightHalf, left: midX, top: 0 },
      ])
      .jpeg({ quality: 95 })
      .toBuffer();

    fs.writeFileSync(path.join(OUT_DIR, '07_crop_paste_both.jpg'), stitched);
    await persistBufferAndPost(
      stitched,
      '[FACESWAP TEST] 03 — Crop+paste: both swapped (deterministic)',
      scenePrompt
    );

    // ═══════════════════════════════════════════════════════════════════════
    // Summary
    // ═══════════════════════════════════════════════════════════════════════
    const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
    console.log('\n════════════════════════════════════════');
    console.log(`DONE in ${elapsed}s`);
    console.log('════════════════════════════════════════');
    console.log(`Output: ${OUT_DIR}`);
    console.log('Posts:');
    console.log('  00 — Base scene (no swap)');
    console.log('  01 — Naive: self swapped only');
    console.log('  02 — Naive: both swapped (sequential, may hit wrong face)');
    console.log('  03 — Crop+paste: both swapped (deterministic)');
    console.log('\nCheck your dreams in the app!');
  } catch (err) {
    console.error('❌ Error:', err.message);
    console.error(err.stack);
    process.exit(1);
  }
})();
