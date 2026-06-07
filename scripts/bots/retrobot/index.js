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
const { ALL_ENABLED_AI_MODELS } = require('../../lib/imageModels');

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

  // gpt-image-2 + nano-banana clean-render override (2026-06-07). Keeps these
  // models from reading the bot's film-grain/era anchors as "go abstract"
  // (+ empty promptPrefixByMedium so the bot prefix doesn't pull them off).
  mediumStyles: {
    retrobot_gpt_clean: blocks.GPT_CLEAN,
  },
  cleanMediumByModel: {
    'openai/gpt-image-2': { medium: 'retrobot_gpt_clean' },
    'google/gemini-2-image': { medium: 'retrobot_gpt_clean' },
  },
  promptPrefixByMedium: {
    retrobot_gpt_clean: '',
  },

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
  allowedModels: ALL_ENABLED_AI_MODELS,

  // Flat rotation (2026-05-26): equal weight per path — every path posts
  // once per cycle in randomized order via the cycleAllPaths shuffle-bag.
  cycleAllPaths: true,

  chaos: {
    enabled: true,
    skipPaths: [],
    allowSubjectChaosPaths: [
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
  },
  twoPassPolish: {
    enabled: true,
    conceptWords: 150,
    polishedWords: '65-90',
    polishedWordsByPath: {},
    preservePhrasesByPath: {},
  },
  sensoryAnchors: {
    enabled: true,
    requiredChannels: ['lightcolor'],
    pathContext: {
      'saturday-morning': 'scene',
      'mall-hangout': 'scene',
      'video-store-friday': 'scene',
      'summer-golden': 'scene',
      'bedroom-time-capsule': 'scene',
      'holiday-seasons': 'scene',
      'road-trip': 'scene',
      'sleepover-night': 'scene',
      'retro-tech': 'scene',
    },
    poolsByContextAndChannel: pools.SENSORY_POOLS,
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
