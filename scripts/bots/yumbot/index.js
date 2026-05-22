/**
 * YumBot — kawaii food specialist (bex.ai-modeled).
 *
 * Launched 2026-05-20. Paths each tightly modeled on a distinct
 * bex.ai reference look:
 *   floral-garden-cup    — SINGLE-vessel-hero closeup with overflowing flora
 *   floral-garden-scene  — MULTI-planter garden scene (indoor or outdoor) — sister of floral-garden-cup
 *   rainbow-dreamscape   — kawaii food-creatures in a wider pastel meadow
 *   checkered-tabletop   — kawaii food on pastel-gingham with mini-friend pile
 *   candy-fantasy        — composition-locked candy-world scenes
 */

const blocks = require('./shared-blocks');

const pathBuilders = {
  'floral-garden-cup': require('./paths/floral-garden-cup'),
  'floral-garden-scene': require('./paths/floral-garden-scene'),
  'rainbow-dreamscape': require('./paths/rainbow-dreamscape'),
  'checkered-tabletop': require('./paths/checkered-tabletop'),
  'candy-fantasy': require('./paths/candy-fantasy'),
  'japanese-festival': require('./paths/japanese-festival'),
  'mini-chef': require('./paths/mini-chef'),
  'cottagecore-nature': require('./paths/cottagecore-nature'),
  'coquette-food': require('./paths/coquette-food'),
  'kawaii-koi-pond': require('./paths/kawaii-koi-pond'),
  'kawaii-koi-pond-ultra': require('./paths/kawaii-koi-pond-ultra'),
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

  paths: ['floral-garden-cup', 'floral-garden-scene', 'rainbow-dreamscape', 'checkered-tabletop', 'candy-fantasy', 'japanese-festival', 'mini-chef', 'cottagecore-nature', 'coquette-food', 'kawaii-koi-pond', 'kawaii-koi-pond-ultra'],

  // floral-garden-cup + floral-garden-scene are SISTER paths at 0.5 each —
  // their combined weight equals 1 (the same total weight floral-garden-cup
  // had before the split), so the existing-3-path frequencies are preserved.
  pathWeights: {
    'floral-garden-cup': 0.5,
    'floral-garden-scene': 0.5,
    'rainbow-dreamscape': 1,
    'checkered-tabletop': 1,
    'candy-fantasy': 1,
    'japanese-festival': 1,
    'mini-chef': 1,
    'cottagecore-nature': 1,
    'coquette-food': 1,
    'kawaii-koi-pond': 1,
    'kawaii-koi-pond-ultra': 1,
  },

  // Per-path model override — bot.modelByPath HARDCODES a specific model for
  // a specific path, overriding useModelPicker + allowedModels. Used here to
  // lock kawaii-koi-pond-ultra to flux-1.1-pro-ultra (sister path
  // kawaii-koi-pond keeps the default flux-dev from allowedModels).
  modelByPath: {
    'kawaii-koi-pond-ultra': 'black-forest-labs/flux-1.1-pro-ultra',
  },

  chaos: { enabled: false, skipPaths: [], allowSubjectChaosPaths: [] },
  twoPassPolish: { enabled: false, conceptWords: 0, polishedWords: '0', preservePhrasesByPath: {}, skipPaths: [] },
  sensoryAnchors: { enabled: false },

  defaultPools: {},

  // Per-path prefix override — prepended BEFORE the medium style prefix
  // as the FIRST tokens Flux sees. Used to lock path-specific world DNA
  // that the shared medium prefix can't establish on its own.
  promptPrefixByPath: {
    'candy-fantasy':
      'Kawaii candy-fantasy scene — composition follows the scene description below (NOT a default candy meadow). The scene sits inside a RICH KAWAII CANDY-FANTASY WORLD with a lush layered candy-world backdrop visible BEHIND the foreground scene — frosted-cake mountains, oversized lollipop-trees, marshmallow drifts, sprinkle-grass, cotton-candy clouds, sugar-glitter air, gumdrop bushes, candy-cane accents — every surface confectionary, NEVER real wood/grass/stone/metal/fabric. The candy-world backdrop is RICH AND DETAILED but never overrides the foreground composition the scene description establishes.',

  },


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
