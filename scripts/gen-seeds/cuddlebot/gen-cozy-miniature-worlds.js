#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/cuddlebot/seeds/cozy_miniature_worlds.json',
  total: 200,
  batch: 10,
  append: true,
  metaPrompt: (n) => `You are writing ${n} COZY MINIATURE WORLD descriptions for CuddleBot's cozy-landscape path — tiny magical cozy worlds. Miniature-scale + storybook-warm + wholesome. No creatures needed (setting is hero).

Each entry: 15-30 words. One specific tiny cozy world.

━━━ CATEGORIES ━━━
- Mushroom villages (red-cap houses with chimneys, warm windows)
- Acorn cottages (nestled in moss, tiny doors, smoke from chimney)
- Pillow-fort forests (giant pillow mounds, blanket-tunnel trees)
- Firefly glens (meadow alight with tiny lanterns)
- Teacup gardens (flowers growing out of teacups)
- Book-stack castles (paper-tower keeps)
- Thimble-towns (sewing-scraps for roofs)
- Pumpkin-house orchards (carved homes with tiny doors)
- Seashell bedrooms (curled-up spiral interior)
- Rose-petal bowers (giant flower as house)
- Sugar-cube bakery-villages
- Marshmallow-cloud cottages
- Leaf-boat harbors
- Snow-globe bedrooms (inside a glass dome, snowing)
- Walnut-shell hammock camps
- Hedgehog burrow suites (inside hillside with tiny windows)
- Lantern-strung meadow picnics (just empty cozy scene)
- Candle-lit treehouses
- Bird's-nest tea-rooms (inside woven nest)
- Terrarium-worlds (tiny cozy under glass dome, moss-ground)
- Cloud-island picnic grounds
- Gingerbread villages (sweet storybook)
- Flower-field carnival (tiny rides out of mushrooms)
- Tea-pot houses (spouts as chimneys)
- Book-tree libraries (tree filled with tiny books)

━━━ RULES ━━━
- Tiny-scale + cozy + warm + wholesome
- No creatures needed (setting is hero)
- No humans
- Stylized / storybook / picture-book aesthetic

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
