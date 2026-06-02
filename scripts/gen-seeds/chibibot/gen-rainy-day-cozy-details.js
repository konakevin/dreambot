#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/rainy_day_cozy_details.json',
  total: 100,
  append: true,
  batch: 25,
  metaPrompt: (
    n
  ) => `You are writing ${n} COZY-SHELTER DETAILS for ChibiBot rainy-day-cozy — the tiny props that populate a cozy outdoor-shelter scene during rain. Each render picks 3 (pickN:3).

Each entry: 8-15 words. ONE specific cozy-shelter prop.

━━━ CATEGORY DISTRIBUTION ━━━

- 25% beverage / treat (steaming mug of cocoa with marshmallow / brass teapot on a stool / tray of muffins with steam / picnic basket spilling open / thermos with two cups)
- 20% textile (chunky knit blanket bunched over a railing / patchwork quilt half-spread / wool throw with frayed edges / cushion pile / sheepskin draped on a bench)
- 15% lighting / lantern (paper lantern strung from a branch / brass hurricane lantern with warm yellow glow / fairy-lights draped along the eaves / candle in a mason jar on a step)
- 15% umbrella / rain-gear (red polka-dot umbrella tipped against a post / yellow rubber boots paired on a porch step / clear bubble umbrella drying upside-down / oilskin coat draped on a chair)
- 10% storybook / reading (open book face-down on a quilt / stack of paperbacks tied with string / journal with a pen / illustrated picture-book splayed open)
- 10% domestic-outdoor (potted herb on a step / hanging laundry basket / open mason jar of preserves / wooden tray with empty mugs)
- 5% animal-life detail (sleepy cat curled on a windowsill INSIDE the shelter / sparrow on a nearby fence / butterfly resting on the umbrella's underside)

━━━ DEDUP ━━━

Dedup by prop-type + concrete material/detail.

━━━ HARD BANS ━━━

- NO creatures or characters (creature axis separate)
- NO active wet-play props
- NO time/weather/setting

━━━ OUTPUT ━━━

JSON array of \${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
