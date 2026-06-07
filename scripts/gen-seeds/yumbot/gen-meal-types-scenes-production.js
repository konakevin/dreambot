#!/usr/bin/env node
const { generateBucketScenes, buildYumBotSubThemePrompt } = require('../../lib/yumbotBucketGen');

const SUB_THEMES = [
  { tag: 'breakfast', blurb: 'Kawaii pancake stacks / toast / eggs / cereal / muffins / breakfast pastries / waffles / French toast / oatmeal at a morning home table. Anchor: windowsill table, breakfast plate setting. Vary the breakfast dish widely.', example: '{ "tags": ["breakfast"], "description": "Kawaii pancake stack with smiling syrup-eyes wobbling slightly on a sun-warmed windowsill table, golden butter slab winking on top, soft 3-quarter framing centered on the stack" }' },
  { tag: 'high-tea', blurb: 'Kawaii scones / macarons / mini-cakes / tea-sandwiches / tarts / petit-fours / clotted-cream pots on tiered china stands. Vintage tea-room register. Anchor: tiered stand, vintage china, lace.', example: '{ "tags": ["high-tea"], "description": "Three kawaii rose-macarons clustered on the top tier of a vintage pastel-pink three-tier china stand, gentle 3-quarter view with the stand filling most of the frame" }' },
  { tag: 'picnic', blurb: 'Kawaii sandwiches / hand-pies / fruit / lemonade / cookies / wrap / iced-tea / cheese-and-grapes on a checker blanket outdoors. Anchor: red-and-white checker blanket, grass edge, basket.', example: '{ "tags": ["picnic"], "description": "Kawaii triangle-sandwich with dot-blush cheeks resting on a red-and-white checker blanket beside a stripe-mug of lemonade, overhead 3-quarter composition with grass edge" }' },
  { tag: 'coffee-shop', blurb: 'Kawaii lattes / croissants / cookies / muffins / cappuccinos / scones / cake-slices at a cafe counter. Anchor: marble cafe counter, espresso-machine silhouette, chalkboard menu.', example: '{ "tags": ["coffee-shop"], "description": "Kawaii latte mug with hearted foam-eyes sitting on a marble cafe counter, butter croissant beside it, slight overhead lean, espresso-machine silhouette implied in background" }' },
  { tag: 'food-truck', blurb: 'Kawaii tacos / hot dogs / burgers / fries / ice-cream / pretzels / loaded-fries at a neon-lit night food truck. Anchor: neon signage, food truck window, urban festive.', example: '{ "tags": ["food-truck"], "description": "Kawaii double-decker taco with smiling eyes peeking over the serving window of a neon-lit night food truck, low 3-quarter framing emphasizing the truck-window pickup moment" }' },
  { tag: 'midnight-snack', blurb: 'Kawaii milk-and-cookies / leftover pizza / cereal / ice cream / instant-noodles / popcorn / chips in a dim warm kitchen at night. Anchor: dim kitchen counter, single warm lamp, sleepy half-closed eyes.', example: '{ "tags": ["midnight-snack"], "description": "Kawaii milk glass with sleepy half-closed eyes beside three chocolate-chip cookies on a dim kitchen counter, low warm spotlight composition centered on the pair" }' },
];

const buildPrompt = buildYumBotSubThemePrompt({ bucketTitle: 'MEAL-TYPE', bannedNotes: '' });

generateBucketScenes({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_meal_types_scenes.json',
  perSubTheme: 34,
  subThemes: SUB_THEMES,
  buildPrompt,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
