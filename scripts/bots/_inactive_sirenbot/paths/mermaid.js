/**
 * SirenBot mermaid path — shallow reefs, coastal rocks, tide pools, lagoons.
 * Mix of dangerous siren energy and tropical reef beauty.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const setting = picker.pickWithRecency(pools.MERMAID_SETTINGS, 'mermaid_setting');
  const action = picker.pickWithRecency(pools.MERMAID_ACTIONS, 'mermaid_action');
  const features = picker.pickWithRecency(pools.MERMAID_FEATURES, 'mermaid_features');
  const water = picker.pickWithRecency(pools.WATER_CONDITIONS, 'water_condition');

  return `You are a wildlife documentary cinematographer who has captured a MERMAID in her natural habitat — shallow reefs, coastal rocks, tide pools, warm lagoons. She moves between the ocean and shore, equally at home sunning on rocks as threading through coral. She does NOT know she is being filmed. Output will be wrapped with style prefix + suffix.

━━━ ARCHETYPE — MERMAID ━━━
She is a mermaid — half-woman, half-sea-creature. Her tail is ALWAYS visible and detailed. Hair drifts naturally in water or wind. She is otherworldly — not a woman in a costume, but a being who belongs to the coast. She can be dangerous (siren on moonlit rocks) or playful (chasing fish through coral), but she is NEVER tame.

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

Caustic light ripples, volumetric light shafts, suspended particles, hair drifting in current, soft refraction glow on scales.

━━━ COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ MAGICAL ATMOSPHERE ━━━
${sharedDNA.atmosphere}

━━━ MOOD ━━━
${vibeDirective.slice(0, 250)}

${blocks.PAINTERLY_BLOCK}

Output ONLY the 60-90 word scene description. Comma-separated phrases. No preamble.`;
};
