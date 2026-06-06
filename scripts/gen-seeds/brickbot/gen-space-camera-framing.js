#!/usr/bin/env node
/**
 * BRICKBOT_SPACE_CAMERA_FRAMING — LEGO Space MOC framing (Classic-Space, Blacktron, etc.).
 * Audit 2026-06-05: 50 → 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_space_camera_framing.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} CAMERA-FRAMING entries for BrickBot's space path — LEGO Space MOC photography (Classic-Space, Blacktron, Mars-Mission, Ice-Planet, Galaxy-Squad lineage + hard-SF canon). Each entry: ONE CAPS prefix + em-dash + 22-32 word body.

━━━ THE BAR ━━━
Every entry tells Flux exactly where to put the camera in or around a brick spacecraft / orbital / surface scene. Name space-specific staging: thruster-bell vertigo, cockpit-canopy starfield, EVA-tether return, airlock-pressure, hangar-bay launch.

━━━ VARIETY MANDATE (distribute across categories) ━━━
- ~4 THRUSTER-BELL VERTIGO: low behind a launching mech/ship looking up through engine-bells
- ~4 COCKPIT-CANOPY STARFIELD: from pilot seat through trans-clear canopy at vacuum
- ~3 EVA-TETHER RETURN: from end of EVA tether looking back at parent ship
- ~3 AIRLOCK-PRESSURE: at airlock seal, both halves of trans-canopy framing exit
- ~3 HANGAR-BAY LAUNCH: inside a launch bay, ships on cradles, deck-crew mid-scramble
- ~3 OVERHEAD AERIAL: high above scene, surface of moon/planet/asteroid below
- ~3 SURFACE-EVA: rover/astronaut on surface, ship in mid-distance
- ~3 ASTEROID / MINING: between asteroids, mining ship in distance
- ~3 ORBITAL: orbital ring, planet curving below, ship at frame
- ~3 BRIDGE-COMMAND: from captain-chair looking at viewscreen / crew at consoles
- ~2 ENGINE-ROOM: between reactor cores, engineers mid-action
- ~2 LIGHTSPEED-JUMP TUNNEL: trans-light streaks framing ship dead-center
- ~2 DOCKING APPROACH: ship approaching a brick space station
- ~1 ALIEN-WORLD HORIZON
- ~1 DEEP-SPACE NEBULA WIDE
- ~1 PLANET-SURFACE CRATER

━━━ FORMAT ━━━
Each entry: ONE line, all-caps prefix (2-5 hyphenated words), em-dash, 22-32 word body. Body must mention foreground brick element + mid-ground subject + cosmic detail. Touchpoints:
"THRUSTER-BELL VERTIGO UPSHOT — camera flat beneath the launch-pad surface looking straight up through four receding engine-bells, trans-orange flame elements bursting downward"
"COCKPIT-CANOPY STARFIELD GAZE — camera from the pilot-seat looking through the curved trans-clear canopy at open vacuum, instrument-greeble crowding the lower-frame, helmet-rim haloing the view"
"EVA-TETHER RETURN LOOK — camera from the end of an EVA tether looking back at the parent-ship hull, the tether-line receding toward the airlock hatch, EVA-suited hand visible"

━━━ BANS ━━━
- NO photoreal language
- NO motion-blur / tilt-shift
- NO licensed franchise names (no Star Wars / Star Trek verbatim)
- NO bland descriptors
- NO centered eye-level default

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string. Each starts with all-caps prefix + em-dash.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
