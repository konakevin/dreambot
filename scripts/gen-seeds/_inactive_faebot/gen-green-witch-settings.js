#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/faebot/seeds/green_witch_settings.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} GREEN WITCH SETTING descriptions for FaeBot's green-witch path. Cozy, practical, botanical environments — cottage kitchens, herb gardens, forest workshops, apothecary dens.

Each entry: 10-20 words. A specific cozy herbalist environment.

━━━ CATEGORIES TO COVER ━━━
- Cottage kitchen with herbs hanging from every beam, steam from a cauldron
- Overgrown herb garden with raised beds, stepping stones, and buzzing bees
- Apothecary workshop with hundreds of labeled glass jars on wooden shelves
- Forest clearing with a drying rack of herbs and a smoldering fire pit
- Root cellar lined with preserved foods, dried mushrooms, and tincture bottles
- Windowsill garden overflowing with potted herbs, morning light streaming in
- Greenhouse built from old windows, condensation dripping, tropical plants inside
- Market stall at a village edge, bundles of dried herbs and charm bags for sale
- Wooden porch of a forest cottage draped in wisteria and climbing roses
- Stream bank where water-loving herbs grow wild: mint, watercress, valerian
- Cluttered desk covered in open herbalism books, pressed flowers, and ink bottles
- Moss-covered stone bridge where she gathers water-margin plants

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: workspace type (cottage/garden/forest/market) + plant density + coziness level.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
