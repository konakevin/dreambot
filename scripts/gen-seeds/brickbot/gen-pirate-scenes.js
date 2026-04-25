#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/pirate_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} LEGO PIRATE scene descriptions for BrickBot. Pirate ships, treasure islands, sea battles, all built from LEGO bricks.

Each entry: 15-25 words. One specific pirate scene.

━━━ SCENE TYPES (mix broadly) ━━━
- Pirate ship on brick-built ocean, sails unfurled, cannons ready
- Treasure island cave with gold coin pieces, skeleton minifigs
- Ship-to-ship cannon battle, smoke from transparent grey pieces
- Port town tavern, pirate minifigs at brick tables
- Kraken attack wrapping tentacle pieces around ship hull
- Shipwreck on rocks, scattered cargo, marooned crew
- Treasure map table scene, captain's quarters interior
- Desert island with palm tree pieces, castaway camp
- Naval fort with cannons, redcoat soldiers defending
- Storm seas with wave pieces crashing over deck

━━━ RULES ━━━
- Classic LEGO Pirates theme energy
- Skull-and-crossbones flags, hook hands, peg legs, parrots
- Brick-built water using blue and white pieces
- No repeats

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
