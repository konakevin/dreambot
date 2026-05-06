#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mechbot/seeds/industrial_settings.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} SETTING descriptions for MechBot's industrial-machines path. Each describes WHERE the work is happening, 14-22 words. Industrial work environments — gritty, productive, dust + sparks + fluorescents.

━━━ SETTING CATEGORIES ━━━
- Open-pit strip mine (terraces of red earth, distant haul trucks, dust haze)
- Asteroid surface mining op (low-grav tethers, derrick array, starfield above)
- Refinery / cracking plant (flare stacks at night, pipe forests, catalyst smoke)
- Factory floor (overhead cranes, fluorescent ceilings, conveyor arms, cargo containers)
- Construction site (scaffolds, half-built structure, crane sweep, rebar forests)
- Salvage yard (wrecked ships/mechs being parted, piles of plate, cutting torches)
- Shipyard cradle (half-built hull on a slipway, gantries, sparks falling)
- Underground tunnel borer face (dim sodium light, drilled rock, conveyor)
- Cargo dock / spaceport loading bay (transport ships parked, cranes unloading)
- Pumping station / pipeline node (industrial valves, gauge banks, steam venting)

━━━ ATMOSPHERIC ELEMENTS ━━━
- Industrial haze / dust / steam / coolant vapor / catalyst fumes
- Fluorescent / sodium / mercury / arc-light sources
- Time-of-day cue (night shift floodlights / dawn dust-glow / overcast industrial)

━━━ EXAMPLES (write fresh) ━━━
- "Open-pit mine at dawn, terraced red-earth walls, dust haze, distant haul trucks like ants"
- "Refinery at night, flare stacks burning, pipe forest backlit, catalyst smoke drifting orange"
- "Asteroid surface in low-grav, tether cables crisscrossing, derrick array silhouetted against starfield"

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: industry environment + time-of-day + atmospheric byproduct.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
