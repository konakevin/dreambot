#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/cottage_signature.json',
  total: 200,
  batch: 18,
  append: true,
  metaPrompt: (n) => `Write ${n} ICONIC COTTAGECORE SIGNATURE elements for a kawaii cottagecore-nature scene. Each entry is ONE specific cottagecore prop or accent that anchors the scene as cottagecore.

Each entry: 10-18 words. ONE specific element.

DO write:
- A woven wicker picnic basket with red-and-white checkered cloth peeking out
- A glass mason jar filled with wildflowers
- A lace doily under a porcelain teacup
- A vintage china teapot with pastel-blue floral pattern
- A wooden spoon resting in a clay-pot of jam
- A bundle of dried lavender tied with twine
- A handful of fresh-picked strawberries in a wooden bowl
- A small wreath of dried baby's-breath hanging on a peg
- A stack of well-worn poetry books beside a tea-cup
- A pressed-flower book lying open
- A vintage watering can in pastel-green enamel
- A bundle of just-picked carrots with green leafy tops
- A linen tea-towel embroidered with cherries
- A small wooden trowel beside a clay-pot of seedlings
- A glass jar of honey with a wooden dipper
- A row of beeswax candles in brass holders
- A bouquet of daisies in a milk-pitcher
- A wooden butter-churn beside a clay-jar
- A floral-pattern teacup-and-saucer with sugar-cubes
- A small wicker basket of mushrooms freshly foraged

DO NOT write:
- Modern objects (phones, electronics, plastic)
- Real kanji / English text labels
- Foreground characters (foods)
- Whole-landscape descriptions (separate axis)

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
