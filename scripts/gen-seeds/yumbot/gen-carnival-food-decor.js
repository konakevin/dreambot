#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_carnival_food_decor.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} DECOR ACCENT items for YumBot carnival-food renders. The render's brief picks 2-4 per shot.

Each entry: 8-16 words. ONE specific decor item.

━━━ DISTRIBUTION ━━━

- 4 CARNIVAL CART PROPS (striped awning corner / hand-lettered price sign / paper cone / chalkboard / fairy-light strand)
- 4 PAPER GOODS (paper cone / striped paper bag / paper-cup / paper-wrap / paper-straw)
- 4 BOOTH DRESSING (bunting flag / mini-ticket / wooden cart-railing / red-checker tablecloth corner / fan-flag)
- 4 CARNIVAL PRIZE PROPS (mini plushie / hat-feather / spinning-pinwheel / fairground-ticket / hand-stamp)
- 4 FOOD-SIDE PROPS (lemon-slice wedge / mini cocktail-umbrella / cherry stem / sugar-sprinkle scatter / drizzle ribbon)
- 5 SMALL FAIR ACCENTS (mini popcorn pile / lemonade pitcher rim / paper-confetti / pinwheel / Ferris-wheel charm)

━━━ EXAMPLES ━━━

"A small striped red-and-white awning corner visible at the frame edge"
"A folded paper cone with hand-lettered price visible on the side"
"A small bunting flag with cheerful color stripes draped at the top"
"A tiny stuffed-plushie prize sitting on a shelf nearby"
"A wedge of fresh lemon resting beside the lemonade cup"
"A tiny mini cocktail-umbrella stuck in the snow cone"

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
