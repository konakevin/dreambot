#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/outdoor_adventure_details.json',
  total: 200,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} WILDERNESS DETAILS for ChibiBot outdoor-adventure — small wilderness details scattered through the scene that make the wild place feel lived-in by nature. Template picks 3 per render.

Each entry: 10-20 words. ONE specific natural detail. NO creatures (hero or otherwise), NO main setting, NO activity verbs.

━━━ FORMAT — VISIBLE WILDERNESS DETAIL ━━━

Examples:
✓ "Mossy stones speckled with lichen lining a path"
✓ "Fallen log with bracket-fungi clusters along its side"
✓ "Wildflower-clump of cosmos and daisies bending in breeze"
✓ "Glowing-mushroom cluster nestled in tree-roots"
✓ "Dewdrops glistening on a spider-web stretched between branches"
✓ "Ferns unfurling new fronds in the sun-shafts"
✓ "Pine-cones scattered across a forest-floor carpet"
✓ "Stream-pebble bed visible through clear water"
✓ "Driftwood piece tumbled on a sandy shore"
✓ "Acorn-cap cluster beneath a giant oak"

━━━ CATEGORY DISTRIBUTION ━━━

- 20% PLANT-LIFE (wildflower clumps / fern unfurling / mushroom clusters / mossy stones / berry-bushes / lichen-patches)
- 15% TREE / WOOD (fallen log / hollow stump / giant tree-root / pinecones / acorn-cluster / driftwood)
- 15% WATER-DETAIL (stream-pebbles / dewdrops on web / waterfall-mist droplets / lily-pads / ripples on pool)
- 10% ROCK / TERRAIN (mossy stones / lichen-rock / smooth pebbles / boulder-stack / crystal-vein on rock)
- 10% TINY-WILDLIFE-TRACES (paw-print trail / spider-web with dew / butterfly resting on leaf / dragonfly hovering / bird-perched on branch)
- 10% LIGHT / AIR-DETAIL (sun-shaft through canopy / drifting pollen-cloud / dandelion-seed drift / mist-wisp through grass / dappled-light on bark)
- 5% MAGIC-NATURE (faintly-glowing flower / luminous-mushroom / sparkle on a leaf / firefly-rest / glowing-spore-puff)
- 5% SEASONAL (autumn-leaf carpet / spring-blossom-petal-drift / winter-frost on a branch / summer-grass-tall)
- 5% MINERAL / CRYSTAL (crystal-shard glinting / geode-shard in path / quartz-rock outcrop / agate-pebble)
- 5% FOREST-DECAY (curled fallen-leaf / cracked twig / acorn-cap cluster / hollow seed-pod)

━━━ HARD BANS ━━━

- NO creatures / characters
- NO villages / buildings
- NO activity verbs (no "blowing" — say "wind-tilted")
- NO weather/time-of-day language
- NO manmade objects (except adventure-trail-markers which are rare)

━━━ OUTPUT ━━━

JSON array of \${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
