#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/landscape_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} LEGO LANDSCAPE scene descriptions for BrickBot. Epic natural vistas built from LEGO at micro-scale — mountains, forests, waterfalls, deserts, oceans.

Each entry: 15-25 words. One specific landscape scene.

━━━ SCENE TYPES (mix broadly) ━━━
- Mountain range from grey slope bricks, snow caps from white tiles
- Waterfall cascading down cliff face using transparent blue bricks
- Dense forest of green plant pieces, sunlight through canopy
- Desert with tan plate terrain, mesa formations, tiny cactus pieces
- Ocean waves from blue studs crashing against rocky shoreline
- Volcano erupting with transparent orange and red lava bricks
- Autumn forest with orange, red, yellow leaf pieces
- Frozen tundra with ice crystal transparent pieces, arctic wildlife
- River canyon carved through layered colored brick strata
- Rolling hills with patchwork farmland, tiny windmill, barn

━━━ RULES ━━━
- Micro-scale: tiny minifig or vehicle for scale reference
- Nature as LEGO art — every element is bricks
- Tilt-shift to sell miniature effect
- No repeats

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
