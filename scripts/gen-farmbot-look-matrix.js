#!/usr/bin/env node
/**
 * One-off: render the EXACT SAME fixed scene (character, animals, activity,
 * props, season, weather, camera all locked) through every entry in the
 * look register, so Kevin can compare looks apples-to-apples in one matrix.
 *
 * Model held constant (flux-1.1-pro-ultra) too, so only the LOOK varies.
 * NOT posted to the feed — comparison renders only, saved to /tmp.
 */
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const { flux, callClaude, download } = require('./lib/botEngine');
const bot = require('./bots/farmbot');
const pools = require('./bots/farmbot/pools');

const OUT_DIR = path.join('/tmp', `farmbot-look-matrix${process.env.OUT_SUFFIX || ''}`);
fs.mkdirSync(OUT_DIR, { recursive: true });

// Fixed scene — same across every render. Hand-picked from the shared pools
// for coherence (the pony being brushed is the same pony at the window).
const CHARACTER =
  "A cheerful farm girl in a soft yellow sundress with a small patch sewn near the hem, a woven straw hat tilted playfully to one side, and a bright daisy tucked behind her ear; she stands with her hands clasped behind her back, bouncing lightly on her heels, rosy cheeks lifted in a wide dimpled smile.";
const ANIMALS =
  "A gentle pony standing at a cottage window, breath fogging the glass, soft nose nearly touching the pane — three fluffy chicks have followed it right up and are now clustered at its hooves, peering upward at their own fuzzy reflections with tremendous seriousness.";
const ACTIVITY =
  "Drawing a wide brush through a pony's mane in long, unhurried strokes, the animal standing calm and still.";
const PROPS =
  "Weathered wooden barrels cluster beside a produce crate overflowing with knobby root vegetables, a few loose straw wisps caught against their hoops by the morning breeze.";
const SEASON =
  "A tumble of orange pumpkins and rosy apples beside a wooden harvest basket, golden leaves spiraling down from the maple above.";
const WEATHER =
  "Sunset glow washing everything in amber and rose, long shadows stretching peacefully across the lane, the air warm and perfectly still.";
const CAMERA =
  "Medium framing, warm and character-focused, the background dissolving into a soft pastoral blur.";

const ONLY_INDICES = process.env.ONLY_INDICES
  ? process.env.ONLY_INDICES.split(',').map((n) => parseInt(n, 10) - 1)
  : null;
const ALL_LOOKS = pools.FARMBOT_LOOK_REGISTER;
const LOOKS = ONLY_INDICES ? ONLY_INDICES.map((i) => ALL_LOOKS[i]) : ALL_LOOKS;
const OUT_SUFFIX = process.env.OUT_SUFFIX || '';
const MODEL = 'black-forest-labs/flux-2-flex';

function slugify(look) {
  return look
    .split('—')[0]
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function main() {
  const manifest = [];
  for (let i = 0; i < LOOKS.length; i++) {
    const look = LOOKS[i];
    const origIndex = ONLY_INDICES ? ONLY_INDICES[i] + 1 : i + 1;
    const slug = slugify(look);
    console.log(`\n=== ${origIndex} (${i + 1}/${LOOKS.length}): ${slug} ===`);

    const brief = `${bot.mediumStyles.farmbot_cozy_neutral}

━━━ LOOK REGISTER OVERRIDE (NON-NEGOTIABLE — open your Flux prompt with this medium) ━━━
${look}

This is the AUTHORITY on rendering style — it OVERRIDES any other art-style, medium, or finish
wording anywhere below. Translate every surface in the scene into THIS medium. Open your Flux
prompt with these tokens so they lead the image model's attention.

━━━ THE CHARACTER ━━━
${CHARACTER}

━━━ THE ANIMALS ━━━
${ANIMALS}

━━━ WHAT'S HAPPENING ━━━
${ACTIVITY}

━━━ THE SETTING ━━━
${PROPS}
${SEASON}
${WEATHER}

━━━ CAMERA ━━━
${CAMERA}

render the character and the animals together, warmly interacting, both full
of personality and charm — the setting rendered just as lovingly and richly
detailed as the subjects, never a backdrop. Every face in the frame, human
and animal alike, stays clearly separate and fully legible — each face keeps
its own open space with a visible gap of air between it and any other face,
so every expression reads clean and unambiguous. no text, no words, no
watermarks, gallery quality`;

    const { text: prompt } = await callClaude({ brief, maxTokens: 500 });
    const finalPrompt = `${prompt}, no text, no words, no watermark, no signature, gallery quality`;
    const url = await flux({ prompt: finalPrompt, aspectRatio: '4:5', model: MODEL });
    const dest = path.join(OUT_DIR, `${String(origIndex).padStart(2, '0')}-${slug}.jpg`);
    await download(url, dest);
    console.log(`  saved: ${dest}`);
    manifest.push({ index: origIndex, slug, look, file: path.basename(dest) });
  }
  fs.writeFileSync(path.join(OUT_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2));
  console.log(`\nDone — ${LOOKS.length} looks rendered to ${OUT_DIR}`);
}

main().catch((e) => {
  console.error('FAILED:', e);
  process.exit(1);
});
