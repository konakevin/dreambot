#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/kawaii_accessory.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} KAWAII ACCESSORY entries — cute objects she's holding / wearing. Sanrio / lolita / character-cafe register.

Each entry: 10-18 words. Accessory + cute-detail + soft-color cue.

VARIETY:
- 18% PLUSHIE (giant teddy-plushie / cat-plushie / sanrio-plushie / mascot-pet plushie / bear-plushie)
- 14% DESSERT (parfait / strawberry-shortcake / boba-tea / pancake-stack / macaron-tower / heart-cookie)
- 12% CHARM/PIN (heart-charm necklace / star-shaped pin / cute-mascot brooch / hair-clip with bow)
- 10% BAG (pink puff bag / Sanrio backpack / lunchbox / heart-shaped purse)
- 8% CUTE-PROP (bubble-wand / sparkler / mini-fan / pinwheel / magic-wand cute-toy)
- 8% MASCOT-CHARM (cat-ear headband / bunny-ears / mascot-paws gloves / wing-clips)
- 6% TECHNOLOGY (decorated-phone with charms / heart-camera / pink-laptop / themed earbuds)
- 6% UMBRELLA/PARASOL (frilly pink parasol / Sanrio umbrella / clear-vinyl with print)
- 6% LIBRARY (cute notebook / Sanrio diary / character-pencil-case / heart-bookmark)
- 6% MUSIC (heart-headphones / mini-mic / cute-ukulele / star-tambourine)
- 6% FLORAL (single rose held delicately / bouquet of pastel daisies / flower-crown / heart-shaped petal-arrangement)

DO write:
- Giant teddy-plushie hugged tight with both arms, plushie sparkling cyan
- Strawberry-shortcake slice with whipped-cream peak on small plate, fork raised
- Heart-charm pendant on rose-gold chain, opening to reveal mini-photo
- Pink puff bag with multiple charm-strings hanging, chibi-stars on charms
- Bubble-wand mid-blow with multiple soap-bubbles drifting up, pink-pearlescent

DO NOT: weapons / combat tools / photoreal catalog descriptions / multiple per entry.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
