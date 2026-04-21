/**
 * TitanBot — the bot-engine contract.
 *
 * Mythology across ALL world pantheons at epic scale. Gods, titans, deities,
 * mythic battles, legendary landscapes, gnarly creatures, sexy mythic women,
 * cozy mythic places. Renaissance-painting × concept-art production quality.
 * Characters by role + pantheon, never named.
 */

const pools = require('./pools');
const blocks = require('./shared-blocks');

const pathBuilders = {
  'deity-moment': require('./paths/deity-moment'),
  'mythological-landscape': require('./paths/mythological-landscape'),
  'epic-battle': require('./paths/epic-battle'),
  'mythic-creature': require('./paths/mythic-creature'),
  'mythic-women': require('./paths/mythic-women'),
  'cozy-mythic': require('./paths/cozy-mythic'),
};

module.exports = {
  username: 'titanbot',
  displayName: 'TitanBot',

  mediums: ['canvas', 'photography', 'render'],

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  // Inverts old excludeVibes (minimal/cozy/whimsical/peaceful).
  vibes: [
    'cinematic',
    'dark',
    'epic',
    'nostalgic',
    'psychedelic',
    'ethereal',
    'arcane',
    'ancient',
    'enchanted',
    'fierce',
    'coquette',
    'voltage',
    'nightshade',
    'macabre',
    'shimmer',
    'surreal',
  ],

  paths: [
    'deity-moment',
    'mythological-landscape',
    'epic-battle',
    'mythic-creature',
    'mythic-women',
    'cozy-mythic',
  ],

  pathWeights: {
    'deity-moment': 2,
    'mythological-landscape': 2,
    'epic-battle': 1,
    'mythic-creature': 2,
    'mythic-women': 2,
    'cozy-mythic': 2,
  },

  rollSharedDNA({ vibeKey, picker }) {
    return {
      scenePalette: picker.pickWithRecency(pools.SCENE_PALETTES, 'scene_palette'),
      colorPalette: pools.VIBE_COLOR[vibeKey] || pools.VIBE_COLOR.epic,
    };
  },

  buildBrief({ path, sharedDNA, vibeDirective, vibeKey, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`TitanBot: unknown path "${path}"`);
    return builder({ sharedDNA, vibeDirective, vibeKey, picker });
  },

  caption({ path }) {
    return `[${path}] TitanBot`;
  },
};
