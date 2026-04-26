/**
 * MermaidBot warrior path — armored mermaids, tridents, battle aftermath, guardian energy.
 * Ocean protectors and ancient warriors of the deep.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const setting = picker.pickWithRecency(pools.WARRIOR_SETTINGS, 'warrior_setting');
  const action = picker.pickWithRecency(pools.WARRIOR_ACTIONS, 'warrior_action');

  return `You are a documentarian who has captured a MERMAID WARRIOR on patrol in her territory. She is armored, battle-scarred, wielding ancient ocean weapons — a seasoned guardian of the deep going about her duties. She does NOT know she is being filmed. Think Atlantean royal guard, kraken-slayer, shipwreck sentinel. Output will be wrapped with style prefix + suffix.

${blocks.MERMAID_BLOCK}

━━━ HER FEATURES (rolled — unique to this render) ━━━
${sharedDNA.features}

━━━ WARRIOR MERMAID ENERGY ━━━
She wears BATTLE ARMOR — coral-forged plate, shark-tooth chainmail, abalone shields, whale-bone gauntlets, barnacle-crusted helm. Her weapons are ancient ocean relics: tridents, harpoons, coral blades, anchor-chain flails, obsidian daggers. Scars cross her scales. Battle trophies hang from her belt. She is DANGEROUS first, beautiful second. Her expression is hard and focused.

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

Output ONLY the 60-90 word scene description. Comma-separated phrases. No preamble. Emphasize battle energy, armor detail, guardian power.`;
};
