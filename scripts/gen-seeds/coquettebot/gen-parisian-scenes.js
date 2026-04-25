#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/coquettebot/seeds/parisian_scenes.json',
  total: 200,
  batch: 50, append: true,
  metaPrompt: (n) => `You are writing ${n} PARISIAN DAYDREAM scene descriptions for CoquetteBot — Paris as a pink pastel fantasy. No people visible. Coquette aesthetic.

Each entry: 10-20 words. One specific Parisian scene or detail.

━━━ CATEGORIES ━━━
- Café tables (marble-top bistro table, espresso cups, croissant on plate, wrought-iron chair)
- Patisserie windows (macaron towers, cream puffs, eclairs, pink box with ribbon)
- Flower shops (buckets of peonies on cobblestone, wrapped bouquets, flower cart)
- Cobblestone streets (rain-wet stones reflecting pink awnings, puddle reflections)
- Vintage bikes (pastel frame, wicker basket with baguette + flowers, parked by lamp)
- Balconies (wrought-iron railing, geranium window boxes, lace curtains, shutters)
- Bookshops (sidewalk book bins, stacked vintage editions, reading nook in window)
- Bridges (ornate stone bridges over Seine, love locks, dusk light, reflections)
- Bakery interiors (marble counter, glass cake domes, pink-and-white tile floor)
- Rainy day Paris (pink umbrella on bench, wet café chairs, droplets on window)
- Antique shops (gilded mirrors in doorway, vintage frames, porcelain, chandelier)
- Garden scenes (Luxembourg gardens bench, fountain, trimmed hedges, gravel path)
- Market stalls (lavender bundles, soap displays, fabric rolls, cheese wheels)
- Apartment windows (warm glow inside, curtain fluttering, cat silhouette)

━━━ RULES ━━━
- NO people, NO figures, NO silhouettes
- Pink/cream/rose-gold pastel palette
- Romantic and impossibly beautiful
- French architectural details throughout

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
