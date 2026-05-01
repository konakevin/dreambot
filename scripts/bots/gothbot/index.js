/**
 * GothBot — the bot-engine contract.
 *
 * Hauntingly beautiful dark fantasy. Castlevania/Bloodborne/Dark-Souls/
 * Elden-Ring/Tim-Burton/Crimson-Peak/Berserk/gothic-fairy-tale energy.
 * Elegant darkness — unsettling but gorgeous. Characters by role only.
 * banPhrases: jack skellington, nightmare before christmas.
 */

const pools = require('./pools');
const blocks = require('./shared-blocks');

const pathBuilders = {
  'dark-landscape': require('./paths/dark-landscape'),
  'gothic-architecture': require('./paths/gothic-architecture'),
  'goth-closeup': require('./paths/goth-closeup'),
  'goth-full-body': require('./paths/goth-full-body'),
  'goth-male-closeup': require('./paths/goth-male-closeup'),
  'goth-male-full-body': require('./paths/goth-male-full-body'),
  'horror-creature': require('./paths/horror-creature'),
  'castlevania-scene': require('./paths/castlevania-scene'),
  'cozy-goth': require('./paths/cozy-goth'),
  'vampire-girls-2': require('./paths/vampire-girls-2'),
  'gothic-vista': require('./paths/gothic-vista'),
  'gothic-darklands': require('./paths/gothic-darklands'),
};

module.exports = {
  username: 'gothbot',
  displayName: 'GothBot',

  // Opt in to per-medium Flux routing via lib/modelPicker.js.
  // Reads dream_mediums.allowed_models (bot-scope, includes bot-only mediums).
  // Other bots without this flag continue to use hardcoded flux-dev.
  useModelPicker: true,

  // Bot-scoped model whitelist — intersects with each medium's allowed_models
  // pool BEFORE picking. GothBot bans flux-2-dev (tensor bug: "q_descale must
  // have shape...") and flux-2-pro (over-strict E005 safety filter). Every
  // gothbot render picks flux-dev or flux-1.1-pro only.
  allowedModels: ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],

  // Per-path model override — takes precedence over pickModel (medium pool).
  // Scenery/creature paths: 65/35 flux-1.1-pro/flux-dev (weighted object format).
  // Character paths: locked to flux-dev (1.1-pro's E005 safety filter trips on dark characters).
  modelByPath: {
    'dark-landscape':      { 'black-forest-labs/flux-1.1-pro': 65, 'black-forest-labs/flux-dev': 35 },
    'gothic-architecture': { 'black-forest-labs/flux-1.1-pro': 65, 'black-forest-labs/flux-dev': 35 },
    'castlevania-scene':   { 'black-forest-labs/flux-1.1-pro': 65, 'black-forest-labs/flux-dev': 35 },
    'cozy-goth':           { 'black-forest-labs/flux-1.1-pro': 65, 'black-forest-labs/flux-dev': 35 },
    'gothic-vista':        { 'black-forest-labs/flux-1.1-pro': 65, 'black-forest-labs/flux-dev': 35 },
    'gothic-darklands':    { 'black-forest-labs/flux-1.1-pro': 65, 'black-forest-labs/flux-dev': 35 },
    'horror-creature':     { 'black-forest-labs/flux-1.1-pro': 65, 'black-forest-labs/flux-dev': 35 },
    'vampire-girls-2': 'black-forest-labs/flux-dev',
  },

  // Per-path vibe restriction — vampire-girls-2 only renders well with
  // dark-coded vibes. Pretty-coded vibes (coquette/shimmer/ethereal/psychedelic)
  // and tone-neutral ones (cinematic/epic) fight the vampire intent.
  vibesByPath: {
    'vampire-girls-2': [
      'macabre', 'macabre', 'macabre',
      'nightshade', 'nightshade', 'nightshade',
      'arcane', 'arcane', 'arcane',
      'dark',
      'fierce',
      'ancient',
      'surreal',
    ],
  },

  mediumByPath: {
    'vampire-girls-2': 'vampire-portrait',
    'goth-male-full-body': [
      'gothic-architecture', 'gothic-architecture', 'gothic-architecture', 'gothic-architecture',
      'gothic-realistic', 'gothic-realistic', 'gothic-realistic',
      'anime', 'anime',
      'comics',
      'illustration',
      'canvas',
      'watercolor',
    ],
  },

  // Bot-only tags (inactive in dream_mediums so users can't pick them — VenusBot's 'surreal' pattern):
  //   'gothic-architecture' → heavy-ink Castlevania-manga stylization (landscape/architecture paths)
  //   'gothic-realistic' → 80s-90s dark-fantasy paperback oil-painting
  // Character paths override via mediumByPath → canvas/illustration/watercolor.
  mediums: [
    'gothic-architecture', 'gothic-architecture', 'gothic-architecture', 'gothic-architecture', // 4× = 29% flagship stylized
    'gothic-realistic', 'gothic-realistic', 'gothic-realistic', // 3× = 21% painterly-realism
    'anime', 'anime',                                             // 2× = 14% dark-anime
    'comics',
    'pencil',
    'illustration',
    'canvas',
    'watercolor',
  ],

  promptPrefixByMedium: {
    'vampire-portrait':
      'wallpaper-worthy operatic gothic vampire painting, dramatic theatrical composition, gallery-poster gravity',
  },
  promptSuffixByMedium: {
    'vampire-portrait':
      'operatic gothic dark-fantasy painting finish, painterly brushwork with bold heavy shadow, gallery-poster gravity, no text no words no watermarks, NOT photoreal NOT cinematic film-still NOT 35mm NOT magazine editorial NOT plastic-skin NOT Halloween costume NOT modern fashion photography',
  },

  // Per-medium prompt injection — gives each medium distinct visual character.
  // This fragment gets injected between promptPrefix and the Sonnet-written scene.
  mediumStyles: {
    'gothic-architecture':
      'dark gothic-horror illustration, heavy-ink shadow, hyper-baroque ornate architectural detail, high-contrast chiaroscuro, Castlevania-environment concept-art, moonlit stone and stained-glass atmosphere',
    // Subject-agnostic rewrite — stripped all character/face/makeup/expression
    // language that was leaking into landscape + architecture paths. Medium now
    // describes ONLY the rendering style (painted oil-on-canvas dark-fantasy
    // paperback polish) with no subject implied. Any path's subject (landscape,
    // architecture, character, interior) gets rendered in this style cleanly.
    'gothic-realistic':
      '1980s-1990s dark-fantasy paperback oil-painting cover art, Luis-Royo + Boris-Vallejo + Julie-Bell + Frank-Frazetta + Ken-Kelly painted-cover tradition, semi-realistic painterly rendering with visible brushwork and heavy impasto oil texture (NOT photoreal, NOT plastic-digital), strong chiaroscuro with warm amber candle / torch / moonlit key-light against cool violet-blue shadow, dramatic painted-polish dark-fantasy atmosphere, dark-fantasy-paperback-cover craft quality, NOT flat-inked, NOT manga, NOT smooth-digital-art, NOT Artgerm-plastic, NOT Rossdraws',
    'vampire-portrait':
      'WALLPAPER-WORTHY operatic gothic-theatrical painting fusing old-master-oil-painting tradition with painted-fantasy-poster drama, visible painterly brushwork, punchy jewel-tone palette anchored by deep velvet shadow, theatrical chiaroscuro pushed to operatic extreme, dramatic single-source key-light cutting through gloom, frame-worthy gallery-painting composition, dark gothic horror character energy, NOT photoreal NOT cinematic film-still NOT magazine editorial NOT plastic-skin NOT smooth-digital-art NOT modern fashion photography NOT pretty-girl-in-dress',
    anime:
      'dark-anime horror illustration, Berserk-manga Kentaro-Miura ink stylization, Devil-May-Cry character-art, heavy-shadow anime-horror aesthetic, NOT cute-anime NOT shonen NOT moe',
    comics:
      'gothic-horror comic-panel illustration, Mike-Mignola-Hellboy inked shadow, Hellblazer vertigo-horror comic stylization, bold black ink, dramatic chiaroscuro panels',
    pencil:
      'heavy graphite gothic-horror sketch, cross-hatched shadow, dark-fantasy concept-sketch linework, inked-over-pencil stylization, dramatic gothic illustration drawn in pencil-and-ink',
    illustration:
      'stylized gothic-horror illustration, angular ink-driven dark-fantasy concept art, heavy-black shadow rendering, dark-manga-horror cover-art stylization',
    canvas:
      'oil-painted gothic-horror portrait, heavy impasto brushwork, chiaroscuro painterly-horror tradition (Caravaggio-meets-Castlevania), painterly dark-fantasy baroque canvas',
    watercolor:
      'gothic watercolor horror illustration, blood-ink wash bleed, wet-on-wet dark fantasy tradition, atmospheric watercolor with ink-line overlay, gothic sumi-e inkwash',
  },

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  bannedPhrases: ['jack skellington', 'nightmare before christmas'],

  // Chaos layer — port of V4's chaosLayer.ts. Adds 1-2 dream-logic perception
  // distortions (geometry/reflection/scale/framing/secondary-light) to the
  // Sonnet brief on ~70% of renders. Sonnet weaves the distortion into the
  // scene description naturally.
  //
  // skipPaths: face-dominant paths where perception distortion would fight
  // the face-swap aesthetic or muddy a portrait. horror-creature is opted out
  // because the creature itself IS the chaos — adding more dilutes it.
  //
  // allowSubjectChaosPaths: only paths with a figure IN an environment (not
  // face-dominant) get subject-chaos channel enabled. Pure scenery paths
  // also benefit (figure becomes optional landmark).
  chaos: {
    enabled: true,
    skipPaths: [
      'goth-closeup',
      'goth-male-closeup',
      'horror-creature',
    ],
    allowSubjectChaosPaths: [
      'goth-full-body',
      'goth-male-full-body',
    ],
  },

  // Two-pass Sonnet→Haiku polish (V4/nightly Step 2 enhancement port).
  // Sonnet writes a vivid 150-word concept (no compression pressure),
  // then Haiku compresses to Flux-ready length while preserving anchor
  // phrases. Reusable for any bot — copy this block and customize
  // preservePhrasesByPath to enable.
  twoPassPolish: {
    enabled: true,
    conceptWords: 150,
    polishedWords: '65-90',
    // Per-path anchor phrases that Haiku must preserve through compression.
    // Falls back to twoPassPolish.preservePhrases (global) if path not listed.
    preservePhrasesByPath: {
      'vampire-girls-2': [
        'glowing', 'radiating', 'inhuman',
        'heavy', 'dark smoky-eye', 'sharp dark eyeliner',
        'blood-red', 'corpse-pale', 'gothic',
      ],
    },
    // Optional: skip two-pass on specific paths
    // skipPaths: [],
  },

  // Curated 13 — cuts: whimsical/nostalgic/enchanted/voltage (too soft/fairytale/neon);
  // excludes: minimal/cozy/peaceful (off-brand). Coquette + shimmer re-added
  // 2026-04-22 for vampire-vogue editorial-couture path (pastel-rose/black-lace
  // and tarnished-silver/gold-glint work for extreme vampire fashion).
  // Array repetition weights: macabre/nightshade/arcane 3× (flagship trio), others 1×.
  vibes: [
    'macabre', 'macabre', 'macabre',
    'nightshade', 'nightshade', 'nightshade',
    'arcane', 'arcane', 'arcane',
    'cinematic',
    'dark',
    'epic',
    'psychedelic',
    'ethereal',
    'ancient',
    'fierce',
    'surreal',
    'coquette',
    'shimmer',
  ],

  paths: [
    'dark-landscape',
    'gothic-architecture',
    'goth-closeup',
    'goth-full-body',
    'goth-male-closeup',
    'goth-male-full-body',
    'horror-creature',
    'castlevania-scene',
    'cozy-goth',
    'vampire-girls-2',
    'gothic-vista',
    'gothic-darklands',
  ],

  cycleAllPaths: true,

  rollSharedDNA({ vibeKey, picker }) {
    return {
      scenePalette: picker.pickWithRecency(pools.SCENE_PALETTES, 'scene_palette'),
      colorPalette: pools.VIBE_COLOR[vibeKey] || pools.VIBE_COLOR.dark,
    };
  },

  buildBrief({ path, sharedDNA, vibeDirective, vibeKey, medium, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`GothBot: unknown path "${path}"`);
    return builder({ sharedDNA, vibeDirective, vibeKey, medium, picker });
  },

  caption({ path }) {
    return `[${path}] GothBot`;
  },
};
