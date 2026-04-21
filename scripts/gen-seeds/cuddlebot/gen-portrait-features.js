#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/cuddlebot/seeds/portrait_features.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} PORTRAIT FEATURE descriptions for CuddleBot's creature-portrait path — close-up cute details to highlight on a creature. These stack onto a creature portrait.

Each entry: 10-20 words. One specific cute feature/detail.

━━━ CATEGORIES ━━━
- Eyes (huge dewy sparkle-eyes, anime-style eyes with shine, reflecting stars, half-closed sleepy)
- Fluff (impossible halo-fluff backlit, marshmallow softness, dandelion-puff texture)
- Whiskers (tiny whiskers with dew drops, sparkly whiskers)
- Cheeks (rosy-blush cheeks, round chubby cheeks, fluffy-tuft cheeks)
- Nose (tiny pink nose with sparkle, button nose, heart-shaped nose)
- Ears (flopped ears, perky tufted ears, ears with tiny bows)
- Mouth (tiny smile, open yawn, holding flower in teeth)
- Paws (pink paw-pads, tiny paws clasped, paw holding tiny object)
- Tail (fluffy curled tail, heart-tipped tail, tail wrapping around self)
- Accessories (tiny scarf, flower crown, mushroom hat, ribbon bow, tiny glasses)
- Sparkle elements (sparkles in fur, stars around head, glitter in eyes)
- Magical features (tiny wings folded, glowing horn, pastel aura)
- Tears of joy (dewy happy tears)
- Pink tongue (tiny blep, tiny lick)
- Dappled markings (heart-shaped spot, star-shaped patch)
- Flowers in fur (daisies tucked in fluff)
- Mid-yawn stretching (claws just barely out, adorable reach)

━━━ RULES ━━━
- Feature / detail only — creature species placed later
- All wholesome + storybook + cute
- Stack-able — these can combine on one creature
- No edgy / sharp / dark features

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
