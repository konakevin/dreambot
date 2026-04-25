#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dinobot/seeds/volcanic_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} VOLCANIC APOCALYPSE scene descriptions for DinoBot — dinosaurs amid volcanic eruptions, lava flows, ash storms. Dramatic natural disaster meets prehistoric life.

Each entry: 15-25 words. One specific volcanic scenario with species + eruption element + dramatic setting.

━━━ CATEGORIES ━━━
- Herds fleeing across a plain as a volcanic eruption fills the sky behind them
- Single dinosaur silhouetted against a lava flow at night
- Ash falling like snow on a confused herd
- Pyroclastic cloud rolling down a mountainside toward a river valley
- Lava river cutting through a forest, dinosaurs on the far bank watching
- Volcanic lightning storm illuminating fleeing pterosaurs
- Hot springs and geysers with dinosaurs cautiously approaching
- Caldera lake with steam rising, dinosaurs drinking from warm water
- Volcanic island with nesting seabirds and marine reptiles
- Fresh lava field cooling, first plants growing, small dinosaurs returning

━━━ RULES ━━━
- Dramatic and awe-inspiring, not gory
- The volcano is the co-star — fire, ash, lava, lightning
- Dinosaurs react naturally — fleeing, watching, enduring
- Mix catastrophic and calmer volcanic settings

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
