/**
 * FaeBot green-witch path — forest herbalist, potions, cottage garden.
 * The cozy lane. Practical magic, warmth, botanical abundance.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const setting = picker.pickWithRecency(pools.GREEN_WITCH_SETTINGS, 'green_witch_setting');
  const action = picker.pickWithRecency(pools.GREEN_WITCH_ACTIONS, 'green_witch_action');

  return `You are a documentarian who has found a GREEN WITCH at work in her forest domain. She does NOT know she is being filmed. She is a practitioner of practical plant magic — herbalism, potions, remedies, garden enchantments. She lives WHERE the forest meets civilization. Cozy and warm but with real magical power underneath. Output will be wrapped with style prefix + suffix.

━━━ ARCHETYPE — GREEN WITCH / HERBALIST ━━━
She is a hedge witch — human, warm, grounded, with deep knowledge of plants and their magical properties. She wears practical clothing: linen dresses, leather aprons stained with plant juices, shawls, bare feet. Her hair is wild and woven with herbs and dried flowers. Her workspace is cluttered and alive: drying herbs hanging from beams, bubbling pots, glass jars of tinctures, mortar and pestle, a familiar cat or toad nearby. She is the COZY archetype — cottage-core meets real witchcraft. Her beauty is earthy, approachable, sun-freckled.

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

Output ONLY the 60-90 word scene description. Comma-separated phrases. No preamble. Emphasize botanical detail, warm cottage atmosphere, practical magic.`;
};
