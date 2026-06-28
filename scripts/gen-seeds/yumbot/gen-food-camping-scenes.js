#!/usr/bin/env node
/**
 * YumBot food-camping SCENES — per-setting deep pool (2026-06-28).
 *
 * Promoted from food-adventures. Uses the PROVEN food-adventures recipe: each
 * scene BAKES the food cast + their action + a RICHLY-NAMED campsite / woods
 * location into one sentence (the location is the headline, not a side detail —
 * that's what forces the environment to render against YumBot's flat-lay prior).
 * Sub-bucketed by CAMPING ACTIVITY (one Sonnet call per activity) for within-setting variety.
 *
 * MVP: PER_SUB_THEME=2 (~16). Scale: bump to 8 (~64) + re-run (append fills gap).
 *   node scripts/gen-seeds/yumbot/gen-food-camping-scenes.js
 */
const { generateBucketScenes } = require('../../lib/yumbotBucketGen');

const PER_SUB_THEME = parseInt(process.env.PER_SUB_THEME || '2', 10);

const SUB_THEMES = [
  { tag: 'campfire', blurb: 'roasting marshmallows on sticks around the campfire — gathered close, holding sticks out over the flames, the crackling fire ringed with stones and a glowing tent behind.', example: '{ "tags": ["campfire"], "description": "A kawaii taco and a soda can toast marshmallows on sticks over a crackling campfire ringed with stones, a glowing canvas tent and tall dark pines all around under a starry sky, cozy wide campsite shot" }' },
  { tag: 'tent', blurb: 'pitching / raising a tent together — hauling on the poles and lines, the canvas tent rising in a forest clearing, gear scattered around.', example: '{ "tags": ["tent"], "description": "A kawaii donut and a milk-carton friend heave on the poles to raise a glowing canvas tent in a pine clearing, ropes taut, mossy boulders and tall pines ringing the campsite under a starry sky, off-center framing" }' },
  { tag: 'canoe', blurb: 'paddling a canoe across the misty lake — each gripping a paddle mid-stroke, the canoe gliding over still water, pines and dock at the shoreline.', example: '{ "tags": ["canoe"], "description": "A kawaii watermelon slice and a boba-tea friend paddle a wooden canoe across a misty lake, paddles mid-stroke, tall pines and a wooden dock lining the far shore beneath a soft starry sky, wide establishing shot" }' },
  { tag: 'fishing', blurb: 'fishing from the wooden dock — lines cast over the water, leaning out hopefully, the misty lake and forest behind.', example: '{ "tags": ["fishing"], "description": "A kawaii pretzel and a juice-box friend dangle little fishing lines off the end of a weathered wooden dock, leaning out over the misty lake, tall pines and a glowing tent on the shore behind them, three-quarter view" }' },
  { tag: 'hiking', blurb: 'hiking a forest trail with little backpacks — marching single-file up the winding path, gear bouncing, pines and boulders along the way.', example: '{ "tags": ["hiking"], "description": "A kawaii hot dog and two french-fry friends march single-file up a winding forest trail with tiny backpacks, mossy boulders and towering pines flanking the path, a misty lake glinting far below, low hero-up angle" }' },
  { tag: 'stargazing', blurb: 'lying back stargazing on a blanket — sprawled out gazing up, pointing at constellations, the campsite and tent beside them under a huge starry sky.', example: '{ "tags": ["stargazing"], "description": "A kawaii ice-cream cone and a macaron lie back on a checkered blanket gazing up at a vast starry night sky, pointing at the stars, a glowing canvas tent and string lights strung between dark pines beside them, wide overhead-ish shot" }' },
  { tag: 'hammock', blurb: 'lounging together in a strung hammock — piled in and swaying between two trees, totally relaxed, string lights and pines all around.', example: '{ "tags": ["hammock"], "description": "A kawaii cinnamon-roll and a cookie pile together into a hammock slung between two tall pines, swaying happily, warm string lights criss-crossing overhead and a crackling campfire glowing nearby under a starry sky, cozy off-center framing" }' },
  { tag: 'log-bridge', blurb: 'crossing a log bridge over a creek — balancing arms-out along the mossy log, the burbling creek below, deep woods all around.', example: '{ "tags": ["log-bridge"], "description": "A kawaii cupcake and a strawberry friend inch arms-out across a mossy log bridge spanning a burbling forest creek, tall pines and ferns crowding the banks under a misty starry sky, dynamic three-quarter shot" }' },
];

generateBucketScenes({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_camping_scenes.json',
  perSubTheme: PER_SUB_THEME,
  subThemes: SUB_THEMES,
  buildPrompt: ({ tag, blurb, example }, n) => `You are writing ${n} KAWAII FOOD-ADVENTURE scenes for YumBot's camping path, "${tag}" sub-theme. EVERY entry MUST be tagged ["${tag}"].

━━━ THE ACTIVITY — ${tag} ━━━

Food friends ${blurb}

━━━ WHAT EVERY SCENE MUST HAVE (this is the whole point) ━━━

- One or MORE kawaii FOOD CHARACTERS come to life — each an instantly recognizable food/drink (real shape, color, toppings, texture intact) with a kawaii face + little arms/legs, ACTING OUT the activity. A small band of 2-4 food friends sharing the moment.
- EVERY character must read UNAMBIGUOUSLY as a food or drink — donut, ice-cream cone, popsicle, strawberry, watermelon slice, taco, pizza slice, pretzel, soda can, milk carton, cupcake, french fries, hot dog, boba tea, macaron, cookie, croissant, sushi roll, etc. DO NOT use candy shaped like an animal or creature (NO gummy bears, NO animal crackers, NO bear/bunny-shaped sweets) — Flux renders those as REAL animals, not food. Keep the whole cast clearly food.
- VARY the food heroes across entries — pull widely from desserts, fast food, salty snacks, drinks, fruit. NEVER repeat the same food + activity combo.
- A RICH, CONCRETE, FULLY-BUILT CAMPSITE / WOODS LOCATION welded right into the sentence — name specific elements (a glowing canvas tent, a crackling campfire ringed with stones, tall pines, a misty lake, a wooden dock, string lights between trees, a starry night sky, mossy boulders, a winding forest trail) so the place FILLS the frame. The location is the headline, never a blank/pastel/studio void.
- A light composition hint (wide establishing / off-center / low hero-up / three-quarter).

━━━ ENTRY SHAPE — STRUCTURED OBJECT (NON-NEGOTIABLE) ━━━

{ "tags": ["${tag}"], "description": "<the scene, 30-45 words>" }

━━━ EXAMPLE ━━━

${example}

━━━ HARD BANS ━━━

- NO humans, NO human hands or faces — the entire cast is food/drink.
- NO gummy bears or any animal/creature-shaped candy (they render as actual animals) — every character must read clearly as a food or drink.
- NO blank / white / plain / studio / flat-pastel background — the campsite / woods location must fill the scene.
- NO photo-real tokens. NO lighting / palette / mood words (separate axes handle those).
- NO repeating food + activity combos — stretch the range.

━━━ OUTPUT ━━━

A JSON array of structured objects. No preamble. No numbering. Plain JSON array only.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
