#!/usr/bin/env node
/**
 * One-off: render 5 painter-mascot candidates so Kevin can pick the best
 * one to ship as the loading-screen mascot. Same character DNA derived
 * from assets/images/icon.png (the actual app icon) — pearl-white chibi
 * robot with a SINGLE black-glass oval visor + ONE warm amber pupil-glow
 * and a smaller white catchlight (NOT two paired eyes — that's what my
 * 10-pose batch got wrong). All renders against pure RGB(0,0,0) so they
 * drop into the black loading stage cleanly.
 *
 * Cost: ~5 × $0.06 (Flux 1.1 Pro Ultra) = $0.30/run.
 * Output: assets/images/mascots/painter-1.jpg ... painter-5.jpg.
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const REPLICATE_KEY = process.env.REPLICATE_API_TOKEN;
if (!REPLICATE_KEY) {
  console.error('Missing REPLICATE_API_TOKEN in .env.local');
  process.exit(1);
}

const FLUX_MODEL = 'black-forest-labs/flux-1.1-pro-ultra';
const OUT_DIR = path.join(__dirname, '..', 'assets', 'images', 'mascots');
const OUT_SIZE = 512;

// Matches the 10-pose DNA — single oval black-glass visor face with TWO
// warm amber pupil-glows inside (the icon look + what the 10-pose batch
// nailed). Kevin confirmed two pupils is the spec, not the asymmetric
// single-pupil variant I tried first.
const CHARACTER_DNA = [
  'a tiny adorable chibi robot character',
  'pearlescent off-white smooth rounded plush-like body',
  'stubby cylindrical arms and legs',
  'small silver bolt joints at the shoulders, hips, and ankles',
  'ONE single large oval black-glass visor eye filling most of the face with two bright warm-amber glowing pupil dots side-by-side inside the visor',
  'NO mouth, NO nose',
  'thin silver antenna with a small glowing warm-amber bead tip on top of the head',
  'soft warm rim light on the silhouette only',
  'kawaii proportions with an oversized head and tiny body',
  'cute 3D Pixar render with subtle micro material texture on the body',
].join(', ');

// Whimsical "dreambot in dreamland" scene — matches the splash-icon
// vibe (icon.png) so the painter mascot reads as the same magical
// world as the app icon. Soft pink/lavender puffy clouds underneath
// the bot, dreamy deep-lavender starry sky background, a few small
// glowing amber stars sprinkled in the sky. Will sit on the loading
// screen as a rounded-corner card.
const CLOSING = [
  'soft pink and lavender puffy cotton-candy cloud blobs underneath and around the character',
  'dreamy deep-lavender starry night sky background',
  'a few small softly glowing warm amber stars scattered across the upper sky',
  'subtle bokeh lavender and pink light dots',
  'magical whimsical fairy-tale dreamscape atmosphere',
  'soft pastel color palette: lavender, pink, periwinkle, warm amber',
  'soft dreamy atmospheric lighting',
  'NOT pure black background, NOT studio photography, NOT white background',
  'square 1:1 composition, character centered',
].join(', ');

// 5 distinct painter pose variations — same activity, different framing /
// staging so Kevin has real choice. Each is wrapped with DNA + CLOSING.
const POSE_PHRASES = [
  // 1: classic — bot painting at a small wooden easel
  'standing in front of a small wooden artist easel, holding a tiny wooden paintbrush in its right hand mid-stroke and a small round wooden paint palette in its left hand, head tilted toward the easel canvas, focused and absorbed in painting',

  // 2: sitting on a tiny stool
  'sitting on a tiny wooden three-legged stool in front of an upright wooden easel, leaning slightly forward, holding a paintbrush dabbed in soft amber paint, the canvas glowing with a warm color wash',

  // 3: close-up energy, easel between us
  'crouched in front of a small wooden tabletop easel with a square canvas, both hands gripping a tiny paintbrush together with childlike concentration, multicolored paint splotches on its palette beside it',

  // 4: side-profile painting pose
  'in three-quarter side profile in front of a tilted wooden easel, brush held in mid-air about to touch the canvas, head turned to look at the canvas, holding a tiny round wooden palette with dabs of red, yellow, and blue paint',

  // 5: triumphant, finished canvas
  'standing proudly beside a small wooden easel showing a finished tiny painting of a warm amber star, holding a paintbrush victoriously in one raised hand and a paint palette in the other',
];

async function renderOne(prompt, index) {
  // Save straight to `mascot-{N}.jpg` so the loading screen can require()
  // them by number without an extra rename step. The 5 rotate randomly
  // on each mount (see MagicalLoadingStage).
  const tag = `mascot-${index}`;
  console.log(`🎨 [${tag}] ${prompt.slice(CHARACTER_DNA.length + 2).slice(0, 80)}…`);

  const createRes = await fetch(
    `https://api.replicate.com/v1/models/${FLUX_MODEL}/predictions`,
    {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + REPLICATE_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: { prompt, aspect_ratio: '1:1', output_format: 'jpg', safety_tolerance: 2 },
      }),
    }
  );
  if (!createRes.ok) {
    throw new Error(`Replicate create ${createRes.status}: ${(await createRes.text()).slice(0, 200)}`);
  }
  const created = await createRes.json();
  if (!created.id) throw new Error(`No prediction id: ${JSON.stringify(created)}`);

  let url = null;
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 1500));
    const poll = await fetch(`https://api.replicate.com/v1/predictions/${created.id}`, {
      headers: { Authorization: 'Bearer ' + REPLICATE_KEY },
    });
    const pd = await poll.json();
    if (pd.status === 'succeeded') {
      url = typeof pd.output === 'string' ? pd.output : pd.output && pd.output[0];
      break;
    }
    if (pd.status === 'failed' || pd.status === 'canceled') {
      throw new Error(`Replicate ${pd.status}: ${pd.error || 'no message'}`);
    }
  }
  if (!url) throw new Error('Replicate timed out');

  const buffer = Buffer.from(await (await fetch(url)).arrayBuffer());
  const out = path.join(OUT_DIR, `${tag}.jpg`);
  await sharp(buffer)
    .resize(OUT_SIZE, OUT_SIZE, { fit: 'cover' })
    .jpeg({ quality: 85, progressive: true })
    .toFile(out);

  const kb = Math.round(fs.statSync(out).size / 1024);
  console.log(`  ✓ [${tag}] saved (${kb} KB)`);
}

(async () => {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  const prompts = POSE_PHRASES.map((p) => `${CHARACTER_DNA}, ${p}, ${CLOSING}`);
  console.log(`Rendering ${prompts.length} painter variants in parallel...\n`);
  const results = await Promise.allSettled(prompts.map((p, i) => renderOne(p, i + 1)));
  const ok = results.filter((r) => r.status === 'fulfilled').length;
  const bad = results.length - ok;
  console.log(`\n${ok === results.length ? '✅' : '⚠️'} Done: ${ok}/${results.length}`);
  results.forEach((r, i) => {
    if (r.status === 'rejected') console.error(`  painter-${i + 1}: ${r.reason.message}`);
  });
  if (bad > 0) process.exit(1);
})();
