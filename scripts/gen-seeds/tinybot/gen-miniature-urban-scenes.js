#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/tinybot/seeds/miniature_urban_scenes.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} MINIATURE URBAN SCENE descriptions for TinyBot's miniature-urban path — tiny perfect urban scenes. Tilt-shift makes real things feel dollhouse.

Each entry: 15-30 words. One specific miniature urban scene.

━━━ CATEGORIES ━━━
- Downtown intersection at dusk (tilt-shift real-city-feel)
- Miniature Paris cafe-terrace
- Tiny Tokyo crossing (Shibuya-style)
- Dollhouse-scale New York yellow-cab street
- Miniature subway platform with tiny trains
- Rooftop-village (tiny apartments rooftop with gardens)
- Tiny market stalls with produce
- Miniature Italian piazza with fountain
- Dollhouse-scale London street
- Tiny Moroccan market (souk)
- Miniature Chinatown street
- Dollhouse amusement park
- Tiny carnival midway
- Miniature shopping mall interior
- Dollhouse bus-terminal
- Tiny airport boarding-gate
- Miniature European square with trams
- Dollhouse Italian gelato-shop
- Tiny French bistro street-corner
- Miniature Indian spice market
- Dollhouse Vegas strip
- Tiny Russian Red-Square
- Miniature Manhattan-skyline (tilt-shift)
- Dollhouse Istanbul bazaar
- Tiny Venice canal with gondolas
- Miniature Prague cobble-street
- Dollhouse Havana street
- Tiny Mumbai train-station
- Miniature Cairo bazaar
- Dollhouse Amsterdam canal
- Tiny Seoul food-street
- Miniature Lisbon tram-street
- Dollhouse Edinburgh Royal-Mile
- Tiny San-Francisco cable-car street

━━━ RULES ━━━
- Real urban places miniaturized
- Tilt-shift feel
- Countable detail
- Named city / style where possible

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
