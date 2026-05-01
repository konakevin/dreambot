#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/oceanbot/seeds/ghost_ships.json',
  total: 200,
  append: true,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} GHOST SHIP descriptions for OceanBot. Derelict CLASSICAL WOODEN sailing vessels — tattered sails, barnacle-crusted hulls, fog-shrouded galleons, phantom energy. NO crew visible. Empty, haunted, adrift. PRE-1850 ERA ONLY.

Each entry: 15-25 words. One specific ghost ship scene.

━━━ ERA — STRICTLY ENFORCED ━━━
- Pre-1850 wooden sailing vessels ONLY: galleons, schooners, frigates, brigs, sloops, junks, longships, dhows, caravels, men-of-war
- Wooden hulls, masts, sails, rigging, lanterns, oars

━━━ ABSOLUTELY BANNED (NO MODERN SHIPS) ━━━
- NO submarines, U-boats, naval destroyers, battleships, cruisers, aircraft carriers
- NO steamships, paddlewheelers, smokestacks, funnels, propellers
- NO engines, diesel, gas-powered, combustion, motor boats
- NO cargo ships, container ships, oil tankers, fishing trawlers, racing yachts, cabin cruisers
- NO metal hulls, iron hulls, steel hulls, naval gun turrets, torpedo tubes
- NO post-1850 era ships of any kind

━━━ CATEGORIES (mix across all) ━━━
- Tattered sails hanging from rotting wooden masts in dead-calm fog
- Barnacle-crusted wooden hulls listing in moonlit water, no souls aboard
- Fog-shrouded galleons emerging from mist banks at dawn
- Drifting lanterns still lit on empty pre-1850 decks, no explanation
- Phantom silhouettes of ship rigging against a blood-red sunset
- Flying Dutchman energy — impossible wooden ship in impossible conditions
- Moonlit ghost fleets, multiple wooden derelicts drifting in formation
- Ice-encrusted ghost galleon locked in arctic pack ice
- Coral and kelp growing through hull planks of long-lost wooden vessels
- Bioluminescent algae outlining a wooden derelict hull in green glow
- Ghost ship in a dead-calm eye of a hurricane, stars above
- Half-sunken wooden vessel with only masts and crow's nest above waterline

━━━ RULES ━━━
- NO crew visible — empty, abandoned, haunted atmosphere
- Emphasis on decay, time, atmosphere, moonlight, fog
- Specific vessel details and conditions, not generic "old ship"
- No repeats — every entry a unique ghost ship moment
- Vivid, atmospheric language
- ALWAYS pre-1850 wooden vessels ONLY

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
