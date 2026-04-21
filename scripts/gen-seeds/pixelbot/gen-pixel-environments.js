#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/pixel_environments.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} PIXEL ENVIRONMENT descriptions for PixelBot — cross-path backgrounds.

Each entry: 10-20 words. One specific pixel environment/backdrop.

━━━ CATEGORIES ━━━
- Forest (dense pixel-green canopy)
- Mountains (stepped ridge-line)
- Underground (torchlit cave)
- Ocean-coast (pixel waves)
- Volcano (pixel-lava flow)
- Neon-city (cyberpunk sprawl)
- Space-void (starfield)
- Tundra (snow + pine)
- Jungle (thick pixel foliage)
- Desert-dunes (rolling sand)
- Swamp (murky pixel-marsh)
- Cliff-edge (pixel precipice)
- Meadow (pixel grass + flowers)
- Cherry-blossom grove
- Autumn-maple forest
- Frozen lake
- Rocky-shore
- Bamboo forest
- Waterfall cascade
- Ruined-temple overgrown
- Sky-island in clouds
- Underwater reef
- Lava-cavern
- Volcanic-island
- Aurora tundra
- Salt-flat mirror
- Mangrove swamp
- Fossil-dig site
- Sunflower-field
- Canyon-ravine
- Stream-crossing forest
- Thunderstorm plains
- Moonlit graveyard
- Foggy moor
- Castle-courtyard
- Mining-tunnel
- Cottage-garden
- Market-street
- Crystal-cave
- Frozen-waterfall
- Cottage-on-hill
- Lighthouse-cliff
- Mountain-pass
- Starfield-nebula
- Asteroid-belt

━━━ RULES ━━━
- Pixel-art background/environment
- Named specific types
- Scale visible

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
