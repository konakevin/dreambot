/**
 * EarthBot — the bot-engine contract.
 *
 * The most breathtaking landscapes on Earth — real geography amplified
 * to impossible beauty. NatGeo grandeur, rooted in this planet.
 * No people, pure atmosphere.
 */

const pools = require('./pools');
const blocks = require('./shared-blocks');

const pathBuilders = {
  'epic-vista': require('./paths/epic-vista'),
  'weather-drama': require('./paths/weather-drama'),
  'hidden-corner': require('./paths/hidden-corner'),
  'dramatic-sky': require('./paths/dramatic-sky'),
  'luminous-landscape': require('./paths/luminous-landscape'),
  'sacred-light': require('./paths/sacred-light'),
  'national-parks': require('./paths/national-parks'),
  'seasonal-shift': require('./paths/seasonal-shift'),
  'geological-wonder': require('./paths/geological-wonder'),
  'micro-nature': require('./paths/micro-nature'),
};

module.exports = {
  username: 'earthbot',
  displayName: 'EarthBot',

  mediums: ['photography', 'canvas', 'watercolor', 'illustration', 'pencil'],

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  useModelPicker: true,
  allowedModels: ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],

  vibes: [
    'cinematic',
    'cozy',
    'dark',
    'epic',
    'nostalgic',
    'peaceful',
    'ethereal',
    'ancient',
    'enchanted',
    'voltage',
    'nightshade',
    'shimmer',
    'surreal',
  ],

  paths: [
    'epic-vista',
    'weather-drama',
    'hidden-corner',
    'dramatic-sky',
    'luminous-landscape',
    'sacred-light',
    'national-parks',
    'seasonal-shift',
    'geological-wonder',
    'micro-nature',
  ],

  pathWeights: {
    'epic-vista': 1,
    'weather-drama': 1,
    'hidden-corner': 1,
    'dramatic-sky': 1,
    'luminous-landscape': 1,
    'sacred-light': 1,
    'national-parks': 1,
    'seasonal-shift': 1,
    'geological-wonder': 1,
    'micro-nature': 1,
  },

  rollSharedDNA({ vibeKey, picker }) {
    return {
      scenePalette: picker.pickWithRecency(pools.SCENE_PALETTES, 'scene_palette'),
      colorPalette: pools.VIBE_COLOR[vibeKey] || pools.VIBE_COLOR.cinematic,
    };
  },

  buildBrief({ path, sharedDNA, vibeDirective, vibeKey, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`EarthBot: unknown path "${path}"`);
    return builder({ sharedDNA, vibeDirective, vibeKey, picker });
  },

  caption({ path }) {
    return `[${path}] EarthBot`;
  },
};
