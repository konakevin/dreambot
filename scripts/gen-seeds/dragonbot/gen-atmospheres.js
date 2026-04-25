#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/atmospheres.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} ATMOSPHERIC DETAIL descriptions for DragonBot — epic-fantasy particle/mist/magical-atmospheric elements. Adds mythic depth to any scene.

Each entry: 6-14 words. One specific fantasy atmospheric element.

━━━ CATEGORIES ━━━
- God-rays (shafts piercing through cathedral ceiling, forest canopy, mist)
- Swirling mist (magical fog curling around castle, moody valley fog)
- Floating embers (rising from battlefield or forge)
- Magical sparks (arcane energy motes drifting)
- Falling leaves (autumn golden leaves in backlight)
- Dragon-smoke (dense rising smoke from lair)
- Lightning-arcs (magical electricity crackling)
- Dust-motes in beam (sunlight revealing suspended dust)
- Snow-drift in wind (blowing snow mid-landscape)
- Rain-curtain distant (heavy rain visible distance)
- Fog-tendrils snaking through ruins
- Torch-smoke rising against stone
- Pollen-haze forest (golden motes in green light)
- Spirit-wisps drifting (glowing orbs floating)
- Ash-drift from volcano or pyre
- Glowing-petal drift (magical blossoms)
- Snowfall on cathedral-peak
- Dragon-fire heat-shimmer
- Runes-in-air glowing drift
- Sand-blown desert fantasy haze
- Moonlight through forest-canopy mist
- Heat-haze from battle
- Banner-fabric wind-whipped visible
- Sparks from anvil forge
- Incense-smoke swirls up at altar

━━━ RULES ━━━
- Epic fantasy atmospheric elements
- Painterly / rendered / adds depth

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
