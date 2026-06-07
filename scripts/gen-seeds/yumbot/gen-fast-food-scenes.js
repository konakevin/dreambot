#!/usr/bin/env node
/**
 * YumBot fast-food SCENES — bucket FF trial (2026-06-07).
 *
 * 6 fast-food sub-themes × 5 entries = 30 trial-pool entries.
 */
const { generatePool } = require('../../lib/seedGenHelper');

generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_fast_food_scenes.json',
  total: 30,
  batch: 30,
  metaPrompt: (
    n
  ) => `You are writing ${n} KAWAII FAST-FOOD SCENES for YumBot. Each entry features 1-3 kawaii fast-food items (burgers / pizza / tacos / fries / hot dogs / shakes etc.) in a fast-food context (joint counter / pizza window / taco stand / fryer-cart / hot-dog cart / diner booth).

━━━ DISTRIBUTION — MANDATORY (exactly 5 per sub-theme) ━━━

The 30 entries split EXACTLY:
- 5 "burger-joint" — kawaii cheeseburgers / sliders / bacon-burgers / double-deckers / fish-burgers on a fast-food counter or tray (lettuce smiles, pickle eyes, sesame-bun cheeks)
- 5 "pizza-shop" — kawaii pizza slices / whole pies / personal-pies / calzones at a pizza counter or window (pepperoni-eye smiles, mozzarella drips, cheese-pull mid-action)
- 5 "taco-stand" — kawaii tacos / burritos / nachos / quesadillas / tater-tots at a colorful taco stand or food-truck window (crunchy shell smiles, salsa drips, lime wedges)
- 5 "fried-classics" — kawaii french fries / onion rings / chicken tenders / mozzarella sticks / corn dogs in a paper container or basket (crispy gold textures, ketchup dollops)
- 5 "hot-dog-cart" — kawaii hot dogs / chili-dogs / corn-dogs / foot-longs at a vendor cart (mustard smile-lines, sauerkraut, ketchup zigzag)
- 5 "diner-shake-and-fries" — kawaii milkshakes / sundaes / floats / paired with fries or burger sides at a classic diner counter (cherry-on-top smiles, whipped-cream peaks, retro-diner red-vinyl booth)

━━━ ENTRY SHAPE — STRUCTURED OBJECT (NON-NEGOTIABLE) ━━━

Each entry is a JSON object with exactly TWO fields:
{
  "tags": ["<one of: burger-joint | pizza-shop | taco-stand | fried-classics | hot-dog-cart | diner-shake-and-fries>"],
  "description": "<the scene, 25-40 words>"
}

━━━ THE BAR — every entry must produce ━━━

- 1-3 specific kawaii fast-food items with kawaii face features.
- The fast-food context reads instantly — name a load-bearing setting element (joint counter / pizza window / taco stand / paper-basket / cart-edge / diner-booth).
- A light composition hint (centered / off-center / overhead / 3-quarter).
- Self-contained.

━━━ EXAMPLES ━━━

{ "tags": ["burger-joint"], "description": "Kawaii cheeseburger with smiling sesame-bun and pickle-eyes sitting on a checker fast-food tray beside a kawaii slider with a tiny grin, three-quarter overhead view" }
{ "tags": ["pizza-shop"], "description": "Kawaii pizza slice with pepperoni-eyes and cheese-drip smile lifted mid-air with stringy mozzarella pull, against a pizza-counter backdrop, dynamic three-quarter side view" }
{ "tags": ["taco-stand"], "description": "Kawaii crunchy taco with smiling shell and lettuce-fringe eyes standing upright at a colorful food-truck taco-stand window beside a kawaii burrito with foil-wrap smile, low-angle view" }
{ "tags": ["fried-classics"], "description": "Kawaii french fries with smiling face peeking out of a red-striped paper carton beside a kawaii onion ring with a wide grin, ketchup dollop nearby, overhead view" }
{ "tags": ["hot-dog-cart"], "description": "Kawaii hot dog with smiling face and mustard-zigzag eyebrows nestled on a soft bun at a striped vendor cart beside a kawaii corn dog upright on a stick, three-quarter framing" }
{ "tags": ["diner-shake-and-fries"], "description": "Kawaii strawberry milkshake with cherry-on-top smile and whipped-cream-eye peaks sitting on a retro red-vinyl diner counter beside a kawaii fries basket with grinning face, intimate eye-level view" }

━━━ HARD MANDATES ━━━

- EVERY entry features 1-3 kawaii fast-food items WITH kawaii face features.
- Fast-food context reads instantly — name a setting element.
- Composition hint included.
- Each "description" is 25-40 words.

━━━ HARD BANS ━━━

- NO desserts, pastries, sweets that aren't classic fast-food — the cast is fast-food only (burgers, fries, pizza, tacos, hot dogs, shakes, etc.).
- NO photo-realistic register.
- NO mood/lighting/palette words inside the description.
- NO sub-theme blending.
- NO human faces.

━━━ OUTPUT ━━━

A JSON array of exactly ${n} structured objects, in the order [5 burger-joint, 5 pizza-shop, 5 taco-stand, 5 fried-classics, 5 hot-dog-cart, 5 diner-shake-and-fries]. No preamble. No numbering. Plain JSON array only.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
