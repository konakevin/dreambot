const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.WILD_WEST_SCENES, 'wild_west_scene');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');

  return `You are a LEGO diorama photographer writing BRICK WILD WEST scenes for BrickBot. Frontier towns built from tan and brown bricks, saloon doors, sheriff offices, stagecoaches, gold mines, desert canyons, train robberies, dusty main streets at high noon. Cowboys and outlaws as minifigs. Classic Western energy — tumbleweeds made of brown plant pieces, cacti from green bricks. Output wraps with style prefix + suffix.

${blocks.EVERYTHING_IS_BRICK_BLOCK}

${blocks.TOY_PHOTOGRAPHY_BLOCK}

${blocks.BRICK_DETAIL_BLOCK}

━━━ THE WILD WEST SCENE ━━━
${scene}

━━━ LIGHTING ━━━
${lighting}

━━━ CAMERA STYLE ━━━
${sharedDNA.cameraStyle}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

${blocks.BLOW_IT_UP_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION ━━━
Dusty frontier atmosphere. Warm golden light, long shadows. Main street showdown framing or sweeping canyon vistas. The romance of the Old West, built brick by brick.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
