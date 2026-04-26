/**
 * TinyBot — the bot-engine contract.
 *
 * Clever + cute + "WHOA look at THAT" miniature magic. Tilt-shift / macro /
 * dollhouse obsessive-detail. Scene-centric.
 */

const pools = require('./pools');
const blocks = require('./shared-blocks');

const pathBuilders = {
  diorama: require('./paths/diorama'),
  'miniature-landscape': require('./paths/miniature-landscape'),
  'macro-nature': require('./paths/macro-nature'),
  'miniature-urban': require('./paths/miniature-urban'),
  'tiny-cozy': require('./paths/tiny-cozy'),
  'contained-worlds': require('./paths/contained-worlds'),
  'micro-fantasy': require('./paths/micro-fantasy'),
  'miniature-industry': require('./paths/miniature-industry'),
};

module.exports = {
  username: 'tinybot',
  displayName: 'TinyBot',

  mediums: ['photography', 'animation', 'claymation', 'storybook', 'handcrafted'],

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  vibes: [
    'cinematic',
    'cozy',
    'nostalgic',
    'peaceful',
    'whimsical',
    'ethereal',
    'ancient',
    'enchanted',
    'shimmer',
    'surreal',
  ],

  paths: [
    'diorama',
    'miniature-landscape',
    'macro-nature',
    'miniature-urban',
    'tiny-cozy',
    'contained-worlds',
    'micro-fantasy',
    'miniature-industry',
  ],

  pathWeights: {
    diorama: 1,
    'miniature-landscape': 1,
    'macro-nature': 1,
    'miniature-urban': 1,
    'tiny-cozy': 1,
    'contained-worlds': 1,
    'micro-fantasy': 1,
    'miniature-industry': 1,
  },

  rollSharedDNA({ vibeKey, picker }) {
    return {
      scenePalette: picker.pickWithRecency(pools.SCENE_PALETTES, 'scene_palette'),
      colorPalette: pools.VIBE_COLOR[vibeKey] || pools.VIBE_COLOR.cozy,
    };
  },

  buildBrief({ path, sharedDNA, vibeDirective, vibeKey, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`TinyBot: unknown path "${path}"`);
    return builder({ sharedDNA, vibeDirective, vibeKey, picker });
  },

  caption({ path }) {
    return `[${path}] TinyBot`;
  },
};
