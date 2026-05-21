#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/tabletop_decor_clusters.json',
  total: 30,
  batch: 25,
  metaPrompt: (n) => `You are writing \${n} DECOR CLUSTER descriptions for YumBot checkered-tabletop. Slightly larger decor clusters on the tablecloth — mini-macaron-stacks, mini-marshmallow-piles, chocolate-piece-piles, scattered-pieces. Template picks 2 per render.

Each entry: 8-15 words.

━━━ DISTRIBUTION ━━━

- 25% MINI-MACARON-STACK (stack of 3 pastel-macarons / cluster of mini-macarons in pastel pink-blue-mint)
- 20% MINI-MARSHMALLOW-PILE (pile of pastel-marshmallows / cluster of smiling and non-smiling marshmallows)
- 15% CHOCOLATE-PIECES (cluster of chocolate-truffles / chocolate-piece-pile / chocolate-pieces with sprinkles)
- 15% MINI-COOKIE-CLUSTER (small cluster of mini-cookies / scattered cookie-pieces)
- 10% TIRAMISU / CAKE-PIECES (mini-tiramisu-pieces scattered / cake-slice-pieces / small cake-cubes)
- 10% SUGAR-CUBES (cluster of sugar-cubes / pastel sugar-cube-pile / sugar-shaped-hearts)
- 5% CINNAMON / SPICE (cinnamon-sticks scattered / cinnamon-stick-bundle / star-anise-cluster)
- 5% CARAMEL / TOFFEE (cluster of caramel-cubes / toffee-piece-pile)

━━━ HARD MANDATES ━━━

- Cluster / pile (not solo)
- Pastel palette
- Pop-Mart pearlescent glossy finish

━━━ HARD BANS ━━━

- NO vessels (covered by hero pool)
- NO chibi creatures

━━━ OUTPUT ━━━

JSON array of \\${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
