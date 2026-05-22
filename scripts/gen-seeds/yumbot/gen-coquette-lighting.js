#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/coquette_lighting.json',
  total: 100,
  batch: 18,
  append: true,
  metaPrompt: (n) => `Write ${n} LIGHTING DIRECTION / QUALITY descriptors for a kawaii coquette scene. ONLY how light falls.

Palette LOCKED: pinks + lavenders + whites + soft purples ONLY.

Each entry: 12-20 words. ONE specific lighting direction/quality.

DO write:
- Soft warm pink-cream rim-light from camera-left grazing each food
- Soft diffuse top-down key wrapping every food in pearl-pink warmth
- Backlit by pink-pearl chandelier with halo edge on each food
- Volumetric god-rays filtering through pink lace curtains
- Warm pink-lavender pool-light pooling on the foods with soft fall-off
- Sparkle-shimmer light catching pearlescent surfaces in pink-glow
- Soft pastel pink-cream rim-light wrapping each food in delicate edge-glow
- Volumetric pink-haze light cutting through cascading bow-streamers
- Warm chandelier-pendant pool-light casting circular pearl-pink glow
- Side-light from pink-curtained window with rose-tint on each food
- Backlit silhouettes with pink-pearl halo-rim outlining each food
- Soft pearly diffuse glow with subsurface scattering on every food
- Warm pink fairy-light bokeh strung above casting orb highlights
- Late-afternoon pink-tinted side-light raking across the tabletop
- Soft mist-light cutting through pink-rose-petal drift
- Pink-pearl candle-glow casting warm circular pool of light
- Warm window-light scattered through pink-lace curtains with dappled pattern
- Volumetric pink-light-shafts from a pearl-pendant catching sparkle motes
- Soft warm pink-cream rim-light skimming every glossy candy surface
- Mid-range pink-fill-light from a pink wall-sconce nearby

DO NOT write:
- Time-of-day words (golden hour, dusk, twilight, morning, midday — separate axis)
- Weather descriptors
- Any colors outside pink / lavender / white / soft purple
- Setting / character / ground descriptions

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
