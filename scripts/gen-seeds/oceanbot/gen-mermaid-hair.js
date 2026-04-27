#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/oceanbot/seeds/mermaid_hair.json',
  total: 100,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} MERMAID HAIR descriptions for OceanBot's mermaid-legend path. Each is a specific hair color + style + texture + how it behaves in water/wind. These are mythical sea creatures — hair can be any color including unnatural.

Each entry: 8-15 words. Color + style + texture + movement.

━━━ RANGE TO COVER ━━━
- Natural human colors: raven black, auburn, copper red, honey blonde, silver-white, chestnut brown, strawberry blonde, platinum, ash brown, dark brunette
- Oceanic fantasy: sea-green, deep teal, pearl white, coral pink, midnight blue, kelp-dark green, foam white, abalone iridescent, storm gray, violet
- Mixed/ombre: dark roots fading to silver tips, red-to-gold gradient, black with bioluminescent streaks
- Styles: long and flowing, wild and tangled, braided with shells, matted with salt, sleek and wet, thick and wavy, thin and ghostly, cropped and wild
- Textures: silk-smooth, rope-thick, seaweed-tangled, foam-light, heavy and dripping
- Water behavior: drifting in current, plastered to shoulders, floating like a halo, streaming behind her, whipping in wind

━━━ DEDUP RULES ━━━
- Deduplicate by: base color + style + length
- NO two entries with the same color AND same style
- At least 40% natural human colors, 40% fantasy/oceanic, 20% mixed

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
