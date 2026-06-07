#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_fast_food_cameras.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} CAMERA / FRAMING DIRECTIONS for YumBot fast-food renders. Tuned for fast-food contexts (joint counter / pizza window / taco stand / paper-basket / hot-dog cart / diner booth).

Each entry: 12-22 words. ONE specific framing.

━━━ DISTRIBUTION ━━━

- 4 INTIMATE EYE-LEVEL (food filling 60% of frame, fast-food setting blurred behind)
- 4 OVERHEAD TOP-DOWN (food on tray or counter from above)
- 4 LOW HERO-UP (looking up at the kawaii food, monumental fast-food presence)
- 4 THREE-QUARTER LEAN (slight tilt revealing depth + fast-food context)
- 4 OFF-CENTER COMPOSITION (rule of thirds, fast-food setting breathing)
- 5 DYNAMIC ACTION (cheese-pull mid-air, fries falling, shake-pouring — kinetic moments)

━━━ EXAMPLES ━━━

"Intimate eye-level close-up, food filling sixty percent of frame, fast-food setting softly blurred behind"
"Overhead top-down framing, food centered on the tray, sides radiating outward"
"Low hero-up angle gazing upward at the kawaii fast-food, monumental presence"
"Three-quarter lean revealing depth into the fast-food setting behind"
"Off-center rule-of-thirds composition with food in left third, fast-food setting on right"
"Dynamic mid-action framing capturing kawaii cheese-pull or fries-cascade in motion"

━━━ HARD BANS ━━━

- NO specific cameras, lenses, focal lengths
- NO photographer name-drops
- NO lighting / palette / time-of-day language

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
