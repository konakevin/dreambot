#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/festival_camera.json',
  total: 200,
  batch: 18,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} CAMERA FRAMING descriptions for a kawaii Japanese matsuri (festival) scene. Each entry describes ONE specific camera angle/framing.

Each entry: 14-22 words. ONE specific camera framing. Diverse — mix wide / overhead / eye-level / low-angle / medium close-up.

Distribution (rough):
- 18% OVERHEAD FLATLAY (looking straight down at the group of 5 foods + their setup)
- 16% EYE-LEVEL INTIMATE (at character-height, foods filling middle-ground)
- 14% THREE-QUARTER CHARACTER-LEVEL (3/4 angle across the scene)
- 12% MID-DISTANCE WIDE (balanced shot showing foods + setting)
- 10% LOW-ANGLE HERO (ground-level looking up at foods + architecture)
- 10% WIDE-VISTA (broader establishing shot of foods in matsuri setting)
- 8% MEDIUM CLOSE-UP (tighter on the foods cluster)
- 6% BIRDS-EYE FROM HIGH (looking down at the scene from elevated angle)
- 6% OVER-THE-SHOULDER (perspective from behind one food looking across)

DO write things like:
"Overhead flatlay looking straight down at the 5 foods arranged in symmetric composition below"
"Eye-level intimate framing at character-height, foods in middle-ground, setting wrapping behind"
"Three-quarter angle from character-level, scene framing the 5 foods cleanly across the middle"
"Low-angle hero shot from the matsuri ground looking up at the foods and festival architecture"

DO NOT write:
- Time-of-day words (golden hour, sunset, etc — separate axis)
- Weather descriptors
- Lighting direction
- Setting / activity / character descriptions

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
