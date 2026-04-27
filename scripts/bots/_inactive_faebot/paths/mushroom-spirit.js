/**
 * FaeBot mushroom-spirit path — fungi/mycelium beings, spore clouds, bioluminescence.
 * The weird lane. Alien beauty in the forest's hidden fungal network.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const setting = picker.pickWithRecency(pools.MUSHROOM_SETTINGS, 'mushroom_setting');
  const action = picker.pickWithRecency(pools.MUSHROOM_ACTIONS, 'mushroom_action');

  return `You are a nature cinematographer who has discovered a MUSHROOM SPIRIT in the deepest part of the forest. She does NOT know she is being filmed. She is a being of FUNGI AND MYCELIUM — part of the forest's hidden underground network made conscious. Beautiful but deeply ALIEN. Output will be wrapped with style prefix + suffix.

━━━ ARCHETYPE — MUSHROOM SPIRIT / MYCELIUM BEING ━━━
She is made of living fungi. Mushroom caps grow from her shoulders, spine, and head like a crown. Her skin has mycelium-network patterns — white thread-like veins visible beneath translucent skin. She releases SPORE CLOUDS when she moves — glowing particles that drift in the air around her. Bioluminescent spots dot her body like freckles of light. Her hair is fine fungal threads or cascading shelf-fungi. She wears nothing but her own growth — bracket fungi, lichen, moss. She is BEAUTIFUL but UNCANNY — the most alien creature in the forest. Her eyes are solid black or solid bioluminescent blue-green.

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

Output ONLY the 60-90 word scene description. Comma-separated phrases. No preamble. Emphasize bioluminescence, spore clouds, mycelium textures, alien beauty.`;
};
