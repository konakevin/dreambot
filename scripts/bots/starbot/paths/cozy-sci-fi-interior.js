/**
 * StarBot cozy-sci-fi-interior path — the ONE warm path.
 * Cozy sci-fi pockets: personal quarters with plants + nebula view.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const interior = picker.pickWithRecency(pools.COZY_SCI_FI_INTERIORS, 'cozy_sci_fi_interior');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a cozy-sci-fi interior painter writing COZY SCI-FI scenes for StarBot — the ONE warm path. Personal quarters with plants, space-station cafe, captain's study with holo-star-map. Warm-juxtaposed-with-space. Output wraps with style prefix + suffix.

${blocks.SCI_FI_AWE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ COZY EXCEPTION ━━━
This is the ONE warm path on StarBot. Cozy + warm + intimate juxtaposed with space setting.

━━━ THE COZY SCI-FI INTERIOR ━━━
${interior}

━━━ LIGHTING (warm cozy with cosmic accent) ━━━
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
Mid-close intimate frame. Warm interior lighting. Small-scale cozy. Space visible through window/view. Plants/books/tea/wood texture in futuristic setting.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
