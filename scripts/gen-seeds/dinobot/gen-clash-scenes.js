#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dinobot/seeds/clash_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} TERRITORY CLASH scene descriptions for DinoBot — two dinosaurs squaring off in dominance displays, territorial disputes, or mating-rights confrontations.

Each entry: 15-25 words. One specific confrontation scenario with species matchup + behavior + setting.

━━━ CATEGORIES ━━━
- Ceratopsians locking horns, ground torn up beneath them
- Theropods circling each other with threat displays, jaws open
- Pachycephalosaurs headbutting on a ridgeline
- Rival males displaying for a watching female
- Territorial roaring across a river or clearing
- Young challenger approaching an established alpha
- Two predators disputing a hunting territory
- Herbivore defending calves from another species
- Stegosaurs swinging thagomizer tails in warning
- Ankylosaurs clashing armored flanks

━━━ RULES ━━━
- TENSION and POWER, never gore
- Two animals facing each other — the confrontation is the subject
- Include environmental reaction (birds scattering, ground shaking, dust rising)
- Realistic animal behavior, not movie-monster fighting

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
