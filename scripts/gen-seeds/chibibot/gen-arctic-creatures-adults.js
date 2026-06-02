#!/usr/bin/env node
/**
 * One-time append: balance arctic_creatures.json with ADULT counterparts.
 * Existing 200 entries are 86% baby; target = 346 total (~50/50 after append).
 */
const { generatePool } = require('../../lib/seedGenHelper');

generatePool({
  outPath: 'scripts/bots/chibibot/seeds/arctic_creatures.json',
  total: 346,
  append: true,
  batch: 50,
  metaPrompt: (
    n
  ) => `You are writing ${n} ADULT arctic creature descriptions to balance an existing ChibiBot pool. The pool currently leans heavily juvenile — your job is to add MATURE ADULT counterparts.

Pixar / Sanrio / Studio Ghibli STYLIZED aesthetic — cute, never photoreal. ADULT-cute (mature, weathered, dignified, characterful) — NOT baby-cute.

Each entry: 10-20 words. ONE specific adult arctic / sub-arctic / alpine creature.

━━━ ABSOLUTE AGE RULE — NON-NEGOTIABLE ━━━
BANNED words: baby, cub, kit, pup, chick, kitten, puppy, duckling, fawn, joey, calf, piglet, fledgling, nestling, hatchling, juvenile, infant, newborn, tiny.

━━━ SPECIES VARIETY — EVERY ENTRY IS A DIFFERENT SPECIES ━━━
${n} entries = ${n} unique arctic/sub-arctic/alpine species.

━━━ ADULT ARCTIC / ALPINE / SUB-ARCTIC CREATURES (use widely) ━━━
mature polar bear with weathered cream coat, arctic fox in winter pelt, snowy owl with golden gaze, wandering reindeer with full antlers, walrus elder with worn tusks, harbor seal with knowing eyes, ringed seal mid-dive, stately moose with crown antlers, bull caribou patriarch, mountain goat scrambling a cliff, bighorn sheep with full curl, lynx with tufted ears watching, wolverine wandering, ermine elder in white coat, mountain hare resting, snow leopard ghost-pale on rock, musk-ox patriarch with shaggy mantle, gyrfalcon perched on stone, ptarmigan in winter plumage, snow-bunting flock-elder, raven with knowing tilt, snowshoe-hare patriarch, beluga whale surfacing, narwhal with single tusk, orca matriarch breaching, dall sheep with full curl, alpine ibex on a ledge, chamois bounding, stoat in snow-coat, arctic loon on still water, willow ptarmigan elder, bald eagle with weathered wings, golden eagle scanning, kestrel hovering, snowy egret, brown bear elder fishing, alpine marmot guarding burrow, pika gathering grass, wolverine matriarch, sea-otter elder grooming, mature emperor penguin (parent stance), king penguin elder, walrus matriarch on ice-floe, fur seal elder, polar fox in summer brown, arctic wolf with knowing eyes, snowy white wolf patriarch

━━━ FANTASY / MAGICAL ARCTIC (~25% of entries) ━━━
ice-mage with crystal-staff, snow-witch with frost-cloak, frost-spirit ancient with hoarfrost wings, glacier-priest, aurora-shaman with prism-cloak, snowflake-elder, frost-giant grandmother, snow-queen with white-fur cape, ice-elder polar-bear-spirit, midnight-sun-spirit, frostfern-witch, north-star-keeper, blizzard-priest, snow-owl-spirit elder, glacier-dragon (small chibi-but-mature), aurora-fox-spirit, winter-wolf-elder, snow-crystal-priest

━━━ ADULT-CUTE STYLE RULES ━━━
- ALERT, knowing, watchful eyes — NOT oversized-dewy-baby-eyes
- Mature, lean, weathered body — NOT chibi-round-stubby
- Soft expressive face — wise, watchful, dignified, characterful
- Adult fur/feather/skin: thick winter coat, weather-mark, frosted brow, ice-glittered whisker
- Posture: confident, graceful, mid-action, scanning the horizon
- Optional accessories: woven-fur scarf, beadwork collar, antler-carved pendant, ice-crystal pendant, weathered leather satchel
- Pose verbs: padding through snow, pausing at an ice-edge, gazing across tundra, scanning the aurora, mid-leap across a snow-drift, basking on a sunlit floe

━━━ ABSOLUTELY BANNED ━━━
- NO photoreal / NO documentary / NO Nat-Geo
- NO grim-arctic / NO survival-horror / NO blood-on-snow / NO predator-with-prey
- NO sexualized
- NO identifiable real humans
- NO baby tropes (oversized eyes, blushing, chibi, stubby)

━━━ DEDUP DIMENSIONS — CRITICAL ━━━
EVERY ENTRY STARTS WITH A UNIQUE SPECIES NAME. Scan "ALREADY GENERATED" carefully — your additions must be DISTINCT adult species, not adult versions of the babies already in the pool.

━━━ EXAMPLES (DO NOT REUSE) ━━━
- "Mature polar bear: weathered cream coat, knowing dark eyes, paused mid-stride on packed snow, frost on muzzle"
- "Snowy owl: golden watchful gaze, broad white wings, perched on a snow-laden pine, faint breeze ruffling feathers"
- "Bull caribou: crown of weathered antlers, knowing amber eye, mid-stride across a snowy meadow"
- "Lynx: tufted ears alert, pale-blue eyes, paused on a snowy boulder, breath steaming in the cold air"
- "Snow leopard: ghost-pale rosettes, watchful jade eyes, lounging on a high cliff-ledge under aurora light"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
