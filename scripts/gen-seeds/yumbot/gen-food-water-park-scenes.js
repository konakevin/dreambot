#!/usr/bin/env node
/**
 * YumBot food-water-park SCENES — per-setting deep pool (2026-06-28).
 *
 * Promoted from food-adventures. Uses the PROVEN food-adventures recipe: each
 * scene BAKES the food cast + their action + a RICHLY-NAMED water-park
 * location into one sentence (the location is the headline, not a side detail —
 * that's what forces the environment to render against YumBot's flat-lay prior).
 * Sub-bucketed by SLIDE/ATTRACTION TYPE (one Sonnet call per attraction) for within-setting variety.
 *
 * MVP: PER_SUB_THEME=2 (~16). Scale: bump to 8 (~64) + re-run (append fills gap).
 *   node scripts/gen-seeds/yumbot/gen-food-water-park-scenes.js
 */
const { generateBucketScenes } = require('../../lib/yumbotBucketGen');

const PER_SUB_THEME = parseInt(process.env.PER_SUB_THEME || '2', 10);

const SUB_THEMES = [
  { tag: 'water-slide', blurb: 'riding a tube down a tall twisting water slide — the tube whooshing through the curving blue chute, water spraying, the towering slide complex and splash pools behind.', example: '{ "tags": ["water-slide"], "description": "A kawaii ice-cream cone and a strawberry friend ride a rubber tube down a tall twisting blue water slide, water spraying, the towering slide complex and palm-lined splash pools filling the water park behind, dynamic wide shot" }' },
  { tag: 'wave-pool', blurb: 'bobbing and riding the swells of a big wave pool — floating up over the rolling waves on tubes, the wave-pool basin and slide towers ringing the park behind.', example: '{ "tags": ["wave-pool"], "description": "A kawaii donut and a soda-can friend bob over the rolling swells of a big blue wave pool on inner tubes, splashing with glee, slide towers and palm trees ringing the busy water park behind, off-center framing" }' },
  { tag: 'lazy-river', blurb: 'drifting lazily on tubes down a winding lazy river — floating past splash pads and palms, the gentle current curving through the whole park.', example: '{ "tags": ["lazy-river"], "description": "A kawaii watermelon slice and a boba-tea friend drift on inner tubes down a winding lazy river, totally relaxed, splash pads and palm trees lining the gentle blue current curving through the water park, three-quarter view" }' },
  { tag: 'splash-pad', blurb: 'dancing and splashing through the arching jets of a splash pad — leaping under the water arches, the splash-pad plaza and slide towers behind.', example: '{ "tags": ["splash-pad"], "description": "A kawaii taco and a pretzel friend dance through the arching jets of a colorful splash pad, water spraying everywhere, the splash-pad plaza and towering water slides filling the sunny water park behind, low hero-up angle" }' },
  { tag: 'diving-board', blurb: 'leaping off the high diving board into a sparkling splash pool — mid-air cannonball over the deep blue pool, the diving platform and park behind.', example: '{ "tags": ["diving-board"], "description": "A kawaii popsicle and a cupcake friend leap off the high diving board into a sparkling splash pool, mid-air with arms thrown up, the tall diving platform and palm-lined pool decks filling the water park behind, low hero-up shot" }' },
  { tag: 'speed-slide', blurb: 'rocketing straight down a steep speed slide — bodies streaking down the near-vertical chute, water spraying, the towering slide and splash-down lane behind.', example: '{ "tags": ["speed-slide"], "description": "A kawaii hot dog and a juice-box friend rocket straight down a steep blue speed slide, water streaking past, the towering slide tower and splash-down lane filling the bustling water park behind, dynamic wide shot" }' },
  { tag: 'tube-slide', blurb: 'riding a big rubber tube down an enclosed flume slide — whooshing through the dark twisting tube, water spraying out the mouth, the slide tower and pools behind.', example: '{ "tags": ["tube-slide"], "description": "A kawaii macaron and a cookie friend ride a big rubber tube down an enclosed flume slide, water spraying out the tunnel mouth, the towering slide complex and blue splash pools filling the water park behind, off-center composition" }' },
  { tag: 'splashdown-pool', blurb: 'cannonballing into the splash-down pool at the base of a big slide — huge splash erupting as they hit the water, the slide flume and park behind.', example: '{ "tags": ["splashdown-pool"], "description": "A kawaii french-fries box and a soda-can friend cannonball into the splash-down pool at the base of a towering water slide, a huge splash erupting around them, the slide flume and palm-lined pool decks filling the water park behind, dynamic wide shot" }' },
];

generateBucketScenes({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_water_park_scenes.json',
  perSubTheme: PER_SUB_THEME,
  subThemes: SUB_THEMES,
  buildPrompt: ({ tag, blurb, example }, n) => `You are writing ${n} KAWAII FOOD-ADVENTURE scenes for YumBot's water park path, "${tag}" sub-theme. EVERY entry MUST be tagged ["${tag}"].

━━━ THE ATTRACTION — ${tag} ━━━

Food friends ${blurb}

━━━ WHAT EVERY SCENE MUST HAVE (this is the whole point) ━━━

- One or MORE kawaii FOOD CHARACTERS come to life — each an instantly recognizable food/drink (real shape, color, toppings, texture intact) with a kawaii face + little arms/legs, ACTING OUT the ride. A small band of 2-4 food friends sharing the moment.
- EVERY character must read UNAMBIGUOUSLY as a food or drink — donut, ice-cream cone, popsicle, strawberry, watermelon slice, taco, pizza slice, pretzel, soda can, milk carton, cupcake, french fries, hot dog, boba tea, macaron, cookie, croissant, sushi roll, etc. DO NOT use candy shaped like an animal or creature (NO gummy bears, NO animal crackers, NO bear/bunny-shaped sweets) — Flux renders those as REAL animals, not food. Keep the whole cast clearly food.
- VARY the food heroes across entries — pull widely from desserts, fast food, salty snacks, drinks, fruit. NEVER repeat the same food + ride combo.
- A RICH, CONCRETE, FULLY-BUILT WATER PARK LOCATION welded right into the sentence — name specific water-park elements (tall twisting water slides, slide towers, a wave pool, a lazy river, a splash pad, splash-down pools, lifeguard towers, palm trees, blue water everywhere, water spraying) so the place FILLS the frame. The location is the headline, never a blank/pastel/studio void.
- A light composition hint (wide establishing / off-center / low hero-up / three-quarter).

━━━ ENTRY SHAPE — STRUCTURED OBJECT (NON-NEGOTIABLE) ━━━

{ "tags": ["${tag}"], "description": "<the scene, 30-45 words>" }

━━━ EXAMPLE ━━━

${example}

━━━ HARD BANS ━━━

- NO humans, NO human hands or faces — the entire cast is food/drink.
- NO gummy bears or any animal/creature-shaped candy (they render as actual animals) — every character must read clearly as a food or drink.
- NO blank / white / plain / studio / flat-pastel background — the water park location must fill the scene.
- NO photo-real tokens. NO lighting / palette / mood words (separate axes handle those).
- NO repeating food + ride combos — stretch the range.

━━━ OUTPUT ━━━

A JSON array of structured objects. No preamble. No numbering. Plain JSON array only.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
