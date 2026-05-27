/**
 * BrickBot — full rewrite 2026-05-07 (branch: brickbot-rebuild).
 *
 * Architecture: subject is the path identity. Camera + lighting + palette
 * are AXES — camera is shared, lighting + palette are per-path pools that
 * narrow the mood to subject-appropriate ranges. Old camera-as-path
 * organization (cinematic, noir, micro) replaced by subject-as-path:
 * 13 distinct subject domains.
 *
 * Locked: vibe = cinematic only, model = flux-1.1-pro, medium = photography.
 *
 * Each render rolls:
 *   • SCENE from per-path scenes pool (~200 entries, 40% architecture/world,
 *     50% character story scenes with action verbs, 10% mood)
 *   • CAMERA from shared camera_axis pool (~40 entries — the variety knob)
 *   • LIGHTING from per-path lighting pool (~30 entries, subject-tinted)
 *   • PALETTE from per-path palette pool (~30 entries, subject-tinted)
 */

const pools = require('./pools');
const blocks = require('./shared-blocks');

const pathBuilders = {
  'macro-display': require('./paths/macro-display'),
  girly: require('./paths/girly'),
  'lego-masters': require('./paths/lego-masters'),
  western: require('./paths/western'),
  fantasy: require('./paths/fantasy'),
  space: require('./paths/space'),
  aquatic: require('./paths/aquatic'),
  winter: require('./paths/winter'),
  pirates: require('./paths/pirates'),
  mech: require('./paths/mech'),
  'theme-park': require('./paths/theme-park'),
  forest: require('./paths/forest'),
  landscape: require('./paths/landscape'),
};

module.exports = {
  username: 'brickbot',
  displayName: 'BrickBot',

  mediums: ['photography'],

  useModelPicker: true,
  allowedModels: ['black-forest-labs/flux-1.1-pro'],
  modelByPath: Object.fromEntries(
    pools.PATHS.map((p) => [p, { 'black-forest-labs/flux-1.1-pro': 100 }])
  ),

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  // Per-path prompt-prefix overrides — prepended BEFORE bot.promptPrefix.
  // Pirates: pushes cinematic deep-focus film-still framing to counter
  // Flux's "diorama / MOC showcase photography / natural bokeh" tilt-shift
  // bias. Tradeoff (noted 2026-05-22): tilt-shift was Flux's structural
  // signal that "everything in frame is LEGO" — without it some renders
  // treat backgrounds as photoreal. Net win in readability + establishing
  // shots; watch for not-LEGO backgrounds on future iterations.
  promptPrefixByPath: {
    pirates:
      'cinematic widescreen film frame, deep focus front-to-back, edge-to-edge sharpness, expansive establishing shot',
    space:
      'cinematic widescreen film frame, deep focus front-to-back, edge-to-edge sharpness, expansive establishing shot',
    // fantasy: NO deep-focus prefix — tilt-shift retained per playbook lesson 1
    // (Flux's "fantasy" training prior is heavily Hollywood-photoreal; tilt-shift
    // is the structural signal that "everything in frame is the LEGO model").
  },

  vibes: ['cinematic'],

  paths: pools.PATHS,

  // Flat rotation (2026-05-26): equal weight per path — every path posts
  // once per cycle in randomized order via the cycleAllPaths shuffle-bag.
  cycleAllPaths: true,

  chaos: {
    enabled: true,
    skipPaths: [],
    allowSubjectChaosPaths: pools.PATHS,
  },

  twoPassPolish: {
    enabled: true,
    conceptWords: 150,
    polishedWords: '70-100',
    // Axis-system paths default to polish OFF per the hard memory
    // `feedback_axis_system_skip_polish` — Haiku polish strips
    // curated axis language (build_technique vocab, register-locks,
    // scene-prop detail) when compressing 150 → 70-100 words.
    skipPaths: [
      'pirates',
      'space',
      'fantasy',
      'forest',
      'aquatic',
      'winter',
      'landscape',
      'theme-park',
      'western',
      'mech',
      'macro-display',
      'girly',
      'lego-masters',
    ],
  },

  // No sensoryAnchors — universal LEGO MOC photography mood is captured
  // in shared blocks + per-path lighting/palette already provides plenty
  // of sensory color. Adding a sensory pool would dilute the path identity.

  // Per-path bespoke pools live on `pools.PER_PATH[<path>]` (legacy) and as
  // top-level pool names on the bot for axis-system paths (e.g. pirates →
  // `BRICKBOT_PIRATES_SCENE_TYPE`, `BRICKBOT_PIRATES_MINIFIG_ACTION`, etc.).
  // Composer resolves path-bespoke slots via `pathConfig.pools` → `bot.poolByName`.
  poolByName(name) {
    if (!(name in pools)) {
      throw new Error(`BrickBot.poolByName: unknown pool "${name}"`);
    }
    return pools[name];
  },

  rollSharedDNA({ picker }) {
    return {
      camera: picker.pickWithRecency(pools.CAMERA_AXIS, 'camera'),
    };
  },

  buildBrief({ path, sharedDNA, vibeDirective, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`BrickBot: unknown path "${path}"`);
    if (typeof builder === 'function') {
      return builder({ sharedDNA, vibeDirective, picker, pools });
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
    throw new Error(`BrickBot: path "${path}" has invalid export shape`);
  },

  caption({ path }) {
    return `[${path}] BrickBot`;
  },
};
