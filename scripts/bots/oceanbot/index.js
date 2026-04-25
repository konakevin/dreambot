/**
 * OceanBot — the bot-engine contract.
 *
 * The full ocean experience — underwater wonder, surface drama, maritime myth,
 * deep sea horror, coastal beauty, big waves, tropical paradise.
 * NatGeo × ancient mariner × Moby Dick.
 */

const pools = require('./pools');
const blocks = require('./shared-blocks');

const pathBuilders = {
  'reef-life': require('./paths/reef-life'),
  'sea-creatures': require('./paths/sea-creatures'),
  'deep-wonder': require('./paths/deep-wonder'),
  'deep-horror': require('./paths/deep-horror'),
  'storm-surface': require('./paths/storm-surface'),
  'ghost-ship': require('./paths/ghost-ship'),
  'kraken-leviathan': require('./paths/kraken-leviathan'),
  'shipwreck-kingdom': require('./paths/shipwreck-kingdom'),
  'polar-seas': require('./paths/polar-seas'),
  'coastal-cliffs': require('./paths/coastal-cliffs'),
  'calm-glass-sea': require('./paths/calm-glass-sea'),
  'big-wave': require('./paths/big-wave'),
  'coastal-golden': require('./paths/coastal-golden'),
  'tropical-paradise': require('./paths/tropical-paradise'),
};

module.exports = {
  username: 'oceanbot',
  displayName: 'OceanBot',

  mediums: ['photography', 'canvas', 'watercolor', 'oil_painting', 'illustration', 'pencil'],

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  useModelPicker: true,
  allowedModels: ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],

  vibes: [
    'cinematic',
    'dark',
    'cozy',
    'epic',
    'nostalgic',
    'peaceful',
    'ethereal',
    'ancient',
    'enchanted',
    'fierce',
    'voltage',
    'nightshade',
    'shimmer',
    'surreal',
  ],

  paths: [
    'reef-life',
    'sea-creatures',
    'deep-wonder',
    'deep-horror',
    'storm-surface',
    'ghost-ship',
    'kraken-leviathan',
    'shipwreck-kingdom',
    'polar-seas',
    'coastal-cliffs',
    'calm-glass-sea',
    'big-wave',
    'coastal-golden',
    'tropical-paradise',
  ],

  pathWeights: {
    'reef-life': 1,
    'sea-creatures': 1,
    'deep-wonder': 1,
    'deep-horror': 1,
    'storm-surface': 1,
    'ghost-ship': 1,
    'kraken-leviathan': 1,
    'shipwreck-kingdom': 1,
    'polar-seas': 1,
    'coastal-cliffs': 1,
    'calm-glass-sea': 1,
    'big-wave': 1,
    'coastal-golden': 1,
    'tropical-paradise': 1,
  },

  rollSharedDNA({ vibeKey, picker }) {
    return {
      scenePalette: picker.pickWithRecency(pools.SCENE_PALETTES, 'scene_palette'),
      colorPalette: pools.VIBE_COLOR[vibeKey] || pools.VIBE_COLOR.cinematic,
    };
  },

  buildBrief({ path, sharedDNA, vibeDirective, vibeKey, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`OceanBot: unknown path "${path}"`);
    return builder({ sharedDNA, vibeDirective, vibeKey, picker });
  },

  caption({ path }) {
    return `[${path}] OceanBot`;
  },
};
