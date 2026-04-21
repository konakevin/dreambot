#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/beachbot/seeds/tropical_paradise_scenes.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} TROPICAL PARADISE SCENE descriptions for BeachBot's tropical-paradise path — dreamy destinations. Palm trees + turquoise water + white/pink sand.

Each entry: 15-30 words. One specific tropical-paradise destination/scene.

━━━ CATEGORIES ━━━
- Maldives overwater-bungalows (empty, scenic)
- Bora-Bora lagoon mountain-backdrop
- Bahamas crystal turquoise shallows
- Thai-islands limestone-karsts rising
- Seychelles granite-boulder beach
- Philippines island-hopping cove
- Fiji palm-islands
- Palau lagoon aerial
- Cook-Islands pristine beach
- Maldives private-island
- Mauritius lagoon-reef visible
- French-Polynesia atoll-aerial
- Vanuatu black-sand beach
- Solomon-Islands coconut-palms
- Kiribati atoll ring
- Andaman-Islands secluded cove
- Nusa-Lembongan clear-water
- Lombok pink-sand beach
- Palawan El-Nido lagoons
- Caye-Caulker Belize clear
- Roatán Honduras coral-beach
- Providencia Colombia
- Mustique Caribbean pristine
- Grand-Cayman seven-mile-beach
- Turks-and-Caicos Grace-Bay
- Barbados aquamarine water
- Virgin-Islands empty bay
- St-Lucia Piton-peaks coastline
- St-John National-Park beach
- Curaçao colorful-houses village
- Aruba aloe-natural-bridge coast
- Seychelles Anse-Source-d-Argent
- La-Digue pink-granite
- Mauritius Le-Morne peninsula
- Reunion Island beach
- Zanzibar Stone-Town beach
- Pemba-Island pristine
- Diani-Kenya white-sand
- Ilha-Grande Brazil
- Fernando-de-Noronha Brazil
- Barbuda pink-sand
- Half-Moon-Cay Bahamas
- Exumas swimming-pigs-empty (no people, scenic)
- Great-Barrier-Reef islands aerial
- Whitsundays white-silica-sand

━━━ RULES ━━━
- Real tropical destinations
- Crystal water + palms + sand
- No humans
- Travel-magazine-cover feel

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
