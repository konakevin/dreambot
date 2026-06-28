#!/usr/bin/env node
/**
 * YumBot food-birthday-party SCENES — per-setting deep pool (2026-06-28).
 *
 * Promoted from food-adventures. Uses the PROVEN food-adventures recipe: each
 * scene BAKES the food cast + their action + a RICHLY-NAMED birthday-party
 * location into one sentence (the location is the headline, not a side detail —
 * that's what forces the environment to render against YumBot's flat-lay prior).
 * Sub-bucketed by PARTY ACTIVITY (one Sonnet call per activity) for within-setting variety.
 *
 * MVP: PER_SUB_THEME=2 (~20). Scale: bump to 8 (~80) + re-run (append fills gap).
 *   node scripts/gen-seeds/yumbot/gen-food-birthday-party-scenes.js
 */
const { generateBucketScenes } = require('../../lib/yumbotBucketGen');

const PER_SUB_THEME = parseInt(process.env.PER_SUB_THEME || '2', 10);

const SUB_THEMES = [
  { tag: 'blow-candles', blurb: 'leaning in to blow out the candles on the birthday cake — cheeks puffed, eyes squeezed shut making a wish, the cheering food friends ringing the decorated table.', example: '{ "tags": ["blow-candles"], "description": "A kawaii donut leans in to blow out the candles on a little birthday cake at a festive table ringed by a cheering soda can, pretzel, and cupcake, balloon arches and a HAPPY BIRTHDAY banner filling the decorated party room, wide shot" }' },
  { tag: 'open-presents', blurb: 'tearing open a gift-wrapped present — ribbon flying, paper shredding, friends leaning in to see what is inside, the stack of wrapped presents beside them.', example: '{ "tags": ["open-presents"], "description": "A kawaii cupcake tears open a gift-wrapped present, ribbon and shredded paper flying, a strawberry and a milk-carton friend leaning in to peek, a stack of wrapped presents and streamers behind them in the decorated party room, off-center framing" }' },
  { tag: 'pinata', blurb: 'swinging a bat at a hanging pinata — mid-swing with a blindfold, candy starting to spill, the party room and friends cheering them on.', example: '{ "tags": ["pinata"], "description": "A kawaii taco swings a bat at a colorful hanging pinata, candy spilling out, a popcorn-bucket and boba-tea friend cheering below balloon arches and a HAPPY BIRTHDAY banner across the festive party room, low hero-up angle" }' },
  { tag: 'musical-chairs', blurb: 'scrambling for seats in musical chairs — diving for the last open chair as the music stops, party hats askew, the ring of chairs in the decorated room.', example: '{ "tags": ["musical-chairs"], "description": "A kawaii hot dog and a pretzel friend scramble for the last open chair in a ring of musical chairs, party hats askew, streamers and a candle-topped birthday cake on a table behind them in the festive party room, three-quarter view" }' },
  { tag: 'pin-the-tail', blurb: 'playing pin-the-tail-on-the-donkey — blindfolded and reaching toward a big poster on the wall, friends giggling and pointing, the decorated party room behind.', example: '{ "tags": ["pin-the-tail"], "description": "A kawaii macaron, blindfolded, reaches a paper tail toward a big donkey poster on the wall while a cookie and a soda-can friend giggle, balloon arches and a HAPPY BIRTHDAY banner filling the festive party room, off-center" }' },
  { tag: 'conga-line', blurb: 'leading a wiggly conga line — a chain of food friends snaking through the party room hands on shoulders, party hats on, balloons and streamers all around.', example: '{ "tags": ["conga-line"], "description": "A kawaii ice-cream cone leads a wiggly conga line of a watermelon slice, a french-fry friend, and a cupcake, hands on shoulders snaking past balloon arches and a candle-topped cake on a decorated table in the festive party room, wide shot" }' },
  { tag: 'party-horns', blurb: 'blowing party horns and tossing confetti — horns unrolled, confetti raining down, faces lit with joy, the decorated party room bursting with celebration.', example: '{ "tags": ["party-horns"], "description": "A kawaii boba cup and a strawberry friend blow unrolled party horns and toss handfuls of confetti, paper raining down past balloon arches and a HAPPY BIRTHDAY banner across the festive decorated party room, low hero-up angle" }' },
  { tag: 'ball-pit', blurb: 'diving into a colorful ball pit — leaping or swimming through a sea of bright plastic balls, friends splashing in, the party room around the pit.', example: '{ "tags": ["ball-pit"], "description": "A kawaii croissant and a soda-can friend dive into a colorful ball pit, bright plastic balls flying everywhere, balloon arches and streamers and a stack of wrapped presents lining the festive party room behind them, dynamic wide shot" }' },
  { tag: 'photo-booth', blurb: 'posing together in a photo-booth frame — squeezed into a decorated photo-booth holding silly props, the party room and balloons framing the moment.', example: '{ "tags": ["photo-booth"], "description": "A kawaii pizza slice, a macaron, and a milk-carton friend squeeze into a decorated photo-booth frame holding silly props, balloon arches and a HAPPY BIRTHDAY banner filling the festive party room behind them, three-quarter view" }' },
  { tag: 'disco-dance', blurb: 'dancing under a spinning disco ball — striking goofy dance moves on a little dance floor, colored light scattering, the decorated party room glowing around them.', example: '{ "tags": ["disco-dance"], "description": "A kawaii cupcake and a pretzel friend bust goofy dance moves under a spinning disco ball, colored light scattering across balloon arches and a HAPPY BIRTHDAY banner in the festive decorated party room, off-center composition" }' },
];

generateBucketScenes({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_birthday_party_scenes.json',
  perSubTheme: PER_SUB_THEME,
  subThemes: SUB_THEMES,
  buildPrompt: ({ tag, blurb, example }, n) => `You are writing ${n} KAWAII FOOD-ADVENTURE scenes for YumBot's birthday-party path, "${tag}" sub-theme. EVERY entry MUST be tagged ["${tag}"].

━━━ THE ACTIVITY — ${tag} ━━━

Food friends ${blurb}

━━━ WHAT EVERY SCENE MUST HAVE (this is the whole point) ━━━

- One or MORE kawaii FOOD CHARACTERS come to life — each an instantly recognizable food/drink (real shape, color, toppings, texture intact) with a kawaii face + little arms/legs, ACTING OUT the activity. A small band of 2-4 food friends sharing the moment.
- EVERY character must read UNAMBIGUOUSLY as a food or drink — donut, ice-cream cone, popsicle, strawberry, watermelon slice, taco, pizza slice, pretzel, soda can, milk carton, cupcake, french fries, hot dog, boba tea, macaron, cookie, croissant, sushi roll, etc. DO NOT use candy shaped like an animal or creature (NO gummy bears, NO animal crackers, NO bear/bunny-shaped sweets) — Flux renders those as REAL animals, not food. Keep the whole cast clearly food. (A birthday cake AS AN OBJECT on the table is fine — but every CHARACTER is a clear food.)
- VARY the food heroes across entries — pull widely from desserts, fast food, salty snacks, drinks, fruit. NEVER repeat the same food + activity combo.
- A RICH, CONCRETE, FULLY-BUILT BIRTHDAY-PARTY LOCATION welded right into the sentence — EVERY scene is set INSIDE a fully-decorated party ROOM that fills the frame with depth: walls covered in balloons, streamers and a HAPPY BIRTHDAY banner strung across the back wall, a long decorated table with a candle-topped cake and stacks of wrapped presents, a patterned floor receding into the room. The decorated ROOM must read as a real built interior. NEVER the food friends floating on a plain/pastel/void background with only scattered confetti — that is the #1 failure to avoid.
- A light composition hint (wide establishing / off-center / low hero-up / three-quarter).

━━━ ENTRY SHAPE — STRUCTURED OBJECT (NON-NEGOTIABLE) ━━━

{ "tags": ["${tag}"], "description": "<the scene, 30-45 words>" }

━━━ EXAMPLE ━━━

${example}

━━━ HARD BANS ━━━

- NO humans, NO human hands or faces — the entire cast is food/drink.
- NO gummy bears or any animal/creature-shaped candy (they render as actual animals) — every character must read clearly as a food or drink.
- NO blank / white / plain / studio / flat-pastel background — the birthday-party location must fill the scene.
- NO photo-real tokens. NO lighting / palette / mood words (separate axes handle those).
- NO repeating food + activity combos — stretch the range.

━━━ OUTPUT ━━━

A JSON array of structured objects. No preamble. No numbering. Plain JSON array only.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
