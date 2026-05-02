#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/ancientbot/seeds/ancient_interiors.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} GRAND ANCIENT INTERIOR scene descriptions for AncientBot. Each entry is 25-40 words describing a specific GRAND-SCALE interior space from an ancient civilization. Pre-1000 AD ancient global civilizations.

These are AWE-INSPIRING interiors — cathedral-scale, vast, monumental. The architecture makes you feel SMALL. NOT intimate, NOT cozy — GRAND.

━━━ INTERIOR TYPES (mix across all) ━━━
- Hypostyle halls (Egyptian — forests of painted papyrus-bundle columns receding into incense haze, painted ceilings 60 feet above, light shafts through clerestory)
- Tomb complexes (Egyptian burial chambers with painted walls in vivid pigment, granite sarcophagi, offerings stacked in antechambers, gold-leafed ceiling constellations)
- Ziggurat summit shrines (Mesopotamian — small but intensely decorated high-altar rooms, blue-glazed brick, gold furniture, city visible through doorway far below)
- Palace throne halls (Assyrian — massive lamassu flanking doorways, carved alabaster wall reliefs of hunts and conquests, cedar beam ceilings)
- Minoan palace rooms (Knossos — red-painted columns, dolphin frescoes, lustral basins, light wells flooding rooms with Mediterranean sun)
- Temple sanctuaries (inner sanctum where the god-statue lives — dark, incense-thick, gold gleaming in oil-lamp light, ordinary people never enter)
- Underground cisterns and granaries (vast functional spaces — arched brick ceilings, cool air, stored grain in massive clay vessels)
- Hittite gate chambers (massive stone lion/sphinx guardians flanking interior passages, torch-lit)
- Nubian temple interiors (painted sandstone columns, hybrid Egyptian-Nubian decoration)
- Indus Valley Great Bath complex (fired-brick interior, descending steps, waterproofed with bitumen)

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
- Each entry is ONE specific grand interior with civilization baked in
- GRAND SCALE — these spaces are vast, the ceiling is far above, columns stretch into distance
- Include specific materials and decorative details (painted plaster, carved relief, glazed brick, gold leaf, lapis inlay)
- Include a light source (oil lamps, torches, clerestory shafts, light wells, ceremonial fire)
- 25-40 words each
- NO European-medieval (no knights, no plate armor, no flying buttresses, no Gothic stained glass), NO fantasy magic

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
