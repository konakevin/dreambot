#!/usr/bin/env node
/**
 * BRICKBOT_PIRATES_CAMERA_FRAMING — high-seas pirate brick diorama framing.
 * Audit 2026-06-05: 50 → 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_pirates_camera_framing.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} CAMERA-FRAMING entries for BrickBot's pirates path — Golden-Age tall-ship pirate brick MOC photography (galleon decks, port-call scenes, sword-fight, sea-battle, treasure-cove). Each entry: ONE CAPS prefix + em-dash + 22-32 word body.

━━━ THE BAR ━━━
Every entry tells Flux exactly where to put the camera in or around a brick pirate ship / port scene. Generic angles fail. Name the specific staging: mast-up, crow's-nest, longboat-low, hull-wall, deck-action.

━━━ VARIETY MANDATE (distribute across categories) ━━━
- ~4 WORM'S-EYE-UP-MAST: flat on deck looking straight up mast/rigging
- ~3 CROW'S-NEST PLUNGE-DOWN: from masthead nest looking straight down to deck
- ~3 LONGBOAT-LOW HULL-WALL: at waterline alongside a galleon, hull rising vertical
- ~3 BROADSIDE CANNONADE: low across deck during cannon-fire, smoke + flash
- ~3 GUNWALE-OVER-RAIL: looking down past rail to brick water below
- ~3 PORTHOLE-PEER FROM-CABIN: inside captain's cabin peering out through round porthole
- ~3 DECK-RUN BATTLE: low across deck during sword-fight, action mid-clash
- ~3 SHIP-PROW-FORWARD: from bowsprit looking back along the deck
- ~2 TREASURE-CAVE INTERIOR: in a brick treasure-cave, gold-tile piles
- ~2 TAVERN INTERIOR: low at brick port-tavern, brawling pirates around bar
- ~2 OVERHEAD AERIAL: above the ship/scene looking straight down at deck-layout
- ~2 MAP-ROOM-OVER-TABLE: at captain's chart-table over the maps
- ~1 GANG-PLANK-DOWN: receding gangplank from ship to dock
- ~1 ANCHOR-LIFT: chain-link anchor-element rising
- ~1 BURNING-SHIP-WRECK: low at a burning brick galleon listing to one side

━━━ FORMAT ━━━
Each entry: ONE line, all-caps prefix (2-5 hyphenated words), em-dash, 22-32 word body. Body must mention foreground brick element + mid-ground subject + pirate detail. Touchpoints:
"WORM'S-EYE UP THE MAINMAST — camera flat on the deck looking straight up the mast, yardarms crossing overhead as horizontal bars, rigging-lines converging at the masthead crow's-nest"
"CROW'S-NEST PLUNGE-DOWN — camera locked at the masthead crow's-nest rim looking straight down the mast-shaft, crew below reduced to small figures, the yardarms framing the descent"
"LONGBOAT-LOW HULL-WALL — camera at waterline from a bobbing longboat alongside a galleon, the barnacled hull rising as a vertical wall, gun-ports punched overhead, rigging far above"

━━━ BANS ━━━
- NO photoreal language
- NO motion-blur / tilt-shift
- NO licensed franchise names (no Pirates-of-the-Caribbean verbatim)
- NO bland descriptors
- NO centered eye-level default

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string. Each starts with all-caps prefix + em-dash.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
