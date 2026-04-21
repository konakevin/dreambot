/**
 * DinoBot — the bot-engine contract.
 *
 * Dinosaurs at Jurassic-concept-art quality. Photoreal + cinematic.
 * Species-accurate anatomy. No humans. No named IP.
 */

const pools = require('./pools');
const blocks = require('./shared-blocks');

const pathBuilders = {
  'dino-portrait': require('./paths/dino-portrait'),
  'dino-action': require('./paths/dino-action'),
  'paleo-landscape': require('./paths/paleo-landscape'),
  'dino-pack': require('./paths/dino-pack'),
  'dino-cozy': require('./paths/dino-cozy'),
};

module.exports = {
  username: 'dinobot',
  displayName: 'DinoBot',

  mediums: ['photography', 'canvas', 'illustration'],

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  vibes: [
    'cinematic',
    'dark',
    'cozy',
    'epic',
    'nostalgic',
    'ethereal',
    'ancient',
    'enchanted',
    'fierce',
    'voltage',
    'nightshade',
    'shimmer',
    'surreal',
  ],

  paths: ['dino-portrait', 'dino-action', 'paleo-landscape', 'dino-pack', 'dino-cozy'],

  pathWeights: {
    'dino-portrait': 2,
    'dino-action': 2,
    'paleo-landscape': 2,
    'dino-pack': 1,
    'dino-cozy': 2,
  },

  rollSharedDNA({ vibeKey, picker }) {
    return {
      scenePalette: picker.pickWithRecency(pools.SCENE_PALETTES, 'scene_palette'),
      colorPalette: pools.VIBE_COLOR[vibeKey] || pools.VIBE_COLOR.cinematic,
    };
  },

  buildBrief({ path, sharedDNA, vibeDirective, vibeKey, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`DinoBot: unknown path "${path}"`);
    return builder({ sharedDNA, vibeDirective, vibeKey, picker });
  },

  caption({ path }) {
    return `[${path}] DinoBot`;
  },
};
