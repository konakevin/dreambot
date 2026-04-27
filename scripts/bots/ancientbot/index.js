/**
 * AncientBot — the bot-engine contract.
 *
 * Monumental oil-painting renderings of ancient civilizations (pre-600 BC).
 * Arnold-Friberg-scale grandeur meets archaeological reconstruction.
 * Pure scene — people as background texture only. History buffs rejoice.
 */

const pools = require('./pools');
const blocks = require('./shared-blocks');

const pathBuilders = {
  'grand-temple': require('./paths/grand-temple'),
  'ancient-city': require('./paths/ancient-city'),
  'monument': require('./paths/monument'),
  'river-civilization': require('./paths/river-civilization'),
  'ancient-harbor': require('./paths/ancient-harbor'),
  'lost-ruins': require('./paths/lost-ruins'),
  'ancient-interior': require('./paths/ancient-interior'),
  'ancient-quiet': require('./paths/ancient-quiet'),
  'ancient-waters': require('./paths/ancient-waters'),
  'ancient-frost': require('./paths/ancient-frost'),
  'ancient-night': require('./paths/ancient-night'),
  'ancient-jungle': require('./paths/ancient-jungle'),
  'ancient-island': require('./paths/ancient-island'),
};

module.exports = {
  username: 'ancientbot',
  displayName: 'AncientBot',

  useModelPicker: true,
  allowedModels: ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],

  modelByPath: {
    'grand-temple':       { 'black-forest-labs/flux-1.1-pro': 65, 'black-forest-labs/flux-dev': 35 },
    'ancient-city':       { 'black-forest-labs/flux-1.1-pro': 65, 'black-forest-labs/flux-dev': 35 },
    'monument':           { 'black-forest-labs/flux-1.1-pro': 65, 'black-forest-labs/flux-dev': 35 },
    'river-civilization': { 'black-forest-labs/flux-1.1-pro': 65, 'black-forest-labs/flux-dev': 35 },
    'ancient-harbor':     { 'black-forest-labs/flux-1.1-pro': 65, 'black-forest-labs/flux-dev': 35 },
    'lost-ruins':         { 'black-forest-labs/flux-1.1-pro': 65, 'black-forest-labs/flux-dev': 35 },
    'ancient-interior':   { 'black-forest-labs/flux-1.1-pro': 65, 'black-forest-labs/flux-dev': 35 },
    'ancient-quiet':      { 'black-forest-labs/flux-1.1-pro': 65, 'black-forest-labs/flux-dev': 35 },
    'ancient-waters':     { 'black-forest-labs/flux-1.1-pro': 65, 'black-forest-labs/flux-dev': 35 },
    'ancient-frost':      { 'black-forest-labs/flux-1.1-pro': 65, 'black-forest-labs/flux-dev': 35 },
    'ancient-night':      { 'black-forest-labs/flux-1.1-pro': 65, 'black-forest-labs/flux-dev': 35 },
    'ancient-jungle':     { 'black-forest-labs/flux-1.1-pro': 65, 'black-forest-labs/flux-dev': 35 },
    'ancient-island':     { 'black-forest-labs/flux-1.1-pro': 65, 'black-forest-labs/flux-dev': 35 },
  },

  cycleAllPaths: true,

  mediums: ['ancient-epic'],

  mediumByPath: {
    'grand-temple': ['ancient-epic', 'render'],
    'ancient-city': ['ancient-epic', 'render'],
    'monument': ['ancient-epic', 'render'],
    'river-civilization': ['ancient-epic', 'render'],
    'ancient-harbor': ['ancient-epic', 'render'],
    'lost-ruins': ['ancient-epic', 'render'],
    'ancient-interior': ['ancient-epic', 'render'],
    'ancient-quiet': ['ancient-epic', 'render'],
    'ancient-waters': ['ancient-epic', 'render'],
    'ancient-frost': ['ancient-epic', 'render'],
    'ancient-night': ['ancient-epic', 'render'],
    'ancient-jungle': ['ancient-epic', 'render'],
    'ancient-island': ['ancient-epic', 'render'],
  },

  mediumStyles: {
    'ancient-epic':
      'lush oil painting on heavy canvas, thick visible impasto brushwork, soft painterly edges, warm pigment glow, rich saturated color layered wet-on-wet, deep jewel-tone shadows, dramatic chiaroscuro with colored light, Romanticism-era monumental grandeur, every surface reads as PAINTED not photographed',
  },

  promptPrefixByMedium: {
    'ancient-epic':
      'Lush oil painting, ancient civilization, rich saturated color, soft painterly brushwork, thick canvas texture, dramatic warm lighting, monumental scale',
  },
  promptSuffixByMedium: {
    'ancient-epic':
      'oil-painting finish, visible brushstrokes, soft painted edges, no text no words no watermarks, NOT sharp NOT crisp NOT photorealistic NOT digital-art NOT 3D-render NOT anime',
  },

  vibes: [
    'cinematic', 'cinematic', 'cinematic',
    'epic', 'epic', 'epic',
    'ancient', 'ancient',
    'ethereal',
    'dark',
    'peaceful',
    'surreal',
  ],

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  paths: [
    'grand-temple',
    'ancient-city',
    'monument',
    'river-civilization',
    'ancient-harbor',
    'lost-ruins',
    'ancient-interior',
    'ancient-quiet',
    'ancient-waters',
    'ancient-frost',
    'ancient-night',
    'ancient-jungle',
    'ancient-island',
  ],

  rollSharedDNA({ vibeKey, picker }) {
    return {
      scenePalette: picker.pickWithRecency(pools.SCENE_PALETTES, 'scene_palette'),
      colorPalette: pools.VIBE_COLOR[vibeKey] || pools.VIBE_COLOR.cinematic,
    };
  },

  buildBrief({ path, sharedDNA, vibeDirective, vibeKey, medium, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`AncientBot: unknown path "${path}"`);
    return builder({ sharedDNA, vibeDirective, vibeKey, medium, picker });
  },

  caption({ path }) {
    return `[${path}] AncientBot`;
  },
};
