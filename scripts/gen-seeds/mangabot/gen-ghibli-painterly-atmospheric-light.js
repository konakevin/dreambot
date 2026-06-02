#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/ghibli_painterly_atmospheric_light.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} ATMOSPHERIC LIGHT entries for a MangaBot ghibli-painterly keyframe. This is the LIGHT SIGNATURE — god-rays / haze / lantern-glow / firefly-light — that gives the scene its Ghibli emotional read.

Each entry: 12-20 words. ONE specific light treatment with Ghibli painterly cue. Hand-painted feel, not photoreal.

VARIETY (25 bespoke entries):
- 25% GOD-RAYS / SUN-SHAFTS piercing through clouds / canopy / cathedral windows
- 15% GOLDEN-HOUR amber slanting low across the architecture
- 15% LANTERN-GLOW warm pools (paper chochin / stone lantern / floating lantern reflecting on wet stone)
- 10% MORNING-HAZE diffuse silver mist with light bleeding through
- 10% BIOLUMINESCENT firefly / mushroom / spirit glow (cool magenta / cyan / mint)
- 10% MOONLIGHT silvering the architecture with deep blue shadows
- 5% RAINBOW REFRACTION through dewdrops / waterfall mist / crystal
- 5% AURORA / SHIMMERING ETHEREAL light bands in the sky
- 5% FIRE-GLOW / EMBER-CAST from torch / forge / sunset (warm orange wash)

DO write:
- Golden god-rays pierce the cloud-sea, fanning out across the floating fortress in solid bars of light
- Warm amber sun-shafts slant through the cedar canopy, illuminating dust-motes and pollen drifting between trunks
- Hundreds of paper lanterns cast warm pools of light up the cavern walls, reflecting in the dark water below
- Diffuse silver morning haze rolls through the colonnade, sun bleeding through soft and pearled
- Firefly-cloud of cool magenta-cyan bioluminescent spores rises from the mushroom-grove, lighting the scene from below
- Moonlight silvers the spire and deep blue shadows pool in the cathedral arches, stars beyond
- Rainbow refractions scatter through dewdrops on the foreground ferns, sun-shaft behind
- Aurora bands of soft mint-and-rose ripple across the night sky above the floating fortress
- Warm forge-glow ember-orange pours from the open windows, casting the carved stones in firelight

DO NOT write:
- Flat / shadowless / uniform lighting
- Photoreal sunlight specifications (f-stop, kelvin)
- Hero-character close-up lighting (no rim-light on a face)
- Western noir lighting

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
