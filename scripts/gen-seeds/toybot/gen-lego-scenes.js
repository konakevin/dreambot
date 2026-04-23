#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/lego_scenes.json',
  total: 200,
  batch: 10,
  append: true,
  metaPrompt: (n) => `You are writing ${n} LEGO SCENE descriptions for ToyBot's lego-epic path — epic LEGO scenes with minifigure action. Brick-everything. Cinematic movie-still composition.

Each entry: 15-30 words. One specific epic LEGO scene with action.

━━━ CATEGORIES ━━━
- Castle siege (LEGO knights charging, catapults mid-launch, brick-flag flying)
- Space station (LEGO astronauts mid-EVA, brick-rocket launching)
- Pirate battle (LEGO pirate-ship cannons firing, brick-waves)
- Dragon battle (LEGO dragon mid-breath, knights mid-swing)
- City-street chase (LEGO police + getaway car + brick-buildings)
- Jungle temple raid (LEGO adventurer + brick-idol + falling-brick trap)
- Ninja rooftop battle (LEGO ninjas mid-leap between brick-roofs)
- Volcano escape (LEGO adventurer running from brick-lava)
- Underwater discovery (LEGO diver + brick-submarine + coral)
- Snowy mountain rescue (LEGO climbers + brick-avalanche)
- Medieval tournament (LEGO knights jousting)
- Wild west showdown (LEGO cowboys at high-noon)
- Desert archaeology (LEGO digger + brick-mummy-tomb)
- Train robbery mid-action (LEGO steam-train)
- Spaceship landing at alien world (brick-planet)
- Pirate treasure cave (gold-brick stacks, LEGO pirate)
- Medieval market street (LEGO villagers + brick-stalls)
- Winter-village Christmas scene (warm windows, brick-snow)
- Racetrack finish-line (LEGO race cars crossing)
- Construction site action (LEGO bulldozer + crane)
- Firehouse emergency response (LEGO firefighters mid-action)
- Haunted mansion (LEGO ghost-minifig + brick-chandelier falling)
- Monster truck rally mid-jump
- Mech battle (LEGO mech vs mech)
- Alien invasion (flying-saucer + brick-city panic)
- Airplane dogfight (LEGO planes mid-combat)
- Safari expedition (LEGO jeep + brick-lions)
- Cave exploration (LEGO spelunker + brick-stalactites)
- Lighthouse storm (LEGO keeper + brick-waves crashing)
- Brick-zoo feeding time

━━━ RULES ━━━
- LEGO bricks visible throughout
- Minifigure action, mid-moment
- Cinematic composition
- "Epic" scale

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
