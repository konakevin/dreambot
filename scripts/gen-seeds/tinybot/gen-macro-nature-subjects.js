#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/tinybot/seeds/macro_nature_subjects.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} MACRO NATURE SUBJECT descriptions for TinyBot's macro-nature path — real nature at miniature scale as fantasy-kingdom. Mushroom-house, dewdrop-universe, acorn-pool, moss-forest.

Each entry: 15-30 words. One specific macro-nature scene.

━━━ CATEGORIES ━━━
- Mushroom village with tiny-doors in caps
- Dewdrop universe on spider-web at dawn
- Acorn pool with tiny boats
- Moss forest with tiny creatures
- Snail cathedral (snail shell as grand architecture)
- Fungus gardens with glowing caps
- Leaf-bridge over stream with tiny figures
- Tiny grass-forest with dewdrops as lakes
- Mushroom ring with fairy-lights
- Beetle parade on leaf (fae-style)
- Cocoon-house with tiny window
- Snowdrop kingdom in winter
- Dewdrop on petal reflecting whole garden
- Ant-metropolis underground cross-section
- Butterfly wing close-up as stained-glass cathedral
- Lichen-patch as alien-planet terrain
- Acorn-cup as tiny teacup
- Twig-and-leaf raft on puddle
- Pine-cone castle with tiny bunting
- Bark-texture as cliff-face
- Fern-frond as jungle canopy
- Berry-cluster as fruit-market
- Feather as alien-plume landscape
- Spider-silk bridge with dewdrops
- Pollen-covered bee as knight
- Honeycomb apartment-complex
- Seed-pod spaceship (natural)
- Snail on mushroom (tiny adventurer)
- Tiny frog on lily-pad as pond-king
- Ladybug-on-flower close-up
- Bee-hive cross-section (bustling)
- Mushroom-gills cathedral-like interior
- Dewdrop on thistle at golden-hour
- Daffodil-interior viewed from inside
- Tiny crab on seashell kingdom
- Spiderweb jewelry-box

━━━ RULES ━━━
- Real nature at miniature scale
- Fantasy-kingdom interpretation
- Tiny creatures OK as subjects
- Macro-lens feel

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
