#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_fast_food_companions.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} TINY COMPANION descriptions for YumBot fast-food renders. Each companion is a tiny kawaii critter / sprite contextually hint-coded to fast-food scenes (sidewalk pigeon / diner-cat / drive-thru-bird / counter-mouse / curb-squirrel).

Each entry: 10-18 words. ONE specific tiny companion.

━━━ DISTRIBUTION ━━━

- 5 TINY URBAN-CRITTERS (smiling pigeon / sidewalk-sparrow / curb-squirrel / city-mouse / urban-rabbit)
- 4 TINY DINER-CRITTERS (smiling diner-cat / booth-mouse / counter-sparrow / paper-bag-bug)
- 4 TINY ROADSIDE-CRITTERS (smiling crow / roadside-rat / drive-thru-bird / parking-lot-squirrel)
- 4 TINY KAWAII INSECTS (smiling ladybug / bee / fly with kawaii face / dragonfly)
- 4 TINY KAWAII PLUSHIES (felt bear / lamb / rabbit / chick with stitched smile)
- 4 TINY KAWAII ABSTRACT SPRITES (sparkle / cloud / star / ketchup-droplet sprite with face)

━━━ EXAMPLES ━━━

"A tiny kawaii city-pigeon with rosy cheeks perched on the counter edge beside the subject"
"A tiny kawaii diner-cat with smiling face curled up in the corner of the booth"
"A tiny kawaii drive-thru-bird with smiling beak hovering near the food window"
"A tiny kawaii ladybug with dot eyes resting on a paper-tray edge"
"A tiny kawaii felt bear plushie with stitched smile sitting in a corner"
"A tiny smiling-sparkle sprite floating near the subject"

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
