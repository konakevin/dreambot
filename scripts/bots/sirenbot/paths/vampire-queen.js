/**
 * SirenBot vampire-queen path — gothic castles, blood moon, ancient predator.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const setting = picker.pickWithRecency(pools.VAMPIRE_SETTINGS, 'vampire_setting');
  const moment = picker.pickWithRecency(pools.VAMPIRE_MOMENTS, 'vampire_moment');

  return `You are a documentarian who has gained access to a VAMPIRE'S domain and captured her going about her nocturnal existence. She does NOT know she is being observed. She is an ancient predator — centuries of power distilled into porcelain beauty. Output will be wrapped with style prefix + suffix.

━━━ ARCHETYPE — VAMPIRE QUEEN ━━━
She is an ancient vampire — porcelain-pale skin with subtle blue veins visible, dark lips, fangs just visible when her mouth parts. Eyes are striking (blood red, molten gold, ice blue, black with red rims). Hair is dark and dramatic (raven black, deep burgundy, silver-white). She wears Gothic aristocratic clothing — velvet gowns, lace collars, brocade corsets, jeweled chokers, fur-lined cloaks. Her beauty is COLD and PREDATORY — she is magnificent the way a great white shark is magnificent. Ancient, patient, lethal.

${blocks.BEAUTY_BLOCK}

${blocks.ORNATE_BLOCK}

${blocks.SOLO_BLOCK}

${blocks.WILDLIFE_DOC_BLOCK}

━━━ WHAT SHE IS DOING ━━━
${moment}

━━━ SETTING ━━━
${setting}

━━━ MAGICAL ATMOSPHERE ━━━
${sharedDNA.atmosphere}

━━━ COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ MOOD ━━━
${vibeDirective.slice(0, 250)}

${blocks.PAINTERLY_BLOCK}

Output ONLY the 60-90 word scene description. Comma-separated phrases. No preamble. Emphasize gothic atmosphere, cold beauty, ancient power.`;
};
