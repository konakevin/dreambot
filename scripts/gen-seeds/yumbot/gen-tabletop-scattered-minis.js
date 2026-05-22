#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/tabletop_scattered_minis.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing \${n} SCATTERED MINI-FRIEND descriptions for YumBot checkered-tabletop. Small kawaii mini-foods scattered across the tablecloth around the hero. Template picks 5 per render to form the sticker-card-tableau feel.

Each entry: 8-15 words. ONE specific scattered mini-friend.

━━━ REFERENCE — bex.ai ━━━

Mini-smiling cookies, smiling-stars, smiling-fruits, mini-marshmallows, heart-candies, mini-cubes, smiling-cake-pieces. Each is small, smiling, with kawaii face.

━━━ DISTRIBUTION ━━━

- 20% SMILING-COOKIE (smiling-mini-cookie with chocolate-chip-eyes / smiling-star-cookie with sprinkles / smiling-heart-cookie with icing)
- 15% SMILING-STAR (smiling-pastel-star with closed-arc eyes / smiling-yellow-star with blush / smiling-pearlescent-star with face)
- 15% SMILING-FRUIT (smiling-strawberry / smiling-cherry / smiling-orange / smiling-peach / smiling-blueberry / smiling-pumpkin)
- 15% HEART-CANDIES (pastel heart-candy cluster / smiling heart-candy / heart-shaped-cookie with face)
- 10% MINI-CUBES (smiling sugar-cubes / smiling-mini-jelly-cubes / smiling-pastel-cubes)
- 10% MINI-MARSHMALLOW (smiling-marshmallow / pastel marshmallow-cluster / smiling-marshmallow-cube)
- 5% MINI-CAKE-PIECE (smiling-mini-cake-slice / smiling-tiramisu-piece / smiling-chocolate-piece)
- 5% MINI-MACARON (smiling-pastel-macaron / mini-macaron-with-face / smiling-macaron-trio)
- 5% MISC SMILING (smiling-mini-bow-ribbon / smiling-pastel-button / smiling-sprinkle-cluster)

━━━ HARD MANDATES ━━━

- Each mini has a SMILING FACE (kawaii)
- Pastel palette
- Glossy pearlescent finish
- Small / scattered (not piled — that's a separate pool)

━━━ HARD BANS ━━━

- NO non-smiling items
- NO duplicate-of-hero items
- NO chibi real creatures / animals

━━━ OUTPUT ━━━

JSON array of \\${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
