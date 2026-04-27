#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/oceanbot/seeds/mermaid_tail_styles.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} MERMAID TAIL STYLE descriptions for OceanBot's mermaid-legend path. Scale pattern + fin type + surface texture. NO color — color is handled by a separate pool.

Each entry: 8-15 words. Scale pattern + fin style + surface quality.

━━━ SCALE PATTERNS ━━━
- Large armored plate scales like a pangolin
- Tiny overlapping fish-like scales
- Smooth dolphin-skin, almost scaleless
- Rough shark-skin texture with tiny denticles
- Overlapping chain-mail scales like medieval armor
- Wide flat scales like a koi
- Ribbed scales with raised ridges

━━━ FIN TYPES ━━━
- Wide translucent fan fins
- Long trailing gossamer fins like a betta fish
- Spined dramatic fins with sharp rays
- Powerful whale-fluke tail fin
- Delicate lace-like fin edges
- Short sturdy fins like a grouper
- Flowing ribbon fins that trail behind

━━━ SURFACE TEXTURE ━━━
- Bioluminescent veins tracing the scales
- Barnacle-crusted and weathered
- Battle-scarred with old marks
- Pristine and gleaming
- Matte and rough from deep-sea living
- Iridescent sheen catching light

━━━ RULES ━━━
- NO color words (no blue, green, silver, etc.) — color is a separate axis
- Combine one scale pattern + one fin type + one surface quality
- Every entry must be distinct in silhouette
- These are wild sea creatures — vary from elegant to rugged

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
