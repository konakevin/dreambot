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
  ],

  useModelPicker: true,
  allowedModels: ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],

  // storybook-page 50%, cozy-landscape 15%, outdoor-adventure 10%, rest ~25%
  pathWeights: {
    'heartwarming-scene': 1,
    'cozy-landscape': 3,
    'plushie-life': 1,
    'creature-portrait': 1,
    'sleepy-naptime': 1,
    'rainy-day-cozy': 1,
    'miniature-feast': 1,
    'bath-time': 1,
    'outdoor-adventure': 2,
    'storybook-page': 3,
    'cottage-core': 4,
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
