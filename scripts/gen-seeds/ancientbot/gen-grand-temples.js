#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/ancientbot/seeds/grand_temples.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} GRAND TEMPLE / SACRED SITE scene descriptions for AncientBot. Each entry is 15-25 words describing a specific ancient temple, sanctuary, or sacred ceremonial scene. Pre-600 BC civilizations ONLY.

These should describe the SCENE — what you'd see standing there. Include architectural features, ritual activity, decorative elements, atmosphere.

━━━ SCENE TYPES (mix across all) ━━━
- Massive temple exteriors (pylons, processional avenues, colossal statuary, painted facades)
- Temple interiors (hypostyle halls, forest of columns, shafts of light through clerestory, incense haze)
- Ziggurat summits (fire altars, sky-temples, priests ascending monumental stairs)
- Processional ceremonies (long lines of priests, offerings carried on litters, sacred animals led in parade)
- Sacred groves and open-air sanctuaries (stone altars, carved pillars, offerings)
- Tomb-temple complexes (mortuary temples, offering halls, painted burial chambers)

━━━ CIVILIZATIONS TO DRAW FROM ━━━
Egyptian (Karnak, Luxor, Abu Simbel, Hatshepsut's mortuary temple), Sumerian/Akkadian (ziggurats of Ur, Eridu, Nippur), Babylonian (Etemenanki, Marduk's temple), Hittite (Yazilikaya rock sanctuary), Minoan (peak sanctuaries, lustral basins), Phoenician (Temple of Melqart), Nubian (Jebel Barkal temples), Elamite (Chogha Zanbil ziggurat), Olmec (La Venta ceremonial complex), Norte Chico (Caral platform mounds), Gobekli Tepe (carved T-pillars), Malta (Mnajdra/Hagar Qim temples)

━━━ RULES ━━━
- Each entry is ONE specific scene, not a list of features
- Include a sense of ACTIVITY — smoke, fire, procession, offering, ceremony
- Vary the civilizations — not all Egyptian
- 15-25 words, vivid and specific
- NO medieval, NO Greek/Roman, NO fantasy

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
