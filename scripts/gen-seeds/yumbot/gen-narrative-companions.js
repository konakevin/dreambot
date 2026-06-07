#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_narrative_companions.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} TINY COMPANION descriptions for YumBot narrative-action renders. Each companion is a tiny kawaii critter / plushie / sprite, contextually hint-coded to the action scenes (kitchen-mouse for baking / garden-bee for harvest / shop-cat for window / parade-bird for parade / tea-party-mouse / delivery-fairy).

Each entry: 10-18 words. ONE specific tiny companion.

━━━ DISTRIBUTION ━━━

- 5 TINY KITCHEN-CRITTERS (smiling mouse / kitchen-cat / flour-fairy / oven-sprite / butter-dust mote)
- 4 TINY GARDEN-CRITTERS (smiling bee / butterfly / ladybug / garden-snail)
- 4 TINY SHOP-CRITTERS (window-mouse / shop-cat / peeking-sparrow / display-fairy)
- 4 TINY PARADE-CRITTERS (parade-bird / trumpeting-cricket / float-fairy / drum-mouse)
- 4 TINY TEA-PARTY-CRITTERS (tea-mouse / sugar-fairy / spoon-sprite / mini-host-bunny)
- 4 TINY DELIVERY-CRITTERS (delivery-fairy / paper-plane-mouse / bicycle-sparrow / cobblestone-cricket)

━━━ EXAMPLES ━━━

"A tiny kawaii kitchen-mouse with rosy cheeks watching the baking from a corner shelf"
"A tiny kawaii garden-bee with smiling face hovering near the harvest basket"
"A tiny kawaii shop-cat with smiling whiskers peering from inside the display"
"A tiny kawaii parade-bird with smiling beak waving a tiny flag"
"A tiny kawaii tea-mouse with smiling face seated on a saucer"
"A tiny kawaii delivery-fairy with smiling face fluttering beside the basket"

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
