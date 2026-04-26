/**
 * MermaidBot dark path — storms, shipwrecks, gothic sirens, haunting mood.
 * Dark mermaids amid maritime ruin and supernatural dread.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const setting = picker.pickWithRecency(pools.DARK_SETTINGS, 'dark_setting');
  const moment = picker.pickWithRecency(pools.DARK_MOMENTS, 'dark_moment');

  return `You are a maritime documentarian who has captured a DARK MERMAID in haunted waters — shipwrecks, storms, drowned ruins. She is ghostly pale with dark scales, a deep-water predator going about her business. She does NOT know she is being observed. Maritime horror meets wildlife doc. Output will be wrapped with style prefix + suffix.

${blocks.MERMAID_BLOCK}

━━━ HER FEATURES (rolled — unique to this render) ━━━
${sharedDNA.features}

━━━ DARK MERMAID ENERGY ━━━
Her beauty is HAUNTING — dark iridescent scales (black, deep purple, midnight blue), sharp features, predator eyes, tattered fin edges, barnacle-crusted jewelry, bone accessories, ghostly luminescence. She is the thing sailors warn about. Ancient and merciless.

${blocks.BEAUTY_BLOCK}

${blocks.SOLO_BLOCK}

${blocks.NO_POSING_BLOCK}

━━━ THE MOMENT ━━━
${moment}

━━━ SETTING ━━━
${setting}

━━━ WATER + ATMOSPHERE ━━━
${sharedDNA.waterCondition}

━━━ COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ MOOD ━━━
${vibeDirective.slice(0, 250)}

Output ONLY the 60-90 word scene description. Comma-separated phrases. No preamble. Emphasize gothic atmosphere, maritime dread, dark beauty.`;
};
