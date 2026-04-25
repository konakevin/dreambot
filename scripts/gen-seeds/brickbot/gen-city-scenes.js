#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/city_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} LEGO CITY scene descriptions for BrickBot. Each is a specific urban scene built entirely from LEGO bricks — streets, buildings, vehicles, minifigs going about city life.

Each entry: 15-25 words. One specific city scene.

━━━ SCENE TYPES (mix broadly) ━━━
- Downtown streets with shops, cafes, restaurants, storefronts
- Construction sites with cranes, scaffolding, cement mixers
- Fire stations, police chases, hospital emergencies
- Train stations, airports, bus depots, subway platforms
- Parks, plazas, fountains, street markets
- Skyscrapers, rooftop scenes, window washers
- Rush hour traffic, taxi cabs, delivery trucks
- Street festivals, parades, outdoor concerts
- Neighborhoods at night, neon signs, streetlamps
- Harbors, marinas, waterfront boardwalks

━━━ RULES ━━━
- Every element is LEGO — specify brick types where possible
- Include minifig activity and city life energy
- Vary time of day, weather, season, mood
- No repeats — each scene is unique

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
