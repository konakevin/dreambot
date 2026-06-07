#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_fruits_veggies_cameras.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} CAMERA / FRAMING DIRECTIONS for YumBot fruits-and-veggies renders. Tuned for organic-environment scenes (garden / tree / vine / basket / forest / market).

Each entry: 12-22 words. ONE specific framing.

━━━ DISTRIBUTION ━━━

- 4 OVERHEAD / TOP-DOWN (garden bed / basket from above)
- 4 INTIMATE EYE-LEVEL (close on the kawaii host with friend nearby)
- 4 THREE-QUARTER LEAN (gentle tilt, depth into the setting)
- 4 LOW HERO-UP (looking up at the kawaii fruit on tree / vine)
- 4 SIDE-BY-SIDE (host and friend together at frame center)
- 5 OFF-CENTER (host in one third, friend in opposing third, organic setting breathing)

━━━ EXAMPLES ━━━

"Overhead top-down framing of the garden bed, host centered with friend nestled nearby"
"Intimate eye-level close-up with the kawaii host filling sixty percent of frame, friend in soft focus"
"Three-quarter lean revealing depth into the organic setting behind the host"
"Low hero-up angle gazing upward at the kawaii fruit hanging on the branch"
"Side-by-side centered composition with host and friend at frame center, both visible"
"Off-center rule-of-thirds with host on the left and friend on the right, setting breathing between"

━━━ HARD BANS ━━━

- NO specific cameras, lenses, focal lengths
- NO photographer name-drops
- NO lighting / palette / time-of-day language

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
