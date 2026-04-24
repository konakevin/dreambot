/**
 * RetroBot — the bot-engine contract.
 *
 * Pure SCENE nostalgia, 1975-1995. No people. The viewer sees a place
 * and instantly says "I grew up here." Warm film grain, analog textures,
 * golden-hour light. Appeals to anyone who was a kid in the late 70s
 * through mid 90s — boys and girls, suburbs and cities.
 */

const pools = require('./pools');
const blocks = require('./shared-blocks');

const pathBuilders = {
  'saturday-morning': require('./paths/saturday-morning'),
  'mall-hangout': require('./paths/mall-hangout'),
  'video-store-friday': require('./paths/video-store-friday'),
  'summer-golden': require('./paths/summer-golden'),
  'bedroom-time-capsule': require('./paths/bedroom-time-capsule'),
  'holiday-seasons': require('./paths/holiday-seasons'),
  'road-trip': require('./paths/road-trip'),
  'sleepover-night': require('./paths/sleepover-night'),
  'retro-tech': require('./paths/retro-tech'),
};

module.exports = {
  username: 'retrobot',
  displayName: 'RetroBot',

  mediums: [
    'photography',
    'canvas',
    'watercolor',
    'illustration',
    'pencil',
    'storybook',
    'cinematic',
  ],

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  vibes: [
    'cozy',
    'peaceful',
    'whimsical',
    'nostalgic',
    'ethereal',
    'cinematic',
    'surreal',
    'shimmer',
    'coquette',
    'enchanted',
  ],

  paths: [
    'saturday-morning',
    'mall-hangout',
    'video-store-friday',
    'summer-golden',
    'bedroom-time-capsule',
    'holiday-seasons',
    'road-trip',
    'sleepover-night',
    'retro-tech',
  ],

  useModelPicker: true,
  allowedModels: ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],

  pathWeights: {
    'saturday-morning': 2,
    'mall-hangout': 2,
    'video-store-friday': 2,
    'summer-golden': 3,
    'bedroom-time-capsule': 3,
    'holiday-seasons': 2,
    'road-trip': 2,
    'sleepover-night': 2,
    'retro-tech': 2,
  },

  rollSharedDNA({ vibeKey, picker }) {
    return {
      eraPalette: pools.ERA_PALETTES[vibeKey] || pools.ERA_PALETTES.nostalgic,
    };
  },

  buildBrief({ path, sharedDNA, vibeDirective, vibeKey, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`RetroBot: unknown path "${path}"`);
    return builder({ sharedDNA, vibeDirective, vibeKey, picker });
  },

  caption({ path }) {
    return `[${path}] RetroBot`;
  },
};
