/**
 * PixelBot — the bot-engine contract.
 *
 * PIXEL ART MEDIUM SPECIALIST. Every render is pixel art. Universal subjects.
 * NO IP references. Bot's identity IS the medium.
 */

const pools = require('./pools');
const blocks = require('./shared-blocks');

const pathBuilders = {
  'pixel-pretty': require('./paths/pixel-pretty'),
  'pixel-fantasy': require('./paths/pixel-fantasy'),
  'pixel-cozy': require('./paths/pixel-cozy'),
  'pixel-sci-fi': require('./paths/pixel-sci-fi'),
  'pixel-character-moment': require('./paths/pixel-character-moment'),
  'pixel-action': require('./paths/pixel-action'),
};

module.exports = {
  username: 'pixelbot',
  displayName: 'PixelBot',

  mediums: ['pixels'],

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  // Inverts old excludeVibes (ancient/cozy/peaceful).
  vibes: [
    'cinematic',
    'dark',
    'epic',
    'nostalgic',
    'psychedelic',
    'whimsical',
    'ethereal',
    'arcane',
    'enchanted',
    'fierce',
    'coquette',
    'voltage',
    'nightshade',
    'macabre',
    'shimmer',
    'surreal',
  ],

  paths: [
    'pixel-pretty',
    'pixel-fantasy',
    'pixel-cozy',
    'pixel-sci-fi',
    'pixel-character-moment',
    'pixel-action',
  ],

  pathWeights: {
    'pixel-pretty': 2,
    'pixel-fantasy': 2,
    'pixel-cozy': 2,
    'pixel-sci-fi': 1,
    'pixel-character-moment': 1,
    'pixel-action': 1,
  },

  rollSharedDNA({ vibeKey, picker }) {
    return {
      scenePalette: picker.pickWithRecency(pools.SCENE_PALETTES, 'scene_palette'),
      colorPalette: pools.VIBE_COLOR[vibeKey] || pools.VIBE_COLOR.cinematic,
    };
  },

  buildBrief({ path, sharedDNA, vibeDirective, vibeKey, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`PixelBot: unknown path "${path}"`);
    return builder({ sharedDNA, vibeDirective, vibeKey, picker });
  },

  caption({ path }) {
    return `[${path}] PixelBot`;
  },
};
