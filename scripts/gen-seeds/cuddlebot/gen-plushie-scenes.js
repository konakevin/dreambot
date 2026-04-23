#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/cuddlebot/seeds/plushie_scenes.json',
  total: 100,
  batch: 10,
  append: true,
  metaPrompt: (n) => `You are writing ${n} PLUSHIE SCENE descriptions for CuddleBot's plushie-life path — plushies/soft toys come alive Toy-Story-style doing cozy activities together. Fabric-textured, button-eyes, visible stitching. Wholesome, warm, cozy.

Each entry: 15-30 words. One specific plushie-alive scene.

━━━ CATEGORIES ━━━
- Plushie tea party (plushie bears/bunnies/foxes around mini table with teacups)
- Plushie movie night (on couch with popcorn, blanket)
- Plushie picnic (in meadow, checked blanket, mini sandwiches)
- Plushie slumber party (sleeping bags, pillow pile)
- Plushie pillow fort camping (inside cozy blanket tunnel)
- Plushie bakery-day (rolling dough, mini aprons)
- Plushie birthday (cake with candles, wrapped gifts)
- Plushie book-reading circle (stacked on cozy rug)
- Plushie campfire (mini marshmallows on sticks, glowing log)
- Plushie night-train pillow-car (tiny conductor, soft blanket seats)
- Plushie snow-day (tiny mittens, snowball fight)
- Plushie rainy-day porch (watching rain, warm drink)
- Plushie beach day (tiny umbrella, sand-castle)
- Plushie music band (tiny instruments, round stage)
- Plushie parade
- Plushie laundry-day (hanging on line)
- Plushie cooking show
- Plushie tea-house service (one in apron serving others)
- Plushie train-set adventure (riding on toy train)
- Plushie under-blanket hideout (fort)
- Plushie library (all reading under soft lamp)
- Plushie carnival (tiny rides, cotton-candy)

━━━ RULES ━━━
- Plushies are subjects — visible fabric, button-eyes, stitching
- Toy-Story-alive but plushie-textured (not action-figure)
- Warm cozy wholesome energy
- No humans

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
