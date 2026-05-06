#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dinobot/seeds/prehistoric_settings.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} PREHISTORIC SETTING descriptions for DinoBot — IMAX cinematic Mesozoic landscapes (Prehistoric Planet × Avatar Pandora × Jurassic World wet-and-lush). Each entry is 18-30 words and describes a specific setting with EXAGGERATED PRIMORDIAL FOLIAGE distributed throughout the frame.

━━━ NON-NEGOTIABLE — LUSH MEGA-FOLIAGE EVERYWHERE ━━━
Every entry must explicitly include massive prehistoric flora at MULTIPLE positions in the frame: foreground (giant fern fronds, draping vines, mossy logs close to camera) + midground (tree-ferns, cycads, conifers at dinosaur scale) + background (canopy and horsetail-spires receding into atmospheric haze). The plants are CHARACTERS in the scene, not just backdrop.

━━━ JURASSIC + CRETACEOUS FLORA VOCABULARY ━━━
Use a rich variety of era-appropriate plants — DO NOT default to "ferns and cycads" every entry. Cycle through:
- Mega-ferns (tree-ferns, Cyathea, Dicksonia, Osmunda)
- Cycads + cycadeoids (Cycas, Bennettitales, palm-frond crowns)
- Towering horsetails (Equisetum, 15m green spears)
- Conifers (Araucaria/monkey-puzzle, Wollemia, Sequoia ancestors, ginkgo, Podocarpus)
- Tree-ferns forming canopy cathedrals
- Liana vine-curtains, hanging mosses, epiphytes
- Liverwort and moss carpets coating every rock and log
- Cretaceous flowering plants (early magnolias, water lilies, ginger relatives, Archaefructus)
- Lycophytes / club-mosses
- Fallen mossy logs with bracket-fungi
- Bromeliad-and-orchid clusters (Cretaceous lineages)

━━━ SETTING CATEGORIES ━━━

LUSH JUNGLE / FOREST (heavy emphasis):
- Cretaceous rainforest understory with cycad mid-frame, mega-fern fronds in foreground draping toward camera, canopy cathedral overhead, vine-curtains catching light
- Jurassic conifer forest with Araucaria trunks 50m tall, ground carpeted in club-mosses and ferns, distant horsetail-spires through morning haze
- Tree-fern grove at dawn, fronds 8m across forming a green ceiling, ground-mist pooling at dinosaur ankles, light-shafts cutting through

WATER-CENTRIC (lots of these — wet world):
- Mesozoic river delta with mirror-flat water reflecting cycad silhouettes, mega-ferns dripping water at the bank, horsetail thicket on the far shore
- Tropical lagoon at sunset, turquoise water, palm-cycad fringe, distant Araucaria silhouettes, water lilies in the foreground
- Misty swamp with knee-deep tannin-stained water, hanging mosses curtaining the canopy, horsetail-thickets emerging like green spears
- Volcanic-warmed thermal pool with steam rising, fern banks crowding the edge, ground reflecting opal-colored water

VOLCANIC / GEOTHERMAL:
- Active Jurassic volcanic plain with Araucaria forest at edges, ash-fall haze, lava-glow on a distant cone, mega-ferns in resilient pockets
- Crater-lake at dawn with mineral-blue water, cycads ringing the rim, horsetails growing in shallow margins, mist rising

OPEN / EPIC LANDSCAPES:
- Cretaceous floodplain at golden hour with scattered mega-cycads dotting the savanna, gingko grove silhouetted on a distant ridge, atmospheric haze
- Coastal sea-cliffs at dawn with pterosaur-rookery distant, sheet of ocean below, conifer forest above, salt-spray mist in the air
- Inland sea-shore with shallow tidal flats reflecting sky, ammonites visible in shallows, fern-banked dunes behind

DENSE UNDERSTORY:
- Floor of a tree-fern cathedral, light-shafts cutting through canopy 20m above, ground carpeted in moss, fallen logs sprouting fungi
- Cycad-thicket dense as a wall, gaps just wide enough for a sauropod neck, vine-curtains hanging between trunks
- Mossy gorge with primordial waterfall, ferns clinging to the rock walls, prismatic mist in the spray

ARID (less common — used sparingly for variety):
- Triassic desert with rocky outcrops and scattered cycadeoids, distant volcanic peaks, dust-haze on the horizon
- Mesozoic dune-field with sparse Bennettitales clusters, ripple patterns in the sand, oasis fringe in middle distance

━━━ EVERY ENTRY MUST INCLUDE ━━━
- Specific era reference (Jurassic / Cretaceous / Triassic) when natural, OR plant species hints
- Foliage at multiple frame positions (foreground + midground + background)
- An atmospheric depth element (mist / haze / golden hour / dawn-fog / mineral-water etc.)
- A reflective or wet element when the setting allows (water, mud, dew, mist on leaves)

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: ecosystem type + dominant flora + water-or-not + time-of-day.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
