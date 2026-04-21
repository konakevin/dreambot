#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/animalbot/seeds/landscape_contexts.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} LANDSCAPE CONTEXT descriptions for AnimalBot's landscape path — breathtaking vistas where an animal sits small as scale element. The setting is dramatic and massive; the animal will be placed inside.

Each entry: 15-30 words. One specific dramatic landscape with scale.

━━━ CATEGORIES (all LAND-based, no underwater) ━━━
- Alpine ridgelines with mist-filled valleys below
- Snowy boreal forests with low sun raking through spruce
- Golden-grass savanna with acacia silhouettes at dusk
- Volcanic lava fields with cooling-basalt and ash-haze
- Sand dune oceans with wind-rippled crests
- Autumn aspen groves with golden leaves carpeting ground
- Glacier tongues winding between granite peaks
- Sea-cliff tops with wave-spray backlit (animal on cliff edge, above water)
- Moss-covered old-growth rainforest with shafts of sun
- Bamboo forests with low-angle morning light
- Prairie vastness with supercell thunderstorm distant
- Arctic ice-field with aurora overhead
- Red-rock mesas with sunset glow on sandstone
- Karst landscapes (limestone towers) with mist in valleys
- Caldera rims with steam-vent wisps
- Tidepool coastlines (above-water, shoreline perspective)
- Heather moorlands with rolling fog
- Eucalyptus forests with blue-haze atmosphere
- Frozen lake edge with ice-fog haze
- Cloud-forest mist-filled canopy

━━━ RULES ━━━
- Setting only — animal will be placed later
- Dramatic + breathtaking + scale-heavy
- LAND-based only (no underwater, no deep sea)
- Earth-plausible biomes

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
