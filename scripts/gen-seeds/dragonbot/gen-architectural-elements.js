#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/architectural_elements.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} ARCHITECTURAL ELEMENT descriptions for DragonBot — epic-fantasy structures that anchor composition. Castles, towers, temples, bridges, gates, thrones, banners.

Each entry: 10-20 words. One specific fantasy architectural element with style/detail.

━━━ CATEGORIES ━━━
- Castles (white-marble citadel, basalt-black fortress, cliff-carved castle, fairy-tale spired castle)
- Towers (crooked wizard-tower, spiraling lighthouse, watchtower with banners, sky-spire)
- Temples (moon-temple with domed roof, sun-temple with pillars, underground necropolis-temple)
- Bridges (stone arch bridge over canyon, rope-swing jungle bridge, crystal-bridge floating)
- Gates (massive iron gate with runes, weathered wood-gate, holy-gate with statuary)
- Thrones (obsidian throne carved from cavern, wooden tree-throne, silver-moon throne)
- Banners (massive heraldic banner hanging in wind, tattered war-banner post-battle)
- Ruins (fallen colonnade overgrown, broken archway with vines, crumbling tower)
- Statuary (giant stone king-statue at mountain-pass, pilgrim statues along path)
- Crypts (torch-lit underground crypt with carved effigies, stone sarcophagus)
- Halls (great banquet hall with beams, pillar-lined throne hall, feasthall)
- Forges (dwarf-forge with lava-run, smithy with anvil, weapon-rack)
- Altars (stone altar with offerings, fire-altar with ritual flame)
- Shrines (roadside shrine with candles, weather-worn statue-shrine)
- Gatehouses (castle-gatehouse with portcullis, town-gate with guards-posted-lamps)
- Pavilions (silk-tent war-pavilion with banners, peace-tent at neutral ground)
- Observatories (starcharted tower with telescope, mage-astronomer's observatory)
- Dungeons (stone-walled dungeon with cells, torch-lit interrogation chamber)
- Libraries (multi-story book-tower with ladders, scroll-shelved chamber)
- Shipyards (dragon-prow galleon under construction, docks with ships)
- Barricades (wooden palisades around camp, siege-works with catapults)
- Menhirs (standing stones with runes, stone-circle megaliths)
- Cathedrals (gothic arches reaching ceiling, stained-glass round-window)

━━━ RULES ━━━
- Epic fantasy architecture
- Painterly / rendered detail
- Include style or material for visual anchor

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
