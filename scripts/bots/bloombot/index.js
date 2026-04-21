/**
 * BloomBot — the bot-engine contract.
 *
 * Character: scene-centric bot. Flowers are the hero of every render.
 * No character DNA, no solo-composition rule. 6 paths spanning
 * dramatic-landscape / macro-closeup / cottagecore-interior /
 * walkable-garden / cosmic-alien / dreamscape-earthly-surreal.
 */

const pools = require('./pools');
const blocks = require('./shared-blocks');

const pathBuilders = {
  landscape: require('./paths/landscape'),
  closeup: require('./paths/closeup'),
  cozy: require('./paths/cozy'),
  'garden-walk': require('./paths/garden-walk'),
  cosmic: require('./paths/cosmic'),
  dreamscape: require('./paths/dreamscape'),
};

module.exports = {
  username: 'bloombot',
  displayName: 'BloomBot',

  // Multi-medium with photography weighted 3x (matches old config)
  mediums: ['photography', 'photography', 'photography', 'canvas', 'watercolor', 'pencil'],

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  // Allowed vibes — inverted excludeVibes ['dark', 'fierce', 'minimal', 'macabre']
  vibes: [
    'cinematic',
    'cozy',
    'epic',
    'nostalgic',
    'psychedelic',
    'peaceful',
    'whimsical',
    'ethereal',
    'arcane',
    'ancient',
    'enchanted',
    'coquette',
    'voltage',
    'nightshade',
    'shimmer',
    'surreal',
  ],

  paths: ['landscape', 'closeup', 'cozy', 'garden-walk', 'cosmic', 'dreamscape'],

  // Hero paths slightly weighted — landscape and closeup are the bread-and-butter
  pathWeights: {
    landscape: 2,
    closeup: 2,
    cozy: 1,
    'garden-walk': 2,
    cosmic: 1,
    dreamscape: 1,
  },

  // Scene-centric bot — sharedDNA is minimal (just palette + color)
  rollSharedDNA({ vibeKey, picker }) {
    return {
      scenePalette: picker.pickWithRecency(pools.SCENE_PALETTES, 'scene_palette'),
      colorPalette: pools.VIBE_COLOR[vibeKey] || pools.VIBE_COLOR.cinematic,
    };
  },

  buildBrief({ path, sharedDNA, vibeDirective, vibeKey, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`BloomBot: unknown path "${path}"`);
    return builder({ sharedDNA, vibeDirective, vibeKey, picker });
  },

  caption({ path }) {
    return `[${path}] BloomBot`;
  },
};
