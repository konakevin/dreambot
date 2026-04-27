/**
 * FaeBot willow-wisp path — will-o'-the-wisp as luminous humanoid.
 * Luring travelers through misty bogs, ghostly and ethereal.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const setting = picker.pickWithRecency(pools.WILLOW_WISP_SETTINGS, 'willow_wisp_setting');
  const action = picker.pickWithRecency(pools.WILLOW_WISP_ACTIONS, 'willow_wisp_action');

  return `You are a nature cinematographer who has captured a rare sighting of a WILLOW-WISP in the misty marshlands. She does NOT know she is being filmed. She is a will-o'-the-wisp given humanoid form — a being of swamp light, ghostfire, and fog. Beautiful but dangerous, she lures travelers deeper into the bog. Output will be wrapped with style prefix + suffix.

━━━ ARCHETYPE — WILLOW-WISP / WILL-O'-THE-WISP ━━━
She is made of LIGHT AND MIST — semi-translucent, flickering, phasing in and out of visibility. Her body glows from within — pale green, cold blue, spectral white, foxfire orange. She has no solid edges — her outline wavers like a candle flame. Hair is wisps of luminous fog trailing behind her. Eyes are the brightest points — two orbs of concentrated ghostlight. She drifts rather than walks, feet barely touching the water's surface, leaving ripples of light. She can split into multiple smaller lights and reform. She is GHOSTLY but not skeletal or horrifying — hauntingly beautiful, melancholy, otherworldly. The air around her shimmers with heat-distortion and tiny floating sparks. She is the most DANGEROUS creature in the forest — travelers follow her light and never return.

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

Output ONLY the 60-90 word scene description. Comma-separated phrases. No preamble. Emphasize ghostlight, mist, translucency, flickering, bog water reflections, eerie beauty.`;
};
