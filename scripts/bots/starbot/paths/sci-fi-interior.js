/**
 * StarBot sci-fi-interior path — epic interior scale.
 * Bridge, starship corridor, cathedral-hangar, Blade-Runner apartment, lab.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const interior = picker.pickWithRecency(pools.SCI_FI_INTERIORS, 'sci_fi_interior');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a sci-fi production-designer writing EPIC INTERIOR scenes for StarBot. Space-station bridges, starship corridors, cathedral-hangars, Blade-Runner apartments. Epic scale. Output wraps with style prefix + suffix.

${blocks.SCI_FI_AWE_BLOCK}

${blocks.NO_COZY_EXCEPT_COZY_PATH_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE SCI-FI INTERIOR ━━━
${interior}

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
Wide or mid-wide interior frame. Architectural-tech detail rich. Movie-frame composition. No characters or peripheral silhouette only.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
