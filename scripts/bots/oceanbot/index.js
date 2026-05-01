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
  'deep-wonder': require('./paths/deep-wonder'),
  'storm-surface': require('./paths/storm-surface'),
  'ghost-ship': require('./paths/ghost-ship'),
  'kraken-leviathan': require('./paths/kraken-leviathan'),
  'shipwreck-kingdom': require('./paths/shipwreck-kingdom'),
  'lost-cities': require('./paths/lost-cities'),
  pirates: require('./paths/pirates'),
  'undersea-seascape': require('./paths/undersea-seascape'),
  'polar-seas': require('./paths/polar-seas'),
  'coastal-cliffs': require('./paths/coastal-cliffs'),
  'calm-glass-sea': require('./paths/calm-glass-sea'),
  'big-wave': require('./paths/big-wave'),
  'coastal-golden': require('./paths/coastal-golden'),
  'tropical-paradise': require('./paths/tropical-paradise'),
};

module.exports = {
  username: 'oceanbot',
  displayName: 'OceanBot',

  cycleAllPaths: true,

  mediums: ['canvas', 'watercolor', 'illustration', 'pencil'],

  mediumByPath: {},

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  promptPrefixByMedium: {
    maritime_oil_legend:
      'CLASSICAL MARITIME OIL PAINTING of a TRADITIONAL MERMAID — half-human upper body fused into ONE SINGLE FUSED FISH TAIL ending in ONE FLUKE. Single mono-tail. NOT human legs. NOT feet. NOT ankles. NOT two tails. NOT bifurcated tail. NOT split tail. NOT a woman in a dress. NOT a woman wading. The tail is ONE continuous scaled appendage from her waist to one fluke, exactly like a real fish. Museum-quality full-scene composition — the vast ocean environment dominates. Turner / Aivazovsky / Winslow Homer / Caspar David Friedrich maritime seascape tradition, heavy impasto oil brushwork, atmospheric depth, dramatic chiaroscuro, age-of-sail romanticism',
    maritime_oil_romantic:
      'Pre-Raphaelite dark oil painting of a TRADITIONAL MERMAID — half-human upper body fused into ONE SINGLE FUSED FISH TAIL ending in ONE FLUKE. Single mono-tail. NOT human legs. NOT feet. NOT ankles. NOT two tails. NOT bifurcated tail. NOT a woman in a dress wading on land. The tail is ONE continuous scaled appendage from her waist to one fluke. **Waterhouse + Rossetti + Burne-Jones + Godward + Caspar-David-Friedrich + Goya-dark-paintings tradition** — full-scene painterly composition showing the mermaid figure WITHIN a richly-detailed maritime environment (NOT a centered hero portrait — the SEASCAPE is the frame, she lives inside it, blended into the sea, lost lady on the open ocean, siren calling over the deep). Visible impasto oil brushwork, heavy canvas texture, painterly-realism with atmospheric depth, chiaroscuro lighting with colored ambient shadows, dark-romanticism baroque oil-painting polish, Victorian Pre-Raphaelite painted-canvas tradition, gallery-oil-painting masterwork quality',
    maritime_oil_classic:
      'CLASSICAL MARITIME OIL PAINTING, museum-quality full-scene composition — the vast ocean environment dominates. Turner / Aivazovsky / Waterhouse / Winslow Homer / Caspar David Friedrich maritime seascape tradition, heavy impasto oil brushwork, atmospheric depth, dramatic chiaroscuro, age-of-sail romanticism',
  },
  promptSuffixByMedium: {
    maritime_oil_legend:
      'classical maritime oil painting on canvas, heavy impasto brushwork visible, museum-gallery masterwork quality, aged-canvas atmosphere, no text no words no watermarks — NOT a portrait, NOT a character card, NOT centered-hero composition, NOT anime, NOT manga, NOT photoreal, NOT digital-art, NOT 3D-render, NOT modern, NOT contemporary — TRADITIONAL ONE-TAIL MERMAID ONLY: NOT human legs, NOT feet, NOT toes, NOT ankles, NOT two tails, NOT bifurcated tail, NOT split tail, NOT siren-with-legs, NOT Starbucks-logo two-tail, NOT walking, NOT standing on land, NOT wading on shore — single fused fish tail with one fluke',
    maritime_oil_romantic:
      'Waterhouse Pre-Raphaelite oil painting on canvas, luminous skin tones, hair tangled with seafoam, rich oil glazes, museum-gallery masterwork quality, no text no words no watermarks — NOT anime, NOT manga, NOT photoreal, NOT digital-art, NOT 3D-render, NOT modern — TRADITIONAL ONE-TAIL MERMAID ONLY: NOT human legs, NOT feet, NOT toes, NOT ankles, NOT two tails, NOT bifurcated tail, NOT split tail, NOT siren-with-legs, NOT Starbucks-logo two-tail, NOT walking, NOT standing on land, single fused fish tail with one fluke',
    maritime_oil_classic:
      'classical maritime oil painting on canvas, heavy impasto brushwork visible, museum-gallery masterwork quality, aged-canvas atmosphere, no text no words no watermarks — NOT a portrait, NOT a character card, NOT centered-hero composition, NOT anime, NOT manga, NOT photoreal, NOT digital-art, NOT 3D-render, NOT modern, NOT contemporary — IF MERMAID FIGURE: TRADITIONAL ONE-TAIL ONLY, NOT legs, NOT feet, NOT two tails, NOT bifurcated tail, single fused fish tail with one fluke',
  },

  mediumStyles: {
    maritime_oil_legend:
      'Turner + Aivazovsky + Winslow Homer + Caspar David Friedrich maritime oil-painting tradition, full-scene environment-dominant composition showing a mythical figure WITHIN a vast seascape (NOT a centered portrait — the ocean is the painting, she lives inside it), visible heavy impasto oil brushwork and palette-knife texture, rich saturated oil pigments on stretched canvas, dramatic chiaroscuro with warm golden lantern-light or cold moonlight against deep ocean shadow, atmospheric depth with fog and spray rendered as painterly glazes, age-of-sail romantic-realism, old-world maritime legend captured in oil paint, museum-gallery masterwork quality — NOT photoreal, NOT digital-smooth, NOT anime, NOT magazine-editorial',
    maritime_oil_romantic:
      'Pre-Raphaelite dark oil painting tradition — Waterhouse + Rossetti + Burne-Jones + Godward + Caspar-David-Friedrich + Goya-dark-paintings — single-tail mermaid figure WITHIN a vast Pre-Raphaelite seascape (NOT centered portrait — the SEASCAPE is the painting, she lives inside it, blended into the sea, lost lady on the open ocean, siren calling over the deep), visible impasto oil brushwork on heavy canvas texture, painterly-realism with atmospheric depth, chiaroscuro lighting with colored ambient shadows, dark-romanticism baroque oil-painting polish, Victorian Pre-Raphaelite painted-canvas tradition, gallery-oil-painting masterwork quality — single fused fish tail with one fluke, NOT photoreal, NOT digital-smooth, NOT anime, NOT magazine-editorial, NOT human legs, NOT bifurcated tail',
    maritime_oil_classic:
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
    'deep-wonder',
    'storm-surface',
    'ghost-ship',
    'kraken-leviathan',
    'shipwreck-kingdom',
    'lost-cities',
    'pirates',
    'undersea-seascape',
    'polar-seas',
    'coastal-cliffs',
    'calm-glass-sea',
    'big-wave',
    'coastal-golden',
    'tropical-paradise',
  ],

  pathWeights: {
    'reef-life': 1,
    'deep-wonder': 1,
    'storm-surface': 1,
    'ghost-ship': 1,
    'kraken-leviathan': 1,
    'shipwreck-kingdom': 1,
    'lost-cities': 1,
    pirates: 1,
    'undersea-seascape': 2,
    'polar-seas': 1,
    'coastal-cliffs': 1,
    'calm-glass-sea': 1,
    'big-wave': 1,
    'coastal-golden': 1,
    'tropical-paradise': 1,
  },

  chaos: { enabled: true, skipPaths: [], allowSubjectChaosPaths: ['reef-life','deep-wonder','storm-surface','ghost-ship','kraken-leviathan','shipwreck-kingdom','lost-cities','pirates','undersea-seascape','polar-seas','coastal-cliffs','calm-glass-sea','big-wave','coastal-golden','tropical-paradise'] },
  twoPassPolish: { enabled: true, conceptWords: 150, polishedWords: '65-90', polishedWordsByPath: {}, preservePhrasesByPath: {} },
  sensoryAnchors: {
    enabled: true,
    requiredChannels: ['lightcolor'],
    pathContext: {
      'reef-life': 'scene','deep-wonder': 'scene','lost-cities': 'scene',pirates: 'scene','undersea-seascape': 'scene',
      'storm-surface': 'scene','ghost-ship': 'scene','kraken-leviathan': 'scene','shipwreck-kingdom': 'scene',
      'polar-seas': 'scene','coastal-cliffs': 'scene','calm-glass-sea': 'scene','big-wave': 'scene',
      'coastal-golden': 'scene','tropical-paradise': 'scene',
    },
    poolsByContextAndChannel: pools.SENSORY_POOLS,
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
