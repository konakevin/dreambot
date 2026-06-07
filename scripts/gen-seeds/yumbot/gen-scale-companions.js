#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_scale_companions.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} TINY COMPANION descriptions for YumBot scale-twist renders. Each companion is a tiny kawaii critter / sprite that fits the scale context — tiny pedestrian-mouse for giant-real-world / tiny dust-mite for microscopic / island-bird for food-island / paddle-mouse for chocolate-river / sea-creature for underwater / astro-bunny for cosmic.

Each entry: 10-18 words. ONE specific tiny companion.

━━━ DISTRIBUTION ━━━

- 4 TINY URBAN-CRITTERS (city pigeon / mouse / squirrel / pedestrian-bird with kawaii face — giant-real-world coded)
- 4 TINY MICRO-CRITTERS (ladybug / ant / sugar-mite / dust-mite / smiling pollen sprite — microscopic coded)
- 4 TINY ISLAND-CRITTERS (smiling tropical bird / crab / sand-bunny / dune-mouse — food-island coded)
- 4 TINY RIVER-CRITTERS (paddle-frog / river-fish / boat-mouse / smiling water-lily — chocolate-river coded)
- 4 TINY SEA-CRITTERS (kawaii sea-horse / sea-bunny / starfish / clownfish — underwater coded)
- 5 TINY COSMIC SPRITES (astro-bunny / star-mouse / comet-firefly / planet-sprite / nebula-cloud — space coded)

━━━ EXAMPLES ━━━

"A tiny kawaii city-mouse with rosy cheeks waving from a window across the street"
"A tiny smiling sugar-mite sprite floating near a sugar-grain boulder"
"A tiny kawaii tropical bird with smiling beak perched on a frosting-branch"
"A tiny kawaii paddle-frog with smiling eyes balanced on a marshmallow boat"
"A tiny kawaii sea-bunny with smiling face drifting in the current beside the subject"
"A tiny kawaii astro-bunny with helmet and smiling face floating near the subject"

━━━ HARD MANDATES ━━━

- Companion is SMALL, never dominates
- Has kawaii face features
- Sits NEAR the subject

━━━ HARD BANS ━━━

- NO humans / people / robots
- NO food companions (food is subject)
- NO color or palette language

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
