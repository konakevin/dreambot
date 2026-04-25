#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/coquettebot/seeds/bedroom_scenes.json',
  total: 200,
  batch: 50, append: true,
  metaPrompt: (n) => `You are writing ${n} BEDROOM PRINCESS scene descriptions for CoquetteBot — the ultimate girly bedroom fantasy. No people visible. Pink pastel coquette aesthetic.

Each entry: 10-20 words. One specific girly bedroom scene or detail.

━━━ CATEGORIES ━━━
- Canopy beds (tulle drapes, fairy lights woven through, satin pillows stacked)
- Vanity corners (round mirror with lights, perfume bottles, jewelry dish, flowers)
- Fairy light walls (string lights in heart shape, warm glow on pink walls)
- Heart mirrors (ornate heart-shaped mirror, gold frame, reflection of room)
- Plush elements (pink velvet armchair, faux fur throw, silk cushions, floor pillows)
- Stuffed animals (arranged on bed, vintage bears, bunny collections, window seat)
- Book nooks (window seat with cushions, stacked romance novels, reading lamp)
- Closet glimpses (tulle skirts hanging, shoe collection, hat boxes, silk robes)
- Nightstand details (rose in bud vase, candle, pearl earrings, diary, teacup)
- Pink wallpaper (floral patterns, toile, damask, accent wall behind bed)
- Morning scenes (sunlight through sheer curtains, rumpled satin sheets, breakfast tray)
- Evening scenes (candles lit, fairy lights glowing, moonlight, cozy lamplight)
- Dressing area (full-length mirror, outfit laid on bed, ribbon belt, ballet flats)
- Desk corner (pink stationery, washi tape, scrapbook open, watercolor set, flowers)
- Bathroom adjacent (clawfoot tub with roses, bubble bath, candles, terry robe)

━━━ RULES ━━━
- NO people, NO figures, NO silhouettes
- Pink/cream/lavender/rose-gold palette
- Luxurious soft textures: velvet, satin, tulle, lace, silk
- Lived-in but dreamy — slippers by bed, book left open

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
