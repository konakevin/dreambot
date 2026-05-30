#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/mecha_hangars_mech_posture.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (n) => `Write ${n} MECH-POSTURE entries for a MangaBot mecha-hangar keyframe. THIS POOL IS THE ANTI-T-POSE LAW. Every entry describes the LOADED INSTANT body position of a giant mech in a hangar — kneeling, mid-stride, squatting, climbing, mid-launch, arm-extended, mid-rotation, etc.

⚠️ HARD BAN — REJECT INSTANTLY IF: T-pose / arms-out-default / standing-at-attention-facing-camera / both-arms-out-symmetrically / standing-still-arms-down-at-sides / "standing in the hangar" / "posed" / "stationary upright". Flux DEFAULTS anime mechs to T-pose. This pool's only job is to FORCE a non-T-pose loaded posture into every render.

Each entry: 14-22 words. ONE specific loaded body position. Each entry must end with an explicit posture-noun (kneeling / crouching / mid-stride / leaning / squatting / mid-launch / mid-rotation / climbing).

POSTURE VARIETY (every entry is forward-loaded mid-action):
- KNEELING for repair (one knee planted on hangar floor, head bowed forward, mid-maintenance)
- MID-STRIDE forward through hangar bay (one foot lifted mid-step, weight forward, motion frozen)
- SQUATTING at maintenance dolly (haunches low, panel open at shoulder revealing internals)
- COCKPIT-CANOPY OPENING (canopy lifted, pilot tiny climbing in via ladder, mech body leaned slightly forward)
- MID-LAUNCH crouched in catapult-rail (thrusters glowing, body leaned forward into the launch)
- ARM-EXTENDED firing rail-cannon test-fire (recoil bracing leg back, torso twisted)
- LEANING AGAINST support pillar (weight on one leg, arm draped on pillar, head tilted forward)
- HUNCHED OVER engineering-station (mech leaned forward, both hands gripping the bay-edge for diagnostics)
- MID-LANDING tilted forward on touch-down (one knee about to brace, dust kicking from boot-thrusters)
- ARM-ROTATING IN TEST (arm extended, joint mid-rotation, calibration sparks at the elbow)
- FIST-CLENCHED mid-recovery (one arm raised in fist-clench victory, other braced at hip)
- HEAD-DOWN POWER-OFF stance (mech inert, head bowed forward over chest, arms hanging slack at sides — NOT T-pose, slack-asleep)
- CLIMBING up a hangar-scaffold (one hand gripping a girder overhead, foot raised on a brace)
- CROUCHED for weapons-load (mech low to the deck so techs can clip a missile-pack to its shoulder)
- ONE-KNEE BOW (formal bow at deck-level, head lowered, fist on the ground in front)
- ARM-RAISED in salute-position (one arm crossed at the chest, body angled three-quarter)
- TURNED-AWAY 3/4 BACK (mech walking away from camera, looking over its own shoulder, depth into hangar)
- BOTH-HANDS-GRIPPING beam-rifle in stance-check (rifle raised at low-ready, body sideways to camera)
- ARM-OUT-LIFTING engine-block from forklift (one arm holding cargo overhead, other braced on knee)
- CROUCHED-ON-ONE-KNEE while engineer wires its chest-port (mech low so tech can reach)
- SIDE-STEP MID-PIVOT (mech mid-rotation, one foot crossing over the other, body angled)
- DOUBLE-BLADE-DRAW (one beam-saber drawn at hip, other still on shelf-mount)
- SHIELD-RAISED defensive-stance (one shoulder turned to camera, shield-arm overhead, body crouched)
- HANGING from gantry-crane mid-transport (crane-hooks lifting the mech, legs dangling, body twisted)

DO write:
- Kneeling on one knee with hand braced on hangar floor, head tilted forward in maintenance pose
- Mid-launch crouched in catapult-rail, thrusters glowing white-hot, body leaned forward into the catapult
- Squatting beside maintenance dolly, panel open at shoulder revealing cable-bundle internals
- Cockpit canopy lifted open, pilot tiny figure climbing in via ladder, mech leaned slightly forward
- Mid-stride forward through hangar door, foot lifted mid-step, weight forward in motion
- Arm extended firing rail-cannon, recoil bracing the leg back, torso twisted toward the impact
- Leaning against a support pillar, weight shifted to one leg, arms crossed at chest

DO NOT write:
- T-pose, arms-out, standing-at-attention, standing-still-arms-down-at-sides
- "Standing in the hangar", "posed for viewing", "stationary upright"
- Combat with another mech (this is HANGAR not battlefield)
- Camera / lighting / setting (lives in other axes)
- Mech class identifiers (lives in mech_class)

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
