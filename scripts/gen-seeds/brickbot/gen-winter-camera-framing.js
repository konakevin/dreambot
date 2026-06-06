#!/usr/bin/env node
/**
 * BRICKBOT_WINTER_CAMERA_FRAMING — winter brick MOC framing.
 * Audit 2026-06-05: 60 → 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_winter_camera_framing.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} CAMERA-FRAMING entries for BrickBot's winter path — alpine/winter-village/ski-slope/ice-fishing brick MOC photography. Each entry: ONE CAPS prefix + em-dash + 22-32 word body.

━━━ THE BAR ━━━
Every entry tells Flux exactly where to put the camera in/around a winter brick scene. Name winter-specific staging: ski-slope lift-shadow, frozen-lake fishing-hole, village-square clock-tower, sleigh-ride, snowman-cluster, etc.

━━━ VARIETY MANDATE (distribute across categories) ━━━
- ~4 SKI-SLOPE: slope-edge looking down/up, ski-lift, slalom-poles, chair-lift
- ~3 FROZEN-LAKE: at lake-edge, ice-fishing hole, skating, hockey
- ~3 VILLAGE-SQUARE: town-square, clock-tower, market-stall, decorated tree
- ~3 SLEIGH-RIDE: in moving sleigh, horse-and-rider, snowy path
- ~3 SNOWMAN-CLUSTER: front of snowman family, kids decorating
- ~3 LOG-CABIN-INTERIOR: warm hearth, snowy window, family gathered
- ~3 SNOWY-FOREST PATH: through snow-laden pines, footprints visible
- ~3 ICE-CAVE / GROTTO: inside built ice-cave, trans-blue plates, glow
- ~3 ROOFTOP SNOW: across snow-laden rooftops looking at chimneys
- ~3 CHIMNEY-DOWN PEEK: looking down chimney into warm interior
- ~2 ALPINE-PEAK CONQUER: minifig at summit looking down
- ~2 ICE-RINK CENTER: skaters mid-glide on lake/rink
- ~2 BLIZZARD WHITE-OUT: figures braced against built snow-storm
- ~1 SNOWBALL-FIGHT MID-FLY: snowballs frozen mid-toss
- ~1 NORTHERN-LIGHTS UP: looking up at brick aurora
- ~1 ICE-HOTEL INTERIOR: trans-blue ice-block walls

━━━ FORMAT ━━━
Each entry: ONE line, all-caps prefix (2-5 hyphenated words), em-dash, 22-32 word body. Body must mention foreground brick element + mid-ground subject + winter detail. Touchpoints:
"SKI-SLOPE LIFT-SHADOW — camera at slope-edge looking uphill, a T-bar lift casting long shadows across white-plate snow, a queuing minifig in mid-foreground, distant skiers tracking down"
"FROZEN-LAKE FISHING-HOLE CLOSE — camera low beside a drilled trans-light-blue tile hole, an ice-fishing minifig hunched over rod, the flat frozen expanse stretching to a brick treeline"
"VILLAGE-SQUARE CLOCK-TOWER HIGH — camera mounted at the brick clock-tower's top looking down at the festive square below, market-stall canopies + snow-laden cobble"

━━━ BANS ━━━
- NO photoreal language
- NO motion-blur / tilt-shift
- NO licensed franchise names
- NO bland descriptors

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string. Each starts with all-caps prefix + em-dash.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
