#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/alien_cities.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} ALIEN CITY descriptions for StarBot's alien-city path — vast alien cities from above. Coruscant-style megacity, floating-platform city, dome-city on ice moon, ring-habitat, crystal-crater city.

Each entry: 15-30 words. One specific alien city.

━━━ CATEGORIES ━━━
- Coruscant-style megacity (vertical towers to horizon, air-traffic lanes)
- Floating-platform city (suspended platforms with bridges, clouds below)
- Dome-city on ice moon (domed habitats on frozen surface, planet in sky)
- Ring-habitat interior view (curving-up horizon, interior landscape)
- Crystal-crater city (city built into crater with crystal architecture)
- Hive-city organic (insect-like honeycomb towers)
- Underground-dome colony on Mars-like planet
- Terraced-mountain city (layered terraces on alien mountain)
- Desert-planet port (sunbaked trade-city with windmills)
- Ocean-world floating-city (platforms on waves, ship-traffic)
- Cave-system city (lit-up cave network with suspended platforms)
- Space-elevator base city (city anchored to ocean with elevator rising)
- Gas-giant cloud-city (floating city in gas-giant atmosphere)
- Crystal-tower city (tall spires growing like crystals, refracting light)
- Moon-colony (domes + solar farms on cratered surface)
- Jungle-canopy tree-city (built in alien-jungle canopy)
- Volcanic-rim city (settlements around active volcanoes with lava flows)
- Terraformed oasis (small green city in red desert)
- Sky-bridge megacity (massive bridges connecting towers at altitude)
- Polar-icecap colony (arctic city under auroras)
- Asteroid-interior city (city built inside hollow asteroid)
- Organic-biotech city (buildings that are grown, not built)
- Spiral-canyon city (city wrapping around massive canyon walls)
- Tidal-locked twilight-zone city (built in eternal twilight band)
- Ringed-planet view city (city on moon with planet filling sky)
- Geothermal-vent colony (around underwater-like vents with tech)
- Saturn-ring station city (wrapped-around station in planetary ring)
- Binary-star city (city lit by two suns with dual shadows)
- Coral-reef-structured alien city (emerging from ocean)
- Plasma-shielded dome over toxic-world

━━━ RULES ━━━
- Vast-scale alien cities from above
- Architectural variety (dome/tower/floating/cave/platform)
- Fictional but plausible futurism
- No characters (cityscape is hero)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
