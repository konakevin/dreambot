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

  // Landscape is flagship (3x weight). Cozy-arcane, fantasy-scene, dragon-scene at 2x.
  pathWeights: {
    landscape: 3,
    'fantasy-scene': 2,
    'epic-moment': 1,
    'dragon-scene': 2,
    'magic-moment': 1,
    'cozy-arcane': 2,
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
