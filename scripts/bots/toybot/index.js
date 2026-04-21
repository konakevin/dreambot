/**
 * ToyBot — the bot-engine contract.
 *
 * Every render is CINEMATIC toy-world storytelling. Action-packed movie-stills.
 * Each path pegged to specific toy medium via mediumByPath. Bot-only mediums
 * `stitched` and `action-figure` (NOT in public dream_mediums table — same
 * pattern as VenusBot's `surreal`).
 */

const pools = require('./pools');
const blocks = require('./shared-blocks');

const pathBuilders = {
  'lego-epic': require('./paths/lego-epic'),
  claymation: require('./paths/claymation'),
  vinyl: require('./paths/vinyl'),
  'action-figure': require('./paths/action-figure'),
  sackboy: require('./paths/sackboy'),
  'toy-landscape': require('./paths/toy-landscape'),
};

module.exports = {
  username: 'toybot',
  displayName: 'ToyBot',

  // mediumByPath — each path locks to its medium (heavy use)
  // `stitched` + `action-figure` are bot-only mediums
  mediumByPath: {
    'lego-epic': 'lego',
    claymation: 'claymation',
    vinyl: 'vinyl',
    'action-figure': 'action-figure',
    sackboy: 'stitched',
    'toy-landscape': ['lego', 'lego', 'lego', 'claymation', 'vinyl'],
  },

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  // Inverts old excludeVibes (dark/fierce/psychedelic/macabre).
  vibes: [
    'cinematic',
    'cozy',
    'epic',
    'nostalgic',
    'peaceful',
    'whimsical',
    'ethereal',
    'arcane',
    'ancient',
    'enchanted',
    'coquette',
    'voltage',
    'nightshade',
    'shimmer',
    'surreal',
  ],

  paths: ['lego-epic', 'claymation', 'vinyl', 'action-figure', 'sackboy', 'toy-landscape'],

  pathWeights: {
    'lego-epic': 2,
    claymation: 1,
    vinyl: 1,
    'action-figure': 1,
    sackboy: 1,
    'toy-landscape': 2,
  },

  rollSharedDNA({ vibeKey, picker }) {
    return {
      scenePalette: picker.pickWithRecency(pools.SCENE_PALETTES, 'scene_palette'),
      colorPalette: pools.VIBE_COLOR[vibeKey] || pools.VIBE_COLOR.cinematic,
    };
  },

  buildBrief({ path, sharedDNA, vibeDirective, vibeKey, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`ToyBot: unknown path "${path}"`);
    return builder({ sharedDNA, vibeDirective, vibeKey, picker });
  },

  caption({ path }) {
    return `[${path}] ToyBot`;
  },
};
