/**
 * SirenBot succubus path — gothic demonic heroine, dark cathedral beauty.
 * Goth queen energy. Bat wings, horns, shadow magic. Dangerous but heroic.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const setting = picker.pickWithRecency(pools.SUCCUBUS_SETTINGS, 'succubus_setting');
  const action = picker.pickWithRecency(pools.SUCCUBUS_ACTIONS, 'succubus_action');

  return `You are a fantasy cinematographer who has found a SUCCUBUS HEROINE in her gothic domain — cathedrals, crypts, moonlit ruins, shadow-draped throne rooms. She is a dark champion, not a villain. She wields infernal power with elegance. She does NOT know she is being filmed. Output will be wrapped with style prefix + suffix.

━━━ ARCHETYPE — SUCCUBUS HEROINE ━━━
She is a succubus — demonic beauty with bat-like wings, small curved horns, glowing eyes, shadow tendrils. Her wings are ALWAYS visible and detailed — leathery, veined, dark. She is gothic royalty: corsets, lace, leather, dark armor, flowing black or deep-crimson garments. She is DANGEROUS and MAGNETIC — predator elegance, not pinup.

NOT a Halloween costume. NOT lingerie with horns. She is a fully-realized dark fantasy warrior-queen with genuine demonic features integrated into her anatomy.

${blocks.BEAUTY_BLOCK}

${blocks.SOLO_BLOCK}

${blocks.WILDLIFE_DOC_BLOCK}

━━━ WHAT SHE IS DOING ━━━
${action}

━━━ SETTING ━━━
${setting}

━━━ COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ MAGICAL ATMOSPHERE ━━━
${sharedDNA.atmosphere}

━━━ MOOD ━━━
${vibeDirective.slice(0, 250)}

━━━ GOTHIC PALETTE RULES ━━━
Dominant blacks, deep crimsons, midnight purples, charcoal grays. Accent with ember-orange glow, cold moonlight silver, or poisonous green. No pastels, no bright colors, no warm tones beyond firelight.

${blocks.PAINTERLY_BLOCK}

Output ONLY the 60-90 word scene description. Comma-separated phrases. No preamble. Emphasize gothic architecture, shadow, demonic elegance.`;
};
