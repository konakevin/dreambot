#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/oceanbot/seeds/shipwreck_scenes.json',
  total: 200,
  append: true,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} SUNKEN SHIPWRECK descriptions for OceanBot. CLASSICAL WOODEN SAILING vessels reclaimed by the ocean — coral-encrusted galleons, fish schools through wooden rigging, light filtering through broken planks. Underwater archaeology meets nature reclaiming. PRE-1850 ERA ONLY.

Each entry: 15-25 words. One specific shipwreck scene.

━━━ ERA — STRICTLY ENFORCED ━━━
- Pre-1850 wooden sailing vessels ONLY: galleons, schooners, frigates, brigs, sloops, junks, longships, dhows, caravels, men-of-war
- Wooden hulls, masts, sails, rigging, cannons, anchors, amphoras, treasure chests

━━━ ABSOLUTELY BANNED (NO MODERN SHIPS) ━━━
- NO submarines, U-boats, naval destroyers, battleships, cruisers, aircraft carriers
- NO steamships, paddlewheelers, smokestacks, funnels, propellers, propeller blades
- NO engine rooms, diesel, gas-powered, combustion, motor boats
- NO cargo ships, container ships, oil tankers, fishing trawlers, racing yachts
- NO metal hulls, iron hulls, steel hulls, naval gun turrets, torpedo tubes
- NO post-1850 era wrecks of any kind

━━━ CATEGORIES (mix across all) ━━━
- Coral-encrusted wooden galleon hull with fan corals growing from cannon ports
- Treasure scattered across sandy bottom, gold coins half-buried, fish circling
- Fish schools streaming through collapsed wooden rigging and broken masts
- Sunlight filtering through holes in wooden hulls creating light shafts
- Barnacle-covered bronze cannons with anemones blooming from their mouths
- Anemone-draped wooden masts reaching upward like coral-covered fingers
- Steering wheel still intact, wrapped in sea life and soft coral
- Captain's quarters with collapsed wooden ceiling, fish swimming through windows
- Anchor chain draped in kelp leading to a buried wooden bow
- Cargo hold split open with amphoras and sea urchins
- Bowsprit standing upright on sand, covered in marine growth
- Crow's nest at apex of broken mainmast, anemones colonized inside

━━━ RULES ━━━
- Nature RECLAIMING the wooden ship — coral, fish, anemones, marine growth
- Underwater light quality — filtered, blue-green, shafts through openings
- Specific ship details and marine life, not generic "old sunken ship"
- No repeats — every entry a unique wreck scene
- Vivid, specific language
- ALWAYS pre-1850 wooden vessels ONLY

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
