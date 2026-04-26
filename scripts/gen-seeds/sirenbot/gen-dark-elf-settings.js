#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/sirenbot/seeds/dark_elf_settings.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} DARK ELF / DROW SETTING descriptions for SirenBot's dark-elf path. Subterranean cities, underground palaces, cavern marketplaces, spider-silk workshops. The Underdark.

Each entry: 10-20 words. A specific underground dark-elf environment.

━━━ CATEGORIES TO COVER ━━━
- Obsidian palace halls with bioluminescent crystal chandeliers
- Spider-silk weaving chambers with giant looms and glowing thread
- Underground mushroom forests with towering fungi and phosphorescent spores
- Cavern marketplace lit by enchanted lanterns, stalls of rare goods
- Subterranean lake shore with blind fish and crystalline formations
- Poison garden of luminous toxic plants tended in a grotto
- Assassin's training hall with shadow-magic obstacle courses
- Temple of a spider goddess with web-draped altars
- Bridge over a bottomless chasm, stalactites dripping above
- Library carved into cavern walls, scrolls glowing with preserved magic
- Forge deep in volcanic rock, dark metal being shaped
- Balcony overlooking a vast underground city of spired towers

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: location function + light source type + cavern scale.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
