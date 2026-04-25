#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/castle_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} LEGO CASTLE scene descriptions for BrickBot. Medieval castles, kingdoms, battles, and fantasy fortresses built from LEGO bricks.

Each entry: 15-25 words. One specific castle/medieval scene.

━━━ SCENE TYPES (mix broadly) ━━━
- Castle siege with catapults, battering rams, ladders on walls
- Throne rooms with royal minifigs, banners, chandeliers
- Dragon attacks on castle towers, flame pieces
- Knight tournaments, jousting, arena crowds
- Village markets outside castle walls, peasant life
- Dungeon interiors, prison cells, treasure vaults
- Drawbridge and moat scenes, portcullis gates
- Wizard towers, alchemy labs, potion shelves
- Forest encampments, Robin Hood hideouts
- Castle kitchens, great halls, banquet feasts

━━━ RULES ━━━
- All LEGO — grey castle walls, flag pieces, shield accessories
- Mix scales: close-up details and wide establishing shots
- Vary mood: triumphant, ominous, peaceful, chaotic
- No repeats

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
