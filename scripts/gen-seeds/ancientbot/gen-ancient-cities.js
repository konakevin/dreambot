#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/ancientbot/seeds/ancient_cities.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} ANCIENT CITY scene descriptions for AncientBot. Each entry is 15-25 words describing a specific scene of a thriving ancient city — bustling, alive, at its peak. Pre-600 BC civilizations ONLY.

These capture the DAILY LIFE of ancient urban centers — what you'd see from a rooftop or elevated walkway.

━━━ SCENE TYPES (mix across all) ━━━
- Crowded market streets (stalls piled with goods, donkeys, shouting merchants, awnings of dyed linen)
- Residential quarters (flat-roofed mud-brick houses, rooftop gardens, narrow lanes, children playing)
- Workshop districts (bronze-smiths, potters, weavers, dye-vats, kiln smoke)
- Palace/administrative quarters (wide avenues, guarded gates, scribes, messenger runners)
- Canal-side commerce (loaded barges, waterfront warehouses, reed boats, fish markets)
- City walls and gates (massive fortifications, guard towers, caravans entering, dust clouds)
- Public gathering spaces (plazas, wells, granaries, festival preparations)

━━━ CITIES TO DRAW FROM ━━━
Ur, Uruk, Babylon, Nineveh, Nimrud, Memphis, Thebes, Amarna, Mohenjo-daro, Harappa, Lothal, Knossos, Mycenae, Hattusa, Byblos, Tyre, Sidon, Kerma, Anyang, Caral, Susa, Catalhoyuk, Akrotiri

━━━ RULES ━━━
- Each entry is ONE vivid city scene
- Focus on the DENSITY and ACTIVITY of urban life
- Vary the civilizations widely
- Include specific period details (mud-brick, reed matting, bronze tools, lapis jewelry, painted plaster)
- 15-25 words
- NO medieval, NO Greek/Roman, NO fantasy

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
