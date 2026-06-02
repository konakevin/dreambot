#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/cottage_scene_type.json',
  total: 200,
  batch: 15,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} kawaii cottagecore-nature scene-types for 5 kawaii food-characters composed together in a cottagecore/countryside-nature setting. Each entry is a CLEAN CLUSTER composition with SLIGHT NATURAL POSE VARIATION per food — natural family-portrait, NOT identical lineup, NOT chaotic.

Each entry: 30-44 words. Each entry MUST specify:
1. A clean-cluster cottagecore composition (gathered on a checkered picnic blanket / clustered at a wildflower-bouquet / nestled at the foot of a cottage door / arranged on a wooden garden bench / gathered around a wicker basket / huddled at a mossy-stump table / at a windowsill with flower-pots / etc.)
2. SLIGHT POSE VARIATION per food (one leaning forward, one tilted, one peeking out, one tallest at the back, one nestled close)
3. NOT mention of the broader cottage/nature BACKDROP / landscape (that's in a separate axis)

Examples:
"Five kawaii food-characters nestled together on a checkered red-and-white picnic blanket in a cottagecore-meadow — one jam-jar leaning forward against a wicker basket, one cream-scone tilted to the right, one strawberry peeking out from behind, one teapot tallest at the back, one biscuit nestled close at the left."
"Five kawaii food-characters gathered around a wildflower bouquet in a stoneware vase — one honey-jar leaning over to sniff a flower, one tart tilted slightly forward, one berry peeking from the right, one cream-puff tallest at the back, one bread-roll nestled at the left."
"Five kawaii food-characters huddled at a mossy-stump table set with tea — one teapot leaning forward pouring, one scone tilted to the side, one jam-jar peeking from behind, one cream-puff tallest at center, one strawberry nestled at the foot of the stump."
"Five kawaii food-characters arranged on a wooden garden bench under a wisteria-trellis — one cream-cake at the left tilted slightly, one teapot leaning forward at the center, one scone peeking from behind, one jam-jar tallest at the right, one biscuit nestled close at the foot."

DO NOT write:
- Identical-row-of-soldiers lineup
- Chaotic vertical stacking / acrobatics / climbing
- The broader cottage/nature BACKDROP / LANDSCAPE (separate axis)
- Pathway / lane / brook RECEDING into vanishing point — clustered composition
- Modern urban / industrial / mall — cottagecore countryside ONLY

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
