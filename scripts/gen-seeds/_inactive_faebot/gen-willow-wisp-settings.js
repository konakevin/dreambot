#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/faebot/seeds/willow_wisp_settings.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} WILLOW-WISP SETTING descriptions for FaeBot's willow-wisp path. Misty bogs, marshlands, foggy forest edges, twilight paths, swamp water, eerie wetlands. ALWAYS foggy or misty, ALWAYS dusk/night/twilight.

Each entry: 10-20 words. A specific misty wetland environment.

━━━ CATEGORIES TO COVER ━━━
- Peat bog at twilight, standing water between tussocks of grass, mist knee-deep
- Flooded forest where trees stand in dark water, fog threading between the trunks
- Marsh path made of rotting planks, disappearing into thick fog ahead
- Swamp at dusk, cypress trees draped in Spanish moss, still dark water reflecting the last light
- Foggy river bend where the water disappears into white mist, no visible far bank
- Dead forest in a bog, skeletal white tree trunks standing in black water
- Moorland at night, no trees, rolling fog lit faintly by something beneath the surface
- Abandoned causeway across a marsh, stones sinking into mud, fog erasing the destination
- Pond choked with water lilies, surface barely visible under the pads, thick evening mist
- Forest creek crossing where the fog is thickest, water sounds but no visible source
- Salt marsh at the edge of the sea, tidal pools and fog blending into a uniform grey
- Willow grove at the edge of a bog, trailing branches disappearing into the fog below

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: water type (bog/marsh/river/pond/sea) + visibility level + vegetation.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
