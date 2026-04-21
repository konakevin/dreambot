#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/animalbot/seeds/atmospheres.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} ATMOSPHERIC DETAIL descriptions for AnimalBot — specific particle / moisture / weather elements that add realism and drama to wildlife scenes.

Each entry: 8-16 words. One specific atmospheric element.

━━━ CATEGORIES ━━━
- Dust (golden dust kicked by running herd, amber dust-motes in backlight)
- Mist and fog (low ground fog, morning mist, rising steam, valley fog)
- Snow (drifting snow, snow-fall-on-fur, snowflakes in backlight)
- Rain (rain-droplets on coat, heavy rain in backlight, mist-rising-after-rain)
- Frost / breath (visible exhaled breath, frost on fur, ice-crystals in air)
- Pollen / seeds (drifting pollen, dandelion fluff, floating seed-wisps)
- Backlit particulate (sun-through-dust, sun-through-mist, sun-through-snow)
- Leaves and fall (autumn leaves mid-fall, petals drifting, needles catching light)
- Water-spray (from shaking wet fur, from river splash, from surf)
- Tall-grass motion (grass bending in wind, wheat swaying)
- Bubbles / spray (for shoreline/freshwater animals)
- Sand (sand-plume from hooves, dust-devil background)
- Heat haze (shimmer over desert or prairie)
- Moisture (humid jungle atmosphere, steamy hot-spring vapor)
- Ash / volcanic (soft ash falling, smoke plume distant)

━━━ RULES ━━━
- Earth-plausible atmospheric elements only
- Specific and nameable
- Adds depth + drama + realism to wildlife image
- Supports hero-animal composition

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
