#!/usr/bin/env node
const { generateBucketScenes, buildYumBotSubThemePrompt } = require('../../lib/yumbotBucketGen');

const SUB_THEMES = [
  { tag: 'burger-joint', blurb: 'Kawaii cheeseburgers / sliders / bacon-burgers / double-deckers / fish-burgers / mushroom-burgers / breakfast-sandwich / chicken-sandwich on a fast-food counter or tray. Anchor: checker tray, joint counter, paper-wrap edge, sesame-bun-cheeks.', example: '{ "tags": ["burger-joint"], "description": "Kawaii cheeseburger with smiling sesame-bun and pickle-eyes sitting on a checker fast-food tray beside a kawaii slider with a tiny grin, three-quarter overhead view" }' },
  { tag: 'pizza-shop', blurb: 'Kawaii pizza slices / whole pies / personal-pies / calzones / breadsticks / garlic-knots at a pizza counter or window. Anchor: pizza counter, cheese-pull, pepperoni-eye, mozzarella drip, brick-oven hint.', example: '{ "tags": ["pizza-shop"], "description": "Kawaii pizza slice with pepperoni-eyes and cheese-drip smile lifted mid-air with stringy mozzarella pull, against a pizza-counter backdrop, dynamic three-quarter side view" }' },
  { tag: 'taco-stand', blurb: 'Kawaii tacos / burritos / nachos / quesadillas / tater-tots / chimichanga / enchilada at a colorful taco stand or food-truck window. Anchor: crunchy shell smiles, salsa drips, lime wedges, papel-picado, food-truck window.', example: '{ "tags": ["taco-stand"], "description": "Kawaii crunchy taco with smiling shell and lettuce-fringe eyes standing upright at a colorful food-truck taco-stand window beside a kawaii burrito with foil-wrap smile, low-angle view" }' },
  { tag: 'fried-classics', blurb: 'Kawaii french fries / onion rings / chicken tenders / mozzarella sticks / corn dogs / hush-puppies / jalapeño-poppers / loaded-fries in a paper container or basket. Anchor: crispy gold textures, paper basket, ketchup dollops.', example: '{ "tags": ["fried-classics"], "description": "Kawaii french fries with smiling face peeking out of a red-striped paper carton beside a kawaii onion ring with a wide grin, ketchup dollop nearby, overhead view" }' },
  { tag: 'hot-dog-cart', blurb: 'Kawaii hot dogs / chili-dogs / corn-dogs / foot-longs / Coney-dogs / Chicago-style-dogs / sloppy-joe at a vendor cart. Anchor: mustard smile-lines, sauerkraut, ketchup zigzag, vendor cart, striped awning.', example: '{ "tags": ["hot-dog-cart"], "description": "Kawaii hot dog with smiling face and mustard-zigzag eyebrows nestled on a soft bun at a striped vendor cart beside a kawaii corn dog upright on a stick, three-quarter framing" }' },
  { tag: 'diner-shake-and-fries', blurb: 'Kawaii milkshakes / sundaes / floats paired with fries or burger sides at a classic diner counter. Anchor: cherry-on-top smiles, whipped-cream peaks, retro red-vinyl booth, chrome counter, jukebox silhouette.', example: '{ "tags": ["diner-shake-and-fries"], "description": "Kawaii strawberry milkshake with cherry-on-top smile and whipped-cream-eye peaks sitting on a retro red-vinyl diner counter beside a kawaii fries basket with grinning face, intimate eye-level view" }' },
];

generateBucketScenes({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_fast_food_scenes.json',
  perSubTheme: 34,
  subThemes: SUB_THEMES,
  buildPrompt: buildYumBotSubThemePrompt({ bucketTitle: 'FAST-FOOD', bannedNotes: 'NO desserts / pastries / produce / sweets — strictly fast-food only.' }),
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
