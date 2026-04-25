const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.HORROR_SCENES, 'horror_scene');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');

  return `You are a LEGO diorama photographer writing BRICK HORROR scenes for BrickBot. Creepy and unsettling LEGO dioramas — haunted houses with glowing windows, graveyards with skeleton minifigs, abandoned amusement parks, creepy dolls made of bricks, fog rolling through brick forests, monsters lurking in shadows. Unsettling but still clearly LEGO — the plastic makes it fun-scary, not actually scary. Output wraps with style prefix + suffix.

${blocks.EVERYTHING_IS_BRICK_BLOCK}

${blocks.TOY_PHOTOGRAPHY_BLOCK}

${blocks.BRICK_DETAIL_BLOCK}

━━━ THE HORROR SCENE ━━━
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
Something is wrong. Low angle, deep shadows, fog, one light source revealing just enough. The familiar LEGO aesthetic turned creepy. Minifigs frozen mid-scream. Transparent green pieces for ooze and slime.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
