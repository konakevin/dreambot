#!/usr/bin/env node
/**
 * BRICKBOT_AQUATIC_SUBJECT_FOCUS — the dominant subject (STRUCTURE / CREATURE
 * MOUNT / no-vehicle landscape / no-vehicle interior). Audit 2026-06-05: 80 → 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_aquatic_subject_focus.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} SUBJECT-FOCUS entries for BrickBot's aquatic path — each entry names the dominant brick-built SUBJECT of the diorama. Each entry: a (CATEGORY) prefix + body describing the brick build, 28-45 words.

━━━ THE BAR ━━━
Every entry leads with one of FOUR category tags and describes a brick-built dominant subject with structural detail.
CATEGORIES:
- (STRUCTURE) — a built structure as the dominant element (lighthouse, harbor-warehouse, sub-station, beach-shack, dock, oil-rig, reef-base, etc.)
- (NO-VEHICLE LANDSCAPE) — natural/built reef, kelp-forest, beach-shore, mangrove-delta, tide-pool, etc. as the hero
- (NO-VEHICLE INTERIOR) — built interior of a sub/diving-bell/bridge/galley/research-pod/wreck-cabin
- (CREATURE-MOUNT) — large brick sea creature serving as a vehicle/mount (orca, manta, whale-shark, sea-turtle, etc.) with a minifig rider

━━━ VARIETY MANDATE (distribute roughly) ━━━
- ~7 STRUCTURE — lighthouses, oil-rigs, sub-stations, beach-shacks, harbor-warehouses, fishing-piers, lifeguard-towers, reef-research-pods, marina-offices, dock-cranes, surfshop, dive-shop
- ~6 NO-VEHICLE LANDSCAPE — coral-reef ridges, kelp-forest shelves, mangrove-deltas, tide-pools, beach-coves, sea-cliff caves, sunken-ship beds, ice-pack edges, lagoon-flats, abyssal-trench floor, atoll lagoons, brine-pool
- ~6 NO-VEHICLE INTERIOR — sub-bridge, diving-bell crew-cabin, research-pod galley, wreck-cargohold, lighthouse-keeper room, marina-office, sub-engine-room, dive-shop, oxygen-supply chamber, anchored-base hub
- ~5 CREATURE-MOUNT — orca rider, manta rider, whale-shark rider, sea-turtle rider, giant-squid wrangler, dolphin-team racer, sailfish chaser, narwhal rider

━━━ FORMAT ━━━
Each entry: a (CATEGORY) prefix, then a brick description, 28-45 words. Touchpoints:
"(STRUCTURE) a brick-built deep-sea drilling platform on stilt-pillar builds, trans-yellow lamp-tiles along the derrick, a minifig crew cabin with tile-windows, the dominant central anchor of the diorama."
"(NO-VEHICLE LANDSCAPE) a brick kelp-forest shelf with green bar-stalk builds rising in tiers, trans-blue column overhead, plate-root anchors on a dark-grey basalt floor, the immersive hero scene."
"(CREATURE-MOUNT) a brick-built orca with slope-plate black-and-white hull markings and a printed-tile eye, a wetsuit minifig gripping a clip-handle on the dorsal fin, the dominant centerpiece."

━━━ BANS ━━━
- NO photoreal language
- NO living-fluid verbs ("swimming through", "diving naturally")
- NO duplicating categories already in pool — vary across all four
- NO licensed franchise names

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string. Each starts with the (CATEGORY) prefix.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
