#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/ancientbot/seeds/jungle_scenes.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} JUNGLE ANCIENT CIVILIZATION scene descriptions for AncientBot. Each entry is 25-40 words describing a specific ancient scene in DENSE TROPICAL JUNGLE. Pre-1000 AD ancient global civilizations.

Stone civilizations swallowed by living green — pyramids rising above canopy, vine-wrapped temples, humid river settlements, ceremonial plazas carved from jungle. The vegetation is as monumental as the architecture.

━━━ GEOGRAPHIC DISTRIBUTION — JUNGLE / RAINFOREST CIVILIZATIONS ONLY ━━━
This pool is climate-locked to jungle / rainforest civilizations. Distribute across:
- ~35% Pre-Columbian Mesoamerican lowland (Olmec La Venta, Maya Tikal/Palenque/Calakmul/Yaxchilan, Teotihuacan)
- ~25% Southeast Asian (Khmer Angkor / Bayon / Banteay Srei / Beng Mealea, Champa Mỹ Sơn, Pyu cities, Borobudur Java)
- ~15% Sub-Saharan African (Benin City, Ife, Great Zimbabwe in monsoon, Aksum in green season)
- ~10% Andean rainforest fringe (Inca Machu Picchu cloud forest, Chachapoya)
- ~10% South China / Southwest China (Tang temples in southern jungle, Yunnan kingdoms)
- ~5% Indian / Sri Lankan (Sigiriya, Anuradhapura, monsoon temples)

━━━ SCENE TYPES (mix across all) ━━━
- Stepped pyramids rising above jungle canopy (stone tips catching sunlight above a sea of green, birds circling)
- Vine-wrapped temple complexes (roots splitting stone walls, moss on carved reliefs, jungle reclaiming architecture)
- Ceremonial plazas in jungle clearings (carved stelae, altar stones, packed earth surrounded by wall of green)
- River settlements in dense vegetation (wooden platforms over brown water, dugout canoes, fish traps in current)
- Stone causeways through swamp-jungle (raised roads connecting ceremonial centers, water on both sides)
- Colossal stone heads in undergrowth (Olmec basalt faces half-buried in leaf litter, dappled light on carved features)
- Jungle quarries (massive stone blocks being carved from cliff faces, log rollers, worker camps in clearings)
- Waterfall temples (sacred sites built beside or behind waterfalls, mist-soaked stone, rainbow light)
- Canopy-level views (looking DOWN through breaks in jungle canopy at stone structures below, layered green depth)
- Dawn mist in jungle ruins (ground fog threading between carved pillars, humid air catching first light)

━━━ PERIOD ACCURACY — HARD RULES ━━━
- Pre-1000 AD ancient global civilizations. Every scene must be plausibly set BEFORE 600 BC
- Olmec: 1500-400 BC ✓ | Classic Maya (Tikal, Palenque, Chichen Itza): 250-900 AD ✗ BANNED
- Angkor Wat: 12th century AD ✗ BANNED | Aztec: 14th-16th century AD ✗ BANNED
- NO Classic Maya glyphs, NO corbeled Maya arches, NO Aztec sun stones, NO Khmer face-towers
- Materials: basalt, limestone, packed earth, timber, thatch, jade, obsidian, clay, rubber
- NO iron, NO steel, NO glass, NO metal armor, NO horses (not in Americas)

━━━ GEOGRAPHIC DISTRIBUTION — JUNGLE / RAINFOREST CIVILIZATIONS ONLY ━━━
This pool is climate-locked to jungle / rainforest civilizations. Distribute across:
- ~35% Pre-Columbian Mesoamerican lowland (Olmec La Venta, Maya Tikal/Palenque/Calakmul/Yaxchilan, Teotihuacan)
- ~25% Southeast Asian (Khmer Angkor / Bayon / Banteay Srei / Beng Mealea, Champa Mỹ Sơn, Pyu cities, Borobudur Java)
- ~15% Sub-Saharan African (Benin City, Ife, Great Zimbabwe in monsoon, Aksum in green season)
- ~10% Andean rainforest fringe (Inca Machu Picchu cloud forest, Chachapoya)
- ~10% South China / Southwest China (Tang temples in southern jungle, Yunnan kingdoms)
- ~5% Indian / Sri Lankan (Sigiriya, Anuradhapura, monsoon temples)

━━━ RULES ━━━
- Each entry is ONE specific jungle scene with civilization baked in
- JUNGLE dominates — vegetation is massive, dense, humid, alive. Architecture fights for space with nature
- Humidity is VISIBLE: mist, condensation, wet stone, dripping leaves, steam rising from forest floor
- Light is FILTERED: dappled through canopy, shafts through breaks, green-tinted ambient
- Include specific vegetation: ceiba trees, strangler figs, bromeliads, ferns, moss, vines, orchids, palms
- 25-40 words
- Mix jungle-dominant and architecture-dominant compositions

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
