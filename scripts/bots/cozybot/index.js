/**
 * CozyBot — the bot-engine contract.
 *
 * 2026-05-06 — CuddleBot merged into CozyBot. CozyBot now renders all 26
 * combined paths under one identity. Same modern-Pixar visual register
 * (cozybot_pixar medium), same vibes, same prompt prefix/suffix —
 * "bit-for-bit exact" rendering quality preserved per Kevin's directive.
 *
 * Phase 1 (this commit): all paths copied + wired in CozyBot. CuddleBot
 * code stays in the tree until Phase 2 verification batch confirms parity.
 *
 * Path inventory (26):
 *   3 CozyBot-original indoor paths: rainy-interior / fireplace-cabin /
 *     bookish-sanctuary — written 2026-05-05 in the CuddleBot cozy-interior
 *     pattern (local, can't borrow CuddleBot pool seeds for these subjects)
 *   17 paths from CuddleBot: heartwarming-scene / cozy-landscape /
 *     plushie-life / creature-portrait / sleepy-naptime / rainy-day-cozy /
 *     miniature-feast / bath-time / outdoor-adventure / storybook-page /
 *     cuddly-aquatic / jungle-canopy / snowy-arctic / night-meadow /
 *     sunny-pair / cozy-interior / dollhouse-life
 *   6 village paths (originally copied from CuddleBot, byte-identical):
 *     cottagecore-village (= CuddleBot's cottage-core) / aquatic-village /
 *     arctic-village / jungle-village / twilight-village / sunny-village
 *
 * Toy-photo overrides:
 *   plushie-life → plush_fabric medium
 *   dollhouse-life → dollhouse_figures medium
 * (deliberate brand-break paths — not Pixar register)
 */

const pools = require('./pools');
const blocks = require('./shared-blocks');

const pathBuilders = {
  // 3 CozyBot-original indoor paths
  'rainy-interior': require('./paths/rainy-interior'),
  'fireplace-cabin': require('./paths/fireplace-cabin'),
  'bookish-sanctuary': require('./paths/bookish-sanctuary'),
  // 17 paths copied from CuddleBot 2026-05-06
  'heartwarming-scene': require('./paths/heartwarming-scene'),
  'cozy-landscape': require('./paths/cozy-landscape'),
  'plushie-life': require('./paths/plushie-life'),
  'creature-portrait': require('./paths/creature-portrait'),
  'sleepy-naptime': require('./paths/sleepy-naptime'),
  'rainy-day-cozy': require('./paths/rainy-day-cozy'),
  'miniature-feast': require('./paths/miniature-feast'),
  'bath-time': require('./paths/bath-time'),
  'outdoor-adventure': require('./paths/outdoor-adventure'),
  'storybook-page': require('./paths/storybook-page'),
  'cuddly-aquatic': require('./paths/cuddly-aquatic'),
  'jungle-canopy': require('./paths/jungle-canopy'),
  'snowy-arctic': require('./paths/snowy-arctic'),
  'night-meadow': require('./paths/night-meadow'),
  'sunny-pair': require('./paths/sunny-pair'),
  'cozy-interior': require('./paths/cozy-interior'),
  'dollhouse-life': require('./paths/dollhouse-life'),
  // 6 village paths (byte-identical to CuddleBot's)
  'cottagecore-village': require('./paths/cottagecore-village'),
  'aquatic-village': require('./paths/aquatic-village'),
  'arctic-village': require('./paths/arctic-village'),
  'jungle-village': require('./paths/jungle-village'),
  'twilight-village': require('./paths/twilight-village'),
  'sunny-village': require('./paths/sunny-village'),
};

module.exports = {
  username: 'cozybot',
  displayName: 'CozyBot',

  // Single locked bot-internal medium (sister bot CuddleBot has same).
  defaultMedium: 'cozybot_pixar',

  // Toy-photo overrides for plushie-life + dollhouse-life — those 2 paths
  // intentionally break the Pixar brand for toy-photography aesthetic.
  mediumByPath: {
    'plushie-life': 'plush_fabric',
    'dollhouse-life': 'dollhouse_figures',
  },

  mediumStyles: {
    cozybot_pixar: blocks.COZY_PIXAR_MEDIUM,
    plush_fabric:
      'plush stuffed-animal characters — soft-fabric creatures with visible plush-fiber FUR or KNIT TEXTURE, embroidered or button eyes, stitched mouth, sewn-on muzzle, soft floppy limbs, fiberfill pudgy bodies, optional tiny knit sweaters or cloth bandanas, fully-dressed handcrafted miniature sets (forest campsite, sailboat, picnic meadow, attic bedroom, treehouse), warm firelight / lantern-glow / golden-hour / moonlit-window practical lighting, storybook warmth — NOT LBP burlap-with-zipper (that is Sackboy) NOT real animal NOT CGI NOT illustration',
    dollhouse_figures:
      'dollhouse-scale miniature figurines in a fully-appointed handcrafted miniature interior — flocked plush-creature small-animals, tiny cloth outfits, wooden furniture / tiny dishware / mini books / hand-sewn drapes / miniature appliances at scale, warm window-glow or lamp-glow practical lighting, cozy wholesome daily-life energy — NOT real human NOT real animal NOT CGI NOT illustration',
  },

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  // Per-medium prefix/suffix override — toy-photography paths use their own.
  promptPrefixByMedium: {
    plush_fabric: blocks.TOY_PHOTO_PROMPT_PREFIX,
    dollhouse_figures: blocks.TOY_PHOTO_PROMPT_PREFIX,
  },
  promptSuffixByMedium: {
    plush_fabric: blocks.TOY_PHOTO_PROMPT_SUFFIX,
    dollhouse_figures: blocks.TOY_PHOTO_PROMPT_SUFFIX,
  },

  // Cute-forward vibes (matches CuddleBot's exact list — banned: dark,
  // fierce, macabre, nightshade, psychedelic, ancient, epic, voltage, arcane).
  vibes: [
    'cozy',
    'peaceful',
    'whimsical',
    'enchanted',
    'coquette',
    'shimmer',
    'nostalgic',
    'ethereal',
    'cinematic',
    'surreal',
  ],

  paths: [
    // 3 CozyBot-original indoor (weighted 2× to balance vs the 23 others)
    'rainy-interior',
    'fireplace-cabin',
    'bookish-sanctuary',
    // 17 from CuddleBot
    'heartwarming-scene',
    'cozy-landscape',
    'plushie-life',
    'creature-portrait',
    'sleepy-naptime',
    'rainy-day-cozy',
    'miniature-feast',
    'bath-time',
    'outdoor-adventure',
    'storybook-page',
    'cuddly-aquatic',
    'jungle-canopy',
    'snowy-arctic',
    'night-meadow',
    'sunny-pair',
    'cozy-interior',
    'dollhouse-life',
    // 6 village
    'cottagecore-village',
    'aquatic-village',
    'arctic-village',
    'jungle-village',
    'twilight-village',
    'sunny-village',
  ],

  // Path weights — preserve CozyBot's 2× indoor boost; everything else 1×.
  pathWeights: {
    'rainy-interior': 2,
    'fireplace-cabin': 2,
    'bookish-sanctuary': 2,
    'heartwarming-scene': 1,
    'cozy-landscape': 1,
    'plushie-life': 1,
    'creature-portrait': 1,
    'sleepy-naptime': 1,
    'rainy-day-cozy': 1,
    'miniature-feast': 1,
    'bath-time': 1,
    'outdoor-adventure': 1,
    'storybook-page': 1,
    'cuddly-aquatic': 1,
    'jungle-canopy': 1,
    'snowy-arctic': 1,
    'night-meadow': 1,
    'sunny-pair': 1,
    'cozy-interior': 1,
    'dollhouse-life': 1,
    'cottagecore-village': 1,
    'aquatic-village': 1,
    'arctic-village': 1,
    'jungle-village': 1,
    'twilight-village': 1,
    'sunny-village': 1,
  },

  useModelPicker: true,
  allowedModels: ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],

  // Chaos layer — inherited from CuddleBot. Subject chaos OFF for
  // creature-centric paths (don't distort the cute silhouette). Village +
  // scenery + storybook + cozy-interior + new indoor paths get subject-chaos.
  chaos: {
    enabled: true,
    skipPaths: [],
    allowSubjectChaosPaths: [
      'cozy-landscape',
      'rainy-day-cozy',
      'storybook-page',
      'night-meadow',
      'aquatic-village',
      'jungle-village',
      'arctic-village',
      'twilight-village',
      'sunny-village',
      'cottagecore-village',
      'cozy-interior',
      'rainy-interior',
      'fireplace-cabin',
      'bookish-sanctuary',
    ],
  },

  twoPassPolish: {
    enabled: true,
    conceptWords: 150,
    polishedWords: '65-90',
    preservePhrasesByPath: {},
  },

  // Sensory anchors inherited from CuddleBot. New indoor paths get 'scene'
  // context. Village paths stay 'scene'.
  sensoryAnchors: {
    enabled: true,
    requiredChannels: ['lightcolor'],
    pathContext: {
      'creature-portrait': 'creature',
      'plushie-life': 'creature',
      'sleepy-naptime': 'creature',
      'bath-time': 'creature',
      'outdoor-adventure': 'creature',
      'miniature-feast': 'creature',
      'cuddly-aquatic': 'creature',
      'jungle-canopy': 'creature',
      'snowy-arctic': 'creature',
      'sunny-pair': 'creature',
      'dollhouse-life': 'creature',
      'heartwarming-scene': 'scene',
      'cozy-landscape': 'scene',
      'rainy-day-cozy': 'scene',
      'storybook-page': 'scene',
      'night-meadow': 'scene',
      'aquatic-village': 'scene',
      'jungle-village': 'scene',
      'arctic-village': 'scene',
      'twilight-village': 'scene',
      'sunny-village': 'scene',
      'cozy-interior': 'scene',
      'cottagecore-village': 'scene',
      'rainy-interior': 'scene',
      'fireplace-cabin': 'scene',
      'bookish-sanctuary': 'scene',
    },
    poolsByContextAndChannel: pools.SENSORY_POOLS,
  },

  rollSharedDNA({ vibeKey, picker }) {
    return {
      scenePalette: picker.pickWithRecency(pools.SCENE_PALETTES, 'scene_palette'),
      colorPalette: pools.VIBE_COLOR[vibeKey] || pools.VIBE_COLOR.cozy,
    };
  },

  buildBrief({ path, sharedDNA, vibeDirective, vibeKey, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`CozyBot: unknown path "${path}"`);
    return builder({ sharedDNA, vibeDirective, vibeKey, picker });
  },

  caption({ path }) {
    return `[${path}] CozyBot`;
  },
};
