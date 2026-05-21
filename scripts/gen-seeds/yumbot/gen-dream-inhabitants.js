#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/dream_inhabitants.json',
  total: 80,
  batch: 20,
  metaPrompt: (n) => `You are writing ${n} KAWAII FOOD-CREATURE GROUP descriptions for YumBot rainbow-dreamscape. Each entry describes 3-7 mixed-type anthropomorphized kawaii smiling-face foods/drinks sitting together in a pastel meadow like creature-inhabitants of a dream-world.

Each entry: 25-45 words. Describes ONE scene's group of food-creatures.

━━━ REFERENCE — bex.ai expanded food catalog ━━━

The kawaii food-creatures are NOT just cups. The catalog spans drinks AND desserts AND savory:

DRINKS / VESSELS: boba milk-tea cup / hot-cocoa mug / iced-coffee glass / matcha latte / smoothie tumbler / parfait glass / sundae glass / shaved-ice cup (kakigori) / bingsu bowl / yogurt-parfait bowl / jelly cup / pudding cup / ramen bowl

DESSERTS / PASTRIES: strawberry shortcake / macarons / donuts / mochi donuts / crepes / soufflé pancakes / waffles / cupcakes / cheesecake / cinnamon rolls / cookies / cream puffs / mochi / dango / taiyaki / soft-serve ice cream / popsicles / croissants / fruit tarts / chocolate-covered strawberries / brownies / pudding/flan / churros / mini cakes / pocky sticks / cotton candy / gummy candies / fruit sando / egg tarts / banana pudding / mille-feuille / eclairs / scones / honey toast / mini pancakes / cake pops / marshmallows / choco cornet / melon pan

SAVORY-KAWAII: onigiri / sushi rolls / fried chicken bites / french fries / mini pizza / dumplings

You may also include any similar kawaii-style food/drink fitting the bex.ai aesthetic — sweet or savory, any culture, anything that can be anthropomorphized cute.

━━━ FORMAT — MIXED GROUP OF 3-7 KAWAII FOOD-CREATURES ━━━

Each entry describes a GROUP of 3-7 different food-creatures (mixed types, not all the same) sitting together in the meadow. Each has a kawaii smiling face. Mix drinks AND desserts AND occasionally savory. Vary the heights — some tall (cups / boba / sundaes), some short (donuts / cookies / mochi / mini-pancakes), some medium (cupcakes / parfaits / shortcakes).

Examples:
✓ "A cluster of kawaii smiling foods nestled in the grass: a tall pastel boba-cup, a strawberry shortcake with whipped-cream-face, a mini stack of soufflé pancakes, three mochi-balls in pastel pink/mint/yellow, and a smiling taiyaki — all with closed-arc eyes and blush cheeks"
✓ "Five smiling pastel cake-pops on stick-legs standing in the meadow, a cluster of three smiling macarons (pink + mint + lavender), a smiling cinnamon-roll with cream-swirl-face, a tall smiling iced-matcha-glass"
✓ "A trio of smiling pastel-donuts (chocolate / strawberry / vanilla), a smiling cream-puff with sprinkle-eyes, a pastel parfait-glass with smiling-face, two smiling mochi-balls, all clustered in the flower-meadow"
✓ "A pastel onigiri with smiling-face, three smiling fried-chicken-bites with little legs and kawaii eyes, a smiling french-fry-pile, a tall ramen-bowl with smiling-face and floating egg-with-face, in a sunny meadow"
✓ "Four smiling pastel macarons in different colors stacked + leaning, a smiling fruit-tart with strawberry-on-top, a tall boba-cup smiling, a single smiling donut, all in a cherry-blossom meadow"
✓ "A tall sundae-glass with smiling face, a smiling chocolate-covered-strawberry, three smiling mini-pancakes stacked, a smiling churro with kawaii face, and a smiling popsicle on a stick"

━━━ HARD MANDATES ━━━

- 3-7 DIFFERENT food-creatures (NOT all the same type) — variety is the signature
- Each food-creature has a clear KAWAII SMILING FACE (closed-arc eyes / dimpled blush cheeks / tiny mouth)
- Mix heights/shapes for visual interest
- Each is GLOSSY PEARLESCENT Pop-Mart designer-vinyl finish
- Pastel palette throughout
- Foods can have tiny features (legs / leaf-hats / cherry-toppers) to feel more creature-like

━━━ HARD BANS ━━━

- NO actual chibi real creatures / animals / humans (the FOOD is the cast)
- NO single solo food (must be a GROUP)
- NO repetitive same-food groups (must mix types)
- NO dark / scary / weird food
- NO indoor / tabletop setting language (other pool handles setting)

━━━ OUTPUT ━━━

JSON array of \${n} strings. No preamble, no numbering. Each entry describes ONE scene's group with named specific foods.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
