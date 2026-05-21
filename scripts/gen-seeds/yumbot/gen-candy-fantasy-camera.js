#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/candy_fantasy_camera.json',
  total: 200,
  batch: 18,
  append: true,
  metaPrompt: (n) => `You are writing ${n} CAMERA COMPOSITIONS for YumBot candy-fantasy — Wreck-It-Ralph Sugar Rush world. Each entry describes a CAMERA FRAMING — angle, distance, perspective. The scene-type axis drives WHAT the scene is; this axis drives HOW it's framed.

Each entry: 14-22 words. ONE specific camera framing.

━━━ DISTRIBUTION (diverse framings, NOT all wide-vista) ━━━

- 18% OVERHEAD FLATLAY (7) — overhead bird's-eye flat-lay looking straight down at the spread / blanket / tabletop, characters arranged below in symmetric composition
- 16% EYE-LEVEL INTIMATE (6) — eye-level intimate framing at character-height showing the gathering up close, characters in middle-ground, soft background bokeh
- 14% THREE-QUARTER CHARACTER-LEVEL (6) — three-quarter angle at character-level looking across the scene, characters in middle-ground with setting framing them
- 12% MID-DISTANCE WIDE (5) — mid-distance shot showing characters AND surrounding setting in balanced composition, neither tight nor sweeping
- 10% WIDE-VISTA ESTABLISHING (4) — wide establishing shot of the candy-landscape with characters as small inhabitants within the larger scene
- 10% LOW-ANGLE HERO (4) — low-angle hero shot from ground-level looking up at the characters and the candy-architecture behind them
- 8% MEDIUM CLOSE-UP (3) — medium close-up framing centered on the hero character and immediate companions, candy-setting softly blurred behind
- 6% BIRDS-EYE VILLAGE (2) — slightly elevated angle looking down at the village/scene cluster from above, characters visible in the cluster below
- 6% OVER-THE-SHOULDER (3) — over-the-shoulder perspective from behind one character looking toward the rest of the gathering across the scene

━━━ HARD MANDATES ━━━

- DIVERSE framings — only ~10% are wide-vista, most are intimate / overhead / character-level
- Each camera framing should READ DIFFERENTLY from the others — variety is the entire point
- Sugar Rush kawaii feel maintained
- NO time-of-day, NO lighting direction, NO weather mention
- NO setting / activity / character description (those are other axes)

━━━ HARD BANS ━━━

- NO defaulting to "wide-vista of candy-world" — this was the failure mode of the previous pool
- NO time-of-day words (golden hour, dusk, etc.)
- NO weather descriptors
- NO specific scene activities (picnic, village — those are in scene-type axis)

━━━ OUTPUT ━━━

JSON array of \${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
