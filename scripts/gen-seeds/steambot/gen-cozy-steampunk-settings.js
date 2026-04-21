#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/steambot/seeds/cozy_steampunk_settings.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} COZY STEAMPUNK SETTING descriptions for SteamBot's cozy-steampunk path — warm cozy steampunk pockets.

Each entry: 15-30 words. One specific cozy steampunk setting.

━━━ CATEGORIES ━━━
- Inventor's workshop (forge + tea-service + brass-tools + leather-chair)
- Brass parlor (mechanical-tea-service, velvet-upholstery, gaslight-chandelier)
- Observatory (brass-telescope, star-charts on walls, leather-reading-chair)
- Airship cabin (cozy private quarters with brass-porthole to clouds)
- Victorian library (floor-to-ceiling books, mechanical book-arm, reading lamp)
- Apothecary (brass herb-distillation, glass bottles, herb-bundles)
- Brass conservatory (Victorian greenhouse with mechanical-garden)
- Tea room with clockwork-pastry-cart
- Inventor's attic with open skylight
- Cozy mechanical kitchen with copper-pots bubbling
- Leather reading-nook beside steam-radiator
- Cartographer's study with rolled maps
- Writing desk with clockwork-quill and ink-pots
- Bath-house with copper-tub and brass-fixtures
- Music-room with self-playing pianoforte
- Smoking lounge with velvet couches and gaslight
- Chess-parlor with brass-and-onyx board
- Ship-captain's log-cabin with brass-compass
- Mechanical-clockmaker's bench
- Inventor's tea-corner with sketches pinned
- Detective's office with brass-filing system
- Cozy gear-factory corner (workers absent, warmth remains)
- Apothecary's cat-corner with cat on warm pipe
- Gaslit bookshop with reading-nook
- Brass-kettle corner in steampunk kitchen
- Railway-carriage cabin with velvet-seats
- Mechanical-butler-charging-alcove cozy
- Astronomer's-rooftop with blankets
- Cozy observatory-cabin at sea
- Watch-repair-shop interior warm
- Brass-gramophone listening-room
- Inventor's-cluttered-study with cat on gears

━━━ RULES ━━━
- Warm + cozy + inviting
- Steampunk aesthetic preserved (brass / gears / gaslight / leather)
- Never dramatic action
- Setting is hero

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
