const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.MECH_SCENES, 'mech_scene');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');

  return `You are a LEGO diorama photographer writing BRICK MECH scenes for BrickBot. Giant mechs, tanks, motorcycles, steampunk walkers, crazy contraptions — all built from LEGO with incredible mechanical detail. Technic beams, ball joints, pneumatic hoses, gear trains visible. The build engineering is the star. Output wraps with style prefix + suffix.

${blocks.EVERYTHING_IS_BRICK_BLOCK}

${blocks.TOY_PHOTOGRAPHY_BLOCK}

${blocks.BRICK_DETAIL_BLOCK}

━━━ THE MECH SCENE ━━━
${scene}

━━━ LIGHTING ━━━
${lighting}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

${blocks.BLOW_IT_UP_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION ━━━
The mech or vehicle dominates. Low angle to emphasize scale. Mechanical detail and engineering visible. Action pose or dramatic stance. Brick-built terrain beneath.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
