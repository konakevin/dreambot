#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/arctic_village_settings.json',
  total: 200,
  batch: 15,
  metaPrompt: (n) => `You are writing ${n} ARCTIC-VILLAGE SETTINGS for ChibiBot arctic-village — cozy snow/ice/aurora villages that are the HERO of the frame. The village ARCHITECTURE and arctic atmosphere are the subject. NOT a single cottage — a VILLAGE (cluster of multiple dwellings).

Each entry: 25-40 words. ONE specific arctic-village. NO creatures, NO time-of-day, NO weather verbs.

━━━ THE BAR — CHIBI-SCALE COZY SNOW VILLAGE I WANT TO LIVE IN ━━━

The viewer's reaction: "I want to move into that snow-village." Cluster of multiple dwellings. Warm-amber window-glow despite the cold. Heavily detailed lived-in cottagecore-arctic. Studio Ghibli / Frozen / Polar-Express / Arrietty aesthetic.

━━━ 11 SUB-TYPES — MUST VARY ACROSS THE POOL ━━━

Each entry picks ONE sub-type. Distribute roughly evenly across all 11:

- 10% SNOW-COTTAGE ROW (row of snow-roofed cottages along a candy-cane-fenced lane, smoke curling from stone chimneys, warm-amber windows, pine-bough wreaths on every door, snowdrifts piled along the foundations, lantern-poles at intervals)
- 10% IGLOO CLUSTER (cluster of glowing-blue igloos arranged around a frozen-firepit plaza, glow-from-within turquoise dome-light, ice-block walls catching aurora-shimmer, hide-flap doors, fish-drying racks, sealskin-canoes parked nearby, fur-lined entry-passages)
- 10% LOG-CABIN VILLAGE UNDER AURORA (cluster of log-cabin cottages with snow-laden pine roofs under a shimmering green-and-violet aurora arch, smoke-from-chimneys, warm-amber windows, hot-cocoa-thermos visible on a porch, snow-shovel leaning by a door, sled parked at one cabin)
- 10% GINGERBREAD-SNOW-FORTRESS (cluster of gingerbread-cookie-style cottages with candy-cane fence-posts, icing-sugar-snow rooflines, peppermint-stripe lantern-poles, sugar-cookie chimneys, gum-drop-flower window-boxes, sweet-treat lamp-posts — like Hansel-and-Gretel-meets-Whoville)
- 10% POLAR-STATION HAMLET (research-station polar-village with bundle-up red-painted huts on stilts above the snow, wooden walkways connecting them, fairy-light strands strung between, weather-vane on each roof, hanging-fish-flag signage, snowmobiles parked, weather-bunting flapping)
- 10% PINE-CABIN GLEN (cluster of A-frame and gabled-roof pine-cabins in a sheltered glen of snow-laden pine-trees, fairy-light strands strung tree-to-tree, smoke-from-chimneys, warm-amber-windows reflected in a frozen-pond at the village center, footbridges over snowy-streams)
- 10% ICE-CASTLE HAMLET (cluster of crystalline-ice cottages and a small ice-tower at the center, all glowing softly from within with cool blue-and-violet inner light, ice-bridge connectors, suspended ice-lanterns, snowflake-window-tracery, snow-laden roofs)
- 10% FISHING-VILLAGE ON FROZEN LAKE (cluster of pastel-painted fishing-cottages along the shore of a frozen lake, ice-fishing-huts dotting the lake-ice itself, smoke-from-chimneys, lantern-poles along a wooden boardwalk, sleds parked, fish-drying-racks, painted boats overturned on the shore)
- 5% HOT-SPRING VILLAGE (cluster of snow-blanketed cottages around a steaming hot-spring, steam-rising in misty plumes, warm-amber windows, paper-lantern strands above the spring, snow-laden pine-trees, stone-bench-seating, soaking-tubs visible at the spring's edge)
- 5% CANDY-CANE LANE VILLAGE (whimsical candy-cane-themed snow village with peppermint-stripe lamp-posts, gingerbread-cottages, marshmallow-pile snowdrifts, sugar-icing-roof-trim, candy-cane fence-posts marching down a snowy lane, gum-drop-flower window-boxes — over-the-top-cute holiday register)
- 10% MOUNTAIN-CHALET CLUSTER (cluster of alpine-chalets with carved-wood-balcony overhangs, snow-laden pitched-roofs, warm-amber-windows, wooden shutters carved with snowflake-patterns, smoke-from-chimneys, sleds and skis parked outside, fairy-lights strung between buildings, snow-capped peaks framing the background)

━━━ MANDATORY: COZY-DECOR ELEMENTS IN EVERY ENTRY ━━━

Each entry MUST visibly include at least 3 cozy-village elements: warm-amber-windows, smoke-from-chimneys, lantern-poles, snowdrifts/snow-laden-roofs, fairy-lights, paw/foot-prints, pine-trees, hanging-decor (wreaths/garlands/bunting), sleds/snowshoes/snowmobiles, fish-drying-racks, water-pump.

━━━ HARD BANS ━━━

- NO creatures or characters
- NO time / weather / activity verbs
- NO single solo cottage — must be a VILLAGE (cluster of multiple dwellings)
- NO dark / moody / abandoned villages
- NO modern tech (except polar-station weather-instruments / snowmobiles which fit the biome)
- NO human-scale crammed-urban density — chibi-scale cozy

━━━ OUTPUT ━━━

JSON array of \${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
