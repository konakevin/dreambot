#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dinobot/seeds/prehistoric_atmospheres.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} PREHISTORIC ATMOSPHERIC DETAIL descriptions for DinoBot.

Each entry: 6-14 words. One specific prehistoric atmospheric element.

━━━ CATEGORIES ━━━
- Volcanic-ash drifting
- Jungle-mist rising
- Cretaceous dust-kicked
- Primordial steam from vent
- Warm-morning haze
- Sunset-golden glow
- Rain-curtain prehistoric
- Humidity-haze tropical
- Pollen-haze (giant ferns)
- Dust from dinosaur-footfall
- Breath-steam cold-air dinosaur
- Mist-fall over waterfall
- Fog-drift in valley
- Ash-fall post-eruption
- Cloud-shadow across plain
- Dawn-mist through trees
- Jungle-smoke ember-rain
- Water-spray splashing
- Petals-prehistoric drifting (early angiosperms)
- Feathers shed mid-air
- Insect-swarm distant (giant dragonflies)
- Sparks from lightning-strike
- Crystal-salt mist
- Mud-from-legs splashing
- Scale-shed visible fragments
- Bone-dust at fossil-site in-situ
- Volcanic-sulfur haze
- Thermal-convection shimmer
- Tar-seep bubbling distant
- Heavy-rain sheeting

━━━ RULES ━━━
- Prehistoric atmospheric variety
- Visual + immersive

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
