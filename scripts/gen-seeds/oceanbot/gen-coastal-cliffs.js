#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
const { BLOWN_UP_OCEAN_ENTRY_MANDATE } = require('../../lib/blownUpSeedMandate');
generatePool({
  outPath: 'scripts/bots/oceanbot/seeds/coastal_cliffs.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} DRAMATIC COASTLINE descriptions for OceanBot — BLOWN UP to AI-impossible levels. Jagged cliffs, crashing waves, lighthouses, sea caves, tide pools, hidden coves — where land meets ocean violently and beautifully, compounded with stacked extreme phenomena. Global locations.

Each entry: 28-40 words. One specific coastal scene with 3+ stacked extreme phenomena.

${BLOWN_UP_OCEAN_ENTRY_MANDATE}

━━━ CATEGORIES (mix across all) ━━━
- Jagged basalt cliffs + waves exploding against them + double-rainbow forming in spray + godrays through storm clouds
- Lighthouses on rocky promontory + storm wall on one side + sunlit calm on the other + aurora overhead
- Sea caves with turquoise water surging inside + caustic light from above + bioluminescent plankton glowing in shadow
- Tide pools teeming with starfish + caustic-net dancing on floor + impossible 6-color sunset reflected
- Sea-stacks behind sea-stacks behind sea-stacks + depth-on-depth dissolving into mist + multi-moon sky
- Hidden coves with cathedral-scale tide-pool + reef visible inside + sky-storm reflected on glass surface
- Stormy shores + spray climbing hundreds of feet + lightning fork + sun blasting hole through cloudbase
- Natural stone arches + waves crashing through + sunset blasting through translucent water + bioluminescent foam
- Blowholes erupting + spray catching multi-rainbow refraction + storm cell on horizon
- Cliffs of Moher-energy vertical walls + Atlantic chaos + galaxy-arm visible at indigo zenith above
- Norwegian fjord walls + emerald water + waterfall pouring straight off cliff into surf line
- Big Sur-energy cliffs + redwood canopy + fog rolling in + godrays + bioluminescent shoreline at twilight
- Iceland basalt columns + black sand + aurora reflecting on wet rock + multi-moon sky
- Patagonia-energy cliffs + cathedral spray-pillar + cloud-leviathan drifting + impossible color stacking

━━━ RULES ━━━
- LAND MEETS OCEAN — always both elements, dramatic interaction
- Global variety — Ireland, Norway, Big Sur, Patagonia, Iceland, Japan, New Zealand, etc.
- 3+ stacked extreme phenomena per entry
- Specific geological features, not generic "rocky coast"
- No repeats — every entry a unique coastline moment
- Vivid, cinematic language

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
