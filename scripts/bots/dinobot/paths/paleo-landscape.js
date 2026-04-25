/**
 * DinoBot paleo-landscape — pure prehistoric landscape. Ancient world
 * vistas at IMAX scale. Lush, alive, breathtaking. Dinos as distant
 * silhouettes only.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const setting = picker.pickWithRecency(pools.PREHISTORIC_SETTINGS, 'prehistoric_setting');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.PREHISTORIC_ATMOSPHERES, 'atmosphere');

  return `You are an IMAX nature documentary cinematographer writing ANCIENT WORLD VISTA scenes for DinoBot. The prehistoric world itself is the subject — lush, alive, breathtaking, alien in its beauty. This Earth looks nothing like ours. Distant dinosaur silhouettes for scale only. Output wraps with style prefix + suffix.

${blocks.NO_HUMANS_BLOCK}

${blocks.SCALE_AND_ATMOSPHERE_BLOCK}

${blocks.ENVIRONMENT_STORYTELLING_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE LANDSCAPE ━━━
${setting}

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
Epic wide establishing shot. The prehistoric world at maximum scale and lushness. Distant dinosaur silhouettes optional but never the focus. Every inch of the frame dripping with prehistoric life.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
