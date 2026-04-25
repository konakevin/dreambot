#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/micro_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} LEGO MICRO WORLD scene descriptions for BrickBot. Impossibly tiny LEGO worlds — entire ecosystems or cities on a single baseplate or in a container.

Each entry: 15-25 words. One specific micro world scene.

━━━ SCENE TYPES (mix broadly) ━━━
- Entire city skyline on a single 16x16 baseplate, 1x1 bricks as buildings
- Ecosystem inside a glass jar — tiny trees, pond, creatures
- Desktop world where a pencil is taller than the buildings
- Micro-scale space station orbiting a 2x2 round brick planet
- Tiny village inside a coffee mug, smoke from chimney pieces
- Micro coral reef in a fishbowl, fish smaller than studs
- Complete castle and village on a dinner plate
- Shoebox diorama with micro-scale mountain range and river
- Snowglobe containing micro winter village scene
- Bonsai tree with micro-scale treehouse and tiny inhabitants

━━━ RULES ━━━
- Extreme miniaturization — 1x1 brick = building scale
- Real-world objects for scale reference (finger, coin, pencil)
- Macro lens bokeh, forced perspective
- Complete and alive despite absurd tininess
- No repeats

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
