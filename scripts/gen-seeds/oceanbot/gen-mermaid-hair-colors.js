#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/oceanbot/seeds/mermaid_hair_colors.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} MERMAID HAIR COLOR descriptions for OceanBot's mermaid-legend path. JUST the color — no style, no length, no texture, no movement.

Each entry: 2-5 words. A specific hair color only.

━━━ RANGE TO COVER ━━━
Natural human colors: raven black, dark brunette, chestnut brown, auburn, copper red, honey blonde, strawberry blonde, platinum blonde, ash brown, silver-white, ginger
Unnatural/mythical colors: sea-green, deep teal, coral pink, midnight blue, kelp-dark green, pearl white, abalone iridescent, storm gray, foam white, violet, turquoise, deep wine, moonlight silver
Gradient/mixed: dark roots fading to silver tips, auburn streaked with sea-foam green, black with blue-green iridescence

━━━ RULES ━━━
- COLOR ONLY — no adjectives about length, texture, style, or movement
- Every entry is just a hair color description
- Even spread across natural and mythical colors
- No two entries the same color

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
