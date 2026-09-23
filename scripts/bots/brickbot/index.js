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
  'lego-city': require('./paths/lego-city'), // Stage B1 SHADOW
  'lego-trains': require('./paths/lego-trains'), // Stage B2 SHADOW
  'haunted-brick': require('./paths/haunted-brick'), // Stage B3 SHADOW
  'airfield-biplanes': require('./paths/airfield-biplanes'), // aviation path (2026-09-23) SHADOW
  'balloon-festival': require('./paths/balloon-festival'), // mass-ascension path (2026-09-23) SHADOW
  'archaeology-dig': require('./paths/archaeology-dig'), // excavation path (2026-09-23) SHADOW
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
  modelByPath: {
    // archaeology-dig — EXPLICIT INTENT, not a mechanical requirement. The build report
    // claimed a code-only medium forces this because pickModel has no `allowed_models`
    // row; I checked, and that is not what happens: an unknown medium key makes
    // mediumModelsCache.get() return undefined and pickModel falls THROUGH to its final
    // fallback, which picks from `allowedModels` above (modelPicker.js ~270). With
    // allowedModels = [pro, ultra] and no modelWeights, that fallback is already a
    // uniform pro/ultra pick, so this entry is equivalent to it today. It is kept because
    // it states the intent and survives a future change to allowedModels.
    // It is a 50/50 SPLIT and not a pin ON PURPOSE: the R1 model probe was a NULL
    // (pro 2.43 vs ultra 2.20 at n=3 per arm, below resolution — lesson 42), both arms
    // failed identically, and BrickBot only allows these two. Do not tidy it into a pin.
    'archaeology-dig': {
      'black-forest-labs/flux-1.1-pro': 50,
      'black-forest-labs/flux-1.1-pro-ultra': 50,
    },
  },
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
  // mediumByPath — NEW on this bot. LOAD-BEARING and the largest measured lever in the
  // archaeology-dig build (+0.78 on the round average). BrickBot's stock wrapper is 83
  // words in three stacked layers (promptPrefixByPath 15 + promptPrefix 55 + the
  // `photography` DB flux_fragment 27), which put the scene start at 19-34% of the emitted
  // prompt — every path law past the ~30% attention cliff — even though every law was
  // already in 6 of 6 prompts. The fragment's CONTENT is hostile too: "natural bokeh,
  // accurate skin tones, photographic realism" (bokeh on a path whose differentiator is a
  // background surface, skin tones on a bot that renders plastic). A 28-word path-own
  // medium took scene start to 8-16%, colour bands 1/6 -> 6/6, corridors 4/6 -> 1/6,
  // round avg 2.32 -> 3.10. Code-only: no dream_mediums row needed, because
  // fetchMediumFluxFragment returns '' on an unknown key and mediumStyles overrides it.
  mediumByPath: { 'archaeology-dig': 'brickbot_dig' },

  mediumStyles: {
    brickbot_gpt_clean: blocks.GPT_CLEAN,
    brickbot_dig:
      'every element brick-built with visible studs and plate seams, moulded plastic, minifigure scale, tabletop convention display',
  },
  // cleanMediumByModel retired 2026-06-21 — only ever routed Nano Banana / gpt-2,
  // both now banned bot-wide (FLUX-only).
  cleanMediumByModel: {},
  promptPrefixByMedium: {
    brickbot_gpt_clean: '',
    // brickbot_dig REPLACES bot.promptPrefix for this path, so it also carries the
    // deep-focus lever that would otherwise live in promptPrefixByPath (which this path
    // deliberately has NO entry in). Merged into this existing map rather than declared
    // twice: a duplicate promptPrefixByMedium key silently overwrites the first.
    brickbot_dig: 'LEGO brick diorama photographed in deep focus front to back, edge-to-edge sharp',
  },

  // Per-path prompt-prefix overrides — prepended BEFORE bot.promptPrefix.
  // Pirates: pushes cinematic deep-focus film-still framing to counter
  // Flux's "diorama / MOC showcase photography / natural bokeh" tilt-shift
  // bias. Tradeoff (noted 2026-05-22): tilt-shift was Flux's structural
  // signal that "everything in frame is LEGO" — without it some renders
  // treat backgrounds as photoreal. Net win in readability + establishing
  // shots; watch for not-LEGO backgrounds on future iterations.
  promptPrefixByPath: {
    // REQUIRED, not cosmetic: BrickBot's `photography` medium fragment carries "natural bokeh",
    // and without this override 4 of 6 first-batch renders collapsed to a hero-on-bokeh product
    // shot with the airfield behind it an unreadable smear.
    // REQUIRED, not cosmetic: the subject is a SKY FULL of balloons, and the bot's
    // photography medium fragment carries "natural bokeh" — without this the fleet
    // bokehs away into orbs and the path's whole identity goes with it.
    'balloon-festival':
      'cinematic widescreen film frame, deep focus front-to-back, edge-to-edge sharpness, expansive establishing shot',
    'airfield-biplanes':
      'cinematic widescreen film frame, deep focus front-to-back, edge-to-edge sharpness, expansive establishing shot',
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
    // lego-city (SHADOW): wide-establishing modern City MOC — deep-focus prefix so
    // the whole build (downtown block, harbor, callout) reads front-to-back as LEGO,
    // countering Flux's tilt-shift/diorama bias on street scenes.
    'lego-city':
      'cinematic widescreen film frame, deep focus front-to-back, edge-to-edge sharpness, expansive establishing shot',
    // lego-trains (SHADOW): wide-establishing rail MOC — deep-focus so the whole
    // train + viaduct reads front-to-back as brick, countering tilt-shift/diorama bias.
    'lego-trains':
      'cinematic widescreen film frame, deep focus front-to-back, edge-to-edge sharpness, expansive establishing shot',
    // fantasy: NO deep-focus prefix — tilt-shift retained per playbook lesson 1
    // (Flux's "fantasy" training prior is heavily Hollywood-photoreal; tilt-shift
    // is the structural signal that "everything in frame is the LEGO model").
  },

  vibes: ['cinematic'],

  paths: pools.PATHS,

  // Dark-launched paths — renderable via `iter-bot --mode <path> --post`
  // (shadow posts, admin-only), NOT in live rotation until promoted into PATHS.
  // ⚠ GO-LIVE TRAP: while this sits in shadowPaths it is NOT in PATHS, so the legacy PER_PATH loop
  // never looks for a legacy pool triplet. On go-live it must be added to PATHS *and* to
  // SKIP_LEGACY_PER_PATH in the SAME edit — PATHS alone makes pools.js call
  // load('airfield_biplanes_scenes') and throw at require time, taking the whole bot down.
  shadowPaths: ['airfield-biplanes', 'balloon-festival', 'archaeology-dig'], // Stage B paths promoted to live rotation 2026-08-16

  // Flat rotation (2026-05-26): equal weight per path — every path posts
  // once per cycle in randomized order via the cycleAllPaths shuffle-bag.
  cycleAllPaths: true,

  chaos: {
    enabled: true,
    // Stage B shadow paths ran with chaos OFF (they weren't in allowSubjectChaosPaths
    // = pools.PATHS while shadow). Now they're in PATHS, so skip them explicitly to
    // preserve the exact approved-shadow behavior (XEROX — do not newly-apply chaos).
    // 'archaeology-dig' is inert TODAY and load-bearing AT GO-LIVE: allowSubjectChaosPaths
    // is pools.PATHS, so the day the string enters PATHS chaos newly switches on and the
    // approved look diverges from what was graded.
    skipPaths: [
      'lego-city',
      'lego-trains',
      'haunted-brick',
      'airfield-biplanes',
      'balloon-festival',
      'archaeology-dig',
    ],
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
      'balloon-festival',
      'archaeology-dig',
      'airfield-biplanes',
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
      'lego-city',
      'lego-trains',
      'haunted-brick',
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
