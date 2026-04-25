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
  ],

  // dragon-scene + landscape co-flagship at 20% each (4/20). Other 4 paths evenly split the remaining 60% at 15% each (3/20).
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
