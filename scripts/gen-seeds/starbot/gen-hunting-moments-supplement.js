#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');

// SUPPLEMENT 2026-05-03 — APPENDS hunting-themed mid-action moments
// to the existing tranquil_moments.json pool.
// The current 80 entries cover battle / sentinel / surveillance /
// exploration / breaching / extraction / construction. This supplement
// adds the "hunting / stalking / tracking / pursuit / cornering" cluster.

generatePool({
  outPath: 'scripts/bots/starbot/seeds/tranquil_moments.json',
  total: 95, // existing 80 + 15 new
  batch: 15,
  append: true,
  metaPrompt: (n) => `You are writing ${n} HUNTING-THEMED mid-action moments to ADD to an existing pool of dynamic robot actions. Each entry is 15-30 words describing the EXACT FROZEN MOMENT a robot is captured mid-hunt.

THE LOAD-BEARING RULE: every entry shows the robot ACTIVELY HUNTING something — tracking, stalking, pursuing, cornering, mid-strike, mid-pounce. NOT "watching for prey." NOT "patrolling area." The action is HUNT-IN-PROGRESS.

━━━ HUNT VERB LEXICON ━━━

TRACKING (mid-pursuit, mid-trail-read):
- "tracking [target type] across [terrain]" — sensors lit, ground-reading, mid-stride
- "following blood-trail through [environment]"
- "reading heat-signature in [hostile space]"
- "pursuing [quarry] through [obstacle]"
- "scanning ground for [trail-evidence]"

STALKING (low-crouched advance, silent approach):
- "stalking [target] through [cover]" — body low, weapon ready
- "advancing silently across [terrain]" — gait stilled, sensors dimmed
- "creeping around [obstacle]" — body angled to maintain cover
- "infiltrating [enemy position]" — armor matched to environment

CORNERING / CLOSING IN:
- "cornering [target] against [barrier]"
- "closing distance on fleeing quarry"
- "blocking escape route through [chokepoint]"
- "circling [prey] mid-encirclement"

MID-STRIKE / POUNCE:
- "lunging at [target]" mid-leap, body airborne
- "striking [target] with [weapon] mid-impact"
- "pouncing from [elevation] onto [quarry]"
- "tackling [target] mid-collision" — debris exploding outward

WEAPON PRESENTATION (predator-mode):
- "drawing [weapon] mid-pursuit"
- "raising [weapon] to firing position as target sighted"
- "deploying claws/blades mid-charge"
- "energizing [weapon] before strike"

POST-STRIKE / TROPHY:
- "examining felled prey mid-scan"
- "extracting [trophy] from defeated target"
- "marking territory after successful hunt"

━━━ HARD RULES ━━━

- 15-30 words per entry, dense
- Present-continuous verb in the action — the robot is DOING the hunt right now
- ENVIRONMENTAL DETAIL showing pursuit-in-progress — dust trailing / heat-signature visible / blood-trail glowing / prey escaping in distance / branches snapping / breath-vapor in cold air
- The TARGET should be specific but ambiguous — could be alien creature, rogue droid, enemy combatant, fugitive, beast — never name a franchise creature
- VARY the hunt categories — don't write 15 stalking entries; mix tracking + stalking + cornering + mid-strike + post-strike
- Action MUST be visible in a still image — frozen frame of motion
- FORBIDDEN: tranquil, peaceful, calm hunting, contemplative pursuit, gentle stalking — every entry has tension and predatory energy

━━━ FEW-SHOT EXAMPLES ━━━

- "Tracking heat-signature trail across glacier surface, sensors lit blood-red, exhaled coolant misting in subzero air, prey footprints fading"
- "Stalking rogue droid through derelict spaceport corridor, body crouched low, plasma-rifle raised, magnetic-pad feet silent on metal grating"
- "Lunging at fleeing quarry mid-leap across rooftop gap, claws extended, body airborne arc against sodium-orange skyline"
- "Cornering wounded target against canyon wall, weapon arm raised, dust cloud settling around predatory stance"
- "Reading bioluminescent blood-trail through alien jungle understory, fingertip-sensor glowing as it sweeps the leaves"
- "Pursuing escape pod through asteroid field, thrusters mid-burn, targeting laser locking on fleeing exhaust trail"
- "Drawing twin energy-blades mid-pursuit through smoke-choked battlefield, optical sensors flaring red as target sighted ahead"
- "Pouncing from ledge onto quarry below, body mid-fall arc, hydraulic exhaust trailing, prey looking up too late"
- "Tracking warm-blood scent through pre-dawn forest, periscope head rotating slow, mist parting around its heavy frame"
- "Striking enemy combatant with rifle-stock mid-impact, sparks scattering, body following through the swing"
- "Closing distance on cornered fugitive through abandoned mining tunnel, headlamp cutting through dust, weapon raised high"
- "Circling around wounded beast in tall grass, multiple optical sensors triangulating position, claws extended"
- "Marking captured territory with electromagnetic pulse, defeated quarry sprawled in foreground, victory tally etching itself on chest plate"
- "Examining felled enemy droid mid-scan, sensor array reading remaining power signatures, trophy-stripping manipulators extending"
- "Hunting mechanical prey through neon-lit rain, water sheeting off chrome plating, predatory red optical eyes sweeping the alley ahead"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering. All 15 entries are HUNTING moments — the robot is actively pursuing or engaging quarry.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
