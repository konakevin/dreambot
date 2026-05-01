/**
 * OceanBot shipwreck-kingdom — sunken galleons turned coral castles, treasure, light through hulls.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.SHIPWRECK_SCENES, 'shipwreck');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.OCEAN_ATMOSPHERES, 'atmosphere');
  const cameraAngle = picker.pickWithRecency(pools.OCEAN_CAMERA_ANGLES, 'camera_angle');

  return `You are an underwater explorer writing SHIPWRECK KINGDOM scenes for OceanBot. Sunken SAILING SHIPS reclaimed by the ocean — wooden galleons turned into coral castles, treasure scattered on the sea floor, light filtering through broken hulls, fish schools weaving through rigging. The ocean transforms destruction into beauty. ONLY wooden sailing vessels — NO tanks, NO military vehicles, NO submarines, NO modern ships, NO metal wreckage. Ancient wooden ships ONLY. Output wraps with style prefix + suffix.

${blocks.OCEAN_IS_HERO_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

${blocks.WATER_LIGHTING_BLOCK}

━━━ THE SHIPWRECK ━━━
${scene}

━━━ CAMERA ANGLE / FRAMING — LEAD WITH THIS, FIRST 8-15 WORDS ━━━
The Flux model heavily weights early tokens. Your scene description MUST OPEN with this camera-angle phrase, paraphrased into the first 8-15 words. Do NOT bury it mid-paragraph. The first words out of your mouth must establish this framing:
${cameraAngle}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

${blocks.BLOW_IT_UP_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION ━━━
Use the CAMERA ANGLE directive above as the framing. The wooden wreck is the architecture — coral-encrusted, fish-inhabited, light-pierced. Mystery and wonder, not tragedy. Do NOT default to "wreck dead-center side view" — honor the camera angle (worm's-eye from sand, looking-up-through-rib-cage, drone-overhead, through-cannon-port, etc.).

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
