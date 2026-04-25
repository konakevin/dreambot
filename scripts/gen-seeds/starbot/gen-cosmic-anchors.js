#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/cosmic_anchors.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} FOREGROUND ANCHOR ELEMENTS for cosmic vista scenes in StarBot. Each is a physical object or structure that sits in the FOREGROUND or MIDGROUND of a vast cosmic scene, giving it SCALE and GROUNDING. 15-25 words each.

━━━ WHAT THESE ARE ━━━
The thing in the FOREGROUND that makes the cosmic background feel IMPOSSIBLY VAST. Without an anchor, a nebula is just a pretty gradient. WITH an anchor — a tiny space station silhouetted against it, a derelict ship drifting past, an asteroid catching light — suddenly the nebula is ENORMOUS and the viewer feels SMALL.

These are NOT the main subject. The cosmic phenomenon IS the subject. These anchors provide SCALE and COMPOSITION.

━━━ ANCHOR CATEGORIES (spread EVENLY — max 2 per category) ━━━
1. Space station/outpost — orbital platform, research station, beacon relay, refueling depot
2. Derelict/wreckage — ancient ship hulk, shattered hull, debris field, abandoned probe
3. Asteroid/rock — cratered boulder, crystalline asteroid, tumbling rock catching light
4. Ship silhouette — distant vessel, approaching freighter, patrol craft, generation ship
5. Planetary element — planet's curved horizon, ring system edge, moon's surface, atmosphere limb
6. Megastructure fragment — Dyson ring segment, orbital elevator cable, broken space elevator
7. Natural formation — ice comet trailing gas, rogue planet, brown dwarf, stellar remnant
8. Satellite/probe — ancient survey probe, communications array, telescope platform
9. Gateway/portal — warp gate frame, jumpgate ring, gravitational lens structure
10. Organic/alien — living reef structure, bioluminescent organism, cosmic jellyfish, space whale silhouette

━━━ DEDUP ━━━
No two anchors should be the same type of object. Each must create a DIFFERENT silhouette shape against the cosmic background. Spread sizes: some tiny (probe), some medium (ship), some massive (megastructure fragment).

━━━ RULES ━━━
- Describe the OBJECT only — no cosmic background (separate pool)
- Include physical detail Flux can render: surface texture, light interaction, scale hints
- These sit in FOREGROUND — they catch light, cast shadow, have visible detail
- 15-25 words per entry

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
