#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/dream_inhabitants.json',
  total: 80,
  batch: 20,
  metaPrompt: (n) => `You are writing ${n} KAWAII FOOD-CREATURE GROUP descriptions for YumBot rainbow-dreamscape. Each entry describes 4-7 mixed-type anthropomorphized kawaii smiling-face foods/drinks/desserts sitting together in a pastel meadow.

Each entry: 35-60 words. Describes ONE scene's group with named specific foods.

━━━ ⚠ CRITICAL: VARIETY MANDATE — STRICT CATEGORY DISTRIBUTION ━━━

Previous generations were BIASED toward boba-cups + sundaes + mochi. THIS POOL MUST BE BALANCED.

Each entry's LEAD food (first named) must rotate through 7 distinct CATEGORIES. Distribute the ${n} entries roughly equally across:

  - CATEGORY A — PASTRY/CAKE LEAD (cupcake / shortcake / cheesecake / mille-feuille / cake-pop / fruit-tart / egg-tart / mini-cake / cinnamon-roll / scone / cream-puff / eclair / choco-cornet / melon-pan / banana-pudding)
  - CATEGORY B — PANCAKE/WAFFLE/CREPE LEAD (soufflé pancake / mini pancake stack / waffle / crepe / honey-toast)
  - CATEGORY C — COOKIE/SWEET-TREAT LEAD (smiling cookie / pocky stick / marshmallow / gummy / brownie / chocolate-covered strawberry / churro / macaron)
  - CATEGORY D — MOCHI/JAPANESE-DESSERT LEAD (mochi / dango / taiyaki / mochi-donut / fruit-sando / strawberry-daifuku)
  - CATEGORY E — DRINK/CUP LEAD (boba / hot-cocoa / iced-coffee / matcha-latte / smoothie / parfait-glass / sundae-glass) — CAP at 20% of pool
  - CATEGORY F — ICE-CREAM/POPSICLE/COLD LEAD (sundae / soft-serve / popsicle / kakigori shaved-ice / bingsu) — CAP at 12% of pool
  - CATEGORY G — SAVORY-KAWAII LEAD (onigiri / sushi roll / ramen bowl / fried-chicken bites / french fries / mini pizza / dumpling)

⚠ HARD RULE: drinks (E) + ice-cream (F) combined MUST stay below 30% of total entries. Pastries/cookies/mochi must DOMINATE.

⚠ Each group of 4-7 foods must include AT LEAST 3 DIFFERENT category types. Never a group that's "3 cups + 1 sundae" — must mix categories.

━━━ FORMAT EXAMPLES (showing variety the pool MUST hit) ━━━

✓ "A smiling strawberry shortcake with cream-swirl face, three pastel macarons in pink/mint/lavender stacked, a smiling pocky-stick standing upright, a smiling cake-pop, and a smiling cinnamon-roll with icing-drip — clustered in a wildflower meadow"

✓ "A smiling soufflé pancake stack with cherry-on-top, a smiling crepe folded with strawberry-filling visible, two smiling waffle-faces, a smiling brownie-square, and a smiling honey-toast with cube-cuts"

✓ "A smiling pastel cupcake with rainbow sprinkles, a smiling chocolate-cake-pop on a stick, three smiling pastel-cookies in heart/star/circle shapes, a smiling macaron-tower of four, and a smiling cream-puff"

✓ "A smiling onigiri with seaweed-belt face, three smiling fried-chicken-bites with little legs, a smiling french-fry-trio, a smiling sushi-roll with avocado-face, and a smiling pastel boba-cup"

✓ "A smiling melon-pan with checker-top face, a smiling choco-cornet with cream-drip, two smiling eclairs side by side, a smiling fruit-tart with strawberry-on-top, a smiling mini egg-tart, and a smiling pastel cream-puff"

✓ "A smiling pastel mochi-trio in pink/mint/yellow, a smiling dango-skewer with three-balls, a smiling taiyaki with red-bean-drip, a smiling mochi-donut twin, and a smiling kakigori shaved-ice with rainbow-syrup"

✓ "A smiling pastel-popsicle on a stick-with-face, a smiling soft-serve cone with cherry-on-top, a smiling kakigori-bowl with rainbow-syrup, a smiling cake-pop, and a smiling banana-pudding cup"

✓ "A smiling tall boba-cup (just one!), a smiling cinnamon-roll, a smiling fruit-tart, a smiling pastel-macaron-trio leaning together, a smiling soufflé-pancake stack, a smiling pocky-stick — diverse picnic group"

━━━ HARD MANDATES ━━━

- 4-7 DIFFERENT foods per group — variety is everything
- Each food has a clear KAWAII SMILING FACE (closed-arc eyes / dimpled blush cheeks / tiny mouth)
- Mix HEIGHTS (tall + medium + short)
- Mix CATEGORIES (at least 3 different food-types per group)
- Glossy pearlescent Pop-Mart designer-vinyl finish
- Pastel palette
- Foods can have tiny anthropomorphic features (legs / leaf-hats / cherry-toppers)

━━━ HARD BANS ━━━

- NO real creatures / animals / humans
- NO single solo food
- NO "boba + sundae + mochi + cupcake" lazy default groups
- ⚠ Drinks (boba/coffee/latte/tea) appear at MOST in 20% of entries
- ⚠ Ice-cream/sundaes appear at MOST in 12% of entries
- ⚠ Mochi/dango appears at MOST in 30% of entries
- Cookies, cake-pops, macarons, cupcakes, pastries MUST appear MORE OFTEN than drinks
- NO scary / dark / weird food
- NO indoor / tabletop setting language

━━━ OUTPUT ━━━

JSON array of \${n} strings. Each entry covers ONE scene's diverse-group (4-7 mixed kawaii foods, drawn from different categories). No preamble, no numbering. Push variety hard — every entry should feel category-fresh.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
