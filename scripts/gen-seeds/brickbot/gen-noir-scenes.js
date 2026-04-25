#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/noir_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} LEGO NOIR scene descriptions for BrickBot. Dark moody detective stories in LEGO — film noir meets toy photography.

Each entry: 15-25 words. One specific noir scene.

━━━ SCENE TYPES (mix broadly) ━━━
- Rain-slicked brick street, fedora minifig under streetlamp, long shadow
- Neon signs from transparent colored pieces reflecting on wet brick road
- Smoky bar interior, bartender minifig polishing glass, lone patron
- Rooftop stakeout, binoculars, thermos, city lights below
- Dark alleyway, fire escape shadows, mysterious figure in trench coat
- Detective office, desk lamp, scattered case files, bourbon glass
- Getaway car under bridge, headlights cutting through fog
- Jazz club, stage spotlight on singer minifig, audience shadows
- Warehouse confrontation, single hanging bulb, crates stacked high
- Docks at midnight, cargo ship silhouette, fog rolling in

━━━ RULES ━━━
- High contrast, deep shadows, single light sources
- Venetian blind shadow patterns, rain reflections, neon glow
- Moody, atmospheric, lonely minifigs in dangerous plastic worlds
- Film noir cinematography translated to LEGO
- No repeats

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
