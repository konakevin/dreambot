/**
 * FaeBot naiad path — freshwater forest spirits in streams, waterfalls, mossy grottos.
 * Like a mermaid but freshwater/forest — translucent, flowing, spring-fed.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const setting = picker.pickWithRecency(pools.NAIAD_SETTINGS, 'naiad_setting');
  const action = picker.pickWithRecency(pools.NAIAD_ACTIONS, 'naiad_action');

  return `You are a nature cinematographer who has captured a NAIAD — a freshwater spirit — in a forest stream. She does NOT know she is being filmed. She is made of LIVING WATER as much as flesh — translucent skin that shows flowing currents beneath, hair that moves like water even when she is still. Output will be wrapped with style prefix + suffix.

━━━ ARCHETYPE — NAIAD / FRESHWATER SPIRIT ━━━
She is a spirit of freshwater — streams, waterfalls, springs, forest pools. Her body is translucent in places, showing flowing water patterns beneath her skin like veins of current. Her hair is liquid — it flows and drips continuously. She may have no legs or legs that dissolve into water below the knee. Water clings to her, beads on her skin, drips from her fingertips. She wears nothing but water itself, woven waterlilies, river pearls, smooth stones. She smells like rain and moss. The pool or stream she inhabits is HER BODY extended.

${blocks.BEAUTY_BLOCK}

${blocks.SOLO_BLOCK}

${blocks.WILDLIFE_DOC_BLOCK}

${blocks.LIVING_NATURE_BLOCK}

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

Output ONLY the 60-90 word scene description. Comma-separated phrases. No preamble. Emphasize water transparency, flowing textures, mossy grotto atmosphere.`;
};
