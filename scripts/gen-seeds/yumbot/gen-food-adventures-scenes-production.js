#!/usr/bin/env node
/**
 * YumBot food-adventures SCENES — production scale (2026-06-21).
 *
 * STORYTELLING path: kawaii FOOD CHARACTERS come to life and out doing fun
 * activities in real-world locations. One Sonnet call per location sub-theme
 * (equal-share rule, feedback_production_seed_equal_share_per_subtheme).
 *
 * Custom prompt (NOT buildYumBotSubThemePrompt, which is biased to the close-up
 * "kawaii face" register). Recipe: food-come-to-life + recognizable food + the
 * food IS the character (no head-on-a-doll, no morphology dictation) + activity
 * + RICH real-world location filling the frame (never blank/studio) + multiple
 * food-friend co-heroes. Run: node scripts/gen-seeds/yumbot/gen-food-adventures-scenes-production.js
 */
const { generateBucketScenes } = require('../../lib/yumbotBucketGen');

const SUB_THEMES = [
  { tag: 'amusement-park', blurb: 'Food characters riding amusement-park attractions — roller coaster, carousel, bumper cars, spinning teacups, drop tower, log flume — arms up screaming with joy, the colorful park sprawling behind.', example: '{ "tags": ["amusement-park"], "description": "A kawaii hamburger and two french-fry friends ride the front car of a candy-colored roller coaster cresting a loop, mouths open in delight, the whole amusement park with a ferris wheel sprawling behind, wide establishing shot" }' },
  { tag: 'water-park', blurb: 'Food characters at a water park — twisting slides, wave pool, lazy river, splash pad, diving board — splashing and riding rings down flumes, water spraying everywhere.', example: '{ "tags": ["water-park"], "description": "A kawaii ice-cream cone splashes down a twisting blue water slide on a rubber ring while a soda-can friend cannonballs into the splash pool below, tall looping slides and palm trees behind, dynamic wide shot" }' },
  { tag: 'mall-shopping', blurb: 'Food characters out shopping at a bright mall — carrying shopping bags, riding escalators, window-shopping, hanging at the food court, trying on hats.', example: '{ "tags": ["mall-shopping"], "description": "A kawaii donut struts through a bright multi-level mall swinging little shopping bags, a boba-tea friend window-shopping at a glowing storefront, glass railings and escalators behind, off-center wide shot" }' },
  { tag: 'camping', blurb: 'Food characters camping in the woods — roasting marshmallows at a campfire, pitching a tent, hiking, fishing at a lake, paddling a canoe, stargazing.', example: '{ "tags": ["camping"], "description": "A kawaii taco roasts a marshmallow on a stick over a crackling campfire while a banana friend strums a little guitar on a log, a glowing tent and tall pines all around, cozy wide campsite shot" }' },
  { tag: 'beach-day', blurb: 'Food characters at the beach — building sandcastles, surfing, beach volleyball, floating on tubes, snorkeling, chasing waves.', example: '{ "tags": ["beach-day"], "description": "A kawaii watermelon slice builds a sandcastle with a tiny bucket and shovel as a soda-bottle friend bobs on an inner tube in the waves, striped umbrellas and circling gulls behind, sunny wide beach shot" }' },
  { tag: 'concert-stage', blurb: 'Food characters performing or watching a concert — a food band on a glowing stage, a singer at the mic, a DJ, a cheering food-crowd dancing below.', example: '{ "tags": ["concert-stage"], "description": "A kawaii cupcake belts into a microphone center-stage while a chocolate-bar friend drums behind, a churro friend on bass, a packed crowd of food fans cheering below the bright stage, wide concert shot" }' },
  { tag: 'arcade', blurb: 'Food characters playing arcade games — claw machine, racing cabinet, air hockey, skee-ball, dance pad, ticket counter piled with prizes.', example: '{ "tags": ["arcade"], "description": "A kawaii hot dog grips a glowing claw-machine joystick in fierce concentration while a gumball friend cheers, rows of neon arcade cabinets and prize-ticket streamers all around, off-center wide shot" }' },
  { tag: 'zoo-trip', blurb: 'Food characters visiting a zoo — pointing at habitats, riding the safari tram, feeding animals, exploring the reptile house, holding a map.', example: '{ "tags": ["zoo-trip"], "description": "A kawaii strawberry points excitedly with a tiny zoo map while a juice-box friend snaps a photo, leafy animal habitats and balloon stands lining the sunny path, other food visitors strolling, wide shot" }' },
  { tag: 'snow-day', blurb: 'Food characters in the snow — skiing, snowboarding, sledding down a hill, building a snowman, snowball fight, ice skating.', example: '{ "tags": ["snow-day"], "description": "A kawaii pancake-stack carves down a snowy slope on tiny skis with a scarf streaming, a marshmallow friend tumbling in the powder behind, a chairlift and frosted pines on the mountain, dynamic wide shot" }' },
  { tag: 'county-fair', blurb: 'Food characters at a county fair — ferris wheel, ring-toss and bottle-toss booths, carousel, prize plushies, fair-game midway by day.', example: '{ "tags": ["county-fair"], "description": "A kawaii cotton-candy waves from a swinging ferris-wheel gondola while a corn-dog friend waves from the next car, game booths and a carousel on the fairground below, warm wide establishing shot" }' },
  { tag: 'skatepark', blurb: 'Food characters at a skatepark — skateboarding off ramps, scootering, BMX, rollerblading, grinding rails, filming tricks.', example: '{ "tags": ["skatepark"], "description": "A kawaii cookie ollies a skateboard off a ramp with arms out for balance while a soda-can friend films on a tiny phone, curved concrete ramps and graffiti murals all around, low hero-up wide shot" }' },
  { tag: 'pool-party', blurb: 'Food characters at a backyard pool party — cannonballs, flamingo floaties, diving board, water guns, poolside snack table.', example: '{ "tags": ["pool-party"], "description": "A kawaii pineapple launches a cannonball into a backyard pool as a pizza-slice friend lounges on a flamingo float, a snack table piled with chip bags and soda cans poolside, sunny wide party shot" }' },
  { tag: 'park-playground', blurb: 'Food characters at a park — playground swings and slides, frisbee, flying a kite, soccer, feeding ducks at the pond, riding bikes.', example: '{ "tags": ["park-playground"], "description": "A kawaii orange kicks a soccer ball mid-stride across a sunny park while a pretzel friend dives to play goalie, a kite flying overhead and a picnic blanket nearby, leafy trees behind, wide action shot" }' },
  { tag: 'movie-theater', blurb: 'Food characters at the movies — settling into plush seats with 3D glasses, sharing popcorn, the ticket booth, the glowing screen, the lobby.', example: '{ "tags": ["movie-theater"], "description": "A kawaii popcorn-bucket settles into a plush red theater seat wearing 3D glasses beside a soda-cup friend sharing the armrest, rows of food moviegoers and a huge glowing screen ahead, wide shot from the back" }' },
  { tag: 'sports-stadium', blurb: 'Food characters at a stadium game — cheering in the stands with foam fingers, doing the wave, the big game on the field, the jumbotron, vendor snacks.', example: '{ "tags": ["sports-stadium"], "description": "A kawaii nacho-cup cheers in the packed stadium stands waving a foam finger while a soda-cup and a pretzel friend do the wave, the bright field and a glowing jumbotron behind, wide crowd shot" }' },
  { tag: 'aquarium', blurb: 'Food characters at an aquarium — pressing to the big glass tank, the tunnel under the water, the touch tank, the jellyfish exhibit, watching divers.', example: '{ "tags": ["aquarium"], "description": "A kawaii cupcake presses both hands to a giant curved aquarium window as fish drift past, a boba friend pointing up in wonder beside it, the dim blue underwater tunnel glowing around them, wide shot" }' },
  { tag: 'birthday-party', blurb: 'Food characters at a birthday party — blowing out cake candles, opening presents, party games, piñata, balloons and streamers everywhere.', example: '{ "tags": ["birthday-party"], "description": "A kawaii birthday-cake character leans in to blow out its candles at a festive table ringed by cheering snack friends — a chip-bag, a gumball-cluster, a juice-box — balloons and streamers filling the party room, wide shot" }' },
  { tag: 'carnival-night', blurb: 'Food characters at a nighttime carnival — midway games, spinning rides lit up, winning a giant plush, the funhouse, glowing lights everywhere.', example: '{ "tags": ["carnival-night"], "description": "A kawaii corn-dog winds up to toss a ring at a bottle-toss booth while a cotton-candy friend hugs a giant plush prize, glowing carnival rides spinning on the midway behind, lively wide night shot" }' },
  { tag: 'backyard-cookout', blurb: 'Food characters at a backyard cookout / garden — manning the grill, running through a sprinkler, badminton, gardening, a treehouse, lawn games.', example: '{ "tags": ["backyard-cookout"], "description": "A kawaii hot dog flips burgers at a smoking backyard grill with a tiny spatula while a corn-cob friend tosses a frisbee, a sprinkler arcing over the lawn and a treehouse behind, sunny wide backyard shot" }' },
  { tag: 'road-trip', blurb: 'Food characters on a road trip — packed into a little car with luggage, a scenic mountain overlook, gas-station snack run, a convertible cruising, a diner stop.', example: '{ "tags": ["road-trip"], "description": "A kawaii burger drives a packed little convertible down an open desert highway with a soda-can and a chip-bag friend riding along, luggage strapped on top, mesas and a big sky stretching ahead, wide cruising shot" }' },
];

generateBucketScenes({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_food_adventures_scenes.json',
  perSubTheme: 10,
  subThemes: SUB_THEMES,
  buildPrompt: ({ tag, blurb, example }, n) => `You are writing ${n} KAWAII FOOD-ADVENTURE storytelling scenes for YumBot's "${tag}" sub-theme. EVERY entry MUST be tagged ["${tag}"] — do not mix sub-themes.

━━━ THE SUB-THEME — ${tag} ━━━

${blurb}

━━━ WHAT EVERY SCENE MUST HAVE ━━━

- One or MORE kawaii FOOD CHARACTERS come to life — each is a food or drink you can INSTANTLY recognize (its real shape, color, toppings and texture kept intact) with a kawaii face, ACTING OUT the moment (riding / playing / performing / splashing / building / cheering). The food itself is the character — do not turn it into a generic doll.
- VARY the food hero across entries — pull widely from desserts, fast food, salty snacks (chip bag, popcorn, pretzel), drinks (soda can, juice box, boba, milkshake), candy, and fruit. NEVER repeat the same food + activity combo.
- A real-world LOCATION for this sub-theme, richly built out and instantly readable — name the concrete setting elements so the place fills the frame.
- A small GROUP of food-friend co-heroes sharing the adventure is encouraged (a band of friends), not a lone hero on an empty backdrop.
- A light composition hint (wide establishing / off-center / low hero-up / three-quarter).

━━━ ENTRY SHAPE — STRUCTURED OBJECT (NON-NEGOTIABLE) ━━━

{ "tags": ["${tag}"], "description": "<the scene, 30-45 words>" }

━━━ EXAMPLE ━━━

${example}

━━━ HARD BANS ━━━

- NO humans, NO human hands or faces — the entire cast is food/drink.
- NO blank / white / plain / studio background — the real-world location must fill the scene.
- NO photo-real tokens ("photograph" / "DSLR" / "f/2.8"). NO lighting / palette / mood words (separate axes handle those).
- NO sub-theme blending — pure "${tag}" only.
- NO repeating subject + activity combos — stretch the semantic range.

━━━ OUTPUT ━━━

A JSON array of structured objects. No preamble. No numbering. Plain JSON array only.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
