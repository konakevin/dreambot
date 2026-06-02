#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/chef_terrain.json',
  total: 200,
  batch: 18,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} KITCHEN COUNTERTOP / FLOOR / SURFACE textures for a kawaii mini-chef scene. Each entry describes the SURFACE the foods are sitting/standing on (kitchen counter, prep board, kitchen floor, tabletop).

Each entry: 10-18 words. ONE specific surface.

DO write:
- Warm-cedar wooden kitchen counter dusted with flour
- Cool white marble countertop with veining
- Butcher-block wooden prep board worn from use
- Pastel-mint subway-tile floor in classic kitchen pattern
- Polished hardwood farmhouse-kitchen floor
- Black-and-white checkerboard kitchen floor
- Terracotta tile floor in warm clay-red
- Pastel-pink ceramic tile floor with floral border
- Bamboo-mat covered prep surface
- Stainless-steel counter with subtle reflection
- Pastel butter-cream painted wooden countertop
- Mosaic-tile counter in pastel-rainbow chips
- Worn cottage farmhouse-pine kitchen floor
- Soft pastel-blue gingham tablecloth on a wooden table
- Polished sushi-counter in warm cedar wood
- Glossy lacquer tea-table in deep cherry red
- Stone pizza-oven hearth-floor with light ash dusting
- Pastel-cream cottage-kitchen floor with rag-rug
- Floured pastry-board with rolling-pin marks
- Polished granite countertop in pearl-cream

DO NOT write:
- Modern industrial concrete / commercial flooring
- Dirty / cracked / dingy surfaces — kawaii bright clean
- Pathway / RECEDING surface — terrain is a CARPET / COUNTERTOP not a leading line
- Foreground characters

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
