#!/usr/bin/env node
/**
 * YumBot food-amusement-park SCENES — per-setting deep pool (2026-06-28).
 *
 * Promoted from food-adventures. Uses the PROVEN food-adventures recipe: each
 * scene BAKES the food cast + their action + a RICHLY-NAMED amusement-park
 * location into one sentence (the location is the headline, not a side detail —
 * that's what forces the environment to render against YumBot's flat-lay prior).
 * Sub-bucketed by RIDE TYPE (one Sonnet call per ride) for within-setting variety.
 *
 * MVP: PER_SUB_THEME=2 (~20). Scale: bump to 8 (~80) + re-run (append fills gap).
 *   node scripts/gen-seeds/yumbot/gen-food-amusement-park-scenes.js
 */
const { generateBucketScenes } = require('../../lib/yumbotBucketGen');

const PER_SUB_THEME = parseInt(process.env.PER_SUB_THEME || '2', 10);

const SUB_THEMES = [
  { tag: 'roller-coaster', blurb: 'riding a candy-colored roller coaster — front car cresting a loop, arms up screaming with joy, the coaster track and the whole park sprawling behind.', example: '{ "tags": ["roller-coaster"], "description": "A kawaii hamburger and two french-fry friends ride the front car of a candy-colored roller coaster cresting a loop, arms thrown up, the looping track and a towering Ferris wheel sprawling across the bustling park behind, wide establishing shot" }' },
  { tag: 'carousel', blurb: 'riding a painted carousel — each on a carousel horse, waving to one another as the platform turns, the canopy and midway behind.', example: '{ "tags": ["carousel"], "description": "A kawaii donut, a soda can, and a macaron each ride a painted carousel horse, waving as the platform spins, the carousel\'s striped canopy overhead and game booths along the sunny midway behind, off-center framing" }' },
  { tag: 'teacups', blurb: 'riding the giant TEACUP-RIDE ATTRACTION at the park — several oversized spinning cups on a big rotating platform, gripping the center wheel and laughing, the whole teacup ride surrounded by park rides and game booths (this is a fairground RIDE, never a single ordinary teacup on a table).', example: '{ "tags": ["teacups"], "description": "A kawaii cupcake and a boba-tea friend spin in one of several giant cups of the rotating teacup-RIDE attraction, gripping the center wheel and laughing, the big teacup ride platform ringed by striped game booths and a towering Ferris wheel across the fairground, low hero-up angle" }' },
  { tag: 'bumper-cars', blurb: 'bumper cars — gleefully crashing into each other in the neon bumper-car arena, sparks of fun, the arena and park behind.', example: '{ "tags": ["bumper-cars"], "description": "A kawaii hot dog and a popcorn-bucket friend crash their bumper cars together in a neon-lit bumper-car arena, laughing, overhead lights and a packed amusement park glowing beyond the rink, three-quarter view" }' },
  { tag: 'drop-tower', blurb: 'a drop tower — clinging to the car at the very top as the park shrinks far below, screaming with thrilled joy.', example: '{ "tags": ["drop-tower"], "description": "A kawaii watermelon slice and a juice-box friend cling to a drop-tower car at the very peak, faces wide with thrill, the entire amusement park with its coaster and midway shrinking far below them, low hero-up shot" }' },
  { tag: 'log-flume', blurb: 'a log flume — plunging down the watery chute with a huge splash, the wooden flume track curving through the park.', example: '{ "tags": ["log-flume"], "description": "A kawaii boba cup and a strawberry friend plunge down a log-flume chute on a wooden boat, water erupting around them, the curving flume track and a lush park landscape with rides behind, dynamic wide shot" }' },
  { tag: 'ferris-wheel', blurb: 'the Ferris wheel — waving from a gondola at the top, the whole glittering park spread far below.', example: '{ "tags": ["ferris-wheel"], "description": "A kawaii ice-cream cone and a pretzel friend wave from a Ferris-wheel gondola near the very top, the full glittering wheel arcing above and the whole sprawling amusement park spread far below, off-center composition" }' },
  { tag: 'swing-ride', blurb: 'a swing-chair carousel — flying outward on swing chairs, the chains splayed wide, the swing tower and park behind.', example: '{ "tags": ["swing-ride"], "description": "A kawaii macaron, a soda can, and a cookie fly outward on a swing-chair carousel, chains splayed wide, the tall spinning swing tower and a busy midway of striped booths filling the park behind, low hero-up angle" }' },
  { tag: 'haunted-ride', blurb: 'a haunted dark-ride — zooming through a spooky-but-cute tunnel on a ride cart, glowing friendly ghost decorations, the lit park entrance at the tunnel mouth.', example: '{ "tags": ["haunted-ride"], "description": "A kawaii taco and a ramen-bowl friend zoom through a cute haunted dark-ride tunnel on a little cart, eyes wide with delight, friendly glowing pastel ghosts whooshing past and the lit park entrance visible at the tunnel mouth, off-center" }' },
  { tag: 'sky-gondola', blurb: 'a sky gondola / cable car — gliding high above the park, faces pressed to the glass, rides and Ferris wheel drifting below.', example: '{ "tags": ["sky-gondola"], "description": "A kawaii bunch of grapes and a cinnamon-roll friend glide high above the park in a sky-gondola cable car, faces pressed to the glass, the Ferris wheel and roller-coaster loops drifting far below them, three-quarter view" }' },
];

generateBucketScenes({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_amusement_park_scenes.json',
  perSubTheme: PER_SUB_THEME,
  subThemes: SUB_THEMES,
  buildPrompt: ({ tag, blurb, example }, n) => `You are writing ${n} KAWAII FOOD-ADVENTURE scenes for YumBot's amusement-park path, "${tag}" sub-theme. EVERY entry MUST be tagged ["${tag}"].

━━━ THE RIDE — ${tag} ━━━

Food friends ${blurb}

━━━ WHAT EVERY SCENE MUST HAVE (this is the whole point) ━━━

- One or MORE kawaii FOOD CHARACTERS come to life — each an instantly recognizable food/drink (real shape, color, toppings, texture intact) with a kawaii face + little arms/legs, ACTING OUT the ride. A small band of 2-4 food friends sharing the moment.
- EVERY character must read UNAMBIGUOUSLY as a food or drink — donut, ice-cream cone, popsicle, strawberry, watermelon slice, taco, pizza slice, pretzel, soda can, milk carton, cupcake, french fries, hot dog, boba tea, macaron, cookie, croissant, sushi roll, etc. DO NOT use candy shaped like an animal or creature (NO gummy bears, NO animal crackers, NO bear/bunny-shaped sweets) — Flux renders those as REAL animals, not food. Keep the whole cast clearly food.
- VARY the food heroes across entries — pull widely from desserts, fast food, salty snacks, drinks, fruit. NEVER repeat the same food + ride combo.
- A RICH, CONCRETE, FULLY-BUILT AMUSEMENT-PARK LOCATION welded right into the sentence — name specific park elements (coaster track, towering Ferris wheel, striped game booths, carousel, midway, ticket gates, neon ride-lights, packed fairground) so the place FILLS the frame. The location is the headline, never a blank/pastel/studio void.
- A light composition hint (wide establishing / off-center / low hero-up / three-quarter).

━━━ ENTRY SHAPE — STRUCTURED OBJECT (NON-NEGOTIABLE) ━━━

{ "tags": ["${tag}"], "description": "<the scene, 30-45 words>" }

━━━ EXAMPLE ━━━

${example}

━━━ HARD BANS ━━━

- NO humans, NO human hands or faces — the entire cast is food/drink.
- NO gummy bears or any animal/creature-shaped candy (they render as actual animals) — every character must read clearly as a food or drink.
- NO blank / white / plain / studio / flat-pastel background — the amusement-park location must fill the scene.
- NO photo-real tokens. NO lighting / palette / mood words (separate axes handle those).
- NO repeating food + ride combos — stretch the range.

━━━ OUTPUT ━━━

A JSON array of structured objects. No preamble. No numbering. Plain JSON array only.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
