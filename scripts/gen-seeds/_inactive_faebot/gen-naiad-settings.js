#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/faebot/seeds/naiad_settings.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} NAIAD SETTING descriptions for FaeBot's naiad path. Freshwater forest environments — streams, waterfalls, springs, forest pools, mossy grottos. NOT ocean/saltwater.

Each entry: 10-20 words. A specific freshwater forest water feature.

━━━ CATEGORIES TO COVER ━━━
- Mossy grotto behind a waterfall, ferns dripping, still pool below
- Forest stream over smooth river stones, dappled light through overhanging trees
- Natural hot spring in a clearing, steam rising into cold air
- Ancient stone well in a forest clearing, moss-covered, water perfectly clear
- Waterfall cascade down stepped rocks, each level a shallow pool
- Rain-swollen creek rushing through a ravine, wild and powerful
- Cenote: open sinkhole in limestone with crystal-clear turquoise water
- Beaver dam pond, still mirror-surface reflecting the canopy above
- Sacred spring where water bubbles up from deep underground
- Bog pool with dark peaty water, sphagnum moss, and sundew plants
- Mountain stream at its source: snowmelt trickling from under a glacier
- Forest lake at dawn, mist sitting on the surface like cotton

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: water feature type + flow speed (still/flowing/rushing) + surrounding vegetation.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
