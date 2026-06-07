#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_whimsical_lighting.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} LIGHTING DIRECTIONS for YumBot whimsical-concept renders. Each entry describes a SPECIFIC LIGHT QUALITY tuned for the whimsical sub-themes (with-pets / fashion-show / spa / orchestra / school / and-toys).

Each entry: 14-22 words. ONE specific lighting direction (source + quality + tint).

━━━ DISTRIBUTION ━━━

- 4 STUDIO RUNWAY LIGHT (clean key + back-rim, fashion-show-coded)
- 4 STAGE SPOTLIGHT (single warm pool, orchestra-coded)
- 4 SOFT BATHHOUSE GLOW (warm steamy diffused, spa-coded)
- 4 CLASSROOM WINDOW LIGHT (clear bright morning, school-coded)
- 4 COZY HOME LIGHT (warm lamp + ambient, with-pets and and-toys coded)
- 5 PLAYFUL OVERHEAD GLOW (top-down soft fill, generic-whimsical-coded)

━━━ EXAMPLES ━━━

"Clean runway studio key from above with back-rim halo, soft drop shadow"
"Single warm stage spotlight pooling on the subject with deep dim surround"
"Soft warm diffused bathhouse glow with steamy haze and gentle wraparound fill"
"Clear bright morning classroom window light streaming from camera-left with warm fill"
"Cozy home lamp glow from the side, warm amber ambient room light"
"Playful overhead diffused glow with soft fill on all sides, no harsh shadows"

━━━ HARD BANS ━━━

- NO photographer name-drops, NO camera specs, NO lens language
- NO color palette names ("pastel-pink palette") — palette is its own axis
- NO time-of-day labels ("sunrise") — time-of-day is its own axis
- NO mood adjectives ("dreamy")

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
