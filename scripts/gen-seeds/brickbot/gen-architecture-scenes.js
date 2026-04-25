#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/architecture_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} LEGO ARCHITECTURE scene descriptions for BrickBot. Each is a stunning building or structure — the architecture itself is the art.

Each entry: 15-25 words. One specific building or structure.

━━━ BUILDING TYPES (mix broadly across ALL) ━━━
- Famous landmarks reimagined: Eiffel Tower, Taj Mahal, Colosseum, Sydney Opera House
- Gothic cathedrals with flying buttresses, rose windows, spires
- Art Deco skyscrapers with stepped setbacks, gold accents, ornate lobbies
- Futuristic towers with transparent glass facades, cantilever terraces
- Brutalist concrete megastructures, raw geometric power
- Japanese temples and pagodas with curved roofs, zen gardens
- Fantasy castles with impossible physics, floating towers, crystal domes
- Treehouse mansions woven through giant tree trunks
- Underwater domed cities, transparent walls showing ocean
- Ancient ruins: Greek temples, Roman aqueducts, Egyptian pyramids
- Modern museums: swooping curves, glass atria, sculptural forms
- Victorian mansions with turrets, wrap-around porches, gingerbread trim
- Space stations and orbital habitats
- Bridges: suspension, covered, medieval stone, futuristic glass

━━━ RULES ━━━
- The BUILDING is the subject, not a scene around it
- Emphasize architectural detail and build technique
- Vary style, era, scale, and mood dramatically
- No repeats

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
