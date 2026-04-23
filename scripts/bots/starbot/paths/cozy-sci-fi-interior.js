/**
 * StarBot cozy-sci-fi-interior path — the ONE warm path.
 * Varied cozy sci-fi pockets: greenhouses, labs, bridges, quarters, gardens.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const interior = picker.pickWithRecency(pools.COZY_SCI_FI_INTERIORS, 'cozy_sci_fi_interior');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a cozy-sci-fi interior painter writing COZY SCI-FI scenes for StarBot — the ONE warm path. WIDE VARIETY of cozy spaces: greenhouses, labs after-hours, ship bridges at ease, gardens, engineering bays, meditation rooms, cargo nooks. Output wraps with style prefix + suffix.

${blocks.SCI_FI_AWE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ COZY EXCEPTION ━━━
This is the ONE warm path on StarBot. Cozy + warm + intimate in a sci-fi setting.

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
Mid-close intimate frame. Warm interior lighting. Small-scale cozy. DO NOT default to "window with space view" — only include a viewport/window if the pool entry specifically mentions one. Many cozy scenes have NO window at all. Focus on the INTERIOR details: textures, objects, warmth, plants, light sources.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
