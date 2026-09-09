#!/usr/bin/env node
/**
 * One-off: controlled test of MODEL x CAMERA FRAMING, scene + look held
 * constant, to see whether any model at-or-below flux-1.1-pro-ultra cost
 * (6¢) gives more consistent anime rendering across close-up character
 * framing vs. wide landscape framing than flux-1.1-pro-ultra does.
 *
 * NOT posted to the feed — comparison renders only, saved to /tmp.
 */
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const { flux, callClaude, download } = require('./lib/botEngine');
const bot = require('./bots/farmbot');

const OUT_DIR = path.join('/tmp', 'farmbot-model-framing-test');
fs.mkdirSync(OUT_DIR, { recursive: true });

// Fixed scene (same as the look-matrix test) — only CAMERA varies between
// the two conditions below.
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

const CAMERAS = {
  closeup:
    "Medium framing, warm and character-focused, the background dissolving into a soft pastoral blur.",
  wide:
    "Wide establishing shot, the scene nestled small and inviting beneath a vast, softly clouded sky.",
};

// Look held constant — the most universal, already-proven entry.
const LOOK =
  "Clean cel-shaded anime illustration — crisp confident anime linework, flat vivid cheerful color, large expressive anime eyes with soft bright catchlights, classic anime character proportions.";

// At-or-below flux-1.1-pro-ultra (6¢) cost, per scripts/lib/imageModels.js.
const MODELS = [
  'black-forest-labs/flux-1.1-pro-ultra', // 6¢ — baseline/anchor
  'black-forest-labs/flux-2-flex', // 6¢
  'openai/gpt-image-2', // 6¢
  'google/gemini-2-image', // 4¢
  'black-forest-labs/flux-1.1-pro', // 4¢
  'black-forest-labs/flux-2-pro', // 3¢
  'black-forest-labs/flux-dev', // 3¢
];

function slugifyModel(m) {
  return m.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
}

async function main() {
  const manifest = [];
  for (const model of MODELS) {
    for (const [camKey, camera] of Object.entries(CAMERAS)) {
      const label = `${slugifyModel(model)}__${camKey}`;
      console.log(`\n=== ${label} ===`);

      const brief = `${bot.mediumStyles.farmbot_cozy_neutral}

━━━ LOOK REGISTER OVERRIDE (NON-NEGOTIABLE — open your Flux prompt with this medium) ━━━
${LOOK}

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
${camera}

render the character and the animals together, warmly interacting, both full
of personality and charm — the setting rendered just as lovingly and richly
detailed as the subjects, never a backdrop. Every face in the frame, human
and animal alike, stays clearly separate and fully legible — each face keeps
its own open space with a visible gap of air between it and any other face,
so every expression reads clean and unambiguous. no text, no words, no
watermarks, gallery quality`;

      try {
        const { text: prompt } = await callClaude({ brief, maxTokens: 500 });
        const finalPrompt = `${prompt}, no text, no words, no watermark, no signature, gallery quality`;
        const url = await flux({ prompt: finalPrompt, aspectRatio: '4:5', model });
        const dest = path.join(OUT_DIR, `${label}.jpg`);
        await download(url, dest);
        console.log(`  saved: ${dest}`);
        manifest.push({ model, camera: camKey, file: path.basename(dest), ok: true });
      } catch (e) {
        console.error(`  FAILED (${label}): ${e.message}`);
        manifest.push({ model, camera: camKey, ok: false, error: e.message });
      }
    }
  }
  fs.writeFileSync(path.join(OUT_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2));
  console.log(`\nDone — ${manifest.filter((m) => m.ok).length}/${manifest.length} rendered to ${OUT_DIR}`);
}

main().catch((e) => {
  console.error('FAILED:', e);
  process.exit(1);
});
