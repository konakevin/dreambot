#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/faebot/seeds/forest_season.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} FOREST SEASON descriptions for FaeBot. Each entry describes a specific seasonal moment in an enchanted forest — not just "spring" but a vivid snapshot of what the forest looks and feels like at that exact moment.

Each entry: 10-20 words. A specific seasonal forest moment.

━━━ CATEGORIES TO COVER ━━━
- Early spring: first buds breaking through snow, snowdrops, ice-melt streams
- Full spring: everything in bloom, pollen clouds, nesting birds, soft rain
- Early summer: thick canopy, long golden evenings, buzzing insects, warm shade
- High summer: heat haze, dense undergrowth, thunderstorm brewing, wildflower peak
- Late summer: heavy fruit, dry leaves underfoot, amber light, crickets
- Early autumn: first color change, morning mist, spider webs with dew
- Peak autumn: full color explosion, carpet of red-gold leaves, harvest moon
- Late autumn: bare branches appearing, cold rain, last leaves falling
- Early winter: first frost on everything, breath visible, silent forest
- Deep winter: heavy snow on branches, frozen streams, short gray days
- Midwinter thaw: icicles dripping, patches of green under melting snow

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: season phase + weather + dominant sensory detail.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
