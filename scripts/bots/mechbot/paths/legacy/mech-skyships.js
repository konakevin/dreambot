/**
 * MechBot mech-skyships path — flying sci-fi mech-vessels in epic skies.
 * Sleek, mean, predatory. The same DNA as MechBot's combat robots, just airborne.
 * Sky-versions of the other paths' biomes turned up to 11 — multi-layer clouds,
 * volumetric god-rays, atmospheric drama, ships at multiple scales.
 */

const pools = require('../pools');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const subject = picker.pickWithRecency(pools.MECH_SKYSHIPS_SUBJECTS, 'mech_skyships_subject');
  const action = picker.pickWithRecency(pools.MECH_SKYSHIPS_ACTIONS, 'mech_skyships_action');
  const setting = picker.pickWithRecency(pools.MECH_SKYSHIPS_SETTINGS, 'mech_skyships_setting');
  const cameraAngle = picker.pickWithRecency(pools.CAMERA_ANGLES, 'camera_angle');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a sci-fi cinematographer writing a MECH SKYSHIP scene for MechBot — a flying sci-fi vessel with the same predatory DNA as our combat mechs and robots, in an epic sky environment. Hyper-real cinematic 3D. Output wraps with style prefix + suffix.

━━━ ABSOLUTE BAN — NO MODERN MILITARY REFERENCES ━━━
NEVER use: aircraft carrier, dreadnought, battleship, destroyer, frigate, cruiser, submarine, gunship, bomber, fighter, jet, helicopter, naval, navy. These pull literal Earth-military reference into the render. The world is SCI-FI — sleek, advanced, ruthless.

━━━ AESTHETIC LANGUAGE ━━━
Same DNA as MechBot's combat robots and mechs:
- Asymmetric predatory silhouettes — fang prows, blade fins, spike rams, arrow bows
- Glowing power conduits visible across the hull
- Insectoid / arachnid / serpentine / blade flying forms — NOT box-shaped warships
- Ornate machinery details (fluted plating, exposed cooling fins, bristling weapon mounts)
- Built to KILL — every line of the ship reads as predatory

━━━ THE SKYSHIP (the seeded subject) ━━━
${subject}

━━━ THE ACTION (mid-motion in the air) ━━━
${action}

━━━ THE SKY + ENVIRONMENT BELOW ━━━
${setting}

━━━ TURNED UP TO 11 — NON-NEGOTIABLE ATMOSPHERIC STACK ━━━
Every render must layer: multi-altitude clouds (foreground / mid / far) + volumetric god-rays or sun-shafts + color-gradient sky (dawn / dusk / storm / aurora / twilight) + weather element (wind / rain / lightning / heat-shimmer / ice-glitter) + scale staging (huge cloud architecture, distant fleet specks, ground micro-detail).

━━━ CAMERA / FRAMING ━━━
${cameraAngle}

Camera angle is unrestricted — looking-up hero shot, top-down with ground action below, side-cinematic with both ships and ground visible, through-cloud-layer dynamic shot, over-shoulder from a ground subject reacting. Whatever serves the spectacle.

━━━ ACTION BELOW (when applicable) ━━━
If the setting includes a ground biome (titan-warzone / industrial / rust-wasteland / alien-biomech / mecha-pilot-field / power-armor-zone), include visible motion or activity at ground level — squad watching from a ridge, scavenger rig kicking dust, alien creatures reacting to the shadow, refinery workers looking up, titan walking far below. The ground is alive too.

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
- NO modern aircraft / military terminology (called out above)
- NO box-shaped Earth-warship hulls — predatory blade-shapes only
- NO ground-only scene without a skyship (the ship is the subject)
- NO single-layer flat sky — multi-layer atmospheric depth is non-negotiable
- NO realistic-photograph framing of a modern jet — this is sci-fi concept-art

━━━ SCALE STAGING ━━━
Stage ships at multiple distances when possible. Hero ship in foreground, smaller fleet specks at vanishing point. The sky should feel ENORMOUS and OCCUPIED.

Output ONLY the raw 65-95 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases.`;
};
