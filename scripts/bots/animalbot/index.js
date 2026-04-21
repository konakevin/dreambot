/**
 * AnimalBot — the bot-engine contract.
 *
 * Wildlife at Nat Geo × 10. LAND ANIMALS ONLY (marine is OceanBot).
 * Subject-centric — the animal is the emotional hero of every frame, even
 * in the landscape path. Razor-sharp detail, dramatic lighting, peak-moment
 * timing, impossibly clear.
 */

const pools = require('./pools');
const blocks = require('./shared-blocks');

const pathBuilders = {
  portrait: require('./paths/portrait'),
  landscape: require('./paths/landscape'),
  action: require('./paths/action'),
  tender: require('./paths/tender'),
  cozy: require('./paths/cozy'),
};

module.exports = {
  username: 'animalbot',
  displayName: 'AnimalBot',

  // Photo-leaning mediums for wildlife realism
  mediums: ['photography', 'canvas', 'watercolor', 'pencil'],

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  // Inverts old excludeVibes (minimal/psychedelic/macabre). Fierce + dark allowed
  // for predator moments; cozy allowed for cozy path.
  vibes: [
    'cinematic',
    'dark',
    'cozy',
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
    'shimmer',
    'surreal',
  ],

  paths: ['portrait', 'landscape', 'action', 'tender', 'cozy'],

  // Bread-and-butter: portrait + action + landscape. Tender + cozy balance roster.
  pathWeights: {
    portrait: 2,
    landscape: 2,
    action: 2,
    tender: 1,
    cozy: 1,
  },

  // Subject-centric but scene-free — sharedDNA is just palette + vibe color
  rollSharedDNA({ vibeKey, picker }) {
    return {
      scenePalette: picker.pickWithRecency(pools.SCENE_PALETTES, 'scene_palette'),
      colorPalette: pools.VIBE_COLOR[vibeKey] || pools.VIBE_COLOR.cinematic,
    };
  },

  buildBrief({ path, sharedDNA, vibeDirective, vibeKey, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`AnimalBot: unknown path "${path}"`);
    return builder({ sharedDNA, vibeDirective, vibeKey, picker });
  },

  caption({ path }) {
    return `[${path}] AnimalBot`;
  },
};
