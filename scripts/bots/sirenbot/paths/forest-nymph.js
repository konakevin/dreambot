/**
 * SirenBot forest-nymph path — woodland spirits in enchanted groves, living nature.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const setting = picker.pickWithRecency(pools.NYMPH_SETTINGS, 'nymph_setting');
  const action = picker.pickWithRecency(pools.NYMPH_ACTIONS, 'nymph_action');

  return `You are a nature cinematographer who has captured a FOREST NYMPH in her woodland habitat. She does NOT know she is being filmed. She is a spirit of the forest — part woman, part living nature. Bark-textured skin, leaf-woven hair, flower blooms growing from her body. She is the forest made conscious. Output will be wrapped with style prefix + suffix.

━━━ ARCHETYPE — FOREST NYMPH / DRYAD ━━━
She is a woodland spirit — her body blends with living nature. Skin has bark textures or moss patches, hair intertwines with vines and flowers, tiny mushrooms or ferns grow along her shoulders and arms. Eyes are forest-colored (emerald, amber, deep brown with gold flecks). Her coverings are living plant matter — woven leaves, flower petals, lichen, spider silk. She glows faintly with green-gold bioluminescence. She is PART OF the forest, not merely standing in it.

${blocks.BEAUTY_BLOCK}

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

Output ONLY the 60-90 word scene description. Comma-separated phrases. No preamble. Emphasize living nature textures, dappled forest light, organic beauty.`;
};
