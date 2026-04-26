#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/pixel_pretty_settings.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} PRETTY SETTING descriptions for PixelBot's pixel-pretty path. Each entry is a LOCATION/ENVIRONMENT — pure scenery, no characters, no action. The visual element that goes INTO the scene will be picked separately.

Each entry: 10-20 words. A specific beautiful natural or architectural setting.

━━━ CATEGORIES TO COVER ━━━
- Mountain vistas (alpine lakes, snow peaks, cloud passes)
- Water features (waterfalls, rivers, coastal cliffs, koi ponds)
- Forest types (bamboo, cherry-blossom, autumn maple, misty rainforest)
- Flower fields (lavender, sunflower, wildflower meadow)
- Sky phenomena (aurora, nebula sky, sunset, starfield)
- Desert/canyon (red rock, dunes, oasis)
- Winter scenes (frozen lake, snow-pine, ice cave)
- Asian landscapes (rice terraces, torii gate path, zen garden)

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: terrain type + time of day. Two mountain scenes at different times = OK. Two mountain-at-sunset = too similar.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
