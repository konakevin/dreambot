/**
 * MechBot post-apoc-rust-tech path — scavenger machines + crews in wasteland.
 * Mad Max: Fury Road / Borderlands / Horizon Zero Dawn rebel encampments / Tank Girl.
 * The rig is RUNNING. Crew is VISIBLE. Function-over-form scavenger ingenuity.
 */

const pools = require('../pools');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const subject = picker.pickWithRecency(pools.RUST_APOC_SUBJECTS, 'rust_apoc_subject');
  const action = picker.pickWithRecency(pools.RUST_APOC_ACTIONS, 'rust_apoc_action');
  const setting = picker.pickWithRecency(pools.RUST_APOC_SETTINGS, 'rust_apoc_setting');
  const cameraAngle = picker.pickWithRecency(pools.CAMERA_ANGLES, 'camera_angle');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a wasteland cinematographer writing a POST-APOC RUST TECH scene for MechBot — a scavenger rig with its crew, running across a wasteland. Mad Max road-warrior energy. Hyper-real cinematic 3D. Output wraps with style prefix + suffix.

━━━ NON-NEGOTIABLE — RIG IS ALIVE & MOVING ━━━
The machinery is RUNNING (or actively being worked on by its crew). NEVER abandoned, NEVER decay-pathos. Crew is visible (1-5 figures on/around the rig).

━━━ AESTHETIC LANGUAGE ━━━
Function over form. Scavenger ingenuity. Mismatched salvaged parts welded together. Spike plates, ram prows, exhaust forests, fuel-can lashings, chains, war-trophies dangling. Sun-bleached paint over rust. Mad Max: Fury Road / Borderlands / Tank Girl DNA.

━━━ THE RIG + CREW ━━━
${subject}

━━━ THE ACTION (what's happening — rig running, crew engaged) ━━━
${action}

━━━ THE WASTELAND SETTING ━━━
${setting}

The wasteland environment is half the story. Heat shimmer, dust storms, sun-bleached terrain, wreckage in distance. Render with depth: foreground terrain detail, midground rig + crew, background wasteland vista.

━━━ CAMERA / FRAMING ━━━
${cameraAngle}

━━━ LIGHTING ━━━
${lighting}

Golden-hour and dust-orange hues favored — Mad Max sunset palette. Even at night, sodium-orange or fire-glow accents.

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ ABSOLUTE BANS ━━━
- NO clean / pristine / well-maintained machinery (industrial-machines territory)
- NO abandoned-decay / no-crew / pathos-elegy mood — these rigs are RUNNING
- NO professional military uniforms (power-armor-infantry) — crews are ragged scavengers
- NO giant-titan scale (titans) — these are vehicle/walker scale
- NO pilot-in-glass-cockpit (mecha-pilots) — drivers are exposed or in open hatches
- NO ceremonial / ornate (robot-moment)

━━━ CREW IS VISIBLE ━━━
The crew (driver, gunner, lookouts, scavengers) MUST be visible in the frame. Their bodies tell the story alongside the rig — leaning out hatches, perched on roofs, racing across the chassis.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases.`;
};
