#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/chef_camera.json',
  total: 200,
  batch: 18,
  append: true,
  metaPrompt: (n) => `Write ${n} CAMERA FRAMING descriptions for a kawaii mini-chef kitchen scene with 5 kawaii chef-foods. Diverse framings.

Each entry: 14-22 words. ONE specific camera framing.

Distribution:
- 22% OVERHEAD FLATLAY (looking straight down at the cooking spread)
- 18% EYE-LEVEL INTIMATE (at character-height, foods filling middle-ground)
- 14% THREE-QUARTER CHARACTER-LEVEL (3/4 angle across counter)
- 12% MID-DISTANCE WIDE (balanced shot showing foods + kitchen)
- 10% LOW-ANGLE HERO (ground-level looking up at the chefs)
- 10% MEDIUM CLOSE-UP (tight on the cluster)
- 8% BIRDS-EYE FROM HIGH (elevated angle looking down)
- 6% OVER-THE-SHOULDER (perspective from behind one chef-food)

DO write things like:
"Overhead flatlay looking straight down at the kitchen counter with chef-foods arranged below"
"Eye-level intimate framing at chef-character-height, kitchen wrapping behind"
"Three-quarter angle from chef-counter level, scene framing the foods cleanly"

DO NOT write:
- Time-of-day / weather / lighting direction
- Setting / activity / character descriptions

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
