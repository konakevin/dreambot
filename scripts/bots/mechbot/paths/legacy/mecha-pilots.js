/**
 * MechBot mecha-pilots path — pilot + giant mech, scale-relationship as subject.
 * Gundam / Evangelion / Pacific Rim / The Iron Giant / Titanfall.
 * Pilot can be human / cyborg / alien / android — variety encouraged.
 */

const pools = require('../pools');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const subject = picker.pickWithRecency(pools.MECHA_PILOT_SUBJECTS, 'mecha_pilot_subject');
  const action = picker.pickWithRecency(pools.MECHA_PILOT_ACTIONS, 'mecha_pilot_action');
  const setting = picker.pickWithRecency(pools.MECHA_PILOT_SETTINGS, 'mecha_pilot_setting');
  const cameraAngle = picker.pickWithRecency(pools.CAMERA_ANGLES, 'camera_angle');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a sci-fi cinematographer writing a MECHA PILOT scene for MechBot — a pilot + their giant mech, with scale relationship as the punchline. Hyper-real cinematic 3D. Output wraps with style prefix + suffix.

━━━ NON-NEGOTIABLE — PILOT VISIBLE & TINY ━━━
The pilot MUST be visible in frame. The mech MUST be visible (or at minimum the cockpit interior they occupy). Scale: the pilot is dwarfed by the machine — small enough to be a scale ruler. NEVER a shot where pilot fills the frame as a portrait. NEVER mech-only with no pilot reference.

━━━ PILOT BIOLOGY — ANYTHING GOES ━━━
The seed below specifies pilot biology (human / cyborg / alien / android / hybrid). Render whatever the seed says. NO defaulting to humanoid-male-pilot every time.

━━━ PILOT + MECH (the seeded subject) ━━━
${subject}

━━━ THE ACTION (what the pilot is DOING in relation to the mech) ━━━
${action}

The pilot is mid-motion. The mech is part of the action — being climbed, ridden, occupied, repaired, deployed. NEVER a static portrait pose.

━━━ SETTING ━━━
${setting}

━━━ CAMERA / FRAMING ━━━
${cameraAngle}

The frame must include both the pilot AND enough of the mech (or cockpit interior) for the scale relationship to read. Wide shots favored — extreme closeups only when seed explicitly requires (cockpit-interior framings).

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ ABSOLUTE BANS ━━━
- NO active battlefield with combat happening (that's titan-war-machines path)
- NO pilot-less mech alone (that's robot-moment path)
- NO squad of armored soldiers (that's power-armor-infantry)
- NO pilot fused into the mech (cyborg-* paths) — pilot is separate, OPERATING the mech
- NO mining / construction / industrial work (that's industrial-machines)
- NO scrappy wasteland scavenger rig (that's rust-apocalypse)

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases.`;
};
