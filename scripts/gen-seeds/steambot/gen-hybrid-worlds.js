#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/steambot/seeds/hybrid_worlds.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} STEAMPUNK GENRE-HYBRID world descriptions for SteamBot's steampunk-hybrid path — steampunk mashed up with other genres to create unique visual worlds.

Each entry: 15-30 words. One specific hybrid world/scene.

━━━ GENRE MASHUPS (mix evenly) ━━━
- Steampunk × Gothic Horror — vampire empires, haunted clocktowers, fog-drenched graveyards with brass automatons, Frankenstein laboratories with steam power
- Steampunk × Western — frontier towns with steam locomotives, saloon with gear-driven poker machines, desert mine with brass drilling rigs, cowboy gunslingers with steam revolvers
- Steampunk × Noir Detective — rain-soaked gaslit alleys, detective offices with pneumatic message tubes, crime scenes in clock factories, shadowy informants in boiler rooms
- Steampunk × Underwater/Atlantis — brass submarines exploring sunken cities, underwater domes with steam vents, deep-sea diving suits with copper helmets, coral-encrusted gear temples
- Steampunk × Arctic Expedition — icebreaker ships with massive steam engines, polar base camps with heated brass shelters, aurora-lit gear outposts, frozen clockwork discovered in glaciers
- Steampunk × Fantasy/Alchemy — mana-powered engines, crystal-fueled reactors, enchanted gear workshops, elemental forges with brass containment

━━━ DEDUP ━━━
Each entry must be a DIFFERENT genre combo + setting. No two entries from the same sub-genre AND same location type.

━━━ RULES ━━━
- Every entry must clearly read as TWO genres fused
- Victorian-era industrial base + the other genre's signature elements
- Specific moment/place, not generic descriptions
- Environment-focused, characters optional

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
