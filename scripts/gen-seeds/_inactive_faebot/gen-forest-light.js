#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/faebot/seeds/forest_light.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} FOREST LIGHTING descriptions for FaeBot. Each entry describes a specific way light behaves in an enchanted forest — how it enters, what it illuminates, what mood it creates.

Each entry: 10-20 words. A specific forest lighting condition.

━━━ CATEGORIES TO COVER ━━━
- Dappled sunlight through a dense canopy, coin-sized spots on the forest floor
- Golden hour side-light streaming horizontally through tree trunks
- Moonlight filtering through bare branches, silver-blue on the ground
- Bioluminescent glow from fungi and insects, no other light source
- Misty morning with diffused white light and no shadows
- Firefly swarm creating hundreds of tiny moving light points
- Storm light: dark clouds above but a single shaft of sun breaking through
- Candlelight / lantern glow in an otherwise dark forest
- Underwater caustics in a forest pool reflecting ripples onto overhanging leaves
- Starlight only: clear night sky visible through a gap in the canopy
- Sunset glow turning everything amber and crimson through autumn leaves
- Overcast soft light with no shadows, everything evenly illuminated

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: light source + color temperature + shadow quality.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
