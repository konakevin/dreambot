#!/usr/bin/env node
/**
 * BRICKBOT_MACRO_DISPLAY_SIGNATURE_CENTERPIECE — the dramatic focal feature
 * that anchors the entire complete-diorama. Audit 2026-06-05: existing 25
 * entries — undersized. Target 200.
 *
 * Each entry is the WOW the eye lands on first — a towering castle keep,
 * a launching rocket, a frozen wave, a working ferris wheel, a multi-tier
 * waterfall, a giant tree, a colossal dragon mid-descent. The rest of the
 * brick world radiates from it.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_macro_display_signature_centerpiece.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} SIGNATURE-CENTERPIECE entries for BrickBot's macro-display path — the dramatic focal feature that anchors the ENTIRE complete-diorama brick build (a towering keep / launching rocket / frozen crashing wave / brick dragon mid-descent / working ferris-wheel / multi-tier waterfall / colossal tree / steam-train on a trestle). Each entry is ONE 22-35 word sentence describing the focal wow + its position in the build + the radiating effect.

━━━ THE BAR ━━━
Every entry must name a SPECIFIC dramatic centerpiece + WHERE it sits + HOW the rest of the world radiates from it (towering vertical / multi-tier cascade / mid-air dynamic / radial hub / pulled-toward-it sightline). The centerpiece is the WOW — the convention-stopper. NEVER bland ("a big building"). NAME the specific subject with rich brick detail.

━━━ VARIETY MANDATE (distribute roughly across these centerpiece categories) ━━━
- ~5 TOWERING-VERTICAL ARCHITECTURE — castle keep / lighthouse / cathedral / pagoda / clocktower / minaret / observatory dome / temple ziggurat / Eiffel-style tower / capitol dome
- ~4 DYNAMIC-MID-AIR DRAMA — dragon mid-descent / rocket mid-liftoff / crashing wave / falling meteor / mech mid-leap / pegasus mid-flight / hawk mid-strike / bridge collapsing
- ~3 WORKING-MECHANISM — ferris-wheel / functioning waterwheel / GBC-loop / coaster mid-drop / windmill / carousel / steam-engine flywheel / clockwork orrery / rotating planet-globe / animated puppet stage
- ~3 NATURAL FORCE — erupting volcano / multi-tier waterfall / colossal tree / aurora-arc / iceberg in lake / sinkhole / geyser / ancient meteor crater / collapsing glacier / fault-rift
- ~3 VEHICLE / TRANSPORT HERO — steam-train on a trestle / galleon under full sail / dirigible mid-mooring / submarine breaching / monorail-pylon / wagon-train fording / mech under construction
- ~3 SACRED / MONUMENTAL — Buddha statue / ancient obelisk / colossal idol / sphinx / standing-stone circle / pyramid-stepped temple / pharaoh's tomb / fallen-titan-skull
- ~3 FANTASY-CREATURE HERO — kraken tentacle bursting through deck / sleeping giant in landscape / dragon coiled on hoard / phoenix on perch / hydra rising from lake / chimera mid-roar
- ~2 INDUSTRIAL HERO — refinery flare-tower / mining headframe / steel-mill blast-furnace / oil-rig derrick / shipyard gantry-crane / nuclear cooling tower / hydroelectric dam-face
- ~2 SCI-FI HERO — alien mothership / orbital ring / fusion-reactor core / asteroid mining-platform / wormhole-portal / colonization-pod landing / hyperspace-gate
- ~2 CATASTROPHIC SCENE — burning building / siege-tower mid-deploy / earthquake-rift / city under monster-attack / volcano + ash-cloud / tsunami-wall / Death-Star-style sphere
- ~1 GAME-WORLD HERO — colossal chess-piece / giant board-game spinner / theme-park castle-gate
- ~1 NATURAL-MONUMENT HERO — Half-Dome / Devil's Tower / Old Faithful / Niagara / sequoia grove / Uluru-style sandstone monolith

━━━ FORMAT ━━━
Each entry: ONE 22-35 word sentence starting with "A" / "An". Touchpoint examples:
"A towering castle keep crowning a stacked-plate crag, banner-tiles flying from its turrets, every sightline pulled skyward to the tallest element in the build."
"A launching rocket frozen mid-liftoff on a gantry pad, trans-orange flame-plume blasting downward, the vertical drama anchoring the entire colony diorama beneath it."
"A multi-tier waterfall of stepped trans-blue plates cascading down a stacked-plate cliff into a round-plate basin, white spray bricks catching every light source above it."
"A working ferris-wheel turning at the fairground's heart, gondola-cabins strung with trans-element lights, the rotating hub every other element in the build radiates outward from."

━━━ BANS ━━━
- NO photoreal language — every centerpiece is brick-built
- NO bland descriptors ("a big tower") — name the specific subject + brick detail
- NO single-subject framing as the WHOLE build — this is the focal of a complete-world diorama
- NO motion blur — frozen brick moment only
- NO licensed franchises (Hogwarts / Death Star) — generic-iconic only
- NO real-architect / real-photo language

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
