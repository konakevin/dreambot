#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/tabletop_signature.json',
  total: 200,
  batch: 18,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} ICONIC KAWAII TABLETOP SIGNATURE PROPS for a kawaii checkered-tabletop scene. Each entry is ONE specific kawaii tabletop prop / accent that anchors the bex.ai-collectible aesthetic.

Each entry: 8-16 words. ONE specific prop.

DO write:
- A neatly-folded pastel-floral linen napkin tucked beside the hero
- A pastel-pink hand-painted ceramic spoon resting on the cloth
- A small dish of pastel-rainbow sugar-cubes
- A vintage china creamer in cream-and-gold
- A floral-pattern saucer beneath the vessel
- A small cluster of pearl beads scattered nearby
- A pastel-bow-tied gift box at the tabletop edge
- A sprig of dried baby's-breath in a tiny vase
- A satin-ribbon-tied bouquet of mini-roses
- A small wooden honey-dipper with golden honey drip
- A pastel-painted teaspoon with a heart-shaped handle
- A folded lace-edged napkin in pastel mint
- A pastel-pink macaron stack of three macarons in cream-strawberry-pistachio
- A small kawaii sticker-card propped against the vessel
- A pastel washi-tape roll with floral pattern
- A miniature kawaii flower bouquet in a thumbtack-sized vase
- A small wooden cake-fork resting beside the hero
- A pastel-color glitter-spray dusted across the tabletop edge
- A heart-shaped lace doily beneath the hero
- A miniature kawaii bunny figurine perched on the cloth

DO NOT write:
- Modern objects (phones, electronics)
- Real text labels
- Foreground hero vessel (separate axis)
- Whole-scene descriptions

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
