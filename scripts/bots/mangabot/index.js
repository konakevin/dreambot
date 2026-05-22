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
  // Existing (11 retained, all rewritten 2026-05-08 for keyframe framework):
  'mythological-creature': require('./paths/mythological-creature'),
  'kawaii': require('./paths/kawaii'),
  'slice-of-life': require('./paths/slice-of-life'),
  'neo-tokyo': require('./paths/neo-tokyo'),
  'shonen-action': require('./paths/shonen-action'),
  'samurai-era': require('./paths/samurai-era'),
  'isekai-fantasy': require('./paths/isekai-fantasy'),
  'food-anime': require('./paths/food-anime'),
  'anime-village': require('./paths/anime-village'),
  'anime-character-female': require('./paths/anime-character-female'),
  'anime-character-male': require('./paths/anime-character-male'),
  // 12 new paths (built 2026-05-08):
  'mecha-hangars': require('./paths/mecha-hangars'),
  'festival-nights': require('./paths/festival-nights'),
  'magical-girl': require('./paths/magical-girl'),
  'ghibli-countryside': require('./paths/ghibli-countryside'),
  'occult-tokyo': require('./paths/occult-tokyo'),
  'post-apocalyptic': require('./paths/post-apocalyptic'),
  'beach-episode': require('./paths/beach-episode'),
  'rooftop-sunsets': require('./paths/rooftop-sunsets'),
  'cherry-blossom-romance': require('./paths/cherry-blossom-romance'),
  'space-opera': require('./paths/space-opera'),
  'underwater': require('./paths/underwater'),
  'noir': require('./paths/noir'),
};

module.exports = {
  username: 'mangabot',
  displayName: 'MangaBot',

  mediums: ['anime'],

  useModelPicker: true,
  allowedModels: ['black-forest-labs/flux-1.1-pro'],

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
    // Retained (11)
    'mythological-creature',
    'kawaii',
    'slice-of-life',
    'neo-tokyo',
    'shonen-action',
    'samurai-era',
    'isekai-fantasy',
    'food-anime',
    'anime-village',
    'anime-character-female',
    'anime-character-male',
    // New (12)
    'mecha-hangars',
    'festival-nights',
    'magical-girl',
    'ghibli-countryside',
    'occult-tokyo',
    'post-apocalyptic',
    'beach-episode',
    'rooftop-sunsets',
    'cherry-blossom-romance',
    'space-opera',
    'underwater',
    'noir',
  ],

  pathWeights: {
    // Big-genre canon — flagship anime categories that fans recognize instantly
    'neo-tokyo': 2,
    'samurai-era': 2,
    'shonen-action': 2,
    'isekai-fantasy': 2,
    'mecha-hangars': 2,
    // Character-forward (Kevin's recent likes)
    'anime-character-female': 2,
    'anime-character-male': 2,
    // Pretty / poster-coded
    'cherry-blossom-romance': 2,
    'rooftop-sunsets': 2,
    'festival-nights': 2,
    // Standard weight (still core)
    'slice-of-life': 1,
    'kawaii': 1,
    'food-anime': 1,
    'anime-village': 1,
    'mythological-creature': 1,
    'magical-girl': 1,
    'ghibli-countryside': 1,
    'occult-tokyo': 1,
    'post-apocalyptic': 1,
    'beach-episode': 1,
    'space-opera': 1,
    'underwater': 1,
    'noir': 1,
  },

  chaos: {
    enabled: true,
    skipPaths: [],
    allowSubjectChaosPaths: [
      'neo-tokyo', 'isekai-fantasy', 'food-anime', 'anime-village', 'mythological-creature',
      'mecha-hangars', 'occult-tokyo', 'post-apocalyptic', 'space-opera', 'underwater',
      'ghibli-countryside', 'festival-nights', 'rooftop-sunsets', 'noir',
    ],
  },

  twoPassPolish: {
    enabled: true,
    conceptWords: 150,
    polishedWords: '65-90',
    polishedWordsByPath: {
      // Character-rich paths need extra word budget for archetype + outfit + setting + vista
      'anime-character-female': '90-130',
      'anime-character-male': '90-130',
      // Density-mandated paths — extra room for 8+ micro-details + 2+ atmosphere + 2+ lighting
      kawaii: '80-110', 'slice-of-life': '80-110',
      'shonen-action': '80-110', 'samurai-era': '80-110',
      'mythological-creature': '80-110',
      'mecha-hangars': '80-110', 'festival-nights': '80-110',
      'magical-girl': '80-110', 'ghibli-countryside': '80-110',
      'occult-tokyo': '80-110', 'post-apocalyptic': '80-110',
      'beach-episode': '80-110', 'rooftop-sunsets': '80-110',
      'cherry-blossom-romance': '80-110', 'space-opera': '80-110',
      'underwater': '80-110', 'noir': '80-110',
    },
    preservePhrasesByPath: {},
  },

  sensoryAnchors: {
    enabled: true,
    requiredChannels: ['lightcolor'],
    pathContext: {
      // Female-coded paths
      kawaii: 'female',
      'slice-of-life': 'female',
      'cherry-blossom-romance': 'female',
      'magical-girl': 'female',
      'anime-character-female': 'female',
      // Male-coded paths
      'shonen-action': 'male',
      'samurai-era': 'male',
      'noir': 'male',
      'anime-character-male': 'male',
      // Creature-coded
      'mythological-creature': 'creature',
      // Scene-coded (no specific gender for sensory anchors)
      'anime-village': 'scene',
      'neo-tokyo': 'scene',
      'isekai-fantasy': 'scene',
      'food-anime': 'scene',
      'mecha-hangars': 'scene',
      'festival-nights': 'scene',
      'ghibli-countryside': 'scene',
      'occult-tokyo': 'scene',
      'post-apocalyptic': 'scene',
      'beach-episode': 'scene',
      'rooftop-sunsets': 'scene',
      'space-opera': 'scene',
      'underwater': 'scene',
    },
    poolsByContextAndChannel: pools.SENSORY_POOLS,
  },

  rollSharedDNA({ vibeKey, picker }) {
    return {
      scenePalette: picker.pickWithRecency(pools.SCENE_PALETTES, 'scene_palette'),
      colorPalette: pools.VIBE_COLOR[vibeKey] || pools.VIBE_COLOR.cinematic,
    };
  },

  poolByName(name) {
    if (!(name in pools)) {
      throw new Error(`MangaBot.poolByName: unknown pool "${name}"`);
    }
    return pools[name];
  },

  buildBrief({ path, sharedDNA, vibeDirective, vibeKey, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`MangaBot: unknown path "${path}"`);
    // Axis-system path — declarative { archetype, pools }
    if (builder && typeof builder === 'object' && builder.archetype) {
      const { composeBrief } = require('../../lib/brief-composer');
      return composeBrief({
        bot: module.exports,
        pathConfig: builder,
        sharedDNA,
        vibeDirective,
        picker,
      });
    }
    // Legacy inline-builder path
    if (typeof builder === 'function') {
      return builder({ sharedDNA, vibeDirective, vibeKey, picker });
    }
    throw new Error(`MangaBot: path "${path}" has invalid export shape`);
  },

  caption({ path }) {
    return `[${path}] MangaBot`;
  },
};
