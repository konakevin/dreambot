#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/pixel_cozy_subjects.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} PIXEL COZY SUBJECT descriptions for PixelBot's pixel-cozy path — pixel cozy scenes. Bedrooms with CRTs, tiny cottages, pixel cafes, winter cabins, sunny apartment windows.

Each entry: 15-30 words. One specific cozy pixel scene.

━━━ CATEGORIES ━━━
- Bedroom with CRT monitor glowing softly
- Tiny cottage interior with hearth-fire
- Pixel-cafe with steaming latte
- Winter cabin with smoke from chimney
- Sunny apartment window with plants
- Study-room with stacked books
- Library-nook by window
- Attic bedroom with skylight
- Treehouse interior cozy
- Campervan interior cozy
- Ramen-shop cozy interior
- Bakery with pastry display
- Pottery workshop with shelves
- Tea-house cozy corner
- Reading-nook with cat on cushion
- Kitchen with steaming-kettle
- Bathroom with clawfoot-tub
- Music-room with instruments
- Gaming-room with CRT TV
- Woodworking-shop interior
- Greenhouse with tomato plants
- Small bookstore corner
- Coffee-shop at rain
- Art-studio with easel
- Observatory room with telescope
- Sewing-room with patterns
- Ceramic-studio with wheel
- Garden-shed interior tools
- Boathouse interior with hanging lanterns
- Cabin-loft bed with window
- Tiny-house living-room
- Steam-bath interior warm
- Book-nook in wall
- Sunroom with wicker chairs
- Cozy basement with couch
- Attic-studio with clutter
- Library ladder on rolling rail
- Workshop with apron hanging
- Bed-and-breakfast interior
- Inn-kitchen warm
- Stone cottage interior
- Fisherman's-cabin gear
- Bookshop-cafe hybrid
- Hammock-on-porch at rain
- Tree-stump stool interior

━━━ RULES ━━━
- Cozy + warm + homey
- Pixel-art renderable detail
- Interior / close-space focus

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
