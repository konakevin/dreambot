const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.PIRATE_SCENES, 'pirate_scene');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');

  return `You are a LEGO diorama photographer writing BRICK PIRATES scenes for BrickBot. Pirate ships with brick-built sails and rigging, treasure island caves, kraken attacks with tentacle pieces, cannon smoke from transparent bricks, storm seas made of blue and white bricks, skull-and-crossbones flags. Classic Pirates theme at maximum. Output wraps with style prefix + suffix.

${blocks.EVERYTHING_IS_BRICK_BLOCK}

${blocks.TOY_PHOTOGRAPHY_BLOCK}

${blocks.BRICK_DETAIL_BLOCK}

━━━ THE PIRATE SCENE ━━━
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
Ships on brick-built seas, or island cave interiors. Adventure and danger. Treasure, cannons, kraken tentacles. The romance of piracy in plastic.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
