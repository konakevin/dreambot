#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mechbot/seeds/industrial_subjects.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} INDUSTRIAL MACHINE descriptions for MechBot's industrial-machines path. Each describes a working heavy-industry machine, 14-22 words.

Each entry: industry role + body plan + signature equipment + scale anchor + scuff/wear language.

━━━ INDUSTRY VARIETY ━━━
- Mining (drill walkers, strip-miners, quarry rigs, deep-shaft borers)
- Salvage (wreck-pickers, derelict-stripping rigs, scrap walkers)
- Construction (welder mechs, crane-platforms, girder-lifters, pile-drivers)
- Cargo / loading (Aliens-style cargo loaders, dock loaders, gantry haulers)
- Refinery (cracking-tower automatons, pipeline crawlers)
- Manufacturing (factory floor articulators, assembly walkers)
- Asteroid / off-world (vacuum-rated rigs, low-grav haulers)
- Forestry / harvesting (tree-fellers, biomass walkers)
- Agriculture-scale (giant harvester walkers — Mortal Engines vibe)

━━━ BODY PLAN VARIETY ━━━
- Bipedal humanoid (Aliens cargo loader)
- Quadrupedal walker
- Tracked tank-base
- Wheeled multi-axle
- Hovering on lift-jets
- Hexapedal spider-rig
- Multi-arm articulator (no leg base — anchored)

━━━ AESTHETIC LANGUAGE ━━━
- SCUFFED, dirty, dust-coated, hydraulic-fluid-streaked, BUT in working order
- Riveted plate / corrugated panels / exposed pistons / stamped serial numbers
- Visible ductwork, coolant lines, cable bundles
- Faded factory paint (yellow / orange / safety-stripe accents)

━━━ EXAMPLES (write fresh) ━━━
- "Six-armed strip-mining walker with diamond-bit drill arms, chunky tracks, ore-streaked yellow plate, three stories tall"
- "Bipedal cargo loader, exposed pilot frame, rubber-tipped grip claws, blue safety stripes, steam venting from dorsal exchanger"
- "Quadrupedal asteroid-surface miner, vacuum-sealed joints, dust-caked white plate, twin core-sample borers stowed on flank"

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: industry role + body plan + signature tool/equipment.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
