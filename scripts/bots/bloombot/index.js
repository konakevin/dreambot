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
  conservatory: require('./paths/conservatory'),
  'tropical-paradise': require('./paths/tropical-paradise'),
  'city-flowers': require('./paths/city-flowers'),
  reclaim: require('./paths/reclaim'),
  'space-bloom': require('./paths/space-bloom'),
};

module.exports = {
  username: 'bloombot',
  displayName: 'BloomBot',

  // Multi-medium with photography weighted 3x (matches old config)
  mediums: ['photography', 'canvas', 'watercolor', 'pencil', 'illustration', 'render', 'animation', 'anime', 'storybook', 'fairytale'],

  // conservatory path locks to custom bot-only bloom-conservatory medium
  mediumByPath: {
    conservatory: 'bloom-conservatory',
  },

  promptPrefixByMedium: {
    'bloom-conservatory':
      'botanical conservatory interior, glass-and-iron greenhouse architecture, impossibly lush floral density',
  },
  promptSuffixByMedium: {
    'bloom-conservatory':
      'no text, no words, no watermarks, hyper detailed, masterpiece quality',
  },

  mediumStyles: {
    'bloom-conservatory':
      'botanical conservatory — glass panes, iron framework, arched architecture, flowers overflowing through structure',
  },

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

  paths: ['landscape', 'closeup', 'cozy', 'garden-walk', 'cosmic', 'dreamscape', 'conservatory', 'tropical-paradise', 'city-flowers', 'reclaim', 'space-bloom'],

  // 50/50 flux-dev / flux-1.1-pro rotation on all paths
  modelByPath: {
    landscape: ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    closeup: ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    cozy: ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    'garden-walk': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    cosmic: ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    dreamscape: ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    conservatory: ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    'tropical-paradise': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    'city-flowers': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    reclaim: ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    'space-bloom': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
  },

  pathWeights: {
    landscape: 2,
    closeup: 1,
    cozy: 1,
    'garden-walk': 1,
    cosmic: 2,
    dreamscape: 1,
    conservatory: 2,
    'tropical-paradise': 2,
    'city-flowers': 1,
    reclaim: 1,
    'space-bloom': 2,
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
