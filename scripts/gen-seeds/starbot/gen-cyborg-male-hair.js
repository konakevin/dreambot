#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/cyborg_male_hair.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} HAIR STYLE descriptions for a male cyborg character. Each describes one specific hairstyle — color, length, texture, and any mechanical/sci-fi elements.

Each entry: 8-15 words. One hair style with color + length + texture + optional sci-fi element.

━━━ CATEGORIES (spread evenly) ━━━
- Short military styles (buzz cuts, crew cuts, fades, high-and-tight)
- Medium textured styles (pushed back, swept, tousled, windblown)
- Shaved/bald (fully shaved with visible chrome skull plates, neural ports, circuit tattoos)
- Undercuts (with chrome/circuit reveals at temples or sides)
- Longer styles (swept back, tied back, shoulder length — masculine)
- Sci-fi enhanced (fiber-optic strands, chrome roots, neural-link ports at scalp)
- Weathered/grayed (salt-and-pepper, silver-streaked, battle-worn)
- Unusual colors (platinum, dark copper, ash white, steel gray)

━━━ RULES ━━━
- Masculine-coded styles — short to medium, utilitarian, sharp
- Mix natural hair with sci-fi augmentation (chrome scalp ports, circuit tattoos, etc.)
- Vary color and ethnicity-appropriate textures widely
- Some purely natural, some with visible mechanical scalp hardware

━━━ DEDUP ━━━
No two entries should share the same color AND same cut AND same sci-fi element.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
