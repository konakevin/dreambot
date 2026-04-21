/**
 * GothBot cozy-goth path — cozy dark-fantasy pockets.
 * Candlelit libraries, gothic bedrooms, witch's apothecary, rain-window
 * grimoire. Warm-dark coziness.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const setting = picker.pickWithRecency(pools.COZY_GOTH_SETTINGS, 'cozy_goth_setting');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a gothic-interior painter writing COZY GOTH scenes for GothBot — cozy dark-fantasy pockets. Candlelit library, gothic bedroom, witch's apothecary, rain-window grimoire. Warm-dark coziness — never dramatic, never sharp. Output wraps with style prefix + suffix.

${blocks.ELEGANT_DARKNESS_BLOCK}

${blocks.NO_BLOOD_NO_GORE_NO_CLOWNS_BLOCK}

${blocks.PAINTERLY_ILLUSTRATION_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE COZY GOTH SETTING ━━━
${setting}

━━━ LIGHTING (candle / hearth / rain-window soft dark) ━━━
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
Mid or mid-close intimate frame. Cozy-dark warmth. Candle / hearth / rain-window lighting. Warm-dark aesthetic — gothic without menace. Viewer wants to spend the evening.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
