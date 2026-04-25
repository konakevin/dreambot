#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dinobot/seeds/herd_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} HERD MIGRATION scene descriptions for DinoBot — massive groups of dinosaurs moving together across prehistoric landscapes.

Each entry: 15-25 words. One specific herd scenario with terrain + behavior + scale.

━━━ CATEGORIES ━━━
- Sauropod herds crossing rivers, kicking up spray, juveniles staying close to adults
- Hadrosaur migration across open fern prairies, hundreds stretching to the horizon
- Ceratopsian stampede through dust clouds, horned heads forming a wall
- Mixed-species herds following seasonal rains through ancient forests
- Herd at rest — drinking, grazing, juveniles play-fighting at the edges
- Dawn/dusk migrations with silhouettes against prehistoric skies
- Herds navigating narrow mountain passes or volcanic terrain
- Crossing flooded plains, wading through chest-deep water
- Herd encountering a predator threat — circling young, facing outward

━━━ RULES ━━━
- Emphasize SCALE — dozens to hundreds of animals
- Include terrain interaction (dust, mud, water, ferns crushed underfoot)
- Mix ages — adults, juveniles, elderly
- No gore, no active killing

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
