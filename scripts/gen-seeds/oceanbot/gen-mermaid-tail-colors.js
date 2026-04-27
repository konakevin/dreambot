#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/oceanbot/seeds/mermaid_tail_colors.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} MERMAID TAIL COLOR descriptions for OceanBot's mermaid-legend path. JUST the color and scale appearance — no fin shape, no texture behavior, no movement.

Each entry: 2-6 words. A specific tail color/scale appearance only.

━━━ RANGE TO COVER ━━━
Classic fish colors: emerald green, deep sapphire blue, silver-scaled, bronze, copper, gold
Dark/dramatic: midnight black, deep wine burgundy, obsidian with blue shimmer, charcoal gray
Ocean-inspired: teal, aquamarine, sea-foam green, ocean blue, coral orange, pearl white
Iridescent/shifting: abalone iridescent, opal shifting-colors, rainbow-prismatic, moonstone
Warm tones: amber, rust-copper, burnt sienna, rose gold, sunset orange
Cool tones: arctic blue, violet, lavender-silver, glacier white, steel blue

━━━ RULES ━━━
- COLOR/SCALE APPEARANCE ONLY — no fin descriptions, no movement, no texture behavior
- Even spread across natural fish colors, dramatic darks, and iridescent/mythical
- No two entries the same color

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
