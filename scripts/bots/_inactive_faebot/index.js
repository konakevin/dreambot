/**
 * FaeBot — the bot-engine contract.
 *
 * A wildlife documentary of the enchanted forest. Every creature observed
 * candidly in her natural habitat — nymphs, dryads, fae queens,
 * naiads, mushroom spirits.
 */

const pools = require('./pools');
const blocks = require('./shared-blocks');

const pathBuilders = {
  'nymph': require('./paths/nymph'),
  'dryad': require('./paths/dryad'),
  'fae-queen': require('./paths/fae-queen'),
  'naiad': require('./paths/naiad'),
  'mushroom-spirit': require('./paths/mushroom-spirit'),
  'hedge-witch': require('./paths/hedge-witch'),
  'bee-keeper': require('./paths/bee-keeper'),
  'spore-light': require('./paths/spore-light'),
  'moonwell-keeper': require('./paths/moonwell-keeper'),
  'willow-wisp': require('./paths/willow-wisp'),
  'changeling': require('./paths/changeling'),
  'siren-nymph': require('./paths/siren-nymph'),
};

module.exports = {
  username: 'faebot',
  displayName: 'FaeBot',

  mediums: ['photography', 'render', 'canvas'],

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  useModelPicker: true,
  allowedModels: ['black-forest-labs/flux-dev'],

  bannedPhrases: ['looking at the viewer', 'gazing at the camera', 'seductive pose', 'come-hither', 'beckoning the viewer', 'posing for'],

  vibes: [
    'cinematic',
    'dark',
    'epic',
    'ethereal',
    'arcane',
    'ancient',
    'enchanted',
    'fierce',
    'nightshade',
    'shimmer',
    'surreal',
    'psychedelic',
    'cozy',
    'peaceful',
  ],

  paths: [
    'nymph',
    'dryad',
    'fae-queen',
    'naiad',
    'mushroom-spirit',
    'hedge-witch',
    'bee-keeper',
    'spore-light',
    'moonwell-keeper',
    'willow-wisp',
    'changeling',
    'siren-nymph',
  ],

  pathWeights: {
    'nymph': 1,
    'dryad': 1,
    'fae-queen': 1,
    'naiad': 1,
    'mushroom-spirit': 1,
    'hedge-witch': 1,
    'bee-keeper': 1,
    'spore-light': 1,
    'moonwell-keeper': 1,
    'willow-wisp': 1,
    'changeling': 1,
    'siren-nymph': 1,
  },

  rollSharedDNA({ vibeKey, picker }) {
    return {
      season: picker.pickWithRecency(pools.FOREST_SEASON, 'forest_season'),
      light: picker.pickWithRecency(pools.FOREST_LIGHT, 'forest_light'),
      scenePalette: picker.pickWithRecency(pools.SCENE_PALETTES, 'scene_palette'),
      vibeKey,
    };
  },

  buildBrief({ path, sharedDNA, vibeDirective, vibeKey, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`FaeBot: unknown path "${path}"`);
    return builder({ sharedDNA, vibeDirective, vibeKey, picker });
  },

  caption({ path }) {
    return `[${path}] FaeBot`;
  },
};
