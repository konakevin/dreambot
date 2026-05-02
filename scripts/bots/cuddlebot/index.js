/**
 * CuddleBot — the bot-engine contract.
 *
 * Pure CUTE + COZY + CUDDLY. Stylized ONLY — never photoreal (AnimalBot's
 * job). Pixar / Sanrio / Totoro-warmth. Every post makes girls + kids
 * go AWWW. Scene-centric with cute-creature or cozy-world subjects. No humans.
 */

const pools = require('./pools');
const blocks = require('./shared-blocks');

const pathBuilders = {
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
  'cottage-core': require('./paths/cottage-core'),
  'cuddly-aquatic': require('./paths/cuddly-aquatic'),
  'jungle-canopy': require('./paths/jungle-canopy'),
  'snowy-arctic': require('./paths/snowy-arctic'),
  'night-meadow': require('./paths/night-meadow'),
  'aquatic-village': require('./paths/aquatic-village'),
  'jungle-village': require('./paths/jungle-village'),
  'arctic-village': require('./paths/arctic-village'),
  'twilight-village': require('./paths/twilight-village'),
  'sunny-pair': require('./paths/sunny-pair'),
  'sunny-village': require('./paths/sunny-village'),
  'cozy-interior': require('./paths/cozy-interior'),
  'dollhouse-life': require('./paths/dollhouse-life'),
};

module.exports = {
  username: 'cuddlebot',
  displayName: 'CuddleBot',

  // Stylized-only mediums. BANNED: photography, vaporwave, lego, pixels, render, comics
  mediums: [
    'animation',
    'claymation',
    'storybook',
    'watercolor',
    'handcrafted',
    'illustration',
    'fairytale',
    'anime',
    'pencil',
    'canvas',
  ],

  // Per-path medium override — plushie-life and dollhouse-life lock to toy-
  // photography mediums (plush_fabric / dollhouse_figures), intentionally
  // breaking cuddlebot's "stylized only" brand for these 2 paths to deliver
  // the toybot toy-photography aesthetic.
  mediumByPath: {
    'plushie-life': 'plush_fabric',
    'dollhouse-life': 'dollhouse_figures',
  },

  // Toy-photography mediumStyles (copied from toybot for plushie + dollhouse).
  mediumStyles: {
    plush_fabric:
      'plush stuffed-animal characters — soft-fabric creatures with visible plush-fiber FUR or KNIT TEXTURE, embroidered or button eyes, stitched mouth, sewn-on muzzle, soft floppy limbs, fiberfill pudgy bodies, optional tiny knit sweaters or cloth bandanas, fully-dressed handcrafted miniature sets (forest campsite, sailboat, picnic meadow, attic bedroom, treehouse), warm firelight / lantern-glow / golden-hour / moonlit-window practical lighting, storybook warmth — NOT LBP burlap-with-zipper (that is Sackboy) NOT real animal NOT CGI NOT illustration',
    dollhouse_figures:
      'dollhouse-scale miniature figurines in a fully-appointed handcrafted miniature interior — flocked plush-creature small-animals, tiny cloth outfits, wooden furniture / tiny dishware / mini books / hand-sewn drapes / miniature appliances at scale, warm window-glow or lamp-glow practical lighting, cozy wholesome daily-life energy — NOT real human NOT real animal NOT CGI NOT illustration',
  },

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  // Per-medium prompt prefix override — toy-photography prefix for plush_fabric
  // and dollhouse_figures so the final Flux prompt opens with toy-photography
  // language instead of cuddlebot's "stylized cute cuddly" prefix.
  promptPrefixByMedium: {
    plush_fabric: blocks.TOY_PHOTO_PROMPT_PREFIX,
    dollhouse_figures: blocks.TOY_PHOTO_PROMPT_PREFIX,
  },
  promptSuffixByMedium: {
    plush_fabric: blocks.TOY_PHOTO_PROMPT_SUFFIX,
    dollhouse_figures: blocks.TOY_PHOTO_PROMPT_SUFFIX,
  },

  // Cute-forward vibes. BANNED: dark, fierce, macabre, nightshade, psychedelic,
  // ancient, epic, voltage, arcane.
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
    'cottage-core',
    'cuddly-aquatic',
    'jungle-canopy',
    'snowy-arctic',
    'night-meadow',
    'aquatic-village',
    'jungle-village',
    'arctic-village',
    'twilight-village',
    'sunny-pair',
    'sunny-village',
    'cozy-interior',
    'dollhouse-life',
  ],

  useModelPicker: true,
  allowedModels: ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],

  // All 22 paths roll equally (~4.5% each). Architecture is a 2-axis
  // matrix: 6 outdoor biomes (cottagecore, sunny, aquatic, jungle, arctic,
  // twilight) × 2 modes (creature-pair + cozy-village) plus 10 non-matrix
  // paths (biome-agnostic + interior-moment + temperate-action +
  // cozy-interior space).
  pathWeights: {
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
    'cottage-core': 1,
    'cuddly-aquatic': 1,
    'jungle-canopy': 1,
    'snowy-arctic': 1,
    'night-meadow': 1,
    'aquatic-village': 1,
    'jungle-village': 1,
    'arctic-village': 1,
    'twilight-village': 1,
    'sunny-pair': 1,
    'sunny-village': 1,
    'cozy-interior': 1,
    'dollhouse-life': 1,
  },

  // Chaos layer — light touch for cute bots. Subject chaos OFF for
  // creature-centric paths (don't distort the cute silhouette). All
  // village + scenery + storybook + cozy-interior paths get subject-chaos.
  chaos: {
    enabled: true,
    skipPaths: [],
    allowSubjectChaosPaths: ['cozy-landscape', 'rainy-day-cozy', 'storybook-page', 'cottage-core', 'night-meadow', 'aquatic-village', 'jungle-village', 'arctic-village', 'twilight-village', 'sunny-village', 'cozy-interior'],
  },

  // Two-pass Sonnet→Haiku polish.
  twoPassPolish: {
    enabled: true,
    conceptWords: 150,
    polishedWords: '65-90',
    preservePhrasesByPath: {},
  },

  // Sensory anchors — 2 contexts × 7 channels × 100 entries.
  // Lightcolor required (forces specific cozy palette every render).
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
      'heartwarming-scene': 'scene',
      'cozy-landscape': 'scene',
      'rainy-day-cozy': 'scene',
      'storybook-page': 'scene',
      'cottage-core': 'scene',
      'cuddly-aquatic': 'creature',
      'jungle-canopy': 'creature',
      'snowy-arctic': 'creature',
      'night-meadow': 'scene',
      'aquatic-village': 'scene',
      'jungle-village': 'scene',
      'arctic-village': 'scene',
      'twilight-village': 'scene',
      'sunny-pair': 'creature',
      'sunny-village': 'scene',
      'cozy-interior': 'scene',
      'dollhouse-life': 'creature',
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
    if (!builder) throw new Error(`CuddleBot: unknown path "${path}"`);
    return builder({ sharedDNA, vibeDirective, vibeKey, picker });
  },

  caption({ path }) {
    return `[${path}] CuddleBot`;
  },
};
