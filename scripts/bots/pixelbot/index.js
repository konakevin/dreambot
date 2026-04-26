/**
 * PixelBot — the bot-engine contract.
 *
 * PIXEL ART MEDIUM SPECIALIST. Every render is pixel art. Universal subjects.
 * NO IP references. Bot's identity IS the medium.
 */

const pools = require('./pools');
const blocks = require('./shared-blocks');

const pathBuilders = {
  'pixel-landscape': require('./paths/pixel-landscape'),
  'pixel-fantasy': require('./paths/pixel-fantasy'),
  'pixel-cozy': require('./paths/pixel-cozy'),
  'pixel-sci-fi': require('./paths/pixel-sci-fi'),
  'pixel-character-moment': require('./paths/pixel-character-moment'),
  'pixel-action': require('./paths/pixel-action'),
  'pixel-cottage': require('./paths/pixel-cottage'),
  'pixel-town-life': require('./paths/pixel-town-life'),
  'pixel-horror': require('./paths/pixel-horror'),
};

module.exports = {
  username: 'pixelbot',
  displayName: 'PixelBot',

  mediums: ['pixels'],

  allowedModels: ['black-forest-labs/flux-dev', 'black-forest-labs/flux-2-dev', 'black-forest-labs/flux-2-pro'],

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
    'pixel-landscape',
    'pixel-fantasy',
    'pixel-cozy',
    'pixel-sci-fi',
    'pixel-character-moment',
    'pixel-action',
    'pixel-cottage',
    'pixel-town-life',
    'pixel-horror',
  ],

  pathWeights: {
    'pixel-landscape': 1,
    'pixel-fantasy': 1,
    'pixel-cozy': 1,
    'pixel-sci-fi': 1,
    'pixel-character-moment': 1,
    'pixel-action': 1,
    'pixel-cottage': 1,
    'pixel-town-life': 1,
    'pixel-horror': 1,
  },

  rollSharedDNA({ vibeKey, picker }) {
    return {
      pixelEra: picker.pickWithRecency(pools.PIXEL_ERAS, 'pixel_era'),
      pixelPerspective: picker.pickWithRecency(pools.PIXEL_PERSPECTIVES, 'pixel_perspective'),
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
