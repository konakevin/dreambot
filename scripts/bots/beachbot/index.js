/**
 * BeachBot — the bot-engine contract.
 *
 * Stunning beach settings. Tropical paradise, dramatic coasts, beach-life.
 * BLOWN UP 10×. No humans.
 */

const pools = require('./pools');
const blocks = require('./shared-blocks');

const pathBuilders = {
  'coastal-vista': require('./paths/coastal-vista'),
  wave: require('./paths/wave'),
  'tropical-paradise': require('./paths/tropical-paradise'),
  'beach-landscape': require('./paths/beach-landscape'),
  'tide-pool': require('./paths/tide-pool'),
  'beach-moment': require('./paths/beach-moment'),
  'cozy-beach': require('./paths/cozy-beach'),
  'hawaii-flowers': require('./paths/hawaii-flowers'),
  'reef-paradise': require('./paths/reef-paradise'),
  'big-wave': require('./paths/big-wave'),
  seashell: require('./paths/seashell'),
  'beach-night': require('./paths/beach-night'),
  'epic-sunset': require('./paths/epic-sunset'),
};

module.exports = {
  username: 'beachbot',
  displayName: 'BeachBot',

  mediums: ['photography', 'canvas', 'watercolor', 'pencil', 'illustration', 'render', 'animation', 'anime', 'storybook', 'fairytale'],

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  vibes: [
    'cinematic',
    'cozy',
    'epic',
    'nostalgic',
    'peaceful',
    'whimsical',
    'ethereal',
    'ancient',
    'enchanted',
    'coquette',
    'voltage',
    'shimmer',
    'surreal',
  ],

  paths: [
    'coastal-vista',
    'wave',
    'tropical-paradise',
    'beach-landscape',
    'tide-pool',
    'beach-moment',
    'cozy-beach',
    'hawaii-flowers',
    'reef-paradise',
    'big-wave',
    'seashell',
    'beach-night',
    'epic-sunset',
  ],

  modelByPath: {
    'coastal-vista': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    wave: ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    'tropical-paradise': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    'beach-landscape': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    'tide-pool': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    'beach-moment': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    'cozy-beach': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    'hawaii-flowers': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    'reef-paradise': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    'big-wave': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    seashell: ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    'beach-night': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    'epic-sunset': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
  },

  pathWeights: {
    'coastal-vista': 1,
    wave: 1,
    'tropical-paradise': 1,
    'beach-landscape': 1,
    'tide-pool': 1,
    'beach-moment': 1,
    'cozy-beach': 1,
    'hawaii-flowers': 1,
    'reef-paradise': 1,
    'big-wave': 1,
    seashell: 1,
    'beach-night': 1,
    'epic-sunset': 1,
  },

  rollSharedDNA({ vibeKey, picker }) {
    return {
      colorPalette: pools.VIBE_COLOR[vibeKey] || pools.VIBE_COLOR.cinematic,
    };
  },

  buildBrief({ path, sharedDNA, vibeDirective, vibeKey, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`BeachBot: unknown path "${path}"`);
    return builder({ sharedDNA, vibeDirective, vibeKey, picker });
  },

  caption({ path }) {
    return `[${path}] BeachBot`;
  },
};
