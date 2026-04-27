#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/ancientbot/seeds/civilizations.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} ANCIENT CIVILIZATION location tags for AncientBot. Each entry is a SHORT phrase (8-15 words) naming a specific civilization, city/region, and approximate era. Pre-600 BC ONLY.

Format: "[Civilization] [specific city or region], [approximate date or era]"

━━━ CIVILIZATION SPREAD (mix across ALL) ━━━
- Egyptian (Old/Middle/New Kingdom — Memphis, Thebes, Karnak, Amarna, Abu Simbel, Giza)
- Sumerian (Ur, Uruk, Eridu, Lagash, Nippur — 3500-2000 BC)
- Akkadian (Akkad, conquest-era Mesopotamia — 2334-2154 BC)
- Babylonian (Old Babylon, Hammurabi era — 1894-1595 BC)
- Assyrian (Nineveh, Nimrud, Assur, Khorsabad — 2500-612 BC)
- Indus Valley / Harappan (Mohenjo-daro, Harappa, Dholavira, Lothal — 3300-1300 BC)
- Minoan (Knossos, Phaistos, Akrotiri, Crete — 2700-1450 BC)
- Mycenaean (Mycenae, Tiryns, Pylos — 1600-1100 BC)
- Hittite (Hattusa, Anatolia — 1600-1178 BC)
- Phoenician (Byblos, Tyre, Sidon — 1500-600 BC)
- Nubian / Kingdom of Kush (Kerma, Napata, Meroe — 2500-600 BC)
- Shang Dynasty China (Anyang, Zhengzhou — 1600-1046 BC)
- Zhou Dynasty China (early Western Zhou only — 1046-771 BC)
- Olmec (San Lorenzo, La Venta — 1500-400 BC)
- Norte Chico / Caral (Caral, Aspero, Peru — 3000-1800 BC)
- Elamite (Susa, Chogha Zanbil — 2700-600 BC)
- Urartu (Tushpa/Van, Armenian highlands — 860-590 BC)
- Megalithic builders (Gobekli Tepe 9500 BC, Stonehenge 3000 BC, Carnac 4500 BC, Malta temples 3600 BC, Newgrange 3200 BC)
- Catalhoyuk (proto-city, 7500-5700 BC)
- Dilmun / Bahrain (trade hub, 3000-600 BC)

━━━ RULES ━━━
- EVERY entry must be pre-600 BC
- No two entries should name the exact same city+era
- Spread across ALL civilizations listed — not just Egypt and Mesopotamia
- Include lesser-known civilizations (Caral, Catalhoyuk, Dilmun, Elamite, Urartu)
- Date ranges are approximate — use "circa" or "~" freely

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
