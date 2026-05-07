/**
 * BloomBot — full rewrite 2026-05-06 (branch: bloombot-from-scratch).
 *
 * Compositional architecture, not big-pool architecture:
 *   palette (40 hand-authored)  + region (10 rotation, flora roster)
 *   + lighting (30 hand-authored) + per-path scene (hardcoded in builder)
 *   = the brief's color/species/light/scene DNA.
 *
 * Locked: medium = bloom_hyperreal_cgi (the "turtle" aesthetic),
 *         vibe   = cinematic only,
 *         model  = flux-1.1-pro only.
 *
 * Why locked: prior version's vibe rotation, medium overrides, and big
 * pool generators were the drift surfaces. Removing them.
 *
 * Adding a path: drop a builder in paths/, add to pathBuilders + paths +
 * pathWeights + sensoryAnchors.pathContext.
 */

const pools = require('./pools');
const blocks = require('./shared-blocks');

const pathBuilders = {
  landscape: require('./paths/landscape'),
  closeup: require('./paths/closeup'),
  cozy: require('./paths/cozy'),
  'garden-walk': require('./paths/garden-walk'),
  dreamscape: require('./paths/dreamscape'),
  conservatory: require('./paths/conservatory'),
  'tropical-paradise': require('./paths/tropical-paradise'),
  'city-flowers': require('./paths/city-flowers'),
  reclaim: require('./paths/reclaim'),
};

module.exports = {
  username: 'bloombot',
  displayName: 'BloomBot',

  mediums: ['bloom_hyperreal_cgi'],

  useModelPicker: true,
  allowedModels: ['black-forest-labs/flux-1.1-pro'],
  modelByPath: {
    landscape: { 'black-forest-labs/flux-1.1-pro': 100 },
    closeup: { 'black-forest-labs/flux-1.1-pro': 100 },
    cozy: { 'black-forest-labs/flux-1.1-pro': 100 },
    'garden-walk': { 'black-forest-labs/flux-1.1-pro': 100 },
    dreamscape: { 'black-forest-labs/flux-1.1-pro': 100 },
    conservatory: { 'black-forest-labs/flux-1.1-pro': 100 },
    'tropical-paradise': { 'black-forest-labs/flux-1.1-pro': 100 },
    'city-flowers': { 'black-forest-labs/flux-1.1-pro': 100 },
    reclaim: { 'black-forest-labs/flux-1.1-pro': 100 },
  },

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  vibes: ['cinematic'],

  paths: [
    'landscape',
    'closeup',
    'cozy',
    'garden-walk',
    'dreamscape',
    'conservatory',
    'tropical-paradise',
    'city-flowers',
    'reclaim',
  ],

  pathWeights: {
    landscape: 2,
    closeup: 1,
    cozy: 1,
    'garden-walk': 2,
    dreamscape: 1,
    conservatory: 2,
    'tropical-paradise': 2,
    'city-flowers': 1,
    reclaim: 1,
  },

  chaos: {
    enabled: true,
    skipPaths: [],
    allowSubjectChaosPaths: [
      'landscape', 'cozy', 'garden-walk', 'dreamscape',
      'conservatory', 'tropical-paradise', 'city-flowers', 'reclaim',
    ],
  },

  twoPassPolish: {
    enabled: true,
    conceptWords: 150,
    polishedWords: '70-100',
    polishedWordsByPath: {
      closeup: '85-115',
    },
  },

  sensoryAnchors: {
    enabled: true,
    requiredChannels: ['lightcolor'],
    pathContext: {
      landscape: 'scene', closeup: 'scene', cozy: 'scene',
      'garden-walk': 'scene', dreamscape: 'scene',
      conservatory: 'scene', 'tropical-paradise': 'scene',
      'city-flowers': 'scene', reclaim: 'scene',
    },
    poolsByContextAndChannel: pools.SENSORY_POOLS,
  },

  rollSharedDNA({ picker }) {
    return {
      palette: picker.pickWithRecency(pools.PALETTES, 'palette'),
      lighting: picker.pickWithRecency(pools.LIGHTING, 'lighting'),
    };
  },

  buildBrief({ path, sharedDNA, vibeDirective, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`BloomBot: unknown path "${path}"`);
    return builder({ sharedDNA, vibeDirective, picker });
  },

  caption({ path }) {
    return `[${path}] BloomBot`;
  },
};
