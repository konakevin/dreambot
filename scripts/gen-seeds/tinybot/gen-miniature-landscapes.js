#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/tinybot/seeds/miniature_landscapes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} MINIATURE LANDSCAPE descriptions for TinyBot's miniature-landscape path — master-modelmaker miniature landscapes. Rolling hills with countable trees, river-bridge, alpine, stone-cottage.

Each entry: 15-30 words. One specific handcrafted miniature landscape.

━━━ CATEGORIES ━━━
- Rolling hills with countable trees and tiny cottage
- Miniature river with stone bridge and moss-banks
- Alpine diorama with tiny chalet and evergreens
- Stone cottage with garden and picket fence
- Miniature seaside cliff with lighthouse
- Tiny mountain pass with sheep and shepherd-hut
- Miniature autumn forest with leaf-strewn path
- Dollhouse-scale Japanese zen-garden
- Tiny countryside with farmhouse and red-barn
- Miniature desert oasis with palm and tent
- Dollhouse-cabin in snowy pine-forest
- Tiny tropical island with palms and beach
- Miniature vineyard with rows of grapes
- Dollhouse-scale Parisian suburb
- Miniature Tuscan hillside with cypress
- Tiny volcano-island with lava visible
- Model river-delta with multiple islets
- Miniature coastal village
- Dollhouse-countryside-road with classic car
- Miniature canyon with river
- Tiny iceberg with polar-bear
- Model windmill and tulip fields
- Miniature Scottish-highland with croft
- Dollhouse-scale valley with waterfall
- Tiny pine-forest with lake
- Miniature cherry-blossom grove
- Model Arctic tundra
- Miniature moor with standing stones
- Dollhouse-scale savanna with umbrella-tree
- Tiny lagoon with coral visible

━━━ RULES ━━━
- Handcrafted / model-maker aesthetic
- Obsessive detail (countable trees, tiles, stones)
- Real geography types miniaturized
- Tilt-shift feel

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
