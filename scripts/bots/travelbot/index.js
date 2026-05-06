/**
 * TravelBot — the bot-engine contract.
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
 */

const earthPools = require('./earth/pools');
const beachPools = require('./beach/pools');

// Path builders — copied verbatim from each source bot's paths/ dir.
const pathBuilders = {
  // Earth paths (10 active in source)
  'epic-vista': require('./earth/paths/epic-vista'),
  'weather-drama': require('./earth/paths/weather-drama'),
  'hidden-corner': require('./earth/paths/hidden-corner'),
  'dramatic-sky': require('./earth/paths/dramatic-sky'),
  'luminous-landscape': require('./earth/paths/luminous-landscape'),
  'sacred-light': require('./earth/paths/sacred-light'),
  'national-parks': require('./earth/paths/national-parks'),
  'seasonal-shift': require('./earth/paths/seasonal-shift'),
  'geological-wonder': require('./earth/paths/geological-wonder'),
  'micro-nature': require('./earth/paths/micro-nature'),
  'deep-forest': require('./earth/paths/deep-forest'),
  'lush-jungle': require('./earth/paths/lush-jungle'),
  // Beach paths (13)
  'coastal-vista': require('./beach/paths/coastal-vista'),
  wave: require('./beach/paths/wave'),
  'tropical-paradise': require('./beach/paths/tropical-paradise'),
  'beach-landscape': require('./beach/paths/beach-landscape'),
  'tide-pool': require('./beach/paths/tide-pool'),
  'beach-moment': require('./beach/paths/beach-moment'),
  'cozy-beach': require('./beach/paths/cozy-beach'),
  'hawaii-flowers': require('./beach/paths/hawaii-flowers'),
  'reef-paradise': require('./beach/paths/reef-paradise'),
  'big-wave': require('./beach/paths/big-wave'),
  seashell: require('./beach/paths/seashell'),
  'beach-night': require('./beach/paths/beach-night'),
  'epic-sunset': require('./beach/paths/epic-sunset'),
};

const EARTH_PATHS = [
  'epic-vista',
  'weather-drama',
  'hidden-corner',
  'dramatic-sky',
  'luminous-landscape',
  'sacred-light',
  'national-parks',
  'seasonal-shift',
  'geological-wonder',
  'micro-nature',
  'deep-forest',
  'lush-jungle',
];

const BEACH_PATHS = [
  'coastal-vista',
  'wave',
  'tropical-paradise',
  'beach-landscape',
  'tide-pool',
  'beach-moment',
  'cozy-beach',
  'hawaii-flowers',
  'reef-paradise',
  'big-wave',
  'seashell',
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
// TravelBot 2026-05-05. Combined with the locked travelbot_hyperreal medium
// + locked flux-1.1-pro model, the bot has a fully homogeneous lighting
// identity (teal-and-orange cinematic grade across all renders). Variety
// comes entirely from the 25 path-specific scene pools.
const TRAVEL_VIBES = ['cinematic'];

// Helpers to build per-path config objects without manual repetition.
const byPath = (paths, value) => paths.reduce((acc, p) => ({ ...acc, [p]: value }), {});

module.exports = {
  username: 'travelbot',
  displayName: 'TravelBot',

  // Shuffle-bag — all 23 paths visit before any repeats. ~11.5 days at
  // 2 posts/day. Same pattern OceanBot used for path coverage.
  cycleAllPaths: true,

  // Locked to a single custom hyperreal Unreal-Engine-style medium across
  // all 25 paths. travelbot_hyperreal is a bot-only DB row in dream_mediums
  // (is_active: false, is_bot_only: true) — never exposed to user pickers.
  // Its flux_fragment in the DB IS the override; no mediumStyles entry
  // needed since there's no DB fragment to replace.
  defaultMedium: 'travelbot_hyperreal',

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
  chaos: {
    enabled: true,
    skipPaths: [],
    allowSubjectChaosPaths: [...BEACH_PATHS],
  },

  // Two-pass polish — both bots use identical config.
  twoPassPolish: {
    enabled: true,
    conceptWords: 150,
    polishedWords: '65-90',
    polishedWordsByPath: {},
    preservePhrasesByPath: {},
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

  buildBrief({ path, sharedDNA, vibeDirective, vibeKey, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`TravelBot: unknown path "${path}"`);
    return builder({ sharedDNA, vibeDirective, vibeKey, picker });
  },

  caption({ path }) {
    return `[${path}] TravelBot`;
  },
};
