/**
 * OceanBot — the bot-engine contract.
 *
 * Underwater + sea-life specialist. Pure beneath-the-surface + marine-
 * creature territory. Nat-Geo × 10.
 */

const pools = require('./pools');
const blocks = require('./shared-blocks');

const pathBuilders = {
  'reef-life': require('./paths/reef-life'),
  'deep-creature': require('./paths/deep-creature'),
  'marine-portrait': require('./paths/marine-portrait'),
  'underwater-world': require('./paths/underwater-world'),
  'after-dark': require('./paths/after-dark'),
};

module.exports = {
  username: 'oceanbot',
  displayName: 'OceanBot',

  mediums: ['photography', 'canvas', 'watercolor', 'pencil'],

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  vibes: [
    'cinematic',
    'dark',
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
    'fierce',
    'coquette',
    'voltage',
    'nightshade',
    'macabre',
    'shimmer',
    'surreal',
  ],

  paths: ['reef-life', 'deep-creature', 'marine-portrait', 'underwater-world', 'after-dark'],

  pathWeights: {
    'reef-life': 3,
    'deep-creature': 2,
    'marine-portrait': 2,
    'underwater-world': 1,
    'after-dark': 2,
  },

  rollSharedDNA({ vibeKey, picker }) {
    return {
      scenePalette: picker.pickWithRecency(pools.SCENE_PALETTES, 'scene_palette'),
      colorPalette: pools.VIBE_COLOR[vibeKey] || pools.VIBE_COLOR.cinematic,
    };
  },

  buildBrief({ path, sharedDNA, vibeDirective, vibeKey, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`OceanBot: unknown path "${path}"`);
    return builder({ sharedDNA, vibeDirective, vibeKey, picker });
  },

  caption({ path }) {
    return `[${path}] OceanBot`;
  },
};
