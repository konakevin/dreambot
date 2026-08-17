#!/usr/bin/env node
// YumBot Stage P1 (SHADOW) — kawaii-drinks. Cute drinks with kawaii faces baked
// in: boba, milkshakes, smoothies, cocoa, sodas, lattes. SCENE = the drinks
// setup/context; DRINKS = individual kawaii drinks with face features. MVP-25.
const { generatePool } = require('../../lib/seedGenHelper');

(async () => {
  await generatePool({
    outPath: '/tmp/yumbot_kd_scenes_JUNK.json', // NEUTERED — reworked scenes live in gen-kawaii-drinks-v2.js
    total: 120,
    append: true,
    batch: 25,
    metaPrompt: (
      n
    ) => `You are writing ${n} KAWAII-DRINKS SCENES for YumBot. Each entry sets a cute DRINKS context where 1-3 kawaii drinks (with smiling faces baked into the drink) are the stars. Each entry 20-32 words. Describe the SETTING/context + the drinks' arrangement (the individual drinks are supplied separately).

━━━ DRINK CONTEXTS (spread across all ${n}) ━━━
- Bubble-tea shop counter (rows of boba cups, tapioca pearls, a menu board of marks, pastel tiled wall, cute straws in a jar)
- Retro milkshake diner (tall frosty glasses on a checkered counter, chrome shaker, striped straws, a napkin dispenser)
- Fresh smoothie bar (rainbow smoothie cups, fruit garnishes, a blender, a chalk sign of marks, tropical leaves)
- Cozy hot-cocoa winter nook (steaming mugs, marshmallows, a knit blanket, a frosted window, fairy lights)
- Sunny lemonade / juice stand (mason jars of pastel juice, striped awning, sliced fruit, a pitcher, a little sign)
- Latte-art cafe table (a cappuccino with foam-art, a saucer, a tiny spoon, a croissant, a book, warm window light)
- Soda-fountain parlor (ice-cream floats fizzing, curly straws, a sundae glass, retro tiles, a jukebox hint)
- Matcha tea house (a matcha latte, a whisk and bowl, tatami and cherry-blossom accents, a tea sweet)
- Fruit-tea picnic (iced fruit teas in glass bottles, a picnic blanket, berries, a woven basket, dappled sunlight)
- Tropical-drink beach bar (coconut drinks, paper umbrellas, pastel tiki cups, a slice of pineapple, sea breeze)
- Winter peppermint-cocoa market (candy-cane-striped cocoa, a market stall, snow, string lights, a wooden counter)
- Rainbow soda pop shop (color-graded soda bottles on shelves, a cooler, striped awning, a bottle-cap scatter)

━━━ THE KAWAII IDENTITY ━━━
Every drink has a CUTE SMILING FACE baked into it (dot eyes, rosy cheeks, tiny smile) — the drinks are adorable food-characters. Soft, sweet, jewel-bright or pastel. The setting is inviting and cozy. NO people anywhere — the drinks are the only characters.

━━━ RULES ━━━
NO humans (the drinks are the characters). NO readable text on signs/menus (decorative marks only). NO photoreal / gritty register. Keep each entry a distinct drink context + a specific cute detail.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  await generatePool({
    outPath: 'scripts/bots/yumbot/seeds/yumbot_kawaii_drinks_treats.json',
    total: 120,
    append: true,
    batch: 25,
    metaPrompt: (
      n
    ) => `You are writing ${n} individual KAWAII DRINK snippets for YumBot's kawaii-drinks path — single adorable drinks with cute faces, to be featured in a drinks scene. Each 10-18 words. START WITH THE DRINK + its cute face + a signature detail.

━━━ DRINK TYPES (spread across all ${n}) ━━━
- a boba milk tea with a shy smiling face, tapioca pearls, and a heart-topped straw
- a strawberry milkshake with a whipped-cream swirl "hairdo" and a happy face, a cherry on top
- a rainbow layered smoothie with a giggly face and a paper umbrella
- a hot cocoa with marshmallow cheeks and a cozy sleepy smile
- a fizzy soda float with an ice-cream-scoop hat and a delighted face
- a matcha latte with a leaf foam-art smile and rosy cheeks
- a mango smoothie with a winking face and a pineapple-leaf tuft
- a taro bubble tea in soft purple with a content little face
- a lemonade mason jar with a sunny grin and a lemon-slice bow
- a peppermint cocoa with a candy-cane straw and a happy face
- a coconut drink with a beachy smile and a tiny umbrella
- a rose-milk drink in blush pink with a bashful face and a petal
- an iced caramel latte with a swirl of cream and a cheerful face
- a blueberry soda with a bubbly grin and a curly straw

━━━ RULES ━━━
Each is ONE cute drink-character with a face. Kawaii, sweet, adorable. NO humans. NO text. Keep each a distinct drink + face + signature detail.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
