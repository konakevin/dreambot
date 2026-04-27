/**
 * FaeBot fae-queen path — Sidhe royalty, fairy courts under hollow hills.
 * Otherworldly glamour, terrifying beauty, ancient power.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const setting = picker.pickWithRecency(pools.FAE_QUEEN_SETTINGS, 'fae_queen_setting');
  const action = picker.pickWithRecency(pools.FAE_QUEEN_ACTIONS, 'fae_queen_action');

  return `You are a documentarian who has stumbled into a FAE COURT and captured the QUEEN OF THE SIDHE going about her rule. She does NOT know she is being observed. She is the most beautiful and most terrifying being in the forest. Her beauty is a WEAPON — glamour magic that warps reality around her. Output will be wrapped with style prefix + suffix.

━━━ ARCHETYPE — FAE QUEEN / SIDHE ROYALTY ━━━
She is the Queen of the Fair Folk — ageless, impossibly beautiful, deeply unsettling. Her features are ALMOST human but slightly wrong: eyes too large, too bright, too knowing. Pupils that shift like a cat's. Skin that is too smooth, too luminous. She wears living crowns of thorns, antlers, woven branches, or crystallized moonlight. Her gown is spun from cobwebs, starlight, autumn leaves, or shadow itself. The air around her SHIMMERS with glamour — reality bends near her. She is regal, cold, ancient, and absolutely not to be trusted.

${blocks.BEAUTY_BLOCK}

${blocks.SOLO_BLOCK}

${blocks.WILDLIFE_DOC_BLOCK}

━━━ WHAT SHE IS DOING ━━━
${action}

━━━ SETTING ━━━
${setting}

━━━ SEASON ━━━
${sharedDNA.season}

━━━ FOREST LIGHT ━━━
${sharedDNA.light}

━━━ COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ MOOD ━━━
${vibeDirective.slice(0, 250)}

${blocks.PAINTERLY_BLOCK}

Output ONLY the 60-90 word scene description. Comma-separated phrases. No preamble. Emphasize otherworldly glamour, reality distortion, terrifying beauty.`;
};
