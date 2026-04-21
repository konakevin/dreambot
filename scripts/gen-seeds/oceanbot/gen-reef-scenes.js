#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/oceanbot/seeds/reef_scenes.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} REEF SCENE descriptions for OceanBot's reef-life path — MAXED-OUT reef + tropical fish abundance. Many fish + many coral species + many colors per frame. Density + movement + sunbeams-through-water.

Each entry: 20-40 words. One specific reef-explosion scene.

━━━ CATEGORIES ━━━
- Schooling jacks swirling around purple-coral pillar with sunbeams
- Butterflyfish cluster around brain-coral with anemones and angelfish mixed
- Nudibranch-explosion across reef wall with countless color-variants
- Clownfish-anemone colony with damselfish and wrasses passing through
- Sunbeam corridor through massive coral garden with parrotfish grazing
- Soft-coral forest swaying with gobies + shrimp + nudibranchs mid-reef
- Multi-story reef cross-section with fish at every level
- Gorgonian-fan wall with schools of barracuda passing
- Tabletop-coral colony with dense fish congregation
- Table-coral garden with blue-tangs cascading across
- Sea-fan forest with queen-angelfish centerpiece
- Pink-coral explosion with rainbow-wrasses + butterflyfish
- Reef-ball cluster with moray-eel + lionfish + damselfish
- Mushroom-coral field with ghost-pipefish hiding
- Brain-coral boulder with cleaning-wrasse station
- Hard-coral garden with schooling snappers overhead
- Staghorn-coral thicket with yellowtail-damsels darting
- Pillar-coral tower with anthias-cloud swarming
- Reef-drop-off with mantas gliding past
- Reef-top at depth with clearfin-shark patrolling
- Coral-crevice cave with glassy-sweepers
- Shallow reef with turtles grazing
- Reef-wall wrasse-cleaning-station
- Reef-plateau with octopus hunting
- Shark-line on reef-edge with fusiliers passing
- Reef-spire with sergeant-major-swarm
- Bubble-coral patch with clownfish-variants
- Whip-coral garden with sea-horses
- Fire-coral colony with butterflyfish
- Banded-cleaning-shrimp on coral-head
- Foxface-rabbitfish school through corals
- Coral-bommie with moray + grouper + shark visible
- Wall-of-soldierfish with reef-drop-off backdrop
- Reef-nursery with juvenile-fish explosion
- Night-reef with blue-ringed-octopus + bioluminescence

━━━ RULES ━━━
- MAX abundance — many species per scene
- Multiple coral types visible
- Sunbeams + particulate + depth
- Density IS the art

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
