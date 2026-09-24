/**
 * TinyBot — the bot-engine contract.
 *
 * Clever + cute + "WHOA look at THAT" miniature magic. Tilt-shift / macro /
 * dollhouse obsessive-detail. Scene-centric.
 */

const pools = require('./pools');
const blocks = require('./shared-blocks');

const pathBuilders = {
  // MOVED from ToyBot 2026-09-23 on Kevin's call. Approved there at ~4.47, but it is a
  // contained miniature world seen through cropped glass, which is TinyBot's subject
  // rather than ToyBot's. Its look rides promptPrefixByMedium below, carried over
  // verbatim from the approved ToyBot config so the graded renders still describe
  // what ships.
  'snow-globe-world': require('./paths/snow-globe-world'),
  diorama: require('./paths/diorama'),
  'miniature-landscape': require('./paths/miniature-landscape'),
  'macro-nature': require('./paths/macro-nature'),
  'miniature-urban': require('./paths/miniature-urban'),
  'tiny-cozy': require('./paths/tiny-cozy'),
  'contained-worlds': require('./paths/contained-worlds'),
  'micro-fantasy': require('./paths/micro-fantasy'),
  'miniature-industry': require('./paths/miniature-industry'),
  'cottage-village': require('./paths/cottage-village'),
  'mushroom-village': require('./paths/mushroom-village'),
  'pastel-village': require('./paths/pastel-village'),
  'enchanted-village': require('./paths/enchanted-village'),
  'tiny-beach': require('./paths/tiny-beach'),
  'tiny-food-world': require('./paths/tiny-food-world'),
  'tiny-vehicles': require('./paths/tiny-vehicles'),
  // Stage N (SHADOW, dark-launch) — festival/village scene paths. Renderable
  // ONLY by explicit --mode; never auto-posted publicly (see shadowPaths).
  'tiny-winter-village': require('./paths/tiny-winter-village'),
  'tiny-night-market': require('./paths/tiny-night-market'),
  'tiny-carnival': require('./paths/tiny-carnival'),
  // Halloween seasonal candidates — promoted from AlphaBot 2026-09-07 (QA'd
  // and approved by Kevin). Wired ONLY into seasonalPaths.halloween below,
  // never into paths[] — see that array's comment.
  'tiny-halloween-village': require('./paths/tiny-halloween-village'),
  'tiny-halloween-hideaway': require('./paths/tiny-halloween-hideaway'),
  'tiny-pumpkin-patch': require('./paths/tiny-pumpkin-patch'),
  'tiny-haunted-hollow': require('./paths/tiny-haunted-hollow'),
};

// Dark-launch set — reachable only via explicit --path/--mode; posts hidden
// (is_public=false, shadow=true), visible only to the supreme admin via
// get_shadow_feed. Going live = move a string into `paths` below.
const TINY_SHADOW_PATHS = ['tiny-winter-village', 'tiny-night-market', 'tiny-carnival'];

module.exports = {
  username: 'tinybot',
  displayName: 'TinyBot',

  // 'animation' dropped 2026-08-06 (Kevin): its DB flux_fragment is a face-swap
  // CHARACTER medium ("Disney Pixar character … a bearded adult man, rendered
  // large in the foreground") that force-injected a person into scene renders.
  // 'storybook' + 'handcrafted' dropped 2026-08-12 (Kevin) for the SAME reason:
  // both are face-swap CHARACTER mediums ("cartoon character of the person … a
  // bearded adult man, rendered large in the foreground"). Removed from TinyBot's
  // roll ONLY — they stay valid app face-swap mediums in the DB. Seeds were clean;
  // the medium was the culprit. Left: photography / claymation / render.
  mediums: ['photography', 'claymation', 'render'],

  // Banned (2026-06-01 Kevin): flux-2-flex.
  useModelPicker: true,
  allowedModels: ['black-forest-labs/flux-1.1-pro', 'black-forest-labs/flux-1.1-pro-ultra'],

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  // surreal cut 2026-07-03 (off-brand vibe audit) — miniature scale-play is
  // already the bot's premise; dream-logic melt on crafted dioramas reads broken.
  vibes: [
    'cinematic',
    'cozy',
    'nostalgic',
    'peaceful',
    'whimsical',
    'ethereal',
    'ancient',
    'enchanted',
    'shimmer',
    // 'pastel-dream' — VIBE_COLOR registered in pools.js but NOT in DB
    // dream_vibes table. To activate, insert row into dream_vibes first.
  ],

  paths: [
    'diorama',
    'miniature-landscape',
    'macro-nature',
    'miniature-urban',
    'tiny-cozy',
    'contained-worlds',
    'micro-fantasy',
    'miniature-industry',
    'cottage-village',
    'mushroom-village',
    'pastel-village',
    'enchanted-village',
    'tiny-beach',
    'tiny-food-world',
    'tiny-vehicles',
    // Stage N — promoted to live rotation 2026-08-16 (scaled to production;
    // faithful xerox — TINY_SHADOW_PATHS const KEPT so these stay in
    // allowSubjectChaosPaths (chaos-able, as in shadow); polish ON (unchanged)).
    'tiny-winter-village',
    'tiny-night-market',
    'tiny-carnival',
    // snow-globe-world — promoted to live rotation 2026-09-24 on Kevin's word after its worlds
    // pool was grown 25 → 104 (RESEED_STATUS.md Track B row 1) and 12 forced shadow renders on
    // this bot read clean (flux-1.1-pro 12/12 delivered). Faithful xerox: the four snow-globe
    // config keys below are unchanged.
    'snow-globe-world',
  ],

  // Seasonal-window-gated paths (botSeasonal.js) — drawn ONLY when
  // engine_config.bots_seasonal_enabled is true AND the named holiday window
  // (public.holidays) is calendar-active. NEVER add these to paths[] above —
  // that would fire them in normal year-round rotation, exactly what this
  // mechanism exists to prevent. Promoted from AlphaBot 2026-09-07 (QA'd and
  // approved by Kevin); master switch defaults OFF so this changes nothing
  // live until Kevin flips it for the season.
  seasonalPaths: {
    halloween: [
      'tiny-halloween-village',
      'tiny-halloween-hideaway',
      'tiny-pumpkin-patch',
      'tiny-haunted-hollow',
    ],
  },

  // Stage N paths promoted to live rotation 2026-08-16 (shadowPaths emptied;
  // TINY_SHADOW_PATHS const retained — still drives allowSubjectChaosPaths below).
  // snow-globe-world left here for paths[] on 2026-09-24 (re-validated on this bot first).
  shadowPaths: [],

  // Flat rotation (2026-05-26): equal weight per path — every path posts
  // once per cycle in randomized order via the cycleAllPaths shuffle-bag.
  cycleAllPaths: true,

  // ── snow-globe-world config, moved from ToyBot ──────────────────────────────
  // TinyBot had none of these four keys; they exist solely for this path, and every
  // value is carried over verbatim rather than re-derived.
  modelByPath: {
    // ultra was measured OUT on ToyBot: it frames tighter and loses the cropped-glass
    // arc that IS this path.
    'snow-globe-world': { 'black-forest-labs/flux-1.1-pro': 100 },
  },
  mediumByPath: { 'snow-globe-world': 'snow_globe_diorama' },
  promptPrefixByMedium: {
    // The whole look rides this string: there is no dream_mediums row and no
    // mediumStyles entry, matching how it worked on ToyBot. The 9/9 glass spec is the
    // cropped arc across the top corners — do not trim it.
    snow_globe_diorama:
      'extreme close-up shot through the thick curved glass wall of a snow globe, the bright wet glass arcing across the top corners of the picture and running off its edges, the whole tiny world inside filling the rest of the frame edge to edge, deep focus front to back with edge-to-edge sharpness so its own far distance and its own lit windows and its own road all stay readable, fine specks suspended in the water in front of it, hand-painted plaster and resin miniature with visible brush-marks, warm practical light raking in from one side through the water, tactile painted-miniature and wet-glass texture',
  },
  vibesByPath: {
    'snow-globe-world': ['cinematic', 'epic', 'nostalgic', 'whimsical', 'shimmer'],
  },

  chaos: {
    enabled: true,
    skipPaths: [
      'snow-globe-world',
      // Halloween seasonal candidates (promoted from AlphaBot 2026-09-07) —
      // protect the curated MVP composition; matches AlphaBot QA config.
      'tiny-halloween-village',
      'tiny-halloween-hideaway',
      'tiny-pumpkin-patch',
      'tiny-haunted-hollow',
    ],
    allowSubjectChaosPaths: [
      'diorama',
      'miniature-landscape',
      'macro-nature',
      'miniature-urban',
      'tiny-cozy',
      'contained-worlds',
      'micro-fantasy',
      'miniature-industry',
      'cottage-village',
      'mushroom-village',
      'pastel-village',
      'enchanted-village',
      'tiny-beach',
      'tiny-food-world',
      'tiny-vehicles',
      ...TINY_SHADOW_PATHS,
    ],
  },
  twoPassPolish: {
    enabled: true,
    conceptWords: 150,
    polishedWords: '65-90',
    polishedWordsByPath: {},
    preservePhrasesByPath: {},
    skipPaths: [
      'snow-globe-world',
      // Halloween seasonal candidates (promoted from AlphaBot 2026-09-07) —
      // protect the curated MVP composition; matches AlphaBot QA config.
      'tiny-halloween-village',
      'tiny-halloween-hideaway',
      'tiny-pumpkin-patch',
      'tiny-haunted-hollow',
    ],
  },
  sensoryAnchors: {
    enabled: true,
    // this path's palette and light are its own; a rolled key light fights the single
    // raking source the glass spec depends on
    skipPaths: ['snow-globe-world'],
    requiredChannels: ['lightcolor'],
    pathContext: {
      diorama: 'scene',
      'miniature-landscape': 'scene',
      'macro-nature': 'scene',
      'miniature-urban': 'scene',
      'tiny-cozy': 'scene',
      'contained-worlds': 'scene',
      'micro-fantasy': 'scene',
      'miniature-industry': 'scene',
      'cottage-village': 'scene',
      'mushroom-village': 'scene',
      'pastel-village': 'scene',
      'enchanted-village': 'scene',
      'tiny-beach': 'scene',
      'tiny-food-world': 'scene',
      'tiny-vehicles': 'scene',
      'tiny-winter-village': 'scene',
      'tiny-night-market': 'scene',
      'tiny-carnival': 'scene',
    },
    poolsByContextAndChannel: pools.SENSORY_POOLS,
  },

  rollSharedDNA({ vibeKey, picker }) {
    return {
      scenePalette: picker.pickWithRecency(pools.SCENE_PALETTES, 'scene_palette'),
      colorPalette: pools.VIBE_COLOR[vibeKey] || pools.VIBE_COLOR.cozy,
      // Variety axes — rolled per render, injected into every path with HARD
      // OVERRIDE language. Pulls renders out of the warm-cozy-twilight default.
      biome: picker.pickWithRecency(pools.BIOME_AXIS, 'biome'),
      weather: picker.pickWithRecency(pools.WEATHER_AXIS, 'weather'),
      lighting: picker.pickWithRecency(pools.LIGHTING_AXIS, 'lighting_axis'),
      energy: picker.pickWithRecency(pools.ENERGY_AXIS, 'energy'),
    };
  },

  buildBrief({ path, sharedDNA, vibeDirective, vibeKey, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`TinyBot: unknown path "${path}"`);
    return builder({ sharedDNA, vibeDirective, vibeKey, picker });
  },

  caption({ path }) {
    return `[${path}] TinyBot`;
  },
};
