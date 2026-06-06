#!/usr/bin/env node
/**
 * SteamBot AIRSHIP_ROLE top-up (Stage 2 backfill 2026-06-05).
 *
 * Shared by airship-female + airship-male paths — defines the character's
 * role aboard a steampunk airship. Existing 32 entries cycle command,
 * gunnery, engineering, navigation, medical, diplomatic, intelligence,
 * smuggling, piracy specializations. Topping up toward 200 with expanded
 * crew roles, special-class roles, civilian sky-trades, and named-flag
 * positions.
 *
 * REGISTER: TITLE-CAPS — short capable competence sentence. 18-30 words.
 * Each role is a specific job aboard or around an airship with a tangible
 * competence detail (what they actually DO that proves the skill).
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/steambot/seeds/airship_role.json',
  total: 200,
  batch: 25,
  maxTokens: 16000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} new AIRSHIP_ROLE entries for SteamBot's airship-female + airship-male paths. Each entry defines a specific role aboard or around a steampunk airship — what the character DOES, with a competence-detail that proves the skill.

Each entry: TITLE-CAPS — short capable-competence sentence (18-30 words).

━━━ EXAMPLE PHRASINGS (mirror register exactly) ━━━

"SKY-CAPTAIN — commands the clipper from open bridge, steady voice cutting through wind and engine-roar alike"
"AIR-MARSHAL — oversees entire regional fleet operations, impeccable coat, dispatches orders via aetheric telegraph from command-gondola"
"WING-COMMANDER — directs three corvettes in tight formation, reads flag signals instantly, repositions squadrons mid-engagement without flinching"
"MASTER GUNNER — calls broadside ranges across the gunnery deck, smoke-blackened fingers adjusting elevation on the port cannon"
"NAVIGATOR — plots the course by star-chart and barometric needle, corrects heading every thirty minutes without being asked"
"CHIEF ENGINEER — keeps twin boilers at pressure, oil-dark apron, wrench in belt, listening for every unusual vibration"
"AETHERIC-MECHANIC — maintains the aetheric-communication arrays and lift-crystal systems, soldering iron always warm, her repairs always hold under pressure"

━━━ VARIETY MANDATE (distribute across ${n} new entries) ━━━

COMMAND / OFFICER (~15%):
- Senior officers across ranks (admiral / vice-admiral / commodore / fleet-captain / squadron-leader)
- Special command (privateer captain / merchant-marine captain / mail-clipper captain / heliograph commander)

GUNNERY / COMBAT (~12%):
- Specialty gunners (broadside chief / chase gunner / mortar specialist / aerial-ballistician)
- Combat support (boarding-axe leader / marine-rifleman / cutlass instructor / harpooner)

ENGINEERING / TECHNICAL (~15%):
- Engine room (boiler-stoker / coal-trimmer / valve-tender / pressure-engineer / steam-fitter)
- Lift / propulsion (lift-crystal tuner / propeller-shop chief / envelope-rigger / gas-cell weaver)
- Repair / fabrication (brass-smith / sailmaker / canvas-rigger / spar-carpenter)

NAVIGATION / OBSERVATION (~10%):
- Pilots and helmsmen (helmsman / forward-pilot / docking-pilot / storm-pilot)
- Reading the sky (lookout / topman / cloud-scout / weather-officer / aether-reader)

COMMUNICATION / DIPLOMACY (~8%):
- Signal corps (flag-officer / heliograph-operator / aetheric-telegraphist / cipher-clerk)
- Diplomatic (ambassador-courier / treaty-bearer / foreign-attaché / port-liaison)

MEDICAL / SUPPORT (~6%):
- Medical (sky-surgeon / pressure-medic / corpsman / apothecary-officer)
- Galley / supply (purser / quartermaster / cook / steward / yeoman)

INTELLIGENCE / OUTSIDE-LAW (~10%):
- Espionage (sky-spy / counter-intelligence / saboteur / cipher-breaker)
- Outside-law (smuggler / privateer-quartermaster / sky-pirate / cloud-bandit / mutineer-turned-officer)

SCIENCE / ACADEMIC (~6%):
- Cartography (aerial cartographer / atmospheric surveyor / chart-maker)
- Aetheric / experimental (aetheric researcher / lift-crystal scholar / weather scientist)

SPECIALIZED / EXOTIC (~10%):
- Animal handlers (sky-falconer / messenger-pigeon master / sky-mastiff handler)
- Performers / civilian (sky-circus performer / dirigible-tourist guide / postal-clipper rider)
- Rare professions (sky-undertaker / mid-air courier / orbital lighthousekeeper / cloud-baptist)

CIVILIAN / NON-MILITARY AIRSHIP (~8%):
- Trade (merchant-air captain / wool-clipper master / spice-clipper purser / tea-clipper navigator)
- Service (passenger-liner steward / hotelier-airship maître / aerial-bath attendant)

━━━ FORMAT RULES (NON-NEGOTIABLE) ━━━

- Title prefix is 2-4 WORDS IN ALL-CAPS-WITH-HYPHENS, then " — " separator, then competence sentence.
- Body sentence is 18-26 words, ONE concrete competence detail.
- Show, don't tell — name the ACT that proves the skill ("adjusts elevation on the port cannon", "reads flag signals instantly", "memorizes false manifests before every run").

━━━ HARD MANDATES ━━━

- Steampunk-airship register only — brass / copper / pressure-gauges / valves / aether / lift-crystal / gas-cells / envelope / gondola / rigging / boiler.
- Each role's competence detail must be DIFFERENT — no two roles can share the same proving-act.
- Roles must read as roles a steampunk-airship-world character of EITHER gender could hold (the path filters by gender separately).

━━━ HARD BANS ━━━

- NO modern airframe terminology (no jet, no radar, no autopilot, no GPS, no rocket).
- NO present-day military rank salad ("Lt. Col." etc.) — use steampunk-flavored ranks.
- NO repeating a role TITLE across entries (each prefix unique).
- NO romance / dating / personal-life descriptions — strictly role + competence.
- NO same competence verb across entries ("commands the bridge" can only appear once).

━━━ OUTPUT ━━━

JSON array of ${n} strings, each in "TITLE-CAPS — body" format. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
