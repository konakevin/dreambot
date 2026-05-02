#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/dune_landscapes.json',
  total: 50,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} DUNE-CODED LANDSCAPE entries for StarBot's dune-landscape path. Each entry is a DENSE phrase (25-50 words) describing a SPECIFIC ALIEN DESERT VISTA in the Dune / Arrakis aesthetic tradition — vast cinematic deserts, twin-sun horizons, sandworm-trail-coded terrain, polar ice caps, spice-blue dawn light, ornithopter-scale skies, fremen-sietch silhouettes in cliffs.

CRITICAL — NO CHARACTERS, NO PEOPLE. Pure landscape only.

CRITICAL — NO PROPER NOUNS. Never write "Arrakis", "Dune", "Fremen", "Harkonnen", "Atreides", "Caladan", "ornithopter", "spice", "Bene Gesserit", "Shai-Hulud" — describe the AESTHETIC generically. Instead use phrases like "vast amber desert under twin suns", "wind-carved sandstone canyons", "spice-blue dawn haze", "wormtrail-streaked dune-sea", "cliff-face sietch silhouettes carved into rock".

━━━ AESTHETIC DNA ━━━

Capture the visual mood of Frank-Herbert / Denis-Villeneuve / David-Lynch / Jodorowsky-Dune-art-book imagery. The world is BIBLICAL in scale. The sky is a DOMINATING presence. Dust, heat-shimmer, and spice-blue light wash everything. The desert is a CHARACTER itself — alive, dangerous, breathtaking.

━━━ LANDSCAPE CATEGORIES (variety across ${n}) ━━━

DUNE-SEAS (~10):
- vast dune-sea stretching to horizon, twin suns at zenith, heat-shimmer warping distance
- rolling crescent dunes ribbed with wind-patterns, indigo shadows pooling in valleys
- amber desert at dusk, single moon rising, wind-blasted ripples in sand

WORMTRAIL TERRAIN (~6):
- massive serpentine sand-trail snaking across dune fields, vibration patterns radiating from a buried something
- crater of recent disturbance in the dunes with concentric ripples spreading outward
- deep gouge across the desert floor where massive subterranean creature passed

SANDSTONE CATHEDRAL FORMATIONS (~8):
- towering wind-carved sandstone cathedrals rising from the desert floor like cathedral spires
- canyon walls eroded into impossible architectural shapes by millennia of wind
- mesa-and-spire formations glowing burnt-orange under low sun

SIETCH-CLIFF SILHOUETTES (~6):
- distant cliff-face honeycombed with ancient cave-dwellings, smoke threads rising
- sandstone cliff embedded with carved-in dwellings, narrow ledges and dark window-openings
- fortress-cliff overlooking a vast desert basin, weathered stone watchtowers

POLAR / ICE-DESERT (~5):
- polar wasteland of ice-crusted dunes under pale sky, spice-blue glow at horizon
- frozen dune-fields with snow drifting between sandstone outcrops
- glacial canyon cutting through a desert plateau, blue ice meeting amber sand

SANDSTORM / DUST-WALL (~5):
- approaching sandstorm-wall hundreds of meters tall, sun obscured behind orange haze
- dust-devil swarm dancing across an empty plain
- heavy dust-storm aftermath, half-buried structures emerging from sand drifts

SPICE-BLUE DAWN LIGHT (~5):
- desert at the moment of dawn, spice-blue haze tinting every dune
- horizon glowing electric-cobalt under twin-sun crepuscular rays
- pre-dawn desert with stars still visible above an indigo horizon

NIGHT DESERT WITH MOONS (~5):
- desert under three crescent moons, dunes gleaming silver
- moonlit sand-sea with phosphorescent flecks of unknown mineral
- night dunes with bioluminescent insects drifting between crests

━━━ RULES ━━━
- 25-50 words each — dense, paintable
- NO characters / NO people / NO figures — pure landscape
- NO proper nouns from the franchise
- Strong sky / atmosphere component (twin suns, heat shimmer, spice-blue dawn, dust haze)
- Variety across the 8 categories above mandatory
- Cinematic / biblical scale
- Vivid sensory detail (color, scale, light, texture, movement)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
