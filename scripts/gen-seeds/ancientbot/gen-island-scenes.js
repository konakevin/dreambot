#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/ancientbot/seeds/island_scenes.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} ISLAND ANCIENT CIVILIZATION scene descriptions for AncientBot. Each entry is 25-40 words describing a specific ancient scene on ISLANDS — stone civilizations surrounded by ocean. Mostly pre-600 BC, with selective exceptions for iconic island megalithic cultures.

Massive stone on windswept islands surrounded by endless ocean. These civilizations built monuments that seem impossible given their isolation — the mystery of HOW is part of every scene.

━━━ CIVILIZATIONS TO DRAW FROM ━━━
- Malta's megalithic temples (Ħaġar Qim, Mnajdra, Tarxien — oldest freestanding structures on Earth, 3600-2500 BC, limestone on sea-cliff edges)
- Sardinia's nuraghe towers (Bronze Age stone towers dotting the island, 1900-730 BC, cone-shaped fortresses)
- Cycladic island settlements (white-stone Aegean villages, 3200-2000 BC, marble figurines, terraced hillsides above blue sea)
- Minoan Crete (Knossos, Phaistos — palatial complexes, frescoed walls, bull-horn symbols, harbor towns)
- Cyprus Bronze Age (copper-trading harbors, stone fortifications, mixed Aegean-Levantine architecture)
- Balearic Islands (taulas — T-shaped stone monuments, talayots — stone watchtowers, navetas — stone boat-shaped tombs, 1500-123 BC)
- Easter Island / Rapa Nui (moai statues on volcanic coastline, ahu platforms facing inland, quarry at Rano Raraku — BEND RULES for this iconic culture)
- Nan Madol, Micronesia (basalt-log city built on artificial islands in a lagoon, "Venice of the Pacific" — BEND RULES)
- Tonga (Ha'amonga 'a Maui trilithon — Pacific Stonehenge, coral-block platforms)
- Polynesian navigation culture (double-hulled voyaging canoes, star-navigation, stone marae platforms on volcanic shores)

━━━ SCENE TYPES (mix across all) ━━━
- Megalithic temples on sea cliffs (massive stone structures perched above crashing waves, ocean horizon behind)
- Moai statues at dawn/dusk (rows of stone faces on volcanic coastline, dramatic sky, grass-covered slopes)
- Stone towers on island hilltops (nuraghe/talayot silhouetted against sea, wind-bent vegetation, distant islands)
- Island harbor settlements (stone-built port towns, fishing boats, colorful sea, terraced architecture climbing from shore)
- Basalt-log artificial islands (Nan Madol canals, geometric basalt columns stacked into walls, tidal water channels)
- Quarry scenes (half-carved moai still attached to volcanic rock, abandoned stone blocks on hillside, ocean beyond)
- Ceremonial platforms by the sea (stone altars, carved stelae, offerings, waves breaking nearby)
- Navigation scenes (massive double-hulled canoes approaching volcanic island, star-filled sky, phosphorescent wake)
- Underwater ruins (submerged stone walls visible through crystal water, fish swimming past carved doorways, sunlight penetrating)
- Island interiors (cave temples, underground cisterns carved from living rock, sacred pools lit by sky-holes)

━━━ PERIOD ACCURACY — HARD RULES ━━━
- MOSTLY pre-600 BC, with SELECTIVE exceptions for iconic island megalithic cultures
- ALLOWED exceptions (these feel authentically ancient despite dates): Easter Island moai, Nan Madol, Tongan trilithon, Polynesian voyaging
- Malta 3600-2500 BC ✓ | Sardinia nuraghe 1900-730 BC ✓ | Cycladic 3200-2000 BC ✓ | Minoan 2700-1450 BC ✓
- NO medieval castles on islands, NO Greek classical temples (Doric/Ionic columns), NO Roman villas
- NO modern harbors, NO sailing ships with multiple masts, NO cannon, NO glass windows
- Materials: limestone, basalt, volcanic rock, coral blocks, timber, thatch, obsidian, shell, bone, copper
- Construction should look PRIMITIVE-MONUMENTAL — massive stone moved by human labor, not refined engineering

━━━ RULES ━━━
- Each entry is ONE specific island scene with civilization and ocean baked in
- OCEAN is always present or implied — the isolation, the vastness, the wind
- Stone dominates — these cultures built with what the island gave them (limestone, basalt, volcanic rock, coral)
- Wind and weather are characters: salt spray, sea mist, wind-bent grass, dramatic island clouds
- Light is dramatic: unobstructed ocean horizons mean BIG sunrises/sunsets, strong shadows, vivid sky color
- 25-40 words
- NO medieval, NO mainland cities, NO fantasy, NO Greek/Roman classical
- Mix coastal and interior-island compositions, always with ocean context

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
