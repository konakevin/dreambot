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
const { REGION_KEYS_GENERAL, regionRosterPrompt } = require('./species-roster');

const pathBuilders = {
  // 2026-05-16: landscape migration attempted + REVERTED — legacy compose.js
  // outperformed the new declarative archetype. Declarative version preserved
  // at paths/landscape.js for reference, legacy stays canonical.
  landscape: require('./paths/legacy/landscape'),
  closeup: require('./paths/closeup'),
  cozy: require('./paths/legacy/cozy'),
  'garden-walk': require('./paths/garden-walk'),
  dreamscape: require('./paths/legacy/dreamscape'),
  conservatory: require('./paths/conservatory'),
  'tropical-paradise': require('./paths/tropical-paradise'),
  'city-flowers': require('./paths/city-flowers'),
  'flower-tunnels': require('./paths/flower-tunnels'),
  reclaim: require('./paths/reclaim'),
  'bloom-spirit': require('./paths/bloom-spirit'),
};

module.exports = {
  username: 'bloombot',
  displayName: 'BloomBot',

  mediums: ['bloom_hyperreal_cgi'],

  mediumByPath: {
    // bloom-spirit is the only path with a bespoke painterly-anime medium —
    // all other paths use bloom_hyperreal_cgi via the bot-wide mediums list.
    'bloom-spirit': 'bloom_painterly_spirit',
  },

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
    'flower-tunnels': { 'black-forest-labs/flux-1.1-pro': 100 },
    reclaim: { 'black-forest-labs/flux-1.1-pro': 100 },
    'bloom-spirit': { 'black-forest-labs/flux-1.1-pro': 100 },
  },

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  // Per-medium overrides — bloom-spirit uses anime register, not the
  // photoreal-CGI prefix/suffix that drives the other 9 paths.
  promptPrefixByMedium: {
    bloom_painterly_spirit:
      'soft oil-painting detailed fantasy illustration, Pre-Raphaelite oil painting register, Waterhouse Rossetti Mucha Parrish lineage, romantic-fantasy book-cover illustration, beautiful young woman painted portrait with rich oil-on-canvas texture, soft luminous painted glow, romantic ethereal painterly brushwork',
  },
  promptSuffixByMedium: {
    bloom_painterly_spirit:
      'classical romantic oil-painting register, Pre-Raphaelite painted illustration, soft luminous painterly brushwork preserving petal-and-fabric detail, romantic ethereal painted glow, NOT photoreal NOT photograph NOT realistic 3D NOT CGI NOT cartoon NOT anime NOT Disney — classical oil painting / detailed fantasy illustration, no text, no words, no watermarks',
  },

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
    'flower-tunnels',
    'reclaim',
    'bloom-spirit',
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
    'flower-tunnels': 2,
    reclaim: 1,
    'bloom-spirit': 2,
  },

  chaos: {
    enabled: true,
    skipPaths: [],
    allowSubjectChaosPaths: [
      'landscape', 'cozy', 'garden-walk', 'dreamscape',
      'conservatory', 'tropical-paradise', 'city-flowers', 'flower-tunnels', 'reclaim',
      'bloom-spirit',
    ],
  },

  twoPassPolish: {
    enabled: true,
    conceptWords: 150,
    polishedWords: '70-100',
    polishedWordsByPath: {
      closeup: '85-115',
    },
    // Per playbook (2026-05-15 + 2026-05-16): two-pass polish OFF for all
    // declarative axis-system paths. Single-pass Sonnet preserves slot-pool
    // richness; Haiku compression drops bespoke vocabulary to hit word count.
    skipPaths: ['landscape', 'closeup', 'tropical-paradise', 'cozy', 'garden-walk', 'dreamscape', 'conservatory', 'city-flowers', 'flower-tunnels', 'reclaim', 'bloom-spirit'],
  },

  sensoryAnchors: {
    enabled: true,
    requiredChannels: ['lightcolor'],
    pathContext: {
      landscape: 'scene', closeup: 'scene', cozy: 'scene',
      'garden-walk': 'scene', dreamscape: 'scene',
      conservatory: 'scene', 'tropical-paradise': 'scene',
      'city-flowers': 'scene', 'flower-tunnels': 'scene', reclaim: 'scene',
      'bloom-spirit': 'scene',
    },
    poolsByContextAndChannel: pools.SENSORY_POOLS,
  },

  // Bot-level pool defaults for declarative axis paths. Lighting + palette
  // also live on sharedDNA (rolled once per render in rollSharedDNA); these
  // entries exist for the brief-composer's bot-slot resolution path.
  defaultPools: {
    lighting: 'LIGHTING',
    palette: 'PALETTES',
  },

  poolByName(name) {
    if (!(name in pools)) {
      throw new Error(`BloomBot.poolByName: unknown pool "${name}"`);
    }
    return pools[name];
  },

  rollSharedDNA({ path, picker }) {
    // tropical-paradise locks region to 'tropical'; all other paths roll
    // from the general region rotation. Migration-in-progress: legacy paths
    // also read sharedDNA.region via compose.js, so this keeps both shapes
    // working.
    const region = path === 'tropical-paradise'
      ? 'tropical'
      : picker.pickWithRecency(REGION_KEYS_GENERAL, 'region');
    return {
      palette: picker.pickWithRecency(pools.PALETTES, 'palette'),
      lighting: picker.pickWithRecency(pools.LIGHTING, 'lighting'),
      region,
      roster: regionRosterPrompt(region),
    };
  },

  buildBrief({ path, sharedDNA, vibeDirective, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`BloomBot: unknown path "${path}"`);
    // Declarative axis-system paths export an object { archetype, pools }.
    // Legacy compositional paths export a function. Dispatch on shape.
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
      return builder({ sharedDNA, vibeDirective, picker });
    }
    throw new Error(`BloomBot: path "${path}" has invalid export shape`);
  },

  caption({ path }) {
    return `[${path}] BloomBot`;
  },
};
