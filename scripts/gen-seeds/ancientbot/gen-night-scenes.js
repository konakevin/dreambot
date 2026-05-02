#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/ancientbot/seeds/night_scenes.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} NOCTURNAL ANCIENT CIVILIZATION scene descriptions for AncientBot. Each entry is 25-40 words describing a specific ancient scene at NIGHT, DUSK, or DAWN. Pre-1000 AD ancient global civilizations.

The ancient world after dark — torch-lit, moon-washed, star-dense. These civilizations had no electric light. Night was DARK, and the light sources (fire, oil lamps, moon, stars) created intimate, dramatic scenes.

━━━ SCENE TYPES (mix across all) ━━━
- Starlit monuments (pyramids under star-dense sky, Milky Way arcing over stone circles, constellations ancient astronomers named)
- Torch-lit processions (night ceremonies winding through temple complexes, fire reflecting off painted walls, shadows dancing)
- Moonlit ruins (silver light on ancient stone, sharp moon-shadows, owls in empty doorways)
- Oil-lamp city streets (Mesopotamian night market, pools of warm amber light from doorways, vendors and late shoppers)
- Campfire gatherings (desert camps on trade routes, sparks rising, faces lit from below, stories being told)
- Astronomical observations (priests on ziggurat summits watching stars, stone observatories aligned to solstice, pre-dawn sky)
- Dusk settling over cities (last golden light on highest temple, purple sky, first lamps being lit, day workers heading home)
- Dawn breaking over monuments (first rose-gold light hitting pyramid capstone, mist burning off river, birds waking)
- Night harbor (anchored ships silhouetted against moonlit water, lighthouse fires, dock lanterns reflecting on gentle waves)
- Temple vigils (lone oil lamp in dark sanctuary, gold god-statue barely visible, incense smoke in moonbeam through roof-slit)

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
- Each entry is ONE specific nocturnal/twilight scene with civilization baked in
- DARKNESS is dominant — light sources are SMALL and WARM against vast dark
- Star detail: these skies had ZERO light pollution — the Milky Way was vivid and overwhelming
- Include specific ancient light sources (oil lamps, torches, hearth fire, ceremonial fire, moonlight, starlight)
- 25-40 words
- NO European-medieval (no knights, no plate armor, no flying buttresses, no Gothic stained glass), NO fantasy magic glowing magic
- Mix of full night, dusk, and pre-dawn

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
