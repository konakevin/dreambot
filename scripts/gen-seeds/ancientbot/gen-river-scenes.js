#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/ancientbot/seeds/river_scenes.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} RIVER CIVILIZATION scene descriptions for AncientBot. Each entry is 15-25 words describing the relationship between water and ancient civilization — fertile rivers, irrigation, agriculture, river commerce. Pre-600 BC ONLY.

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

━━━ RULES ━━━
- Each entry is ONE vivid river/water scene
- The RIVER should be central — not just background
- Include agricultural and settlement details
- Vary civilizations widely
- 15-25 words
- NO medieval, NO Greek/Roman, NO fantasy

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
