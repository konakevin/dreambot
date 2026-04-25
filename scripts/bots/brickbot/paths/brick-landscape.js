const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.LANDSCAPE_SCENES, 'landscape_scene');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');

  return `You are a LEGO diorama photographer writing BRICK LANDSCAPE scenes for BrickBot. Epic natural vistas built entirely from LEGO at micro-scale — mountain ranges from slope bricks, forests from plant pieces, waterfalls from transparent blue bricks, deserts from tan plates, oceans from blue studs. A tiny minifig for scale against massive brick-built nature. Output wraps with style prefix + suffix.

${blocks.EVERYTHING_IS_BRICK_BLOCK}

${blocks.TOY_PHOTOGRAPHY_BLOCK}

${blocks.BRICK_DETAIL_BLOCK}

━━━ THE LANDSCAPE ━━━
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
Wide vista with depth. Micro-scale terrain built from bricks stretches to the horizon. Tiny minifig or vehicle for scale. Tilt-shift to sell the miniature effect. Nature as LEGO art.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
