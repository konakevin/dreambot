#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_fruits_veggies_companions.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} TINY COMPANION descriptions for YumBot fruits-and-veggies renders. Each companion is a tiny kawaii critter / sprite hint-coded to the organic environment (garden snail / bee / butterfly / forest mushroom-sprite / market pigeon / orchard squirrel / etc.).

Each entry: 10-18 words. ONE specific tiny companion with kawaii features.

━━━ DISTRIBUTION ━━━

- 5 TINY GARDEN-CRITTERS (smiling snail / ladybug / earthworm / garden-frog / dot-eyed grasshopper)
- 4 TINY POLLINATORS (smiling bee / butterfly / dragonfly / hummingbird)
- 4 TINY ORCHARD-CRITTERS (smiling robin / squirrel / orchard-mouse / chickadee)
- 4 TINY FOREST-CRITTERS (smiling forest-bunny / hedgehog / fox-kit / chipmunk / mushroom-sprite)
- 4 TINY MARKET-CRITTERS (smiling sparrow / market-mouse / pigeon / friendly-cat)
- 4 TINY ABSTRACT KAWAII SPRITES (sparkle-cloud / pollen-sprite / star / dew-droplet sprite with face)

━━━ EXAMPLES ━━━

"A tiny round kawaii snail with rosy cheeks gliding along a leaf beside the subject"
"A tiny kawaii honeybee with smiling face hovering close to a flower"
"A tiny kawaii robin with smiling beak perched on a nearby branch watching"
"A tiny kawaii forest-bunny with smiling eyes peeking from behind a mossy log"
"A tiny kawaii market-sparrow with smiling beak hopping along the crate edge"
"A tiny kawaii pollen-sprite with smiling face floating in the warm air"

━━━ HARD MANDATES ━━━

- Companion is SMALL, never dominates
- Has kawaii face features
- Sits NEAR the subject

━━━ HARD BANS ━━━

- NO humans / people / robots
- NO food companions (food is the hero / friend)
- NO color or palette language

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
