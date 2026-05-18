/**
 * DinoBot — the bot-engine contract.
 *
 * BBC Planet Earth meets museum-grade paleoart. Cinematic nature
 * documentary stills of scientifically plausible dinosaurs.
 * Ultra-realistic, species-accurate, dramatic cinematography.
 */

const pools = require('./pools');
const blocks = require('./shared-blocks');

const pathBuilders = {
  'dino-portrait': require('./paths/dino-portrait'),
  'dino-action': require('./paths/dino-action'),
  'paleo-landscape': require('./paths/paleo-landscape'),
  'herd-migration': require('./paths/herd-migration'),
  'territory-clash': require('./paths/territory-clash'),
  'nesting-ground': require('./paths/nesting-ground'),
  'swamp-river': require('./paths/swamp-river'),
  'ocean-reptiles': require('./paths/ocean-reptiles'),
  'cinematic-silhouette': require('./paths/cinematic-silhouette'),
  'micro-detail': require('./paths/micro-detail'),
  'extinction-event': require('./paths/extinction-event'),
  'dino-cozy': require('./paths/dino-cozy'),
  'dino-pack': require('./paths/dino-pack'),
  'aerial-perspectives': require('./paths/aerial-perspectives'),
};

module.exports = {
  username: 'dinobot',
  displayName: 'DinoBot',

  // Single locked medium — Unreal Engine 5 cinematic raytracing for every render.
  // Was rotating photography/render/canvas; that produced inconsistent quality
  // (watercolor / pencil / etc. flatness on some renders). Lock to `render`
  // and pump the override hard so every output reads as UE5-killed-it polish.
  mediums: ['render'],

  // Per-medium override — Avatar Pandora × Skull Island × Land of the Lost
  // overgrown-jungle cinematics (NOT documentary-savanna). The dinosaur is a
  // photoreal real animal in an UNHINGED-LUSH primordial jungle.
  //
  // Documentary references like "Prehistoric Planet" or "wildlife photography"
  // pull Flux toward open-savanna training data with sparse cover. We want
  // the OPPOSITE — buried in jungle, leaves the size of cars, vines hanging
  // from impossible heights. Lost-world cinematics, not nature-doc.
  // Per-medium override — SETTING-AGNOSTIC visual signature only. Setting
  // (jungle vs savanna vs canyon vs volcanic vs ocean) comes from the
  // path's own pools and per-path blocks, NOT from the global wrapper.
  // Was pumping "dense Mesozoic jungle / mega-flora / overgrown" here,
  // which collapsed every path's render into jungle regardless of intent.
  mediumStyles: {
    render:
      'NO HUMANS NO PEOPLE — this world is 66 million years before humans existed, cinematic 35mm film still, photoreal living animal with leathery scarred biological hide, hyperreal organic textures, ray-traced reflections, PBR materials, IMAX cinematic precision — NOT cartoon NOT painted NOT watercolor NOT pencil NOT toy NOT 3D-character-model NOT video-game-render NOT plastic-CGI',
  },
  promptSuffixByMedium: {
    render:
      'NO HUMANS NO PEOPLE NO HUMAN FIGURES, photoreal cinematic film still, the dinosaur is a REAL LIVING ANIMAL, hyperreal organic detail, NOT plastic NOT 3D-render',
  },

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  // Per-path prefix override — JUNGLE-CODED paths wrap their Flux prompt
  // with lush-overgrown-jungle language so the rendered scene reads as
  // dense primordial jungle (not the setting-neutral global wrapper that
  // open paths use). Open paths (herd, paleo, volcanic, ocean, action,
  // territory, pack, extinction, silhouette, aerial) inherit the global
  // setting-neutral PROMPT_PREFIX and let their setting pools dictate.
  promptPrefixByPath: {
    'dino-cozy':
      'NO HUMANS — 66 million years before humans evolved, cinematic primordial overgrown lost-world wilderness with absolutely unhinged massive overgrown flora (mega-leaves the size of cars, vines hanging from impossible heights, gnarled mile-high trees), dense Mesozoic jungle, ray-traced reflections, hyperreal textures, IMAX cinematic precision, 8K detail',
    'nesting-ground':
      'NO HUMANS — 66 million years before humans evolved, cinematic primordial overgrown lost-world wilderness with absolutely unhinged massive overgrown flora (mega-leaves the size of cars, vines hanging from impossible heights, gnarled mile-high trees), dense Mesozoic jungle, ray-traced reflections, hyperreal textures, IMAX cinematic precision, 8K detail',
    'swamp-river':
      'NO HUMANS — 66 million years before humans evolved, cinematic primordial overgrown lost-world riparian wilderness with absolutely unhinged massive overgrown flora (mega-leaves the size of cars, vines hanging from impossible heights, gnarled mile-high trees), dense Mesozoic jungle along tannin-dark waters, ray-traced reflections, hyperreal textures, IMAX cinematic precision, 8K detail',
    // dino-portrait wrapper REMOVED 2026-05-17 — the legacy stuffed wrapper
    // forced every render to "dense Mesozoic jungle" overriding the biome
    // pool's variety. Portrait now inherits the global setting-neutral
    // PROMPT_PREFIX and lets the biome slot dictate the environment.
    // 'dino-portrait': (removed),
    'micro-detail':
      'NO HUMANS — 66 million years before humans evolved, cinematic primordial overgrown lost-world wilderness with absolutely unhinged massive overgrown flora (mega-leaves the size of cars, vines hanging from impossible heights), dense Mesozoic jungle, ray-traced reflections, hyperreal textures, IMAX cinematic precision, 8K detail',
  },

  useModelPicker: true,
  allowedModels: ['black-forest-labs/flux-1.1-pro'],

  // Single locked vibe — cinematic. Was rotating 11 vibes which produced
  // inconsistent moods (cozy/ethereal/shimmer pulled away from the
  // hyperreal Prehistoric-Planet-cinematic look). Lock to cinematic.
  vibes: ['cinematic'],

  paths: [
    'dino-portrait',
    'dino-action',
    'paleo-landscape',
    'herd-migration',
    'territory-clash',
    'nesting-ground',
    'swamp-river',
    'ocean-reptiles',
    'cinematic-silhouette',
    'micro-detail',
    'extinction-event',
    'dino-cozy',
    'dino-pack',
    'aerial-perspectives',
  ],

  pathWeights: {
    'dino-portrait': 1,
    'dino-action': 1,
    'paleo-landscape': 1,
    'herd-migration': 1,
    'territory-clash': 1,
    'nesting-ground': 1,
    'swamp-river': 1,
    'ocean-reptiles': 1,
    'cinematic-silhouette': 1,
    'micro-detail': 1,
    'extinction-event': 1,
    'dino-cozy': 1,
    'dino-pack': 1,
    'aerial-perspectives': 1,
  },

  chaos: { enabled: true, skipPaths: [], allowSubjectChaosPaths: ['paleo-landscape','herd-migration','territory-clash','nesting-ground','swamp-river','ocean-reptiles','cinematic-silhouette','micro-detail','extinction-event','dino-cozy','dino-pack','aerial-perspectives'] },
  twoPassPolish: { enabled: true, conceptWords: 150, polishedWords: '65-90', polishedWordsByPath: { 'dino-action': '80-110' }, preservePhrasesByPath: {}, skipPaths: ['paleo-landscape', 'swamp-river', 'ocean-reptiles', 'nesting-ground', 'herd-migration', 'territory-clash', 'cinematic-silhouette', 'dino-cozy', 'dino-pack', 'aerial-perspectives', 'dino-portrait'] },
  sensoryAnchors: {
    enabled: true,
    requiredChannels: ['lightcolor'],
    pathContext: {
      'dino-portrait': 'dinosaur','dino-action': 'dinosaur','dino-pack': 'dinosaur',
      'paleo-landscape': 'scene','herd-migration': 'dinosaur','territory-clash': 'dinosaur',
      'nesting-ground': 'dinosaur','swamp-river': 'scene','ocean-reptiles': 'dinosaur',
      'cinematic-silhouette': 'dinosaur','micro-detail': 'scene',
      'extinction-event': 'scene','dino-cozy': 'scene',
      'aerial-perspectives': 'dinosaur',
    },
    poolsByContextAndChannel: pools.SENSORY_POOLS,
  },

  rollSharedDNA({ vibeKey, picker }) {
    return {
      scenePalette: picker.pickWithRecency(pools.SCENE_PALETTES, 'scene_palette'),
      colorPalette: pools.VIBE_COLOR[vibeKey] || pools.VIBE_COLOR.cinematic,
    };
  },

  // Bot-level pool defaults for declarative axis paths (composer reads these
  // when a path config doesn't override the slot).
  defaultPools: {
    lighting: 'LIGHTING',
    atmosphere: 'PREHISTORIC_ATMOSPHERES',
  },

  poolByName(name) {
    if (!(name in pools)) {
      throw new Error(`DinoBot.poolByName: unknown pool "${name}"`);
    }
    return pools[name];
  },

  buildBrief({ path, sharedDNA, vibeDirective, vibeKey, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`DinoBot: unknown path "${path}"`);
    if (typeof builder === 'function') {
      return builder({ sharedDNA, vibeDirective, vibeKey, picker });
    }
    if (builder && typeof builder === 'object' && builder.archetype) {
      const { composeBrief } = require('../../lib/brief-composer');
      return composeBrief({
        bot: module.exports,
        pathConfig: builder,
        sharedDNA,
        vibeDirective,
        picker,
      });
    }
    throw new Error(`DinoBot: path "${path}" has invalid export shape`);
  },

  bannedPhrases: ['human', 'person', 'people', 'man ', 'woman', 'child', 'hunter', 'explorer', 'scientist', 'ranger', 'tourist'],

  caption({ path }) {
    return `[${path}] DinoBot`;
  },
};
