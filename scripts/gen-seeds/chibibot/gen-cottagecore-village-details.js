#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/cottagecore_village_details.json',
  total: 200,
  batch: 25,
  metaPrompt: (
    n
  ) => `You are writing \${n} COTTAGECORE-VILLAGE DETAILS for ChibiBot cottagecore-village — small lived-in details scattered across the village that make it feel inhabited. Template picks 3 per render.

Each entry: 10-20 words. ONE specific detail. NO creatures, NO main setting, NO activity verbs.

━━━ FORMAT — VISIBLE LIVED-IN COTTAGECORE-VILLAGE DETAIL ━━━

Examples:

✓ "Cottage-garden roses climbing a stone-wall in full bloom"
✓ "Hanging laundry on a clothesline, soft pastel fabrics waving"
✓ "Window-box of pink geraniums under a leaded-glass window"
✓ "Stone-pavement with moss between the cracks"
✓ "Lavender-bunches drying upside-down on a wooden porch beam"
✓ "Honey-pot on a cottage windowsill with a wooden spoon"
✓ "Bicycle leaning against a stone-cottage wall, basket of flowers"
✓ "Beehive (wooden bee-skep) surrounded by fluttering bees"
✓ "Wisteria-flowers dripping from an arched cottage-doorway"
✓ "Apple-tree branch laden with fruit overhanging a cottage roof"

━━━ HARD BANS ━━━

- NO creatures / characters
- NO activity verbs
- NO setting / village descriptions
- NO weather/time-of-day language
- NO snow / NO desert / NO underwater / NO ultra-modern architecture

━━━ OUTPUT ━━━

JSON array of \\${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
