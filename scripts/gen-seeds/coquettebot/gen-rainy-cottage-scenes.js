#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/coquettebot/seeds/rainy_cottage_scenes.json',
  total: 200,
  batch: 50, append: true,
  metaPrompt: (n) => `You are writing ${n} RAINY DAY COZY COTTAGE scene descriptions for CoquetteBot — romantic rainy afternoons in pink pastel cottage interiors. No people visible. Pink pastel coquette aesthetic.

Each entry: 10-20 words. One specific cozy rainy-day cottage interior scene.

━━━ CATEGORIES ━━━
- Window seat (rain streaking glass, cushions piled, open book, steaming mug, lace curtain)
- Fireside corner (pink marble fireplace, velvet armchair, knit throw, flickering flames)
- Reading nook (built-in bookshelf alcove, fairy lights, stack of floral-covered novels)
- Bedroom alcove (canopy bed, rain on skylight, silk pillows, breakfast tray with tea)
- Kitchen warmth (copper kettle steaming, fresh scones cooling, jam jars, rain on garden window)
- Bathtub retreat (clawfoot tub, rose petals floating, candles lit, rain on frosted window)
- Conservatory (glass ceiling with raindrops, wicker chair, tropical plants, warm blanket)
- Writing desk (love letters, ink well, pressed flowers, rain-blurred garden view)
- Tea corner (vintage teapot, tiered tray of pastries, lace tablecloth, rain drumming)
- Attic hideaway (sloped ceiling, string lights, vintage trunk, round rain-spattered window)
- Sewing room (silk ribbons, pin cushion, dress form draped in lace, grey light through shutters)
- Music corner (pink upright piano, sheet music, vase of roses, rain on bay window)
- Sunroom (wicker daybed, floral cushions, trailing ivy, steady rain on glass walls)
- Craft table (watercolor palette, half-finished painting, teacup, soft rain outside)

━━━ RULES ━━━
- NO people, NO hands, NO figures
- Rain is ROMANTIC not gloomy — warm interior vs cool rain contrast
- Pink/cream/amber/rose-gold interior palette with cool blue-grey rain accents
- Every scene must include rain visible or audible (window, skylight, glass)
- Cozy textures: velvet, knit, lace, silk, cashmere, linen

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
