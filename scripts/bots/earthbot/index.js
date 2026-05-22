/**
 * EarthBot — the bot-engine contract.
 *
 * The most breathtaking destinations on Earth — landscape grandeur AND
 * tropical-coast paradise. Adventure, vacation, gawk-worthy. Real geography
 * amplified beyond what any camera could capture.
 *
 * Built as a pure consolidation of EarthBot + BeachBot. Path files, pools,
 * shared-blocks, and seed pools live verbatim in earth/ and beach/
 * sub-namespaces. This index.js is the only NEW file — it merges the two
 * source bots' configs while preserving each path's source-bot rendering
 * behavior (zero output drift).
 *
 * Per-path config split:
 *   - Earth paths use earth/ namespace (pools, blocks, prefix/suffix, sensory)
 *   - Beach paths use beach/ namespace (pools, blocks, prefix/suffix, sensory)
 *
 * Single deliberate consolidation: the bot uses EarthBot's 5-medium list
 * across all paths (photography/canvas/watercolor/illustration/pencil).
 *
 * ═══════════════════════════════════════════════════════════════════════
 * AXIS-SYSTEM MIGRATION ROADMAP (2026-05-22 final — consolidation complete)
 * ═══════════════════════════════════════════════════════════════════════
 *
 * Final inventory: 17 paths (was 25 — 8 dropped via consolidation / kills).
 *
 * MIGRATED (16 of 17 — 1 legacy path remaining):
 *   ✓ epic-vista — canonical reference (BOT_SCENE_QUALITY_PLAYBOOK.md)
 *   ✓ national-parks (US National Parks amplified)
 *   ✓ deep-forest (old-growth temperate forest cathedrals)
 *   ✓ lush-jungle (tropical rainforest)
 *   ✓ coastal-vista (dramatic craggy coast)
 *   ✓ tropical-paradise (palm-fringed paradise coast)
 *   ✓ epic-sunset (once-in-a-lifetime tropical sunsets)
 *   ✓ hawaii-flowers (Hawaiian coast + tropical flowers)
 *   ✓ geological-wonder (cave / hoodoo / salt-flat / etc)
 *   ✓ reef-paradise (island-bay aesthetic — pivoted from underwater coral)
 *   ✓ sacred-light (transcendent natural-light moments)
 *   ✓ beach-night (magical tropical beach at night)
 *   ✓ waves (MERGE of legacy wave + big-wave)
 *   ✓ cozy-beach (intimate cozy beach moments — v2 pivot)
 *   ✓ seasonal-shift (autumn density + spring superbloom, 6 bespoke
 *     season-tagged axes + 3 reused EPIC_VISTA — 2026-05-22)
 *   ✓ hidden-corner (off-the-beaten-path intimate nature pockets, 7
 *     bespoke axes + 1 conditional phenomenon, supernatural-drift hard-
 *     ban — 2026-05-22)
 *
 * REMAINING TO MIGRATE (1 legacy path):
 *   - tide-pool (macro biological coastal detail)
 *
 * DROPPED (8 paths fully subsumed or killed, no migration):
 *   ✗ luminous-landscape (subsumed by sacred-light — 2026-05-22)
 *   ✗ beach-landscape (subsumed by coastal-vista + tropical-paradise — 2026-05-22)
 *   ✗ wave + big-wave (MERGED into waves — 2026-05-22)
 *   ✗ beach-moment + seashell (subsumed by cozy-beach v2 — 2026-05-22)
 *   ✗ dramatic-sky + weather-drama (sky-drama merge attempted + killed
 *     2026-05-22; legacy paths also dropped since they had heavy triggers)
 *   ✗ micro-nature (killed 2026-05-22 — extreme-macro path off-brand for
 *     EarthBot wide-cinematic identity, no aesthetic fit)
 */

const earthPools = require('./earth/pools');
const beachPools = require('./beach/pools');
// Flat top-level pools registry for axis-system migrated paths.
// Legacy paths keep loading from earth/pools.js or beach/pools.js until
// they migrate. Both registries can coexist.
const axisPools = require('./pools');

// Path builders — function-form for legacy paths, declarative
// { archetype, pools } object for axis-system migrated paths.
const pathBuilders = {
  // Earth paths
  'epic-vista': require('./paths/epic-vista'), // axis-system (2026-05-20)
  'hidden-corner': require('./paths/hidden-corner'), // axis-system (2026-05-22)
  'sacred-light': require('./paths/sacred-light'), // axis-system (2026-05-21)
  'national-parks': require('./paths/national-parks'), // axis-system (2026-05-20)
  'seasonal-shift': require('./paths/seasonal-shift'), // axis-system (2026-05-22)
  'geological-wonder': require('./paths/geological-wonder'), // axis-system (2026-05-21)
  'deep-forest': require('./paths/deep-forest'), // axis-system (2026-05-20)
  'lush-jungle': require('./paths/lush-jungle'), // axis-system (2026-05-20)
  // Beach paths
  'coastal-vista': require('./paths/coastal-vista'), // axis-system (2026-05-20)
  waves: require('./paths/waves'), // axis-system MERGE of legacy wave + big-wave (2026-05-22)
  'tropical-paradise': require('./paths/tropical-paradise'), // axis-system (2026-05-20)
  'tide-pool': require('./beach/paths/tide-pool'),
  'cozy-beach': require('./paths/cozy-beach'), // axis-system (2026-05-22)
  'hawaii-flowers': require('./paths/hawaii-flowers'), // axis-system (2026-05-21)
  'reef-paradise': require('./paths/reef-paradise'), // axis-system (2026-05-21)
  'beach-night': require('./paths/beach-night'), // axis-system (2026-05-21)
  'epic-sunset': require('./paths/epic-sunset'), // axis-system (2026-05-20)
};

const EARTH_PATHS = [
  'epic-vista',
  'hidden-corner',
  'sacred-light',
  'national-parks',
  'seasonal-shift',
  'geological-wonder',
  'deep-forest',
  'lush-jungle',
];

const BEACH_PATHS = [
  'coastal-vista',
  'waves', // MERGED from legacy wave + big-wave (2026-05-22)
  'tropical-paradise',
  'tide-pool',
  'cozy-beach',
  'hawaii-flowers',
  'reef-paradise',
  'beach-night',
  'epic-sunset',
];

const ALL_PATHS = [...EARTH_PATHS, ...BEACH_PATHS];

// Source bot prefixes/suffixes — preserved verbatim, applied per path via
// promptPrefixByPath / promptSuffixByPath so each path renders exactly like
// it did in its source bot.
const EARTH_PREFIX =
  'cinematic photography, sharp detail, rich saturated color, hyperreal rendering, gallery-quality, masterpiece';
const EARTH_SUFFIX =
  'no humans, no people, no text, no words, no watermarks, hyper detailed, masterpiece quality';
const BEACH_PREFIX =
  'travel photography, sharp detail, dramatic saturated color, hyperreal rendering, wallpaper-worthy, masterpiece';
const BEACH_SUFFIX =
  'no text, no words, no watermarks, hyper detailed, masterpiece quality';

// Locked to cinematic only — Kevin's preferred single-vibe lock for
// EarthBot 2026-05-05. Combined with the locked earthbot_hyperreal medium
// + locked flux-1.1-pro model, the bot has a fully homogeneous lighting
// identity (teal-and-orange cinematic grade across all renders). Variety
// comes entirely from the 25 path-specific scene pools.
const TRAVEL_VIBES = ['cinematic'];

// Helpers to build per-path config objects without manual repetition.
const byPath = (paths, value) => paths.reduce((acc, p) => ({ ...acc, [p]: value }), {});

module.exports = {
  username: 'earthbot',
  displayName: 'EarthBot',

  // Shuffle-bag — all 23 paths visit before any repeats. ~11.5 days at
  // 2 posts/day. Same pattern OceanBot used for path coverage.
  cycleAllPaths: true,

  // Locked to a single custom hyperreal Unreal-Engine-style medium across
  // all 25 paths. earthbot_hyperreal is a bot-only DB row in dream_mediums
  // (is_active: false, is_bot_only: true) — never exposed to user pickers.
  // Its flux_fragment in the DB IS the override; no mediumStyles entry
  // needed since there's no DB fragment to replace.
  defaultMedium: 'earthbot_hyperreal',

  // Bot-level prefix/suffix kept empty so the per-path overrides below
  // are the SOLE prefix/suffix sources. Engine prepends promptPrefixByPath
  // and (post-extension c4ceffa) reads promptSuffixByPath as the first-
  // checked suffix source.
  promptPrefix: '',
  promptSuffix: '',

  // Per-path prefix override — engine prepends this before any bot-level
  // prefix. Since bot.promptPrefix is empty, this becomes the ENTIRE prefix
  // applied to that path's render, identical to source bot behavior.
  promptPrefixByPath: {
    ...byPath(EARTH_PATHS, EARTH_PREFIX),
    ...byPath(BEACH_PATHS, BEACH_PREFIX),
  },

  // Per-path suffix override — engine reads this BEFORE promptSuffixByMedium
  // and bot.promptSuffix (engine extension c4ceffa). EarthBot's suffix
  // includes the load-bearing "no humans, no people" Flux-level safeguard;
  // BeachBot's suffix lacks it (Beach allows scale-objects in its NO_PEOPLE
  // brief block, doesn't rely on Flux suffix).
  promptSuffixByPath: {
    ...byPath(EARTH_PATHS, EARTH_SUFFIX),
    ...byPath(BEACH_PATHS, BEACH_SUFFIX),
  },

  // Single unified vibe list across all 25 paths (no vibesByPath split).
  // Post-audit list cuts whimsical / coquette / surreal — see TRAVEL_VIBES
  // declaration above for rationale.
  vibes: TRAVEL_VIBES,

  paths: ALL_PATHS,
  pathWeights: byPath(ALL_PATHS, 1),

  // Both source bots used flux-dev + flux-1.1-pro via the model picker.
  // Earth used useModelPicker:true + allowedModels at bot level; Beach
  // used modelByPath. Same effective allowed set — using the simpler
  // bot-level config here.
  // Locked to flux-1.1-pro only — highest-fidelity Flux model for the
  // hyperreal look. Picker semantics retained but with a single allowed
  // model so every render is the same quality.
  useModelPicker: true,
  allowedModels: ['black-forest-labs/flux-1.1-pro'],

  // Chaos layer — both source bots had chaos enabled. Earth had no
  // subject-chaos (allowSubjectChaosPaths: []) because there's no human
  // subject to deform. Beach allowed subject-chaos on all paths. For zero
  // drift, only Beach paths get subject-chaos here.
  // 2026-05-20: epic-vista skipPaths-added — perception-distortion
  // (geometry / reflection / scale / framing) actively fights the
  // real-Earth identity. As each Earth path migrates to axis-system,
  // add it here.
  chaos: {
    enabled: true,
    skipPaths: ['epic-vista', 'national-parks', 'deep-forest', 'lush-jungle', 'coastal-vista', 'tropical-paradise', 'epic-sunset', 'hawaii-flowers', 'reef-paradise', 'geological-wonder', 'sacred-light', 'beach-night', 'waves', 'cozy-beach', 'seasonal-shift', 'hidden-corner'],
    allowSubjectChaosPaths: [...BEACH_PATHS.filter((p) => !['coastal-vista', 'tropical-paradise', 'epic-sunset', 'hawaii-flowers', 'reef-paradise', 'waves', 'cozy-beach', 'seasonal-shift', 'hidden-corner', 'beach-night'].includes(p))],
  },

  // Two-pass polish — both bots use identical config.
  // 2026-05-20: epic-vista skipPaths-added — setting-as-hero scene path,
  // polish compression strips location/geography language. As each Earth
  // path migrates to axis-system, add it here.
  twoPassPolish: {
    enabled: true,
    conceptWords: 150,
    polishedWords: '65-90',
    polishedWordsByPath: {},
    preservePhrasesByPath: {},
    skipPaths: ['epic-vista', 'national-parks', 'deep-forest', 'lush-jungle', 'coastal-vista', 'tropical-paradise', 'epic-sunset', 'hawaii-flowers', 'reef-paradise', 'geological-wonder', 'sacred-light', 'beach-night', 'waves', 'cozy-beach', 'seasonal-shift', 'hidden-corner'],
  },

  // Sensory anchors — both bots use 'scene' as the sole context, but their
  // sensory pools have different content (different seed JSON files in each
  // bot's seeds/ dir). Routing each path to its source's context name
  // ('earth-scene' vs 'beach-scene') keeps each path drawing from its
  // source's sensory pool, identical to source behavior.
  sensoryAnchors: {
    enabled: true,
    requiredChannels: ['lightcolor'],
    pathContext: {
      ...byPath(EARTH_PATHS, 'earth-scene'),
      ...byPath(BEACH_PATHS, 'beach-scene'),
    },
    poolsByContextAndChannel: {
      'earth-scene': earthPools.SENSORY_POOLS.scene,
      'beach-scene': beachPools.SENSORY_POOLS.scene,
    },
  },

  rollSharedDNA({ vibeKey, path, picker }) {
    if (EARTH_PATHS.includes(path)) {
      // EarthBot's rollSharedDNA: scenePalette + colorPalette
      return {
        scenePalette: picker.pickWithRecency(earthPools.SCENE_PALETTES, 'scene_palette'),
        colorPalette: earthPools.VIBE_COLOR[vibeKey] || earthPools.VIBE_COLOR.cinematic,
      };
    }
    // BeachBot's rollSharedDNA: colorPalette only (no scenePalette)
    return {
      colorPalette: beachPools.VIBE_COLOR[vibeKey] || beachPools.VIBE_COLOR.cinematic,
    };
  },

  // Pool lookup for axis-system paths (reads from the flat pools.js registry).
  // Legacy function-form paths don't call this — they import their pools
  // directly from earth/pools.js or beach/pools.js.
  poolByName(name) {
    if (!(name in axisPools)) {
      throw new Error(`EarthBot.poolByName: unknown pool "${name}"`);
    }
    return axisPools[name];
  },

  // No bot-level default pools — every axis-system path on EarthBot
  // declares its own bespoke pools. Empty defaultPools mean the composer
  // requires path-supplied pool for every axis the archetype declares.
  defaultPools: {},

  buildBrief({ path, sharedDNA, vibeDirective, vibeKey, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`EarthBot: unknown path "${path}"`);
    // Declarative axis-system paths export { archetype, pools }.
    // Legacy paths export a function. Dispatch on shape.
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
    if (typeof builder === 'function') {
      return builder({ sharedDNA, vibeDirective, vibeKey, picker });
    }
    throw new Error(`EarthBot: path "${path}" has invalid export shape`);
  },

  caption({ path }) {
    return `[${path}] EarthBot`;
  },
};
