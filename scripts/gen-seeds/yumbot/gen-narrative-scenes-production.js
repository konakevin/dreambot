#!/usr/bin/env node
const { generateBucketScenes, buildYumBotSubThemePrompt } = require('../../lib/yumbotBucketGen');

const SUB_THEMES = [
  { tag: 'baking-in-progress', blurb: 'Kawaii dough mid-rise on a flour-dusted counter / cookie cut-outs being arranged on a tray / cake batter being mixed / pie crust being crimped / bread being shaped (active hands-in-process moments — but the HANDS are kawaii food itself, never human hands).', example: '{ "tags": ["baking-in-progress"], "description": "Kawaii cookie-dough lump with smiling proofing-eyes mid-rise in a flour-dusted ceramic bowl on a warm baking counter, tiny rolling-pin beside, three-quarter overhead view" }' },
  { tag: 'garden-harvest', blurb: 'Kawaii fruit / berry / vegetable being picked from a kawaii garden / a basket overflowing with smiling kawaii produce / a kawaii tomato hopping from a vine into a basket / harvest moment caught mid-action.', example: '{ "tags": ["garden-harvest"], "description": "Kawaii red strawberry with smiling juicy-eyes leaping joyfully from the vine into a wicker harvest basket of giggling kawaii berries, side-on action framing in a sunny garden" }' },
  { tag: 'pastry-shop-window', blurb: 'View through a pastry-shop window from OUTSIDE looking in at kawaii pastries on display tiers, kawaii window-display foods waving at peeking customers (window-frame edge visible at edges of composition).', example: '{ "tags": ["pastry-shop-window"], "description": "Kawaii display of smiling éclairs and tarts on tiered stands visible through a polished pastry-shop window from outside, gold lettering arching on the glass, off-center centered framing" }' },
  { tag: 'food-parade', blurb: 'A procession / march / parade of kawaii foods through a whimsical street — float-cake, marching cookie-band, balloon-donut, drumline-cupcakes / waving foods in motion down a parade route.', example: '{ "tags": ["food-parade"], "description": "Kawaii float-cake with cherry-blossom face leading a marching cookie-band down a confetti-strewn parade street, drumline-cupcakes beating tiny drums beside, wide low parade-side framing" }' },
  { tag: 'food-tea-party', blurb: 'Kawaii foods AS GUESTS at their own tea-party — cupcakes seated around a table holding tiny cups, cookies clinking their cups, a pastry-host pouring kawaii tea from a teapot.', example: '{ "tags": ["food-tea-party"], "description": "Kawaii cupcakes seated around a tiny round tea-table holding miniature cups, the pastry-host scone with smiling raisin-eyes pouring tea from a kettle, three-quarter overhead view" }' },
  { tag: 'bakery-delivery', blurb: 'Kawaii foods being DELIVERED through a magical city — a basket-load of croissants riding a tiny bicycle, kawaii cake on a paper-airplane mid-flight, a baguette in a cycling messenger basket weaving through streets.', example: '{ "tags": ["bakery-delivery"], "description": "Kawaii basket of smiling croissants riding the basket of a tiny old bicycle through a magical sun-dappled cobblestone street, side-tracking motion composition" }' },
];

generateBucketScenes({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_narrative_scenes.json',
  perSubTheme: 34,
  subThemes: SUB_THEMES,
  buildPrompt: buildYumBotSubThemePrompt({ bucketTitle: 'NARRATIVE-ACTION', bannedNotes: 'NO human hands / NO human characters — the food IS the cast and the actor.' }),
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
