#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/coquettebot/seeds/couture_wearers.json',
  total: 200,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} COUTURE WEARER descriptions for CoquetteBot's adorable-couture path — varied fantasy/storybook character types that can wear coquette couture. NO human adult women wearing these (that's the coquette-fashion path). NO male figures.

Each entry: 10-20 words. One specific wearer-character with distinguishing detail.

━━━ CATEGORIES ━━━
- Fairies (rose-winged fairy with pearl skin, fairy with butterfly-wing ears, moss-fairy)
- Princesses storybook-style (tiara-wearing storybook princess, fairy-tale princess with golden hair)
- Cute mice in couture (ballet-mouse, pearl-ribbon mouse, tutu-wearing mouse)
- Cute bunnies in couture (ballet-bunny, rose-petal-gown bunny, pearl-collar bunny)
- Hedgehogs in lace (lace-shawl hedgehog, petal-skirt hedgehog)
- Baby unicorns with garments (ribbon-manned unicorn, tulle-draped unicorn)
- Squirrels in tiny couture (chipmunk in pearl collar, squirrel in lace)
- Deer-fawns in flower crowns (delicate fawn with rose-garland)
- Swan-fairies (girl-swan hybrid with tutu)
- Fantasy creatures small (moss-sprite in rose-petal dress, cloud-kitten in pearl)
- Mermaids (small mermaid with pearl-bodice and rose-tail)
- Fairy godmothers storybook (older fairy in lace)
- Rose-petal fairies
- Cherub storybook characters (pastel chubby-cheeks)
- Butterfly-winged children (fantasy small fantasy character)
- Fantasy creatures like baby dragons in couture
- Woodland-princess fawns (flower-crown fawn)
- Forest-sprite girls (fantasy small)
- Porcelain doll fairies

━━━ RULES ━━━
- NO human adults (fashion path covers them)
- NO male figures
- Fantasy / storybook / cute-animal wearers
- Include distinguishing detail per character

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
