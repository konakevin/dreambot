/**
 * DragonBot — the bot-engine contract.
 *
 * High-fantasy magical worlds + landscapes + arcane + characters.
 * LOTR/GoT/Harry-Potter/Elden-Ring/Witcher/Warhammer-concept-art energy.
 * Landscape is FLAGSHIP. Mixed scene/character. Characters by role only.
 */

const pools = require('./pools');
const blocks = require('./shared-blocks');

const pathBuilders = {
  landscape: require('./paths/landscape'),
  'fantasy-scene': require('./paths/fantasy-scene'),
  'epic-moment': require('./paths/epic-moment'),
  'dragon-scene': require('./paths/dragon-scene'),
  'female-warrior': require('./paths/female-warrior'),
  'male-warrior': require('./paths/male-warrior'),
  'cozy-arcane': require('./paths/cozy-arcane'),
  'arcane-halls': require('./paths/arcane-halls'),
  'dark-realm': require('./paths/dark-realm'),
  'dragon-lore': require('./paths/dragon-lore'),
  'wow-landscape': require('./paths/wow-landscape'),
  'wow-architecture': require('./paths/wow-architecture'),
  'lotr-landscape': require('./paths/lotr-landscape'),
  'lotr-architecture': require('./paths/lotr-architecture'),
  'eldenring-landscape': require('./paths/eldenring-landscape'),
  'eldenring-architecture': require('./paths/eldenring-architecture'),
  'got-landscape': require('./paths/got-landscape'),
  'got-architecture': require('./paths/got-architecture'),
};

module.exports = {
  username: 'dragonbot',
  displayName: 'DragonBot',

  mediums: ['canvas', 'watercolor', 'illustration', 'render'],


  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  useModelPicker: true,
  allowedModels: ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],

  // Inverts old excludeVibes (minimal/dark).
  vibes: [
    'cinematic',
    'dark',
    'cozy',
    'epic',
    'nostalgic',
    'peaceful',
    'whimsical',
    'ethereal',
    'minimal',
    'arcane',
    'ancient',
    'enchanted',
    'fierce',
    'voltage',
    'nightshade',
    'macabre',
    'shimmer',
    'surreal',
  ],

  paths: [
    'landscape',
    'fantasy-scene',
    'epic-moment',
    'dragon-scene',
    'female-warrior',
    'male-warrior',
    'cozy-arcane',
    'arcane-halls',
    'dark-realm',
    'dragon-lore',
    'wow-landscape',
    // 'wow-architecture' — scrapped 2026-05-02 (Kevin)
    'lotr-landscape',
    'lotr-architecture',
    // 'eldenring-landscape' — scrapped 2026-05-02 (Kevin)
    // 'eldenring-architecture' — scrapped 2026-05-02 (Kevin)
    'got-landscape',
    'got-architecture',
  ],

  // dragon-scene + landscape co-flagship; warriors heavy; new wow paths weight 4 each.
  pathWeights: {
    landscape: 5,
    'fantasy-scene': 3,
    'epic-moment': 3,
    'dragon-scene': 4,
    'female-warrior': 5,
    'male-warrior': 4,
    'cozy-arcane': 3,
    'arcane-halls': 3,
    'dark-realm': 4,
    'dragon-lore': 4,
    'wow-landscape': 4,
    // 'wow-architecture': 4,  // scrapped
    'lotr-landscape': 4,
    'lotr-architecture': 4,
    // 'eldenring-landscape': 4,  // scrapped
    // 'eldenring-architecture': 4,  // scrapped
    'got-landscape': 4,
    'got-architecture': 4,
  },

  // Chaos layer (V4 perception-distortion port). Skip face-dominant character
  // closeups (none here — both warrior paths are full-body). Allow subject
  // chaos on scenery + dragon paths so silhouette/echo distortions can fire.
  chaos: {
    enabled: true,
    skipPaths: [],
    allowSubjectChaosPaths: [
      'landscape',
      'fantasy-scene',
      'epic-moment',
      'dragon-scene',
      'cozy-arcane',
      'arcane-halls',
      'dark-realm',
      'dragon-lore',
      'wow-landscape',
      'wow-architecture',
      'lotr-landscape', 'lotr-architecture',
      'eldenring-landscape', 'eldenring-architecture',
      'got-landscape', 'got-architecture',
    ],
  },

  // Two-pass Sonnet→Haiku polish.
  twoPassPolish: {
    enabled: true,
    conceptWords: 150,
    polishedWords: '65-90',
    polishedWordsByPath: {
      'female-warrior': '80-110',
      'male-warrior': '80-110',
      'dragon-scene': '80-110',
    },
    preservePhrasesByPath: {},
  },

  // Sensory anchors — 4 contexts × 7 channels × 100 entries each.
  // Lightcolor required on every render (forces specific punchy lighting
  // palettes instead of Sonnet defaulting to safe warm-amber).
  sensoryAnchors: {
    enabled: true,
    requiredChannels: ['lightcolor'],
    pathContext: {
      'female-warrior': 'female',
      'male-warrior': 'male',
      'dragon-scene': 'creature',
      'landscape': 'scene',
      'fantasy-scene': 'scene',
      'epic-moment': 'scene',
      'cozy-arcane': 'scene',
      'arcane-halls': 'scene',
      'dark-realm': 'scene',
      'dragon-lore': 'scene',
      'wow-landscape': 'scene',
      'wow-architecture': 'scene',
      'lotr-landscape': 'scene',
      'lotr-architecture': 'scene',
      'eldenring-landscape': 'scene',
      'eldenring-architecture': 'scene',
      'got-landscape': 'scene',
      'got-architecture': 'scene',
    },
    poolsByContextAndChannel: pools.SENSORY_POOLS,
  },

  rollSharedDNA({ vibeKey, picker }) {
    return {
      scenePalette: picker.pickWithRecency(pools.SCENE_PALETTES, 'scene_palette'),
      colorPalette: pools.VIBE_COLOR[vibeKey] || pools.VIBE_COLOR.epic,
    };
  },

  buildBrief({ path, sharedDNA, vibeDirective, vibeKey, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`DragonBot: unknown path "${path}"`);
    return builder({ sharedDNA, vibeDirective, vibeKey, picker });
  },

  caption({ path }) {
    return `[${path}] DragonBot`;
  },
};
