#!/usr/bin/env node
/**
 * Append ~60 EXOTIC / IMPOSSIBLE-LOOKING-BUT-ENGINEERED droid entries to
 * the robot_types pool. Pushes range and chaos while keeping every entry
 * character-scale and engineering-plausible.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/robot_types.json',
  total: 248,
  batch: 12,
  append: true,
  metaPrompt: (n) => `You are writing ${n} EXOTIC / IMAGINATIVE DROID entries for StarBot's robot-moment pool. Each entry is a DENSE phrase (25-50 words) describing a CHARACTER-SCALE autonomous robot with an UNUSUAL body plan, hybrid form, or eccentric design — but still ENGINEERING-PLAUSIBLE (looks like it could actually function, not abstract art).

━━━ THE BALANCE — IMPOSSIBLE-LOOKING BUT GROUNDED ━━━

Push the IMAGINATION wider. We have plenty of standard bipedal / spherical / quadruped droids in the pool already. These ${n} new entries should expand the RANGE — unusual shapes, asymmetric proportions, hybrid locomotion modes, eccentric design choices — but every droid still reads as a REAL ENGINEERED MACHINE, not as surrealist sculpture or fantasy creature.

CRITICAL — STILL GROUNDED:
- Every droid LOOKS like it could function (visible mechanism makes sense, joints articulate plausibly, balance is convincing)
- Every droid is between 0.3m and 3m in body size (knee-high to slightly-larger-than-a-person)
- Every droid is a MACHINE — chrome / titanium / brass / ceramic / carbon-fiber / plastic / composite material
- Every droid reads as a ROBOT at first glance — autonomous, character-scale, NOT a vehicle, NOT a building

ABSOLUTE BANS:
- NO "titan" / "kilometer" / "thirty-meter" / "behemoth" / "leviathan" / "kaiju"
- NO megastructure / dreadnought / warship / cathedral / monolith / building
- NO biological organisms / fleshy biomech / organ-replicas
- NO surrealism that breaks engineering — droids should look like they could actually move
- NO franchise droid names

━━━ EXOTIC BODY PLANS — push BEYOND the standard 8 categories already in the pool ━━━

Coverage targets across ${n} entries — minimum 5 per category:

ASYMMETRIC / OFF-BALANCE (~10): one large arm + one small / lopsided silhouette / front-heavy / leaning weight distribution
- humanoid droid with one massive heavy-lifting arm and one delicate manipulator arm, weight distribution clearly asymmetric
- droid with a large rotating sensor mast on one side and a counterweight pendulum on the other
- top-heavy droid with oversized cranial assembly balanced on a slender neck

HYBRID LOCOMOTION (~10): mixes walking + rolling / hovering + tracked / climbing + treading / wheeled-tripod
- droid with three wheeled legs that retract into walking limbs depending on terrain
- droid with hover-base AND folding tripod for stable docking
- treaded droid with deployable spider-leg climbing rig
- humanoid torso on a four-wheeled rolling base

MODULAR / RECONFIGURABLE (~8): swappable body sections / detachable manipulator pods / multi-mode silhouettes
- droid with magnetic-attached modular arms — currently configured with welding torches
- segmented droid that can detach its head as an independent flying scout
- droid with interchangeable tool-pods clipped to its torso

MULTI-HEADED / MULTI-OPTICAL (~8): several sensor heads / multiple cameras / 360-degree awareness
- droid with three independently-rotating sensor heads on stalks
- compound-eye droid with twenty optical sensors arrayed across a dome
- two-headed bipedal droid with one forward and one rear-facing head

UNUSUAL PROPORTIONS (~10): very tall thin / very short wide / pencil-thin / barrel-shaped
- pencil-thin droid two meters tall but only twenty centimeters wide
- barrel-shaped utility droid wider than tall, four short legs underneath
- string-bean droid with extremely long thin limbs and small body
- Y-shape droid with three arms radiating from a central pivot

ECCENTRIC PERSONALITY (~10): clearly customized by an owner / decorated with stickers / hand-painted folk art / time-period-coded retro / Victorian-meets-future / nautical-style / desert-nomad-style
- droid covered in hand-painted folk-art murals from a small colony
- Victorian-aesthetic droid with brass-and-walnut chassis and porthole optics
- nomad-decorated droid with woven cloth covers, prayer beads, and tribal markings
- 1950s-retro-futurism droid with cream paint, chrome trim, and atomic-era curves
- dieselpunk droid with rivets, hand-cranked manipulators, and visible piston-rods

UNCONVENTIONAL OPTICAL / SENSOR ARRAYS (~5): single huge eye / kaleidoscope vision / fold-out scanner-arrays
- droid with a single huge round optical sensor dominating its head
- kaleidoscope-eyed droid with twelve separate iris-rings rotating independently
- fold-out scanner droid with arrays that unfold like a flower when active

CHIMERICAL / MIXED-INSPIRATION (~9): clearly engineered but combines unusual element-pairings (umbrella + tripod, lamp + arm, vase + sensor-array)
- droid shaped like a walking umbrella with a sensor-stalk where the handle would be
- droid with a body resembling an antique lamp on rolling treads
- droid that looks like a vase with articulated arms emerging from its rim

━━━ ENTRY TEMPLATE ━━━

Each entry: [unusual body plan / silhouette] + [material / finish / surface detail] + [signature feature, optional eccentric-personality detail].

Examples (variety reference, do not copy):
- "Two-meter pencil-thin droid with extremely narrow chrome chassis, three single-jointed legs splayed wide for balance, sensor stalk extending vertically from a tiny rounded head, observatory-grade lens housing"
- "Y-shaped courier droid with three arms radiating from a central hover-disc, each arm tipped with a magnetic delivery clamp, brass body painted with hand-stenciled route numbers"
- "Walking umbrella droid in faded blue canvas stretched over a chrome ribcage frame, four telescoping legs underneath, sensor-handle arching up where the umbrella handle would be, folding mechanism engaged"
- "Asymmetric bipedal droid with one oversized hydraulic-driven heavy-lifter arm and one slender precision-manipulator arm, gunmetal chassis, central counterweight visible in the back"
- "Compound-eye droid with twenty independent optical sensors arrayed across a dome head, brushed steel body with black rubberized joints, four tool-arms hanging from the central torso"

━━━ RULES ━━━
- 25-50 words per entry — dense, vivid, paintable
- ENGINEERING-PLAUSIBLE — every part looks like it could function, joints are articulated, balance is convincing
- Character-scale (0.3-3m body)
- Variety across the 8 exotic categories above mandatory
- Material specificity always (chrome / titanium / brass / ceramic / weathered paint / carbon fiber / wood / leather / cloth)
- Personality / eccentric detail welcome — stickers, paint jobs, dents, hand-modifications
- DON'T overlap heavily with the standard 8 body plans already in the pool (bipedal humanoid / quadruped / spider / sphere / hovering / mouse-utility / tracked / standard combat) — these new entries should be the WEIRD ones

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
