#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_whimsical_companions.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} TINY COMPANION descriptions for YumBot whimsical-concept renders. Each companion is a tiny kawaii creature / critter / plushie / sprite that sits near the kawaii food subject as a small delight.

Each entry: 10-18 words. ONE specific tiny companion with kawaii features.

━━━ DISTRIBUTION ━━━

- 5 TINY KAWAII PETS (kitten / puppy / hamster / bunny / parakeet) — for the with-pets and and-toys themes
- 4 TINY KAWAII PLUSHIES (bear / cat / lamb / chick / rabbit, hand-stitched read)
- 4 TINY KAWAII BIRDS (sparrow / robin / chickadee / canary / bluebird with smiling beak)
- 4 TINY KAWAII INSECTS (ladybug / bee / butterfly / firefly with dot-eyes)
- 4 TINY KAWAII PERFORMERS (mini food-friend stage-hand / tiny conductor-cricket / mini stylist-bee / mini coach-mouse)
- 4 TINY ABSTRACT KAWAII SPRITES (cloud / star / heart / sparkle / droplet with face)

━━━ EXAMPLES ━━━

"A tiny round kawaii kitten with rosy cheeks sitting attentively beside the subject"
"A tiny soft felt bear plushie with stitched smile nearby like a quiet friend"
"A tiny round kawaii sparrow with smiling beak perched on a small ledge watching"
"A tiny kawaii ladybug with dot eyes resting on a nearby tabletop"
"A tiny conductor-cricket holding a baton with a smile and a tiny bow tie"
"A tiny smiling-cloud sprite floating beside the subject"

━━━ HARD MANDATES ━━━

- Companion is SMALL, never dominates
- Has kawaii face features
- Sits NEAR the subject (not on top, not blending)

━━━ HARD BANS ━━━

- NO companions that are people / humans / robots
- NO companions that are food (food is the subject)
- NO color or palette language

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
