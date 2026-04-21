#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/atmospheres.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} ATMOSPHERIC DETAIL descriptions for ToyBot — practical-set atmospheres.

Each entry: 6-14 words. One specific toy-set atmospheric element.

━━━ CATEGORIES ━━━
- Explosion smoke (practical-smoke-effect)
- Tabletop dust motes
- Cotton clouds (literal cotton-ball clouds)
- Glitter mist
- Practical smoke from fogger
- Paper-confetti explosion
- Shredded-paper snow
- Dry-ice mist
- Fabric-steam (felt-steam)
- Clay-smoke (rolled tiny)
- Tiny-fire sparks
- Practical-laser beams
- Flour-dust (bakery scene)
- Glitter explosion
- Cotton-tuft clouds
- Paper-flake snow
- Glitter-rain
- Practical rain-droplets
- Debris mid-explosion
- Tiny-leaves drifting (paper cutouts)
- Felt-spark mid-air
- Pom-pom bombs
- Tiny-confetti from cannon
- Dust-from-crumbling-brick
- Glitter-dust on table
- Clay-smoke from chimney
- Practical-steam from kettle
- Fabric-clouds overhead
- Paper-petals drift
- Yarn-tassel spray
- Stuffing-burst from toy
- Tiny-fireflies (tiny-LEDs)
- Glitter-underwater
- Practical-bokeh lights background
- Paper-airplane-swarm
- Tiny-balloon cluster
- Smoke-from-tabletop-fog-machine
- Glitter-sparkle backlit

━━━ RULES ━━━
- Practical / tabletop-achievable effects
- Toy-photography-authentic

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
