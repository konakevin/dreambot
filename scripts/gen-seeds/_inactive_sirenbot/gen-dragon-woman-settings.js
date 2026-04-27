#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/sirenbot/seeds/dragon_woman_settings.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} DRAGON-WOMAN SETTING descriptions for SirenBot's dragon-woman path. Volcanic lairs, mountain peaks, treasure hoards, fire-scarred landscapes — the territory of a half-dragon being.

Each entry: 10-20 words. A specific draconic environment.

━━━ CATEGORIES TO COVER ━━━
- Volcanic caldera interior with lava flows and obsidian formations
- Mountain peak above the clouds at sunrise, wind howling
- Treasure hoard cavern with gold coins, gemstones, and ancient weapons
- Dragon's nest on a cliff ledge lined with shed scales and bones
- Volcanic hot spring surrounded by black basalt and steam vents
- Ruined fortress on a volcanic island, half-melted stone walls
- Crystal cave with geode formations reflecting firelight
- Scorched battlefield with cracked earth and smoldering craters
- Ancient dragon temple with massive carved pillars and fire braziers
- Cliff face lair entrance overlooking a vast forested valley
- Geothermal vent field with mineral-stained rocks and boiling pools
- Storm-wracked mountain ridge with lightning striking nearby peaks

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: geological feature + heat source + altitude.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
