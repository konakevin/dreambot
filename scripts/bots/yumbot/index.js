/**
 * YumBot — kawaii food specialist (bex.ai-modeled).
 *
 * Launched 2026-05-20. Three paths each tightly modeled on a distinct
 * bex.ai reference look:
 *   floral-garden-cup   — vessel overflowing with magical flora
 *   rainbow-dreamscape  — kawaii food-creatures in a wider pastel meadow
 *   checkered-tabletop  — kawaii food on pastel-gingham with mini-friend pile
 */

const blocks = require('./shared-blocks');

const pathBuilders = {
  'floral-garden-cup': require('./paths/floral-garden-cup'),
  'rainbow-dreamscape': require('./paths/rainbow-dreamscape'),
  'checkered-tabletop': require('./paths/checkered-tabletop'),
};

module.exports = {
  username: 'YumBot',
  displayName: 'YumBot',

  mediums: ['yumbot_food'],
  mediumStyles: {
    yumbot_food: blocks.YUMBOT_FOOD_MEDIUM,
  },

  useModelPicker: true,
  allowedModels: ['black-forest-labs/flux-dev'],

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  vibes: [
    'cozy', 'peaceful', 'whimsical', 'enchanted',
    'coquette', 'shimmer', 'nostalgic', 'ethereal',
    'cinematic', 'surreal',
  ],

  paths: ['floral-garden-cup', 'rainbow-dreamscape', 'checkered-tabletop'],

  pathWeights: {
    'floral-garden-cup': 1,
    'rainbow-dreamscape': 1,
    'checkered-tabletop': 1,
  },

  chaos: { enabled: false, skipPaths: [], allowSubjectChaosPaths: [] },
  twoPassPolish: { enabled: false, conceptWords: 0, polishedWords: '0', preservePhrasesByPath: {}, skipPaths: [] },
  sensoryAnchors: { enabled: false },

  defaultPools: {},

  poolByName(name) {
    const pools = require('./pools');
    if (!(name in pools)) {
      throw new Error(`YumBot.poolByName: unknown pool "${name}"`);
    }
    return pools[name];
  },

  buildBrief({ path, sharedDNA, vibeDirective, vibeKey, medium, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`YumBot: unknown path "${path}"`);
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
    if (typeof builder === 'function') {
      return builder({ sharedDNA, vibeDirective, vibeKey, picker });
    }
    throw new Error(`YumBot: path "${path}" has invalid export shape`);
  },

  rollSharedDNA({ vibeKey }) {
    const pools = require('./pools');
    return {
      scenePalette: pools.VIBE_COLOR[vibeKey] || pools.VIBE_COLOR.cozy,
      colorPalette: pools.VIBE_COLOR[vibeKey] || pools.VIBE_COLOR.cozy,
    };
  },
};
