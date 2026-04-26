#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/pixel_cozy_rooms.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} COZY ROOM/SPACE descriptions for PixelBot's pixel-cozy path. Each entry is a specific cozy INTERIOR or SMALL SPACE. The warm details/objects will be picked separately.

Each entry: 10-20 words. A specific cozy space.

━━━ CATEGORIES TO COVER ━━━
- Bedrooms (attic room, loft bed, window seat, canopy bed)
- Kitchens (cottage kitchen, ramen shop counter, bakery)
- Living spaces (reading nook, fireplace den, pillow fort)
- Workspaces (artist studio, potion shop, bookshop, record store)
- Cafes and restaurants (pixel cafe, tea room, noodle bar)
- Cozy outdoor (covered porch in rain, garden greenhouse, treehouse)
- Transit (train compartment at night, houseboat cabin, camper van)
- Shops (flower shop, antique store, candy shop)

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: room type + architectural style.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
