#!/usr/bin/env node
/**
 * YumBot food-OUTINGS SCENES — the catch-all multi-setting pool (2026-06-28).
 *
 * STORYTELLING path: kawaii FOOD CHARACTERS come to life and out doing fun
 * activities in real-world locations. This is the CATCH-ALL for the new
 * food-outing family — it covers the 12 leftover "out in the world" settings
 * that don't have their own dedicated path. One Sonnet call per location
 * sub-theme (equal-share rule, feedback_production_seed_equal_share_per_subtheme).
 *
 * Custom prompt (NOT buildYumBotSubThemePrompt, which is biased to the close-up
 * "kawaii face" register). Recipe: food-come-to-life + recognizable food + the
 * food IS the character (no head-on-a-doll, no morphology dictation) + activity
 * + RICH real-world location filling the frame (never blank/studio) + multiple
 * food-friend co-heroes. Run: node scripts/gen-seeds/yumbot/gen-food-outings-scenes.js
 */
const { generateBucketScenes } = require('../../lib/yumbotBucketGen');

const SUB_THEMES = [
  { tag: 'mall-shopping', blurb: 'Food characters out shopping at a bright mall — carrying shopping bags, riding escalators, window-shopping, hanging at the food court, trying on hats.', example: '{ "tags": ["mall-shopping"], "description": "A kawaii donut struts through a bright multi-level mall swinging little shopping bags, a boba-tea friend window-shopping at a glowing storefront, glass railings and escalators behind, off-center wide shot" }' },
  { tag: 'zoo-trip', blurb: 'Food characters visiting a zoo — pointing at habitats, riding the safari tram, feeding animals, exploring the reptile house, holding a map.', example: '{ "tags": ["zoo-trip"], "description": "A kawaii strawberry points excitedly with a tiny zoo map while a juice-box friend snaps a photo, leafy animal habitats and balloon stands lining the sunny path, other food visitors strolling, wide shot" }' },
  { tag: 'snow-day', blurb: 'Food characters in the snow — skiing, snowboarding, sledding down a hill, building a snowman, snowball fight, ice skating.', example: '{ "tags": ["snow-day"], "description": "A kawaii pancake-stack carves down a snowy slope on tiny skis with a scarf streaming, a marshmallow friend tumbling in the powder behind, a chairlift and frosted pines on the mountain, dynamic wide shot" }' },
  { tag: 'skatepark', blurb: 'Food characters at a skatepark — skateboarding off ramps, scootering, BMX, rollerblading, grinding rails, filming tricks.', example: '{ "tags": ["skatepark"], "description": "A kawaii cookie ollies a skateboard off a ramp with arms out for balance while a soda-can friend films on a tiny phone, curved concrete ramps and graffiti murals all around, low hero-up wide shot" }' },
  { tag: 'pool-party', blurb: 'Food characters at a backyard pool party — cannonballs, flamingo floaties, diving board, water guns, poolside snack table.', example: '{ "tags": ["pool-party"], "description": "A kawaii pineapple launches a cannonball into a backyard pool as a pizza-slice friend lounges on a flamingo float, a snack table piled with chip bags and soda cans poolside, sunny wide party shot" }' },
  { tag: 'park-playground', blurb: 'Food characters at a park — playground swings and slides, frisbee, flying a kite, soccer, feeding ducks at the pond, riding bikes.', example: '{ "tags": ["park-playground"], "description": "A kawaii orange kicks a soccer ball mid-stride across a sunny park while a pretzel friend dives to play goalie, a kite flying overhead and a picnic blanket nearby, leafy trees behind, wide action shot" }' },
  { tag: 'movie-theater', blurb: 'Food characters at the movies — settling into plush seats with 3D glasses, sharing popcorn, the ticket booth, the glowing screen, the lobby.', example: '{ "tags": ["movie-theater"], "description": "A kawaii popcorn-bucket settles into a plush red theater seat wearing 3D glasses beside a soda-cup friend sharing the armrest, rows of food moviegoers and a huge glowing screen ahead, wide shot from the back" }' },
  { tag: 'sports-stadium', blurb: 'Food characters at a stadium game — cheering in the stands with foam fingers, doing the wave, the big game on the field, the jumbotron, vendor snacks.', example: '{ "tags": ["sports-stadium"], "description": "A kawaii nacho-cup cheers in the packed stadium stands waving a foam finger while a soda-cup and a pretzel friend do the wave, the bright field and a glowing jumbotron behind, wide crowd shot" }' },
  { tag: 'aquarium', blurb: 'Food characters at an aquarium — pressing to the big glass tank, the tunnel under the water, the touch tank, the jellyfish exhibit, watching divers.', example: '{ "tags": ["aquarium"], "description": "A kawaii cupcake presses both hands to a giant curved aquarium window as fish drift past, a boba friend pointing up in wonder beside it, the dim blue underwater tunnel glowing around them, wide shot" }' },
  { tag: 'carnival-night', blurb: 'Food characters at a nighttime carnival — midway games, spinning rides lit up, winning a giant plush, the funhouse, glowing lights everywhere.', example: '{ "tags": ["carnival-night"], "description": "A kawaii corn-dog winds up to toss a ring at a bottle-toss booth while a cotton-candy friend hugs a giant plush prize, glowing carnival rides spinning on the midway behind, lively wide night shot" }' },
  { tag: 'backyard-cookout', blurb: 'Food characters at a backyard cookout / garden — manning the grill, running through a sprinkler, badminton, gardening, a treehouse, lawn games.', example: '{ "tags": ["backyard-cookout"], "description": "A kawaii hot dog flips burgers at a smoking backyard grill with a tiny spatula while a corn-cob friend tosses a frisbee, a sprinkler arcing over the lawn and a treehouse behind, sunny wide backyard shot" }' },
  { tag: 'road-trip', blurb: 'Food characters on a road trip — packed into a little car with luggage, a scenic mountain overlook, gas-station snack run, a convertible cruising, a diner stop.', example: '{ "tags": ["road-trip"], "description": "A kawaii burger drives a packed little convertible down an open desert highway with a soda-can and a chip-bag friend riding along, luggage strapped on top, mesas and a big sky stretching ahead, wide cruising shot" }' },
];

generateBucketScenes({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_food_outings_scenes.json',
  perSubTheme: parseInt(process.env.PER_SUB_THEME || '2', 10),
  subThemes: SUB_THEMES,
  buildPrompt: ({ tag, blurb, example }, n) => `You are writing ${n} KAWAII FOOD-ADVENTURE storytelling scenes for YumBot's "${tag}" sub-theme. EVERY entry MUST be tagged ["${tag}"] — do not mix sub-themes.

━━━ THE SUB-THEME — ${tag} ━━━

${blurb}

━━━ WHAT EVERY SCENE MUST HAVE ━━━

- One or MORE kawaii FOOD CHARACTERS come to life — each is a food or drink you can INSTANTLY recognize (its real shape, color, toppings and texture kept intact) with a kawaii face, ACTING OUT the moment (riding / playing / performing / splashing / building / cheering). The food itself is the character — do not turn it into a generic doll.
- EVERY character must read UNAMBIGUOUSLY as a food or drink (donut, ice-cream cone, taco, pizza, soda can, watermelon, pretzel, fries, boba, cupcake, etc.). DO NOT use candy shaped like an animal or creature (NO gummy bears, NO animal crackers, NO bear/bunny-shaped sweets) — Flux renders those as REAL animals, not food.
- VARY the food hero across entries — pull widely from desserts, fast food, salty snacks (chip bag, popcorn, pretzel), drinks (soda can, juice box, boba, milkshake), candy, and fruit. NEVER repeat the same food + activity combo.
- A real-world LOCATION for this sub-theme, richly built out and instantly readable — name the concrete setting elements so the place fills the frame and is WELDED into the scene. The location is never a blank, pastel, or empty void; it surrounds and grounds the food characters.
- A small GROUP of food-friend co-heroes sharing the adventure is encouraged (a band of friends), not a lone hero on an empty backdrop.
- A light composition hint (wide establishing / off-center / low hero-up / three-quarter).

━━━ ENTRY SHAPE — STRUCTURED OBJECT (NON-NEGOTIABLE) ━━━

{ "tags": ["${tag}"], "description": "<the scene, 30-45 words>" }

━━━ EXAMPLE ━━━

${example}

━━━ HARD BANS ━━━

- NO humans, NO human hands or faces — the entire cast is food/drink.
- NO gummy bears or any animal/creature-shaped candy (they render as actual animals). Every character reads clearly as a food or drink.
- NO blank / white / plain / pastel / studio background — the real-world location must fill the scene and surround the characters.
- NO photo-real tokens ("photograph" / "DSLR" / "f/2.8"). NO lighting / palette / mood words (separate axes handle those).
- NO sub-theme blending — pure "${tag}" only.
- NO repeating subject + activity combos — stretch the semantic range.

━━━ OUTPUT ━━━

A JSON array of structured objects. No preamble. No numbering. Plain JSON array only.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
