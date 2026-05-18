#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/cute_food_scenes.json',
  total: 200,
  batch: 10,
  append: true,
  metaPrompt: (n) => `You are writing ${n} CUTE-FOOD scene descriptions for ChibiBot's new cute-food path. The aesthetic is hard-locked to the Instagram account @bex.ai — 3D-rendered kawaii pastel pop-mart-style food/drink scenes where the food ITSELF has a smiling face.

Each entry: 20-35 words. ONE specific kawaii food/drink scene with the hero food/drink centered as the cast.

━━━ THE NON-NEGOTIABLE AESTHETIC (every entry must hit this) ━━━

1. **HERO FOOD/DRINK WITH A SMILING FACE** — the centerpiece food or drink ITEM has a cute smiling face on it (blushed cheeks, closed-arc eyes, tiny mouth). The food IS the character. NEVER a person eating food. The cup/bowl/cake/donut has the face directly on it.

2. **GLOSSY 3D-RENDERED PEARLESCENT FINISH** — Pop-Mart designer-vinyl rendering, pearlescent glossy surfaces, soft-pastel palette (blush pink, lavender, mint, peach, cream, baby-blue). NEVER photoreal, NEVER illustrated, NEVER anime.

3. **SCATTERED TINY DECORATIONS** — every scene has tiny smiling fruit / stars / hearts / sprinkles / candies / beads / pearls / macarons / mini cupcakes scattered around the hero food. Some decorations have tiny faces too (mini fruit, mini stars). NEVER an empty surface around the hero.

4. **CHERRY-BLOSSOM OR PASTEL FLORAL accents** — most scenes have cherry-blossom branches OR pastel flowers (pink, lavender, soft yellow) as backdrop or scattered around.

5. **RAINBOW MOTIF** — many scenes have a literal rainbow pouring out of the food/drink (rainbow soft-serve, rainbow cereal pouring out, rainbow milkshake), OR a rainbow arc in the background.

6. **NO HUMAN CHARACTERS** — no people, no minifigs, no creatures eating the food. Food is the entire cast. Sometimes a single kawaii creature (tiny squirrel, bunny, bird) may sit next to it as an accent, but the food is dominant.

━━━ SETTING MIX (70/30) ━━━

70% **TABLETOP CLOSE-UP** — hero food/drink on a pastel checkerboard / wood / picnic-cloth surface, soft pastel-blurred background, scattered decorations around base, cherry-blossom branch arching from corner. Matches the bex.ai reference pics directly.

30% **CUTE SETTING** — same hero kawaii food but placed in a wider cute setting: picnic meadow with daisies, cafe windowsill with rain outside, garden table with cherry blossom, beach picnic blanket, magical fairy-tale grove, tea-time table with macaron tower. Setting is soft pastel, never realistic.

━━━ FOOD/DRINK CATEGORIES (rotate evenly across all categories) ━━━

A. SWEET DRINKS — boba bubble tea (pearls visible at bottom), milkshakes, smoothies, frappes, iced lattes, iced lemonade, fruity drinks
B. HOT DRINKS — cocoa with marshmallow-faces floating, latte-art coffee, matcha lattes, tea sets with teapot+cup, golden milk
C. FROZEN DESSERTS — ice cream sundaes piled high, parfaits in tall glasses, soft-serve cones (rainbow swirl), popsicles, snow cones, gelato scoops
D. CUPCAKES + MACARONS — cupcake with frosting peak + face, macaron stacks, donuts with sprinkles, cake-pop bouquets
E. CAKE + PASTRY — small cake slices, mini cake towers, eclairs, croissants, cinnamon rolls
F. BOWLS — rainbow cereal pouring out, smoothie bowls with fruit toppings, acai bowls, oatmeal with star fruits
G. PANCAKES + WAFFLES — stack with syrup pouring, mini waffle bites with whipped cream, French toast slices
H. ASIAN SWEETS — taiyaki fish-cakes, dango skewers, mochi balls in row, dorayaki pancakes, bubble tea variations
I. SAVORY-CUTE — kawaii sushi rolls, rice balls (onigiri), ramen bowls with smiling egg, mini bento boxes, dumplings in steam basket
J. CANDY + SNACKS — cotton candy clouds, caramel apples, candy buffets, lollipop bouquets, gummies

━━━ MANDATORY VOCABULARY (sprinkle through every entry) ━━━

Pastel-pearlescent / glossy-glazed / pop-mart-style / kawaii / dimpled-cheek-blush / closed-arc-eyes / tiny-printed-mouth / smiling-fruit / mini-stars / rainbow-sprinkles / sugar-pearls / scattered-confetti / cherry-blossom-petals / pastel-checkerboard / soft-blur-bokeh / dreamy-pastel.

━━━ HARD BANS ━━━

🚫 NO humans / people / minifigs / dolls in the frame
🚫 NO photoreal rendering — must be 3D pop-mart-style stylized
🚫 NO dark / spooky / edgy moods
🚫 NO single-color rendering — always pastel-rainbow palette
🚫 NO empty surfaces around the hero — always decorations scattered
🚫 NO realistic food textures — always glossy-glazed pearlescent
🚫 NO violence / chaos / disorder

━━━ EXAMPLE ENTRIES (match this format) ━━━

A. "Kawaii boba bubble tea cup with smiling blushed face, rainbow pearls visible at bottom, candy-striped straw, surrounded by tiny smiling fruit (lemons, strawberries, peaches) and sugar-stars on a pastel-pink checkerboard table, cherry-blossom branch arching above"

C. "Glossy 3D-rendered ice cream sundae with three rainbow soft-serve swirls each wearing a tiny smiling face, drizzled with caramel and rainbow sprinkles, surrounded by scattered macarons and cherry-blossom petals on a baby-blue pastel surface"

F. "Pastel cereal bowl with smiling face on the side, rainbow cereal pieces pouring out in a literal arc, scattered tiny smiling fruit at the base, soft cherry-blossom branch in background, picnic meadow soft-blur backdrop"

H. "Three taiyaki fish-cakes lined up on a wooden tray, each fish-cake with a smiling sleepy face, golden-brown glaze with strawberry-jam tail-fins, scattered cherry-blossom petals around them, pastel-pink soft-blur backdrop"

Output ${n} entries as a numbered list. Each entry on its own line, 20-35 words. Distribute across all 10 food categories (A-J). 70/30 mix tabletop / wider-setting. EVERY entry has hero food/drink with smiling face + scattered tiny decorations + pastel rainbow palette.`,
});
