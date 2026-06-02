#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/cottage_terrain.json',
  total: 200,
  batch: 18,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} GROUND-SURFACE textures for a kawaii cottagecore-nature scene — what's underfoot.

Each entry: 10-18 words. ONE specific surface.

DO write:
- Soft moss-carpet woven with tiny daisies
- Wildflower meadow grass dotted with cosmos and clover
- Worn wooden cottage-porch planks weathered by years of sun
- Checkered red-and-white picnic blanket spread on grass
- Soft tall summer grass with golden seedheads
- Mossy forest floor with fallen leaves and tiny ferns
- A bed of dried autumn leaves in russet and gold
- Wooden cottage-kitchen floorboards in warm pine
- Sun-dappled clover lawn with white blossoms
- Stone garden patio with mossy seams between flagstones
- Soft wildflower bed in mixed pastel pinks and creams
- Mossy stump-top surface dotted with toadstool-clusters
- Embroidered linen cloth in pale-blue floral pattern
- Cool flagstone garden-floor with creeping thyme between stones
- Hay-strewn barn-floor in golden-amber straw
- Mossy stepping-stone surface in a fairy-garden
- Sun-warmed wooden garden-bench seat
- A bed of pressed-flower petals in pastel-rainbow drift
- Dried-grass meadow-floor in summer-gold
- Wildflower-strewn picnic-cloth spread across green grass

DO NOT write:
- Modern surfaces (asphalt, concrete, industrial flooring)
- Pathway / lane RECEDING into distance — surface only
- Foreground characters / atmosphere / sky

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
