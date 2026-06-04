#!/usr/bin/env node
/**
 * One-off: generate 5 custom mascot illustrations for the onboarding
 * info screens. All match the existing icon.png style (tiny round
 * cream-white robot with one big black eye + antenna, pink/purple
 * fluffy clouds, starry indigo sky, soft Pixar-cute 3D render).
 *
 * Each render is scene-tailored to the matching onboarding moment:
 *   nightly  → robot asleep on the clouds with a dream-bubble
 *   cast     → robot proudly holding a postcard with two figures
 *   mood     → robot at a tiny console of glowing mood dials
 *   bots     → robot with 3 other little bot friends, all waving
 *   reveal   → robot presenting a small glowing framed picture
 *
 * Renders via Replicate Flux 1.1 Pro Ultra (6¢ × 5 = ~30¢).
 * Saves to /tmp/mascots/ for review. Pick winners + copy to
 * assets/images/onboarding/mascot-<key>.png to use them in InfoStep.
 *
 * Usage:
 *   export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh"
 *   node scripts/gen-onboarding-mascots.js
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

if (!process.env.REPLICATE_API_TOKEN) {
  console.error('REPLICATE_API_TOKEN missing — check .env.local');
  process.exit(1);
}

// Locked character + style + environment prefix. Same in every render so
// the mascot reads as the SAME little robot from icon.png across all
// five variations. Tweak in one place if the character drift is off.
const STYLE_PREFIX = [
  '3D Pixar-cute render of a tiny adorable round robot mascot',
  'cream-white rounded body, single large glossy black oval eye, small antenna on top of head',
  'soft pastel kawaii character design with subtle pink cheek glow',
  'perched on / surrounded by fluffy soft pink and lavender cumulus clouds',
  'dreamy starry indigo-purple night sky background with warm bokeh particles',
  'soft golden rim lighting, magical whimsical cozy atmosphere',
  'high-quality 3D CGI render, square 1:1 format, cinematic composition',
].join(', ');

const SCENES = [
  {
    key: 'nightly',
    headline: 'DreamBot dreams while you sleep',
    scene:
      'the robot curled up sleeping peacefully on the soft clouds, eye gently closed in a happy sleeping expression, a small floating thought-bubble above containing a tiny swirl of stars and a crescent moon, ZZZ symbols drifting up softly',
  },
  {
    key: 'cast',
    headline: 'Want to be in the postcard?',
    scene:
      'the robot smiling and holding up a small polaroid photo card with both hands, the photo showing two tiny stylized human figures standing side-by-side painted in soft watercolor inside the polaroid, gentle pink sparkle glow around the polaroid',
  },
  {
    key: 'mood',
    headline: 'Now set the mood',
    scene:
      'the robot standing at a tiny floating control console of glowing pastel mood knobs and sliders, one little hand reaching curiously toward a glowing teal slider, soft mood-color halos drifting in the air around it',
  },
  {
    key: 'bots',
    headline: 'Meet the bots',
    scene:
      'the robot standing in a friendly little row with three other tiny robot friends of different shapes and colors (a chubby pink robot, a tall teal robot, a tiny round yellow robot), all smiling and waving their hands together',
  },
  {
    key: 'reveal',
    headline: 'Ready to see what it dreams up',
    scene:
      'the robot proudly presenting a small softly-glowing framed picture held in both hands, the picture frame radiating soft purple-pink-teal aura, a single bright star floating above its antenna',
  },
];

const MODEL = 'black-forest-labs/flux-1.1-pro-ultra';
const POLL_INTERVAL_MS = 2000;
const POLL_TIMEOUT_MS = 120_000;

async function callReplicate(prompt) {
  const startResp = await fetch(`https://api.replicate.com/v1/models/${MODEL}/predictions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: {
        prompt,
        aspect_ratio: '1:1',
        output_format: 'png',
        output_quality: 95,
        safety_tolerance: 2,
        raw: false,
      },
    }),
  });
  if (!startResp.ok) {
    throw new Error(`Replicate start failed: ${startResp.status} ${await startResp.text()}`);
  }
  let prediction = await startResp.json();

  const started = Date.now();
  while (prediction.status !== 'succeeded' && prediction.status !== 'failed') {
    if (Date.now() - started > POLL_TIMEOUT_MS) {
      throw new Error(`Render timed out after ${POLL_TIMEOUT_MS / 1000}s`);
    }
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
    const poll = await fetch(prediction.urls.get, {
      headers: { Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}` },
    });
    prediction = await poll.json();
  }
  if (prediction.status === 'failed') {
    throw new Error('Render failed: ' + (prediction.error || 'unknown'));
  }
  const url = Array.isArray(prediction.output) ? prediction.output[0] : prediction.output;
  if (!url) throw new Error('No output URL returned');
  const img = await fetch(url);
  if (!img.ok) throw new Error(`Image download failed: ${img.status}`);
  return Buffer.from(await img.arrayBuffer());
}

async function main() {
  const outDir = '/tmp/mascots';
  fs.mkdirSync(outDir, { recursive: true });

  for (const s of SCENES) {
    const prompt = `${STYLE_PREFIX}, ${s.scene}`;
    const outPath = path.join(outDir, `mascot-${s.key}.png`);
    process.stdout.write(`→ ${s.key.padEnd(8)} ("${s.headline}") ... `);
    const t0 = Date.now();
    try {
      const buf = await callReplicate(prompt);
      fs.writeFileSync(outPath, buf);
      console.log(`done in ${((Date.now() - t0) / 1000).toFixed(1)}s → ${outPath}`);
    } catch (err) {
      console.log('FAILED');
      console.error('  ', err.message);
    }
  }

  console.log(`\nAll five renders saved to ${outDir}`);
  console.log('Review them, then copy winners to:');
  console.log('  assets/images/onboarding/mascot-<key>.png');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
