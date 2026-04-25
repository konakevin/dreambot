const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.ARCHITECTURE_SCENES, 'architecture_scene');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');

  return `You are a LEGO architect writing BRICK ARCHITECTURE scenes for BrickBot. Stunning standalone buildings and structures built from LEGO — the building IS the art. Famous landmarks reimagined, impossible towers, futuristic skyscrapers, Art Deco palaces, brutalist megastructures, fantasy cathedrals, treehouse mansions, floating temples. Focus on architectural detail: arches, flying buttresses, cantilevers, glass facades from transparent pieces, ornate facades, structural engineering visible in the brick techniques. Output wraps with style prefix + suffix.

${blocks.EVERYTHING_IS_BRICK_BLOCK}

${blocks.TOY_PHOTOGRAPHY_BLOCK}

${blocks.BRICK_DETAIL_BLOCK}

━━━ THE ARCHITECTURE ━━━
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
The building dominates the frame. Show the full structure or a dramatic partial view that highlights architectural detail. Surrounding context minimal — the architecture speaks for itself. LEGO bricks only.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
