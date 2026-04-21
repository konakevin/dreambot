#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/alien_landscapes.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} ALIEN LANDSCAPE descriptions for StarBot's alien-landscape path — surfaces of alien planets. Bioluminescent, crystal-spire, floating-coral, methane-lakes. Fictional but plausible alien geography.

Each entry: 15-30 words. One specific alien planet surface.

━━━ CATEGORIES ━━━
- Bioluminescent Pandora-jungles (glowing fronds, blue-pollen drift, twilight canopy)
- Crystal-spire deserts (obsidian-black sand with refracting-crystal towers)
- Floating-coral forests (suspended reef-structures with gas-cells, amber light)
- Methane-lakes under two moons (orange liquid methane, pink-moon reflections)
- Ammonia-clouds ocean (rolling pale clouds over gas-giant surface)
- Volcanic-planet mid-eruption (molten rivers across obsidian plains)
- Frozen-methane tundra (ice-cap with geysers of methane)
- Red-desert dune sea (rust-colored dunes under pale-pink sky)
- Fungal jungle (massive alien mushroom forest with glowing spore drift)
- Gas-giant-moon surface with planet filling sky
- Plasma-storm plateau (constant lightning across metallic ground)
- Ocean-world with vast waves (no land, kilometers-tall waves)
- Crystal-cave descent (underground cavern with prismatic growths)
- Floating-island archipelago (aerial islands with waterfalls off edges)
- Obsidian-mirror plains (reflective black surface to horizon)
- Hexagonal-basalt plateau with geyser fields
- Twin-star desert (bleached-white dunes, two suns overhead)
- Acid-rain forest (trees with metal-resistant bark, colored rain)
- Gravity-anomaly zone (rocks floating mid-air at different elevations)
- Sand-sea at dawn (endless dunes with first-light on one side)
- Alien-coral reef (dry above-water reef structures)
- Glacial-methane tundra with aurora
- Vine-covered alien ruins with exotic flora reclaiming
- Tidal-locked-planet dusk-strip (permanent twilight band)
- Binary-moon shore (beach with two moons rising)

━━━ RULES ━━━
- Alien but plausible planetary geography
- Specific atmospheric / color / light detail
- No characters (pure landscape)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
