#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/goth_female_makeup.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} GOTHIC FEMALE MAKEUP descriptions for GothBot's goth-closeup and goth-full-body paths. Each entry is ONE specific makeup look described in 10-20 words. These compose with separate archetype/wardrobe/hair pools.

These are BOLD, DRAMATIC, dark-beauty looks. Sultry, sexy, wicked. Think dark glamour — not subtle natural beauty, not corpse-paint horror. She CHOSE this look and it's devastating.

━━━ VARIETY SPREAD ━━━
- DARK LIP LOOKS (5-6) — oxblood matte, black-lacquer gloss, deep plum satin, wine-stained bitten, dark cherry with gold shimmer
- SMOKEY EYE VARIATIONS (5-6) — classic black smokey with sharp wing, grey-violet haze blended to brow, emerald-black cat-eye, burgundy smoke with gold inner corner, charcoal with silver-fleck highlight
- BOLD STATEMENT (4-5) — graphic black liner like calligraphy, dark contour carved into cheekbones, heavy kohl rimmed all around, dark eye with nude lip contrast, smudged lived-in dark glamour
- TEXTURAL / UNUSUAL (4-5) — glitter tears trailing from outer corner, metallic black chrome lips, dark shimmer dusted across cheekbones, wet-look dark eyelid lacquer, crushed jewel-tone pigment pressed into lids
- MINIMAL-DARK (3-4) — bare skin with one bold element (jet-black lip only), dewy pale skin with blackened lash line only, stripped-back with heavy brow and nothing else

━━━ RULES ━━━
- Describe the SPECIFIC makeup look, not the mood or the woman
- Each entry is a different look — no two should produce the same face
- GLAMOROUS and INTENTIONAL, not messy or decayed
- No blood, no wounds, no scars — these are MAKEUP looks not injury
- Include specific colors, finishes (matte, satin, gloss, shimmer), and placement

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
