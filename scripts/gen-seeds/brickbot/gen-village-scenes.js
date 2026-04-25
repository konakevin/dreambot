#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/village_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} LEGO VILLAGE/NEIGHBORHOOD scene descriptions for BrickBot. Charming residential streets, cottage neighborhoods, and living spaces with beautiful surroundings.

Each entry: 15-25 words. One specific village or neighborhood scene.

━━━ SCENE TYPES (mix broadly) ━━━
- Row of colorful townhouses with unique facades, flower boxes, front stoops
- Cottage lane with thatched-roof houses, garden gates, climbing roses
- Suburban street with driveways, mailboxes, kids' bikes, basketball hoops
- Hillside village cascading down slope, winding paths between homes
- Canal-side neighborhood with narrow houses, bridges, moored boats
- Autumn street with orange leaf piles, pumpkin porches, smoke from chimneys
- Snowy village street with plowed paths, warm window glow, snowmen in yards
- Seaside cottages with weathered shingles, dune grass, lighthouse in distance
- European cobblestone square with cafes, apartments above, fountain center
- Mountain village with A-frame chalets, pine trees, creek running through
- Spring neighborhood with cherry blossom trees, garden parties, bicycles
- Night scene with streetlamps, lit windows, stars above rooftops
- Market street with ground-floor shops, apartments above, awnings and signs
- Riverside village with stone bridges, watermill, willow trees

━━━ RULES ━━━
- Focus on MULTIPLE buildings together, not single structures
- Include surrounding scenery: trees, gardens, paths, parks, water
- Show neighborhood life — the place feels lived-in and welcoming
- Vary seasons, time of day, geography, architectural style
- No repeats

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
