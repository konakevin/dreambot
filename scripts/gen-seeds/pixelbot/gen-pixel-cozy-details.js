#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/pixel_cozy_details.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} COZY DETAIL descriptions for PixelBot's pixel-cozy path. Each entry is a specific warm, lived-in detail or object cluster that makes a room feel cozy. The ROOM will be picked separately.

Each entry: 8-15 words. One specific cozy detail or object arrangement.

━━━ CATEGORIES TO COVER ━━━
- Warm drinks (steaming mug, tea set, hot cocoa with marshmallows)
- Textiles (quilted blanket draped over chair, knitted socks, fluffy rug)
- Lighting (fairy string lights, candles in jars, warm lamp glow, firelight)
- Books and media (towering book stack, open journal, vinyl record spinning)
- Food (fresh-baked pie cooling, cookie plate, noodle bowl steaming)
- Plants (windowsill herbs, hanging fern, succulent collection)
- Pets/companions (cat curled on cushion, goldfish bowl, sleeping dog)
- Weather outside (rain streaking window, snow falling past glass, fog)
- Clutter (postcards on wall, polaroids on string, art supplies scattered)

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: object category + warmth source (visual/thermal/tactile).

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
