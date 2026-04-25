/**
 * BrickBot — the bot-engine contract.
 *
 * Everything is LEGO. Cities, castles, space, pirates, cozy interiors,
 * epic landscapes — all built from bricks, photographed like art.
 */

const pools = require('./pools');
const blocks = require('./shared-blocks');

const pathBuilders = {
  'brick-city': require('./paths/brick-city'),
  'brick-castle': require('./paths/brick-castle'),
  'brick-space': require('./paths/brick-space'),
  'brick-pirates': require('./paths/brick-pirates'),
  'brick-cozy': require('./paths/brick-cozy'),
  'brick-mech': require('./paths/brick-mech'),
  'brick-landscape': require('./paths/brick-landscape'),
  'brick-disaster': require('./paths/brick-disaster'),
  'brick-micro': require('./paths/brick-micro'),
  'brick-cinematic': require('./paths/brick-cinematic'),
  'brick-noir': require('./paths/brick-noir'),
  'brick-horror': require('./paths/brick-horror'),
  'brick-wild-west': require('./paths/brick-wild-west'),
};

module.exports = {
  username: 'brickbot',
  displayName: 'BrickBot',

  mediums: ['photography', 'illustration', 'canvas'],

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  useModelPicker: true,
  allowedModels: ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],

  vibes: [
    'cinematic',
    'dark',
    'cozy',
    'epic',
    'nostalgic',
    'peaceful',
    'ethereal',
    'voltage',
    'nightshade',
    'shimmer',
    'surreal',
    'fierce',
  ],

  paths: [
    'brick-city',
    'brick-castle',
    'brick-space',
    'brick-pirates',
    'brick-cozy',
    'brick-mech',
    'brick-landscape',
    'brick-disaster',
    'brick-micro',
    'brick-cinematic',
    'brick-noir',
    'brick-horror',
    'brick-wild-west',
  ],

  pathWeights: {
    'brick-city': 2,
    'brick-castle': 2,
    'brick-space': 2,
    'brick-pirates': 2,
    'brick-cozy': 2,
    'brick-mech': 2,
    'brick-landscape': 2,
    'brick-disaster': 1,
    'brick-micro': 2,
    'brick-cinematic': 1,
    'brick-noir': 1,
    'brick-horror': 1,
    'brick-wild-west': 1,
  },

  rollSharedDNA({ vibeKey, picker }) {
    return {
      scenePalette: picker.pickWithRecency(pools.SCENE_PALETTES, 'scene_palette'),
      colorPalette: pools.VIBE_COLOR[vibeKey] || pools.VIBE_COLOR.cinematic,
    };
  },

  buildBrief({ path, sharedDNA, vibeDirective, vibeKey, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`BrickBot: unknown path "${path}"`);
    return builder({ sharedDNA, vibeDirective, vibeKey, picker });
  },

  caption({ path }) {
    return `[${path}] BrickBot`;
  },
};
