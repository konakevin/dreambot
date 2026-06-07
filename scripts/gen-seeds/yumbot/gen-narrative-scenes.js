#!/usr/bin/env node
/**
 * YumBot narrative SCENES — bucket F trial (2026-06-07).
 *
 * 6 narrative-action sub-themes × 5 entries = 30 trial-pool entries.
 */
const { generatePool } = require('../../lib/seedGenHelper');

generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_narrative_scenes.json',
  total: 30,
  batch: 30,
  metaPrompt: (
    n
  ) => `You are writing ${n} KAWAII-FOOD NARRATIVE / ACTION SCENES for YumBot. Each entry sets up a kawaii-food vignette CAUGHT MID-STORY — a specific narrative MOMENT (baking-in-progress, harvest, shop-window peek, food parade, food tea-party, delivery in motion). These are ACTION scenes — not still-lifes. The kawaii subject is DOING something or being a CHARACTER in a story moment.

━━━ DISTRIBUTION — MANDATORY (exactly 5 per sub-theme) ━━━

The 30 entries split EXACTLY:
- 5 "baking-in-progress" — kawaii dough mid-rise on a flour-dusted counter / cookie cut-outs being arranged on a tray / cake batter being mixed / pie crust being crimped / bread being shaped (active hands-in-process moments — but the HANDS are kawaii food itself, never human hands)
- 5 "garden-harvest" — kawaii fruit / berry / vegetable being picked from a kawaii garden / a basket overflowing with smiling kawaii produce / a kawaii tomato hopping from a vine into a basket / harvest moment caught mid-action
- 5 "pastry-shop-window" — view through a pastry-shop window from OUTSIDE looking in at kawaii pastries on display tiers, kawaii window-display foods waving at peeking customers (window-frame edge visible at edges of composition)
- 5 "food-parade" — a procession / march / parade of kawaii foods through a whimsical street — float-cake, marching cookie-band, balloon-donut, drumline-cupcakes / waving foods in motion down a parade route
- 5 "food-tea-party" — kawaii foods AS GUESTS at their own tea-party — cupcakes seated around a table holding tiny cups, cookies clinking their cups, a pastry-host pouring kawaii tea from a teapot
- 5 "bakery-delivery" — kawaii foods being DELIVERED through a magical city — a basket-load of croissants riding a tiny bicycle, kawaii cake on a paper-airplane mid-flight, a baguette in a cycling messenger's basket weaving through streets

━━━ ENTRY SHAPE — STRUCTURED OBJECT (NON-NEGOTIABLE) ━━━

Each entry is a JSON object with exactly TWO fields:
{
  "tags": ["<one of: baking-in-progress | garden-harvest | pastry-shop-window | food-parade | food-tea-party | bakery-delivery>"],
  "description": "<the scene, 25-40 words>"
}

━━━ THE BAR — every entry must produce ━━━

- One specific kawaii food subject with kawaii face features.
- The NARRATIVE MOMENT reads instantly — the food IS DOING SOMETHING or part of a story moment.
- A light composition hint (centered / 3-quarter / overhead / off-center).
- Self-contained.

━━━ EXAMPLES ━━━

{ "tags": ["baking-in-progress"], "description": "Kawaii cookie-dough lump with smiling proofing-eyes mid-rise in a flour-dusted ceramic bowl on a warm baking counter, tiny rolling-pin beside, three-quarter overhead view" }
{ "tags": ["garden-harvest"], "description": "Kawaii red strawberry with smiling juicy-eyes leaping joyfully from the vine into a wicker harvest basket of giggling kawaii berries, side-on action framing in a sunny garden" }
{ "tags": ["pastry-shop-window"], "description": "Kawaii display of smiling éclairs and tarts on tiered stands visible through a polished pastry-shop window from outside, gold lettering arching on the glass, off-center centered framing" }
{ "tags": ["food-parade"], "description": "Kawaii float-cake with cherry-blossom face leading a marching cookie-band down a confetti-strewn parade street, drumline-cupcakes beating tiny drums beside, wide low parade-side framing" }
{ "tags": ["food-tea-party"], "description": "Kawaii cupcakes seated around a tiny round tea-table holding miniature cups, the pastry-host scone with smiling raisin-eyes pouring tea from a kettle, three-quarter overhead view" }
{ "tags": ["bakery-delivery"], "description": "Kawaii basket of smiling croissants riding the basket of a tiny old bicycle through a magical sun-dappled cobblestone street, side-tracking motion composition" }

━━━ HARD MANDATES ━━━

- EVERY entry has the kawaii subject WITH kawaii face features.
- The narrative moment must read instantly — caught mid-action / mid-story.
- Composition hint included.
- Each "description" is 25-40 words.

━━━ HARD BANS ━━━

- NO human faces / NO human hands / NO human characters. The food IS the cast.
- NO photo-realistic register.
- NO mood/lighting/palette words inside the description.
- NO sub-theme blending.

━━━ OUTPUT ━━━

A JSON array of exactly ${n} structured objects, in the order [5 baking-in-progress, 5 garden-harvest, 5 pastry-shop-window, 5 food-parade, 5 food-tea-party, 5 bakery-delivery]. No preamble. No numbering. Plain JSON array only.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
