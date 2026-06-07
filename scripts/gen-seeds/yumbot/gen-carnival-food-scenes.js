#!/usr/bin/env node
/**
 * YumBot carnival-food SCENES — bucket CF trial (2026-06-07).
 *
 * 6 carnival-food sub-themes × 5 entries = 30 trial-pool entries.
 */
const { generatePool } = require('../../lib/seedGenHelper');

generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_carnival_food_scenes.json',
  total: 30,
  batch: 30,
  metaPrompt: (
    n
  ) => `You are writing ${n} KAWAII CARNIVAL-FOOD SCENES for YumBot. Each entry features 1-3 kawaii carnival foods (cotton candy / funnel cake / caramel apple / snow cone / pretzel / corn dog) at a carnival / fairground booth context (striped awning, midway, Ferris-wheel hint, string-lights).

━━━ DISTRIBUTION — MANDATORY (exactly 5 per sub-theme) ━━━

The 30 entries split EXACTLY:
- 5 "cotton-candy-cart" — kawaii cotton-candy clouds on paper sticks (pink-and-blue / pastel-rainbow / sour-apple-green / bubblegum) at a striped cotton-candy cart booth
- 5 "funnel-cake-stand" — kawaii funnel cakes powdered with sugar (with strawberry-drizzle / chocolate-drizzle / lemon-zest) at a fryer-stand with red-checker boats
- 5 "caramel-apple-booth" — kawaii caramel apples / candy apples / popcorn balls / chocolate-dipped marshmallow sticks on a booth display with autumn leaves accent
- 5 "snow-cone-stand" — kawaii snow cones / shaved ice / slushies in colorful paper cones (rainbow stripe / cherry / blue raspberry / lime) at a snow-cone stand
- 5 "pretzel-cart" — kawaii soft pretzels / churros / fried-dough strips / cinnamon-sugar twists in paper sleeves at a carnival pretzel cart
- 5 "carnival-corn-dog" — kawaii corn dogs on sticks / fresh lemonade in striped cups / kettle corn / hot fresh pretzels at a carnival foodway

━━━ ENTRY SHAPE — STRUCTURED OBJECT (NON-NEGOTIABLE) ━━━

Each entry is a JSON object with exactly TWO fields:
{
  "tags": ["<one of: cotton-candy-cart | funnel-cake-stand | caramel-apple-booth | snow-cone-stand | pretzel-cart | carnival-corn-dog>"],
  "description": "<the scene, 25-40 words>"
}

━━━ THE BAR — every entry must produce ━━━

- 1-3 specific kawaii carnival-food items with kawaii face features.
- Carnival context reads instantly — name a load-bearing setting element (striped awning / booth counter / cart-rail / midway / paper-cone / string-lights / Ferris-wheel hint).
- A light composition hint.
- Self-contained.

━━━ EXAMPLES ━━━

{ "tags": ["cotton-candy-cart"], "description": "Kawaii pink-and-blue cotton-candy cloud with smiling eyes spun onto a paper stick beside a kawaii sour-apple-green cotton-candy stick under a candy-striped awning, three-quarter low-angle view" }
{ "tags": ["funnel-cake-stand"], "description": "Kawaii funnel cake with powdered-sugar smile on a red-checker paper boat at a fryer stand, strawberry-drizzle swirl mid-pour, intimate eye-level view" }
{ "tags": ["caramel-apple-booth"], "description": "Kawaii caramel apple on a wooden stick with smiling caramel-drip eyes beside a kawaii popcorn ball with grinning kernels at a fall-leaves-decorated booth, three-quarter view" }
{ "tags": ["snow-cone-stand"], "description": "Kawaii rainbow snow-cone in a striped paper cup with smiling shaved-ice face beside a kawaii blue-raspberry slushie at a colorful snow-cone stand, low hero-up view" }
{ "tags": ["pretzel-cart"], "description": "Kawaii soft pretzel with smiling salt-crystal eyes wrapped in a paper sleeve at a carnival pretzel cart beside a kawaii cinnamon-sugar churro with grin, three-quarter framing" }
{ "tags": ["carnival-corn-dog"], "description": "Kawaii corn dog on a wooden stick with smiling face beside a kawaii striped paper-cup lemonade at a carnival foodway, string-lights overhead, low-angle hero view" }

━━━ HARD MANDATES ━━━

- EVERY entry features 1-3 kawaii carnival-foods WITH kawaii face features.
- Carnival context reads instantly.
- Composition hint included.
- Each "description" is 25-40 words.

━━━ HARD BANS ━━━

- NO regular fast-food (burgers / pizza / tacos) — strictly carnival / fairground food.
- NO photo-realistic register.
- NO mood/lighting/palette words inside the description.
- NO sub-theme blending.
- NO human faces.

━━━ OUTPUT ━━━

A JSON array of exactly ${n} structured objects, in the order [5 cotton-candy-cart, 5 funnel-cake-stand, 5 caramel-apple-booth, 5 snow-cone-stand, 5 pretzel-cart, 5 carnival-corn-dog]. No preamble. No numbering. Plain JSON array only.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
