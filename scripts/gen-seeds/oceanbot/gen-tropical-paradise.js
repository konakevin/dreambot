#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
const { BLOWN_UP_OCEAN_ENTRY_MANDATE } = require('../../lib/blownUpSeedMandate');
generatePool({
  outPath: 'scripts/bots/oceanbot/seeds/tropical_paradise.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} TROPICAL OCEAN PARADISE descriptions for OceanBot — BLOWN UP to AI-impossible levels. Crystal lagoons, turquoise shallows, palm-fringed atolls, overwater views into impossibly clear water — Maldives/Bora Bora/Seychelles/Fiji/Tahiti energy compounded with extreme stacked phenomena. NOT named resorts.

Each entry: 28-40 words. One specific tropical paradise with 3+ stacked extreme phenomena.

${BLOWN_UP_OCEAN_ENTRY_MANDATE}

━━━ CATEGORIES (mix across all) ━━━
- Crystal lagoon with white sand bottom visible through turquoise + double-rainbow overhead + bioluminescent reef edges
- Palm-fringed atoll with reef visible from above + impossible 6-color sky-gradient + godrays piercing clouds
- Overwater straight-down into clear water + rainbow refraction + saturated impossible-color reef + spray-haze
- Sandbar at low tide + 360-degree horizon + storm cell on one side + sun blazing on the other
- Bora Bora-energy volcanic peak + waterfall pouring into lagoon + triple-rainbow over the bay
- Granite boulders on white sand + bioluminescent shoreline at twilight + electric-blue waves on jet-black sand
- Soft coral gardens in shallow water + caustic-net light + glowing fluorescent coral + sunset blasting through surface
- Tahiti black sand + turquoise water + lightning + rainbow + sunpillar shooting up from horizon simultaneously
- Maldives sandbank barely above water + cloud-leviathan drifting overhead + impossible color stacking
- Tiny palm island aerial + concentric reef rings around glowing central lagoon + galaxy visible at indigo zenith
- Split-view above/below crystal waterline + sunset sky above + caustic light + glowing reef below
- Continent-spanning crescent bay viewed from mountaintop + storm wall + rainbow + multi-moon sky
- Cathedral-scale tide-pool + reef gardens visible inside + caustics + sky-storm reflected on surface
- Skyscraper-scale coral spires from lagoon floor + sun-shafts + bioluminescent particulate

━━━ RULES ━━━
- CLARITY and COLOR — impossibly clear water, visible bottom, gradient blues
- Tropical warmth and perfection compounded with AI-impossible sky/light stacking
- 3+ stacked extreme phenomena per entry
- NOT named resorts or hotels — natural paradise energy
- No repeats — every entry a unique tropical moment
- Vivid, specific language

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
