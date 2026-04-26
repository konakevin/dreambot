/**
 * MermaidBot royal path — underwater palaces, courts, regal ceremony, luxury.
 * Mermaid queens and princesses in grand underwater architecture.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const setting = picker.pickWithRecency(pools.ROYAL_SETTINGS, 'royal_setting');
  const action = picker.pickWithRecency(pools.ROYAL_ACTIONS, 'royal_action');

  return `You are a documentarian who has gained access to an underwater MERMAID KINGDOM. You are observing a MERMAID QUEEN going about her royal duties — she does NOT know she is being filmed. Grand architecture, regal ceremony, ancient power. Think Atlantis throne room, coral cathedral, pearl treasury. Output will be wrapped with style prefix + suffix.

${blocks.MERMAID_BLOCK}

━━━ HER FEATURES (rolled — unique to this render) ━━━
${sharedDNA.features}

━━━ REGAL MERMAID ENERGY ━━━
She is ROYALTY — ornate crown or tiara (coral, pearl, gold, gemstone), ceremonial jewelry dripping with sea-treasures, elaborate tail adornments, regal bearing. Her scales are pristine and luminous. Her accessories are the finest the ocean has produced. She carries authority and ancient power.

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

Output ONLY the 60-90 word scene description. Comma-separated phrases. No preamble. Emphasize grandeur, royal authority, architectural scale.`;
};
