/**
 * StarBot cosmic-vista path — fictional sci-fi space/cosmic phenomenon.
 * Nebula skies, black-hole event-horizon, pulsar ice-world, binary-sun.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const phenomenon = picker.pickWithRecency(pools.COSMIC_PHENOMENA, 'cosmic_phenomenon');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a sci-fi concept artist writing COSMIC VISTA scenes for StarBot. Fictional sci-fi space/cosmic phenomenon. Blade-Runner/Dune/Interstellar-quality. Pure environment, no characters. Output wraps with style prefix + suffix.

${blocks.SCI_FI_AWE_BLOCK}

${blocks.NO_COZY_EXCEPT_COZY_PATH_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE COSMIC PHENOMENON ━━━
${phenomenon}

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
Wide cosmic vista. Mind-bending scale. Multiple atmospheric layers. Movie-poster quality.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
