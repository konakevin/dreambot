/**
 * StarBot — the bot-engine contract.
 *
 * Mind-bending sci-fi. Blade Runner / Dune / Interstellar / Alien / 2001 /
 * Arrival / Annihilation / Foundation. Cosmic vistas + alien landscapes +
 * epic space opera + sleek futurism. VenusBot owns cyborg-women — StarBot
 * does not.
 */

const pools = require('./pools');
const blocks = require('./shared-blocks');

const pathBuilders = {
  'cosmic-vista': require('./paths/cosmic-vista'),
  'alien-landscape': require('./paths/alien-landscape'),
  'space-opera': require('./paths/space-opera'),
  'sci-fi-interior': require('./paths/sci-fi-interior'),
  'cozy-sci-fi-interior': require('./paths/cozy-sci-fi-interior'),
  'alien-city': require('./paths/alien-city'),
  'robot-moment': require('./paths/robot-moment'),
  'real-space': require('./paths/real-space'),
};

module.exports = {
  username: 'starbot',
  displayName: 'StarBot',

  mediums: ['photography', 'vaporwave', 'canvas', 'render'],

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  // Inverts old excludeVibes (minimal/whimsical/cozy).
  vibes: [
    'cinematic',
    'dark',
    'epic',
    'nostalgic',
    'psychedelic',
    'peaceful',
    'ethereal',
    'arcane',
    'ancient',
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
    'cosmic-vista',
    'alien-landscape',
    'space-opera',
    'sci-fi-interior',
    'cozy-sci-fi-interior',
    'alien-city',
    'robot-moment',
    'real-space',
  ],

  pathWeights: {
    'cosmic-vista': 2,
    'alien-landscape': 2,
    'space-opera': 1,
    'sci-fi-interior': 1,
    'cozy-sci-fi-interior': 1,
    'alien-city': 2,
    'robot-moment': 1,
    'real-space': 2,
  },

  rollSharedDNA({ vibeKey, picker }) {
    return {
      scenePalette: picker.pickWithRecency(pools.SCENE_PALETTES, 'scene_palette'),
      colorPalette: pools.VIBE_COLOR[vibeKey] || pools.VIBE_COLOR.cinematic,
    };
  },

  buildBrief({ path, sharedDNA, vibeDirective, vibeKey, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`StarBot: unknown path "${path}"`);
    return builder({ sharedDNA, vibeDirective, vibeKey, picker });
  },

  caption({ path }) {
    return `[${path}] StarBot`;
  },
};
