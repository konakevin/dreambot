#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/beachbot/seeds/coastal_vistas.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} COASTAL VISTA descriptions for BeachBot's coastal-vista path — dramatic craggy coastlines + water-eroded features + striking sea-color + dramatic weather/light.

Each entry: 15-30 words. One specific craggy-coast scene.

━━━ CATEGORIES ━━━
- Sea-stacks rising from turquoise water
- Natural stone-arch with waves crashing through
- Eroded cliffs with layered sedimentary exposure
- Giant's-Causeway-style hexagonal basalt columns
- Big-Sur rocky coast with blue-green water
- Oregon-coast rugged with sea-lion-rocks
- Amalfi-cliffs with turquoise water below
- Cornish-cliff with roaring surf
- Icelandic-black-sand sea-stacks (Reynisdrangar-style)
- Cliffs-of-Moher dramatic Irish drop
- Faroe-islands mossy sea-cliffs
- Nordic-fjord opening to sea
- Pacific-Northwest rocky-tidal
- California-coast kelp-visible through water
- New-Zealand Moeraki-boulders at dawn
- Orkney cliffs with sea-bird colonies
- Galapagos volcanic coast
- Algarve cliffs with caves carved
- Greek-island volcanic black-beach
- Scottish-highlands sea-loch opening
- Nova-Scotia lighthouse-cliff
- Cornwall tin-mine coast
- Normandy chalk-cliffs
- Chile Pacific stone-sculpted
- Azores volcanic crater-cove
- Kamchatka rocky Pacific-coast
- Patagonia dramatic south-Atlantic
- Cape-of-Good-Hope south-Africa
- Namibian skeleton-coast
- Norwegian preikestolen-style cliff
- Basque crashing Atlantic cliff
- Madagascan tsingy-stone-forest coast
- Sicilian cliffs with grottos
- Tasmania dolerite-columns
- Madeira Atlantic cliffs
- Cinque-Terre terraced cliffs
- Cornish Tintagel-castle cliff
- Icelandic Dyrhólaey arch
- California's-Morro-rock
- Catalonia Costa-Brava coves

━━━ RULES ━━━
- Craggy / dramatic coastal geography
- Include sea-color + weather
- Real places or plausible-invented
- Striking composition angles

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
