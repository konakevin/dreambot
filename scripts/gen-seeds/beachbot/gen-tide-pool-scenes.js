#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/beachbot/seeds/tide_pool_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} TIDE POOL SCENE descriptions for BeachBot's tide-pool path — intimate tide-pool beauty. Starfish / anemones / kelp / sea-urchins / hermit-crabs. Crystal-clear shallow detail.

Each entry: 10-20 words. One specific tide-pool detail scene.

━━━ CATEGORIES ━━━
- Starfish cluster on kelp-covered rock
- Sea-anemones open in crystal pool
- Sea-urchins wedged in crevices
- Hermit-crabs scuttling across sand
- Kelp-bed with small-fish
- Barnacle-encrusted rock with isopods
- Mussel-bed glossy-black at low-tide
- Chiton on rock mid-pool
- Sculpin-fish camouflaged in rocks
- Eelgrass in shallow pool
- Sea-stars piled in crevice
- Tide-pool with perfect reflection
- Nudibranch in shallow water
- Sea-glass collected in pool
- Smooth-river-stones polished
- Kelp-held-by-holdfast rock
- Crab-molting shell empty
- Rock-covered-in-limpets
- Pool with visible fish-darting
- Crystalline-salt-deposits rim
- Orange-sea-stars on purple-rocks
- Purple-sea-urchins amid kelp
- Green-anemones opening
- Chiton variety on rock
- Sea-cucumber at pool-bottom
- Brittle-star underside view
- Marine-worm tube-cluster
- Kelp-fly aggregation
- Green-abalone shell
- Shore-crab hiding under rock
- Pearl-oyster-shell fragments
- Scallop-shell half-buried
- Coral-polyp tiny-extended
- Sea-lettuce green-drift
- Sea-spider on rock
- Octopus changing color mid-pool (~10% of entries MUST feature octopus)
- Octopus hunting, probing under rocks with curious arms
- Octopus camouflaged perfectly against rock, only eyes visible
- Octopus squeezing through narrow crevice, boneless fluid movement
- Octopus in shallow crystal pool, textured skin rippling with patterns

━━━ RULES ━━━
- Intimate tide-pool scale
- Crystal-clear shallow detail
- Specific marine subjects
- No humans

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
