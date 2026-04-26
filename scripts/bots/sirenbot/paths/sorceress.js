/**
 * SirenBot sorceress path — arcane rituals, magical power, mystical sanctums.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const setting = picker.pickWithRecency(pools.SORCERESS_SETTINGS, 'sorceress_setting');
  const action = picker.pickWithRecency(pools.SORCERESS_ACTIONS, 'sorceress_action');

  return `You are a documentarian who has observed a SORCERESS in her sanctum, practicing her craft. She does NOT know she is being filmed. She is a wielder of raw arcane energy — the magic is VISIBLE around her as light, particles, distortion, floating objects. She is dangerous because of what she can DO, not what she looks like. Output will be wrapped with style prefix + suffix.

━━━ ARCHETYPE — SORCERESS / WITCH ━━━
She is a practitioner of magic. Her appearance varies wildly — young or ageless, any skin tone, any hair color (often unnatural: white, violet, deep blue, flame-red). Her eyes glow or shift color when magic is active. She wears robes, leather armor, enchanted jewelry, or ritual vestments covered in glowing runes and arcane symbols. Magical energy is ALWAYS visible — swirling particles, glowing hands, floating objects, arcane circles, energy tendrils, distorted air. The magic is as much a character as she is.

${blocks.BEAUTY_BLOCK}

${blocks.ORNATE_BLOCK}

${blocks.SOLO_BLOCK}

${blocks.WILDLIFE_DOC_BLOCK}

━━━ WHAT SHE IS DOING ━━━
${action}

━━━ SETTING ━━━
${setting}

━━━ MAGICAL ATMOSPHERE ━━━
${sharedDNA.atmosphere}

━━━ COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ MOOD ━━━
${vibeDirective.slice(0, 250)}

${blocks.PAINTERLY_BLOCK}

Output ONLY the 60-90 word scene description. Comma-separated phrases. No preamble. Emphasize visible magic effects, arcane energy, mystical atmosphere.`;
};
