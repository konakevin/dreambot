/**
 * StarBot robot-moment path — solo ornate robot in a living environment.
 * Visually stunning machines with intricate detail, caught mid-action.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const robot = picker.pickWithRecency(pools.ROBOT_TYPES, 'robot_type');
  const moment = picker.pickWithRecency(pools.TRANQUIL_MOMENTS, 'tranquil_moment');
  const cameraAngle = picker.pickWithRecency(pools.CAMERA_ANGLES, 'camera_angle');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a sci-fi character-painter writing a ROBOT MOMENT scene for StarBot — a solo ornate machine doing something visually compelling in a living environment. The robot is a SHOWPIECE — every surface tells a story. Output wraps with style prefix + suffix.

━━━ CRITICAL — MATCH THE ROBOT'S IDENTITY ━━━
The robot description below defines WHAT KIND of machine this is. READ it and render THAT specific robot with OBSESSIVE SURFACE DETAIL — every engraving, every patina layer, every glowing element, every scratch and modification. Do NOT default to:
- the same weathered-paint-and-panel-seams on every robot (some are pristine, some are organic, some are crystalline, some are ancient stone)
- teal-and-orange lighting on every scene
- nebula backdrop behind every robot (some are in forests, cities, deserts, interiors, ruins)
- "poignant" mood every time (some robots are working, some are dangerous, some are playful)
- generic smooth metal — every surface has TEXTURE (engravings, patina, moss, rust, glow, filigree, scarring)

━━━ NO CYBORG WOMEN ━━━
Never render a sexy/feminine cyborg or android woman — that's VenusBot's territory. StarBot robots are MACHINES — industrial, military, scientific, ceremonial, or alien. They can be humanoid in shape but should read as MECHANICAL, not human.

━━━ THE ROBOT (solo subject — render every detail) ━━━
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

━━━ THE ENVIRONMENT IS ALIVE ━━━
The world around this robot is NOT a blank backdrop. It REACTS to the robot's presence — displaced debris, reflected light, heat shimmer, footprints, disturbed dust, bent vegetation, melted frost, scattered wildlife. The environment has its own texture and life independent of the robot.

━━━ COMPOSITION ━━━
Use the camera angle above as your framing guide. ONE robot, no companions. The robot is the focal point — render it with the detail of a museum piece. Body language tells the story. Depth and layering — foreground environment detail, midground robot sharp and ornate, background world stretching out.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
