#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/pixel_pretty_elements.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} PRETTY VISUAL ELEMENT descriptions for PixelBot's pixel-pretty path. Each entry is a specific beautiful visual detail or natural phenomenon that brings a scene to life. The SETTING will be picked separately — your job is the visual element only.

Each entry: 8-15 words. One specific pretty visual detail.

━━━ CATEGORIES TO COVER ━━━
- Falling things (cherry petals, autumn leaves, snowflakes, fireflies, lanterns)
- Water movement (gentle ripples, cascading mist, rain on surface, tide pools)
- Light phenomena (god rays through canopy, lens flare, light shafts in fog)
- Flora details (moss on stones, lily pads, wisteria draping, mushroom clusters)
- Atmospheric particles (pollen drift, dandelion seeds, dust motes in light)
- Reflections (mirror lake, wet stone, morning dew on web)
- Wildlife accents (butterflies, dragonflies, birds in distance, koi)

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: element type + movement quality. Two different falling elements = OK. Two "petals drifting" variants = too similar.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
