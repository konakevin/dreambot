#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/glowbot/seeds/intimate_glow_subjects.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} INTIMATE GLOW SUBJECT descriptions for GlowBot's new quiet-glow path — SMALL-SCALE scenes where a single glowing element illuminates a quiet nearby space. The focus is on ONE light-source + its immediate surroundings. Intimate scale, not grand. Peaceful + awe-inspiring via subtle luminous magic, not mythic scale.

Each entry: 15-30 words. One specific small-scale intimate-glow scene.

━━━ CATEGORIES ━━━
- Single glowing mushroom in a mossy-corner of forest
- Firefly-cluster illuminating patch of nearby ferns
- Lone glowing-tree sapling in forest clearing
- Torch-on-stone-wall lighting a moss-covered niche
- Paper-lantern hanging over still pond
- Bioluminescent mushroom-patch glowing on fallen log
- Candle-in-cottage-window lighting immediate sill
- Small campfire in forest clearing lighting nearby trees
- Glowing-orb floating inside tree hollow
- Oil-lamp on stone bench in dark garden
- Glow-worm cave with cluster lighting small chamber
- Tiny-glowing-flower in shadowed glade
- Single-firefly on fern-frond spotlighting petals nearby
- Bioluminescent-moss clinging to ancient tree-root
- Fox-fire glow on decaying log in moonless forest
- Tiny glowing waterfall-pool in shaded cave
- Luminous fruit hanging from branch lighting leaves
- Glowing-dewdrop on spider-web catching last-light
- Single-candle on grave-stone at dusk
- Star-shaped glowing-flower in petal-garden-corner
- Tiny-glowing-beetle on mossy rock
- Fireflies gathered around old stone-statue
- Single-lantern on wooden pier reaching out over water
- Glowing-spring-pool tucked in rocky alcove
- Jade-glow-crystal in small cavern-nook
- Warm-window of tiny cottage in deep woods
- Glowing-butterfly resting on dark rock
- Small glowing-vine climbing weathered stone-wall
- Fox-fire ring around mossy tree-stump
- Bioluminescent-plankton pool in tide-rock crack
- Single firefly-pillar rising through mist-fern
- Old-lantern on overgrown path at dusk
- Glowing-dragonfly perched on reed
- Tiny-glowing-sprite silhouette in leaf-shadow
- Luminous-feather fallen in dark leaf-litter
- Glowing-seed-pod cradled by roots
- Candle-jar nestled among river-stones
- Moon-flower opening at night in shadow-garden
- Single-blue-flame dancing in small hearth
- Tiny-water-lily glowing in still forest-pond
- Luminous-lichen on single rock in shaded ravine
- Tiny-glowing-spider-web in cave-alcove
- Ember-cluster on hearth-stone with warm surrounding
- Bioluminescent-ring around old tree-base
- Tiny-jellyfish glow in shallow tidepool
- Single-snowdrop glowing through moonlit-frost
- Glowing-crystal-cluster tucked between mossy stones
- Warm-lantern-hung on forest-bridge railing
- Tiny-glowing-fruit-cluster on understory branch
- Fallen-luminous-petal resting on stream-pebble

━━━ RULES ━━━
- SMALL SCALE — single focal glow element
- Peaceful + intimate feel
- Glow illuminates the IMMEDIATE surroundings (2-5 feet)
- NEVER grand-scale, NEVER epic-wide
- Still awe-inspiring via subtle magic

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
