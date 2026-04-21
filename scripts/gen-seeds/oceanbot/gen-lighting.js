#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/oceanbot/seeds/lighting.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} LIGHTING descriptions for OceanBot — underwater + low-light lighting.

Each entry: 10-20 words. One specific ocean lighting treatment.

━━━ CATEGORIES ━━━
- Sunbeams through water column (god-rays descending)
- Filtered blue-gradient depth (light fading with depth)
- Bioluminescent glow (plankton / jellyfish / fish-lure)
- Moonlit silver (cool silver surface-down)
- Starfield (night-ocean stars reflected)
- Dawn-through-surface (warm amber penetrating)
- Blue-hour underwater (deep cobalt)
- Caustic patterns (wave-light on sand)
- Tropical-noon directly overhead (intense)
- Deep-sea total-black with single spotlight
- Aurora-reflected on water surface
- Sunset-golden through water
- Storm-cloud-filtered gloomy
- Cave-shaft single beam
- Green-flash moment at sunset
- Thermocline-diffused soft
- Kelp-dappled forest-like
- Anglerfish-lure single-point
- Shipwreck-interior-dim
- Iceberg-underside blue-glow
- Cenote-shaft-from-above
- Ice-cave diffuse blue-white
- Moon-through-wave crest
- Night-reef-torch diver-light
- Anemone-tentacle translucent backlit
- Bubble-curtain catching light
- Silhouette-against-surface backlight
- Rim-light creature from behind
- Side-lit creature for texture
- Under-ice-blue soft-from-above
- Volcanic-vent red-glow
- Twilight-transition sky-to-deep
- Blue-hole descent-darkness
- Crystal-cave prismatic
- Lantern-fish ascending glow
- Plankton-trail boat-wake glowing
- Dolphin-pod silver-silhouette
- Whale-song-cymatic visualization light
- Spot-fish-eye reflecting catch

━━━ RULES ━━━
- Underwater + low-light emphasis
- Named specific treatments

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
