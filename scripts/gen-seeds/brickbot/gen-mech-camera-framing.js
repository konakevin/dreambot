#!/usr/bin/env node
/**
 * BRICKBOT_MECH_CAMERA_FRAMING — mech / titan / robot diorama framing.
 * Audit 2026-06-05: 50 → 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_mech_camera_framing.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} CAMERA-FRAMING entries for BrickBot's mech path — towering brick mech / titan / battle-robot LEGO MOC photography. Each entry: ONE CAPS prefix + em-dash + 22-32 word body.

━━━ THE BAR ━━━
Every entry tells Flux exactly where to put the camera relative to the mech — worm's-eye up, hangar-overhead, cockpit-side, mech-vs-mech-between, etc. — and what's in foreground/mid-ground/background. The mech is hero, scale is the obsession. Generic framing fails.

━━━ VARIETY MANDATE (distribute across categories) ━━━
- ~4 WORM'S-EYE-UP: flat at baseplate looking straight up at titan, tiny pilots at feet
- ~4 MECH-VS-MECH BETWEEN: low between two opposing brick mechs, weapons mid-clash
- ~3 HANGAR / GANTRY: looking up at maintenance gantry, mech being serviced
- ~3 COCKPIT-SIDE OPEN: open cockpit-hatch, pilot mid-egress, mech's chest filling frame
- ~3 SHOULDER-MOUNT WEAPON: high near a shoulder-cannon, mech's chest spread below
- ~3 LEG / FOOT MACRO: extreme low at brick foot, tiny crew dwarfed
- ~3 BATTLE-FIELD WIDE: low across a brick battlefield, multiple mechs scattered
- ~2 PILOT-INTERIOR HUD: from pilot-cockpit looking out through brick canopy
- ~2 OVERHEAD AERIAL: high above the mech-battle looking straight down
- ~2 WRECKAGE / DOWNED-MECH: low at a fallen brick mech's smoking carcass
- ~2 CHARGED-WEAPON GLOW: framing on a charging weapon-element, trans-glow pre-fire
- ~1 BACK-SHOULDER OVER-PILOT: over the pilot's shoulder peering at HUD
- ~1 ENGINE-EXHAUST UP-BLAST: low behind a launching mech, trans-orange exhaust

━━━ FORMAT ━━━
Each entry: ONE line, all-caps prefix (2-5 hyphenated words), em-dash, 22-32 word body. Body must mention foreground brick element + mid-ground mech + scale-prover or background detail. Touchpoints:
"WORM'S-EYE-UP-THE-TITAN — camera flat on the baseplate aimed steeply up the brick titan's full height, two pilot-minifigs dwarfed at its feet, the greebled chest filling the upper frame"
"MECH-VS-MECH-CLASH-BETWEEN — camera low between two opposing brick mechs, their weapon-arms locked in collision forming a violent diagonal X, shattered tile-debris foreground"
"HANGAR-GANTRY-LOOKING-UP — camera between Technic-beam catwalk supports looking up at the brick mech being armored, sparks flying from a crew-minifig's welder, overhead floods raking down"

━━━ BANS ━━━
- NO photoreal language
- NO centered eye-level front-facing default
- NO motion-blur / tilt-shift
- NO licensed franchise names (no Gundam / Pacific Rim / Evangelion verbatim)
- NO bland descriptors

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string. Each starts with all-caps prefix + em-dash.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
