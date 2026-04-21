/**
 * EarthBot — the bot-engine contract.
 *
 * EARTH ONLY. Every render is a theoretically plausible earthly location
 * dialed to 10× drama / saturation / lighting / weather. National-Geographic
 * cover × 10. Zero fantasy, zero cosmic, zero physics-defying. Scene-centric
 * — no humans, no animal subjects (AnimalBot's job).
 */

const pools = require('./pools');
const blocks = require('./shared-blocks');

const pathBuilders = {
  vista: require('./paths/vista'),
  'hidden-corner': require('./paths/hidden-corner'),
  'weather-moment': require('./paths/weather-moment'),
  'cozy-nature': require('./paths/cozy-nature'),
  sky: require('./paths/sky'),
};

module.exports = {
  username: 'earthbot',
  displayName: 'EarthBot',

  // Photography-leaning mediums (Earth-rooted aesthetic)
  mediums: ['photography', 'canvas', 'watercolor', 'pencil'],

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  // Inverts old excludeVibes (minimal/psychedelic/macabre). Earth has drama + weather,
  // so dark + fierce are ALLOWED (thunderstorm / volcanic / stormy energy).
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

  paths: ['vista', 'hidden-corner', 'weather-moment', 'cozy-nature', 'sky'],

  // Bread-and-butter are vista + sky; hidden-corner + weather-moment + cozy balance rotation
  pathWeights: {
    vista: 2,
    'hidden-corner': 1,
    'weather-moment': 2,
    'cozy-nature': 1,
    sky: 2,
  },

  // Scene-centric — sharedDNA is just palette + vibe color
  rollSharedDNA({ vibeKey, picker }) {
    return {
      scenePalette: picker.pickWithRecency(pools.SCENE_PALETTES, 'scene_palette'),
      colorPalette: pools.VIBE_COLOR[vibeKey] || pools.VIBE_COLOR.cinematic,
    };
  },

  buildBrief({ path, sharedDNA, vibeDirective, vibeKey, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`EarthBot: unknown path "${path}"`);
    return builder({ sharedDNA, vibeDirective, vibeKey, picker });
  },

  caption({ path }) {
    return `[${path}] EarthBot`;
  },
};
