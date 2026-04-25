#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/cinematic_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} LEGO CINEMATIC scene descriptions for BrickBot. Iconic blockbuster movie moments rebuilt in LEGO — NOT specific IP, but original scenes that FEEL like movies.

Each entry: 15-25 words. One specific cinematic action scene.

━━━ SCENE TYPES (mix broadly) ━━━
- Car chase through brick city, vehicles mid-drift, sparks from transparent pieces
- Heist scene: minifigs rappelling down building, laser grid from red transparent pieces
- Spy thriller: rooftop pursuit, helicopter overhead, briefcase exchange
- War epic: beach landing with brick boats, explosions, smoke
- Disaster movie: skyscraper collapsing, rescue helicopters, evacuation
- Martial arts showdown on bamboo scaffolding, mid-kick freeze
- Western standoff: three minifigs on dusty main street at high noon
- Jungle adventure: rope bridge over gorge, boulder rolling behind
- Bank robbery getaway: armored truck, motorcycle pursuit, roadblock
- Submarine thriller: torpedo launch, depth charges, underwater explosion

━━━ RULES ━━━
- NO specific movie/franchise references — original scenes only
- Cinematic widescreen framing, Dutch angles, dramatic depth of field
- Action frozen mid-frame with motion blur energy
- Smoke, sparks, debris — all made of LEGO pieces
- No repeats

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
