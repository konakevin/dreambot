#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mermaidbot/seeds/warrior_settings.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} WARRIOR/BATTLE SETTING descriptions for MermaidBot's mermaid-warrior path. Battle-scarred underwater environments — ancient ruins being defended, enemy territory, military installations of an ocean kingdom.

Each entry: 10-20 words. A specific warrior setting.

━━━ CATEGORIES TO COVER ━━━
- Sunken fortress gate with coral-forged portcullis and guard posts
- Underwater battlefield aftermath, broken weapons and scattered armor in silt
- Ancient ocean temple entrance guarded by carved stone leviathans
- Shipwreck turned into a defensive outpost, hull reinforced with coral
- Volcanic vent ridge used as a natural defensive line
- Deep trench border crossing where two ocean kingdoms meet
- Armory cavern with racks of tridents, harpoons, and coral-blade weapons
- Watchtower spire rising from the ocean floor, bioluminescent beacon at top
- Training grounds with coral obstacle course and target dummies of kelp
- Kraken's lair entrance, massive tentacle marks scored into the rock walls

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: military function + geological setting.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
