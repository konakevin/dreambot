#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/sunny_village_scenes.json',
  total: 200,
  append: true,
  batch: 50,
  metaPrompt: (
    n
  ) => `You are writing ${n} SUNNY-VILLAGE SCENE descriptions for CuddleBot's sunny-village path. Cozy BRIGHT-SUNNY DAYTIME VILLAGES + COTTAGES + SEASIDE-HAMLETS that the viewer wants to live in. The ARCHITECTURE and SUN-DRENCHED ATMOSPHERE are the hero — not the creatures. Pixar / Sanrio / Studio Ghibli / Greek-island-cottage / Provence-pastoral aesthetic. NEVER photoreal, NEVER documentary nature.

Each entry: 18-28 words. ONE specific sunny-village scene with COZY ARCHITECTURE detail.

━━━ CRITTER RULE — NON-NEGOTIABLE ━━━
EVERY entry MUST include at least one cute critter in the scene — mouse sniffing wildflowers, hedgehog walking down a sun-warmed lane, kitten peeking from a window-box, bunny watering a flower-pot, duckling on a doorstep. The CRITTER + the COZY VILLAGE together = the cute. Architecture alone is not cute — the critter adds the soul. Critter is peripheral (small in frame, not center) but ALWAYS PRESENT.

━━━ VILLAGE TYPES (mix broadly across all entries) ━━━
- White-stucco Mediterranean cliff hamlet — white cottages with blue shutters tumbling down a coastal cliff, terracotta-tile roofs
- Sunflower-garden village square — village square ringed with cottages, towering sunflowers in the center, painted-wood signs
- Lavender-field hamlet — Provence-style stone cottages amid endless lavender rows, dirt path, terracotta roofs
- Lemon-grove village — yellow-stucco cottages amid lemon trees, sun-warmed cobblestones, blue-shutter windows
- Daisy-meadow cottage cluster — thatched-roof cottages amid wild daisies, sunny meadow stretching, picket fences
- Vineyard hilltop village — stone cottages along a vineyard slope, grape-arbors, sun-warmed terraces
- Beach-cabin row at noon — pastel-painted beach cabins lined along sandy shore, parasols, towel-lines
- Hilltop chapel hamlet — small village around a sun-bleached chapel, white walls, blue-shutter windows
- Summer harbor town — pastel cottages along a sunny harbor, fishing-boats moored, gull-shaped clouds
- Cobblestone lane at golden hour — cottage row with sun-glittering cobblestones, climbing roses on archways
- Sun-drenched market square — village square with market stalls, bunting strung between rooflines, cafe-tables in sun
- Wildflower-meadow hamlet — cottages amid summer wildflowers, butterflies, breeze-tousled grass, dirt path
- Apple-orchard village — cottages in an apple-orchard, sun through leaves, fruit baskets at every door
- Hayfield-cottage cluster — thatched-roof cottages amid golden hay-bales, breeze, soft sky-blue
- Cottage-garden village — cottages with overflowing flower-gardens, climbing-vine arches, painted-gate fences
- Sun-bleached fishing village — wooden cottages over rocky shore, fishing-nets drying, sun-glittering water
- Tuscan hilltop hamlet — terracotta-roof cottages on a sun-warmed Tuscan hill, cypress trees, dirt road
- Seaside white-stucco harbor — white-cottage harbor with blue painted boats, painted shutters, breeze
- Bicycle-lane cottage row — cottage row with a sunny bicycle-lane, baskets of flowers on every bike
- Cafe-table-lined square — village square ringed with cafe-tables under parasols, dappled-sun cobblestones
- Sunflower-cottage hamlet — single sunflower-yellow-painted cottage in a meadow, picket fence, garden gate

━━━ SUPER OVERLAY CUTE STYLE (every entry) ━━━
- Architecture rendered with obsessive cozy detail: white-stucco cottages with terracotta-tile roofs, climbing-roses on archways, sunflower-row fences, lavender-bordered paths, lemon-trees in tiled courtyards, blue-shutter windows thrown open, white-linen laundry on sun-drenched lines, painted-wood signs, market-baskets stacked
- STRONG WARM-GOLD sunlight is non-negotiable — bright daytime, sun-glittering surfaces, lens-flare optional
- Sunny palette: warm honey-gold + white-stucco + terracotta-orange + sky-blue + sunflower-yellow + lavender-violet + cream
- The village feels LIVED IN at noon — washing on lines, sun-bleached doorways, baskets of fruit on stoops, bunting strung between rooflines, café-tables in dappled-sun, bicycle-against-fence
- Optional small peripheral creature (mouse, hedgehog, kitten, bunny, chick, duckling) doing something cute in the village

━━━ ABSOLUTELY BANNED ━━━
- NO photoreal / NO documentary
- NO overcast / NO gray / NO rain / NO storm — this path is ALWAYS bright sun
- NO modern infrastructure (no cars, no power-lines, no concrete office buildings, no neon signs)
- NO identifiable humans
- NO scary / NO menace

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: village-type + key-architectural-feature + creature-vs-empty + light-condition. Vary VILLAGE-TYPE + ARCHITECTURAL-DETAIL + UNIQUE-FEATURE across entries.

━━━ EXAMPLES (DO NOT REUSE) ━━━
- "White-stucco Mediterranean cliff hamlet at noon, blue-shutter cottages tumbling down coastal cliff, terracotta-tile roofs, sun-glittering harbor below"
- "Empty lavender-field hamlet at golden hour, Provence stone cottages amid endless lavender rows, dirt path winding between, terracotta roofs"
- "Tiny mouse watering a window-box in a sunflower-garden village square, painted-wood signs, towering sunflowers in the center"
- "Sun-drenched market square at noon, bunting between rooflines, cafe-tables under parasols on dappled-sun cobblestones, fruit-baskets stacked"
- "Vineyard hilltop village at golden hour, stone cottages along a vineyard slope, grape-arbors casting dappled shadows, terracotta roofs glowing"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
