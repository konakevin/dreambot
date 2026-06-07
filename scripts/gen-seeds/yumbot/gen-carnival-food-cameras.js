#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_carnival_food_cameras.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} CAMERA / FRAMING DIRECTIONS for YumBot carnival-food renders. Tuned for carnival contexts (booth / cart / midway / Ferris-wheel hint).

Each entry: 12-22 words. ONE specific framing.

━━━ DISTRIBUTION ━━━

- 4 INTIMATE EYE-LEVEL (food filling 60% of frame, carnival booth blurred behind)
- 4 LOW HERO-UP (looking up at the carnival food, monumental presence)
- 4 THREE-QUARTER LEAN (slight tilt revealing depth + carnival context)
- 4 OFF-CENTER (rule of thirds, carnival setting breathing)
- 4 OVERHEAD (top-down on the food and booth surface)
- 5 WIDE BOOTH-VIEW (showing carnival booth + food in context with awning + string-lights)

━━━ EXAMPLES ━━━

"Intimate eye-level close-up, food filling sixty percent of frame, carnival booth blurred behind"
"Low hero-up angle gazing upward at the carnival food, awning + string-lights above"
"Three-quarter lean revealing depth into the carnival setting behind"
"Off-center rule-of-thirds with food in left third, carnival booth breathing on right"
"Overhead top-down framing of the food and booth surface"
"Wide booth-view framing showing food + striped awning + string-lights in context"

━━━ HARD BANS ━━━

- NO specific cameras, lenses, focal lengths
- NO photographer name-drops
- NO lighting / palette / time-of-day language

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
