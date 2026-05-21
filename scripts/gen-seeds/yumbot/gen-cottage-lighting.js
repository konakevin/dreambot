#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/cottage_lighting.json',
  total: 200,
  batch: 18,
  append: true,
  metaPrompt: (n) => `Write ${n} LIGHTING DIRECTION / QUALITY descriptors for a kawaii cottagecore scene. ONLY how light falls. NOT time-of-day.

Each entry: 12-20 words. ONE specific lighting direction/quality.

DO write:
- Soft warm rim-light from camera-left grazing across each kawaii food
- Soft diffuse top-down key wrapping every food in pastel warmth
- Backlit by warm pastoral light with halo edge on each food
- Volumetric god-rays filtering through wisteria-arch overhead
- Warm dappled light through oak-canopy casting soft leaf-shadows
- Honeyed sunlight pooling at the foods' base from a sideways window
- Lantern-pool glow from a wicker-hanging lantern overhead
- Sparkle-shimmer light catching dewy surfaces
- Soft pastel rim-light wrapping each food in a delicate edge-glow
- Volumetric meadow-light cutting through tall grass blades
- Warm fireplace-glow from a cottage hearth illuminating the cluster
- Side-light from a cottage-window with butter-yellow glow on each food
- Backlit silhouettes with pastel halo-rim outlining each food
- Soft pearly diffuse glow with subsurface scattering on every food
- Warm fairy-light bokeh strung between branches casting orb highlights
- Late-afternoon golden side-light raking across the picnic blanket
- Soft mist-light cutting through low cottagecore fog gently
- Cottage candle-glow casting warm circular pool of light
- Warm window-light scattered through lace curtains creating dappled pattern
- Soft volumetric light-shafts from a barn-window catching dust motes

DO NOT write:
- Time-of-day words (golden hour, dusk, twilight, morning, midday — separate axis)
- Weather descriptors
- Setting / character / ground descriptions

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
