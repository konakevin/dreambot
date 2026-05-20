#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/miniature_feast_food_hero.json',
  total: 200,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} KAWAII SMILING-FACE FOOD HEROES for ChibiBot miniature-feast — the centerpiece kawaii food/drink with a literal smiling face on it. bex.ai Pop-Mart aesthetic. Pop-Mart designer-vinyl glossy-pearlescent rendering.

Each entry: 15-25 words. ONE specific kawaii food hero. MUST have a smiling face. NO chibi creatures (those come from another pool).

━━━ EVERY ENTRY MUST INCLUDE ━━━

1. The food/drink item (e.g., boba cup / sundae / pancake stack / mochi tray / cake / taiyaki / cereal bowl / donut / parfait / ice-cream-cone / dumpling / macaron tower / cookie / cupcake)
2. A literal SMILING FACE on it (dimpled-blush cheeks / closed-arc-eyes / tiny printed mouth / sleepy-face / heart-eyes)
3. Visual details (icing color / topping / texture / pastel hue / glossy-pearlescent finish)

━━━ FORMAT ━━━

Examples:
✓ "Giant boba milk-tea cup with a sleepy smiling face, dimpled blush cheeks, closed-arc eyes, glossy pearlescent pastel-pink finish, rainbow boba pearls visible inside"
✓ "Towering rainbow sundae with a chubby smiling face on the soft-serve swirl, blush cheeks, eyes-closed-bliss, glossy pastel sprinkles cascading down"
✓ "Stack of three fluffy pancakes with a sleepy smiling face on the top one, syrup dripping over closed-arc eyes, butter-pat hat"
✓ "Pink cherry-blossom mochi platter with each mochi having a different cute face — winky, blushing, sleeping, surprised, all pearlescent and dusted"
✓ "Hot-chocolate mug with a marshmallow-cloud floating on top, the mug itself smiling with rosy cheeks, hot-cocoa-swirl with star-marshmallows"

━━━ CATEGORY DISTRIBUTION ━━━

- 20% BOBA / MILK-TEA / BEVERAGE (boba cups / matcha lattes / hot-chocolate / smoothies / soda-floats / iced-tea)
- 15% ICE-CREAM / SUNDAE / SOFT-SERVE (sundaes / rainbow soft-serve / ice-cream cones / parfaits)
- 15% PASTRY / CAKE / DONUT (donuts / cupcakes / cake-slices / pancakes / waffles / croissants)
- 10% MOCHI / JAPANESE-SWEETS (mochi platters / dango sticks / taiyaki / dorayaki / strawberry-daifuku)
- 10% CEREAL / OATMEAL BOWL (cereal bowls with rainbow cereal / oatmeal with face-shaped berries)
- 10% MACARON / COOKIE / SMALL-TREAT (macaron towers / smiling cookies / petit-fours / shortbread cutouts)
- 10% PUDDING / JELLY / CUSTARD (panna-cotta / pudding cups / jello molds / fruit-yogurt parfaits)
- 5% SAVORY-KAWAII (steamed-dumpling tray / soup-bowl with smiling face / onigiri with face / mini-pizza)
- 5% MULTI-FOOD-PLATTER (afternoon-tea tower / dessert-platter with multiple smiling treats / picnic-basket spread)

━━━ HARD BANS ━━━

- NO chibi creatures (they belong in another pool)
- NO non-kawaii food (must have a smiling face)
- NO scary / weird / dark food
- NO photorealistic register — must read as Pop-Mart designer-vinyl

━━━ OUTPUT ━━━

JSON array of \${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
