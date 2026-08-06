/**
 * TinyBot — the bot-engine contract.
 *
 * Clever + cute + "WHOA look at THAT" miniature magic. Tilt-shift / macro /
 * dollhouse obsessive-detail. Scene-centric.
 */

const pools = require('./pools');
const blocks = require('./shared-blocks');

const pathBuilders = {
  diorama: require('./paths/diorama'),
  'miniature-landscape': require('./paths/miniature-landscape'),
  'macro-nature': require('./paths/macro-nature'),
  'miniature-urban': require('./paths/miniature-urban'),
  'tiny-cozy': require('./paths/tiny-cozy'),
  'contained-worlds': require('./paths/contained-worlds'),
  'micro-fantasy': require('./paths/micro-fantasy'),
  'miniature-industry': require('./paths/miniature-industry'),
  'cottage-village': require('./paths/cottage-village'),
  'mushroom-village': require('./paths/mushroom-village'),
  'pastel-village': require('./paths/pastel-village'),
  'enchanted-village': require('./paths/enchanted-village'),
  'tiny-beach': require('./paths/tiny-beach'),
  'tiny-food-world': require('./paths/tiny-food-world'),
  'tiny-vehicles': require('./paths/tiny-vehicles'),
};

module.exports = {
  username: 'tinybot',
  displayName: 'TinyBot',

  // 'animation' dropped 2026-08-06 (Kevin): its DB flux_fragment is a face-swap
  // CHARACTER medium ("Disney Pixar character … a bearded adult man, rendered
  // large in the foreground") that force-injected a person into scene renders.
  // Monitoring the rest before touching storybook/handcrafted (same failure mode).
  mediums: ['photography', 'claymation', 'storybook', 'handcrafted', 'render'],

  // Banned (2026-06-01 Kevin): flux-2-flex.
  useModelPicker: true,
  allowedModels: ['black-forest-labs/flux-1.1-pro', 'black-forest-labs/flux-1.1-pro-ultra'],

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  // surreal cut 2026-07-03 (off-brand vibe audit) — miniature scale-play is
  // already the bot's premise; dream-logic melt on crafted dioramas reads broken.
  vibes: [
    'cinematic',
    'cozy',
    'nostalgic',
    'peaceful',
    'whimsical',
    'ethereal',
    'ancient',
    'enchanted',
    'shimmer',
    // 'pastel-dream' — VIBE_COLOR registered in pools.js but NOT in DB
    // dream_vibes table. To activate, insert row into dream_vibes first.
  ],

  paths: [
    'diorama',
    'miniature-landscape',
    'macro-nature',
    'miniature-urban',
    'tiny-cozy',
    'contained-worlds',
    'micro-fantasy',
    'miniature-industry',
    'cottage-village',
    'mushroom-village',
    'pastel-village',
    'enchanted-village',
    'tiny-beach',
    'tiny-food-world',
    'tiny-vehicles',
  ],

  // Flat rotation (2026-05-26): equal weight per path — every path posts
  // once per cycle in randomized order via the cycleAllPaths shuffle-bag.
  cycleAllPaths: true,

  chaos: {
    enabled: true,
    skipPaths: [],
    allowSubjectChaosPaths: [
      'diorama',
      'miniature-landscape',
      'macro-nature',
      'miniature-urban',
      'tiny-cozy',
      'contained-worlds',
      'micro-fantasy',
      'miniature-industry',
      'cottage-village',
      'mushroom-village',
      'pastel-village',
      'enchanted-village',
      'tiny-beach',
      'tiny-food-world',
      'tiny-vehicles',
    ],
  },
  twoPassPolish: {
    enabled: true,
    conceptWords: 150,
    polishedWords: '65-90',
    polishedWordsByPath: {},
    preservePhrasesByPath: {},
  },
  sensoryAnchors: {
    enabled: true,
    requiredChannels: ['lightcolor'],
    pathContext: {
      diorama: 'scene',
      'miniature-landscape': 'scene',
      'macro-nature': 'scene',
      'miniature-urban': 'scene',
      'tiny-cozy': 'scene',
      'contained-worlds': 'scene',
      'micro-fantasy': 'scene',
      'miniature-industry': 'scene',
      'cottage-village': 'scene',
      'mushroom-village': 'scene',
      'pastel-village': 'scene',
      'enchanted-village': 'scene',
      'tiny-beach': 'scene',
      'tiny-food-world': 'scene',
      'tiny-vehicles': 'scene',
    },
    poolsByContextAndChannel: pools.SENSORY_POOLS,
  },

  rollSharedDNA({ vibeKey, picker }) {
    return {
      scenePalette: picker.pickWithRecency(pools.SCENE_PALETTES, 'scene_palette'),
      colorPalette: pools.VIBE_COLOR[vibeKey] || pools.VIBE_COLOR.cozy,
      // Variety axes — rolled per render, injected into every path with HARD
      // OVERRIDE language. Pulls renders out of the warm-cozy-twilight default.
      biome: picker.pickWithRecency(pools.BIOME_AXIS, 'biome'),
      weather: picker.pickWithRecency(pools.WEATHER_AXIS, 'weather'),
      lighting: picker.pickWithRecency(pools.LIGHTING_AXIS, 'lighting_axis'),
      energy: picker.pickWithRecency(pools.ENERGY_AXIS, 'energy'),
    };
  },

  buildBrief({ path, sharedDNA, vibeDirective, vibeKey, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`TinyBot: unknown path "${path}"`);
    return builder({ sharedDNA, vibeDirective, vibeKey, picker });
  },

  caption({ path }) {
    return `[${path}] TinyBot`;
  },
};
