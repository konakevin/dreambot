#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/coquette_scene_type.json',
  total: 100,
  batch: 15,
  append: true,
  metaPrompt: (n) => `Write ${n} ultra-coquette kawaii FOOD PARTY scene-types for 5 kawaii food-characters composed cleanly in an over-the-top OMG-cute coquette setting. Each entry is a CLEAN CLUSTER with SLIGHT NATURAL POSE VARIATION per food.

The aesthetic is HYPER-FEMININE coquette + kawaii — ribbons, bows, lace, pearls, hearts, strawberries, cherries, ultra-pink palette. Think Marie-Antoinette tea party meets ballerina dressing-room meets pastel kawaii bakery.

Each entry: 30-44 words. Each entry MUST specify:
1. A clean-cluster coquette-party composition (gathered around a heart-shaped centerpiece cake / arranged on a pink satin-tablecloth / clustered on a pink tiered cake-stand / nestled in a pink-pearl-encrusted vanity tray / huddled on a lace-doily-covered tea-table / arranged across a pink-velvet-cushion / etc.)
2. SLIGHT POSE VARIATION per food (one leaning forward, one tilted, one peeking out, one tallest at the back, one nestled close)
3. NOT mention of the broader backdrop / setting (separate axis)

Examples:
"Five kawaii coquette food-characters arranged on a pink satin-tablecloth around a heart-shaped strawberry cake — one cupcake leaning forward draped with a pink ribbon-bow, one macaron tilted to the right, one strawberry peeking from behind, one cream-tart tallest at the back, one bonbon nestled close at the left."
"Five kawaii coquette food-characters clustered on a pink-tiered cake-stand — one heart-cookie at the top step, one cherry-tart leaning forward on the middle step, one pearl-pink-macaron tilted on the lower step, one ribbon-bowed cupcake tallest at the back, one tiny bonbon nestled at the base."
"Five kawaii coquette food-characters huddled inside a pink-velvet jewelry-box-tray — one strawberry leaning against the satin lining, one heart-macaron tilted toward the front, one pearl-bonbon peeking out, one pink-cake-slice tallest at the back, one cherry-tart nestled at the side."
"Five kawaii coquette food-characters arranged on a pink lace-doily-covered tea-table — one teacup-shaped treat leaning forward, one ribbon-tied cupcake tilted, one pearl-strawberry peeking out, one heart-cake-pop tallest at the back, one bow-bonbon nestled close."

DO NOT write:
- Identical-row-of-soldiers lineup
- Chaotic vertical stacking / acrobatics
- The broader coquette BACKDROP / SETTING (separate axis)
- Pathway / lane / brook receding into vanishing point
- Modern urban / industrial / mall — coquette ONLY
- Boys / masculine / dark / grungy — ultra-feminine ONLY

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
