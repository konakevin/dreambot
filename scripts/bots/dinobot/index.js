/**
 * DinoBot — the bot-engine contract.
 *
 * BBC Planet Earth meets museum-grade paleoart. Cinematic nature
 * documentary stills of scientifically plausible dinosaurs.
 * Ultra-realistic, species-accurate, dramatic cinematography.
 */

const pools = require('./pools');
const blocks = require('./shared-blocks');

const pathBuilders = {
  'dino-portrait': require('./paths/dino-portrait'),
  'dino-action': require('./paths/dino-action'),
  'paleo-landscape': require('./paths/paleo-landscape'),
  'herd-migration': require('./paths/herd-migration'),
  'territory-clash': require('./paths/territory-clash'),
  'nesting-ground': require('./paths/nesting-ground'),
  'swamp-river': require('./paths/swamp-river'),
  'ocean-reptiles': require('./paths/ocean-reptiles'),
  'volcanic-apocalypse': require('./paths/volcanic-apocalypse'),
  'cinematic-silhouette': require('./paths/cinematic-silhouette'),
  'micro-detail': require('./paths/micro-detail'),
  'extinction-event': require('./paths/extinction-event'),
  'dino-cozy': require('./paths/dino-cozy'),
  'dino-pack': require('./paths/dino-pack'),
};

module.exports = {
  username: 'dinobot',
  displayName: 'DinoBot',

  mediums: ['photography', 'render', 'canvas'],

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  useModelPicker: true,
  allowedModels: ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],

  vibes: [
    'cinematic',
    'cozy',
    'dark',
    'epic',
    'ancient',
    'ethereal',
    'fierce',
    'voltage',
    'nightshade',
    'shimmer',
    'surreal',
  ],

  paths: [
    'dino-portrait',
    'dino-action',
    'paleo-landscape',
    'herd-migration',
    'territory-clash',
    'nesting-ground',
    'swamp-river',
    'ocean-reptiles',
    'volcanic-apocalypse',
    'cinematic-silhouette',
    'micro-detail',
    'extinction-event',
    'dino-cozy',
    'dino-pack',
  ],

  pathWeights: {
    'dino-portrait': 1,
    'dino-action': 1,
    'paleo-landscape': 1,
    'herd-migration': 1,
    'territory-clash': 1,
    'nesting-ground': 1,
    'swamp-river': 1,
    'ocean-reptiles': 1,
    'volcanic-apocalypse': 1,
    'cinematic-silhouette': 1,
    'micro-detail': 1,
    'extinction-event': 1,
    'dino-cozy': 1,
    'dino-pack': 1,
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

  bannedPhrases: ['human', 'person', 'people', 'man ', 'woman', 'child', 'hunter', 'explorer', 'scientist', 'ranger', 'tourist'],

  caption({ path }) {
    return `[${path}] DinoBot`;
  },
};
