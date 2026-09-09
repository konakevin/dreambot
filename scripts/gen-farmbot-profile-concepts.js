#!/usr/bin/env node
/**
 * One-off: render 12 profile-picture concept candidates for FarmBot —
 * REGENERATED 2026-09-09 against the current fixed pipeline (Kevin: "we
 * need a new batch based on the new anime direction we've taken"). The
 * original Sep-7 batch predated the hue-freedom fix, the cute-character
 * fix, and two look-register cuts (down from 11 to 5 entries) — those
 * concepts are stale and this batch supersedes them.
 *
 * Pattern from surveying every other bot's avatar: either a single
 * personified mascot character embodying the bot's subject (YumBot's
 * smiling taco, ChibiBot's hedgehog-with-umbrella) or a close, non-
 * personified representative subject shot (BloomBot's flower macro) —
 * always square, centered, simple/blurred background. FarmBot's roster
 * spans whole cozy scenes rather than one mascot, so this batch leans
 * toward an adorable hero-animal close-up (mascot-cute) with a few
 * place/object alternatives for range. Same 12 subjects as the original
 * batch (they were good concepts) — reused via the CURRENT shared
 * fragments (lookOverride + FARMBOT_COZY_NEUTRAL) and locked model.
 *
 * NOT posted to the feed — these are avatar candidates, not dream content.
 * Saved locally only; Kevin picks one and it gets set as users.avatar_url.
 */
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const { flux, callClaude, download } = require('./lib/botEngine');
const bot = require('./bots/farmbot');
const { lookOverride } = require('./bots/farmbot/shared-blocks');

const OUT_DIR = path.join('/tmp', 'farmbot-profile-concepts-v2');
fs.mkdirSync(OUT_DIR, { recursive: true });

const looks = require('./bots/farmbot/seeds/farmbot_look_register.json');

// 12 concepts: subject + which look-register index to use (cycles through
// all 5 current entries for coverage).
const CONCEPTS = [
  { name: '01-duckling', subject: 'A single fluffy yellow duckling, close-up character portrait, big sparkling eyes, an adorable happy expression' },
  { name: '02-baby-goat', subject: 'A single baby goat with floppy ears, close-up character portrait, big sparkling eyes, mid-happy-hop pose' },
  { name: '03-chick-basket', subject: 'A single fluffy yellow chick peeking out of a small wicker basket, close-up character portrait, big sparkling eyes' },
  { name: '04-lamb-flowers', subject: 'A single woolly lamb surrounded by a few daisies, close-up character portrait, big sparkling eyes, gentle happy expression' },
  { name: '05-bunny', subject: 'A single fluffy white farm rabbit, close-up character portrait, big sparkling eyes, one ear up one ear down, adorable' },
  { name: '06-kitten-hay', subject: 'A single tabby barn kitten sitting on a small tuft of hay, close-up character portrait, big sparkling eyes' },
  { name: '07-piglet-flower', subject: 'A single pink piglet with a tiny flower tucked behind one ear, close-up character portrait, big sparkling eyes, joyful expression' },
  { name: '08-rooster', subject: 'A single colorful rooster with a bright red comb, close-up character portrait, proud cheerful expression, vivid feather colors' },
  { name: '09-cow-flower-crown', subject: 'A single friendly brown-and-white cow wearing a small daisy flower crown, close-up character portrait, big sparkling eyes, gentle smile' },
  { name: '10-red-barn', subject: 'A single small red barn with white trim, sunflowers growing at its base, centered symmetrical composition, warm golden light, no animals, no people' },
  { name: '11-farmhouse-porch', subject: 'A single cozy farmhouse porch corner with a flower box and a hanging lantern, centered symmetrical composition, warm inviting light, no animals, no people' },
  { name: '12-watering-can', subject: 'A single vintage watering can overflowing with wildflowers, centered composition, soft warm light, no animals, no people' },
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
