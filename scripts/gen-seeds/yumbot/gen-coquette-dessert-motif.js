#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/coquette_dessert_motif.json',
  total: 100,
  batch: 15,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} COQUETTE CENTERPIECE DESSERT descriptions for a kawaii coquette food-party scene. Each entry is ONE specific dreamy centerpiece dessert visible in the scene as a wow-detail.

Palette LOCKED: pinks + lavenders + whites + soft purples ONLY.

Each entry: 14-26 words. ONE specific dessert / treat centerpiece. Magical / ornate / over-the-top.

DO write:
- A giant heart-shaped strawberry cake with white-cream rosettes and pink-pearl beading along the edges
- A pink-macaron tower five tiers tall with crystallized rose-petal toppings
- A pink-pearl trifle in a tall crystal glass with layered cream and rose-jelly
- A pink-rose buttercream wedding-cake with cascading lavender-sugar-flowers
- A pink-pearl-strawberry-tartlet display with delicate lattice and pearl-sugar dust
- A pink ribbon-bowed cupcake-tier-stand with three layers of bow-decorated cupcakes
- A pink-cherry-blossom-petite-fours arrangement on a lavender-velvet stand
- A pink-pearl heart-shaped chocolate-box opened to reveal pearl-truffles
- A pink-tulle-frosted cake decorated with edible-pearl rosettes and lavender-sugar-flowers
- A vintage pink-pearl-glazed swiss-roll with cascading cream-rosettes
- A pink-macaron-castle centerpiece with lavender-frosting turrets
- A pink-petal-fondant cake with three-dimensional sugar-roses cascading down
- A pink-cream croquembouche tower with lavender-sugar-pearls at the seams
- A pink-pearl-jellybean candy-bowl piled high with iridescent jellies
- A pink-floral-fondant cake with pearl-trim borders and ribbon-bow topper
- A pink-pearl-bonbon display tier with cascading pearl-charm-ribbons
- A pink-cake-pop bouquet in a pearl-vase with lavender ribbon ties
- A pink-cream millefeuille with lavender-rose petals and pearl-sugar dust
- A pink-pearl-frosted layer-cake with edible-pearl-cluster topping
- A pink-cherry-tartlet display arrangement with pearl-sugar-glaze topping

DO NOT write:
- Any colors outside pink / lavender / white / soft purple
- Foreground food-character cluster (separate axis)
- The kitchen / backdrop / setting (separate axis)

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
