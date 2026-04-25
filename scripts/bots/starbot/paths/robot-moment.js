/**
 * StarBot robot-moment path — solo robot having a human moment.
 * Solo robot in tranquil setting.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const robot = picker.pickWithRecency(pools.ROBOT_TYPES, 'robot_type');
  const moment = picker.pickWithRecency(pools.TRANQUIL_MOMENTS, 'tranquil_moment');
  const cameraAngle = picker.pickWithRecency(pools.CAMERA_ANGLES, 'camera_angle');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a sci-fi character-painter writing a ROBOT MOMENT scene for StarBot — a solo robot doing something visually compelling. Output wraps with style prefix + suffix.

━━━ CRITICAL — MATCH THE ROBOT'S IDENTITY ━━━
The robot description below defines WHAT KIND of robot this is. A hulking industrial mech looks NOTHING like a delicate humanoid android. A rusted ancient machine looks NOTHING like a sleek prototype. READ the description and render THAT specific robot faithfully. Do NOT default to:
- the same weathered-paint-and-panel-seams on every robot (some are pristine, some are organic, some are crystalline)
- teal-and-orange lighting on every scene
- nebula backdrop behind every robot (some are in forests, cities, deserts, interiors, ruins)
- "poignant" mood every time (some robots are working, some are dangerous, some are playful)

━━━ NO CYBORG WOMEN ━━━
Never render a sexy/feminine cyborg or android woman — that's VenusBot's territory. StarBot robots are MACHINES — industrial, military, scientific, or alien. They can be humanoid in shape but should read as MECHANICAL, not human.

━━━ THE ROBOT (solo subject) ━━━
${robot}

━━━ THE ACTION ━━━
${moment}

━━━ CAMERA / FRAMING (follow this EXACTLY) ━━━
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

━━━ COMPOSITION ━━━
Use the camera angle above as your framing guide. ONE robot, no companions. The robot is the focal point but the environment wraps around it with equal care. Body language tells the story. The environment responds to the robot's presence — footprints, displaced debris, reflected light. Depth and layering.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
