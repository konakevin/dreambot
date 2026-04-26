/**
 * MermaidBot reef path — tropical coral wonderland, caustic sunbeams, playful radiant beauty.
 * Bright, colorful, warm-water paradise mermaids.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const setting = picker.pickWithRecency(pools.REEF_SETTINGS, 'reef_setting');
  const action = picker.pickWithRecency(pools.REEF_ACTIONS, 'reef_action');

  return `You are a reef wildlife cinematographer capturing a TROPICAL REEF MERMAID in her natural coral habitat. She is among the reef life — sunbeam caustics, vivid coral colors, schools of tropical fish, crystal-clear warm water. She does NOT know she is being filmed. Output will be wrapped with style prefix + suffix.

${blocks.MERMAID_BLOCK}

━━━ HER FEATURES (rolled — unique to this render) ━━━
${sharedDNA.features}

━━━ REEF MERMAID ENERGY ━━━
Her tail and accessories match the reef — vivid coral pinks, electric blues, sunset oranges, sea-green. Shell jewelry, coral crown, pearl strands, anemone hair ornaments. She is PART OF the reef ecosystem, not visiting it.

${blocks.BEAUTY_BLOCK}

${blocks.SOLO_BLOCK}

${blocks.NO_POSING_BLOCK}

━━━ WHAT SHE IS DOING ━━━
${action}

━━━ SETTING ━━━
${setting}

━━━ WATER + ATMOSPHERE ━━━
${sharedDNA.waterCondition}

${blocks.UNDERWATER_PHYSICS_BLOCK}

━━━ COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ MOOD ━━━
${vibeDirective.slice(0, 250)}

Output ONLY the 60-90 word scene description. Comma-separated phrases. No preamble. Emphasize warm light, coral abundance, tropical vibrancy.`;
};
