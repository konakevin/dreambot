#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/oceanbot/seeds/kraken_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} SEA MONSTER / LEVIATHAN descriptions for OceanBot. Kraken tentacles, massive serpentine bodies, ancient behemoths, mythic scale encounters on the ocean.

Each entry: 15-25 words. One specific sea monster scene.

━━━ CREATURE TYPES (mix broadly across all) ━━━
- Kraken tentacles rising around old wooden ships, suckers gripping hulls
- Sea serpent bodies breaking the surface in massive coils
- Whirlpools caused by something enormous turning beneath
- Ancient leviathans visible beneath ship hulls, eye the size of a lifeboat
- Megalodon silhouettes dwarfing modern vessels from below
- Colossal squid arms reaching up from the deep toward surface light
- Mythic whale — Moby Dick scale, scarred and ancient
- Tentacles pulling masts underwater while waves crash
- Serpentine body arcing over a ship like a living bridge
- Multiple creatures surfacing simultaneously, pod of leviathans
- Single massive eye reflecting moonlight just below the surface
- Dragon-turtle shells breaking the surface like living islands

━━━ RULES ━━━
- SCALE is everything — these creatures dwarf ships and comprehension
- Mix creature types across entries (kraken, serpent, leviathan, megalodon, colossal squid, mythic whale)
- Specific dramatic moments, not generic "big monster"
- No repeats — every entry a unique encounter
- Vivid, cinematic language

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
