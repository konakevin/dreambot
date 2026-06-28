#!/usr/bin/env node
/**
 * ChibiBot creature-adventures SCENES — bucket-aggregated (2026-06-28).
 *
 * Clone of YumBot's food-adventures path, recast for ChibiBot: adorable chibi
 * CREATURE friends out DOING fun things in real-world "out in the wild" settings
 * (amusement park / beach / camping / arcade / fair / etc.). The creatures + their
 * friends are NAMED in each scene (band-of-friends charm), exactly like YumBot
 * bakes the food characters into the scene.
 *
 * SEEDING METHOD — bucket-aggregated / equal-share-per-sub-theme: ONE independent
 * Sonnet call per setting (via generateBucketScenes → generatePool append), so
 * each setting's seeds are generated in their own focused pass (better quality +
 * variety within each sub-grouping, no cross-batch dedup starving some settings),
 * all joined into ONE tagged pool. See feedback_production_seed_equal_share_per_subtheme.
 *
 * MVP: PER_SUB_THEME=2 (≈26 to test every setting). Scale: bump to 15 and re-run
 * (idempotent append fills only the gap). Run:
 *   node scripts/gen-seeds/chibibot/gen-creature-adventures-scenes.js
 */
const { generateBucketScenes } = require('../../lib/yumbotBucketGen');

const PER_SUB_THEME = parseInt(process.env.PER_SUB_THEME || '2', 10);

const SUB_THEMES = [
  { tag: 'amusement-park', blurb: 'Chibi creature friends riding amusement-park attractions — roller coaster, carousel, bumper cars, spinning teacups, drop tower, log flume — paws thrown up squealing with joy, the colorful park sprawling behind.', example: '{ "tags": ["amusement-park"], "description": "A chibi red fox kit and two friends — a round hedgehog and a fluffy duckling — ride the front car of a candy-colored roller coaster cresting a loop, paws thrown up in delight, the whole amusement park with a Ferris wheel sprawling behind, wide establishing shot" }' },
  { tag: 'water-park', blurb: 'Chibi creature friends at a water park — twisting slides, wave pool, lazy river, splash pad, diving board — riding rings down flumes and splashing, water spraying everywhere.', example: '{ "tags": ["water-park"], "description": "A chibi otter pup splashes down a twisting blue water slide on a rubber ring while a bunny friend cannonballs into the splash pool below, tall looping slides and palm trees behind, dynamic wide shot" }' },
  { tag: 'beach-day', blurb: 'Chibi creature friends at the beach — building sandcastles, surfing, beach volleyball, floating on inner tubes, chasing waves, digging in the sand.', example: '{ "tags": ["beach-day"], "description": "A chibi bear cub builds a sandcastle with a tiny bucket and shovel while a duckling friend bobs on an inner tube in the gentle waves, striped umbrellas and circling gulls behind, sunny wide beach shot" }' },
  { tag: 'camping', blurb: 'Chibi creature friends camping in the woods — roasting marshmallows at a campfire, pitching a tent, hiking a trail, fishing at a lake, paddling a canoe, stargazing.', example: '{ "tags": ["camping"], "description": "A chibi fox kit roasts a marshmallow on a stick over a crackling campfire while a hedgehog friend strums a tiny ukulele on a log, a glowing tent and tall pines all around, cozy wide campsite shot" }' },
  { tag: 'snow-day', blurb: 'Chibi creature friends in the snow — sledding down a hill, skiing, building a snowman, a snowball fight, ice skating, tumbling in the powder.', example: '{ "tags": ["snow-day"], "description": "A chibi rabbit carves down a snowy slope on tiny skis with a scarf streaming behind, a round penguin friend tumbling in the powder, a chairlift and frosted pines on the mountain, dynamic wide shot" }' },
  { tag: 'county-fair', blurb: 'Chibi creature friends at a daytime county fair — Ferris wheel, ring-toss and bottle-toss booths, carousel, prize plushies, a sunny midway of game booths.', example: '{ "tags": ["county-fair"], "description": "A chibi raccoon waves from a swinging Ferris-wheel gondola while a squirrel friend waves from the next car, game booths and a carousel on the fairground below, warm wide establishing shot" }' },
  { tag: 'park-playground', blurb: 'Chibi creature friends at a park playground — swings and slides, frisbee, flying a kite, soccer on the grass, feeding ducks at the pond, riding bikes.', example: '{ "tags": ["park-playground"], "description": "A chibi puppy soars high on a playground swing, ears flying, while a kitten friend zooms down the slide nearby, a wooden play structure and leafy oak trees behind, low hero-up shot" }' },
  { tag: 'pool-party', blurb: 'Chibi creature friends at a backyard pool party — cannonballs, flamingo floaties, the diving board, splashing each other, a poolside snack table.', example: '{ "tags": ["pool-party"], "description": "A chibi duckling launches a cannonball into a backyard pool as an otter friend lounges on a flamingo float, a snack table and beach balls poolside, sunny wide party shot" }' },
  { tag: 'backyard-cookout', blurb: 'Chibi creature friends at a backyard cookout — running through a sprinkler, badminton, lawn games, climbing a treehouse, a picnic blanket, a sunny garden.', example: '{ "tags": ["backyard-cookout"], "description": "A chibi hedgehog runs gleefully through a rainbow sprinkler arc on a green lawn while a bunny and a fox friend dodge the streams, a white picket fence and rose bushes behind, low hero-up shot" }' },
  { tag: 'arcade', blurb: 'Chibi creature friends playing arcade games — the claw machine, a racing cabinet, air hockey, skee-ball, a dance pad, a ticket counter piled with prizes.', example: '{ "tags": ["arcade"], "description": "A chibi cat grips a glowing claw-machine joystick in fierce concentration while a mouse friend cheers, rows of neon arcade cabinets and prize-ticket streamers all around, off-center wide shot" }' },
  { tag: 'movie-theater', blurb: 'Chibi creature friends at the movies — settling into plush seats with tiny 3D glasses, sharing popcorn, the ticket booth, the glowing screen, the lobby.', example: '{ "tags": ["movie-theater"], "description": "A chibi owl settles into a plush red theater seat wearing tiny 3D glasses beside a bunny friend sharing a popcorn tub, rows of creature moviegoers and a huge glowing screen ahead, wide shot from the back" }' },
  { tag: 'aquarium', blurb: 'Chibi creature friends visiting an aquarium — pressing to the big curved glass tank, the underwater tunnel, the touch tank, the jellyfish exhibit, fish drifting past.', example: '{ "tags": ["aquarium"], "description": "A chibi fox kit presses both paws to a giant curved aquarium window as fish drift past, a duckling friend pointing up in wonder beside it, the dim blue underwater tunnel glowing around them, wide shot" }' },
  { tag: 'birthday-party', blurb: 'Chibi creature friends at a birthday party — blowing out cake candles, opening presents, party games, a piñata, balloons and streamers everywhere.', example: '{ "tags": ["birthday-party"], "description": "A chibi puppy leans in to blow out the candles on a little cake at a festive table ringed by cheering friends — a kitten, a hedgehog, a duckling — balloons and streamers filling the party room, wide shot" }' },
];

generateBucketScenes({
  outPath: 'scripts/bots/chibibot/seeds/chibibot_creature_adventures_scenes.json',
  perSubTheme: PER_SUB_THEME,
  subThemes: SUB_THEMES,
  buildPrompt: ({ tag, blurb, example }, n) => `You are writing ${n} CHIBI CREATURE-ADVENTURE storytelling scenes for ChibiBot's "${tag}" sub-theme. EVERY entry MUST be tagged ["${tag}"] — do not mix sub-themes.

━━━ THE SUB-THEME — ${tag} ━━━

${blurb}

━━━ WHAT EVERY SCENE MUST HAVE ━━━

- A hero chibi CREATURE plus 1-3 chibi creature FRIENDS doing the activity TOGETHER (a little band of friends) — each an instantly recognizable cute animal (or occasional gentle fantasy critter) at chibi proportions (oversized round head, big sparkling eyes, blush cheeks), physically ACTING OUT the moment (riding / splashing / playing / building / cheering / exploring). The creatures ARE the cast — name each species.
- VARY the creatures across entries — pull widely from cute real animals: fox kit, bunny, hedgehog, duckling, otter pup, bear cub, puppy, kitten, raccoon, squirrel, penguin chick, fawn, panda cub, owl, mouse, piglet, lamb, chipmunk, red panda, baby seal, koala, plus occasional gentle fantasy critters (tiny dragon, baby griffon). NEVER repeat the same creature + activity combo.
- The real-world LOCATION for this sub-theme, richly built out and instantly readable — name the concrete setting elements so the place FILLS the frame (rides, water, sand, snow, booths, screens, tanks, etc.). This is a SCENE in a PLACE, never a creature on a blank backdrop and never a tight portrait.
- A light composition hint (wide establishing / off-center / low hero-up / three-quarter).

━━━ ENTRY SHAPE — STRUCTURED OBJECT (NON-NEGOTIABLE) ━━━

{ "tags": ["${tag}"], "description": "<the scene, 30-45 words>" }

━━━ EXAMPLE ━━━

${example}

━━━ HARD BANS ━━━

- NO humans, NO human faces or hands, NO children — the entire cast is cute CREATURES.
- NO food characters (this is ChibiBot, not YumBot — every character is an animal/critter).
- NO blank / white / plain / studio background — the real-world location must fill the scene. NO wilderness-only or fantasy-village scene (this path is real-world fun places).
- NO scary / sad / distressed imagery — wholesome joy only.
- NO photo-real tokens ("photograph" / "DSLR" / "f/2.8"). NO lighting / palette / mood words (separate axes handle those).
- NO sub-theme blending — pure "${tag}" only.
- NO repeating subject + activity combos — stretch the semantic range.
- ROTATE THE HERO SPECIES — use a DIFFERENT hero creature for EACH entry in this batch; never repeat a hero animal within these ${n} entries, and do NOT default to red panda or fox as the hero (spread widely across the animal list above).

━━━ OUTPUT ━━━

A JSON array of structured objects. No preamble. No numbering. Plain JSON array only.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
