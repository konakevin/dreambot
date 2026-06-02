#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/koi_lighting.json',
  total: 200,
  batch: 18,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} LIGHTING DIRECTION / QUALITY descriptors for a kawaii Japanese koi-pond scene. ONLY how light falls. NOT time-of-day.

Each entry: 12-20 words. ONE specific lighting direction/quality.

DO write:
- Warm lotus-lantern pool-glow on the water surface around the creatures
- Soft volumetric god-rays filtering through wisteria-canopy onto the pond
- Warm rim-light from a hanging paper-lantern grazing each creature
- Soft diffuse moonlight wrapping the pond in pearl glow
- Backlit creatures with halo edge-light against twilight sky
- Volumetric mist-light cutting through cherry-blossom petals
- Warm chochin-lantern pendant-glow casting circular pool of light
- Soft pearly diffuse pond-reflection light from beneath
- Warm fairy-light bokeh strung in branches above casting orb-highlights
- Sparkle-shimmer light catching dewy pond-surface reflections
- Soft pastel rim-light wrapping each creature in delicate edge-glow
- Volumetric pagoda-light spilling warm orange across the pond
- Dappled light through bamboo-canopy in golden patches
- Soft glow from floating lotus-lanterns pooling warmly on water
- Warm window-light from a teahouse spilling across the pond
- Backlit silhouettes with pastel halo outlining each creature
- Soft warm hearth-light from a stone-lantern nearby
- Mid-range golden-bokeh from distant lanterns out of focus
- Cool moonlit-glow with paper-lantern accents pooling warm
- Glowing-koi-fin reflections shimmering across the pond

DO NOT write:
- Time-of-day words (golden hour, dusk, twilight, morning, midday — separate axis)
- Weather descriptors
- Setting / character / ground descriptions

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
