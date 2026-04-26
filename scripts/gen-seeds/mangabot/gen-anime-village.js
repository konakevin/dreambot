#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/anime_village.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} ANIME VILLAGE scene descriptions for MangaBot — Japanese cottage/village scenes through anime lens. Ghibli village energy — thatched-roof farmhouses, narrow stone lanes, rice paddy paths, fishing villages, mountain hamlets, shrine towns. Exterior views of charming anime villages and their daily life.

Each entry: 15-25 words. One specific anime village scene with architectural + atmospheric detail.

━━━ CATEGORIES ━━━
- Mountain hamlet (steep paths, wooden houses, misty peaks, terraced rice paddies, morning smoke)
- Fishing village (harbor boats, drying nets, sea breeze, wooden docks, cliff cottages, lighthouse)
- Shrine town (torii-lined path, stone lanterns, moss-covered steps, village below, bell tower)
- Rural farmhouse cluster (thatched roofs, vegetable gardens, hanging laundry, well, dirt paths)
- Riverside village (stone bridge, water wheel, willow trees, houses along banks, stepping stones)
- Night village (warm window glow, paper lanterns, moonlit rooftops, fireflies, empty lanes)
- Rainy village (puddles on stone paths, umbrellas, mist rising, wet wooden walls, dripping eaves)
- Autumn village (golden leaves on rooftops, harvest stacks, persimmon trees, smoke curling)
- Snow village (snow-covered roofs, footprints on paths, warm light from windows, icicles)
- Spring village (cherry blossoms over lanes, flower gardens, birds nesting, fresh green)
- Market morning (village vendors, fresh produce stalls, baskets, wooden carts, morning bustle)
- Hillside terraces (layered rooftops, winding stairs between houses, cats on walls, plants)
- Forest edge village (cottages at treeline, giant camphor trees, overgrown paths, dappled light)
- Coastal cliff village (houses on cliffs, winding stone stairs, ocean spray, seagulls, wind)
- Evening village (sunset over rooftops, returning fishermen, cooking smoke, golden light)

━━━ RULES ━━━
- EXTERIOR VIEWS — streets, rooftops, paths, gardens, squares. No interiors
- Japanese architectural vocabulary (engawa, noren, shoji, fusuma, irori chimney)
- Anime illustration style — Ghibli village warmth, painterly backgrounds
- Each entry must describe a UNIQUE scene — different village type, season, time of day, weather, AND lived-in details
- NEVER repeat the same lived-in props across entries — invent fresh signs of daily life for each village
- Dedup on SETTING: no two entries should describe the same type of village in the same conditions

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
