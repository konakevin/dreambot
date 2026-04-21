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
};

module.exports = {
  username: 'steambot',
  displayName: 'SteamBot',

  mediums: ['canvas', 'photography', 'illustration'],

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
  ],

  pathWeights: {
    'steampunk-scene': 2,
    'steampunk-landscape': 2,
    contraption: 1,
    'airship-skies': 2,
    'cozy-steampunk': 2,
    'sexy-steampunk-woman': 2,
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
