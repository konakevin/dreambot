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
  'tiny-animal-friends': require('./paths/tiny-animal-friends'),
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
    'tiny-animal-friends',
  ],

  // Bread-and-butter: heartwarming-scene + creature-portrait.
  // Cozy-landscape + tiny-friends balance.
  pathWeights: {
    'heartwarming-scene': 2,
    'cozy-landscape': 1,
    'plushie-life': 1,
    'creature-portrait': 2,
    'tiny-animal-friends': 1,
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
