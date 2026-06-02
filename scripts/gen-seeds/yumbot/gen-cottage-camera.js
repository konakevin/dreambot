#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/cottage_camera.json',
  total: 200,
  batch: 18,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} CAMERA FRAMING descriptions for a kawaii cottagecore-nature scene with 5 kawaii foods. Diverse framings.

Each entry: 14-22 words.

Distribution:
- 22% OVERHEAD FLATLAY (looking straight down at the spread/blanket)
- 18% EYE-LEVEL INTIMATE (at character-height, foods filling middle-ground)
- 14% THREE-QUARTER CHARACTER-LEVEL (3/4 angle across the scene)
- 12% MID-DISTANCE WIDE (balanced shot showing foods + setting)
- 10% LOW-ANGLE HERO (ground-level looking up at foods + nature canopy)
- 10% WIDE-VISTA (broader establishing shot of cottagecore landscape)
- 8% MEDIUM CLOSE-UP (tight on the cluster)
- 6% BIRDS-EYE FROM HIGH (elevated angle)

DO write things like:
"Overhead flatlay looking straight down at the picnic blanket with foods arranged below"
"Eye-level intimate framing at character-height, cottagecore setting wrapping behind"
"Three-quarter angle at character-level, foods cleanly in middle-ground with wildflowers framing"

DO NOT write:
- Time-of-day / weather / lighting direction
- Setting / activity / character descriptions

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
