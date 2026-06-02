#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/floral_garden_scene_type.json',
  total: 200,
  batch: 15,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} GARDEN SCENE compositions for a kawaii floral-garden bot. Each entry is a CONCRETE setting (indoor or outdoor) with MULTIPLE kawaii-faced planters / vessels arranged together, OVERFLOWING with flowers, and kawaii treats scattered around. The scene is RICH and FULL — never minimal, never a single hero on a plain background.

Each entry: 30-44 words. Each entry MUST include:
1. A concrete setting (indoor: potting shed, conservatory, cottage windowsill, kitchen counter, vanity, fireplace mantle, bookshelf, bathroom shelf, tea-time table, sunroom corner — OR outdoor: cottage garden patio, greenhouse, balcony, picnic-in-garden, garden bench, gazebo, pond-side, garden swing, flower-fence, tea-garden table)
2. THREE OR MORE kawaii-faced planters / vessels / cute containers visible in the scene (terracotta pots with smiling faces, mason jars, teapots-as-planters, tin watering cans, vintage teacups, ceramic mugs, garden basket, etc.) — clustered together
3. OVERFLOWING flowers spilling from the planters (peonies, roses, cherry-blossom sprigs, ranunculus, hydrangeas, dahlias, magical iridescent blooms)
4. KAWAII TREATS scattered through the scene (macarons, cupcakes, sugar cookies, donuts, candies, lollipops, taiyaki, mochi balls — many have tiny kawaii faces too)
5. Magical accent (butterflies / pearl-orbs / sparkle motes / fairy lights / glowing pollen / floating petals)

Mix indoor (~50%) and outdoor (~50%) scenes. Make each scene FULL and RICH — packed with planters, flowers, treats, decorative elements. NEVER minimal.

Examples:
"A cluttered kawaii potting shed workbench with five smiling terracotta pots overflowing with peonies and ranunculus arranged in a cluster, kawaii macarons and sugar-cookies scattered between them, tiny butterflies fluttering above, watering can and trowel beside, warm window-light streaming in."
"A cottage garden patio table laden with kawaii teapots and mason jars overflowing with cherry-blossom-sprigs and pastel hydrangeas, kawaii macarons and donut-treats spread on a doily, more flower-planters lining the garden behind, fairy-lights strung overhead, pearl-orbs drifting through air."
"A vintage tea-time table set with three smiling kawaii teacups overflowing with magical iridescent ranunculus and peonies, tiered cake-stand with kawaii macarons and sugar-cookies, ceramic-pot of cherry-blossom-sprigs nearby, butterflies hovering, golden afternoon light."
"A bright sunroom windowsill lined with five kawaii mason-jar planters overflowing with cosmos and lavender, kawaii cupcake treats on a small plate beside, pearl-orbs floating, cherry-blossom-sprigs in a tall ceramic vase, dappled light through leaded windows."

DO NOT write entries with:
- single hero vessel (must be 3+ planters)
- empty/minimal backgrounds
- pathways or roads receding into distance
- streams or rivers running through

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
