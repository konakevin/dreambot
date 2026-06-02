#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/coquette_camera.json',
  total: 100,
  batch: 18,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} CAMERA FRAMING descriptions for a kawaii coquette food-party scene with 5 foods. Diverse framings.

Each entry: 14-22 words.

Distribution:
- 22% OVERHEAD FLATLAY
- 18% EYE-LEVEL INTIMATE
- 14% THREE-QUARTER CHARACTER-LEVEL
- 12% MID-DISTANCE WIDE
- 10% LOW-ANGLE HERO
- 10% MEDIUM CLOSE-UP
- 8% BIRDS-EYE FROM HIGH
- 6% OVER-THE-SHOULDER

DO write things like:
"Overhead flatlay looking straight down at the pink coquette tabletop with foods arranged below"
"Eye-level intimate framing at character-height, coquette boudoir wrapping behind"
"Three-quarter angle at character-level, foods cleanly in middle-ground"

DO NOT write:
- Time-of-day / weather / lighting direction
- Setting / activity / character descriptions

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
