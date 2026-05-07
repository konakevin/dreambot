#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');

generatePool({
  outPath: 'scripts/bots/chibibot/seeds/cozy_lights.json',
  total: 60,
  batch: 20,
  metaPrompt: (n) => `You are writing ${n} COZY LIGHTING descriptions for ChibiBot — specific warm light sources that act as the dominant illumination of a scene. 15-30 words each.

━━━ THE FORMULA ━━━
Each entry names ONE PRIMARY warm light source and describes (a) its character, (b) its color/temperature, (c) what surfaces it pools on, (d) the mood it creates. Always WARM-DOMINANT.

━━━ CATEGORIES (distribute across ${n}) ━━━
- Brass / antique table lamps: green-shaded banker's lamp / brass-stem with linen shade / Tiffany-style stained-glass lamp pooling colored light
- Candles (single or cluster): tapered candle in pewter holder / hurricane candle in glass / candelabra clustered on mantel / votives in mason jars
- Fireplaces: roaring open hearth / wood stove glowing through grate / soapstone heater / pechka tile-stove / irori sunken hearth
- Hanging lights: pendant lamp with frosted-amber globe / oil lamp on chain over table / ship's brass lantern / lantern on hook
- Wall sconces: candle-sconce on stone wall / brass gas-lamp sconce / electric "candle-flame" sconce throwing soft pool
- String / fairy lights: warm-white bulbs strung along beam / Edison bulbs over fireplace / holiday string-lights on tree
- Window light (only when atmospheric): single shaft of golden-hour sun through tall window / dust motes in afternoon beam / warm sunset through frosted pane
- Implied warmth: kettle steaming on stove with internal flame visible / oven door cracked emitting glow / firelight reflected in copper

━━━ MANDATORY ELEMENTS PER ENTRY ━━━
1. ONE specific named light source (not generic "warm light")
2. Color temperature / character (tungsten amber / honey gold / candle-flicker / firelight orange)
3. WHAT IT POOLS ON — name a surface (oak floor / wool rug / stone wall / leather binding / ceramic tile)
4. Mood word (intimate / serene / honey-pooled / golden / hushed)

━━━ HARD BANS ━━━
- NO cool dominant lights (no overhead LED, no daylight midday, no neon, no fluorescent)
- NO multiple equal light sources — ONE dominant warm source
- NO surreal (no glowing objects without source, no floating light)

━━━ FEW-SHOT EXAMPLES ━━━
EX-1: "Brass green-shaded banker's lamp pooling honey-amber light directly onto the oak desk, deep warm shadow falling away into the rest of the room, single intimate spotlight feel"
EX-2: "Roaring open-hearth fire, flames the height of an arm, casting flickering orange across the stone fireplace and pooling deep gold onto the sheepskin rug, heat-shimmer above the logs"
EX-3: "Tapered beeswax candle in a pewter holder, fresh flame, melted wax pooling on the wood, gentle gold flicker on the leather book beside it, intimate dim-amber"
EX-4: "Single shaft of golden-hour sun cutting through tall library window, dust-motes spiraling in the beam, leather book-spines catching the warmth, deep amber pooling on the Turkish rug"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
