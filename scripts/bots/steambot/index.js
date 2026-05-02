/**
 * SteamBot — the bot-engine contract.
 *
 * Breathtaking steampunk worlds — brass + copper + clockwork + Victorian-
 * industrial. BioShock-Infinite / Mortal-Engines / Hugo / Howl energy.
 * Obsessive gear/rivet/steam-wisp detail. Characters by role.
 */

const pools = require('./pools');
const blocks = require('./shared-blocks');

const pathBuilders = {
  'steampunk-scene': require('./paths/steampunk-scene'),
  'steampunk-landscape': require('./paths/steampunk-landscape'),
  contraption: require('./paths/contraption'),
  'airship-skies': require('./paths/airship-skies'),
  'cozy-steampunk': require('./paths/cozy-steampunk'),
  'sexy-steampunk-woman': require('./paths/sexy-steampunk-woman'),
  'steampunk-man': require('./paths/steampunk-man'),
  'steampunk-hybrid': require('./paths/steampunk-hybrid'),
  'steampunk-spectacle': require('./paths/steampunk-spectacle'),
  'steam-transport': require('./paths/steam-transport'),
};

module.exports = {
  username: 'steambot',
  displayName: 'SteamBot',

  mediums: ['canvas', 'illustration', 'render', 'watercolor'],

  // Restrict steampunk-man to masculine-tilted vibes — drop coquette (pastel-pretty),
  // shimmer (soft sparkle), peaceful (too soft), whimsical (cute) which push toward
  // feminine/pretty rendering. Keep dark/epic/cinematic/fierce/ancient/nightshade/voltage.
  vibesByPath: {
    'steampunk-man': ['cinematic', 'dark', 'epic', 'nostalgic', 'arcane', 'ancient', 'fierce', 'voltage', 'nightshade', 'macabre', 'surreal'],
  },

  modelByPath: {
    'steampunk-scene': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    'steampunk-landscape': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    contraption: ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    'airship-skies': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    'cozy-steampunk': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    'sexy-steampunk-woman': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    'steampunk-man': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    'steampunk-hybrid': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    'steampunk-spectacle': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    'steam-transport': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
  },

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  // steampunk-man path — minimal prefix override: just "diverse" + "specific"
  // to bias Flux off the default "handsome white European craftsman" trope.
  // No English meta-instructions (those waste early-token budget without
  // adding visual signal). Identity tokens get to land early via Sonnet.
  promptPrefixByPath: {
    'steampunk-man':
      'diverse cast steampunk character study, distinctive identity-anchored portrait, specific ethnicity and features rendered exactly',
  },
  promptSuffixByPath: {
    'steampunk-man':
      'no text no words no watermarks, hyper detailed, masterpiece quality, render the EXACT skin tone and ethnicity, render the EXACT hair color, render the EXACT facial hair style — NOT a generic white European stubbled craftsman, NOT centered hand-on-hip stance, NOT runway model strut',
  },

  // Inverts old excludeVibes (minimal/psychedelic/cozy).
  vibes: [
    'cinematic',
    'dark',
    'epic',
    'nostalgic',
    'peaceful',
    'whimsical',
    'ethereal',
    'arcane',
    'ancient',
    'enchanted',
    'fierce',
    'coquette',
    'voltage',
    'nightshade',
    'macabre',
    'shimmer',
    'surreal',
  ],

  paths: [
    'steampunk-scene',
    'steampunk-landscape',
    'contraption',
    'airship-skies',
    'cozy-steampunk',
    'sexy-steampunk-woman',
    'steampunk-man',
    'steampunk-hybrid',
    'steampunk-spectacle',
    'steam-transport',
  ],

  pathWeights: {
    'steampunk-scene': 2,
    'steampunk-landscape': 2,
    contraption: 1,
    'airship-skies': 2,
    'cozy-steampunk': 2,
    'sexy-steampunk-woman': 2,
    'steampunk-man': 2,
    'steampunk-hybrid': 2,
    'steampunk-spectacle': 1,
    'steam-transport': 2,
  },

  chaos: { enabled: true, skipPaths: [], allowSubjectChaosPaths: ['steampunk-scene','steampunk-landscape','contraption','airship-skies','cozy-steampunk','steampunk-hybrid','steampunk-spectacle','steam-transport'] },
  twoPassPolish: {
    enabled: true,
    conceptWords: 150,
    polishedWords: '65-90',
    polishedWordsByPath: { 'sexy-steampunk-woman': '80-110', 'steampunk-man': '80-110' },
    preservePhrasesByPath: {
      // Force Haiku to preserve identity-anchor tokens so they don't get
      // compressed away — Flux otherwise defaults to "handsome white
      // European stubbled craftsman" for every render.
      'steampunk-man': [
        'Black', 'Mahogany', 'Sepia', 'Persian', 'Indian', 'Asian', 'Mediterranean', 'Greek', 'Italian', 'Egyptian', 'Moroccan', 'Caribbean',
        'man with', 'eyes',
        'mustache', 'beard', 'clean-shaven', 'mutton chops', 'handlebar', 'Van Dyke', 'goatee',
        'salt-and-pepper', 'silver', 'iron-grey', 'auburn', 'sandy-blond', 'pomaded', 'shaved', 'queue',
        'amber', 'olive-green', 'ice-blue', 'steel-grey', 'pewter',
      ],
    },
  },
  sensoryAnchors: {
    enabled: true,
    requiredChannels: ['lightcolor'],
    pathContext: {
      'sexy-steampunk-woman': 'female',
      'steampunk-man': 'male',
      'steampunk-scene': 'scene', 'steampunk-landscape': 'scene', contraption: 'scene',
      'airship-skies': 'scene', 'cozy-steampunk': 'scene', 'steampunk-hybrid': 'scene',
      'steampunk-spectacle': 'scene', 'steam-transport': 'scene',
    },
    poolsByContextAndChannel: pools.SENSORY_POOLS,
  },

  rollSharedDNA({ vibeKey, picker }) {
    return {
      scenePalette: picker.pickWithRecency(pools.SCENE_PALETTES, 'scene_palette'),
      colorPalette: pools.VIBE_COLOR[vibeKey] || pools.VIBE_COLOR.cinematic,
    };
  },

  buildBrief({ path, sharedDNA, vibeDirective, vibeKey, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`SteamBot: unknown path "${path}"`);
    return builder({ sharedDNA, vibeDirective, vibeKey, picker });
  },

  caption({ path }) {
    return `[${path}] SteamBot`;
  },
};
