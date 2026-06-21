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
const { ALL_ENABLED_AI_MODELS } = require('../../lib/imageModels');

const pathBuilders = {
  'macro-display': require('./paths/macro-display'),
  'crazy-islands': require('./paths/crazy-islands'),
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
  'lego-landscapes': require('./paths/lego-landscapes'),
};

module.exports = {
  username: 'brickbot',
  displayName: 'BrickBot',

  mediums: ['photography'],

  useModelPicker: true,
  // Banned 2026-06-02: flux-2-flex (Kevin heart-ban).
  // Banned 2026-06-02: flux-2-max (Kevin heart-ban).
  // Nano Banana banned fleet-wide 2026-06-21 (Kevin) — bots are FLUX-ONLY.
  allowedModels: ['black-forest-labs/flux-1.1-pro', 'black-forest-labs/flux-1.1-pro-ultra'],
  // Per-path model pins land here when a specific path needs a specific model.
  modelByPath: {},
  // (history) modelByPath was previously Object.fromEntries(
  //   pools.PATHS.map(p => [p, {'flux-1.1-pro': 100}])) — every path
  // weighted-pinned to 100% flux-1.1-pro, which OVERRODE the 4-model
  // allowedModels lineup above. Removed 2026-05-31. Per-path pins now
  // only land here when a specific path needs a specific model.

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  // nano-banana clean-render override (2026-06-07). This model reads the
  // MOC-photography prefix/suffix as "go abstract"; the clean medium
  // (+ empty promptPrefixByMedium) lets the seed's LEGO build lead.
  mediumStyles: {
    brickbot_gpt_clean: blocks.GPT_CLEAN,
  },
  // cleanMediumByModel retired 2026-06-21 — only ever routed Nano Banana / gpt-2,
  // both now banned bot-wide (FLUX-only).
  cleanMediumByModel: {},
  promptPrefixByMedium: {
    brickbot_gpt_clean: '',
  },

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
    // macro-display: deep-focus prefix to reduce tilt-shift (Kevin 2026-05-27).
    // This EXACT prefix is the hearted R2 state — Kevin hearted 2 posts from this
    // config and asked to restore it (chose it over the later negation-removal +
    // f/22 depth-of-field iterations, which didn't beat it). Leave as-is.
    'macro-display':
      'cinematic widescreen film frame, deep focus front-to-back, edge-to-edge tack-sharp, expansive establishing shot, everything in crisp focus',
    // crazy-islands: carries macro-display's hearted deep-focus prefix VERBATIM
    // (2026-05-27) — Kevin's hearted island renders used exactly this style block.
    'crazy-islands':
      'cinematic widescreen film frame, deep focus front-to-back, edge-to-edge tack-sharp, expansive establishing shot, everything in crisp focus',
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
      'crazy-islands',
      'girly',
      'lego-masters',
      'lego-landscapes',
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
