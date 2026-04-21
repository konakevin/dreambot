#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/atmospheres.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} ATMOSPHERIC DETAIL descriptions for EarthBot — specific particle / mist / moisture elements that add depth and realism to Earth scenes.

Each entry: 8-16 words. One specific atmospheric element.

━━━ CATEGORIES ━━━
- Mist and fog (valley fog, morning mist, sea mist, ground fog, fog-banks in forest)
- Dust and haze (desert haze, wildfire haze, dust-storm veil, volcanic ash-haze)
- Moisture (heavy humidity, mist-rising-from-creek, sunlit steam from wet stone)
- Particle atmosphere (pollen drifting, dandelion fluff, drifting snow, ice crystals, salt spray)
- Sun-through-medium effects (sun-through-mist beams, sun-through-dust rays, sun-through-fog god-rays)
- Rain presence (distant rain curtain, after-rain sheen, rain-on-water ripples)
- Snow / ice (snow-fall-in-pine-boughs, ice-crystals-in-air, frost on every surface)
- Wind signatures (grass bending in wind, leaves mid-fall, water-rippled, snow-plume on ridge)
- Steam / geothermal (hot-spring steam, geyser plume, volcanic vent steam)
- Drifting elements (drifting leaves, falling petals from wild tree, autumn leaves mid-fall)

━━━ RULES ━━━
- Earth-plausible ONLY (no fantasy particles, no bioluminescent motes)
- Specific + namable — not "nice atmosphere"
- Adds depth + realism + scale to the scene

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
