#!/usr/bin/env node

/**
 * test-smart-faceswap.js — Smart two-person face swap with embedding matching
 *
 * Pipeline:
 *   1. Flux Dev generates scene using cast descriptions as template
 *   2. face-api.js detects all faces in rendered image → bounding boxes + embeddings
 *   3. Compare each detected face embedding against self + plus_one source photos
 *   4. Match each face to the correct cast member (cosine similarity)
 *   5. Crop matched face region → face swap → paste back
 *
 * Tests multiple prompts including non-side-by-side compositions.
 *
 * Usage:  node scripts/test-smart-faceswap.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const sharp = require('sharp');
const faceapi = require('@vladmandic/face-api');
const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = (() => {
  try {
    return require('canvas');
  } catch {
    return { createCanvas: null, loadImage: null };
  }
})();

const SUPABASE_URL = 'https://jimftynwrinwenonjrlj.supabase.co';
const sb = createClient(SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const REPLICATE = process.env.REPLICATE_API_TOKEN;
const USER_ID = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';
const OUT_DIR = '/tmp/smart-faceswap-test';
const FACE_SWAP_VERSION = '278a81e7ebb22db98bcba54de985d22cc1abeead2754eb1f2af717247be69b34';

// ── Face-api setup ──────────────────────────────────────────────────────────

const MODEL_PATH = path.join(
  __dirname,
  '../node_modules/@vladmandic/face-api/model'
);

async function initFaceApi() {
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_PATH);
  await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_PATH);
  await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_PATH);
  console.log('   Face-api models loaded');
}

async function bufferToTensor(buf) {
  const decoded = tf.node.decodeImage(buf, 3);
  return decoded;
}

async function detectFaces(imageBuf) {
  const tensor = await bufferToTensor(imageBuf);
  const detections = await faceapi
    .detectAllFaces(tensor, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.3 }))
    .withFaceLandmarks()
    .withFaceDescriptors();
  tensor.dispose();
  return detections;
}

async function getFaceEmbedding(imageUrl) {
  const res = await fetch(imageUrl);
  const buf = Buffer.from(await res.arrayBuffer());
  const tensor = await bufferToTensor(buf);
  const detection = await faceapi
    .detectSingleFace(tensor, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.2 }))
    .withFaceLandmarks()
    .withFaceDescriptor();
  tensor.dispose();
  if (!detection) return null;
  return detection.descriptor;
}

function cosineSimilarity(a, b) {
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

function euclideanDistance(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += (a[i] - b[i]) ** 2;
  return Math.sqrt(sum);
}

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

async function faceSwapBuffer(sourceUrl, targetBuffer) {
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

// ── Smart face swap pipeline ────────────────────────────────────────────────

async function smartDualFaceSwap(baseBuf, selfThumbUrl, plusThumbUrl, selfEmbed, plusEmbed, label) {
  const meta = await sharp(baseBuf).metadata();
  const W = meta.width;
  const H = meta.height;

  // 1. Detect all faces in the rendered scene
  console.log('   Detecting faces in rendered scene...');
  const detections = await detectFaces(baseBuf);
  console.log(`   Found ${detections.length} face(s)`);

  if (detections.length < 2) {
    console.log('   ⚠️ Less than 2 faces detected — falling back to left/right crop');
    return leftRightFallback(baseBuf, selfThumbUrl, plusThumbUrl, W, H);
  }

  // 2. Match each detected face to self or plus_one via embedding similarity
  const matches = [];
  for (let i = 0; i < detections.length; i++) {
    const det = detections[i];
    const embed = det.descriptor;
    const selfDist = euclideanDistance(embed, selfEmbed);
    const plusDist = euclideanDistance(embed, plusEmbed);
    const box = det.detection.box;
    matches.push({
      index: i,
      box: { x: Math.round(box.x), y: Math.round(box.y), w: Math.round(box.width), h: Math.round(box.height) },
      selfDist,
      plusDist,
      bestMatch: selfDist < plusDist ? 'self' : 'plus_one',
    });
    console.log(
      `   Face ${i}: pos=(${Math.round(box.x)},${Math.round(box.y)}) size=${Math.round(box.width)}x${Math.round(box.height)} ` +
      `selfDist=${selfDist.toFixed(3)} plusDist=${plusDist.toFixed(3)} → ${selfDist < plusDist ? 'SELF' : 'PLUS_ONE'}`
    );
  }

  // Pick the best match for each role
  const selfMatch = matches.reduce((best, m) => (m.selfDist < best.selfDist ? m : best));
  const plusMatch = matches.reduce((best, m) => (m.plusDist < best.plusDist ? m : best));

  // If both matched to the same face, pick the better one and assign the other
  if (selfMatch.index === plusMatch.index) {
    console.log('   ⚠️ Both roles matched same face — resolving conflict');
    if (selfMatch.selfDist - selfMatch.plusDist < plusMatch.plusDist - plusMatch.selfDist) {
      // selfMatch is more confident as self, reassign plus
      const otherFaces = matches.filter(m => m.index !== selfMatch.index);
      if (otherFaces.length > 0) {
        const newPlus = otherFaces.reduce((best, m) => (m.plusDist < best.plusDist ? m : best));
        Object.assign(plusMatch, newPlus);
      }
    } else {
      const otherFaces = matches.filter(m => m.index !== plusMatch.index);
      if (otherFaces.length > 0) {
        const newSelf = otherFaces.reduce((best, m) => (m.selfDist < best.selfDist ? m : best));
        Object.assign(selfMatch, newSelf);
      }
    }
  }

  console.log(`   Matched: SELF=face${selfMatch.index} at (${selfMatch.box.x},${selfMatch.box.y}), PLUS=face${plusMatch.index} at (${plusMatch.box.x},${plusMatch.box.y})`);

  // 3. Crop each matched face with generous padding, swap, paste back
  let result = baseBuf;

  // Swap self first
  result = await cropSwapPaste(result, W, H, selfMatch.box, selfThumbUrl, 'self');
  // Swap plus_one
  result = await cropSwapPaste(result, W, H, plusMatch.box, plusThumbUrl, 'plus_one');

  return result;
}

async function cropSwapPaste(imageBuf, W, H, faceBox, sourcePhotoUrl, label) {
  // Generous padding around face (3x face size for context)
  const padX = Math.round(faceBox.w * 1.5);
  const padY = Math.round(faceBox.h * 2.0);

  const cropLeft = Math.max(0, faceBox.x - padX);
  const cropTop = Math.max(0, faceBox.y - padY);
  const cropRight = Math.min(W, faceBox.x + faceBox.w + padX);
  const cropBottom = Math.min(H, faceBox.y + faceBox.h + padY);
  const cropW = cropRight - cropLeft;
  const cropH = cropBottom - cropTop;

  console.log(`   Cropping ${label}: (${cropLeft},${cropTop}) ${cropW}x${cropH}`);

  // Crop the region
  const cropBuf = await sharp(imageBuf)
    .extract({ left: cropLeft, top: cropTop, width: cropW, height: cropH })
    .jpeg({ quality: 95 })
    .toBuffer();

  // Face swap on the crop (only one target face should be dominant)
  const swappedUrl = await faceSwapBuffer(sourcePhotoUrl, cropBuf);
  let swappedBuf = await downloadBuffer(swappedUrl);

  // Resize swapped result back to crop dimensions (model may resize)
  swappedBuf = await sharp(swappedBuf)
    .resize(cropW, cropH, { fit: 'fill' })
    .jpeg({ quality: 95 })
    .toBuffer();

  // Paste swapped crop back onto the full image
  const result = await sharp(imageBuf)
    .composite([{ input: swappedBuf, left: cropLeft, top: cropTop }])
    .jpeg({ quality: 95 })
    .toBuffer();

  console.log(`   ✅ ${label} swapped and pasted back`);
  return result;
}

async function leftRightFallback(baseBuf, selfThumbUrl, plusThumbUrl, W, H) {
  console.log('   Using left/right fallback...');
  const midX = Math.round(W * 0.5);

  const leftCrop = await sharp(baseBuf).extract({ left: 0, top: 0, width: Math.round(W * 0.55), height: H }).jpeg({ quality: 95 }).toBuffer();
  const rightCrop = await sharp(baseBuf).extract({ left: Math.round(W * 0.45), top: 0, width: W - Math.round(W * 0.45), height: H }).jpeg({ quality: 95 }).toBuffer();

  const leftSwapUrl = await faceSwapBuffer(selfThumbUrl, leftCrop);
  let leftSwapBuf = await downloadBuffer(leftSwapUrl);
  leftSwapBuf = await sharp(leftSwapBuf).resize(Math.round(W * 0.55), H, { fit: 'fill' }).jpeg({ quality: 95 }).toBuffer();

  const rightSwapUrl = await faceSwapBuffer(plusThumbUrl, rightCrop);
  let rightSwapBuf = await downloadBuffer(rightSwapUrl);
  rightSwapBuf = await sharp(rightSwapBuf).resize(W - Math.round(W * 0.45), H, { fit: 'fill' }).jpeg({ quality: 95 }).toBuffer();

  const leftHalf = await sharp(leftSwapBuf).extract({ left: 0, top: 0, width: midX, height: H }).jpeg({ quality: 95 }).toBuffer();
  const rightHalf = await sharp(rightSwapBuf).extract({ left: midX - Math.round(W * 0.45), top: 0, width: W - midX, height: H }).jpeg({ quality: 95 }).toBuffer();

  return sharp({ create: { width: W, height: H, channels: 3, background: { r: 0, g: 0, b: 0 } } })
    .composite([
      { input: leftHalf, left: 0, top: 0 },
      { input: rightHalf, left: midX, top: 0 },
    ])
    .jpeg({ quality: 95 })
    .toBuffer();
}

// ── Test prompts ────────────────────────────────────────────────────────────

function buildPrompts(selfDesc, plusDesc) {
  return [
    {
      name: 'Beach margaritas (side by side)',
      prompt: `Photorealistic photo of two people relaxing on a tropical beach, holding margarita cocktails.

PERSON A (a man): ${selfDesc}. Wearing a casual linen shirt.
PERSON B (a woman): ${plusDesc}. Wearing a light sundress.

Both faces fully visible, facing camera, natural smiles. Medium shot waist-up. Golden hour warm light, turquoise ocean background. Sharp focus on both faces.
Portrait 9:16, DSLR quality, natural skin texture, 35mm lens.`,
    },
    {
      name: 'Dancing at a gala (face to face)',
      prompt: `Photorealistic photo of a couple slow dancing at an elegant evening gala.

PERSON A (a man): ${selfDesc}. Wearing a tailored dark suit with a bow tie.
PERSON B (a woman): ${plusDesc}. Wearing an elegant evening gown.

They face each other with one person's face angled toward the camera. Intimate close-up, both faces visible. Grand ballroom with chandeliers, warm amber candlelight. Romantic atmosphere.
Portrait 9:16, DSLR quality, cinematic lighting, shallow depth of field.`,
    },
    {
      name: 'Piggyback in autumn (stacked vertically)',
      prompt: `Photorealistic photo of a couple in an autumn park, the woman riding piggyback on the man.

PERSON A (the man, carrying): ${selfDesc}. Wearing a flannel jacket and jeans.
PERSON B (the woman, on his back): ${plusDesc}. Wearing a cozy sweater and scarf, arms around his shoulders.

Her face is above and behind his. Both faces clearly visible and laughing. Colorful fall foliage, golden afternoon light filtering through trees. Full body shot.
Portrait 9:16, DSLR quality, natural skin texture, warm autumn tones.`,
    },
    {
      name: 'Cooking together (one behind the other)',
      prompt: `Photorealistic photo of a couple cooking together in a beautiful modern kitchen.

PERSON A (a man): ${selfDesc}. Standing at the stove, stirring a pan, looking over his shoulder toward camera.
PERSON B (a woman): ${plusDesc}. Standing behind him, reaching around to taste from a wooden spoon, smiling.

Overlapping positions — she is partially behind him. Both faces visible. Warm kitchen lighting, marble countertops, herbs and ingredients scattered. Cozy domestic scene.
Portrait 9:16, DSLR quality, natural warm lighting, 50mm lens.`,
    },
    {
      name: 'Forehead to forehead (extreme close)',
      prompt: `Photorealistic intimate portrait of a couple with their foreheads touching, eyes closed, peaceful smiles.

PERSON A (a man): ${selfDesc}.
PERSON B (a woman): ${plusDesc}.

Extreme close-up of just their faces, foreheads touching in the center. Soft backlight creating a rim glow. Shallow depth of field, blurred warm bokeh background. Tender, intimate moment.
Portrait 9:16, DSLR quality, studio portrait lighting, 85mm lens.`,
    },
  ];
}

// ── Main ────────────────────────────────────────────────────────────────────

(async () => {
  try {
    fs.mkdirSync(OUT_DIR, { recursive: true });
    const t0 = Date.now();

    // 1. Init face-api
    console.log('Initializing face-api...');
    await initFaceApi();

    // 2. Load cast
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

    // 3. Get reference embeddings from cast photos
    console.log('\nComputing reference face embeddings...');
    const selfEmbed = await getFaceEmbedding(selfCast.thumb_url);
    const plusEmbed = await getFaceEmbedding(plusCast.thumb_url);

    if (!selfEmbed) { console.error('Could not detect face in self photo'); process.exit(1); }
    if (!plusEmbed) { console.error('Could not detect face in plus_one photo'); process.exit(1); }

    const refDist = euclideanDistance(selfEmbed, plusEmbed);
    console.log(`   Self↔Plus reference distance: ${refDist.toFixed(3)} (should be > 0.8 for distinct people)`);

    // 4. Run each test prompt
    const prompts = buildPrompts(selfDesc, plusDesc);
    let promptIdx = 0;

    for (const { name, prompt } of prompts) {
      promptIdx++;
      console.log(`\n${'═'.repeat(60)}`);
      console.log(`PROMPT ${promptIdx}/${prompts.length}: ${name}`);
      console.log('═'.repeat(60));

      // Generate
      console.log('   Generating scene...');
      process.stdout.write('   ');
      const baseUrl = await replicateGenerate(prompt);
      const baseBuf = await downloadBuffer(baseUrl);
      const baseFile = path.join(OUT_DIR, `${String(promptIdx).padStart(2, '0')}_base_${name.replace(/[^a-z0-9]/gi, '_')}.jpg`);
      fs.writeFileSync(baseFile, baseBuf);

      // Post base
      await persistBufferAndPost(baseBuf, `[SMART SWAP] ${String(promptIdx).padStart(2, '0')}a — ${name} (base)`, prompt);

      // Smart swap
      try {
        const result = await smartDualFaceSwap(baseBuf, selfCast.thumb_url, plusCast.thumb_url, selfEmbed, plusEmbed, name);
        const resultFile = path.join(OUT_DIR, `${String(promptIdx).padStart(2, '0')}_swapped_${name.replace(/[^a-z0-9]/gi, '_')}.jpg`);
        fs.writeFileSync(resultFile, result);
        await persistBufferAndPost(result, `[SMART SWAP] ${String(promptIdx).padStart(2, '0')}b — ${name} (swapped)`, prompt);
      } catch (err) {
        console.error(`   ❌ Smart swap failed: ${err.message}`);
        await persistBufferAndPost(baseBuf, `[SMART SWAP] ${String(promptIdx).padStart(2, '0')}b — ${name} (FAILED: ${err.message.slice(0, 50)})`, prompt);
      }
    }

    const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
    console.log(`\n${'═'.repeat(60)}`);
    console.log(`ALL DONE in ${elapsed}s (${prompts.length} prompts × 2 posts = ${prompts.length * 2} posts)`);
    console.log(`Output: ${OUT_DIR}`);
    console.log('Check your dreams in the app!');
  } catch (err) {
    console.error('❌ Fatal:', err.message);
    console.error(err.stack);
    process.exit(1);
  }
})();
