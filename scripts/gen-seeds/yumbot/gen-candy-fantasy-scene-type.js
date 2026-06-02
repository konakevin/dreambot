#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/candy_fantasy_scene_type.json',
  total: 200,
  batch: 15,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} COMPOSITION-LOCKED SCENES for a candy-fantasy world. Each entry is a CONCRETE situation that bakes CHARACTER PLACEMENT directly into the prompt — so Flux composes the scene around where the characters are positioned, not around a generic candy-meadow backdrop.

Each entry: 28-42 words. Each entry MUST specify:
1. A concrete location/situation (table, campfire, bridge, ledge, cliff, treehouse, fountain edge, balcony, market counter, window sill, snow-mound, giant macaron disc, frosted-cake mountain top, swing-set, candy fairground ride, sugar-spun pavilion, fondant throne, glass jar interior, hot-air-candy-balloon basket, bakery counter, etc.)
2. EXPLICIT CHARACTER PLACEMENT — where the food-characters are sitting / standing / perched / gathered (seated cross-legged in a circle, perched on the railing, gathered at the counter, leaning over the ledge, etc.)
3. What the characters are doing (toasting skewers, sharing treats, sipping drinks, peeking over, etc.)

Example shape:
"Five kawaii food-friends seated cross-legged in a tight circle around a small marshmallow campfire on a candy-cliff ledge, faces lit by warm flame glow, each holding a candy-skewer over the embers."
"Five kawaii food-friends perched along a candy-cane bridge railing high above a lollipop-tree forest, leaning side-by-side over the railing to watch the pastel canopy below."
"Five kawaii food-friends gathered around a low pastel-fondant tea table set with miniature cups and a three-tier macaron stand, each leaning in to reach for treats from a shared platter."
"Five kawaii food-friends standing in a row along a frosted-cake cliff overlook, holding hands and gazing down at the candy-cane valley spread below them."
"Five kawaii food-friends nestled together in a cookie treehouse perched in a giant lollipop-tree canopy, peeking out through wafer-shutter windows at the candy world."

The scene-type is the COMPOSITION. The location/placement is the WHOLE point. Pick concrete props (table / campfire / bridge / ledge / balcony / treehouse / fountain / counter / throne / swing-set / hot-air-balloon-basket / cake-tier / pavilion / window-sill / macaron-disc / glass-jar / etc.) and integrate the character positions.

Mix scene types BROADLY — pick ~30 distinct concrete locations across the pool. Avoid clustering all entries around the same 4-5 scene types.

DO NOT write:
- Generic "scene in a candy meadow" entries
- Wide vista / landscape vistas
- Pathway / road / lane / racetrack receding into distance
- Stream/river crossings (a bridge OVER a stream is fine if characters are perched on the bridge — but no center-receding stream)
- Vague "gathering" without explicit placement

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
