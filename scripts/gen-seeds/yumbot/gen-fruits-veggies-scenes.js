#!/usr/bin/env node
/**
 * YumBot fruits-veggies SCENES — bucket FV trial (2026-06-07).
 *
 * 6 organic-environment sub-themes × 5 entries = 30 trial-pool entries.
 * Each scene has a kawaii fruit/veggie HOST + 1-2 other kawaii dessert /
 * food FRIENDS hanging out together in the organic setting.
 */
const { generatePool } = require('../../lib/seedGenHelper');

generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_fruits_veggies_scenes.json',
  total: 30,
  batch: 30,
  metaPrompt: (
    n
  ) => `You are writing ${n} KAWAII FRUITS-AND-VEGGIES SCENES for YumBot. Each entry features 2-3 kawaii fruits and/or vegetables hanging out together in an organic outdoor environment (garden / fruit-tree / vine / harvest-basket / forest / farmers-market). The cast is PURELY fruits and vegetables — no desserts, no pastries, no sweets.

━━━ DISTRIBUTION — MANDATORY (exactly 5 per sub-theme) ━━━

The 30 entries split EXACTLY:
- 5 "vegetable-garden" — 2-3 kawaii veggies together in a backyard garden (carrot + tomato + pea / lettuce + radish / pumpkin + corn / pepper + zucchini / cucumber + cabbage — realistic garden combos)
- 5 "fruit-tree" — 2-3 kawaii fruits together on tree branches (apple + cherry / orange + lemon / pear + peach / pomegranate + fig)
- 5 "vine-and-bush" — 2-3 kawaii fruits on vines / bushes (grape cluster + strawberry / blueberry + raspberry / watermelon + pumpkin on the ground / blackberry + currant)
- 5 "harvest-basket" — 3 kawaii fruits / veggies together in a woven wicker basket (mixed bounty — tomato + carrot + apple / pear + radish + cucumber / pumpkin + corn + beet)
- 5 "forest-forage" — 2-3 kawaii wild berries / mushrooms / herbs in a magical sun-dappled forest (wild strawberry + chanterelle / blueberry + morel + fiddlehead / nettle + mint + wild raspberry)
- 5 "farmers-market" — 2-3 kawaii fruits / veggies at a charming market stall (apple pyramid + pear bunch / tomato display + carrot bundle / squash row + beet pile)

━━━ ENTRY SHAPE — STRUCTURED OBJECT (NON-NEGOTIABLE) ━━━

Each entry is a JSON object with exactly TWO fields:
{
  "tags": ["<one of: vegetable-garden | fruit-tree | vine-and-bush | harvest-basket | forest-forage | farmers-market>"],
  "description": "<the scene, 25-40 words>"
}

━━━ THE BAR — every entry must produce ━━━

- 2-3 specific kawaii fruits and/or vegetables with kawaii face features.
- The organic environment reads instantly — a load-bearing setting element (soil / branch / vine / wicker basket / mossy forest floor / market crate).
- A light composition hint (centered / off-center / overhead / 3-quarter / side-by-side).
- Self-contained.

━━━ EXAMPLES ━━━

{ "tags": ["vegetable-garden"], "description": "Kawaii orange carrot with leafy-green smile peeking up from rich dark soil beside a kawaii red tomato on the vine and a kawaii pea pod on a stake, three-quarter overhead view" }
{ "tags": ["fruit-tree"], "description": "Kawaii red apple with smiling stem hanging from a leafy branch alongside a kawaii pair of yellow lemons with crescent eyes nestled in the foliage, three-quarter side view" }
{ "tags": ["vine-and-bush"], "description": "Kawaii cluster of purple grapes with smiling globes hanging from a wooden trellis above a kawaii red strawberry resting on the leaves below, intimate three-quarter framing" }
{ "tags": ["harvest-basket"], "description": "Kawaii red tomato, kawaii orange carrot, and kawaii green apple with smiling faces nestled together in an overflowing wicker harvest basket, overhead centered view" }
{ "tags": ["forest-forage"], "description": "Kawaii red wild-strawberry with smiling seeds resting on a mossy forest floor beside a kawaii chanterelle mushroom with cap-grin and a kawaii fern frond with leaf-eyes, intimate eye-level view" }
{ "tags": ["farmers-market"], "description": "Kawaii red apple pyramid alongside a kawaii green pear bunch and a kawaii orange carrot bundle at a market stall with chalkboard signs, three-quarter view" }

━━━ HARD MANDATES ━━━

- EVERY entry features 2-3 kawaii FRUITS AND/OR VEGETABLES with kawaii face features.
- Organic environment reads instantly.
- Composition hint included.
- Each "description" is 25-40 words.

━━━ HARD BANS ━━━

- NO desserts, NO pastries, NO sweets, NO cookies, NO cakes, NO macarons, NO cupcakes, NO donuts, NO mochi, NO chocolate, NO breads, NO cinnamon rolls, NO ANYTHING that isn't a raw fruit or vegetable. The cast is PURELY fruits and vegetables.
- NO photo-realistic register.
- NO mood/lighting/palette words inside the description.
- NO sub-theme blending.
- NO human faces / NO human characters.

━━━ OUTPUT ━━━

A JSON array of exactly ${n} structured objects, in the order [5 vegetable-garden, 5 fruit-tree, 5 vine-and-bush, 5 harvest-basket, 5 forest-forage, 5 farmers-market]. No preamble. No numbering. Plain JSON array only.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
