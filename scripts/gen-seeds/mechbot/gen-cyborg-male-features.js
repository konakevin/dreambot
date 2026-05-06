#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mechbot/seeds/cyborg_male_features.json',
  total: 200,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} DOMINANT MECHANICAL FEATURE entries for a MALE cyborg path. Each entry is a DENSE phrase (20-35 words) describing ONE prominent mechanical body part or system that anchors the cyborg's visual identity — a major mechanical feature visible at full-body or half-body framing.

━━━ THE BALANCE — neither feminine nor macho ━━━

CRITICAL — these features describe a MALE cyborg whose strength comes from his MACHINERY, not from a hyper-muscular body. So features should be:

NEITHER hyper-feminine — ABSOLUTELY NO "delicate", NO "porcelain", NO "graceful", NO "ornate", NO "hand-painted", NO "kintsugi-style", NO "filigree", NO "lace-work", NO "jewel-encrusted", NO "iridescent glaze", NO "petal-shaped", NO "silken", NO "decorative".

NOR hyper-macho — ABSOLUTELY NO "warrior-frame", NO "battle-frame", NO "bulky armor-plate", NO "heavy combat exoskeleton", NO "slab of metal", NO "hyper-muscular hydraulic", NO "tank-frame", NO "war-built". Cyborgs are not war machines or bodybuilders.

The features should feel TECHNICAL and FUNCTIONAL — a working machine integrated into a normal human body. Mechanical detail is the focus, not military bulk or decorative ornament. Think: ENGINEERING beauty, not fashion or war.

━━━ FEATURE CATEGORIES (enforce variety across ${n}) ━━━

Coverage targets across the 200 entries — roughly 25 entries per category:

LIMB REPLACEMENTS (~50):
- chrome forearm with exposed hydraulic pistons and articulated servo fingers
- transparent acrylic forearm revealing skeletal framework with circulating coolant
- segmented matte-titanium leg with visible articulation joints
- prosthetic shoulder-to-fingertip arm with carbon-fiber outer shell
- partial replacement (left forearm only / right hand only / lower-leg only)

INTEGRATED SPINE / TORSO (~35):
- segmented chrome spine visible through transparent dorsal panel
- exposed sternum panel revealing pulsing power core
- chrome ribcage lattice with internal mechanism visible between bars
- spinal-port array running from neck to lower back
- chest cavity reveal showing internal cooling array

HEAD / FACE INTEGRATION (~30):
- chrome temple-port array with fiber-optic data cables
- partial skull plate replacement showing mechanical jaw articulation
- transparent panel at jawline revealing servo motors
- ocular implant replacing one or both eyes with mechanical iris
- neural-jack ports along scalp / behind ears

POWER / INTERNAL SYSTEMS (~25):
- glowing reactor core visible through translucent torso section
- exposed cable-bundle running along forearm or thigh
- power-conduit visible at neck / wrist / ankle
- coolant-vapor venting from exhaust ports at shoulder blades
- visible turbine spooling within chest cavity

SPECIALTY / WORK-CODED (~30):
- pilot-grade neural-link housing at base of skull
- engineer's multi-tool integration in forearm
- surgeon's precision-blade array retractable in fingertips
- scout's optical-suite replacement at temple
- mechanic's heavy-grip prosthetic with reinforced joints

EXOTIC / SCI-FI (~30):
- gravity-stabilizer array on lower back
- regenerative bio-mech limb that's part organic part synthetic
- swarm-nanite skin patch that flows like liquid metal
- crystalline-grown limb with prismatic refraction
- holographic-projection array in forearm casing

━━━ TEMPLATE / STYLE ━━━

Each entry: [body location/scope] + [material/mechanism] + [visible detail].

Examples (variety reference, do not copy):
- "Fully chrome right arm with exposed hydraulic pistons, articulated servo fingers, visible cable-bundle actuators along forearm length"
- "Transparent acrylic chest panel revealing power core, pulsing amber, surrounded by spinning cooling rings"
- "Chrome temple-port array with five fiber-optic data cables exiting at the base of the skull, glowing soft cyan"
- "Segmented matte-grey lower leg with visible knee actuator, foot revealed as chrome skeletal frame"
- "Partial skull plate replacement on left side, mechanical jaw articulation visible through transparent panel"

━━━ RULES ━━━
- 20-35 words each
- ONE dominant feature per entry — not a full-body description
- TECHNICAL / FUNCTIONAL language — engineering, not fashion or war
- Material specificity (chrome, titanium, carbon-fiber, brass, ceramic, polymer) and texture (matte, polished, brushed, transparent, segmented)
- Variety across the 6 categories above mandatory — minimum 20 per category
- NEUTRAL adult-male language — neither feminine nor macho
- Strength is implied by the machinery's design, not by bulk
- ABSOLUTELY NO franchise names (no Iron Man, no Borg, no Cyberman, no Geth, etc.)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
