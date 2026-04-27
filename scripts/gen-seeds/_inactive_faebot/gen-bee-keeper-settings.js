#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/faebot/seeds/bee_keeper_settings.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} FAE BEEKEEPER SETTING descriptions for FaeBot's bee-keeper path. Magical apiaries, cathedral-scale honeycomb hives, amber-lit forest clearings, golden meadows thick with wildflowers and bees. Everything glows gold.

Each entry: 10-20 words. A specific bee-related fantastical environment.

━━━ CATEGORIES TO COVER ━━━
- Cathedral-scale hive built into the hollow of an ancient oak, honeycomb walls glowing amber
- Wildflower meadow at golden hour, thousands of bees visible as floating golden dots
- Cliff face covered in exposed honeycomb, honey streaming down the rock in golden rivers
- Forest clearing with standing-stone hives, each stone hollowed and humming with bees
- Canopy-level hive suspended between branches, wax bridges connecting multiple chambers
- Underground honey cave, stalactites of crystallized honey, pools of liquid amber
- Garden of giant flowers twice human height, bees the size of fists moving between them
- Ancient stone apiary overgrown with flowering vines, dozens of stacked skep hives
- Hollow tree trunk split open, revealing floors of perfect hexagonal honeycomb
- Riverbank where bees drink, the water surface golden with pollen and reflected light
- Ruined temple colonnade where wild bees have built a hive in every column
- Orchard in full bloom, every branch white with blossoms, the air thick with bees

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: hive type (tree/stone/cave/cliff/man-made) + scale (intimate/cathedral).

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
