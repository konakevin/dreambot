#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/coquette_palette_variant.json',
  total: 100,
  batch: 18,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} COQUETTE PALETTE VARIANTS for a kawaii coquette food-party scene. Each entry names a SPECIFIC dominant palette combination from within the locked coquette range.

Palette LOCKED: pinks + lavenders + whites + soft purples ONLY. NO other colors permitted.

Each entry: 8-14 words. ONE specific palette combination.

DO write:
- Pink-and-white palette: blush-pink dominant, cream-white accent
- Pink-and-lavender palette: rose-pink dominant, lavender accent
- Pink-and-pearl palette: dusty-rose dominant, pearl-white accent
- Lavender-and-pink palette: lilac dominant, blush-pink accent
- Pink-cream palette: bubblegum-pink dominant, cream accent
- Lavender-pearl palette: soft-lavender dominant, pearl accent
- Pink-rose-mauve palette: rose-pink with mauve accents
- Pink-pastel-rainbow palette: blush-pink with lavender-white-pearl mix
- Pink-cherry palette: bubblegum-pink with cherry-pink accents
- Coral-pink-and-cream palette: coral-pink dominant, cream accent
- Pink-and-periwinkle palette: blush-pink with periwinkle accents
- Dusty-rose-and-lavender palette: dusty-rose with lavender accents
- Pink-pearl-coral palette: pearl-pink with coral accents
- Cotton-candy palette: bubblegum-pink with lavender accents
- Princess-pink palette: hot-pink with white-and-pearl accents
- Strawberry-cream palette: strawberry-pink with cream accents
- Pink-marshmallow palette: marshmallow-pink with pearl-white accents
- Pink-tea-rose palette: tea-rose with cream-and-pearl accents
- Lavender-blush palette: lavender dominant with blush-pink accents
- Pink-rose-petal palette: rose-petal-pink with pearl accents
- Pink-lily palette: lily-pink with lavender accents
- Pink-velvet palette: velvet-pink with pearl-and-white accents
- Cream-and-pink palette: cream-white with blush-pink accents
- Pink-tulle palette: tulle-pink with lavender ribbon-accents
- Pink-and-pearl-cluster palette: blush-pink with pearl-cluster accents

DO NOT write:
- Any colors outside pink / lavender / white / soft purple
- Modern color codes (hex / RGB)
- Long descriptions / scene context

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
