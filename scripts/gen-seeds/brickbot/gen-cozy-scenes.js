#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/cozy_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} LEGO COZY scene descriptions for BrickBot. Warm inviting LEGO interiors and buildings — the Winter Village and Modular Building energy.

Each entry: 15-25 words. One specific cozy scene.

━━━ SCENE TYPES (mix broadly) ━━━
- Bookshop interior with tiny brick books on shelves, reading nook
- Coffee shop with printed-tile menu board, espresso machine, pastry display
- Winter village cottage with snow bricks, warm window glow
- Bakery kitchen with brick ovens, tiny bread loaves, flour dust
- Cozy cabin fireplace with transparent orange flame pieces
- Holiday living room with brick Christmas tree, presents, stockings
- Flower shop with colorful plant pieces, window boxes
- Toy shop interior with tiny LEGO sets on shelves (meta!)
- Library with spiral staircase, globe, reading lamp
- Rainy day cafe, minifigs with umbrella accessories, steamy windows

━━━ RULES ━━━
- Warm, inviting, "I want to live there" energy
- Tiny details everywhere — mugs, food, furniture, decor
- Warm lighting from windows, fireplaces, lamps
- No repeats

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
