#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/oceanbot/seeds/ghost_ships.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} GHOST SHIP descriptions for OceanBot. Derelict sailing vessels — tattered sails, barnacle-crusted hulls, fog-shrouded galleons, phantom energy. NO crew visible. Empty, haunted, adrift.

Each entry: 15-25 words. One specific ghost ship scene.

━━━ CATEGORIES (mix across all) ━━━
- Tattered sails hanging from rotting masts in dead-calm fog
- Barnacle-crusted hulls listing in moonlit water, no souls aboard
- Fog-shrouded galleons emerging from mist banks at dawn
- Drifting lanterns still lit on empty decks, no explanation
- Phantom silhouettes of ship rigging against a blood-red sunset
- Flying Dutchman energy — impossible ship in impossible conditions
- Moonlit ghost fleets, multiple derelicts drifting in formation
- Ice-encrusted ghost ships locked in arctic pack ice
- Coral and kelp growing through hull planks of long-lost vessels
- Bioluminescent algae outlining a derelict hull in green glow
- Ghost ship in a dead-calm eye of a hurricane, stars above
- Half-sunken vessel with only masts and crow's nest above waterline

━━━ RULES ━━━
- NO crew visible — empty, abandoned, haunted atmosphere
- Emphasis on decay, time, atmosphere, moonlight, fog
- Specific vessel details and conditions, not generic "old ship"
- No repeats — every entry a unique ghost ship moment
- Vivid, atmospheric language

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
