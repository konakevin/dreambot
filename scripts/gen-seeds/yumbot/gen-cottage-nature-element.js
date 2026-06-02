#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/cottage_nature_element.json',
  total: 200,
  batch: 18,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} FEATURED NATURE ELEMENT descriptions for a kawaii cottagecore-nature scene. Each entry is ONE specific natural feature visible in the scene as a wow-detail.

Each entry: 12-22 words. ONE specific nature element.

DO write:
- A cluster of giant mushroom-toadstools with cream-spotted red caps
- A wild blackberry-bush heavy with ripe glossy berries
- A patch of pastel-pink foxglove flowers reaching tall
- A trailing branch of climbing-rose with dewy pink blooms
- A nest of speckled robin's-eggs in a hollow tree-knot
- A cluster of bright-red wild strawberries on a leafy plant
- A patch of pastel-blue forget-me-nots in soft cluster
- A wild apple-tree branch laden with rosy fruit
- A clump of pastel-pink cosmos waving on slender stems
- A handful of dried-honesty seedpods in pearly silver
- A cluster of yellow buttercups in a sunny patch
- A wild-bramble vine with pink blossoms and green leaves
- A scattering of pinecones nestled in moss
- A patch of bright-violet wild irises in bloom
- A wild-honeysuckle vine with yellow-and-white blooms
- A cluster of pastel-cream snowdrops poking through grass
- A bundle of golden wheat-stalks tied with twine
- A spray of lacy-white Queen-Anne's-lace blooms
- A patch of wild lavender swaying in the breeze
- A wooden bird-feeder with pastel-finches perched on the rim

DO NOT write:
- Modern objects / human figures / characters
- Foreground foods (separate axis)
- Whole-landscape descriptions (separate axis — this is ONE specific element)
- Real kanji / English text

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
