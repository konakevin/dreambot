#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/tinybot/seeds/cottage_village.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} MINIATURE COTTAGE VILLAGE scene descriptions for TinyBot — dollhouse-scale cottage villages photographed with a tilt-shift macro lens. Tiny thatched-roof cottages, cobblestone lanes, glowing windows, chimney smoke, village squares, stone bridges, market stalls — all at MINIATURE DIORAMA SCALE. These are exterior views of tiny villages, not interiors.

Each entry: 15-25 words. One specific miniature village scene with scale + architectural details.

━━━ CATEGORIES (spread across all) ━━━
- Miniature village street (cobblestone lane between rows of tiny cottages, flower boxes, shop signs)
- Tiny thatched cottage cluster (3-5 cottages with gardens, fences, washing lines, woodpiles)
- Dollhouse-scale village square (fountain, market stalls, benches, lampposts, cobblestones)
- Miniature stone bridge (arched bridge over stream, mossy stones, ducks, reflections)
- Tiny harbor village (small boats, dock pilings, fishing nets, lighthouse, cottage row)
- Miniature hilltop village (cottages climbing a slope, winding path, church steeple at top)
- Dollhouse canal village (tiny rowboats, canal-side cottages, flower bridges, reflections)
- Miniature forest clearing village (cottages tucked between giant tree roots, mushroom gardens)
- Tiny mountain village (alpine cottages, snow-dusted roofs, woodpiles, stone walls, pine trees)
- Miniature coastal village (cliff cottages, winding stairs, sea spray, lighthouse, tide pools)
- Dollhouse night village (warm glowing windows, lantern-lit paths, moonlit rooftops, chimney smoke)
- Miniature rainy village (puddles on cobblestones, rain on roofs, mist, wet stone walls)
- Tiny autumn village (leaf-covered roofs, pumpkins by doors, golden trees, harvest crates)
- Miniature winter village (snow-covered roofs, icicles, warm window glow, tiny footprints in snow)
- Dollhouse spring village (cherry blossoms, flower gardens, birds nesting, fresh green)
- Miniature summer village (sunflower gardens, open shutters, bunting strung between cottages)
- Tiny market day (stalls with miniature produce, bunting, baskets, scales, cheese wheels)
- Miniature mill village (water wheel turning, flour sacks, millpond, ducks, stone walls)
- Dollhouse garden village (allotments, greenhouses, potting sheds, vegetable rows, beehives)
- Tiny churchyard village (stone church, graveyard with flowers, lychgate, bell tower)
- Miniature railway village (tiny station platform, signal box, crossing gates, steam puff)
- Dollhouse riverside village (cottages along banks, stepping stones, willows, rowboats tied up)

━━━ SCALE RULE ━━━
Every scene must read as MINIATURE / DOLLHOUSE / DIORAMA scale. These are model villages — include scale cues like "thumb-sized chimneys," "matchbox cottages," "thimble-sized flower pots," or tilt-shift perspective language.

━━━ EXTERIOR ONLY ━━━
ALL scenes are OUTDOOR VIEWS of villages — rooftops, streets, paths, gardens, squares. NEVER interior rooms. The camera is ABOVE or BESIDE the village looking at it like a model railway layout.

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: village type + season/weather + specific architectural detail. "Rainy cobblestone lane with puddles" and "wet village street in mist" are TOO SIMILAR. "Rainy cobblestone lane with a tiny red umbrella by a door" and "moonlit village square with frost on fountain" are distinct.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
