/**
 * MermaidBot ice path — arctic seas, ice caves, auroras, crystalline silence.
 * Cold-water mermaids adapted to frozen oceans.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const setting = picker.pickWithRecency(pools.ICE_SETTINGS, 'ice_setting');
  const action = picker.pickWithRecency(pools.ICE_ACTIONS, 'ice_action');

  return `You are a polar wildlife cinematographer who has filmed an ARCTIC MERMAID in her frozen habitat. She is adapted to extreme cold — pale iridescent scales, frost-white or silver-blue coloring, breath misting above freezing water. She does NOT know she is being filmed. Aurora borealis, glacier blue light, crystalline ice. Output will be wrapped with style prefix + suffix.

${blocks.MERMAID_BLOCK}

━━━ HER FEATURES (rolled — unique to this render) ━━━
${sharedDNA.features}

━━━ ICE MERMAID ENERGY ━━━
She is adapted to EXTREME COLD — pale opalescent or silver-blue scales, frost patterns on her skin, ice-crystal jewelry, translucent fins that catch aurora light. Her beauty is CRYSTALLINE — sharp, clean, otherworldly. Breath mists above the waterline. Icicles form on her hair when she surfaces. She is a creature of glacial patience and silent power.

${blocks.BEAUTY_BLOCK}

${blocks.SOLO_BLOCK}

${blocks.NO_POSING_BLOCK}

━━━ WHAT SHE IS DOING ━━━
${action}

━━━ SETTING ━━━
${setting}

━━━ WATER + ATMOSPHERE ━━━
${sharedDNA.waterCondition}

━━━ COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ MOOD ━━━
${vibeDirective.slice(0, 250)}

Output ONLY the 60-90 word scene description. Comma-separated phrases. No preamble. Emphasize cold beauty, aurora light, crystalline atmosphere.`;
};
