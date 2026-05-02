#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/robot_types.json',
  total: 200,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} DROID / ROBOT entries for StarBot's robot-moment path. Each entry is a DENSE phrase (25-45 words) describing a SPECIFIC AUTONOMOUS MACHINE — character-scale, recognizable as a ROBOT at a glance, with personality shape and signature material/finish.

━━━ SCALE — STRICTLY CHARACTER-SCALE ━━━

Every robot is BETWEEN 0.5 METERS AND 3 METERS TALL — a thing you could stand next to. Smaller for utility / mouse / probe droids (knee-high); average for humanoid droids (person-sized); slightly larger for armored / combat droids (8-10 feet at most). NEVER kilometer-scale, NEVER thirty-meter-tall, NEVER building-sized, NEVER vehicle-scale.

ABSOLUTE BANS:
- NO "titan" / "titanic" / "colossal" / "gigantic" / "kilometer" / "thirty-meter" / "hundred-meter" / "skyscraper" / "behemoth" / "leviathan" / "kaiju"
- NO "dreadnought" / "warship" / "naval hull" / "aquatic titan" / "submerged hull"
- NO "cathedral" / "stained glass" / "limestone" / "carved stone" / "gargoyle" / "monolith" / "fortress" / "temple architecture"
- NO "construct" coiling at scale / NO "sentinel" architecture / NO "chandelier" / NO "monument"
- NO building-sized siege walkers, NO mecha-suits piloted by humans (those are vehicles, not droids)
- NO biomechanical organisms with hydraulic muscle fibers and arterial coolant — these are DROIDS, not biological cyborgs
- NO Star Wars proper nouns ("R2-D2", "BB-8", "C-3PO", "Battle Droid") — describe original visual aesthetic generically

━━━ INSPIRATION — STAR WARS DROID VARIETY (visual variety only, never name) ━━━

Think the BREADTH of droid types in classic sci-fi cinema — small companion droids, astromechs, protocol droids, battle droids, probe droids, mouse droids, security droids, medical droids, surveyor droids, courier droids, gardener droids — each with unique BODY PLAN. But the AESTHETIC is original: no Star Wars chrome-gold, no R2-blue-and-white, no white-stormtrooper plastic. Pull from your own sci-fi imagination.

━━━ BODY PLAN VARIETY (mandatory across ${n}) ━━━

Coverage targets — roughly ~25 entries per category across 200:

BIPEDAL HUMANOID DROIDS (~30):
- skinny tall humanoid droid with skeletal frame and exposed servo joints
- armored humanoid droid with rounded shoulder pauldrons and full visor face-plate
- utility humanoid droid with tool-arms in place of hands and rolling base
- diplomatic protocol-style humanoid droid with elegant articulated hands and expression-mimicking face

QUADRUPED / ARACHNID / INSECTILE DROIDS (~25):
- four-legged scout droid with low-slung body and articulating sensor head
- spider-bodied maintenance droid with eight tool-tipped legs
- crab-bodied scuttling droid with claw manipulators
- centipede-bodied long-segmented industrial droid

WHEELED / SPHERICAL / ROLLING DROIDS (~25):
- spherical rolling droid with magnetic head that swivels independently
- single-wheel droid with gyro-stabilized torso above
- two-wheel scout droid with elongated mast for sensors
- tracked utility droid with stubby manipulator arms

HOVERING / FLOATING DRONE DROIDS (~20):
- floating disc-droid with multiple tool-arms hanging beneath
- spherical hover-probe with single optical sensor and antenna
- jellyfish-shaped hover droid with trailing sensor tentacles
- pyramid-bodied hover-courier with side-mounted thrusters

SMALL UTILITY DROIDS (~25):
- knee-high boxy mouse droid with simple wheels and tiny manipulator
- briefcase-sized service droid with retractable tool-set
- doorknob-sized cleaner droid with brushing arms
- football-sized scout-droid with insectile legs

LARGE COMBAT / SECURITY DROIDS (~20):
- bulky armored security droid (max 8-10 feet tall, NOT a vehicle), heavy plating, integrated weapons
- hulking heavy-lifter droid with reinforced shoulders and oversized arms
- four-armed enforcer droid with weapon-integrated forearms
- tank-tracked security droid with riot-shield arm

SPECIALIZED PURPOSE DROIDS (~30):
- medical droid with surgical-arm array and steady hover-base
- gardening droid with watering-arms and seed-dispenser hopper
- librarian droid with book-handling tendrils and reading-lamp head
- chef droid with multiple cooking-implement arms
- musician droid with built-in instruments
- archaeologist droid with delicate brush-arms and excavation tools
- repair-and-weld droid with sparking torch-arm and visor-mask head

EXOTIC / ALIEN-ENGINEERED DROIDS (~25):
- crystalline-bodied droid with prismatic refractive panels (not stained glass — clear faceted crystal)
- chrome droid that shifts shape slightly like liquid metal
- ceramic-shelled droid with hand-applied geometric patterns
- carbon-fiber-and-bronze fusion droid with art-nouveau silhouette
- alien-engineered droid with non-Euclidean joint arrangement

━━━ ENTRY TEMPLATE ━━━

Each entry: [body plan / silhouette] + [material / finish / surface detail] + [signature feature or function-implying detail].

Examples (variety reference, do not copy):
- "Skinny tall humanoid droid with rust-streaked beige plating, single round optical sensor at the head, trailing wire-bundles from spinal port, articulated three-finger hands, retired-courier weariness in posture"
- "Spherical rolling droid in matte navy with antennae sprouting from a swiveling head, tool-port hatches across the body, holographic projector iris"
- "Knee-high mouse droid with seven-sided yellow chassis, tiny tread base, two retractable arms, blinking blue eye-lamp, scuffed paint from years of corridor service"
- "Spider-bodied maintenance droid with brushed copper body and eight tool-tipped legs, central magnifier-eye glowing amber, tool-bandolier wrapped around the thorax"
- "Hovering disc-droid in obsidian black with three articulated arms hanging beneath, single horizontal red sensor strip, silent gravitic propulsion glow"
- "Tracked utility droid the size of a small refrigerator, rounded olive-drab body, telescoping crane-arm, headlamp cluster, weld scars across the side"

━━━ RULES ━━━
- 25-45 words per entry, dense and paintable
- ONE body plan per entry (no "humanoid AND quadrupedal hybrid")
- Character-scale autonomous machine (0.5m to 3m, max 10ft for combat droids)
- READ AS ROBOT at a glance — bipedal / quadrupedal / spherical / hovering / boxy
- Material specificity (chrome / titanium / matte plastic / carbon fiber / brass / copper / ceramic / weathered paint / gunmetal / scratched bronze)
- Personality-implying detail (a swiveling head, a single eye, a worn-paint patina, a dent, a sticker, a tool bandolier)
- NEVER reference any franchise droid by name
- Variety across the 8 categories above mandatory
- Robots are RECOGNIZABLE as robots — Flux must render them as standing machines, not as scenery

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
