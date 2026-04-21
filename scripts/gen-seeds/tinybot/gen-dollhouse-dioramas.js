#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/tinybot/seeds/dollhouse_dioramas.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} DOLLHOUSE DIORAMA descriptions for TinyBot's diorama path — technical-wonder dollhouse-scale dioramas. Countable detail density. Train stations, cityscapes, ballrooms, medieval castles, markets.

Each entry: 15-30 words. One specific dollhouse diorama with detail notes.

━━━ CATEGORIES ━━━
- Model train station with miniature passengers and platforms
- Victorian dollhouse cross-section (multiple rooms visible)
- Medieval castle cross-section (throne room, kitchens, towers)
- Dollhouse bakery with tiny pastries on display
- Dollhouse library with miniature books and reading chairs
- Tiny farmer's market stalls with fruit-vegetable crates
- Miniature Paris cafe-corner with tables and umbrellas
- Dollhouse ballroom with chandelier and dancers (mannequin-figures)
- Model wedding-scene with tiny guests
- Model church interior with tiny pews
- Dollhouse Christmas-scene with tree and presents
- Miniature factory floor with conveyor-belts
- Model airport terminal with tiny planes
- Dollhouse fire-station with engines ready
- Miniature school classroom with tiny desks and books
- Dollhouse doctor's office with exam-tables
- Miniature harbor with docked ships
- Model Mayan pyramid cross-section
- Dollhouse Tudor-inn with fireplace
- Miniature garden-center with rows of plants
- Dollhouse Victorian dining-room table-set
- Model Japanese-tea-house diorama
- Miniature Parisian boulangerie with croissants
- Dollhouse general-store with stocked shelves
- Model art-gallery with tiny paintings
- Tiny observatory with telescope and star-charts
- Miniature train switchyard with multiple tracks
- Dollhouse wizard's-tower cross-section
- Model medieval village street
- Miniature wild-west saloon interior
- Dollhouse tea-party setup outdoors
- Model fishing village with boats
- Miniature barber-shop with chairs
- Dollhouse pirate-ship cross-section
- Tiny museum exhibit hall

━━━ RULES ━━━
- Technical wonder / obsessive detail
- Countable elements ("look at ALL that detail")
- NO human figures as subject (mannequin-figures for scale only)
- Tilt-shift miniature aesthetic

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
