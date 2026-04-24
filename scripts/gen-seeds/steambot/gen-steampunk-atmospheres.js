#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/steambot/seeds/steampunk_atmospheres.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} STEAMPUNK ATMOSPHERIC DETAIL descriptions for SteamBot — steampunk atmospheric elements.

Each entry: 6-14 words. One specific steampunk atmospheric element.

━━━ CATEGORIES ━━━
- Steam-wisps (curling white steam from valves)
- Coal-smoke (black smoke from chimneys)
- Gaslight-flicker (warm flame wavering)
- Brass-dust in sunbeam
- Gear-oil-gleam (light reflected off oiled brass)
- Airship-sail-flutter (canvas billowing)
- Clockwork-ticks (implied by detail)
- Forge-ember-drift (sparks floating)
- Ash-in-air (industrial haze)
- Smog-filtered-sunlight (amber through pollution)
- Rain-on-brass (drops on polished metal)
- Fog-through-gears (industrial fog)
- Sparks from welding
- Tesla-coil arcs
- Leather-dust motes
- Parchment-dust from old books
- Copper-patina blooming (green oxidation)
- Smoke-rings rising
- Steam-cloud from vent
- Gaslight-shadow dancing on wall
- Dust-lit sunbeam through workshop window
- Propeller-wash visible
- Gunpowder-smoke after shot
- Candle-soot
- Steam-geyser from pipe-burst
- Oil-sheen on puddle
- Snow-on-brass-statue
- Heat-distortion from forge
- Glowing-embers drift from chimney
- Mechanical-bird-flutter

━━━ RULES ━━━
- Steampunk atmospheric variety
- Brass / copper / steam / smoke / gaslight flavor
- Painterly / renderable

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
