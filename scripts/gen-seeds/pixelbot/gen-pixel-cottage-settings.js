#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/pixel_cottage_settings.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} PIXEL COTTAGE/VILLAGE SETTING descriptions for PixelBot's pixel-cottage path. Retro RPG village energy — Stardew Valley, JRPG towns, Link to the Past villages, Chrono Trigger hamlets. Each entry is a specific cozy village LOCATION. The lived-in details will be picked separately.

Each entry: 10-20 words. A specific retro-RPG-style village or cottage location.

━━━ CATEGORIES TO COVER ━━━
- Thatched-roof cottages (stone walls, flower boxes, chimney smoke)
- Village streets (cobblestone lanes, lantern-lit paths, wooden bridges)
- Village squares (fountain plaza, notice board, well, market cross)
- Shops and services (blacksmith, potion shop, inn/tavern, general store)
- Waterfront (fishing dock, riverside mill, canal houses, lighthouse)
- Farms and gardens (pixel crop rows, chicken coop, orchard, greenhouse)
- Elevated views (hilltop chapel, windmill ridge, castle town overlook)
- Seasonal variants (snow-covered village, autumn harvest, spring bloom, rainy day)
- Forest-edge (mushroom house, woodcutter cabin, forest shrine, hidden path)

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: building/area type + season/weather.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
