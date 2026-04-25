#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/megastructures.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} descriptions of JAW-DROPPING MEGASTRUCTURES for StarBot — impossible-scale artificial constructs that make the viewer whisper "holy shit." 20-35 words each.

━━━ WHAT THESE ARE ━━━
The biggest things ever built. Structures so vast they have their own weather, their own gravity, their own ecosystems. Ancient alien machines the size of planets. Human engineering pushed to its absolute theoretical limit. Space stations so large they're visible from other star systems. Every one should make the viewer feel TINY and AWED.

━━━ MEGASTRUCTURE CATEGORIES (spread EVENLY — max 2 per category) ━━━
1. Dyson sphere/swarm — partial or complete stellar energy collector wrapping a star, panels catching light
2. Ringworld/orbital ring — massive habitable ring encircling a planet or star, interior surface visible
3. Orbital elevator/space tether — impossibly tall structure connecting surface to orbit, cable vanishing upward
4. Space station (massive) — city-sized orbital habitat, rotating ring sections, docking spires, industrial scale
5. Generation ship — world-ship carrying civilization across interstellar distances, self-contained ecosystem visible
6. Shipyard/drydock — colossal orbital construction facility with ships in various stages of assembly
7. Defense platform — fortress-scale orbital weapons platform, bristling with arrays, battle-scarred
8. Mining rig — planet-cracking industrial megastructure, extraction beams, ore processing visible
9. Communications array — galaxy-spanning signal relay, dish arrays the size of continents
10. Ancient alien ruin — megastructure from a dead civilization, partially collapsed, overgrown with cosmic debris
11. Warp gate/jump ring — massive ring structure for FTL travel, energy crackling through the aperture
12. Habitat cylinder — O'Neill cylinder with interior landscape visible through transparent sections
13. Stellar collector — structure harvesting plasma directly from a star's corona, heat-shielding glowing
14. Observatory/telescope — planet-scale scientific instrument pointed at deep space, lens arrays visible
15. Prison/fortress — isolated deep-space containment facility, layers of security visible, foreboding

━━━ SCALE ANCHORS (every entry MUST include one) ━━━
Each description must include something that SELLS THE SCALE — tiny ships docking, visible weather patterns on the structure's surface, clouds forming inside a habitat ring, a moon dwarfed beside it, city lights visible as pinpricks on its surface. Without a scale anchor, megastructures just look like normal buildings.

━━━ DEDUP ━━━
No two entries should share the same structure type + primary material + state of repair:
- MATERIALS: polished alloy, corroded ancient metal, crystalline alien material, carbon-composite, living bio-metal, volcanic rock-fused, ice-armored, ceramic-plated
- STATE: pristine/operational, battle-damaged, ancient/weathered, under construction, partially collapsed, overgrown/reclaimed

━━━ RULES ━━━
- Each entry is a COMPLETE scene description of the megastructure + its cosmic setting
- Include what's AROUND it — stars, planets, nebulae, ship traffic, debris fields
- The structure should feel REAL — surface detail, wear patterns, operational elements
- No named IP (no Death Star, no Halo, no Citadel)
- 20-35 words per entry

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
