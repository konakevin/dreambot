#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_carnival_food_companions.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} TINY COMPANION descriptions for YumBot carnival-food renders. Each companion is a tiny kawaii critter / sprite contextually fit to carnival scenes (carnival-bird / midway-mouse / circus-cat / sparkle-sprite).

Each entry: 10-18 words. ONE specific tiny companion.

━━━ DISTRIBUTION ━━━

- 5 TINY CARNIVAL-CRITTERS (smiling carnival-bird / midway-mouse / circus-cat / sparrow / squirrel)
- 4 TINY POLLINATORS / INSECTS (smiling bee / ladybug / butterfly / dragonfly with kawaii features)
- 4 TINY PLUSHIE / STUFFED-ANIMAL FRIENDS (felt bear / lamb / chick / rabbit — prize-booth coded)
- 4 TINY ABSTRACT KAWAII SPRITES (sparkle / star / cloud / heart with face)
- 4 TINY KAWAII BIRDS (sparrow / robin / chickadee / canary)
- 4 TINY KAWAII MAMMALS (mouse / hamster / kitten / bunny)

━━━ EXAMPLES ━━━

"A tiny kawaii carnival-sparrow with rosy cheeks perched on the booth edge beside the subject"
"A tiny kawaii ladybug with dot eyes resting on a paper cone nearby"
"A tiny kawaii felt bear plushie prize with stitched smile sitting on a shelf"
"A tiny smiling-sparkle sprite floating beside the subject"
"A tiny kawaii robin with smiling beak perched on the awning corner"
"A tiny kawaii kitten with rosy cheeks watching the booth from the side"

━━━ HARD MANDATES ━━━

- Companion is SMALL, never dominates
- Has kawaii face features
- Sits NEAR the subject

━━━ HARD BANS ━━━

- NO humans / people / robots
- NO food companions
- NO color or palette language

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
