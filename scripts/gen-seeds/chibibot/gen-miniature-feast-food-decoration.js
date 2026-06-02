#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/miniature_feast_food_decoration.json',
  total: 200,
  batch: 25,
  metaPrompt: (
    n
  ) => `You are writing ${n} KAWAII FOOD-DECORATION elements for ChibiBot miniature-feast scenes — tiny details scattered throughout the scene to amplify cute-maxxing. Pop-Mart designer-vinyl pastel kawaii register.

Each entry: 10-20 words. ONE specific decoration. NO chibi creatures, NO food hero, NO scene setting.

━━━ EVERY ENTRY ━━━

A small scattered visible decoration — sprinkles, mini-macarons, star-confetti, petal-blossoms, mini-faces-fruits, cream-swirls, etc. Tiny, plural-or-cluster, glossy pop-mart finish.

━━━ FORMAT ━━━

Examples:
✓ "Scattered rainbow sprinkles in every color cascading across the surface like glitter"
✓ "Mini macarons in pastel pink, mint, lavender stacked in tiny clusters around the centerpiece"
✓ "Cherry-blossom petals drifting through the air and pooling on surfaces"
✓ "Tiny smiling-face strawberries with blush cheeks scattered like cute confetti"
✓ "Heart-shaped sugar-cube clusters in pastel colors clustered around the feet"
✓ "Star-confetti dusting with each star having a tiny smiling face"
✓ "Pastel pearl-bead chains draped across the scene like cute necklaces"
✓ "Glossy candy hearts in pastel pink and lavender scattered like jewels"

━━━ CATEGORY DISTRIBUTION ━━━

- 20% SPRINKLES / CONFETTI (rainbow sprinkles / star-confetti / heart-confetti / pastel jimmies)
- 15% MINI-FOOD-DECOR (mini-macarons / mini-cookies / mini-donuts / mini-cupcakes — all with tiny smiling faces)
- 15% MINI-SMILING-FRUITS (tiny smiling strawberries / smiling cherries / smiling blueberries / smiling oranges)
- 10% PETALS / FLORAL (cherry-blossom petals drifting / rose-petals scattered / pressed-violets clustered)
- 10% PEARL / BEAD (pastel pearl-beads / sugar-pearls / candy-bead-chains / glossy bubble-pearls)
- 10% HEART / STAR / CUTESY ICONS (candy-hearts / star-cookies / heart-sugar-cubes / pastel-bow-stickers)
- 5% STEAM / WISPS (steam-curls with tiny smiling face hints / cocoa-steam wisps / fragrant-puffs)
- 5% PASTEL-RIBBONS / BUNTING (pastel ribbon-loops / mini-bunting / lace-trim accents)
- 5% RAINBOW ACCENTS (rainbow-sparkle dust / rainbow-sprinkles / rainbow gradient ribbons)
- 5% SUGAR / ICING DRIPS (icing drips / glaze pools / dusting-sugar-clouds / pearlescent glaze swirls)

━━━ HARD MANDATES ━━━

- Always PLURAL or CLUSTER (scattered / stacked / clustered / drifting) — never a single solo decoration
- PASTEL palette
- GLOSSY pop-mart finish

━━━ HARD BANS ━━━

- NO chibis / creatures
- NO food hero (just decor, not the main centerpiece)
- NO dark / moody / saturated colors
- NO photorealistic register

━━━ OUTPUT ━━━

JSON array of \${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
