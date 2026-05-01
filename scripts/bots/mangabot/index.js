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

  chaos: {
    enabled: true,
    skipPaths: [],
    allowSubjectChaosPaths: ['anime-scene', 'anime-landscape', 'neo-tokyo', 'isekai-fantasy', 'food-anime', 'anime-village', 'mythological-creature'],
  },

  twoPassPolish: {
    enabled: true,
    conceptWords: 150,
    polishedWords: '65-90',
    polishedWordsByPath: {
      kawaii: '80-110', 'slice-of-life': '80-110', 'cozy-anime': '80-110',
      'shonen-action': '80-110', 'samurai-era': '80-110',
      'mythological-creature': '80-110',
    },
    preservePhrasesByPath: {},
  },

  sensoryAnchors: {
    enabled: true,
    requiredChannels: ['lightcolor'],
    pathContext: {
      // Hard female: kawaii (always young anime girl) + slice-of-life (almost always
      // a young woman protagonist). cozy-anime moved to scene per Kevin's catch on
      // an elderly-luthier render — cozy-anime briefs sometimes drift to non-female
      // subjects (craftsman, parent, scene-only quiet moments), so forced female
      // anchors clash. Treat cozy-anime as scene to be safe.
      kawaii: 'female', 'slice-of-life': 'female',
      'shonen-action': 'male', 'samurai-era': 'male',
      'mythological-creature': 'creature',
      'cozy-anime': 'scene',
      'anime-scene': 'scene', 'anime-landscape': 'scene', 'anime-village': 'scene',
      'neo-tokyo': 'scene', 'isekai-fantasy': 'scene', 'food-anime': 'scene',
    },
    poolsByContextAndChannel: pools.SENSORY_POOLS,
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
