/**
 * GlamBot — the bot-engine contract.
 *
 * Editorial fashion / beauty / makeup magazine-cover energy. Met-Gala-meets-AI
 * maximalism. Vogue × Harper's Bazaar × viral TikTok. BOLD / HIGH-FASHION.
 * Opposite lane from CoquetteBot. Character-centric solo, diverse.
 */

const pools = require('./pools');
const blocks = require('./shared-blocks');

const pathBuilders = {
  'makeup-closeup': require('./paths/makeup-closeup'),
  'fashion-moment': require('./paths/fashion-moment'),
  'beauty-portrait': require('./paths/beauty-portrait'),
  'avant-garde': require('./paths/avant-garde'),
  'hair-moment': require('./paths/hair-moment'),
  'nail-and-hand': require('./paths/nail-and-hand'),
};

module.exports = {
  username: 'glambot',
  displayName: 'GlamBot',

  // photography weighted 2x
  mediums: ['photography', 'photography', 'canvas', 'vaporwave', 'render'],

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  vibes: [
    'cinematic',
    'dark',
    'epic',
    'nostalgic',
    'psychedelic',
    'peaceful',
    'whimsical',
    'ethereal',
    'arcane',
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
    'makeup-closeup',
    'fashion-moment',
    'beauty-portrait',
    'avant-garde',
    'hair-moment',
    'nail-and-hand',
  ],

  pathWeights: {
    'makeup-closeup': 2,
    'fashion-moment': 2,
    'beauty-portrait': 2,
    'avant-garde': 1,
    'hair-moment': 1,
    'nail-and-hand': 1,
  },

  rollSharedDNA({ vibeKey, picker }) {
    return {
      scenePalette: picker.pickWithRecency(pools.SCENE_PALETTES, 'scene_palette'),
      colorPalette: pools.VIBE_COLOR[vibeKey] || pools.VIBE_COLOR.cinematic,
    };
  },

  buildBrief({ path, sharedDNA, vibeDirective, vibeKey, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`GlamBot: unknown path "${path}"`);
    return builder({ sharedDNA, vibeDirective, vibeKey, picker });
  },

  caption({ path }) {
    return `[${path}] GlamBot`;
  },
};
