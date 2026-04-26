#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/tinybot/seeds/tiny_cozy_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} TINY COZY SCENE descriptions for TinyBot's tiny-cozy path — warm-inviting-homey dollhouse-scale scenes. Viewer wants to shrink down and LIVE here.

Each entry: 15-30 words. One specific tiny cozy scene.

━━━ CATEGORIES ━━━
- Dollhouse bakery with tiny pastries on display + warm light
- Tiny library with fireplace + overstuffed chair + tea-table
- Dollhouse bedroom with cat on pillow + morning-light-through-window
- Reading-nook with plants + stack of books + mug
- Micro-kitchen with copper pots and fresh bread
- Tiny greenhouse with sun-warmth and flowers blooming
- Dollhouse tea-shop interior with visible kettle steaming
- Miniature pottery workshop with hands-off wheel
- Tiny apothecary with labeled jars and bundled herbs
- Dollhouse painter's studio with easel and paint-tubes
- Tiny book-shop interior with rolling ladder
- Miniature jazz-cafe with tiny instruments
- Dollhouse ice-cream parlor with tiny sundaes
- Tiny art-gallery studio-apartment
- Miniature plant-shop with varied pots
- Dollhouse cozy-bathhouse interior
- Tiny French pastry-shop window display
- Miniature Japanese tea-ceremony room
- Dollhouse children's-bedroom with toy-shelf
- Tiny cafe-with-rain-outside
- Miniature quilt-making workshop
- Dollhouse cozy-attic-retreat with window
- Tiny bookshop-cafe hybrid
- Miniature cottage-kitchen with apple-pie
- Dollhouse wood-workshop with carved toys
- Tiny florist-shop with bouquet-arrangements
- Miniature perfumery with tiny glass-bottles
- Dollhouse chocolatier-shop with tiny truffles
- Tiny embroidery-atelier with threads
- Miniature cobbler-shop interior

━━━ RULES ━━━
- WARM + inviting + homey + lived-in
- Dollhouse-scale details
- "I want to shrink down and live here"
- Soft warm amber palette

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
