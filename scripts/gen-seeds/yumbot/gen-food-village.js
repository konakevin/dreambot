#!/usr/bin/env node
// YumBot Stage P3 (SHADOW) — food-village. A tiny VILLAGE built from kawaii
// food: gingerbread cottages, sushi buildings, cupcake towers — inhabited by
// cute food-characters (with faces). SCENE = the food-village world; RESIDENTS =
// the kawaii food-characters living there. MVP-25 each.
//
// No-humans lesson (Stage N): a "village" can summon human inhabitants — so the
// RESIDENTS are affirmatively cast as food-characters and the scene never names
// people. Reinforced by the yumbot_food_neutral "no humans" suffix.
const { generatePool } = require('../../lib/seedGenHelper');

(async () => {
  await generatePool({
    outPath: 'scripts/bots/yumbot/seeds/yumbot_food_village_scenes.json',
    total: 120,
    append: true,
    batch: 25,
    metaPrompt: (
      n
    ) => `You are writing ${n} KAWAII FOOD-VILLAGE SCENES for YumBot. Each entry is a tiny whimsical VILLAGE/town BUILT ENTIRELY FROM FOOD — the buildings, streets and landmarks are all made of kawaii food, and cute food-characters live there. Each entry 20-32 words. Describe the food-village WORLD + its edible architecture (the food-character residents are supplied separately).

━━━ FOOD-VILLAGE THEMES (spread across all ${n}) ━━━
- Gingerbread village (gingerbread cottages with icing trim, candy-cane lampposts, gumdrop gardens, a marshmallow-snow lane)
- Sushi town (nigiri buildings, a rolled-sushi tower, seaweed-wrapped shops, a soy-sauce river, chopstick bridges)
- Bread-and-pastry hamlet (crusty-loaf houses, croissant rooftops, a baguette footbridge, a pretzel archway, a bun bakery)
- Cupcake town (cupcake-tower houses with frosting roofs, sprinkle streets, a cherry-topped town hall, candle streetlamps)
- Dumpling village (steamed-bun cottages, a bamboo-steamer town square, dumpling-boat canal, a noodle-bridge)
- Candy cottage hamlet (lollipop trees, gumdrop-cobble streets, a peppermint-swirl tower, a chocolate-river mill)
- Pancake-stack village (fluffy pancake-stack towers dripping syrup, butter-pat rooftops, a berry-compote pond)
- Fruit-town (a watermelon-slice house, orange-peel domes, a berry market, a banana-boat dock, a leafy plaza)
- Donut village (donut-ring rooftops, sprinkle roads, a glazed town gate, a coffee-cup fountain)
- Ramen-and-noodle town (noodle-bowl buildings, a broth harbor, egg-slice moons, a nori-flag square)
- Ice-cream village (waffle-cone towers, scoop-dome houses, a hot-fudge river, a sprinkle promenade)
- Taco-and-fiesta town (folded-taco houses, tortilla awnings, a salsa fountain, a pepper-string market, papel-picado of marks)

━━━ THE KAWAII IDENTITY ━━━
The whole village is made of soft, adorable kawaii food. The RESIDENTS are cute food-characters with smiling faces (dot eyes, rosy cheeks) — NEVER people. The village feels lived-in and cozy: little windows glowing, food-character residents about their day, edible landmarks. Sweet, jewel-bright or pastel, storybook-charming.

━━━ RULES ━━━
NO humans anywhere — every resident and figure is a cute FOOD-CHARACTER. NO readable text (decorative marks only). NO photoreal / gritty register. Keep each entry a distinct food-village theme + a specific edible-architecture detail.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  await generatePool({
    outPath: 'scripts/bots/yumbot/seeds/yumbot_food_village_residents.json',
    total: 120,
    append: true,
    batch: 25,
    metaPrompt: (
      n
    ) => `You are writing ${n} KAWAII FOOD-CHARACTER RESIDENT snippets for YumBot's food-village path — the cute food-characters who LIVE in a village made of food, caught mid-action so the village feels alive. Each 10-18 words. START WITH THE FOOD-CHARACTER + AN ACTIVE VERB.

━━━ FOOD-CHARACTERS (spread across all ${n}) ━━━
Cute smiling-faced food folk: a bread loaf, a sushi piece, a cupcake, a dumpling, a strawberry, a donut, an egg, an avocado, a mochi, a pancake, a boba cup, an ice-cream cone, a mushroom, a bao bun. All are adorable food-characters with faces + tiny limbs, NEVER human.

━━━ ACTIONS (spread across all ${n}) ━━━
- a smiling bread-loaf shopkeeper waving from a crusty-loaf storefront
- a little sushi-character strolling across a chopstick bridge
- a cupcake resident watering a sprinkle-flower window box
- a dumpling family sharing a bench in the steamer-square
- a strawberry-character pushing a tiny cart of berries
- a donut resident rolling home down the sprinkle road
- a boba-cup character sipping at a cafe table, pearls bobbing
- an egg-character sweeping a doorstep with a chive broom
- a mochi resident bouncing across the marshmallow-snow lane
- a pancake-character stacking syrup-jars at a market stall
- an avocado-character reading on a leafy plaza bench
- an ice-cream-cone resident greeting a neighbor with a wave
- a bao-bun character carrying a basket over a noodle-bridge
- a mushroom-character opening the shutters of a cottage

━━━ RULES ━━━
Each is ONE cute food-character resident, mid-action, with a smiling face. Kawaii, cozy, adorable. NEVER human. NO text. Keep each a distinct food-character + verb.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
