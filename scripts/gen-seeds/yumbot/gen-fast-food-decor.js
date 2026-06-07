#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_fast_food_decor.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} DECOR ACCENT items for YumBot fast-food renders. The render's brief picks 2-4 per shot.

Each entry: 8-16 words. ONE specific decor item.

━━━ DISTRIBUTION ━━━

- 4 FAST-FOOD CONTAINERS (paper-wrap edge / red-checker basket / paper bag / striped cup / takeout box corner)
- 4 SAUCE PROPS (ketchup-packet / mustard-squeeze-bottle / mayo dollop / hot-sauce bottle / dipping cup)
- 4 DINER PROPS (chrome napkin-holder / salt-and-pepper shakers / mini bud-vase / vinyl-booth corner / red checker tablecloth)
- 4 CART PROPS (chalkboard sign / striped awning corner / cart-edge railing / wooden serving plank / chrome bin lid)
- 4 PAIRED-FOOD-SIDE DECOR (pickle spear / lemon wedge / orange slice / chopped onion mound / sliced tomato)
- 5 SMALL PAPER GOODS (paper straw / drinking-cup top / wax-paper wrapping / paper menu / receipt curl)

━━━ EXAMPLES ━━━

"A small red-checker fries basket beside the subject"
"A small ketchup-packet partially squeezed open"
"A small chrome napkin holder with paper napkins fanned out"
"A small wooden cart-side chalkboard sign with hand-lettered specials"
"A pickle spear resting beside the burger"
"A red-and-white paper straw bent at the top"

━━━ HARD MANDATES ━━━

- Self-contained — clean when 2-4 combined per render
- Specific item, not a category

━━━ HARD BANS ━━━

- NO color / palette / lighting language
- NO companion creatures
- NO camera / framing language

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
