/**
 * SirenBot mermaid-reef path — tropical coral wonderland, caustic sunbeams.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const setting = picker.pickWithRecency(pools.MERMAID_REEF_SETTINGS, 'mermaid_reef_setting');
  const action = picker.pickWithRecency(pools.MERMAID_REEF_ACTIONS, 'mermaid_reef_action');
  const features = picker.pickWithRecency(pools.MERMAID_FEATURES, 'mermaid_features');
  const water = picker.pickWithRecency(pools.WATER_CONDITIONS, 'water_condition');

  return `You are a reef wildlife cinematographer capturing a TROPICAL REEF MERMAID in her natural coral habitat. Sunbeam caustics, vivid coral colors, schools of tropical fish, crystal-clear warm water. She does NOT know she is being filmed. Output will be wrapped with style prefix + suffix.

━━━ ARCHETYPE — REEF MERMAID ━━━
She is a tropical reef mermaid — vivid tail colors matching the coral, shell jewelry, coral crown, anemone hair ornaments. She is PART OF the reef ecosystem, not visiting it.

━━━ HER FEATURES ━━━
${features}

${blocks.BEAUTY_BLOCK}

${blocks.SOLO_BLOCK}

${blocks.WILDLIFE_DOC_BLOCK}

━━━ WHAT SHE IS DOING ━━━
${action}

━━━ SETTING ━━━
${setting}

━━━ WATER + ATMOSPHERE ━━━
${water}

Caustic light ripples, sunbeam shafts, suspended particles, hair drifting naturally.

━━━ COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ MOOD ━━━
${vibeDirective.slice(0, 250)}

${blocks.PAINTERLY_BLOCK}

Output ONLY the 60-90 word scene description. Comma-separated phrases. No preamble. Emphasize warm light, coral abundance, tropical vibrancy.`;
};
