#!/usr/bin/env node
/**
 * BRICKBOT_FOREST_CAMERA_FRAMING — forest-specific brick MOC framing.
 * Audit 2026-06-05: 54 → 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_forest_camera_framing.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} CAMERA-FRAMING entries for BrickBot's forest path — enchanted/woodland LEGO MOC dioramas (treehouses, mushroom hollows, fae glades, ranger camps, dark forest cabins). Each entry: ONE CAPS prefix + em-dash + 22-32 word body.

━━━ THE BAR ━━━
Every entry tells Flux exactly where to put the camera — foreground brick element, mid-ground subject, background forest detail. Generic angles fail. Name forest-specific staging: canopy-down, forest-floor-up, tree-trunk-circumambulate, hollow-peer, root-tangle-foreground, etc.

━━━ VARIETY MANDATE (distribute across categories) ━━━
- ~4 CANOPY / TREE-TOP-UP — looking up into brick canopy, sun-shafts breaking through leaf-plates
- ~4 FOREST-FLOOR MACRO — camera low at ground level inches from brick ferns, mushrooms, mossy plates
- ~3 TREE-TRUNK-CIRCLE — orbiting a massive brick tree, root-tangles foregrounded
- ~3 HOLLOW / BURROW-PEER — camera peering into a tree-hollow or burrow, glow within, eyes beyond
- ~3 PATH-DOWN / VANISHING-TRAIL — receding forest path between brick trunks, light at the end
- ~3 TREEHOUSE / CAMP-OVERVIEW — high near the treehouse looking down at camp/clearing below
- ~3 RIVER-CROSSING — camera at brick stream-bed, water-tile gleaming between roots, log-bridge above
- ~2 FAERIE-CIRCLE OVERHEAD — high above a ring of brick mushrooms with glowing center
- ~2 RANGER-AMBUSH SHOULDER — over a ranger-minifig's shoulder, drawn bow aiming through trunks
- ~2 GLADE-OPENING REVEAL — camera at forest-edge revealing a sunlit clearing beyond dense trunks
- ~1 STORM-TORN FALLEN-TREE — low at a felled brick log, gnarled root-mass exposed
- ~1 TWIN-BRICK-TRUNK CORRIDOR — camera between two parallel trunks framing distant subject

━━━ FORMAT ━━━
Each entry: ONE line, all-caps prefix (2-5 hyphenated words), em-dash, 22-32 word body. Body must mention foreground brick element, mid-ground subject, forest detail. Touchpoints:
"CANOPY-DOWN OVERHEAD — camera high above the brick canopy looking straight down through leaf-plate gaps, mushroom-cap rooftops and winding forest paths composing a green-and-tan map of the woodland below."
"FOREST-FLOOR MACRO — camera at green-plate ground level inches from a cluster of brick-ferns and a spotted toadstool, a distant minifig and treehouse softening in the background depth."
"FAERIE-RING OVERHEAD — camera straight down above a ring of brick mushroom-builds with a trans-glow center, lit by a single light-shaft from the canopy above."

━━━ BANS ━━━
- NO photoreal language
- NO centered eye-level front-facing default
- NO motion-blur / tilt-shift
- NO licensed franchise names
- NO bland descriptors

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string. Each starts with all-caps prefix + em-dash.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
