#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/faebot/seeds/nymph_hair.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} FOREST NYMPH HAIR + EYES descriptions for FaeBot. Each entry is a complete head/face description: hair color, texture, length, what's growing through it, AND eye color/quality. She is a woodland spirit so her hair is PART OF THE FOREST and her eyes reflect the forest too. Always feminine, beautiful, and striking.

Each entry: 20-35 words. Covers hair (color + texture + what grows in it) AND eyes (color + quality).

━━━ RANGE TO COVER ━━━
Hair colors: jet black, deep auburn, copper-red, silver-white, mossy green, bark-brown, honey-gold, midnight blue-black, ashen grey, strawberry blonde, chestnut, platinum with green streaks
Hair textures: wild cascading waves, tight ringlets tangled with vines, straight and floor-length, cropped close with moss, braided with living tendrils, windswept and untamed
Growing through hair: tiny wildflowers, fern fronds, ivy tendrils, mushrooms, lichen, dewdrops, autumn leaves, cherry blossoms, seed pods, spider silk threads, moss patches, crystal frost
Eye colors: deep emerald, warm amber, forest-floor brown with gold flecks, pale grey-green, liquid gold, storm-dark with green lightning, violet like woodland orchids, copper-bright, black as rich soil, silver like birch bark, tawny like a fox, glacial blue-green

━━━ RULES ━━━
- Every entry must specify hair COLOR + TEXTURE + FOREST GROWTH + eye COLOR + QUALITY
- Always feminine and beautiful — never gross, matted, or ugly
- No two entries should share the same hair color + eye color combination
- Eyes should feel like they belong to a forest creature — wild, luminous, alive

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
