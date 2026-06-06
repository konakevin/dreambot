#!/usr/bin/env node
/**
 * BRICKBOT_THEME_PARK_CAMERA_FRAMING — amusement-park brick MOC framing.
 * Audit 2026-06-05: 44 → 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_theme_park_camera_framing.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} CAMERA-FRAMING entries for BrickBot's theme-park path — amusement-park / carnival / midway brick MOC photography. Each entry: ONE CAPS prefix + em-dash + 22-32 word body.

━━━ THE BAR ━━━
Every entry tells Flux exactly where to put the camera in/around the brick park. Name park-specific staging: coaster-POV, ferris-wheel-up, midway-down, ride-entrance-arch, food-stall-row, parade-route, etc.

━━━ VARIETY MANDATE (distribute across categories) ━━━
- ~4 COASTER POV / CAR: from front-car at top of drop, mid-loop, mid-corkscrew
- ~4 FERRIS-WHEEL-UP: looking up the spokes at gondola-ring
- ~3 MIDWAY-DOWN GAME-ROW: down the striped-stall lane, prize-walls receding
- ~3 RIDE-ENTRANCE-ARCH: through park-entrance gate, midway receding beyond
- ~3 OVERHEAD AERIAL: high above the park looking straight down at ride layout
- ~3 CAROUSEL-AROUND: orbiting a brick carousel, painted horses
- ~3 FOOD-STALL ROW: low at the food-court, vendor stalls, eating minifigs
- ~3 PARADE-ROUTE: down a brick parade-route, float passing
- ~3 SWING-RIDE ROTATION: at swing-ride center, chairs at radial angles
- ~2 BALLOON-ARCH OVERHEAD: looking up through giant brick-balloon arch
- ~2 DROP-TOWER LOOKING-UP: at base of drop-tower, brick-cars on cable
- ~2 BUMPER-CAR ARENA: low in the arena, mini cars mid-collision
- ~2 FUNHOUSE-MIRROR: inside funhouse, distorted brick mirrors
- ~1 FIREWORKS UP-SHOT: low at park-center looking up at brick fireworks
- ~1 LOG-FLUME-PLUNGE: from log-car at the splash moment

━━━ FORMAT ━━━
Each entry: ONE line, all-caps prefix (2-5 hyphenated words), em-dash, 22-32 word body. Body must mention foreground brick element + mid-ground ride + park detail. Touchpoints:
"COASTER-POV-DOWN-THE-DROP — camera locked at the crest-rail as the coaster-car tips over the first plunge, screaming minifigs gripping the bar, the entire brick midway spread below"
"FERRIS-WHEEL-LOOKING-UP — camera planted at the wheel-base craning straight up the radial spoke-beams, gondola-ring rotating against a pale-blue brick sky, bulb-string radial"
"MIDWAY-DOWN-THE-GAME-ROW — camera low at shin-height down the striped-stall lane, prize-walls and string-lights receding to a vanishing-point arch, minifig crowds pressing in on either side"

━━━ BANS ━━━
- NO photoreal language
- NO motion-blur / tilt-shift
- NO licensed franchise names (no Disneyland verbatim)
- NO bland descriptors
- NO centered eye-level default

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string. Each starts with all-caps prefix + em-dash.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
