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
  'steampunk-hybrid': require('./paths/steampunk-hybrid'),
  'steampunk-spectacle': require('./paths/steampunk-spectacle'),
  'steam-transport': require('./paths/steam-transport'),
};

module.exports = {
  username: 'steambot',
  displayName: 'SteamBot',

  mediums: ['canvas', 'illustration', 'render', 'watercolor'],

  modelByPath: {
    'steampunk-scene': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    'steampunk-landscape': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    contraption: ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    'airship-skies': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    'cozy-steampunk': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    'sexy-steampunk-woman': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    'steampunk-hybrid': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    'steampunk-spectacle': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
    'steam-transport': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
  },

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

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
    'steampunk-hybrid': 2,
    'steampunk-spectacle': 1,
    'steam-transport': 2,
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
