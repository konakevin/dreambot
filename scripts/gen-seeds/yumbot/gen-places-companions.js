#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_places_companions.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} TINY COMPANION descriptions for YumBot unexpected-places renders. Each companion is a tiny kawaii critter / plushie / sprite, contextually hint-coded to the venues where possible (snail for greenhouse / library-mouse / aquarium-fish / etc.).

Each entry: 10-18 words. ONE specific tiny companion with kawaii features.

━━━ DISTRIBUTION ━━━

- 4 TINY GREENHOUSE-CRITTERS (smiling snail / ladybug / butterfly / dragonfly)
- 4 TINY LIBRARY-CRITTERS (smiling library-mouse / bookworm-caterpillar / silverfish / quiet bunny)
- 4 TINY TRAIN-CRITTERS (smiling commuter-mouse / window-bird / passenger-cat / mini-luggage-fairy)
- 4 TINY CARNIVAL-CRITTERS (smiling carnival-bird / cotton-candy-sprite / popcorn-mouse / balloon-puppy)
- 4 TINY AQUARIUM-CRITTERS (smiling clownfish / sea-horse / starfish / mini-jellyfish)
- 5 TINY ROOFTOP-CRITTERS (smiling city-sparrow / rooftop-cat / herb-bee / sunset-firefly)

━━━ EXAMPLES ━━━

"A tiny kawaii snail with rosy cheeks and smiling shell perched on a leaf beside the subject"
"A tiny kawaii library-mouse with smiling eyes peeking over the edge of a book"
"A tiny kawaii commuter-mouse with smiling face sitting on a tiny suitcase"
"A tiny kawaii carnival-bird with smiling beak balancing on the booth edge"
"A tiny kawaii clownfish with smiling face hovering near the aquarium glass"
"A tiny kawaii city-sparrow with rosy cheeks perched on the rooftop railing"

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
