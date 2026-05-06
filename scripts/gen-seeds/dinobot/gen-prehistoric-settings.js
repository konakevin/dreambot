#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dinobot/seeds/prehistoric_settings.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} LOST-WORLD SETTING descriptions for DinoBot — mythic primordial landscapes nobody has ever seen. Each entry is 22-35 words. Skull Island × Pandora × Land of the Lost × Annihilation × Avatar floating mountains × Prehistoric Planet, all turned to 11.

━━━ NON-NEGOTIABLE — TAKE CREATIVE LICENSE ━━━
Drop documentary restraint. INVENT landscapes that surprise. Nobody knows for sure what these worlds looked like — and this is AI, so we have permission to push past what's "scientifically plausible." Make the viewer say "what IS this place?"

━━━ STACK BIGGER-THAN-LIFE ELEMENTS ━━━
Each entry should layer multiple of these (no minimums on which — but density wins):

VAST TERRAIN (use freely):
- Vast canyons plunging into mist (miles wide, bottomless)
- Thousand-meter waterfalls thundering off cliff-edges
- Sky-piercing mountain ranges in the background
- Mesa-and-spire tower-fields like Monument Valley × 10
- Karst-tower limestone megaspires rising from mist, jungle on top
- Sea-cliffs hundreds of meters tall with surf shattering at the base
- Salt-flat plains stretching to vanishing point
- Glacial valleys with sheer ice-walls glowing turquoise from within
- Volcanic chains marching to the horizon, lava-rivers visible
- Floating-mountain islands (Pandora style — Avatar)
- Inland sea bays with limestone arches and stacks
- Lava-tube cave networks with bioluminescent ceilings

GNARLED MEGA-FLORA (use freely — INVENT):
- Mile-high gnarled trees with twisting trunks the diameter of buildings
- Megaferns spanning entire clearings
- Trees with branches arching into living cathedrals
- Bioluminescent plants pulsing slow at dawn
- Strangler-vine networks knotting whole groves into super-organisms
- Mega-pitcher plants tall as elephants
- Spiral-growing twisted trees
- Fungi the size of vehicles forming staircases up tree-trunks
- Hanging mosses dripping water-films like luminous beaded curtains
- Floating-spore plants releasing translucent seed-balloons
- Rainbow flowering plants the size of cars erupting from canopy
- Trees with bark that glistens like obsidian / weeps sap / ripples

WATER FEATURES (use freely):
- Mirror-flat tannin-stained black-water lagoons
- Mist-rivers flowing through canyon systems
- Thermal pools tinted opal-blue with steam columns
- Stepped travertine pools cascading down cliff-faces
- Waterfall curtains a thousand meters tall
- Mineral-stained polychrome pools (Yellowstone × 10)
- Lakes reflecting sky so still it looks like glass
- Shallow tidal flats reflecting clouds, ammonites visible

WEATHER & SKY DRAMA:
- Mile-wide rain-walls approaching across a plain
- Supercell thunderheads with internal cloud-architecture
- Aurora-bands across the daytime sky
- Double rainbows arching over the scene
- Pyrocumulus rising from distant volcano lit from below by lava
- Comet visible in daytime sky
- Lenticular cloud-discs capping mountains
- Sheet-lightning lighting whole sky cyclically

ATMOSPHERIC DEPTH (always include):
- Multi-layered atmospheric perspective (foreground / mid / far / vanishing)
- Volumetric god-rays cutting through canopy
- Mist filling valley floors
- Pollen / spore drift catching light

━━━ EVERY ENTRY MUST INCLUDE ━━━
- One vast-terrain element (canyon / waterfall / mountain / mesa / cave-system / etc.)
- One bigger-than-life flora element (gnarled-mile-high tree / mega-fungi / strange-bioluminescent / impossible plant)
- Either a water feature OR weather drama (most entries — both are even better)
- Atmospheric depth language (mist / haze / god-rays / vanishing-point)

━━━ SETTING CATEGORIES (cover variety across the 200 — but PUSH every one) ━━━
- Lost-world canyon-jungle hybrids
- Mythic mountain-passes with mile-high foliage
- Coastal cliff-paradise with rookeries
- Deep-jungle understory cathedrals
- Volcanic lost-valleys
- Mist-cloaked karst-spire forests
- Glacial primordial valleys
- Inland-sea megafauna-shores
- Mesa-and-spire deserts with mega-cycadeoids
- Lake-and-waterfall basins
- Bioluminescent-cave entries with rivers flowing in/out
- Floating-island archipelagos (creative license)
- Stepped-travertine wonderlands
- Salt-flat plains with mountain-walls
- River-delta floodplains with megaflora
- Storm-fronts approaching across plains

━━━ LANGUAGE ━━━
Specific, sensory, mythic. Use words like "thundering / mile-high / bottomless / mythic / vast / cathedral / primordial / impossible / gnarled / titanic / obsidian / glittering / weeping / floating / spiraling." Avoid generic "forest" / "valley" / "plain" without modifiers — every noun gets a magnificent adjective.

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: terrain type + dominant flora signature + water-or-weather feature.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
