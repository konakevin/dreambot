#!/usr/bin/env node
/**
 * BRICKBOT_LANDSCAPE_CAMERA_FRAMING — epic-vista brick MOC framing.
 * Audit 2026-06-05: 33 → 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_landscape_camera_framing.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} CAMERA-FRAMING entries for BrickBot's landscape path — epic NATURAL-VISTA all-brick MOC photography (mountain ranges / glaciers / canyons / coastal cliffs / mesas / fjords). Each entry: ONE CAPS prefix + em-dash + 22-32 word body.

━━━ THE BAR ━━━
Every entry tells Flux exactly where to put the camera — high aerial, valley floor, ridge-line, edge-overlook, etc. The vista MUST be the hero — minifigs are tiny scale-provers. Generic angles ("wide shot") fail. Name the specific staging.

━━━ VARIETY MANDATE (distribute across categories) ━━━
- ~4 HIGH AERIAL: drone-style high oblique above the brick range, every ridge below
- ~4 VALLEY-FLOOR-UP: low at brick-meadow, towering slope-bricks flanking, sky-baseplate above
- ~3 RIDGE-LINE PROFILE: along a serrated brick crest, ranges stacking back
- ~3 EDGE-OF-CLIFF OVERLOOK: foreground figure at brick precipice, drop falling away
- ~3 SWEEPING PANORAMA: wide low along the brick floor revealing the full vista
- ~3 FOREGROUND-FOLIAGE-FRAME: brick-foliage framing the distant vista
- ~3 ARCH / CAVE-MOUTH FRAME: looking out through a built rock-arch or cave-mouth at the vista
- ~2 MOUNTAIN-PASS SWITCHBACK: receding brick-road snaking through slope-brick valley
- ~2 RIVERBED-LEADING-LINE: brick-trans-blue river receding into the vista
- ~2 SUMMIT-CONQUER: minifig at the summit-rim looking out, scale-prover-from-behind
- ~2 BIRD'S-EYE PLAN: directly down on a built geographic map of mesas / lakes
- ~1 STORM-FRONT WIDE: foreground figures braced, towering brick storm-cloud beyond
- ~1 FROZEN-LAKE MIRROR: brick mountains mirrored in the trans-blue lake plate

━━━ FORMAT ━━━
Each entry: ONE line, all-caps prefix (2-5 hyphenated words), em-dash, 22-32 word body. Body must mention foreground brick element, mid-ground vista element, scale-prover. Touchpoints:
"SWEEPING HIGH-AERIAL — camera pulled high and far back, the entire brick range unfurling tier after tier below, each slope-plate ridge fading toward a hazy deep-distance horizon."
"VALLEY-FLOOR-LOOKING-UP — camera pressed low on brick-meadow plates, tilting steeply upward at towering slope-brick peaks flanking both sides, foregrounding tiny minifig hikers below."
"RIDGE-LINE PANORAMA — camera positioned on a near serrated brick crest looking along the marching ridgeline as layered slope-plate ranges stack and fade into atmospheric haze."

━━━ BANS ━━━
- NO photoreal language
- NO motion-blur / tilt-shift
- NO centered close-up portraits (the vista is hero)
- NO photographer name-drops
- NO mood-only descriptors

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string. Each starts with all-caps prefix + em-dash.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
