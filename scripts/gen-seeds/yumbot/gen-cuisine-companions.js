#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_cuisine_companions.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} TINY COMPANION descriptions for YumBot cuisine renders. Each companion is a tiny kawaii critter / plushie / sprite near the kawaii food subject — culturally hint-coded where possible (a tiny mouse for French / a parakeet for Indian / a koi for Korean, etc.) but generic-cute fallbacks work too.

Each entry: 10-18 words. ONE specific tiny companion with kawaii features.

━━━ DISTRIBUTION ━━━

- 5 TINY CULTURAL CRITTERS (French mouse / Indian parakeet / Korean koi / Mexican hummingbird / Nordic snowy-bird, kawaii-styled)
- 5 TINY KAWAII MAMMALS (mouse / hamster / kitten / bunny / squirrel)
- 4 TINY KAWAII BIRDS (sparrow / robin / chickadee / canary)
- 4 TINY KAWAII INSECTS (ladybug / bee / butterfly / firefly)
- 4 TINY KAWAII PLUSHIES / FELT TOYS (bear / cat / lamb / chick — hand-stitched read)
- 3 TINY ABSTRACT KAWAII SPRITES (sparkle / cloud / heart with kawaii face)

━━━ EXAMPLES ━━━

"A tiny kawaii Paris mouse with smiling beret peeking from behind the subject"
"A tiny round kawaii kitten with rosy cheeks sitting beside the subject"
"A tiny kawaii Indian parakeet with bright smiling beak perched watching"
"A tiny ladybug with smiling dot eyes resting on a nearby surface"
"A tiny felt bear plushie with stitched smile nearby"
"A tiny smiling-sparkle sprite floating near the subject"

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
