#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/ancientbot/seeds/jungle_scenes.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} JUNGLE ANCIENT CIVILIZATION scene descriptions for AncientBot. Each entry is 25-40 words describing a specific ancient scene in DENSE TROPICAL JUNGLE. Pre-600 BC ONLY.

Stone civilizations swallowed by living green — pyramids rising above canopy, vine-wrapped temples, humid river settlements, ceremonial plazas carved from jungle. The vegetation is as monumental as the architecture.

━━━ CIVILIZATIONS TO DRAW FROM ━━━
- Olmec (colossal basalt heads in jungle clearings, La Venta pyramid complex, jaguar-worship temples, rubber-ball courts)
- Norte Chico/Caral (earliest Peruvian ceremonial centers, sunken circular plazas amid tropical valleys)
- Early Maya predecessors (Nakbe, El Mirador — massive jungle pyramids BEFORE classic Maya)
- Catalhoyuk-era Anatolian forest settlements (timber-and-mud architecture in wooded highlands)
- Indus Valley monsoon-forest edges (Dholavira, Lothal — where cultivated land meets dense vegetation)
- Shang Dynasty river-jungle margins (bronze-age settlements in subtropical Yangtze vegetation)
- Generic tropical stone-temple civilizations that feel authentically ancient

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
- PRE-600 BC ONLY. Every scene must be plausibly set BEFORE 600 BC
- Olmec: 1500-400 BC ✓ | Classic Maya (Tikal, Palenque, Chichen Itza): 250-900 AD ✗ BANNED
- Angkor Wat: 12th century AD ✗ BANNED | Aztec: 14th-16th century AD ✗ BANNED
- NO Classic Maya glyphs, NO corbeled Maya arches, NO Aztec sun stones, NO Khmer face-towers
- Materials: basalt, limestone, packed earth, timber, thatch, jade, obsidian, clay, rubber
- NO iron, NO steel, NO glass, NO metal armor, NO horses (not in Americas)

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
