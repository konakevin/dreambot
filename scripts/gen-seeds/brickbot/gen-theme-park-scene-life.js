#!/usr/bin/env node
/**
 * BRICKBOT_THEME_PARK_SCENE_LIFE — life-detail fill (vendor carts / queues / characters).
 * Audit 2026-06-05: 36 → 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_theme_park_scene_life.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} SCENE-LIFE entries for BrickBot's theme-park path — each names a small brick-built life-detail (vendor cart, food stall, queueing crowd, character costume) populating an amusement-park diorama. Each entry: ONE phrase, 22-35 words, leading with "A".

━━━ THE BAR ━━━
Every entry names a SPECIFIC park-life feature (cotton-candy cart, hot-dog stand, popcorn stand, ticket booth, queue-line, mascot character, etc.) AND describes its brick build (canopy color, accessory elements, action of vendor/visitor minifig).

━━━ VARIETY MANDATE (distribute across categories) ━━━
- ~5 FOOD CARTS: cotton-candy, popcorn, hot-dog, ice-cream, churro, lemonade, soda, snow-cone, funnel-cake, corn-on-the-cob
- ~5 GAME STALLS: balloon-dart, ring-toss, milk-bottle knock-down, basketball-shoot, water-gun race, whack-a-mole, fishing-game, claw-machine
- ~4 RIDE-QUEUES: queue-line of waiting minifigs, switchback queue with ropes, fast-pass entry
- ~4 MASCOT-CHARACTERS: costumed character greeting kids, parade-mascot, photo-opp character
- ~3 TICKET / ENTRY: ticket booth, turnstile, information-desk
- ~3 MERCHANDISE / SOUVENIR: t-shirt stand, plush-toy stall, sticker-vending
- ~3 PERFORMANCE: street-performer, magician, juggler, fire-eater (brick), strolling musician
- ~3 ATTRACTION-INTERIOR: photo-booth interior, funhouse mirror, arcade-game cabinets, prize-counter
- ~3 PARADE-ELEMENTS: float, marching-band brick minifigs, parade-balloon, dancing-troupe
- ~3 BENCH / REST AREAS: bench with eating family, drinking-fountain, restroom-line
- ~2 CHARACTER-DINING: themed restaurant interior with character-server
- ~2 RIDE-OP STAFF: operator at controls, safety-check staff
- ~1 LOST-CHILD HELP DESK
- ~1 MAINTENANCE CART pushing through
- ~1 STROLLER-RENTAL booth

━━━ FORMAT ━━━
Each entry: ONE phrase, lead with "A", 22-35 words. Touchpoints:
"A cotton-candy cart — pink-canopied brick cart, spun-sugar drum, rack of pink-and-blue cotton-candy builds, vendor handing one to a reaching toddler minifig"
"A popcorn stand — red-and-white striped brick stand, trans-yellow round-plate kernels overflowing the kettle-build, a trail of spilled pieces leading to a delighted minifig"
"A hot-dog cart — yellow-canopied brick cart, a row of hot-dog-builds under a hinged-plate lid, vendor minifig squeezing a ketchup-red bar over a waiting bun"

━━━ BANS ━━━
- NO photoreal vocab
- NO licensed franchise mascots verbatim (no Mickey Mouse)
- NO duplicating scene-life types
- NO bland "a stall" — name the specifics

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
