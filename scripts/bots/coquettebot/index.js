/**
 * CoquetteBot — the bot-engine contract.
 *
 * Soft pink pastel everything. Cottagecore / princess / fairy / ballet /
 * Parisian-pastry energy. Adult-feminine-pastel (vs CuddleBot's kid-cute).
 * Stylized illustrated — NEVER photorealistic. No male figures, no dark.
 */

const pools = require('./pools');
const blocks = require('./shared-blocks');

const pathBuilders = {
  'adorable-creatures': require('./paths/adorable-creatures'),
  'cottagecore-scene': require('./paths/cottagecore-scene'),
  'pink-nature': require('./paths/pink-nature'),
  'sweet-treats': require('./paths/sweet-treats'),
  'coquette-fashion': require('./paths/coquette-fashion'),
  'adorable-couture': require('./paths/adorable-couture'),
  'parisian-daydream': require('./paths/parisian-daydream'),
  'tea-party-romance': require('./paths/tea-party-romance'),
  'bedroom-princess': require('./paths/bedroom-princess'),
  'fairytale-princess': require('./paths/fairytale-princess'),
  'rainy-cottage': require('./paths/rainy-cottage'),
  'coquette-portrait': require('./paths/coquette-portrait'),
  'coastal-coquette': require('./paths/coastal-coquette'),
};

module.exports = {
  username: 'coquettebot',
  displayName: 'CoquetteBot',

  // Stylized only — NO photography, NO cinematic, NO render
  mediums: [
    'fairytale',
    'watercolor',
    'canvas',
    'pencil',
    'animation',
    'anime',
    'illustration',
    'storybook',
  ],

  mediumByPath: {
    'coquette-portrait': [
      'photography', 'photography', 'photography',
      'canvas', 'canvas',
      'fairytale',
      'watercolor',
      'illustration',
    ],
  },

  vibesByMedium: {
    fairytale: ['coquette', 'enchanted', 'whimsical', 'shimmer'],
  },

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  // coquette stacked 4x for ~31%. Replaced arcane with cinematic.
  vibes: [
    'coquette',
    'cozy',
    'nostalgic',
    'peaceful',
    'whimsical',
    'ethereal',
    'enchanted',
    'shimmer',
    'surreal',
  ],

  paths: [
    'adorable-creatures',
    'cottagecore-scene',
    'pink-nature',
    'sweet-treats',
    'coquette-fashion',
    'adorable-couture',
    'parisian-daydream',
    'tea-party-romance',
    'bedroom-princess',
    'fairytale-princess',
    'rainy-cottage',
    'coquette-portrait',
    'coastal-coquette',
  ],

  useModelPicker: true,
  allowedModels: ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],

  pathWeights: {
    'adorable-creatures': 1,
    'cottagecore-scene': 1,
    'pink-nature': 1,
    'sweet-treats': 1,
    'coquette-fashion': 1,
    'adorable-couture': 1,
    'parisian-daydream': 1,
    'tea-party-romance': 1,
    'bedroom-princess': 1,
    'fairytale-princess': 1,
    'rainy-cottage': 1,
    'coquette-portrait': 1,
    'coastal-coquette': 1,
  },

  rollSharedDNA({ vibeKey, picker }) {
    return {
      scenePalette: picker.pickWithRecency(pools.SCENE_PALETTES, 'scene_palette'),
      colorPalette: pools.VIBE_COLOR[vibeKey] || pools.VIBE_COLOR.coquette,
    };
  },

  buildBrief({ path, sharedDNA, vibeDirective, vibeKey, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`CoquetteBot: unknown path "${path}"`);
    return builder({ sharedDNA, vibeDirective, vibeKey, picker });
  },

  caption({ path }) {
    return `[${path}] CoquetteBot`;
  },
};
