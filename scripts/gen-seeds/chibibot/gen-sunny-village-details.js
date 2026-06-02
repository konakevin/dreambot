#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/sunny_village_details.json',
  total: 200,
  batch: 25,
  metaPrompt: (
    n
  ) => `You are writing \${n} SUNNY-VILLAGE DETAILS for ChibiBot sunny-village — small lived-in details scattered across the village that make it feel inhabited. Template picks 3 per render.

Each entry: 10-20 words. ONE specific detail. NO creatures, NO main setting, NO activity verbs.

━━━ FORMAT — VISIBLE LIVED-IN SUNNY-VILLAGE DETAIL ━━━

Examples:

✓ "Cascading bougainvillea spilling magenta over a white-washed wall"
✓ "Hanging laundry billowing in warm breeze between balconies"
✓ "Terracotta-pot of geraniums on a sun-baked stone step"
✓ "Blue-painted shutters thrown open on a white cottage"
✓ "Stone-pavement worn smooth, sun-bleached creamy-white"
✓ "Olive-tree silhouette against a cottage wall"
✓ "Drying chili-pepper strings hanging on an adobe wall"
✓ "Fishing-net draped over a wooden dock-railing"
✓ "Painted-tile sign reading TRATTORIA or PESCHERIA"
✓ "Citrus-tree heavy with lemons in a courtyard"

━━━ HARD BANS ━━━

- NO creatures / characters
- NO activity verbs
- NO setting / village descriptions
- NO weather/time-of-day language
- NO snow / NO winter / NO heavy-overcast-gloom / NO underwater — strictly warm Mediterranean / Tuscan / Greek / Moroccan sun-drenched

━━━ OUTPUT ━━━

JSON array of \\${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
