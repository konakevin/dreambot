/**
 * OceanBot — the bot-engine contract.
 *
 * The full ocean experience — underwater wonder, surface drama, maritime myth,
 * deep sea horror, coastal beauty, big waves, tropical paradise.
 * NatGeo × ancient mariner × Moby Dick.
 */

const pools = require('./pools');
const blocks = require('./shared-blocks');

const pathBuilders = {
  'reef-life': require('./paths/reef-life'),
  'sea-creatures': require('./paths/sea-creatures'),
  'deep-wonder': require('./paths/deep-wonder'),
  'deep-horror': require('./paths/deep-horror'),
  'storm-surface': require('./paths/storm-surface'),
  'ghost-ship': require('./paths/ghost-ship'),
  'kraken-leviathan': require('./paths/kraken-leviathan'),
  'shipwreck-kingdom': require('./paths/shipwreck-kingdom'),
  'polar-seas': require('./paths/polar-seas'),
  'coastal-cliffs': require('./paths/coastal-cliffs'),
  'calm-glass-sea': require('./paths/calm-glass-sea'),
  'big-wave': require('./paths/big-wave'),
  'coastal-golden': require('./paths/coastal-golden'),
  'tropical-paradise': require('./paths/tropical-paradise'),
  'mermaid-legend': require('./paths/mermaid-legend'),
};

module.exports = {
  username: 'oceanbot',
  displayName: 'OceanBot',

  cycleAllPaths: true,

  mediums: ['canvas', 'watercolor', 'illustration', 'pencil'],

  mediumByPath: {
    'mermaid-legend': [
      'maritime-oil-legend', 'maritime-oil-classic',
    ],
  },

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  promptPrefixByMedium: {
    'maritime-oil-legend':
      'CLASSICAL MARITIME OIL PAINTING of a MERMAID (half-fish creature with a scaled tail, NOT a woman in a dress), museum-quality full-scene composition — the vast ocean environment dominates. Turner / Aivazovsky / Winslow Homer / Caspar David Friedrich maritime seascape tradition, heavy impasto oil brushwork, atmospheric depth, dramatic chiaroscuro, age-of-sail romanticism',
    'maritime-oil-romantic':
      'WATERHOUSE OIL PAINTING — mythical woman in flowing classical robes within a lush maritime environment, museum-quality romantic composition. Waterhouse tradition, luminous skin, draped fabric merging with water, rich oil glazes, dramatic natural lighting, Victorian mythological romanticism',
    'maritime-oil-classic':
      'CLASSICAL MARITIME OIL PAINTING, museum-quality full-scene composition — the vast ocean environment dominates. Turner / Aivazovsky / Waterhouse / Winslow Homer / Caspar David Friedrich maritime seascape tradition, heavy impasto oil brushwork, atmospheric depth, dramatic chiaroscuro, age-of-sail romanticism',
  },
  promptSuffixByMedium: {
    'maritime-oil-legend':
      'classical maritime oil painting on canvas, heavy impasto brushwork visible, museum-gallery masterwork quality, aged-canvas atmosphere, no text no words no watermarks — NOT a portrait, NOT a character card, NOT centered-hero composition, NOT anime, NOT manga, NOT photoreal, NOT digital-art, NOT 3D-render, NOT modern, NOT contemporary',
    'maritime-oil-romantic':
      'Waterhouse oil painting on canvas, luminous skin tones, flowing fabric in water, rich oil glazes, museum-gallery masterwork quality, no text no words no watermarks — NOT anime, NOT manga, NOT photoreal, NOT digital-art, NOT 3D-render, NOT modern',
    'maritime-oil-classic':
      'classical maritime oil painting on canvas, heavy impasto brushwork visible, museum-gallery masterwork quality, aged-canvas atmosphere, no text no words no watermarks — NOT a portrait, NOT a character card, NOT centered-hero composition, NOT anime, NOT manga, NOT photoreal, NOT digital-art, NOT 3D-render, NOT modern, NOT contemporary',
  },

  mediumStyles: {
    'maritime-oil-legend':
      'Turner + Aivazovsky + Winslow Homer + Caspar David Friedrich maritime oil-painting tradition, full-scene environment-dominant composition showing a mythical figure WITHIN a vast seascape (NOT a centered portrait — the ocean is the painting, she lives inside it), visible heavy impasto oil brushwork and palette-knife texture, rich saturated oil pigments on stretched canvas, dramatic chiaroscuro with warm golden lantern-light or cold moonlight against deep ocean shadow, atmospheric depth with fog and spray rendered as painterly glazes, age-of-sail romantic-realism, old-world maritime legend captured in oil paint, museum-gallery masterwork quality — NOT photoreal, NOT digital-smooth, NOT anime, NOT magazine-editorial',
    'maritime-oil-romantic':
      'Waterhouse romantic oil-painting tradition, mythical woman in flowing classical robes at the water\'s edge or partially submerged, luminous skin with soft golden or silver lighting, visible oil brushwork with delicate glazing technique, rich jewel-tone palette, fabric and hair merging with water, atmospheric depth, Victorian romantic-realism, museum-gallery masterwork quality — NOT photoreal, NOT digital-smooth, NOT anime, NOT magazine-editorial',
    'maritime-oil-classic':
      'Turner + Aivazovsky + Waterhouse + Homer + Friedrich maritime oil-painting tradition, mythical figure within vast seascape, heavy impasto brushwork, dramatic chiaroscuro, atmospheric depth with fog and spray, age-of-sail romanticism, museum-gallery masterwork quality — NOT photoreal, NOT digital-smooth, NOT anime, NOT magazine-editorial',
  },

  useModelPicker: true,
  allowedModels: ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],

  vibes: [
    'cinematic',
    'dark',
    'cozy',
    'epic',
    'nostalgic',
    'peaceful',
    'ethereal',
    'ancient',
    'enchanted',
    'fierce',
    'voltage',
    'nightshade',
    'shimmer',
    'surreal',
  ],

  paths: [
    'reef-life',
    'sea-creatures',
    'deep-wonder',
    'deep-horror',
    'storm-surface',
    'ghost-ship',
    'kraken-leviathan',
    'shipwreck-kingdom',
    'polar-seas',
    'coastal-cliffs',
    'calm-glass-sea',
    'big-wave',
    'coastal-golden',
    'tropical-paradise',
    'mermaid-legend',
  ],

  pathWeights: {
    'reef-life': 1,
    'sea-creatures': 1,
    'deep-wonder': 1,
    'deep-horror': 1,
    'storm-surface': 1,
    'ghost-ship': 1,
    'kraken-leviathan': 1,
    'shipwreck-kingdom': 1,
    'polar-seas': 1,
    'coastal-cliffs': 1,
    'calm-glass-sea': 1,
    'big-wave': 1,
    'coastal-golden': 1,
    'tropical-paradise': 1,
    'mermaid-legend': 1,
  },

  rollSharedDNA({ vibeKey, picker }) {
    return {
      scenePalette: picker.pickWithRecency(pools.SCENE_PALETTES, 'scene_palette'),
      colorPalette: pools.VIBE_COLOR[vibeKey] || pools.VIBE_COLOR.cinematic,
    };
  },

  buildBrief({ path, sharedDNA, vibeDirective, vibeKey, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`OceanBot: unknown path "${path}"`);
    return builder({ sharedDNA, vibeDirective, vibeKey, picker });
  },

  caption({ path }) {
    return `[${path}] OceanBot`;
  },
};
