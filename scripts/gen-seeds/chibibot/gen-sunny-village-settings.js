#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/sunny_village_settings.json',
  total: 200,
  batch: 25,
  metaPrompt: (n) => `You are writing \${n} SUNNY-VILLAGE SETTINGS for ChibiBot sunny-village — cozy sunny-biome villages that are the HERO of the frame. NOT a single cottage — a VILLAGE (cluster of multiple dwellings).

Each entry: 25-40 words. ONE specific village. NO creatures, NO time-of-day, NO weather verbs.

━━━ THE BAR — CHIBI-SCALE COZY SUNNY VILLAGE I WANT TO LIVE IN ━━━

The viewer's reaction: "I want to move into that sunny village." Cluster of multiple dwellings. Heavily detailed lived-in. Studio Ghibli / Kiki-Delivery-Service / Porco-Rosso / Luca / Spirited-Away aesthetic.

━━━ 11 SUB-TYPES — MUST VARY ACROSS THE POOL — distribute roughly evenly ━━━

- 10% BOUGAINVILLEA-CLAD VILLAGE (cluster of white-washed cottages draped in cascading bougainvillea, terracotta-tile roofs, cobblestone alleys, blue-shutters, geranium-pots on every stair, distant cliff or hill)
- 10% MEDITERRANEAN WHITE-CLIFF (cluster of white-cottages stacked down a sea-cliff overlooking a sparkling blue Aegean sea, blue-domed church-roof, narrow-cobblestone stairs, hanging-laundry between balconies)
- 10% TERRACOTTA-ROOF CLUSTER (cluster of stone-cottages with weathered-terracotta-tile roofs nestled in a Tuscan landscape, cypress trees flanking, dirt road winding, olive-grove background)
- 10% SANTORINI-STYLE CLIFF-VILLAGE (cluster of white-cottages with blue-domed roofs cascading down a Greek-island cliff, narrow stone-stairs, hanging bougainvillea, distant ferry on blue sea, white-washed cobblestone)
- 10% DESERT-OASIS HAMLET (cluster of mud-brick cottages around a palm-fringed oasis, date-palm clusters, sandstone walls, blue-tiled water-pool, distant golden dunes, white-canvas awnings)
- 10% SUN-BLEACHED PUEBLO (cluster of adobe-pueblo dwellings in warm sand-and-rust tones, wooden-ladder access between levels, hanging chili-peppers and dried-corn, kiva-fireplaces, painted-pottery on steps)
- 10% FISHING-PORT COTTAGES (cluster of pastel-painted fishing-cottages along a small harbor with painted-fishing-boats moored, nets drying, lobster-pots stacked, weathered wooden docks)
- 10% ORCHARD-GROVE VILLAGE (cluster of stone-cottages nestled in an orange-or-olive-grove, fruit-laden trees, low stone-walls, dirt paths, hay-bales, golden-wheat-fields in distance)
- 5% MOSAIC-TILE VILLAGE (cluster of cottages decorated with intricate Moroccan-style mosaic-tiles in warm yellows-and-oranges, geometric patterns, fountain in plaza, blue-doors, hanging-lantern strands)
- 10% PALM-FRINGED HAMLET (cluster of tropical-stilted-cottages on a palm-fringed beach, thatched-roofs, blue-water beyond, hammocks strung, surfboards leaning, beachfront warmth)
- 5% TUSCAN OLIVE-GROVE (cluster of stone-cottages in a Tuscan olive-grove with cypress-tree row, golden-wheat-field, sunflower-rows, terracotta-pot herbs, distant rolling hills)

━━━ MANDATORY: COZY-DECOR ELEMENTS IN EVERY ENTRY ━━━

Each entry MUST visibly include at least 3 village elements that establish the biome (architecture / lighting / flora / atmosphere / props).

━━━ HARD BANS ━━━

- NO creatures or characters
- NO time / weather / activity verbs
- NO single solo cottage — must be a VILLAGE (cluster of multiple dwellings)
- NO dark / moody / abandoned villages
- NO snow / NO winter / NO heavy-overcast-gloom / NO underwater — strictly warm Mediterranean / Tuscan / Greek / Moroccan sun-drenched

━━━ OUTPUT ━━━

JSON array of \\${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
