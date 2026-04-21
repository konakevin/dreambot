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
};

module.exports = {
  username: 'beachbot',
  displayName: 'BeachBot',

  mediums: ['photography', 'canvas', 'watercolor', 'pencil'],

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
  ],

  pathWeights: {
    'coastal-vista': 2,
    wave: 2,
    'tropical-paradise': 2,
    'beach-landscape': 2,
    'tide-pool': 1,
    'beach-moment': 1,
    'cozy-beach': 2,
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
