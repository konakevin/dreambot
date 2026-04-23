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
  'magic-moment': require('./paths/magic-moment'),
  'cozy-arcane': require('./paths/cozy-arcane'),
};

module.exports = {
  username: 'dragonbot',
  displayName: 'DragonBot',

  mediums: ['canvas', 'watercolor', 'illustration', 'pencil'],

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  // Inverts old excludeVibes (minimal/dark).
  vibes: [
    'cinematic',
    'cozy',
    'epic',
    'nostalgic',
    'psychedelic',
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
    'landscape',
    'fantasy-scene',
    'epic-moment',
    'dragon-scene',
    'magic-moment',
    'cozy-arcane',
  ],

  // dragon-scene + landscape co-flagship at 20% each (4/20). Other 4 paths evenly split the remaining 60% at 15% each (3/20).
  pathWeights: {
    landscape: 4,
    'fantasy-scene': 3,
    'epic-moment': 3,
    'dragon-scene': 4,
    'magic-moment': 3,
    'cozy-arcane': 3,
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
