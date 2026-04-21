#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/steambot/seeds/lighting.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} LIGHTING descriptions for SteamBot — steampunk lighting treatments.

Each entry: 10-20 words. One specific steampunk lighting treatment.

━━━ CATEGORIES ━━━
- Brass-glow warm (brass surfaces catching warm light)
- Gaslight warm (multi-lamp warm amber interior)
- Forge-amber (molten-brass glow on figures)
- Moonlit-copper (silver moonlight on copper surfaces)
- Smoke-filtered-sun (amber through industrial smoke)
- Cloud-shaft-through-airship-window (dramatic beam)
- Gaslit street-corner (single warm puddle of light)
- Factory-skylight-shaft (heavenly beam through dirty glass)
- Candle-cluster intimate (multiple candles warm)
- Lantern-lit-alley (lone lantern in fog)
- Fire-and-iron forge (blazing orange)
- Steam-diffused-morning (soft sun through steam)
- Chandelier-crystal warm (brass-and-crystal fixture)
- Tesla-coil-blue (electric arcs key-light)
- Oil-lamp-desk (single pool of light on paper)
- Moonlight-through-zeppelin-canvas (silvery filtered)
- Airship-spotlight piercing cloud
- Spotlight-through-smog
- Alchemical-glow (colored potion-light)
- Backlit-silhouette against forge-fire
- Clockwork-gears-lit warm from below
- Dawn-through-broken-roof (industrial decay-light)
- Lamplight-on-cobblestones wet-brick
- Inner-mechanism-glow (gears lit from inside)
- Brass-railing-catch sunset
- Gear-reflected candle (light bouncing in gear-teeth)
- Furnace-door-open (orange blast)
- Skyline-smoke at dusk (silhouetted smokestacks)
- Railway-station-lamp warm
- Observatory-stars through brass-telescope
- Dust-motes in brass-workshop light
- Low-angle forge-light dramatic
- Gas-lamp flickering outside window
- Brass-polished surface caught by sunset

━━━ RULES ━━━
- Steampunk-specific treatments
- Brass / copper / gaslight warm palette emphasis
- Named specific

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
