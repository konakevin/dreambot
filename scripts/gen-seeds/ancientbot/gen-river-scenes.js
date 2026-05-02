#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/ancientbot/seeds/river_scenes.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} RIVER CIVILIZATION scene descriptions for AncientBot. Each entry is 15-25 words describing the relationship between water and ancient civilization — fertile rivers, irrigation, agriculture, river commerce. Pre-1000 AD ancient global civilizations.

These are LANDSCAPE scenes where the river is the central compositional element and settlements cluster along its banks.

━━━ SCENE TYPES (mix across all) ━━━
- Nile flood plains (annual inundation, irrigated fields, shaduf water-lifting, papyrus marshes, feluccas)
- Tigris-Euphrates canal networks (branching irrigation, levees, date palm groves, barley fields)
- Indus Valley water systems (Great Bath of Mohenjo-daro, covered drains, dockyard at Lothal)
- Yellow River terraces (millet fields, loess plateau settlements, early rice paddies)
- River-mouth deltas (marshland settlements, reed-boat fishermen, wading birds)
- Oasis settlements (desert wells, walled gardens, caravan watering stops)
- Seasonal flood agriculture (recession farming, fish traps, grain storage)

━━━ RIVERS ━━━
Nile, Tigris, Euphrates, Indus, Ghaggar-Hakra, Yellow River (Huang He), Yangtze (early), Jordan, Orontes

━━━ GEOGRAPHIC DISTRIBUTION — RIVER CIVILIZATIONS ONLY ━━━
This pool is climate-locked to river civilizations. Distribute across:
- ~25% Mesopotamian (Tigris + Euphrates: Sumer, Akkad, Babylon, Ur, Uruk, Eridu, Mari)
- ~25% Egyptian (Nile: Memphis, Thebes, Karnak, Aswan, Abu Simbel, Edfu)
- ~20% East Asian (Yellow River: Shang Anyang; Yangtze: Han + Tang river-cities; Han Chang'an on Wei)
- ~10% Indus Valley (Mohenjo-daro, Harappa, Lothal)
- ~10% Khmer (Mekong + Tonle Sap: Angkor, Sambor Prei Kuk)
- ~5% African (Niger River: Mali Djenné/Timbuktu; Nile-Nubia: Kerma)
- ~5% European riverine (Celtic Hallstatt salt-river, Roman Tiber)

━━━ RULES ━━━
- Each entry is ONE vivid river/water scene
- The RIVER should be central — not just background
- Include agricultural and settlement details
- Vary civilizations widely
- 15-25 words
- NO European-medieval (no knights, no plate armor, no flying buttresses, no Gothic stained glass), NO fantasy magic

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
