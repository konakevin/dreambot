#!/usr/bin/env node
/**
 * YumBot food-county-fair SCENES — per-setting deep pool (2026-06-28).
 *
 * Promoted from food-adventures. Uses the PROVEN food-adventures recipe: each
 * scene BAKES the food cast + their action + a RICHLY-NAMED county-fair
 * location into one sentence (the location is the headline, not a side detail —
 * that's what forces the environment to render against YumBot's flat-lay prior).
 * Sub-bucketed by FAIR ATTRACTION (one Sonnet call per game/ride) for within-setting variety.
 *
 * MVP: PER_SUB_THEME=2 (~20). Scale: bump to 8 (~80) + re-run (append fills gap).
 *   node scripts/gen-seeds/yumbot/gen-food-county-fair-scenes.js
 */
const { generateBucketScenes } = require('../../lib/yumbotBucketGen');

const PER_SUB_THEME = parseInt(process.env.PER_SUB_THEME || '2', 10);

const SUB_THEMES = [
  { tag: 'ring-toss', blurb: 'tossing rings at a ring-toss booth — flinging rings toward rows of bottle necks, cheering each other on, the striped booth and fairground midway behind.', example: '{ "tags": ["ring-toss"], "description": "A kawaii corn dog and a lemonade cup lean over a striped ring-toss booth flinging rings onto bottle necks, plush prizes dangling overhead, a Ferris wheel and a red barn rising over the sunny fairground midway behind, low hero-up angle" }' },
  { tag: 'milk-bottle', blurb: 'hurling a ball to knock down a stack of milk bottles at the toss game, arms wound up, the booth and midway behind.', example: '{ "tags": ["milk-bottle"], "description": "A kawaii pretzel and a soda-can friend hurl a ball at a stacked pyramid of milk bottles at a striped fair booth, bottles toppling, plush prizes dangling above and a Ferris wheel and bunting flags strung over the sunny midway behind, three-quarter view" }' },
  { tag: 'high-striker', blurb: 'swinging the mallet at a high-striker bell game — winding up to ring the bell at the top of the tower, the fairground behind.', example: '{ "tags": ["high-striker"], "description": "A kawaii hamburger and a french-fry friend swing a big mallet at a high-striker bell game, the puck rocketing up the tower toward the bell, striped game booths and a carousel filling the sunny fairground midway behind, low hero-up angle" }' },
  { tag: 'balloon-dart', blurb: 'throwing darts at a balloon-pop wall — taking aim at the colorful balloon grid, the booth and midway behind.', example: '{ "tags": ["balloon-dart"], "description": "A kawaii cupcake and a boba-tea friend throw darts at a wall of colorful balloons at a striped fair booth, one balloon bursting, plush prizes dangling overhead and a Ferris wheel and pennant flags over the sunny fairground behind, off-center framing" }' },
  { tag: 'duck-pond-game', blurb: 'plucking a floating duck at the duck-pond game — reaching into the little water trough of bobbing rubber ducks, the booth and midway behind.', example: '{ "tags": ["duck-pond-game"], "description": "A kawaii donut and a popcorn-bucket friend pluck a floating rubber duck from a duck-pond game trough at a striped booth, plush prizes dangling above and a red barn and hay bales beside the sunny fairground midway behind, three-quarter view" }' },
  { tag: 'ferris-wheel', blurb: 'the Ferris wheel — waving from a gondola high over the fairground, the whole midway and red barn spread below.', example: '{ "tags": ["ferris-wheel"], "description": "A kawaii ice-cream cone and a pretzel friend wave from a Ferris-wheel gondola near the top, the full wheel arcing above and the whole sunny fairground with its striped booths and a red barn spread below, off-center composition" }' },
  { tag: 'carousel', blurb: 'riding a painted fair carousel horse — each on a carousel horse waving as the platform turns, the canopy and midway behind.', example: '{ "tags": ["carousel"], "description": "A kawaii macaron, a soda can, and a cookie each ride a painted fair carousel horse, waving as the platform spins, the carousel\'s canopy overhead and striped game booths along the sunny fairground midway behind, off-center framing" }' },
  { tag: 'prize-winning', blurb: 'hauling a giant won plush prize past the booths — lugging an oversized stuffed prize down the midway, beaming, the fairground behind.', example: '{ "tags": ["prize-winning"], "description": "A kawaii hot dog and a watermelon-slice friend haul a giant won plush prize down the sunny fairground midway, beaming, rows of striped game booths with dangling prizes and a Ferris wheel against a blue sky behind, wide establishing shot" }' },
  { tag: 'hayride', blurb: 'riding a straw-filled hayride wagon — bouncing along on a wagon piled with hay, the red barn and fairground behind.', example: '{ "tags": ["hayride"], "description": "A kawaii taco and a juice-box friend ride a straw-filled hayride wagon bouncing along, hay bales stacked around them, a red barn and a Ferris wheel and pennant flags over the sunny fairground behind, three-quarter view" }' },
];

generateBucketScenes({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_county_fair_scenes.json',
  perSubTheme: PER_SUB_THEME,
  subThemes: SUB_THEMES,
  buildPrompt: ({ tag, blurb, example }, n) => `You are writing ${n} KAWAII FOOD-ADVENTURE scenes for YumBot's county fair path, "${tag}" sub-theme. EVERY entry MUST be tagged ["${tag}"].

━━━ THE ATTRACTION — ${tag} ━━━

Food friends ${blurb}

━━━ WHAT EVERY SCENE MUST HAVE (this is the whole point) ━━━

- One or MORE kawaii FOOD CHARACTERS come to life — each an instantly recognizable food/drink (real shape, color, toppings, texture intact) with a kawaii face + little arms/legs, ACTING OUT the attraction. A small band of 2-4 food friends sharing the moment.
- EVERY character must read UNAMBIGUOUSLY as a food or drink — donut, ice-cream cone, popsicle, strawberry, watermelon slice, taco, pizza slice, pretzel, soda can, milk carton, cupcake, french fries, hot dog, boba tea, macaron, cookie, croissant, sushi roll, etc. DO NOT use candy shaped like an animal or creature (NO gummy bears, NO animal crackers, NO bear/bunny-shaped sweets) — Flux renders those as REAL animals, not food. Keep the whole cast clearly food.
- VARY the food heroes across entries — pull widely from desserts, fast food, salty snacks, drinks, fruit. NEVER repeat the same food + attraction combo.
- A RICH, CONCRETE, FULLY-BUILT COUNTY-FAIR LOCATION welded right into the sentence — EVERY scene must show the WIDE sunny fairground filling the frame behind the food friends: a Ferris wheel against a blue sky, LONG ROWS of red-and-white striped game booths receding down a packed midway, plush prizes dangling, bunting and pennant flags strung overhead, a red barn and hay bales. A single booth alone is NOT enough — the whole bustling fair must be visible with deep background. NEVER the food friends on a plain/pastel/void background or floating as a product shot.
- A light composition hint (wide establishing / off-center / low hero-up / three-quarter).

━━━ ENTRY SHAPE — STRUCTURED OBJECT (NON-NEGOTIABLE) ━━━

{ "tags": ["${tag}"], "description": "<the scene, 30-45 words>" }

━━━ EXAMPLE ━━━

${example}

━━━ HARD BANS ━━━

- NO humans, NO human hands or faces — the entire cast is food/drink.
- NO gummy bears or any animal/creature-shaped candy (they render as actual animals) — every character must read clearly as a food or drink.
- NO blank / white / plain / studio / flat-pastel background — the county-fair location must fill the scene.
- NO photo-real tokens. NO lighting / palette / mood words (separate axes handle those).
- NO repeating food + attraction combos — stretch the range.

━━━ OUTPUT ━━━

A JSON array of structured objects. No preamble. No numbering. Plain JSON array only.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
