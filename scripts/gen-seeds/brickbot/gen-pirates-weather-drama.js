#!/usr/bin/env node
/**
 * BRICKBOT_PIRATES_WEATHER_DRAMA — sea / sky / weather drama for pirate dioramas.
 * Audit 2026-06-05: 50 → 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_pirates_weather_drama.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} WEATHER-DRAMA entries for BrickBot's pirates path — ONE big built atmospheric/weather event for a pirate brick diorama. Each entry: ONE CAPS prefix + em-dash + 28-40 word body.

━━━ THE BAR ━━━
Every entry names a specific sea-and-sky drama (thunderhead break, lightning strike, dense fog, glass-mirror calm, hurricane front, etc.) AND shows the BUILT brick effect (layered cloud-bank plates, trans-yellow bolt-elements, cotton-batting fog, etc.). Reads BRICK.

━━━ VARIETY MANDATE (distribute across categories) ━━━
- ~5 STORM-CELL: thunderhead break, lightning strike, downpour curtain, squall front
- ~5 FOG / MIST: dense fog rolling, sea-mist clinging, smoke-screen
- ~4 CALM / DEAD-CALM: glass-mirror sea, doldrums stillness, dead-calm windless
- ~4 SUNSET / SUNRISE: golden-hour sky, sunset-pink reflection on tile-water
- ~3 HURRICANE / TYPHOON: hurricane eye-wall, typhoon outer-band
- ~3 RAIN-SQUALL: trans-clear rain-curtain, mist of small round-plates
- ~3 ROGUE-WAVE: built wave-wall lifting hull, foam crest
- ~3 BIOLUMINESCENT-SEA: trans-green plankton glow
- ~3 ICEBERG / ARCTIC: ice-floe drifting, iceberg in path
- ~2 WHIRLPOOL / MAELSTROM: built vortex on water surface
- ~2 RAINBOW AFTER STORM: trans-arc rainbow over ship
- ~2 STARFIELD / METEOR: night clear, shooting-stars overhead
- ~2 BURNING-SHIP: rival ship aflame in distance, trans-orange glow on sea
- ~1 SEA-SERPENT / KRAKEN RISE: built tentacle emerging
- ~1 AURORA over polar sea
- ~1 ECLIPSE shadow

━━━ FORMAT ━━━
Each entry: ONE line, all-caps prefix (2-5 hyphenated words), em-dash, 28-40 word body. Body must include: WHAT + HOW it's brick-built + WHERE in scene. Touchpoints:
"THUNDERHEAD BREAK — layered white + light-bley plate-stack cloud-bank with dark-bley underbellies looming portside, a trans-yellow lightning-bolt element spiking toward a far ridge"
"GLASS-MIRROR CALM SEA — flat trans-blue tiles edge-to-edge with zero foam-crests, an inverted mirror-image hull-reflection built directly beneath the waterline, eerie still"
"DENSE FOG ROLLING IN — cotton-batting white + light-bley plate-stack fog-layers creping along the brick-water surface inward from the frame-edge, distant mast-tops the only visible feature"

━━━ BANS ━━━
- NO photoreal vocab
- NO fluid-motion verbs ("waves crash thunderously")
- NO licensed franchise names
- NO duplicating events

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string. Each starts with all-caps prefix + em-dash.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
