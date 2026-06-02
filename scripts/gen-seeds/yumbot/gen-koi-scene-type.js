#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/koi_scene_type.json',
  total: 200,
  batch: 15,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} kawaii Japanese koi-pond scene-types for 5 kawaii pond creatures composed cleanly in/around a tranquil Japanese garden pond. Each entry is a CLEAN CLUSTER with SLIGHT NATURAL POSE VARIATION per creature (one peeking out of water, one tilted, one nestled at the edge, one tallest at the back, one floating between lily pads).

The aesthetic is painterly Studio-Ghibli kawaii — half-submerged kawaii blob-creatures + koi-fish + axolotls + cloud-mochi-spirits with smiling faces, gathered in a Japanese pond with floating lotus-flowers and stepping-stones.

Each entry: 30-44 words. Each entry MUST specify:
1. A clean-cluster pond composition (gathered in shallow pond water / nestled on mossy stepping-stones / clustered between floating lily pads / huddled at the pond's edge / arranged on smooth river-rocks / etc.)
2. SLIGHT POSE VARIATION per creature (one peeking from water, one tilted, one nestled close, one tallest at the back, one floating)
3. NOT mention of the broader Japanese garden BACKDROP / pagoda / wisteria (separate axis)

Examples:
"Five kawaii pond-creatures clustered in the shallow water of a Japanese koi-pond — one smiling koi-fish leaning forward half-submerged, one lavender cloud-mochi-spirit tilted to the right, one axolotl peeking from behind a lily-pad, one tallest pearl-blob centered at the back, one tiny smiling-koi nestled close at the left."
"Five kawaii pond-creatures nestled across mossy stepping-stones — one koi-fish leaning over the edge into water, one cloud-mochi tilted near the right stone, one axolotl peeking up between stones, one tallest pearl-blob at the back stone, one tiny smiling-fish floating beside."
"Five kawaii pond-creatures gathered between floating lily-pads — one smiling koi-fish at center half-submerged, one pearl-mochi tilted near a lotus-bloom, one axolotl peeking from behind a pad, one tallest cloud-spirit at the back, one tiny fish nestled in the shallows."

DO NOT write:
- Identical-row-of-soldiers lineup
- Chaotic vertical stacking / acrobatics
- The broader Japanese garden BACKDROP / SETTING (separate axis)
- Modern urban / industrial scenes
- Foods (this path is pond-creatures, not foods)

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
