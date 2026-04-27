/**
 * FaeBot spore-light path — pure bioluminescent forest scenery.
 * No character. Glowing mushroom cathedrals, mycelium networks pulsing with light.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const setting = picker.pickWithRecency(pools.SPORE_LIGHT_SETTINGS, 'spore_light_setting');
  const atmosphere = picker.pickWithRecency(pools.SPORE_LIGHT_ATMOSPHERES, 'spore_light_atmosphere');

  return `You are a nature cinematographer deep in an ENCHANTED BIOLUMINESCENT FOREST at night. There are NO people, NO creatures, NO characters — this is PURE LANDSCAPE. The forest itself is the subject. Every surface glows with fungal bioluminescence — mushrooms, mycelium networks, spore clouds, lichen. This is the hidden world beneath the canopy after dark. Output will be wrapped with style prefix + suffix.

━━━ SUBJECT — THE LUMINOUS FOREST ITSELF ━━━
NO characters. NO sentient beings. NO figures in the distance. This is a PURE LANDSCAPE shot of bioluminescent forest. Giant mushrooms glow blue-green and violet. Mycelium networks pulse with traveling light along the forest floor like veins of electricity. Spore clouds drift through the air, each particle a tiny point of light. Bracket fungi on tree trunks glow in horizontal stripes. Mushroom caps the size of umbrellas cast colored light onto the moss below. Everything is WET — dew, moisture, rain droplets — each drop catching and refracting the bioluminescence. This is an alien cathedral built by fungi.

━━━ SCENE ━━━
${setting}

━━━ LIGHT + ATMOSPHERE ━━━
${atmosphere}

━━━ SEASON ━━━
${sharedDNA.season}

━━━ FOREST LIGHT ━━━
${sharedDNA.light}

━━━ COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ MOOD ━━━
${vibeDirective.slice(0, 250)}

${blocks.PAINTERLY_BLOCK}

Output ONLY the 60-90 word scene description. Comma-separated phrases. No preamble. NO people or creatures. Emphasize bioluminescence, moisture, scale, color gradients, mycelium patterns, atmospheric depth.`;
};
