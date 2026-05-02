/**
 * CuddleBot — the bot-engine contract.
 *
 * Pure CUTE + COZY + CUDDLY. Stylized ONLY — never photoreal (AnimalBot's
 * job). Pixar / Sanrio / Totoro-warmth. Every post makes girls + kids
 * go AWWW. Scene-centric with cute-creature or cozy-world subjects. No humans.
 */

const pools = require('./pools');
const blocks = require('./shared-blocks');

const pathBuilders = {
  'heartwarming-scene': require('./paths/heartwarming-scene'),
  'cozy-landscape': require('./paths/cozy-landscape'),
  'plushie-life': require('./paths/plushie-life'),
  'creature-portrait': require('./paths/creature-portrait'),
  'sleepy-naptime': require('./paths/sleepy-naptime'),
  'rainy-day-cozy': require('./paths/rainy-day-cozy'),
  'miniature-feast': require('./paths/miniature-feast'),
  'bath-time': require('./paths/bath-time'),
  'outdoor-adventure': require('./paths/outdoor-adventure'),
  'storybook-page': require('./paths/storybook-page'),
  'cottage-core': require('./paths/cottage-core'),
  'cuddly-aquatic': require('./paths/cuddly-aquatic'),
  'jungle-canopy': require('./paths/jungle-canopy'),
  'snowy-arctic': require('./paths/snowy-arctic'),
  'night-meadow': require('./paths/night-meadow'),
};

module.exports = {
  username: 'cuddlebot',
  displayName: 'CuddleBot',

  // Stylized-only mediums. BANNED: photography, vaporwave, lego, pixels, render, comics
  mediums: [
    'animation',
    'claymation',
    'storybook',
    'watercolor',
    'handcrafted',
    'illustration',
    'fairytale',
    'anime',
    'pencil',
    'canvas',
  ],

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  // Cute-forward vibes. BANNED: dark, fierce, macabre, nightshade, psychedelic,
  // ancient, epic, voltage, arcane.
  vibes: [
    'cozy',
    'peaceful',
    'whimsical',
    'enchanted',
    'coquette',
    'shimmer',
    'nostalgic',
    'ethereal',
    'cinematic',
    'surreal',
  ],

  paths: [
    'heartwarming-scene',
    'cozy-landscape',
    'plushie-life',
    'creature-portrait',
    'sleepy-naptime',
    'rainy-day-cozy',
    'miniature-feast',
    'bath-time',
    'outdoor-adventure',
    'storybook-page',
    'cottage-core',
    'cuddly-aquatic',
    'jungle-canopy',
    'snowy-arctic',
    'night-meadow',
  ],

  useModelPicker: true,
  allowedModels: ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],

  // All 15 paths roll equally (~6.7% each).
  pathWeights: {
    'heartwarming-scene': 1,
    'cozy-landscape': 1,
    'plushie-life': 1,
    'creature-portrait': 1,
    'sleepy-naptime': 1,
    'rainy-day-cozy': 1,
    'miniature-feast': 1,
    'bath-time': 1,
    'outdoor-adventure': 1,
    'storybook-page': 1,
    'cottage-core': 1,
    'cuddly-aquatic': 1,
    'jungle-canopy': 1,
    'snowy-arctic': 1,
    'night-meadow': 1,
  },

  // Chaos layer — light touch for cute bots. Subject chaos OFF for
  // creature-centric paths (don't distort the cute silhouette). Scenery
  // + storybook + night-meadow paths get scene-channel chaos.
  chaos: {
    enabled: true,
    skipPaths: [],
    allowSubjectChaosPaths: ['cozy-landscape', 'rainy-day-cozy', 'storybook-page', 'cottage-core', 'night-meadow'],
  },

  // Two-pass Sonnet→Haiku polish.
  twoPassPolish: {
    enabled: true,
    conceptWords: 150,
    polishedWords: '65-90',
    preservePhrasesByPath: {},
  },

  // Sensory anchors — 2 contexts × 7 channels × 100 entries.
  // Lightcolor required (forces specific cozy palette every render).
  sensoryAnchors: {
    enabled: true,
    requiredChannels: ['lightcolor'],
    pathContext: {
      'creature-portrait': 'creature',
      'plushie-life': 'creature',
      'sleepy-naptime': 'creature',
      'bath-time': 'creature',
      'outdoor-adventure': 'creature',
      'miniature-feast': 'creature',
      'heartwarming-scene': 'scene',
      'cozy-landscape': 'scene',
      'rainy-day-cozy': 'scene',
      'storybook-page': 'scene',
      'cottage-core': 'scene',
      'cuddly-aquatic': 'creature',
      'jungle-canopy': 'creature',
      'snowy-arctic': 'creature',
      'night-meadow': 'scene',
    },
    poolsByContextAndChannel: pools.SENSORY_POOLS,
  },

  rollSharedDNA({ vibeKey, picker }) {
    return {
      scenePalette: picker.pickWithRecency(pools.SCENE_PALETTES, 'scene_palette'),
      colorPalette: pools.VIBE_COLOR[vibeKey] || pools.VIBE_COLOR.cozy,
    };
  },

  buildBrief({ path, sharedDNA, vibeDirective, vibeKey, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`CuddleBot: unknown path "${path}"`);
    return builder({ sharedDNA, vibeDirective, vibeKey, picker });
  },

  caption({ path }) {
    return `[${path}] CuddleBot`;
  },
};
