#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/cuddlebot/seeds/cottagecore_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} COTTAGE VILLAGE scene descriptions for CuddleBot — a cute/cozy bot that renders stylized adorable artwork. These are scenes of CUTE LITTLE COTTAGES, VILLAGE STREETS, TOWN SQUARES, and tiny creatures OUT AND ABOUT in their charming cottage villages. Think: a tiny hedgehog walking down a cobblestone path past flower-covered cottages, a village of mushroom houses with glowing windows at night, a rainy afternoon on a cottage lane with puddles reflecting warm light.

The ARCHITECTURE and SETTING are the star — cottages, pathways, bridges, market squares, forest clearings with little homes. Creatures are secondary — they're residents going about their village life.

Each entry: 15-25 words. One specific cottage village scene.

━━━ WHAT MAKES A GOOD ENTRY ━━━
- Centers on COTTAGE ARCHITECTURE + VILLAGE LIFE — the buildings, streets, paths, and atmosphere
- Specific enough to render a DISTINCT scene (not just "a cute village")
- The scene feels LIVED IN — laundry on lines, light in windows, smoke from chimneys, muddy boots by doors
- About 60% should include a tiny creature (hedgehog, bunny, mouse, fox, kitten, bird) out and about in the village — walking, carrying something, heading home, shopping at a tiny market stall
- About 40% pure village environment — no creatures, just the cottages and atmosphere

━━━ CATEGORIES TO COVER (spread across all) ━━━
- Village streets and lanes (cobblestone paths between cottages, winding lanes, stone archways, market squares)
- Cottage exteriors (thatched roofs, climbing roses, flower boxes, colorful front doors, mossy stone walls, garden gates, stone steps)
- Night scenes with glowing windows (warm yellow light spilling from cottage windows, lantern-lit paths, moonlit village rooftops, firefly-dotted lanes)
- Rainy day village scenes (puddles on cobblestones, rain on thatched roofs, creatures with tiny umbrellas, misty village mornings)
- Forest cottage clusters (cottages tucked between giant tree roots, mushroom-cap houses in a clearing, treehouse village connected by bridges)
- Bridge and waterway scenes (stone bridges over streams, canal-side cottages, mill wheels turning, ducks on a village pond)
- Seasonal village scenes (autumn leaves on cottage roofs, snow-dusted village square, spring blossoms arching over a lane, summer wildflower meadow behind cottages)
- Creature "out and about" moments (hedgehog carrying groceries home, mouse pushing a tiny cart, bunny sweeping a cottage doorstep, fox kit splashing in puddles)

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: village setting type + time/weather + creature activity (if present). "rainy cobblestone lane" and "rainy village street" are too similar. "rainy cobblestone lane with a mouse under a leaf umbrella" and "moonlit village square with glowing cottage windows" are distinct.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
