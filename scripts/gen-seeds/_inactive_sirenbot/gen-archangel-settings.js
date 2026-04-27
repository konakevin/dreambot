#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/sirenbot/seeds/archangel_settings.json',
  total: 50,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} ARCHANGEL SETTING descriptions for SirenBot's archangel path. Diablo Angiris Council aesthetic — heavenly architecture, celestial battlefields, divine realms, places where an archangel would appear.

Each entry: 10-20 words. A specific celestial/divine environment.

━━━ CATEGORIES TO COVER ━━━
- Crystal spire cathedral with light pouring through prismatic walls, golden altar radiating warmth
- Floating platform above endless cloud ocean, pillars of light connecting heaven to earth below
- Battlefield strewn with fallen demons, holy fire still burning in craters, dawn breaking
- Silver bridge spanning an infinite void, runes glowing along its length
- Celestial armory with racks of divine weapons, each blade humming with contained light energy
- Mountain peak above the clouds, stone circle temple bathed in perpetual golden dawn
- Ruined mortal city being reclaimed by holy light, vines of gold growing through rubble
- Throne room of heaven with a thousand floating candles, pearl floors reflecting infinite light
- Eclipse moment — sun corona blazing behind dark moon, the liminal space between realms
- Stained glass corridor where each panel shows a different age, light painting the floor
- Burning demon fortress being purified by holy radiance, obsidian walls cracking with golden light
- Storm clouds split by a column of divine light, rain turning to golden mist

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: location type + light quality + sacred/battle/liminal atmosphere.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
