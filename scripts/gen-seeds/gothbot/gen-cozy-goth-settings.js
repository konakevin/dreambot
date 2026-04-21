#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/cozy_goth_settings.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} COZY GOTH SETTING descriptions for GothBot's cozy-goth path — cozy dark-fantasy pockets. Warm-dark coziness. Never dramatic action — places you want to spend a rainy afternoon.

Each entry: 15-30 words. One specific cozy-goth setting.

━━━ CATEGORIES ━━━
- Candlelit library with skull-decor (leather-bound books, human skull paperweight)
- Gothic bedroom velvet + iron-candelabra (black velvet canopy, chains)
- Witch's apothecary (dried bats hanging, potion bottles, herb-shelves)
- Crypt-kitchen (underground kitchen with cauldron and hanging herbs)
- Rain-streaked window with grimoire (window-seat with spellbook, cat on cushion)
- Vampire-lord reading nook (velvet chair, open book, chalice, candelabra)
- Midnight-crypt-tavern (cozy basement tavern with dark wood, warm fire)
- Nightshade-moonflower greenhouse (greenhouse of dark-poison plants, moonlight)
- Goth-lolita bedroom (pink-and-black, lace canopy, taxidermy)
- Black-rose garden morning (rose garden with morning fog, bench)
- Witch's kitchen (warm hearth with cauldron, dried-herb-hanging)
- Gothic conservatory (black-iron greenhouse with nightshades)
- Vampire's writing desk (candlelit mahogany desk with quill and ink)
- Crypt-sitting-room (subterranean sitting-area with tapestries and fire)
- Widow's tea-room (black lace tablecloth, tea-set, dried roses)
- Dark-academia reading room (green banker's lamp, book-stacks, dark wood)
- Ivy-covered balcony sunset (balcony overlooking gothic sunset, tea)
- Underground speakeasy-gothic (dim-lit lounge with velvet booths)
- Bone-accent studio (artist's gothic studio with easel and skeleton-drawings)
- Velvet-cushioned crypt-alcove (reading alcove inside crypt wall)
- Monastery cell (sparse monk's cell with candle and grimoire)
- Herbalist's shed (warm little shed with hanging herbs and mortar)
- Observatory-astronomer's room (telescope + star-chart-covered walls)
- Tarot-reader's parlor (round table with tarot, velvet curtains, candle)
- Rain-window-bath (dark bathroom with candlelit claw-foot tub, rain outside)
- Coffin-shaped reading nook (coffin-style couch with pillows)
- Cozy mausoleum interior (small mausoleum converted to study)
- Dark-Christmas parlor (black Christmas tree with silver ornaments, fire)
- Haunted cottage kitchen (warm kitchen with ghost-presence hinted)
- Moth-collection study (pinned-moth cabinet with warm lamp)

━━━ RULES ━━━
- Cozy + dark + warm-atmospheric
- Never dramatic action
- Setting is hero — character placement optional
- Warm-dark aesthetic

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
