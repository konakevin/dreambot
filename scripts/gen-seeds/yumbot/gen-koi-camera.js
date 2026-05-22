#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/koi_camera.json',
  total: 200,
  batch: 18,
  append: true,
  metaPrompt: (n) => `Write ${n} CAMERA FRAMING descriptions for a kawaii Japanese koi-pond scene with 5 kawaii creatures. Diverse framings.

Each entry: 14-22 words.

Distribution:
- 20% MID-DISTANCE WIDE (balanced shot showing creatures + pond + Japanese garden setting)
- 18% EYE-LEVEL INTIMATE (at creature-water-line, foods filling middle-ground)
- 16% OVERHEAD FLATLAY (looking down at the pond from above)
- 14% THREE-QUARTER OVER-POND (3/4 angle looking across the pond surface)
- 10% LOW-ANGLE WATER-LEVEL (just above pond surface looking across)
- 10% MEDIUM CLOSE-UP (tighter on the creature cluster in water)
- 8% WIDE-VISTA (broader establishing shot of the pond + Japanese garden setting)
- 4% BIRDS-EYE FROM HIGH (elevated angle looking down across the entire scene)

DO write things like:
"Mid-distance wide shot showing creatures clustered in pond + Japanese garden visible behind"
"Eye-level at water-line with creatures filling middle-ground, garden softly behind"
"Three-quarter angle over the pond with creatures arranged across the surface"
"Low-angle water-level looking across the pond with creatures + lotus-lanterns visible"

DO NOT write:
- Time-of-day / weather / lighting direction
- Setting / activity / character descriptions

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
