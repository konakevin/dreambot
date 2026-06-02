#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/chef_scene_type.json',
  total: 200,
  batch: 15,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} kawaii kitchen scene-types for 5 kawaii FOOD CHARACTERS composed together in a kitchen setting, cooking/preparing a kawaii dish. The food-characters ARE the cooks — no human / chibi-human chef figures, no human-coded accessories (no chef hats, no aprons, no neckerchiefs). The foods themselves are dusted with flour, holding tiny baking tools, leaning over a mixing bowl, etc.

Each entry: 30-44 words. Each entry MUST specify:
1. A clean-cluster kitchen composition (gathered at a kitchen counter / around a mixing bowl / at a stove / at a pastry station / clustered around a cake-decorating board / at a sushi-roll mat / etc.)
2. SLIGHT POSE VARIATION per food (one leaning forward, one tilted, one peeking over the bowl, one standing tallest at the back, one nestled close to the side)
3. ONE specific dish/treat being prepared visible in the scene
4. Each food described as ITSELF (no human chef-attire) — e.g. "the kawaii taiyaki dusted with flour" / "the smiling cupcake holding a tiny whisk" / "the dango with frosting-bag arms"

Examples:
"Five kawaii food-characters clustered around a wooden kitchen counter decorating a giant pastel layer-cake — one taiyaki dusted with flour leaning forward piping frosting, one mochi tilted to the right adding sprinkles, one cupcake peeking over the edge, one donut standing tallest at the back holding a piping-bag, one bonbon nestled at the left with a cookie cutter."
"Five kawaii food-characters gathered at a sushi-rolling station preparing sushi-rolls — one onigiri seated at the rolling mat hands-on, one cucumber-roll leaning forward with a knife, one nigiri peeking over with a tuna slice, one taiyaki tallest at the back rolling, one mochi nestled close with a wasabi-dollop."
"Five kawaii food-characters huddled around a giant mixing bowl preparing dough — one cupcake stirring at the rim, one dango peeking down inside, one mochi tilted with a measuring cup, one taiyaki tallest holding a sack of flour, one bonbon nestled close cradling a kawaii whisk."

DO NOT write:
- Human / chibi-human chef figures / chef-children / cooks (BANNED — foods ARE the chefs)
- "Chef hat" / "toque" / "apron" / "neckerchief" / "chef outfit" / "chef-attire" (BANNED — human-coded apparel that primes Flux toward humans)
- Identical-row-of-soldiers lineup
- Chaotic vertical stacking / acrobatics
- Vendor-customer / serving scenes — these are foods COOKING together
- The broader kitchen BACKDROP / SETTING (separate axis)

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
