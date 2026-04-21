#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/earth_weather_phenomena.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} EARTH WEATHER PHENOMENA descriptions for EarthBot's "weather-moment" path. Ground-level Earth weather dialed up — the "I cannot believe I caught this" weather photograph moment.

Each entry: 15-30 words. One specific weather event on a specific earthly ground context.

━━━ CATEGORIES TO DRAW FROM ━━━
- Aurora borealis on Icelandic ice field
- Supercell thunderstorm over Kansas prairie
- Fog rolling through coastal redwood forest
- Monsoon rain sheeting over rice terraces
- Blood-moon rising over desert mesas
- Dust storm approaching Arizona rangeland
- Snow squall rolling across frozen lake
- Rainbow after thunderstorm over canyon
- Fog-fingers creeping through mountain pass
- Ice fog hanging over taiga at -40
- Lightning fork over Patagonian peaks
- Sea mist swirling around basalt sea stacks
- Sandstorm approaching oasis
- Hail-curtain over wheat field
- Blizzard whiteout in boreal forest
- Chinook wind over Alberta prairie
- Desert monsoon over red rock mesas
- Tornado distant over open plains (far away, safe scale)
- Heavy snowfall on spruce-fir forest

━━━ RULES ━━━
- NO humans
- NO animal subjects
- Ground-level weather — NOT sky-dominated (that's sky_phenomena)
- Dialed up to dramatic — but plausible Earth physics
- NO fantasy, NO cosmic

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
