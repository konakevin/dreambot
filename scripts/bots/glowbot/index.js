/**
 * GlowBot — the bot-engine contract.
 *
 * LIGHT IS THE HERO. Every render is emotionally carried by the light itself.
 * Pandora-bioluminescent + Ghibli/Narnia/Rivendell soft-sacred luminance.
 * Scene-centric. No character DNA. Viewer must feel relaxed/awe-inspired/peaceful.
 */

const pools = require('./pools');
const blocks = require('./shared-blocks');

const pathBuilders = {
  'luminous-landscape': require('./paths/luminous-landscape'),
  'ethereal-scene': require('./paths/ethereal-scene'),
  'divine-moment': require('./paths/divine-moment'),
  dreamscape: require('./paths/dreamscape'),
  'quiet-glow': require('./paths/quiet-glow'),
};

module.exports = {
  username: 'glowbot',
  displayName: 'GlowBot',

  // Stylized/painterly mediums only — photography feels wrong for sacred-luminance
  mediums: ['watercolor', 'canvas', 'illustration', 'pencil'],

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  // Inverts old excludeVibes (dark/fierce/macabre). Everything else peaceful-compatible.
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
    'coquette',
    'voltage',
    'nightshade',
    'shimmer',
    'surreal',
  ],

  paths: ['luminous-landscape', 'ethereal-scene', 'divine-moment', 'dreamscape', 'quiet-glow'],

  // Hero paths weighted slightly — luminous-landscape + dreamscape are the bread-and-butter.
  // quiet-glow is the intimate small-scale counterweight.
  pathWeights: {
    'luminous-landscape': 2,
    'ethereal-scene': 1,
    'divine-moment': 1,
    dreamscape: 2,
    'quiet-glow': 2,
  },

  // Scene-centric — sharedDNA is just palette + vibe color
  rollSharedDNA({ vibeKey, picker }) {
    return {
      scenePalette: picker.pickWithRecency(pools.SCENE_PALETTES, 'scene_palette'),
      colorPalette: pools.VIBE_COLOR[vibeKey] || pools.VIBE_COLOR.peaceful,
    };
  },

  buildBrief({ path, sharedDNA, vibeDirective, vibeKey, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`GlowBot: unknown path "${path}"`);
    return builder({ sharedDNA, vibeDirective, vibeKey, picker });
  },

  caption({ path }) {
    return `[${path}] GlowBot`;
  },
};
