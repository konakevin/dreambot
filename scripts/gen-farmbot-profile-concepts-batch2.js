#!/usr/bin/env node
/**
 * Batch 2 — Kevin wanted more avatar options after the first 12 (ducklings/
 * lambs/bunnies/barn/porch/watering-can) didn't land. This batch leans more
 * into PERSONALITY/COSTUME touches (a small prop or garment giving the
 * subject actual character, matching how other bots' mascots work — YumBot's
 * taco, ChibiBot's hedgehog-with-umbrella — rather than a generic cute-animal
 * headshot), plus a few animals not yet tried, plus one bold new subject
 * type (a scarecrow) for real range.
 *
 * Same infra as gen-farmbot-profile-concepts.js — current look register,
 * current locked model, square 1:1 profile framing.
 */
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const { flux, callClaude, download } = require('./lib/botEngine');
const bot = require('./bots/farmbot');
const { lookOverride } = require('./bots/farmbot/shared-blocks');

const OUT_DIR = path.join('/tmp', 'farmbot-profile-concepts-batch2');
fs.mkdirSync(OUT_DIR, { recursive: true });

const looks = require('./bots/farmbot/seeds/farmbot_look_register.json');

const CONCEPTS = [
  { name: '01-goat-bandana', subject: 'A single baby goat wearing a small red bandana knotted at the neck and a tiny straw hat tilted back, close-up character portrait, big sparkling eyes, proud confident pose' },
  { name: '02-duckling-apron', subject: 'A single fluffy yellow duckling wearing a small gardening apron, holding a tiny wooden trowel in one wing, close-up character portrait, big sparkling eyes, cheerful expression' },
  { name: '03-lamb-scarf', subject: 'A single woolly lamb wearing a small knitted scarf and a daisy tucked behind one ear, close-up character portrait, big sparkling eyes, playful wink' },
  { name: '04-sheepdog-pup', subject: 'A single fluffy farm sheepdog puppy wearing a red bandana, tongue out, close-up character portrait, big sparkling eyes, joyful energetic expression' },
  { name: '05-calf-cowbell', subject: 'A single brown-and-white baby calf wearing a small cowbell on a leather strap, close-up character portrait, big sparkling eyes, gentle happy expression' },
  { name: '06-chick-sunhat', subject: 'A single fluffy yellow chick wearing a tiny woven sunhat, standing proudly on a fence post, close-up character portrait, big sparkling eyes' },
  { name: '07-bunny-veggie-basket', subject: 'A single fluffy white farm rabbit holding a small basket overflowing with tiny carrots and radishes, close-up character portrait, big sparkling eyes, delighted expression' },
  { name: '08-piglet-overalls', subject: 'A single pink piglet wearing tiny denim overalls with one strap undone, a small smudge of mud on its snout, close-up character portrait, big sparkling eyes, mischievous grin' },
  { name: '09-baby-donkey', subject: 'A single fuzzy baby donkey with a small flower tucked behind one ear, close-up character portrait, big sparkling eyes, gentle curious expression' },
  { name: '10-gosling-bow', subject: 'A single fluffy yellow gosling wearing a tiny bow around its neck, close-up character portrait, big sparkling eyes, cheerful expression' },
  { name: '11-owl-spectacles', subject: 'A single small round barn owl wearing tiny round spectacles, perched in a barn window, close-up character portrait, big sparkling eyes, wise gentle expression' },
  { name: '12-scarecrow', subject: 'A single friendly scarecrow character with button eyes, a warm stitched smile, straw poking out from a plaid shirt collar and a floppy patched hat, close-up character portrait, cheerful welcoming expression' },
];

const FRAMING = `PROFILE-PICTURE FRAMING (critical): this is a square app icon/avatar, not a
wide scene. The subject fills most of the frame, centered, with a soft
simple background (a gentle blur of green, sky, or warm color — no
competing detail). Gallery-quality character-portrait / product-shot
composition, like a mascot logo, not an establishing shot.`;

const MODEL = 'black-forest-labs/flux-2-flex';

async function main() {
  for (let i = 0; i < CONCEPTS.length; i++) {
    const c = CONCEPTS[i];
    const look = looks[i % looks.length];
    const brief = `${bot.mediumStyles.farmbot_cozy_neutral}

${lookOverride(look)}━━━ THE SUBJECT ━━━
${c.subject}

${FRAMING}

Write ONE Flux-ready prompt (no preamble, no markdown, just the prompt
text) rendering exactly this subject in exactly this look, gallery
quality, no text, no words, no watermark, no signature.`;

    console.log(`\n=== ${c.name} (look: ${look.slice(0, 45)}...) ===`);
    try {
      const { text: prompt } = await callClaude({ brief, maxTokens: 400 });
      const finalPrompt = `${prompt}, no text, no words, no watermark, no signature, gallery quality`;
      const url = await flux({ prompt: finalPrompt, aspectRatio: '1:1', model: MODEL });
      const dest = path.join(OUT_DIR, `${c.name}.jpg`);
      await download(url, dest);
      console.log(`  saved: ${dest}`);
    } catch (e) {
      console.error(`  FAILED ${c.name}: ${e.message} — continuing with next concept`);
    }
  }
  console.log('\nDone — concepts saved to', OUT_DIR);
}

main().catch((e) => {
  console.error('FAILED:', e);
  process.exit(1);
});
