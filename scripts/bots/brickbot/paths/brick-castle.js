const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.CASTLE_SCENES, 'castle_scene');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');

  return `You are a LEGO diorama photographer writing BRICK CASTLE scenes for BrickBot. Medieval fantasy builds — massive castle walls with towers and battlements, dragon attacks, wizard towers glowing with transparent pieces, dungeon corridors, fantasy tavern interiors, siege scenes. Classic Castle theme energy dialed to maximum. Output wraps with style prefix + suffix.

${blocks.EVERYTHING_IS_BRICK_BLOCK}

${blocks.TOY_PHOTOGRAPHY_BLOCK}

${blocks.BRICK_DETAIL_BLOCK}

━━━ THE CASTLE SCENE ━━━
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
Epic scale or intimate interior. Castle architecture dominates. Minifig knights, dragons, wizards populate the scene. Dramatic lighting through brick windows and archways.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
