#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/tabletop_mini_creature_pile.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing \${n} MINI-CREATURE PILE descriptions for YumBot checkered-tabletop. A cluster of smiling-food-friend mini-creatures sitting ON TOP / IN / ON THE RIM of the hero vessel — like a small kawaii audience. Each entry describes the pile for ONE render.

Each entry: 18-28 words.

━━━ REFERENCE — bex.ai ━━━

Bex.ai often piles a cluster of smiling mini-creatures on top of the hero — smiling pastel mochi-balls, smiling-strawberry-with-leaf-hat, smiling-fruit-pieces, mini-marshmallows-with-faces, smiling-cookies. They sit IN the cup foam, on the rim, or stacked on top.

━━━ FORMAT ━━━

Examples:
✓ "Pile of 5 smiling mochi-balls in pastel pink, yellow, blue, green, lavender — sitting in the cream foam on top"
✓ "Smiling pastel strawberry-creature with leaf-cap sitting on the rim, with smiling-cookie-star floating beside"
✓ "Cluster of 4 smiling-cream-puffs piled on top of the foam, each with closed-arc eyes and blush cheeks"
✓ "Smiling pastel ice-cream-scoop-creature on top with a smiling-cherry-companion on the rim"

━━━ DISTRIBUTION ━━━

- 25% MULTI-MOCHI-PILE (pile of 4-5 smiling mochi-balls in pastel colors stacked on top / smiling mochi-cluster in pastel pink + yellow + blue + green)
- 20% SINGLE-CHARACTER-ON-TOP (single smiling pastel-strawberry-creature with leaf-cap sitting on top / smiling pastel-frog-mochi on the rim / single smiling-cookie-creature poking out)
- 15% PAIR-ON-TOP (pair of smiling-creatures stacked / two smiling-mini-foods sitting together on the rim)
- 15% CREAM-FOAM-CLUSTER (smiling-pastel-cream-blobs piled in the foam / cluster of smiling-marshmallow-faces in the foam / smiling-whipped-cream-creature on top)
- 10% MIXED-CLUSTER (mix of smiling-mochi + smiling-fruit + smiling-cream piled / cluster of various smiling-mini-foods)
- 10% FRUIT-CLUSTER-ON-TOP (smiling-strawberry + smiling-cherry + smiling-grape cluster on rim / smiling-fruit-cluster nestled in foam)
- 5% UNUSUAL (smiling-ice-cream-creature on top / smiling-mini-donut-cluster on top)

━━━ HARD MANDATES ━━━

- Multiple smiling-faces visible on the pile
- Each mini-creature has its own kawaii face (dimpled blush + closed-arc eyes + small mouth)
- Pastel palette
- Glossy pearlescent finish

━━━ HARD BANS ━━━

- NO chibi real creatures / humans / animals
- NO tablecloth / surrounding scatter (other pools)
- NO single bland-no-face items

━━━ OUTPUT ━━━

JSON array of \\${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
