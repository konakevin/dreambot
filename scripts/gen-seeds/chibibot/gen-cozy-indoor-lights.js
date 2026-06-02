#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');

generatePool({
  outPath: 'scripts/bots/chibibot/seeds/cozy_indoor_lights.json',
  total: 60,
  batch: 20,
  metaPrompt: (
    n
  ) => `You are writing ${n} INDOOR COZY LIGHTING descriptions for ChibiBot — specific warm interior light sources that act as the dominant or accent lighting of a painted-storybook-illustration interior scene. 18-32 words each.

━━━ THE CORE FORMULA ━━━
Each entry names ONE INTERIOR light source and describes (a) its character, (b) its color/warmth, (c) what surfaces it pools on, (d) the cozy mood it creates. ALWAYS warm-dominant. Required vocabulary register includes phrases from this comfort-lighting palette: "warm lamplight glow", "candlelit warmth", "soft window light", "diffused dreamy lighting", "gentle bloom on highlights", "soft volumetric light", "golden hour haze", "honey-amber glow", "soft halation", "warm pool of light".

━━━ INDOOR LIGHT SOURCES (categories — distribute across ${n}) ━━━
- Brass / antique table lamps (banker's lamp / brass-stem with linen shade / Tiffany-style stained-glass lamp)
- Candles (single tapered candle / cluster of votives / candelabra / tealight in jar / pillar candle on hearth)
- Fireplaces / hearths (open hearth roaring / wood stove glowing through grate / soapstone heater / pechka tile-stove)
- Hanging interior lights (pendant lamp with frosted-amber globe / oil lamp on chain over table / hurricane lantern hanging)
- Wall sconces (candle-sconce on stone wall / brass gas-lamp sconce / electric "candle-flame" sconce)
- String lights / fairy lights (warm-white bulbs strung along beam / Edison bulbs over fireplace / mason-jar string-lights wrapped along shelf)
- Window light (soft diffused window light through linen curtains / golden hour haze through leaded glass / single shaft of warm afternoon light through dust-motes / dawn-blue cool light contrasting interior warmth)
- Implied warmth (kettle steaming on stove with internal flame visible / oven door cracked emitting glow / firelight reflected in copper / glowing embers in a banked fire)

━━━ MANDATORY ELEMENTS PER ENTRY ━━━
1. ONE specific named light source (not generic "warm light")
2. Color/temperature word (tungsten amber, honey-gold, candle-flicker, firelight orange, warm lamplight glow, golden hour haze)
3. WHAT IT POOLS ON — name a surface (oak floor, wool rug, stone wall, leather binding, ceramic tile, linen curtain)
4. MOOD WORD from the cozy comfort-lighting palette ("intimate", "dreamy", "honey-pooled", "diffused", "soft volumetric", "gentle bloom", "candlelit warmth", "lived-in")
5. Visible volumetric atmosphere where natural (dust-motes in beam / soft warm haze / hazy depth into the back of the room / warm bloom around the source)

━━━ HARD BANS ━━━
- NO cool dominant lights (no overhead LED, no daylight midday, no neon, no fluorescent, no harsh shadows)
- NO outdoor-only weather (those go in the outdoor lights pool)
- NO modern minimalist lighting registers ("recessed LED", "track lighting", "industrial pendant")
- NO empty showroom / sterile / harsh contrast

━━━ FEW-SHOT EXAMPLES ━━━
EX-1: "Brass green-shaded banker's lamp pooling honey-amber light directly onto worn oak desk, diffused dreamy warmth pooling outward, gentle bloom on the leather blotter, soft volumetric haze in the back corners, intimate candlelit warmth"
EX-2: "Roaring open-hearth fire, flames the height of an arm, casting flickering golden firelight across the fieldstone surround and pooling honey on the wool rug, soft warm haze rising above the logs, gentle bloom catching the brass tools"
EX-3: "Soft diffused window light filtering through linen curtains in late afternoon, golden hour haze drifting across the room, dust-motes floating in the warm beam, gentle bloom on the ceramic vase, dreamy lived-in warmth"
EX-4: "Cluster of beeswax candles in pewter holders along the mantel, fresh flames, melted wax pooling, candlelit warmth flickering across stone, soft halation around each flame, intimate dim-amber bloom into the shadowed corners"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
