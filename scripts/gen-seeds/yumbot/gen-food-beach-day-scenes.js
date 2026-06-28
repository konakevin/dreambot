#!/usr/bin/env node
/**
 * YumBot food-beach-day SCENES — per-setting deep pool (2026-06-28).
 *
 * Promoted from food-adventures. Uses the PROVEN food-adventures recipe: each
 * scene BAKES the food cast + their action + a RICHLY-NAMED beach location into
 * one sentence (the location is the headline, not a side detail — that's what
 * forces the environment to render against YumBot's flat-lay prior). Sub-bucketed
 * by BEACH ACTIVITY (one Sonnet call per activity) for within-setting variety.
 *
 * MVP: PER_SUB_THEME=2 (~16). Scale: bump to 8 (~64) + re-run (append fills gap).
 *   node scripts/gen-seeds/yumbot/gen-food-beach-day-scenes.js
 */
const { generateBucketScenes } = require('../../lib/yumbotBucketGen');

const PER_SUB_THEME = parseInt(process.env.PER_SUB_THEME || '2', 10);

const SUB_THEMES = [
  { tag: 'sandcastle', blurb: 'building a big sandcastle — patting up turrets with a bucket and spade, the wide golden beach and rolling waves behind.', example: '{ "tags": ["sandcastle"], "description": "A kawaii watermelon slice and a pretzel friend pat together a tall sandcastle with a tiny bucket and spade, golden sand stretching to rolling turquoise waves, striped beach umbrellas and a wooden pier behind them, sunny wide beach shot" }' },
  { tag: 'surfing', blurb: 'surfing a curling wave — riding boards across the face of a big breaker, arms out for balance, the beach and pier behind.', example: '{ "tags": ["surfing"], "description": "A kawaii ice-cream cone and a soda-can friend ride surfboards down the face of a big curling turquoise wave, arms out balancing, a wooden pier and palm trees lining the golden beach behind them, dynamic wide shot" }' },
  { tag: 'volleyball', blurb: 'beach volleyball — spiking a ball over a net strung between two palms, sand flying, the shore and waves behind.', example: '{ "tags": ["volleyball"], "description": "A kawaii hot dog and a popcorn-bucket friend leap to spike a beach volleyball over a net strung between two palm trees, golden sand kicking up, striped umbrellas and rolling waves along the shore behind, low hero-up angle" }' },
  { tag: 'inner-tube', blurb: 'floating on inner tubes — drifting and bobbing in the gentle surf, paddling with little arms, the beach and pier behind.', example: '{ "tags": ["inner-tube"], "description": "A kawaii donut and a strawberry friend float on bright inner tubes bobbing in the gentle turquoise surf, paddling with little arms, golden sand, striped umbrellas and a wooden pier lining the shore behind, three-quarter view" }' },
  { tag: 'snorkeling', blurb: 'snorkeling in the clear shallows — masks and snorkels on, peeking over a colorful reef just under the surface, the beach behind.', example: '{ "tags": ["snorkeling"], "description": "A kawaii taco and a boba-tea friend snorkel in the clear turquoise shallows, masks and snorkels on, peeking over a colorful reef just below the surface, the golden beach with palm trees and a pier visible behind, off-center framing" }' },
  { tag: 'wave-chasing', blurb: 'chasing the foamy waves — gleefully fleeing the rushing whitewater up the sand, the wide shore and waves behind.', example: '{ "tags": ["wave-chasing"], "description": "A kawaii cupcake, a cookie, and a juice-box friend dash laughing up the golden sand fleeing a sheet of foamy whitewater, striped umbrellas and a wooden pier behind them, palm trees framing the wide sunny shore, wide establishing shot" }' },
  { tag: 'kite-flying', blurb: 'flying a kite — reeling a bright kite high on the breezy shore, heads tilted up, the beach and waves behind.', example: '{ "tags": ["kite-flying"], "description": "A kawaii macaron and a pretzel friend reel a bright diamond kite high into the breeze on the open shore, heads tilted up, golden sand, striped umbrellas and rolling turquoise waves behind them with circling seagulls overhead, low hero-up angle" }' },
  { tag: 'paddleboarding', blurb: 'paddleboarding across a calm lagoon — standing on boards dipping paddles into the glassy water, the beach and pier behind.', example: '{ "tags": ["paddleboarding"], "description": "A kawaii bunch of grapes and a croissant friend stand on paddleboards dipping their paddles into a glassy turquoise lagoon, golden sand and palm trees along the shore, a wooden pier and beach huts behind them, three-quarter view" }' },
];

generateBucketScenes({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_beach_day_scenes.json',
  perSubTheme: PER_SUB_THEME,
  subThemes: SUB_THEMES,
  buildPrompt: ({ tag, blurb, example }, n) => `You are writing ${n} KAWAII FOOD-ADVENTURE scenes for YumBot's beach path, "${tag}" sub-theme. EVERY entry MUST be tagged ["${tag}"].

━━━ THE ACTIVITY — ${tag} ━━━

Food friends ${blurb}

━━━ WHAT EVERY SCENE MUST HAVE (this is the whole point) ━━━

- One or MORE kawaii FOOD CHARACTERS come to life — each an instantly recognizable food/drink (real shape, color, toppings, texture intact) with a kawaii face + little arms/legs, ACTING OUT the activity. A small band of 2-4 food friends sharing the moment.
- EVERY character must read UNAMBIGUOUSLY as a food or drink — donut, ice-cream cone, popsicle, strawberry, watermelon slice, taco, pizza slice, pretzel, soda can, milk carton, cupcake, french fries, hot dog, boba tea, macaron, cookie, croissant, sushi roll, etc. DO NOT use candy shaped like an animal or creature (NO gummy bears, NO animal crackers, NO bear/bunny-shaped sweets) — Flux renders those as REAL animals, not food. Keep the whole cast clearly food.
- VARY the food heroes across entries — pull widely from desserts, fast food, salty snacks, drinks, fruit. NEVER repeat the same food + activity combo.
- A RICH, CONCRETE, FULLY-BUILT BEACH LOCATION welded right into the sentence — name specific beach elements (golden sand, rolling turquoise waves, striped beach umbrellas, beach huts, a wooden pier, circling seagulls, palm trees, a boardwalk, sandcastles) so the place FILLS the frame. The location is the headline, never a blank/pastel/studio void.
- A light composition hint (wide establishing / off-center / low hero-up / three-quarter).

━━━ ENTRY SHAPE — STRUCTURED OBJECT (NON-NEGOTIABLE) ━━━

{ "tags": ["${tag}"], "description": "<the scene, 30-45 words>" }

━━━ EXAMPLE ━━━

${example}

━━━ HARD BANS ━━━

- NO humans, NO human hands or faces — the entire cast is food/drink.
- NO gummy bears or any animal/creature-shaped candy (they render as actual animals) — every character must read clearly as a food or drink.
- NO blank / white / plain / studio / flat-pastel background — the beach location must fill the scene.
- NO photo-real tokens. NO lighting / palette / mood words (separate axes handle those).
- NO repeating food + activity combos — stretch the range.

━━━ OUTPUT ━━━

A JSON array of structured objects. No preamble. No numbering. Plain JSON array only.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
