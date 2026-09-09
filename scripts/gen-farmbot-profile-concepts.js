#!/usr/bin/env node
/**
 * One-off: render 12 profile-picture concept candidates for FarmBot.
 *
 * Pattern from surveying every other bot's avatar (2026-09-08): either a
 * single personified mascot character embodying the bot's subject
 * (YumBot's smiling taco, ChibiBot's hedgehog-with-umbrella, FaeBot's
 * fairy) or a close, non-personified representative subject shot
 * (BloomBot's flower macro) — always square, centered, simple/blurred
 * background. FarmBot's roster spans whole cozy scenes rather than one
 * mascot, so this batch leans toward an adorable hero-animal close-up
 * (mascot-cute like ChibiBot, genuine farm subject matter) with a few
 * place/object alternatives for range.
 *
 * NOT posted to the feed — these are avatar candidates, not dream content.
 * Saved locally only; Kevin picks one and it gets set as users.avatar_url.
 */
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const { flux, callClaude, download } = require('./lib/botEngine');
const bot = require('./bots/farmbot');

const OUT_DIR = path.join('/tmp', 'farmbot-profile-concepts');
fs.mkdirSync(OUT_DIR, { recursive: true });

const looks = require('./bots/farmbot/seeds/farmbot_look_register.json');

// 12 concepts: subject + which look-register index to use (varied for range).
const CONCEPTS = [
  { name: '01-duckling', subject: 'A single fluffy yellow duckling, close-up character portrait, big sparkling eyes, an adorable happy expression', lookIdx: 0 },
  { name: '02-baby-goat', subject: 'A single baby goat with floppy ears, close-up character portrait, big sparkling eyes, mid-happy-hop pose', lookIdx: 15 },
  { name: '03-chick-basket', subject: 'A single fluffy yellow chick peeking out of a small wicker basket, close-up character portrait, big sparkling eyes', lookIdx: 7 },
  { name: '04-lamb-flowers', subject: 'A single woolly lamb surrounded by a few daisies, close-up character portrait, big sparkling eyes, gentle happy expression', lookIdx: 12 },
  { name: '05-bunny', subject: 'A single fluffy white farm rabbit, close-up character portrait, big sparkling eyes, one ear up one ear down, adorable', lookIdx: 2 },
  { name: '06-kitten-hay', subject: 'A single tabby barn kitten sitting on a small tuft of hay, close-up character portrait, big sparkling eyes', lookIdx: 4 },
  { name: '07-piglet-flower', subject: 'A single pink piglet with a tiny flower tucked behind one ear, close-up character portrait, big sparkling eyes, joyful expression', lookIdx: 17 },
  { name: '08-rooster', subject: 'A single colorful rooster with a bright red comb, close-up character portrait, proud cheerful expression, vivid feather colors', lookIdx: 9 },
  { name: '09-cow-flower-crown', subject: 'A single friendly brown-and-white cow wearing a small daisy flower crown, close-up character portrait, big sparkling eyes, gentle smile', lookIdx: 13 },
  { name: '10-red-barn', subject: 'A single small red barn with white trim, sunflowers growing at its base, centered symmetrical composition, warm golden light, no animals, no people', lookIdx: 5 },
  { name: '11-farmhouse-porch', subject: 'A single cozy farmhouse porch corner with a flower box and a hanging lantern, centered symmetrical composition, warm inviting light, no animals, no people', lookIdx: 1 },
  { name: '12-watering-can', subject: 'A single vintage watering can overflowing with wildflowers, centered composition, soft warm light, no animals, no people', lookIdx: 3 },
];

const FRAMING = `PROFILE-PICTURE FRAMING (critical): this is a square app icon/avatar, not a
wide scene. The subject fills most of the frame, centered, with a soft
simple background (a gentle blur of green, sky, or warm color — no
competing detail). Gallery-quality character-portrait / product-shot
composition, like a mascot logo, not an establishing shot.`;

async function main() {
  for (const c of CONCEPTS) {
    const look = looks[c.lookIdx % looks.length];
    const brief = `${bot.mediumStyles.farmbot_cozy_neutral}

━━━ LOOK REGISTER (open your Flux prompt with this medium) ━━━
${look}

━━━ THE SUBJECT ━━━
${c.subject}

${FRAMING}

Write ONE Flux-ready prompt (no preamble, no markdown, just the prompt
text) rendering exactly this subject in exactly this look, gallery
quality, no text, no words, no watermark, no signature.`;

    console.log(`\n=== ${c.name} (look: ${look.slice(0, 40)}...) ===`);
    const { text: prompt } = await callClaude({ brief, maxTokens: 400 });
    const finalPrompt = `${prompt}, no text, no words, no watermark, no signature, gallery quality`;
    const models = ['black-forest-labs/flux-1.1-pro-ultra', 'google/gemini-2-image', 'openai/gpt-image-2'];
    const model = models[CONCEPTS.indexOf(c) % models.length];
    console.log(`  model=${model}`);
    const url = await flux({ prompt: finalPrompt, aspectRatio: '1:1', model });
    const dest = path.join(OUT_DIR, `${c.name}.jpg`);
    await download(url, dest);
    console.log(`  saved: ${dest}`);
  }
  console.log('\nDone — all 12 concepts saved to', OUT_DIR);
}

main().catch((e) => {
  console.error('FAILED:', e);
  process.exit(1);
});
