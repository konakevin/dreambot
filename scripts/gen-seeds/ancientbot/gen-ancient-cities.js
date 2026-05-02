#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/ancientbot/seeds/ancient_cities.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} ANCIENT CITY scene descriptions for AncientBot. Each entry is 15-25 words describing a specific scene of a thriving ancient city — bustling, alive, at its peak. Pre-1000 AD ancient global civilizations.

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

━━━ GEOGRAPHIC DISTRIBUTION — NON-NEGOTIABLE ━━━
The civilizations represented in these ${n} entries MUST be spread across the global ancient world. Distribute approximately:
- ~25% Mesopotamian / Egyptian / Levantine (Sumer, Akkad, Babylon, Assyria, Hittite, Phoenician, Old/Middle/New Kingdom Egypt, Nubia/Kush)
- ~20% East Asian (Shang/Zhou/Qin/Han/Tang/Song China; Yayoi/Kofun/Asuka/Nara/Heian Japan; Three Kingdoms / Goryeo Korea)
- ~15% Pre-Columbian Americas (Olmec, Maya Pre-Classic + Classic, Teotihuacan, Toltec, Aztec, Inca, Moche, Nazca, Tiwanaku)
- ~10% Southeast Asian (Khmer / Angkor, Champa, Pyu, Srivijaya, Java)
- ~10% Persian / Steppe (Achaemenid, Parthian, Sassanian, Scythian, Saka, Xiongnu)
- ~10% Greco-Roman (Minoan, Mycenaean, Archaic + Classical Greece, Hellenistic, Roman Republic + Empire, Etruscan)
- ~5% African (Aksum, Great Zimbabwe, Mali, Carthage, Ghana, Benin)
- ~3% Celtic / Norse (La Tène Celts, Hallstatt, Pictish, Norse pre-Viking and Viking-Age)
- ~2% Polynesian / Pacific (Easter Island Rapa Nui, pre-contact Hawaiian, early Maori, Lapita)

Every region above must appear at least once.

━━━ RULES ━━━
- Each entry is ONE vivid city scene
- Focus on the DENSITY and ACTIVITY of urban life
- Vary the civilizations widely
- Include specific period details (mud-brick, reed matting, bronze tools, lapis jewelry, painted plaster)
- 15-25 words
- NO European-medieval (no knights, no plate armor, no flying buttresses, no Gothic stained glass), NO fantasy magic

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
