#!/usr/bin/env node
/**
 * YumBot food-arcade SCENES — per-setting deep pool (2026-06-28).
 *
 * Promoted from food-adventures. Uses the PROVEN food-adventures recipe: each
 * scene BAKES the food cast + their action + a RICHLY-NAMED arcade
 * location into one sentence (the location is the headline, not a side detail —
 * that's what forces the environment to render against YumBot's flat-lay prior).
 * Sub-bucketed by GAME TYPE (one Sonnet call per game) for within-setting variety.
 *
 * MVP: PER_SUB_THEME=2 (~16). Scale: bump to 8 (~64) + re-run (append fills gap).
 *   node scripts/gen-seeds/yumbot/gen-food-arcade-scenes.js
 */
const { generateBucketScenes } = require('../../lib/yumbotBucketGen');

const PER_SUB_THEME = parseInt(process.env.PER_SUB_THEME || '2', 10);

const SUB_THEMES = [
  { tag: 'claw-machine', blurb: 'working a glowing claw-machine joystick over a pile of plush prizes, eyes locked in fierce concentration as the claw lowers.', example: '{ "tags": ["claw-machine"], "description": "A kawaii hot dog grips a glowing claw-machine joystick in fierce concentration while a soda can cheers, rows of neon arcade cabinets and a prize counter piled with plushies packed all around them, off-center wide shot" }' },
  { tag: 'racing-cabinet', blurb: 'gripping the wheel of a sit-down racing-cabinet, leaning into a turn as the screen glows with a speeding track.', example: '{ "tags": ["racing-cabinet"], "description": "A kawaii french-fry box grips the wheel of a sit-down racing-cabinet leaning hard into a turn while a donut friend leans in, the screen blazing with a glowing track and rows of neon arcade cabinets crowding behind, three-quarter view" }' },
  { tag: 'air-hockey', blurb: 'smacking the puck across a glowing air-hockey table, paddle raised mid-defense, the table lights blazing.', example: '{ "tags": ["air-hockey"], "description": "A kawaii taco and a boba-tea friend smack the puck across a glowing air-hockey table, paddles raised, the table edges blazing with light and a wall of flashing arcade cabinets behind them, off-center framing" }' },
  { tag: 'skee-ball', blurb: 'rolling a skee-ball up the ramp toward the rings as the scoreboard lights up, ticket stubs already spilling out.', example: '{ "tags": ["skee-ball"], "description": "A kawaii donut winds up to roll a skee-ball up the ramp as the score rings light up and a popcorn-bucket friend cheers, tickets spilling from the machine and neon arcade cabinets glowing all around, low hero-up angle" }' },
  { tag: 'dance-pad', blurb: 'stomping the arrows on a neon dance-pad game, mid-stomp with arms flung out as the screen flashes the next move.', example: '{ "tags": ["dance-pad"], "description": "A kawaii pretzel stomps the glowing arrows of a neon dance-pad game, arms flung wide mid-stomp, while a soda-can friend dances beside it, the flashing arrow screen and rows of arcade cabinets lighting up behind, dynamic wide shot" }' },
  { tag: 'pinball', blurb: 'flipping the flippers of a flashing pinball machine, leaning over the glass as the playfield lights blaze.', example: '{ "tags": ["pinball"], "description": "A kawaii cupcake leans over a flashing pinball machine working the flippers while a macaron friend watches the ball, the glowing playfield and a marquee of lit arcade cabinets filling the room behind, three-quarter view" }' },
  { tag: 'ticket-counter', blurb: 'hauling a teetering tower of won tickets to the prize counter piled high with plush prizes.', example: '{ "tags": ["ticket-counter"], "description": "A kawaii ice-cream cone and a cookie friend haul a teetering tower of won tickets toward a glowing prize counter piled high with plush prizes, neon arcade cabinets and marquee lights blazing all around, wide establishing shot" }' },
  { tag: 'basketball-game', blurb: 'shooting at the arcade basketball-hoop game, a ball mid-arc toward the net as the timer counts down.', example: '{ "tags": ["basketball-game"], "description": "A kawaii pizza slice shoots a ball mid-arc at the arcade basketball-hoop game while a juice-box friend grabs another ball, the glowing backboard and rows of flashing arcade cabinets packed behind them, low hero-up shot" }' },
];

generateBucketScenes({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_arcade_scenes.json',
  perSubTheme: PER_SUB_THEME,
  subThemes: SUB_THEMES,
  buildPrompt: ({ tag, blurb, example }, n) => `You are writing ${n} KAWAII FOOD-ADVENTURE scenes for YumBot's arcade path, "${tag}" sub-theme. EVERY entry MUST be tagged ["${tag}"].

━━━ THE GAME — ${tag} ━━━

Food friends ${blurb}

━━━ WHAT EVERY SCENE MUST HAVE (this is the whole point) ━━━

- One or MORE kawaii FOOD CHARACTERS come to life — each an instantly recognizable food/drink (real shape, color, toppings, texture intact) with a kawaii face + little arms/legs, ACTING OUT the game. A small band of 2-4 food friends sharing the moment.
- EVERY character must read UNAMBIGUOUSLY as a food or drink — donut, ice-cream cone, popsicle, strawberry, watermelon slice, taco, pizza slice, pretzel, soda can, milk carton, cupcake, french fries, hot dog, boba tea, macaron, cookie, croissant, sushi roll, etc. DO NOT use candy shaped like an animal or creature (NO gummy bears, NO animal crackers, NO bear/bunny-shaped sweets) — Flux renders those as REAL animals, not food. Keep the whole cast clearly food.
- VARY the food heroes across entries — pull widely from desserts, fast food, salty snacks, drinks, fruit. NEVER repeat the same food + game combo.
- A RICH, CONCRETE, FULLY-BUILT ARCADE LOCATION welded right into the sentence — name specific arcade elements (rows of neon arcade cabinets, flashing game screens, a ticket-prize counter piled high with plush prizes, glowing token machines, ticket-streamers and marquee lights, a glowing patterned arcade carpet) so the place FILLS the frame. The location is the headline, never a blank/pastel/studio void.
- A light composition hint (wide establishing / off-center / low hero-up / three-quarter).

━━━ ENTRY SHAPE — STRUCTURED OBJECT (NON-NEGOTIABLE) ━━━

{ "tags": ["${tag}"], "description": "<the scene, 30-45 words>" }

━━━ EXAMPLE ━━━

${example}

━━━ HARD BANS ━━━

- NO humans, NO human hands or faces — the entire cast is food/drink.
- NO gummy bears or any animal/creature-shaped candy (they render as actual animals) — every character must read clearly as a food or drink.
- NO blank / white / plain / studio / flat-pastel background — the arcade location must fill the scene.
- NO photo-real tokens. NO lighting / palette / mood words (separate axes handle those).
- NO repeating food + game combos — stretch the range.

━━━ OUTPUT ━━━

A JSON array of structured objects. No preamble. No numbering. Plain JSON array only.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
