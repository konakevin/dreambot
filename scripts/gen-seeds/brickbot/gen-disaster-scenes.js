#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/disaster_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} LEGO DISASTER scene descriptions for BrickBot. Catastrophic moments frozen in plastic — destruction has never been so fun.

Each entry: 15-25 words. One specific disaster scene.

━━━ SCENE TYPES (mix broadly) ━━━
- Volcano erupting, lava flow of transparent orange/red bricks engulfing village
- Tidal wave of blue pieces crashing into coastal city
- Meteor shower, grey boulder bricks smashing through buildings
- Tornado scattering bricks across farmland, barn mid-collapse
- Earthquake cracking baseplate apart, buildings tilting
- Avalanche of white bricks burying mountain village
- Bridge collapse with vehicles frozen mid-fall
- Building demolition, dust cloud of grey pieces
- Flood waters rising through city streets, rooftop rescues
- Wildfire consuming forest, transparent flame pieces spreading

━━━ RULES ━━━
- Mid-collapse action frozen in time
- Bricks flying, structures crumbling, transparent pieces for effects
- Minifigs fleeing or reacting — fun-scary, not grim
- Maximum chaos energy in plastic
- No repeats

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
