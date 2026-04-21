#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/oceanbot/seeds/ocean_atmospheres.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} OCEAN ATMOSPHERIC DETAIL descriptions for OceanBot.

Each entry: 6-14 words. One specific ocean atmospheric element.

━━━ CATEGORIES ━━━
- Sunbeams through water column
- Bioluminescent plankton glow
- Particulate drift (marine snow)
- God-rays underwater piercing
- Moonlight glitter on surface
- Bio-cyan trail from moving body
- Bubble-column rising
- Sediment-swirl from movement
- Silt-cloud suspended
- Fish-scale glint caught in light
- Crystal-clear near-surface
- Hazy-shadow silhouette backlit
- Coral-polyp extended tendrils
- Surface-chop ripples seen from below
- Plankton-cloud dense
- Jellyfish-train drifting
- Eelgrass swaying
- Seafan swaying gently
- Light-dapple on sand-floor
- Whale-song-visualization
- Salt-crystal suspended
- Surge-pulse rhythm
- Wave-refraction caustic-patterns
- Thermocline haze layer
- Krill-swarm dense cloud
- Bubble-ring from exhale
- Sand-devil on seafloor
- Light-beam through surface
- Kelp-fall ancient frond
- Coral-spawning mass-event
- Comb-jelly iridescence
- Marine-snow organic-debris
- Plankton-cloud biolume patch
- Glitter-trail fish-wake
- Bubble-cluster released
- Ghost-silt memory-cloud
- Sunset-through-water gold
- Moonlit-silver-reflection from below
- Cave-light-shaft distant

━━━ RULES ━━━
- Ocean-specific atmospheric variety
- Visual / painterly detail

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
