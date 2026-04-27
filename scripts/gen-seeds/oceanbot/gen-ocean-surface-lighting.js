#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/oceanbot/seeds/ocean_surface_lighting.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} SURFACE MARITIME LIGHTING descriptions for OceanBot. These describe the light in above-water ocean scenes — the surface of the sea, coastlines, harbors, wave faces, horizons. Think NatGeo ocean photography, dramatic seascapes, weather photography.

Each entry: 10-20 words. A specific above-water lighting condition.

━━━ LIGHTING FAMILIES TO COVER ━━━
- Golden hour: low sun on rolling swells, amber backlighting through translucent wave crests, copper reflections
- Storm light: dramatic shafts breaking through storm clouds, lightning illuminating churning seas, green-gray storm glow
- Moonlight: full moon on dark ocean, silver moonpath, lunar glow on wet rocks, blue-silver night
- Dawn: pre-dawn violet over calm water, first light through sea mist, pink horizon line
- Dusk/twilight: purple-blue twilight over still water, last light on wave faces, afterglow
- Overcast: heavy pewter sky over gray sea, brooding clouds with bright crack at horizon
- Fog: diffuse pearl-white fog glow, hazy sun barely visible through marine layer
- Tropical: harsh equatorial noon, white light on turquoise shallows, high-contrast tropical sun
- Polar: low arctic sun, ice-reflected light, aurora shimmer on dark water, midnight sun glow
- Weather drama: rainbow after squall, waterspout under dark sky, hail on churning surface

━━━ RULES ━━━
- ALL entries are ABOVE WATER — no underwater caustics, no depth measurements, no reef/coral descriptions
- Describe the quality, color, and drama of the light
- These should work for ocean surfaces, coastlines, wave faces, horizons, harbors
- Vary time of day, weather, and mood across all entries

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: light source + color temperature + time of day + weather condition.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
