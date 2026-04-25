#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/oceanbot/seeds/coastal_cliffs.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} DRAMATIC COASTLINE descriptions for OceanBot. Jagged cliffs, crashing waves, lighthouses, sea caves, tide pools, hidden coves — where land meets ocean violently and beautifully. Global locations.

Each entry: 15-25 words. One specific coastal scene.

━━━ CATEGORIES (mix across all) ━━━
- Jagged basalt cliffs with massive waves exploding against them in white spray
- Lighthouses on rocky promontories with storm waves reaching toward the lantern
- Sea caves with turquoise water surging inside, light filtering from above
- Tide pools teeming with starfish, anemones, and urchins at low tide
- Hidden coves accessible only at low tide, surrounded by towering cliffs
- Stormy shores with spray reaching hundreds of feet up cliff faces
- Sea stacks standing alone against relentless surf
- Natural stone arches with waves crashing through
- Blowholes erupting with pressurized seawater on incoming swells
- Cliffs of Moher, Ireland — vertical walls into Atlantic chaos
- Norwegian fjord walls dropping straight into deep emerald water
- Big Sur coastline with fog rolling over redwood-topped cliffs

━━━ RULES ━━━
- LAND MEETS OCEAN — always both elements, dramatic interaction
- Global variety — Ireland, Norway, Big Sur, Patagonia, Iceland, Japan, New Zealand, etc.
- Specific geological features, not generic "rocky coast"
- No repeats — every entry a unique coastline moment
- Vivid, cinematic language

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
