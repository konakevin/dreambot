/**
 * CoquetteBot — the bot-engine contract.
 *
 * Soft pink pastel everything. Cottagecore / princess / fairy / ballet /
 * Parisian-pastry energy. Adult-feminine-pastel (vs CuddleBot's kid-cute).
 * Mixed: 4 scene-centric paths + 1 fashion (solo human) + 1 couture (varied).
 * No male figures, no dark, no gritty.
 */

const pools = require('./pools');
const blocks = require('./shared-blocks');

const pathBuilders = {
  'adorable-creatures': require('./paths/adorable-creatures'),
  'cottagecore-scene': require('./paths/cottagecore-scene'),
  'pink-nature': require('./paths/pink-nature'),
  'sweet-treats': require('./paths/sweet-treats'),
  'coquette-fashion': require('./paths/coquette-fashion'),
  'adorable-couture': require('./paths/adorable-couture'),
};

module.exports = {
  username: 'coquettebot',
  displayName: 'CoquetteBot',

  mediums: ['fairytale', 'watercolor', 'canvas', 'pencil', 'photography'],

  // Fairytale medium heavily favored coquette/enchanted/whimsical/shimmer
  // (preserves old pinVibes pattern for fairytale)
  vibesByMedium: {
    fairytale: ['coquette', 'coquette', 'coquette', 'enchanted', 'whimsical', 'shimmer'],
  },

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  // Inverts old excludeVibes (dark/fierce/psychedelic/ancient/epic/macabre).
  // Nightshade kept but should render soft-only.
  vibes: [
    'cinematic',
    'cozy',
    'nostalgic',
    'peaceful',
    'whimsical',
    'ethereal',
    'arcane',
    'enchanted',
    'coquette',
    'voltage',
    'nightshade',
    'shimmer',
    'surreal',
  ],

  paths: [
    'adorable-creatures',
    'cottagecore-scene',
    'pink-nature',
    'sweet-treats',
    'coquette-fashion',
    'adorable-couture',
  ],

  // Heavier weights on bread-and-butter: cottagecore + pink-nature + adorable-creatures.
  // Sweet-treats + fashion + couture balance roster.
  pathWeights: {
    'adorable-creatures': 2,
    'cottagecore-scene': 2,
    'pink-nature': 2,
    'sweet-treats': 1,
    'coquette-fashion': 1,
    'adorable-couture': 1,
  },

  rollSharedDNA({ vibeKey, picker }) {
    return {
      scenePalette: picker.pickWithRecency(pools.SCENE_PALETTES, 'scene_palette'),
      colorPalette: pools.VIBE_COLOR[vibeKey] || pools.VIBE_COLOR.coquette,
    };
  },

  buildBrief({ path, sharedDNA, vibeDirective, vibeKey, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`CoquetteBot: unknown path "${path}"`);
    return builder({ sharedDNA, vibeDirective, vibeKey, picker });
  },

  caption({ path }) {
    return `[${path}] CoquetteBot`;
  },
};
