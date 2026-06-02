#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/festival_lighting.json',
  total: 200,
  batch: 18,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} LIGHTING DIRECTION / QUALITY descriptors for a kawaii Japanese matsuri scene. Each entry describes ONLY how light falls — direction, quality, key/fill, accent. NOT time-of-day.

Each entry: 12-20 words. ONE specific lighting direction/quality.

DO write:
- Warm chochin-lantern pool-light glowing from above onto the foods
- Soft volumetric god-rays filtering through paper-lantern strings
- Warm rim-light from camera-left grazing across each kawaii face
- Soft diffuse top-down key wrapping every food in warm-glow
- Backlit by a glowing chochin-lantern halo behind the cluster
- Dramatic side-light from a single tall paper-lantern, soft shadows opposite
- Iridescent firefly-glow scattering tiny warm orbs through the air
- Lantern pool-light pooling on the foods with soft fall-off into ambient
- Warm temple-pavilion light reflecting off polished wood onto the foods
- Sparkle-shimmer light catching pearlescent food surfaces
- Soft pastel rim-light wrapping each food in a delicate edge-glow
- Volumetric mist-light cutting through cherry-blossom-petal drift
- Warm fairy-light bokeh strung overhead casting orb-shaped lights
- Soft moonlight wash with chochin-lantern accents pooling warm
- Dramatic three-quarter side-light from a wooden lantern with crystal sparkle in highlights
- Backlit silhouettes with pastel halo-rim outlining each food
- Soft pearly diffuse glow filling the scene evenly with subsurface scattering
- Side-light from camera-right with golden rim-kick on each kawaii face
- Warm festival-glow ambient with multiple lantern point-sources visible
- Cherry-blossom-petal-rain catching shafts of pastel light

DO NOT write:
- Time-of-day words (golden hour, dusk, twilight, morning, midday — separate axis)
- Weather descriptors
- Setting / character / ground descriptions

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
