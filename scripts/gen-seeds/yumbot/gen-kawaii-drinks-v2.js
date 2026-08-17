#!/usr/bin/env node
// YumBot kawaii-drinks REWORK (2026-08-16) — Kevin: too minimal/bland; wants more
// FUN, a little STORY per drink, pops of color + detail + set-decoration, and even
// cuter/more adorable. Adds a story MOMENT axis + a cute DECOR axis, and regens the
// scene richer/busier. MVP-25 each.
const { generatePool } = require('../../lib/seedGenHelper');

(async () => {
  // 1) Richer, busier, more decorated SCENE (replaces the old minimal one)
  await generatePool({
    outPath: 'scripts/bots/yumbot/seeds/yumbot_kawaii_drinks_scenes.json',
    total: 120,
    append: true,
    batch: 25,
    metaPrompt: (
      n
    ) => `Write ${n} KAWAII-DRINKS SCENES for YumBot — the LIVELY, colorful setting for a bunch of cute drinks with smiling faces. These must feel FUN and BUSY, never minimal: a delightful little world packed with color, cute props and set-decoration. Each entry 22-34 words: describe the context + all the fun stuff around it (the individual drinks + the story come separately).

━━━ LIVELY DRINK CONTEXTS (spread across all ${n}) ━━━
- A jubilant bubble-tea shop bursting with color: rows of boba cups, tapioca pearls everywhere, hanging paper lanterns, pastel tiled walls, a chalkboard of doodles, potted plants, string lights, heart bunting
- A retro milkshake diner mid-party: checkered floor, chrome stools, balloons, confetti, a jukebox glowing, striped straws in a jar, neon-pastel signage of marks, a slice of cake on the counter
- A tropical smoothie beach bar: paper umbrellas, pineapples, palm leaves, a surfboard, seashells, a rainbow of fruit, bunting, sunny sparkle, a little tiki torch
- A whimsical tea-party picnic: a polka-dot blanket, tiered cake stands, tiny sandwiches, flowers in jars, teacups, macarons, butterflies, dappled sun, gingham napkins
- A birthday-party drinks table: a frosted cake with candles, party hats, streamers, balloons, confetti cannons mid-pop, wrapped gifts, a banner of marks
- A cozy hot-cocoa winter wonderland: knit blankets, a crackling fireplace, fairy lights, a decorated tree, marshmallow piles, candy canes, falling snow through a frosted window
- A carnival drinks stand: a striped awning, spinning prize wheel, festoon lights, popcorn, a Ferris-wheel hint, pennants, cotton candy, a goldfish-bag prize
- A rainbow candy-shop soda fountain: shelves of jarred candy, swirl lollipops, gumball machines, a soda tap, polka-dot floor, pastel rainbow stripes, sprinkles everywhere
- A springtime cherry-blossom cafe: blossom petals drifting, a lace tablecloth, teacups, tiny cakes, a birdcage of flowers, pastel bunting, warm window glow
- A disco drinks party: a mirror ball, colorful dance-floor tiles, sparkles, confetti, glow, a tiny stage, star garlands
- A garden lemonade stand: sunflowers, mason jars, a wooden crate, lemon slices, bees, a checkered cloth, a hand-painted sign of marks, butterflies
- A sweet-shop parfait counter: sundae glasses, whipped-cream swirls, sprinkles raining, cherries, waffle cones, candy garlands, pastel tile

━━━ THE FEEL ━━━
FUN, festive, BUSY and colorful — lots going on, packed with cute set-decoration and pops of color. Every drink here has a smiling kawaii face. Soft, sweet, adorable, jewel-bright or pastel. NO people (drinks are the characters). NO readable text (decorative marks only). NO gritty/photoreal.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  // 2) NEW — the STORY MOMENT (what fun thing is happening)
  await generatePool({
    outPath: 'scripts/bots/yumbot/seeds/yumbot_kawaii_drinks_moment.json',
    total: 120,
    append: true,
    batch: 25,
    metaPrompt: (
      n
    ) => `Write ${n} fun little STORY-MOMENT snippets for YumBot's kawaii-drinks path — a tiny adorable STORY or action the cute drink-characters are caught in, so each render has something happening (not just a drink sitting there). Each 10-20 words. START WITH THE DRINKS + AN ACTIVE, PLAYFUL VERB.

━━━ FUN MOMENTS (spread across all ${n}) ━━━
- two boba teas clinking together in a happy toast, little hearts popping above them
- a milkshake giggling as its cherry bounces off its whipped-cream hair
- a smoothie doing a joyful little jump, splashing a rainbow arc of fruit
- a hot cocoa snuggled under a marshmallow blanket, sleepy and content
- a soda fizzing over with a burst of confetti and sparkles, delighted
- a boba tea lounging in sunglasses on a tiny beach chair
- three tiny teas having a tea party with even tinier cakes
- a lemonade blowing a big bubblegum bubble that's about to pop
- a milkshake and a soda dancing together under a spinning mirror ball
- a matcha latte painting a tiny heart in its own foam, proud
- a drink riding a little parade float, waving a tiny flag
- a boba tea catching its runaway tapioca pearls in a cup, wobbling
- two smoothies sharing one curly straw, blushing
- a cocoa toasting marshmallows over a tiny candle
- a soda cannonballing into a bowl of ice with a happy splash

━━━ RULES ━━━
The drinks are the cute characters (smiling faces, tiny arms). Playful, wholesome, adorable, a little story the eye reads instantly. NO humans. NO text. Keep each a distinct fun moment.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  // 3) NEW — cute DECOR / pops of color (pickN 2-3, all appear)
  await generatePool({
    outPath: 'scripts/bots/yumbot/seeds/yumbot_kawaii_drinks_decor.json',
    total: 120,
    append: true,
    batch: 25,
    metaPrompt: (
      n
    ) => `Write ${n} cute DECOR snippets for YumBot's kawaii-drinks path — small set-decoration + pops of color + detail scattered through the scene to make it lively and delightful. Each 6-14 words. A single decorative element or cluster.

━━━ DECOR ELEMENTS (spread across all ${n}) ━━━
- rainbow confetti and tiny star sprinkles scattered everywhere
- a garland of heart-shaped bunting strung overhead
- little pastel balloons bobbing on curly strings
- swirls of whipped-cream clouds with candy sprinkles raining down
- tiny paper party hats and party-blowers
- floating soap bubbles catching rainbow light
- a scatter of macarons, gummy bears and lollipops
- polka-dot and gingham patterns on everything
- sugar hearts and stars drifting through the air
- a backdrop of soft pastel rainbow stripes
- curly straws, tiny umbrellas and cherry toppings galore
- fairy lights and glowing paper lanterns
- a sprinkle of glitter sparkles and twinkle stars
- pressed flowers and butterfly stickers
- ribbon streamers curling in the air

━━━ RULES ━━━
Cute, colorful, sweet set-dressing. Pops of color and busy delightful detail. NO humans, NO text. Each a distinct decorative element.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
