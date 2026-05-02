#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/explorer_alien_locations.json',
  total: 25,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} ALIEN-PLANET LOCATION entries for StarBot's female-explorer and male-explorer paths. Each entry is a DENSE phrase (20-35 words) describing a SPECIFIC alien-world location where the explorer is CANDID — out in the wild, on the surface, in an alien environment.

These are PLACES, not actions. The character will be IN this place, doing something peaceful. The location is the BACKDROP that places the explorer in deep space, on a strange world.

CRITICAL: Avoid generic "rocky planet" descriptions. These are MEMORABLE alien worlds. Think Avatar / Mass Effect uncharted worlds / Dune Arrakis / No Man's Sky / Star Trek away-mission / Star Wars unique planets / Annihilation alien biome / Prometheus uncharted moon. Strange, beautiful, unique.

━━━ LOCATION SPREAD (enforce variety across ${n}) ━━━

BIOLUMINESCENT (5-6):
- glowing forest of giant translucent fungus-trees pulsing soft cyan, spore-drift floating in the still air, dual moons overhead through the canopy
- bioluminescent meadow stretching to the horizon, blue-glowing flowers waving in alien wind, three small moons rising in formation
- cave system lit by veins of pulsing magenta crystal that hum softly, water dripping from stalactites, faint atmospheric haze
- alien rainforest with hanging vines that emit soft pink luminescence, exotic insects drifting like floating lanterns, twin suns through canopy gaps
- shoreline of a glowing-plankton ocean at dusk, water lapping with electric-blue trails, alien gulls wheeling overhead

CRYSTAL / GEOMETRIC (3-4):
- vast crystalline desert with prismatic shards rising from the dunes, refracting the planetary star into rainbow patterns across the sand
- canyon carved through living crystal, walls glowing internally with veins of light, the rare planetary sun beaming through narrow gaps
- field of geometric crystal formations rising from frozen ground, alien snow drifting between the prisms, ringed planet looming low overhead
- crystal-shore of a frozen alien lake, geometric ice-formations like cathedral spires, faint aurora dancing above

ICE / FROZEN (3):
- ice plain stretching to mountains under a low alien sun, breath visible in the cold thin air, footprints behind in fresh frost
- glacial cliff carved into otherworldly architectural shapes by alien wind, ice-blue light filtering through translucent depths, ringed planet rising
- frozen alien tundra with strange ice-mounds glowing from within, distant volcano-mountain venting steam, twin moons above

DESERT / ARID (3):
- red-sand desert with twin suns at the horizon, wind-carved rock formations like cathedrals, atmospheric heat-haze softening distance — Dune-coded
- rust-colored canyonland under a pale-yellow sky, mesa-formations stretching to a distant alien city silhouette, hot wind lifting dust
- crystalline-glass desert flat with a salt-pan plain, hexagonal patterns visible in the surface, ringed planet rising at dusk

OCEANIC / WATER (2-3):
- alien beach where the ocean glows with bioluminescent waves at twilight, smooth black volcanic sand, twin moons reflected in wet sand
- coastal cliff overlooking an alien sea with floating-island archipelago in the distance, gas giant filling half the sky, gentle ocean breeze
- shoreline of a methane-and-amber sea, vapor rising as gentle mist, ringed planet at the horizon, exotic shore-creatures distant

SKY / FLOATING (2-3):
- mountain peak plateau with cloud-sea below, distant island-mountains floating between layers, dual moons above the clouds — Avatar-coded
- floating-rock plateau in upper atmosphere of a gas giant, vast curving horizon below, lightning storms rolling far beneath
- canyon of giant floating-mountains connected by natural rock-bridges, alien windflyer creatures distant, sun setting through the gaps

VOLCANIC / EXTREME (2):
- obsidian-glass volcanic plain with magma vents glowing red, sulfur-yellow sky, distant eruption columns rising on the horizon
- caldera-rim overlook with a churning lava-lake far below, sulphur-yellow atmospheric haze, alien-sun glaring through the smoke

RUINS / ANCIENT ALIEN (2-3):
- ruins of a precursor-alien city overgrown with strange flora, monumental stone pillars carved with unknown glyphs, twin suns through broken arches
- abandoned alien temple complex on a high plateau, columns wrapped in glowing vines, distant moon hanging huge in the sky
- excavation site of an ancient alien dig, scaffolding around carved pillars, archaeological-floodlights, dawn breaking over ruins

━━━ RULES ━━━
- Each entry is a SPECIFIC place — not a vague descriptor
- 20-35 words — paint the location vividly
- Strange / beautiful / memorable — Avatar / Mass Effect / Dune / No Man's Sky / Annihilation level of imagination
- Suitable for both male and female explorers (gender-neutral)
- The location is the BACKDROP — a peaceful candid moment will play out here
- Sky elements (moons, stars, ringed planets, dual suns) are encouraged in many entries — these scenes are DEEP SPACE
- Variety across all 7 categories above mandatory

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
