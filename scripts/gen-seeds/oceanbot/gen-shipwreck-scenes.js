#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/oceanbot/seeds/shipwreck_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} SUNKEN SHIPWRECK descriptions for OceanBot. Ships reclaimed by the ocean — coral-encrusted galleons, fish schools through rigging, light filtering through broken hulls. Underwater archaeology meets nature reclaiming.

Each entry: 15-25 words. One specific shipwreck scene.

━━━ CATEGORIES (mix across all) ━━━
- Coral-encrusted galleon hull with fan corals growing from cannon ports
- Treasure scattered across sandy bottom, gold coins half-buried, fish circling
- Fish schools streaming through collapsed rigging and broken masts
- Sunlight filtering through holes in wooden hulls creating light shafts
- Barnacle-covered cannons with anemones blooming from their mouths
- Anemone-draped masts reaching upward like coral-covered fingers
- Steering wheel still intact, wrapped in sea life and soft coral
- Captain's quarters with collapsed ceiling, fish swimming through windows
- Anchor chain draped in kelp leading to a buried bow
- Cargo hold split open with amphoras and sea urchins
- Propeller of a steel wreck with massive grouper sheltering beneath
- Bow section standing upright on sand, covered in marine growth

━━━ RULES ━━━
- Nature RECLAIMING the ship — coral, fish, anemones, marine growth
- Underwater light quality — filtered, blue-green, shafts through openings
- Specific ship details and marine life, not generic "old sunken ship"
- No repeats — every entry a unique wreck scene
- Vivid, specific language

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
