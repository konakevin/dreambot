#!/usr/bin/env node
/**
 * YumBot food-concert SCENES — per-setting deep pool (2026-06-28).
 *
 * Promoted from food-adventures. Uses the PROVEN food-adventures recipe: each
 * scene BAKES the food cast + their action + a RICHLY-NAMED concert-stage
 * location into one sentence (the location is the headline, not a side detail —
 * that's what forces the environment to render against YumBot's flat-lay prior).
 * Sub-bucketed by STAGE ROLE (one Sonnet call per role) for within-setting variety.
 *
 * MVP: PER_SUB_THEME=2 (~16). Scale: bump to 8 (~64) + re-run (append fills gap).
 *   node scripts/gen-seeds/yumbot/gen-food-concert-scenes.js
 */
const { generateBucketScenes } = require('../../lib/yumbotBucketGen');

const PER_SUB_THEME = parseInt(process.env.PER_SUB_THEME || '2', 10);

const SUB_THEMES = [
  { tag: 'lead-singer', blurb: 'belting into a microphone center-stage under sweeping spotlights, fronting the food band, the glowing stage with speaker stacks and a giant jumbotron, a distant sea of glow-stick lights in the dark far below.', example: '{ "tags": ["lead-singer"], "description": "A kawaii cupcake belts into a glittering microphone center-stage under sweeping spotlights, a pretzel on guitar and a soda can on drums behind, towering speaker stacks and a giant jumbotron framing the glowing stage, a distant sea of tiny glow-stick lights in the dark far below, wide concert shot" }' },
  { tag: 'drummer', blurb: 'drumming behind a glowing drum kit at the back of the stage, sticks flying, the food band up front, speaker stacks and stage lights, a far-off glow-stick glow in the dark below.', example: '{ "tags": ["drummer"], "description": "A kawaii donut drums behind a glowing drum kit at the back of the stage, sticks flying, a strawberry on the mic and a hot dog on bass up front, towering speaker stacks and sweeping spotlights, a distant sea of glow-stick lights in the dark below, low hero-up shot" }' },
  { tag: 'guitarist', blurb: 'shredding an electric guitar at the edge of the stage, leaning back into a spotlight, the lit stage with speaker stacks and a giant jumbotron, a far sea of glow-stick lights below.', example: '{ "tags": ["guitarist"], "description": "A kawaii taco shreds an electric guitar at the front edge of the stage, leaning back into a sweeping spotlight, towering speaker stacks and a giant jumbotron behind, a distant sea of glow-stick lights in the dark far below, three-quarter view" }' },
  { tag: 'DJ', blurb: 'spinning a glowing DJ booth at center stage, hands on the decks, lasers and stage lights sweeping, a jumbotron behind, a far glow-stick sea in the dark below.', example: '{ "tags": ["DJ"], "description": "A kawaii boba tea spins a glowing DJ booth center-stage, hands on the decks, lasers and sweeping stage lights crossing the stage, a giant jumbotron screen glowing behind, a distant sea of glow-stick lights in the dark far below, wide concert shot" }' },
  { tag: 'keyboard', blurb: 'grooving at a glowing synth/keyboard at the side of the stage, swaying to the beat, the food band center-stage, spotlights and speaker stacks, a far glow-stick sea below.', example: '{ "tags": ["keyboard"], "description": "A kawaii macaron grooves at a glowing synth keyboard at the side of the stage, swaying to the beat, a soda can on the mic center-stage, sweeping spotlights and towering speaker stacks, a distant sea of glow-stick lights in the dark below, off-center framing" }' },
  { tag: 'brass', blurb: 'blasting a gleaming trumpet/horn in the stage-front brass section, cheeks puffed, spotlights and confetti raining on the lit stage, a far sea of glow-stick lights below.', example: '{ "tags": ["brass"], "description": "A kawaii french-fry box blasts a gleaming trumpet in the stage-front brass section, cheeks puffed, a croissant on saxophone beside it, sweeping spotlights and confetti over the glowing stage, a distant sea of glow-stick lights in the dark far below, three-quarter view" }' },
];

generateBucketScenes({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_concert_scenes.json',
  perSubTheme: PER_SUB_THEME,
  subThemes: SUB_THEMES,
  buildPrompt: ({ tag, blurb, example }, n) => `You are writing ${n} KAWAII FOOD-ADVENTURE scenes for YumBot's concert-stage path, "${tag}" sub-theme. EVERY entry MUST be tagged ["${tag}"].

━━━ THE ROLE — ${tag} ━━━

Food friends ${blurb}

━━━ WHAT EVERY SCENE MUST HAVE (this is the whole point) ━━━

- One or MORE kawaii FOOD CHARACTERS come to life — each an instantly recognizable food/drink (real shape, color, toppings, texture intact) with a kawaii face + little arms/legs, ACTING OUT the concert. A small band of 2-4 food friends sharing the moment.
- EVERY character must read UNAMBIGUOUSLY as a food or drink — donut, ice-cream cone, popsicle, strawberry, watermelon slice, taco, pizza slice, pretzel, soda can, milk carton, cupcake, french fries, hot dog, boba tea, macaron, cookie, croissant, sushi roll, etc. DO NOT use candy shaped like an animal or creature (NO gummy bears, NO animal crackers, NO bear/bunny-shaped sweets) — Flux renders those as REAL animals, not food. Keep the whole cast clearly food.
- VARY the food heroes across entries — pull widely from desserts, fast food, salty snacks, drinks, fruit. NEVER repeat the same food + role combo.
- A RICH, CONCRETE, FULLY-BUILT CONCERT-STAGE LOCATION welded right into the sentence — name specific stage elements (a glowing concert stage, towering speaker stacks, sweeping spotlights and stage lights, a giant jumbotron screen, overhead lighting rigging, confetti) so the place FILLS the frame. The food BAND on the lit stage is the hero. The audience is ONLY a distant sea of tiny glow-stick lights in the dark far below — NEVER a detailed crowd. The stage environment is the headline, never a blank/pastel/studio void.
- A light composition hint (wide establishing / off-center / low hero-up / three-quarter).

━━━ ENTRY SHAPE — STRUCTURED OBJECT (NON-NEGOTIABLE) ━━━

{ "tags": ["${tag}"], "description": "<the scene, 30-45 words>" }

━━━ EXAMPLE ━━━

${example}

━━━ HARD BANS ━━━

- NO humans, NO human hands or faces — the entire cast is food/drink.
- NO gummy bears or any animal/creature-shaped candy (they render as actual animals) — every character must read clearly as a food or drink.
- Do NOT render a detailed audience. The crowd is ONLY a distant sea of glow-stick lights in the dark far below the stage — NO individual figures, NO faces, NO humans, NO teddy bears, NO animals. The food BAND on the lit stage is the entire focus.
- NO blank / white / plain / studio / flat-pastel background — the concert-stage location must fill the scene.
- NO photo-real tokens. NO lighting / palette / mood words (separate axes handle those).
- NO repeating food + role combos — stretch the range.

━━━ OUTPUT ━━━

A JSON array of structured objects. No preamble. No numbering. Plain JSON array only.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
