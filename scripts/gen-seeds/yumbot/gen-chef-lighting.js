#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/chef_lighting.json',
  total: 200,
  batch: 18,
  append: true,
  metaPrompt: (n) => `Write ${n} LIGHTING DIRECTION / QUALITY descriptors for a kawaii mini-chef kitchen scene. ONLY how light falls — direction, quality, key/fill, accent. NOT time-of-day.

Each entry: 12-20 words. ONE specific lighting direction/quality.

DO write:
- Warm pendant-light pool-glow above the kitchen counter
- Soft window-light streaming from the left across the prep surface
- Warm rim-light from camera-right grazing across each kawaii chef-face
- Soft diffuse top-down key wrapping every food in warm bake-glow
- Backlit by a cottage window, halo edge-light on each chef-food
- Volumetric god-rays from a high skylight catching flour dust in the air
- Lantern-pendant pool-light pooling on the foods with soft fall-off
- Warm oven-glow casting orange highlight from one side
- Sparkle-shimmer light catching pearlescent food surfaces
- Soft pastel rim-light wrapping each food in a delicate edge-glow
- Soft warm hearth-glow from a stone oven nearby
- Warm chandelier bokeh strung overhead casting orb-shaped highlights
- Volumetric mist-light cutting through steam clouds rising from a pot
- Side-light from a kitchen-window with golden rim-kick on each chef
- Backlit silhouettes with pastel halo-rim outlining each chef
- Soft pearly diffuse glow with subsurface scattering on every food
- Warm hanging-pendant glow casting circular pool of light on the counter
- Soft window-light scattered through hanging herbs casting dappled shadows
- Mid-range fill-light from a warm wall-sconce
- Warm copper-pot reflections bouncing soft amber highlights onto the chefs

DO NOT write:
- Time-of-day words (golden hour, dusk, twilight, morning — separate axis)
- Weather descriptors
- Setting / character / ground descriptions

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
