#!/usr/bin/env node
/**
 * BRICKBOT_SPACE_VEHICLE_CLASS — silhouette identity (Classic Space cruiser etc),
 * or "no-vehicle" interior context. Audit 2026-06-05: 40 → 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_space_vehicle_class.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} VEHICLE-CLASS entries for BrickBot's space path — each names a SPECIFIC LEGO Space-coded ship/vehicle/craft OR a "no-vehicle" interior context with action. Each entry: ONE phrase, 18-32 words.

━━━ THE BAR ━━━
Every entry names a SPECIFIC ship class with heritage prefix (Classic LEGO Space Cosmic Fleet Voyager (6985 lineage), Blacktron Renegade Cruiser, etc.) OR a "no-vehicle (context)" scene (hangar bay mid-launch-scramble, engine room mid-system-failure, etc.). Visibly distinct silhouettes.

━━━ VARIETY MANDATE (distribute across categories) ━━━
- ~6 CLASSIC LEGO SPACE: cosmic fleet voyager, galaxy explorer, intergalactic command base, mobile lab, etc.
- ~4 BLACKTRON / SPYRIUS: renegade cruiser, infiltrator, wedge-fighter, sneak-fighter
- ~3 M-TRON: magnet-mining truck, magnet-haul carrier, crystal-collector
- ~3 ICE PLANET: ice-rover, ice-base lander, snow-skimmer
- ~3 MARS MISSION: mars rover, mars walker, mars-colony lander
- ~3 GALAXY SQUAD: bug-blaster fighter, bug-trooper carrier, bug-hunter mech
- ~3 INSECTOIDS: alien-craft, bio-mech, insectoid scout
- ~3 HARD-SF CRUISER: corvette, frigate, dreadnought, light-cruiser
- ~3 NO-VEHICLE (hangar/launch scrambles): launch-scramble, fleet-departure prep
- ~3 NO-VEHICLE (engine room): system-failure, reactor-vent, coolant-leak emergency
- ~3 NO-VEHICLE (bridge command): viewscreen-alert, course-correction, jump-prep
- ~3 NO-VEHICLE (EVA surface): astronaut on moon/mars surface, planting flag
- ~2 NO-VEHICLE (medical bay): trauma response, suit-doffing
- ~2 NO-VEHICLE (mess/canteen): off-duty crew dining
- ~2 NO-VEHICLE (quarters): crew sleeping pod
- ~2 NO-VEHICLE (cargo bay): freight-loading robot crew
- ~2 NO-VEHICLE (orbital observation deck): planet through trans-canopy

━━━ FORMAT ━━━
Each entry: ONE phrase, 18-32 words. Heritage-name prefix + parenthetical lineage cue for vehicles, OR "no-vehicle (context)" prefix for interior scenes. Touchpoints:
"Classic LEGO Space Cosmic Fleet Voyager (6985 lineage) — long cigar-shaped main hull, twin engine-pods, trans-blue cockpit canopy at the bow, vintage yellow-grey Classic Space palette"
"no-vehicle (hangar bay mid-launch-scramble) — fleet hangar with fighters on cradles, lead pilot MID-SPRINT toward cockpit ladder, deck-crew mid-evac of launch-pad, trans-orange klaxon strobe"
"no-vehicle (engine room mid-system-failure) — reactor-core chamber venting trans-cyan coolant streamers, engineer MID-LEVER-PULL on emergency-shutdown, second engineer mid-fire-extinguisher spray"

━━━ BANS ━━━
- NO licensed franchise IP verbatim (no Millennium Falcon / Enterprise)
- NO duplicating vehicle classes
- NO photoreal vocab

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
