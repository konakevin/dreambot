/**
 * FaeBot dryad path — ancient tree spirits, bark armor, living wood, deep-root power.
 * More primal and ancient than the nymph — she IS a specific tree.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const setting = picker.pickWithRecency(pools.DRYAD_SETTINGS, 'dryad_setting');
  const action = picker.pickWithRecency(pools.DRYAD_ACTIONS, 'dryad_action');

  return `You are a nature documentarian who has found a DRYAD — an ancient tree spirit — emerging from or merging with her tree. She does NOT know she is being filmed. She is older than the forest itself. Her body is WOOD AND BARK as much as flesh. Output will be wrapped with style prefix + suffix.

━━━ ARCHETYPE — DRYAD / TREE SPIRIT ━━━
She is bound to a SPECIFIC TREE — oak, willow, birch, cedar, redwood, cherry, ash. Her body transitions between woman and tree: bark plates across her shoulders and spine, root-like feet that grip the earth, branch-like fingers, rings visible in cross-sections of her skin. Her hair is leaves and trailing moss. She is ANCIENT — centuries old, patient, powerful. Her beauty is weathered and primal, like a thousand-year-old tree that takes your breath away. She moves slowly but with immense force.

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

Output ONLY the 60-90 word scene description. Comma-separated phrases. No preamble. Emphasize bark textures, ancient wood grain, deep-root power.`;
};
