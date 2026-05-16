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
  'vampire-assassin-female': require('./paths/vampire-assassin-female'),
  'vampire-assassin-male': require('./paths/vampire-assassin-male'),
  'vampire-assassin-combat': require('./paths/vampire-assassin-combat'),
  'monster-prowl': require('./paths/monster-prowl'),
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
  // Every path locked to a specific model — no path falls through to the
  // medium-level allowed_models picker. Default is flux-1.1-pro-ultra for
  // every path (Kevin's call 2026-05-09: more native detail on the
  // anime+gothic combo than 1.1-pro standard).
  //
  // KNOWN RISK: vampire-girls-2 was previously locked to flux-dev because
  // 1.1-pro's E005 safety filter tripped on its dark vampire imagery.
  // Ultra shares the same filter pipeline, so this path may fail until
  // the seeds are tuned. If renders fail, fall this single path back to
  // flux-dev — keep the rest on Ultra.
  modelByPath: {
    // Scene / landscape / architecture paths
    'dark-landscape': 'black-forest-labs/flux-1.1-pro-ultra',
    'gothic-architecture': 'black-forest-labs/flux-1.1-pro-ultra',
    'castlevania-scene': 'black-forest-labs/flux-1.1-pro-ultra',
    'cozy-goth': 'black-forest-labs/flux-1.1-pro-ultra',
    'gothic-vista': 'black-forest-labs/flux-1.1-pro-ultra',
    'horror-creature': 'black-forest-labs/flux-1.1-pro-ultra',
    // Character paths
    'goth-closeup': 'black-forest-labs/flux-1.1-pro',
    'goth-full-body': 'black-forest-labs/flux-1.1-pro-ultra',
    'goth-male-closeup': 'black-forest-labs/flux-1.1-pro',
    'goth-male-full-body': 'black-forest-labs/flux-1.1-pro-ultra',
    // Vampire paths
    'vampire-girls-2': 'black-forest-labs/flux-1.1-pro-ultra',
    'vampire-assassin-female': 'black-forest-labs/flux-1.1-pro-ultra',
    'vampire-assassin-male': 'black-forest-labs/flux-1.1-pro-ultra',
    'vampire-assassin-combat': 'black-forest-labs/flux-1.1-pro-ultra',
    'monster-prowl': 'black-forest-labs/flux-1.1-pro-ultra',
  },

  // Per-path vibe restriction — vampire-girls-2 only renders well with
  // dark-coded vibes. Pretty-coded vibes (coquette/shimmer/ethereal/psychedelic)
  // and tone-neutral ones (cinematic/epic) fight the vampire intent.
  vibesByPath: {
    // Character paths consolidated to the dark/nightshade/macabre triad.
    'goth-closeup': ['dark', 'nightshade', 'macabre'],
    'goth-full-body': ['dark', 'nightshade', 'macabre'],
    'goth-male-closeup': ['dark', 'nightshade', 'macabre'],
    'goth-male-full-body': ['dark', 'nightshade', 'macabre'],
    'vampire-girls-2': ['dark', 'nightshade', 'macabre'],
    // Scene paths locked to the dark / nightshade / macabre triad for the trial.
    'dark-landscape': ['dark', 'nightshade', 'macabre'],
    'gothic-architecture': ['dark', 'nightshade', 'macabre'],
    'castlevania-scene': ['dark', 'nightshade', 'macabre'],
    'cozy-goth': ['dark', 'nightshade', 'macabre'],
    'gothic-vista': ['dark', 'nightshade', 'macabre'],
    'horror-creature': ['dark', 'nightshade', 'macabre'],
    // Vampire-assassin paths locked to the dark triad.
    'vampire-assassin-female': ['dark', 'nightshade', 'macabre'],
    'vampire-assassin-male': ['dark', 'nightshade', 'macabre'],
    'vampire-assassin-combat': ['dark', 'nightshade', 'macabre'],
    'monster-prowl': ['dark', 'nightshade', 'macabre'],
  },

  mediumByPath: {
    // Character paths consolidated to anime medium (matches scene paths).
    'goth-closeup': 'anime',
    'goth-full-body': 'anime',
    'goth-male-closeup': 'anime',
    'goth-male-full-body': 'anime',
    'vampire-girls-2': 'anime',
    // Scene/landscape paths hardcoded to anime medium for the trial.
    'dark-landscape': 'anime',
    'gothic-architecture': 'gothbot_gothic_print',
    'castlevania-scene': 'anime',
    'cozy-goth': 'anime',
    'gothic-vista': 'anime',
    'horror-creature': 'anime',
    // Vampire-assassin paths locked to anime medium for the trial.
    'vampire-assassin-female': 'anime',
    'vampire-assassin-male': 'anime',
    'vampire-assassin-combat': 'anime',
    'monster-prowl': 'anime',
  },

  // Bot-only tags (inactive in dream_mediums so users can't pick them — VenusBot's 'surreal' pattern):
  //   'gothic_architecture' → heavy-ink Castlevania-manga stylization (landscape/architecture paths)
  //   'gothic_realistic' → 80s-90s dark-fantasy paperback oil-painting
  // Character paths override via mediumByPath → canvas/illustration/watercolor.
  mediums: [
    'gothic_architecture',
    'gothic_architecture',
    'gothic_architecture',
    'gothic_architecture', // 4× = 29% flagship stylized
    'gothic_realistic',
    'gothic_realistic',
    'gothic_realistic', // 3× = 21% painterly-realism
    'anime',
    'anime', // 2× = 14% dark-anime
    'comics',
    'pencil',
    'illustration',
    'canvas',
    'watercolor',
  ],

  promptPrefixByMedium: {
    vampire_portrait:
      'wallpaper-worthy operatic gothic vampire painting, dramatic theatrical composition, gallery-poster gravity',
    // FaeBot-pattern: empty prefix so the scene leads, not style language.
    painted_gothic_fantasy: blocks.PROMPT_PREFIX_PAINTED_GOTHIC_FANTASY,
    // gothic-architecture path bespoke (2026-05-15). Empty so the structure
    // description leads — style language lives in mediumStyles + suffix.
    gothbot_gothic_print: '',
  },
  promptSuffixByMedium: {
    vampire_portrait:
      'operatic gothic dark-fantasy painting finish, painterly brushwork with bold heavy shadow, gallery-poster gravity, no text no words no watermarks, NOT photoreal NOT cinematic film-still NOT 35mm NOT magazine editorial NOT plastic-skin NOT Halloween costume NOT modern fashion photography',
    painted_gothic_fantasy: blocks.PROMPT_SUFFIX_PAINTED_GOTHIC_FANTASY,
    gothbot_gothic_print:
      'Castlevania-promotional-art finish, hyper-detailed sharp linework, high-def gallery-print fidelity, dark gothic-action-horror illustration quality, no text no words no watermarks, NOT photoreal NOT film-still NOT 35mm NOT photo-realistic CGI NOT plain-anime',
  },

  // Per-medium prompt injection — gives each medium distinct visual character.
  // This fragment gets injected between promptPrefix and the Sonnet-written scene.
  mediumStyles: {
    gothbot_gothic_print:
      'hyper-detailed Castlevania-illustration concept-art, Symphony-of-the-Night promotional-art lineage, Devil-May-Cry environment-art tradition, Bloodborne concept-illustration polish, Berserk-manga Kentaro-Miura ink-detail stylization but painted-not-flat, sharp clean linework, every architectural ornament rendered crisp at every readable scale, theatrical high-contrast lighting, rich tonal depth, high-def gallery-print fidelity, dark gothic-horror action-game promotional-art quality, NOT photoreal NOT film-still NOT 35mm NOT photo-realistic CGI NOT plain-anime NOT shonen NOT moe NOT cute',
    gothic_architecture:
      'dark gothic-horror illustration, heavy-ink shadow, hyper-baroque ornate architectural detail, high-contrast chiaroscuro, Castlevania-environment concept-art, moonlit stone and stained-glass atmosphere',
    // Subject-agnostic rewrite — stripped all character/face/makeup/expression
    // language that was leaking into landscape + architecture paths. Medium now
    // describes ONLY the rendering style (painted oil-on-canvas dark-fantasy
    // paperback polish) with no subject implied. Any path's subject (landscape,
    // architecture, character, interior) gets rendered in this style cleanly.
    gothic_realistic:
      '1980s-1990s dark-fantasy paperback oil-painting cover art, Luis-Royo + Boris-Vallejo + Julie-Bell + Frank-Frazetta + Ken-Kelly painted-cover tradition, semi-realistic painterly rendering with visible brushwork and heavy impasto oil texture (NOT photoreal, NOT plastic-digital), strong chiaroscuro with warm amber candle / torch / moonlit key-light against cool violet-blue shadow, dramatic painted-polish dark-fantasy atmosphere, dark-fantasy-paperback-cover craft quality, NOT flat-inked, NOT manga, NOT smooth-digital-art, NOT Artgerm-plastic, NOT Rossdraws',
    vampire_portrait:
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
    // FaeBot-pattern tiny medium tag — small enough not to hijack early-
    // token weight. The path's scene description leads the prompt.
    painted_gothic_fantasy: blocks.PAINTED_GOTHIC_FANTASY_MEDIUM,
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
    skipPaths: ['goth-closeup', 'goth-male-closeup', 'horror-creature'],
    allowSubjectChaosPaths: ['goth-full-body', 'goth-male-full-body'],
  },

  // Sensory anchors (V4/nightly Step 3 enhancement port).
  // Adds 1-2 non-visual sensory cues (smell/sound/touch/temperature/weight/air)
  // to the Sonnet brief on every render. Sonnet weaves them into the scene so
  // verbs/adjectives around them sharpen — frankincense smoke clinging to her
  // hair, stone radiating crypt-cold up through her bare feet, etc.
  //
  // Bot-wide pools live in poolsByChannel (used for any path that doesn't
  // override). Per-path richer pools live in poolsByChannelByPath. Resolution
  // order per channel: per-path > per-bot > built-in DEFAULT_POOLS.
  //
  // Testing pools at 6 entries each (will scale to 100/channel via Sonnet
  // seed gen once the layer is validated — same pattern as vampire_hair etc).
  sensoryAnchors: {
    enabled: true,
    // Mandatory channels — always fire, on top of stochastic count.
    // lightcolor is required so every render gets a punchy lighting palette
    // (otherwise Sonnet defaults to safe warm-amber/cool-violet).
    requiredChannels: ['lightcolor'],

    // Map each path to its subject context. Pools are split into three
    // variants (female / male / scene) so language matches the subject:
    //   - female paths: "her throat", "lace digging", feminine garments
    //   - male paths: "his jaw", "gauntlet leather", masculine gear
    //   - scene paths: no human, environmental anchors only
    // Paths not listed default to 'scene' in the layer.
    pathContext: {
      'vampire-girls-2': 'female',
      'goth-closeup': 'female',
      'goth-full-body': 'female',
      'goth-male-closeup': 'male',
      'goth-male-full-body': 'male',
      'horror-creature': 'scene',
      'dark-landscape': 'scene',
      'gothic-architecture': 'scene',
      'gothic-vista': 'scene',
      'castlevania-scene': 'scene',
      'cozy-goth': 'scene',
    },

    // 21 Sonnet-seeded pools (3 contexts × 7 channels × 50 entries each)
    // loaded from scripts/bots/gothbot/seeds/sensory_<ctx>_<ch>.json.
    poolsByContextAndChannel: pools.SENSORY_POOLS,
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
    // Per-path word ceiling overrides — paths with sensory anchors + many
    // mandatory anchors need more headroom or Haiku drops sensory detail.
    polishedWordsByPath: {
      'vampire-girls-2': '80-110',
    },
    // Per-path anchor phrases that Haiku must preserve through compression.
    // Falls back to twoPassPolish.preservePhrases (global) if path not listed.
    // Sensory anchor phrases that rolled this turn are auto-merged into this
    // list at runtime (engine appends them — no need to enumerate here).
    preservePhrasesByPath: {
      'vampire-girls-2': [
        'glowing',
        'radiating',
        'inhuman',
        'heavy',
        'dark smoky-eye',
        'sharp dark eyeliner',
        'blood-red',
        'corpse-pale',
        'gothic',
      ],
    },
    // Optional: skip two-pass on specific paths
    skipPaths: ['dark-landscape', 'gothic-vista', 'gothic-architecture', 'castlevania-scene', 'cozy-goth'],
  },

  // Curated 13 — cuts: whimsical/nostalgic/enchanted/voltage (too soft/fairytale/neon);
  // excludes: minimal/cozy/peaceful (off-brand). Coquette + shimmer re-added
  // 2026-04-22 for vampire-vogue editorial-couture path (pastel-rose/black-lace
  // and tarnished-silver/gold-glint work for extreme vampire fashion).
  // Array repetition weights: macabre/nightshade/arcane 3× (flagship trio), others 1×.
  vibes: [
    'macabre',
    'macabre',
    'macabre',
    'nightshade',
    'nightshade',
    'nightshade',
    'arcane',
    'arcane',
    'arcane',
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
    'vampire-assassin-female',
    'vampire-assassin-male',
    'vampire-assassin-combat',
    'monster-prowl',
  ],

  cycleAllPaths: true,

  rollSharedDNA({ vibeKey, picker }) {
    return {
      scenePalette: picker.pickWithRecency(pools.SCENE_PALETTES, 'scene_palette'),
      colorPalette: pools.VIBE_COLOR[vibeKey] || pools.VIBE_COLOR.dark,
    };
  },

  // Bot-level pool defaults for declarative axis paths.
  defaultPools: {
    lighting: 'LIGHTING',
    atmosphere: 'ATMOSPHERES',
  },

  poolByName(name) {
    if (!(name in pools)) {
      throw new Error(`GothBot.poolByName: unknown pool "${name}"`);
    }
    return pools[name];
  },

  buildBrief({ path, sharedDNA, vibeDirective, vibeKey, medium, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`GothBot: unknown path "${path}"`);
    if (typeof builder === 'function') {
      return builder({ sharedDNA, vibeDirective, vibeKey, medium, picker });
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
    throw new Error(`GothBot: path "${path}" has invalid export shape`);
  },

  caption({ path }) {
    return `[${path}] GothBot`;
  },
};
