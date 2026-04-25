#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/epic_vistas.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} EPIC WIDE PANORAMIC LANDSCAPE descriptions for EarthBot — jaw-dropping vistas that showcase Earth's most dramatic terrain at maximum scale.

Each entry: 15-25 words. One specific landscape vista. No people, no animals, no structures.

━━━ CATEGORIES (mix across all) ━━━
- Patagonian peaks and glaciers (Torres del Paine, Perito Moreno ice walls, windswept steppe)
- Icelandic coasts and highlands (black sand beaches, moss-covered lava fields, Vatnajokull ice cap)
- Saharan and Namib dunes (star dunes, singing sands, endless ergs, shadow-striped ridgelines)
- Hawaiian volcanic landscapes (fresh lava meeting ocean, Napali cliffs, Haleakala crater)
- Norwegian fjords (sheer cliff walls, mirror-still water, cascading waterfalls into deep channels)
- Zhangjiajie sandstone pillars (towering columns in mist, floating-mountain silhouettes)
- Himalayan panoramas (snow peaks above cloud seas, high-altitude plateaus, glacier valleys)
- Grand Canyon and American Southwest (layered sediment walls, desert mesas, Monument Valley)
- Dolomite spires and Alpine ridges (jagged limestone towers, high meadows below vertical walls)
- New Zealand Southern Alps (turquoise glacial lakes, braided rivers, fiordland rainforest)
- African Rift Valley (vast savannas, volcanic calderas, alkaline lakes)
- Arctic and Antarctic ice (tabular icebergs, ice shelves, polar plateaus under midnight sun)

━━━ RULES ━━━
- WIDE panoramic framing — emphasize scale, depth, and grandeur
- Real-world geography amplified to maximum drama — not fantasy
- Mix golden hour, storm light, dawn, dusk, midday harsh sun across entries
- No two entries should describe the same region or formation
- 15-25 words each — vivid, specific, painterly language

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
