#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');

// SUPPLEMENT 2026-05-03 — APPENDS bounty-hunter robot entries to robot_types.json.
// New mission category. Lone operator who tracks/captures/kills targets.
//
// HARD BAN: Mandalorian aesthetic. NO T-visor helm, NO single horizontal optical
// slit, NO jet-pack, NO single-shoulder pauldron cape. Mandalorians are PEOPLE,
// not robots — leaning on that aesthetic taints the recipe.
//
// PERMITTED hunter visual DNA: cylindrical assassin-droid heads, heavy combat
// helms with TWIN deep-set slit-optics, multi-iris compound-eye predator domes,
// skull-cap helms with thermal-visor scope arrays. Weapons harnesses, kill-tally
// engravings, restraint coils, thruster pods (not jetpacks).

generatePool({
  outPath: 'scripts/bots/starbot/seeds/robot_types.json',
  total: 116, // existing 108 + 8 new (we'll cull two Mando-tainted ones first)
  batch: 8,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} BOUNTY HUNTER ROBOT entries to ADD to an existing pool. Each entry is a DENSE phrase (40-60 words) describing the BODY of a sci-fi bounty-hunter droid — NOT its action, NOT its setting (those come from other pools).

EVERY entry is a LONE-OPERATOR TRACKER who finds and captures/kills targets.

━━━ HARD BAN — MANDALORIAN AESTHETIC ━━━

Mandalorians are PEOPLE wearing armor, not robots. Do NOT lean on or reference the Mandalorian / Boba Fett look in any way. FORBIDDEN features:
- T-shaped visor helm
- Single horizontal optical slit helm
- Jet-pack on back
- Single-shoulder pauldron cape (right or left)
- Beskar / chrome-armor reflective cuirass

The bounty hunter is a ROBOT, not a person in armor. Read as MECHANICAL.

━━━ THE RECIPE ━━━

1. BODY PLAN — vary across the ${n} entries:
   - bipedal hunter — ~50%
   - tripedal pursuit-warden — ~15%
   - quadrupedal tracker — ~10%
   - hexapod tracker — ~10%
   - asymmetric (one massive cannon-arm + one delicate sensor-arm) — ~10%
   - four-armed assassin (multi-arm) — ~5%
   FORBIDDEN: skeletal endoskeleton, spherical-only ball-droid, centipede-segmented, "X-bodied" where X is an animal.

2. HEAD / FACE — pick ONE, vary across the pool. NEVER a single horizontal optical slit:
   - **Cylindrical assassin-droid head** with single horizontal scanning sensor band glowing red/amber/cyan (cigar-shape, no eyes — most common)
   - **Heavy combat helm with TWIN deep-set slit-optics** — two narrow optical slits set deep into eye-sockets glowing yellow/red, jaw guard plate
   - **Skull-cap helm with side-mounted thermal-visor pods** — low-profile dome with 2-4 lateral sensor canisters, thermal-tracking scope on temple
   - **Multi-iris compound-eye predator dome** — dome head with 12-30 small lenses each glowing red/amber, insect-array vision
   - **Multi-spectrum scanning bar visor** — full-face visor with horizontal scanning bar PLUS dual sensor pods on temples (the dual pods make it not Mando)
   - **Cylindrical IG-style head with vertical sensor stripe** — narrow cylinder, single VERTICAL slit (not horizontal)
   - **Helmet with multiple panel optics arranged as eye-pairs** — armored helm with 2-4 separate small eye-lenses, structured face

3. WEAPONS LOAD-OUT (every entry has 2+ visible):
   - wrist-mounted blaster gauntlets / vibrosword / kinetic-rifle / scattergun / dart-pistol / vibroblade / energy-mace / heavy-pistol / silenced sidearm / chain-rifle / sonic-stunner
   - electro-net launcher / restraint coils at hip / capture-cuffs slung from harness / shock-prod baton
   - shoulder-mounted missile pod / wrist-flame projector / signal-jamming antenna

4. BODY DETAIL — pick 3+:
   - weather-beaten armored plating with battle scars / kill-tally engravings
   - weapons harness / bandolier / ammunition belt across torso
   - shoulder-mounted thruster pods (NOT a jet-pack)
   - trophy-medallion belt / bounty-mark engravings on pauldron
   - capture-net or restraint-coil hanging at hip
   - thermal-tracking compound-eye scope or visor array
   - signal-jamming antenna on shoulder
   - oil-stained reinforced plating
   - chrome-and-bronze plating with verdigris streaks
   - dark charcoal armor with red accent stripes
   - sand-beaten desert-camo armor
   - tactical webbing with grenades and locator-beacons (NOT a Mandalorian-style jetpack)
   - acid-etched circuit-paths

5. ACCENT LIGHTS / GLOW — pick 1-2:
   - red thermal-tracking visor pulse
   - amber targeting-array glow
   - plasma-cyan rim-lighting on helmet edges
   - fel-violet underlight from belt-mounted reactor
   - white-hot rifle barrel glow

━━━ HARD RULES — ROBOT-ONLY DESCRIPTIONS ━━━

This pool describes ROBOTS, not actions or scenes. EVERY entry must NOT contain:
- Action verbs ("stalking", "tracking", "lunging", "crouched", "hunched", "mid-stride")
- Stances or poses ("predator stance", "ready to fire", "weapon raised")
- Settings or environments
- Camera language

The robot's MISSION is implied by its BODY — weapons + gear + helm. Path-builder mixes in actions/scenes/environments separately.

━━━ FEW-SHOT EXAMPLES (robot-only, no actions, NO Mandalorian) ━━━

EX-1: "Tripedal pursuit-warden, three hydraulic telescoping legs in desert-tan weathered plating, cylindrical assassin-droid head with single horizontal scanning sensor band glowing plasma-cyan, electro-net launcher mounted on hip, twin heavy-pistols crossed at chest, restraint-coil bundle at waist, signal-jamming antenna sprouting from spine, kill-tally engravings worn into thigh plating."

EX-2: "Asymmetric bounty-killer, bipedal charcoal-titanium frame with one massive chain-rifle cannon-arm and one delicate target-acquisition sensor-arm, heavy-plate helm with twin yellow slit-optics in deep eye-sockets, ammunition bandolier across chest carrying trophy-tags, oil-stained reinforced thigh plating, vibroblade scabbard mounted on lower back, signal-jamming antenna on shoulder."

EX-3: "Four-armed assassin-hunter droid, sand-beaten desert-camo armor scarred by blaster fire, multi-iris compound-eye predator dome head with twelve small red lenses, four mechanical arms each fitted with distinct weapon (vibroblade / kinetic-rifle / dart-pistol / restraint-coil launcher), heavy bandolier across torso carrying ammunition cells and trophy-tags, shoulder-mounted thruster pods, weapons-rack on dorsal plating."

EX-4: "Hexapod tracker-warden droid, six pneumatic legs with sand-beaten desert-tan armor plating, multi-spectrum scanning visor with PAIRED sensor pods on temples glowing fel-violet, vibrating mandible-blades extending from cranial mount, dorsal weapons rack with kinetic-rifle and capture-cuffs, ammunition bandolier across thorax, trophy-medallion belt with bone-white tags."

EX-5: "Bipedal manhunter droid, skull-cap helm with side-mounted thermal-visor pods glowing amber and twin antenna-pods extending laterally, dark charcoal armor with crimson accent stripes along shoulders, weapons harness slung with silenced sidearm, vibroblade scabbard, kinetic-rifle holstered to back, restraint coils at hip, kill-tally engravings on pauldron."

EX-6: "Quadrupedal tracker, four reinforced strut legs with chrome-and-bronze plating streaked with verdigris, helmet with multiple panel optics arranged as eye-pairs glowing red, dart-pistol integrated into right forearm, capture-net launcher mounted on dorsal carapace, restraint-cuff harness across torso, kill-tally engravings worn into hip plating, signal-jamming antenna on spine."

EX-7: "Bipedal tracker-killer, asymmetric frame with one massive scattergun shoulder-cannon and one delicate biometric-scanner arm, cylindrical IG-style head with VERTICAL sensor stripe glowing red, vibroblade mounted on lower back, restraint-coil bundle at hip, ammunition bandolier across chest, oil-stained reinforced thigh plating, kill-tally engravings on pauldron, shoulder-mounted thruster pods."

EX-8: "Bipedal bounty-droid, weather-beaten chrome-and-bronze chassis with verdigris streaks, multi-iris compound-eye dome head with sixteen small lenses pulsing amber, weapons harness with twin dart-pistols crossed at chest, electro-net launcher mounted on right shoulder, restraint coils at hip, signal-jamming antenna on left shoulder, kill-tally engravings worn deep into pauldron, trophy-medallion belt."

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering. Each entry is a body-only description of a bounty-hunter droid. NO Mandalorian-similar features.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
