#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/cherry_blossom_romance_accessory.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} ROMANCE-ACCESSORY entries — tender objects character is holding. Cherry-blossom mood.

Each 10-18 words. Object + tender-detail.

VARIETY:
- 16% LOVE-LETTER (sealed letter / unfolded note / pen-letter mid-write / postcard / envelope-with-stamp)
- 14% FLOWER (single rose / cherry-blossom branch / bouquet of pastel flowers / lily-bouquet)
- 12% PHOTOGRAPH (Polaroid in hand / film-strip / yearbook-photo / framed picture)
- 10% GIFT (wrapped box with bow / candy-box / bento with care / handmade item)
- 10% INSTRUMENT (acoustic guitar held tender / violin mid-hold / piano-keys / harmonica)
- 8% UMBRELLA-SHARED (clear-vinyl umbrella / pink umbrella / paper-parasol)
- 8% BOOK (poetry book mid-read / journal mid-write / sketchbook / shared textbook)
- 6% TEACUP (steaming teacup at café / matcha-mug / shared coffee-cup)
- 6% PHONE (phone with text on screen / camera-phone mid-photo / videocall device)
- 6% MISC-ROMANTIC (love-locket / hair-pin gift / ribbon-bracelet / friendship-bracelet)
- 4% CONFETTI/PETALS-IN-HAND (single petal held / handful of cherry-blossoms / lock-of-hair gifted)

DO write:
- Folded love-letter held tight against chest, edge pink-wax-sealed
- Single white rose held delicately at heart-level, dew on petal
- Polaroid photograph in hand, image of someone smiling at viewer-position
- Wrapped gift-box with pastel-pink ribbon, name-tag tied with care
- Acoustic guitar held against chest, fingers on neck mid-chord
- Pen mid-write at love-letter, calligraphy-style script visible

DO NOT: weapons / dramatic / photoreal-catalog / multiple per entry.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
