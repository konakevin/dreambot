#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_whimsical_cameras.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} CAMERA / FRAMING DIRECTIONS for YumBot whimsical-concept renders. Each entry is one specific framing — focal length implied by intimacy + angle + what fills the frame. Tuned for whimsical concept scenes (food on runways / at spas / playing orchestra / etc.) so framings cover both intimate single-subject and small-ensemble compositions.

Each entry: 12-22 words. ONE specific framing direction.

━━━ DISTRIBUTION ━━━

- 4 STAGE-FRONT / RUNWAY-SIDE (catwalk-style side-on, ensemble-spread)
- 4 OVERHEAD / FLAT-LAY (spa-tub-from-above, picnic-from-above)
- 4 LOW HERO-UP (looking up at the food-character with dramatic compact presence)
- 4 INTIMATE EYE-LEVEL (face-to-face with the kawaii subject)
- 4 OFF-CENTER COMPOSITIONS (rule-of-thirds, negative space)
- 5 MEDIUM-WIDE ENSEMBLE (showing food + companions + setting context)

━━━ EXAMPLES ━━━

"Side-on runway framing tracking the food-character mid-stride, shallow depth behind"
"Overhead spa-tub composition looking down on the kawaii subject and bubble layer"
"Low hero-up angle gazing upward at the food-character from below for monumental presence"
"Intimate eye-level portrait of the kawaii subject filling sixty percent of frame"
"Off-center rule-of-thirds composition with negative space breathing on one side"
"Medium-wide ensemble framing showing the food-character with companions and full setting"

━━━ HARD BANS ━━━

- NO specific cameras, lenses, focal-length numbers (50mm / 85mm / etc.)
- NO photographer name-drops
- NO lighting / palette / time-of-day language

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
