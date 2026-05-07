#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/cozy_farming_lighting.json',
  total: 200,
  batch: 50,
  append: false,
  maxTokens: 6000,
  metaPrompt: (n) => `Write ${n} LIGHTING descriptions for PixelBot's cozy-farming-life-sim path. Each entry is 15-30 words describing WARM, INVITING farming/life-sim pixel-art lighting (Stardew Valley + Spiritfarer pixel + Coffee Talk + Animal Crossing pixel + Story of Seasons + Ooblets).

EVERY entry must include:
- WARM, BRIGHT, INVITING — never dim, never threatening
- Specific warm light source (golden-hour sunbeam, sunrise-glow, sunset-amber, fireplace-glow, lit-cottage-window-glow, lantern-strings, candle-glow, hearth-fire, oven-glow)
- Layered atmospheric quality (warm-amber + cool-blue ambient, soft falloff, dappled-leaf-shadow)
- ALWAYS suggests SAFETY and HOMINESS

Examples (write fresh):
- "Golden-hour low-warm-sun spilling across crop-rows, warm-lit farmhouse window in middle-distance, dappled tree-shadow, soft pink-amber afterglow sky."
- "Sunrise pink-and-orange beams cutting across a hen-house doorway, warm interior glow, scattered lantern-light, soft cool-blue ambient at the rooftops."
- "Sunset amber raking across a beachside fish-shack, warm chimney-smoke catching the light, lit interior-window glowing strongest, soft pink afterglow on sand."
- "Fireplace-glow primary light in a winter cabin interior, warm-amber wash on knit blanket and chair, snow drifting outside the window, deep cool-blue exterior."
- "Spring rain greenhouse interior — soft diffused-cloud daylight through dripping glass, warm interior amber-glow, hanging herb-bundle shadows on the wall."
- "Lantern-strings overhead in a summer-festival square, warm orange dancing-light on cobblestones, lit food-cart fire-glow, deep cool blue ambient sky."
- "Autumn-harvest barn glowing warm-amber through the open doorway, golden-hour low sun raking across hay-bales, dappled-leaf shadow on pumpkin-pile."

Output ONLY a valid JSON array of ${n} strings. No preamble, no commentary, no markdown code fences.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
