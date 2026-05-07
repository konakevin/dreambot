#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/classic_jrpg_lighting.json',
  total: 200,
  batch: 50,
  append: false,
  maxTokens: 6000,
  metaPrompt: (n) => `Write ${n} LIGHTING descriptions for PixelBot's classic-jrpg path (Zelda LttP / FF VI / Chrono Trigger / Secret of Mana / Earthbound / Lufia II 16-bit-era top-down JRPG aesthetic — used as inspiration only, never named in output).

Each entry is 15-30 words. EVERY entry must include:
- CLASSIC JRPG LIGHT SOURCE — golden-hour sunshine / dawn-pearl morning / dusk-amber sunset / moonlit-blue night / torch-glow on stone / candle-glow in inn / fireplace-glow in cottage / bioluminescent fungi-glow / magical rune-glow / crystal-cavern refraction / lava-glow / aurora-magic / sacred-grove rune-light
- SATURATED SNES-ERA palette — emerald-greens / royal-blues / desert-ambers / castle-grays / dungeon-violets / golden-glow / sunshine-yellow / royal-purple / forest-greens
- 16-BIT CHUNKY PIXEL feel — visible dithered shadow edges, no smooth gradients

Examples (write fresh):
- "Golden-hour sunshine across the grass-plain, dappled tree-shadows on tile-floor, warm-yellow rim-light on hero sprites, soft pastel-cyan ambient sky, dithered grass-shadow edges."
- "Torch-glow flickering orange-amber on dungeon stone-tiles, deep blue-black shadow corners, dithered tile-edge shadows, drifting dust-mote highlights catching the torchlight."
- "Moonlit night over the haunted village, cool silver-blue light on cobblestones, warm-yellow lit-window glow from huts, deep blue-purple ambient sky, dithered shadow gradients."
- "Magical rune-glow pale-violet pulsing on sacred-grove tile-floor, deep emerald-green forest ambient, warm-amber wall-torch counter-light, dithered atmospheric depth."
- "Sunset golden-amber raking across desert sand-tiles, warm-orange rim-light on palm-trees and oasis-shrine, deep purple-shadow ambient, dithered dune-edge shadows."
- "Lava-glow orange-red rising from molten cracks in volcanic-cave tile-floor, drifting embers catching the light, deep blue-black ambient, dithered cave-shadow gradients."
- "Crystal-cavern refraction prismatic on stone-tiles, deep blue-violet ambient, dithered rainbow-edge shadows, warm-amber crystal-glow rim-light on hero sprites."

Output ONLY a valid JSON array of ${n} strings. No preamble, no commentary, no markdown code fences.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
