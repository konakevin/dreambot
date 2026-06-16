#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/retrobot/seeds/park_and_pier.json',
  total: 200,
  batch: 50,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} AMUSEMENT-PARK / WATER-PARK / BOARDWALK / COUNTY-FAIR scene descriptions for RetroBot — the big summer thrill destination, 1975-1995. No people visible. Pure scene/environment. Dusk, blue hour, and warm golden light dominate — the magic of lights coming on.

Each entry: 10-20 words. One specific park, pier, or fair scene or detail.

━━━ CATEGORIES ━━━
- Ferris wheel lit against a dusk sky (spokes outlined in bulbs, gondolas)
- Carousel (painted horses, beveled mirrors, chasing lights, band-organ)
- Wooden roller coaster (white lattice track, lift hill, empty station, dusk)
- Log flume / splashdown (water channel, dripping log, splash wave)
- Bumper cars (empty waxed floor, sparking ceiling rail, neon arch)
- Midway game stalls (ring toss, balloon-dart, milk-bottle throw, plush prizes hung overhead)
- Ticket booth / entrance gate (turnstile, roll of paper tickets, hand-painted sign)
- Funnel-cake / cotton-candy / corn-dog stand (fryer, spun sugar, menu board, string lights)
- Water-park slide tangle (fiberglass tube slides, splash-down pool, dripping platform)
- Lazy river / wave pool (inner tubes, blue chlorinated water, lounge chairs)
- Boardwalk over the ocean (weathered planks, railing, saltwater-taffy shop, pier arcade)
- County-fair tilt-a-whirl / scrambler lit at night
- Fair livestock barn / blue-ribbon booth / pie tent (Americana fair)
- Fun house / mirror-maze entrance (painted clown face, spinning barrel)
- Concession midway at blue hour (strung bulbs, popcorn cart, caramel-apple stand)
- Sky ride / chairlift gondolas gliding over the park

━━━ RULES ━━━
- PURE SCENE — no people, no hands, no silhouettes, no riders
- 1975-1995 — vintage rides, hand-painted signage, incandescent bulbs (no LED, no modern coasters)
- Dusk / blue hour / golden hour with the ride lights glowing — warm and magical
- Warm analog film-grain feel
- Gender-neutral — boys and girls both lived this

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
