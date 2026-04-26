/**
 * MermaidBot siren path — moonlit rocks, coastal mist, wild ocean haunts.
 * Classic sirens observed in their natural habitat on rocky coastlines.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const setting = picker.pickWithRecency(pools.SIREN_SETTINGS, 'siren_setting');
  const moment = picker.pickWithRecency(pools.SIREN_MOMENTS, 'siren_moment');

  return `You are a wildlife documentary cinematographer capturing a SIREN in her natural coastal habitat — moonlit rocks, ocean mist, wild beauty. She does NOT know she is being filmed. Waterhouse painting energy. Output will be wrapped with style prefix + suffix.

${blocks.MERMAID_BLOCK}

━━━ HER FEATURES (rolled — unique to this render) ━━━
${sharedDNA.features}

${blocks.BEAUTY_BLOCK}

${blocks.SOLO_BLOCK}

${blocks.NO_POSING_BLOCK}

━━━ THE MOMENT ━━━
${moment}

━━━ SETTING ━━━
${setting}

━━━ WATER + ATMOSPHERE ━━━
${sharedDNA.waterCondition}

${blocks.UNDERWATER_PHYSICS_BLOCK}

━━━ COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ MOOD ━━━
${vibeDirective.slice(0, 250)}

Output ONLY the 60-90 word scene description. Comma-separated phrases. No preamble. No "pose", "posing", "model". She is living this moment.`;
};
