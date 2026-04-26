/**
 * SirenBot mermaid-deep path — bioluminescent abyss, alien elegance, trench worlds.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const setting = picker.pickWithRecency(pools.MERMAID_DEEP_SETTINGS, 'mermaid_deep_setting');
  const action = picker.pickWithRecency(pools.MERMAID_DEEP_ACTIONS, 'mermaid_deep_action');
  const features = picker.pickWithRecency(pools.MERMAID_FEATURES, 'mermaid_features');
  const water = picker.pickWithRecency(pools.WATER_CONDITIONS, 'water_condition');

  return `You are a deep-sea wildlife cinematographer who has captured a DEEP-SEA MERMAID in her abyssal habitat. She is OTHERWORLDLY — bioluminescent markings, translucent fins, pressure-adapted features. The deep ocean is pitch black except for her own glow. She does NOT know she is being filmed. Output will be wrapped with style prefix + suffix.

━━━ ARCHETYPE — ABYSSAL MERMAID ━━━
She is a deep-sea mermaid adapted to crushing pressure and total darkness. Her beauty is ALIEN — anglerfish light patterns, ribbed fins, glowing eyes. More deep-sea predator queen than tropical princess.

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

━━━ COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ MOOD ━━━
${vibeDirective.slice(0, 250)}

${blocks.PAINTERLY_BLOCK}

Output ONLY the 60-90 word scene description. Comma-separated phrases. No preamble. Emphasize bioluminescence, depth, alien beauty.`;
};
