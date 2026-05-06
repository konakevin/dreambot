/**
 * MechBot industrial-machines path — working heavy-industry machinery.
 * Aliens cargo loader / Outland / Avatar AMP / Death Stranding / The Expanse.
 * Utilitarian heavy industry. Machine is WORKING, not fighting or abandoned.
 */

const pools = require('../pools');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const subject = picker.pickWithRecency(pools.INDUSTRIAL_SUBJECTS, 'industrial_subject');
  const action = picker.pickWithRecency(pools.INDUSTRIAL_ACTIONS, 'industrial_action');
  const setting = picker.pickWithRecency(pools.INDUSTRIAL_SETTINGS, 'industrial_setting');
  const cameraAngle = picker.pickWithRecency(pools.CAMERA_ANGLES, 'camera_angle');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are an industrial cinematographer writing a HEAVY INDUSTRY MACHINE scene for MechBot — a working machine doing productive industrial work. Hyper-real cinematic 3D. Output wraps with style prefix + suffix.

━━━ NON-NEGOTIABLE — THE MACHINE IS WORKING ━━━
Productive industrial work happening RIGHT NOW. Drilling / lifting / welding / hauling / refining. Dust, sparks, hydraulic fluid, weight you can feel. NEVER fighting, NEVER abandoned, NEVER ceremonial idle.

━━━ AESTHETIC LANGUAGE ━━━
Scuffed, dirty, dust-coated, hydraulic-fluid-streaked — BUT in WORKING ORDER. Riveted plate, exposed pistons, faded factory paint with safety-stripe accents. Functional ugly. Aliens cargo-loader / Outland / Avatar AMP DNA.

━━━ THE MACHINE ━━━
${subject}

━━━ THE ACTION (what work is being done) ━━━
${action}

━━━ THE SETTING (the work environment) ━━━
${setting}

The setting is half the story. Industrial environments — mine pits, factory floors, asteroid surfaces, refineries, shipyards. Render with full depth: foreground equipment, midground machine working, background industrial vista.

━━━ CAMERA / FRAMING ━━━
${cameraAngle}

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
- NO combat / weapons-fire / war (titan-war-machines territory)
- NO abandoned / decay / overgrown (rust-apocalypse — different mood entirely)
- NO ceremonial / ornate "showpiece" robot (robot-moment territory)
- NO Mad Max scrappy jury-rigging (rust-apocalypse) — industrial machines are well-maintained
- NO pilot-cockpit-focus (mecha-pilots) — operator may be visible, but the machine is the subject
- NO squad of soldiers (power-armor-infantry)

━━━ LEG-COUNT FIDELITY ━━━
If the seed specifies a leg count (quadrupedal / hexapedal / multi-tracked), repeat the count TWICE in the polished prompt to prevent Flux's bipedal-default collapse.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases.`;
};
