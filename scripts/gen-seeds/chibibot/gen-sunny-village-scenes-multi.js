#!/usr/bin/env node
/**
 * Append PAIR + TRIO scenes to sunny_village_scenes.json. Existing 200
 * single-creature scenes stay. Target: 50/30/20 solo/pair/trio.
 */
const { generatePool } = require('../../lib/seedGenHelper');

generatePool({
  outPath: 'scripts/bots/chibibot/seeds/sunny_village_scenes.json',
  total: 400,
  append: true,
  batch: 50,
  metaPrompt: (
    n
  ) => `You are writing ${n} MULTI-CHARACTER SUNNY-VILLAGE scenes for ChibiBot's sunny-village path. The pool already has 200 single-creature scenes — your job is to add PAIR + TRIO village scenes so renders vary character count.

Pixar / Sanrio / Studio Ghibli / Greek-island / Provence STYLIZED. NEVER photoreal. Cute baby AND adult creatures both fine — mix freely.

Each entry: 18-28 words. ONE specific sunny-village scene with COZY ARCHITECTURE detail and MULTIPLE creatures.

━━━ COUNT MIX (every entry is multi) ━━━
- ~60% PAIR: two creatures sharing a village moment
- ~40% TRIO: three creatures in an intimate group

━━━ FORCING MULTI-CHAR COMPOSITION ━━━
Language MUST make Flux render multiple characters at equal prominence:
- "TWO DISTINCT chibi figures equally prominent" / "all three visible side-by-side" / "both characters in foreground"
- DIFFERENT species per character so Flux can't merge them
- RELATIONAL contact: side-by-side, walking together, sharing a basket, gathered around a fountain, mid-conversation

━━━ VILLAGE TYPES (mix broadly) ━━━
- White-stucco Mediterranean cliff hamlet — blue-shutter cottages tumbling down coastal cliff
- Sunflower-garden village square — towering sunflowers in center, painted-wood signs
- Lavender-field hamlet — Provence stone cottages amid endless lavender rows
- Lemon-grove village — yellow-stucco cottages amid lemon trees
- Daisy-meadow cottage cluster — thatched-roof cottages amid wild daisies
- Vineyard hilltop village — stone cottages along vineyard slope, grape-arbors
- Beach-cabin row at noon — pastel-painted cabins, parasols, towel-lines
- Hilltop chapel hamlet — small village around sun-bleached chapel
- Summer harbor town — pastel cottages along sunny harbor, fishing-boats moored
- Cobblestone lane at golden hour — climbing roses on archways
- Sun-drenched market square — bunting between rooflines, cafe-tables in sun
- Apple-orchard village — sun through leaves, fruit baskets at every door
- Cottage-garden village — overflowing flower-gardens, climbing-vine arches

━━━ MULTI-SPECIES CHARACTER COMBOS (use widely) ━━━
Pairs: hedgehog + mouse / fox + bunny / kitten + duckling / squirrel + chipmunk / lamb + chick / rabbit + sparrow / cat + butterfly / piglet + chick / fox + hedgehog
Trios: three siblings (mice / kittens / ducklings) / parent + two young / two friends + one pet / mixed-species gathering

━━━ COZY OVERLAY (every entry) ━━━
- Architecture: white-stucco / terracotta / climbing-roses / blue-shutters / cobblestones / wooden signs / market-baskets
- Sunny palette: warm honey-gold + white-stucco + terracotta-orange + sky-blue + sunflower-yellow + lavender-violet
- Strong WARM-GOLD daytime sunlight is non-negotiable
- Village feels LIVED IN — washing lines, bunting, café tables in dappled sun, bicycle against fence
- Multi-character composition is RELATIONAL — the creatures are TOGETHER doing village life

━━━ ABSOLUTELY BANNED ━━━
- NO photoreal / NO documentary
- NO overcast / NO storm — always bright sun
- NO modern infrastructure (no cars, power-lines, concrete)
- NO identifiable humans
- NO single-creature entries (this batch is multi only)
- NO chibi tropes inflated past charm

━━━ DEDUP DIMENSIONS ━━━
UNIQUE village-type + species-combination + activity per entry. Existing 200 are single-creature; yours must use DIFFERENT species pairs/trios in different village settings + activities.

━━━ EXAMPLES (DO NOT REUSE) ━━━
- "TWO DISTINCT chibi figures equally prominent: hedgehog with herb basket and mouse with bread loaf walking cobblestone lane in sunflower-garden village square at noon"
- "TRIO of chibi siblings — three round bunnies in blue aprons gathered around a market stall at sun-drenched square, all three visible side-by-side, fruit-baskets stacked"
- "TWO DISTINCT chibi figures: fox kit and lamb both equally prominent in foreground walking sun-warmed lavender-field path past Provence stone cottages, golden hour"
- "TRIO at outdoor café table in cobblestone hilltop hamlet, three chibi mice with tiny teacups, all three foregrounded under striped parasol, terracotta-roof backdrop"
- "TWO DISTINCT chibi figures equally prominent: chibi rabbit in flower crown carrying lemon basket, chibi sparrow perched on rabbit's shoulder, lemon-grove village at noon"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
