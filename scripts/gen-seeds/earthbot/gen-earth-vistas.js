#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/earth_vistas.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} EARTH VISTA descriptions for EarthBot — epic wide-scale Earth panoramas for the "vista" path. National-Geographic-cover dialed to 10×.

Each entry: 15-30 words. One specific earthly panorama with geographic detail.

━━━ CATEGORIES TO DRAW FROM ━━━
- Mountain ranges (Patagonian peaks, Dolomites spires, Himalayan ridges, Alaskan glacier valleys)
- Coastal vistas (Icelandic basalt cliffs, Scottish sea-stacks, Oregon coast, Big Sur, volcanic black-sand coast)
- Deserts (Saharan dunes, Atacama salt flats, Namibian red dunes, Utah mesas, White Sands)
- Volcanic landscapes (Hawaiian lava fields, Icelandic calderas, Indonesian volcano rim, cooling-basalt plains)
- Alpine valleys (Swiss Alps, Patagonian fjords, New Zealand alpine)
- Plains and prairies (Mongolian steppe, Serengeti grassland, Argentine pampas, Siberian tundra)
- Fjord and sound landscapes (Norwegian fjords, New Zealand sounds, Alaskan inlets)
- Canyon-scale landscapes (Grand Canyon type, Antelope Canyon type, Zion, Patagonian canyons)
- Salt flats and alkaline basins (Bonneville, Salar de Uyuni, Lake Magadi)
- Karst landscapes (Guilin-style towers, Halong-Bay stone islands, Cappadocia fairy chimneys)
- Savannas and plateaus (East African savanna, Colorado mesa, Brazilian cerrado)

━━━ RULES ━━━
- NO fantasy, NO cosmic, NO physics-defying, NO bioluminescence
- NO built structures as subject
- NO humans, NO animal subjects
- Earth-plausible only — invented-specific OK (unnamed glacier valley) but never violating Earth geology
- Include scale + geographic specificity

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
