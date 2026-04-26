/**
 * MangaBot — the bot-engine contract.
 *
 * Japanese culture + anime aesthetic full spectrum. Ghibli/Shinkai/Demon-Slayer
 * + traditional Japan + mythology + Neo-Tokyo cyberpunk. Hand-drawn anime
 * illustration. Characters by role only.
 */

const pools = require('./pools');
const blocks = require('./shared-blocks');

const pathBuilders = {
  'anime-scene': require('./paths/anime-scene'),
  'anime-landscape': require('./paths/anime-landscape'),
  'mythological-creature': require('./paths/mythological-creature'),
  'cozy-anime': require('./paths/cozy-anime'),
  kawaii: require('./paths/kawaii'),
  'slice-of-life': require('./paths/slice-of-life'),
  'neo-tokyo': require('./paths/neo-tokyo'),
  'shonen-action': require('./paths/shonen-action'),
  'samurai-era': require('./paths/samurai-era'),
  'isekai-fantasy': require('./paths/isekai-fantasy'),
  'food-anime': require('./paths/food-anime'),
  'anime-village': require('./paths/anime-village'),
};

module.exports = {
  username: 'mangabot',
  displayName: 'MangaBot',

  mediums: ['anime'],

  useModelPicker: true,
  allowedModels: [
    'black-forest-labs/flux-dev',
    'black-forest-labs/flux-1.1-pro',
  ],

  // Single 'anime' medium — pin heavy on anime-friendly vibes
  vibesByMedium: {
    anime: ['enchanted', 'cinematic', 'epic', 'ethereal', 'whimsical', 'arcane'],
  },

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  // Inverts old excludeVibes (ancient/fierce/psychedelic/minimal).
  vibes: [
    'cinematic',
    'dark',
    'cozy',
    'epic',
    'nostalgic',
    'peaceful',
    'whimsical',
    'ethereal',
    'arcane',
    'enchanted',
    'coquette',
    'voltage',
    'nightshade',
    'macabre',
    'shimmer',
    'surreal',
  ],

  paths: [
    'anime-scene',
    'anime-landscape',
    'mythological-creature',
    'cozy-anime',
    'kawaii',
    'slice-of-life',
    'neo-tokyo',
    'shonen-action',
    'samurai-era',
    'isekai-fantasy',
    'food-anime',
    'anime-village',
  ],

  pathWeights: {
    'anime-scene': 2,
    'anime-landscape': 1,
    'mythological-creature': 1,
    'cozy-anime': 2,
    kawaii: 1,
    'slice-of-life': 2,
    'neo-tokyo': 1,
    'shonen-action': 1,
    'samurai-era': 1,
    'isekai-fantasy': 1,
    'food-anime': 1,
    'anime-village': 2,
  },

  rollSharedDNA({ vibeKey, picker }) {
    return {
      scenePalette: picker.pickWithRecency(pools.SCENE_PALETTES, 'scene_palette'),
      colorPalette: pools.VIBE_COLOR[vibeKey] || pools.VIBE_COLOR.cinematic,
    };
  },

  buildBrief({ path, sharedDNA, vibeDirective, vibeKey, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`MangaBot: unknown path "${path}"`);
    return builder({ sharedDNA, vibeDirective, vibeKey, picker });
  },

  caption({ path }) {
    return `[${path}] MangaBot`;
  },
};
