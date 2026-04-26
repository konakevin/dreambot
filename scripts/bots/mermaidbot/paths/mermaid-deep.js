/**
 * MermaidBot deep path — bioluminescent abyss, alien elegance, trench worlds.
 * Deep-sea mermaids adapted to crushing pressure and total darkness.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const setting = picker.pickWithRecency(pools.DEEP_SETTINGS, 'deep_setting');
  const action = picker.pickWithRecency(pools.DEEP_ACTIONS, 'deep_action');

  return `You are a deep-sea wildlife cinematographer who has captured footage of a DEEP-SEA MERMAID in her abyssal habitat. She is OTHERWORLDLY — anglerfish light patterns, translucent fins, pressure-adapted features. The deep ocean is pitch black except for her own glow and scattered bioluminescence. She does NOT know she is being filmed. Output will be wrapped with style prefix + suffix.

${blocks.MERMAID_BLOCK}

━━━ HER FEATURES (rolled — unique to this render) ━━━
${sharedDNA.features}

━━━ DEEP-SEA ADAPTATION ━━━
Her beauty is ALIEN — bioluminescent markings trace her body, fins are translucent or ribbed like deep-sea creatures, eyes glow or reflect light. She belongs to the trench. Gorgeous but unsettling. More deep-sea anglerfish queen than tropical reef princess.

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

Output ONLY the 60-90 word scene description. Comma-separated phrases. No preamble. Emphasize bioluminescence, depth, alien beauty.`;
};
