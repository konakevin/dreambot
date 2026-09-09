/**
 * FarmBot — the bot-engine contract.
 *
 * Identity (see FARMBOT_CREATIVE_DIRECTION.md, the spec of record): a cute,
 * idyllic countryside universe — Hay Day provides the world and variety,
 * cozy anime provides the characters/emotion/atmosphere. North star: "I
 * want to live there." The look register is feeling/technique-only (soft
 * painterly storybook illustration, warm hand-inked flat cartoon, etc.) —
 * no named studios or franchises, one coherent cozy-anime-storybook identity.
 *
 * SECRET BOT — mirrors AlphaBot's mechanism exactly (Kevin 2026-09-08: "I
 * want it to work like alphabot"), NOT the per-post shadow/dark-launch flag
 * (migration 376 — that's for staging a new path on an otherwise-PUBLIC bot).
 * Privacy is entirely ACCOUNT-level: `users.is_public=false` (see
 * scripts/create-farmbot-account.js) + the migration-116 uploads RLS, which
 * requires a viewer to FOLLOW a private account to see its (normal,
 * is_public=true/is_posted=true) posts — the supreme admin is the only
 * follower (migration 339's get_bot_users carve-out surfaces it to them in
 * the Bots tab like any other bot). No bot_schedules row — never auto-posts
 * (the dispatcher is schedule-row-driven, not bot.paths-driven, so a
 * populated `paths` array here is safe). Renders via `iter-bot.js --bot
 * farmbot --mode <path> --post`.
 *
 * FULL CONTENT REBUILD (2026-09-08) — Kevin: "throw out what we have in
 * terms of content... i hate the renders from the initial batch." All prior
 * paths/pools/look-register discarded; rebuilt from scratch against
 * FARMBOT_CREATIVE_DIRECTION.md (the spec of record — read it before
 * touching this bot). See FARMBOT_PATH_BUILD_STATE.md for build status.
 *
 * Architecture: shared cross-path category pools (pools.js — character
 * archetypes, animal companions, food, season, weather, props, gentle
 * magic, camera composition), each path a plain function that tag-filters
 * the shared pools to what's contextually relevant and combines via
 * picker.pickWithRecency — same mechanism the fleet already uses
 * (YumBot's FOOD_CATALOG/TINY_COMPANIONS/DECOR_ITEMS pattern), scoped
 * entirely to this bot's own files, no shared cross-bot registry.
 *
 * PHASE 1 PILOT (3 paths, proof of concept — do not expand further without
 * Kevin's sign-off): animal-feeding-time (animal-heavy) / cozy-bakery-
 * afternoon (food-heavy) / autumn-village-market (village-life-heavy). Full
 * 22-path roster planned (Phase 1 remaining 7 + Phase 2 + Phase 3) once the
 * POC is approved.
 */

const blocks = require('./shared-blocks');
const pools = require('./pools');

const pathBuilders = {
  'animal-feeding-time': require('./paths/animal-feeding-time'),
  'cozy-bakery-afternoon': require('./paths/cozy-bakery-afternoon'),
  'autumn-village-market': require('./paths/autumn-village-market'),
  'quiet-sunset-on-the-porch': require('./paths/quiet-sunset-on-the-porch'),
  'summer-evening-by-the-pond': require('./paths/summer-evening-by-the-pond'),
  'first-snowfall': require('./paths/first-snowfall'),
  'harvest-festival': require('./paths/harvest-festival'),
  'spring-planting-day': require('./paths/spring-planting-day'),
  'rainy-farmhouse-morning': require('./paths/rainy-farmhouse-morning'),
  'flower-field-wandering': require('./paths/flower-field-wandering'),
  'orchard-afternoon': require('./paths/orchard-afternoon'),
  'picnic-in-the-meadow': require('./paths/picnic-in-the-meadow'),
  'woodland-walk': require('./paths/woodland-walk'),
  'lakeside-riverside-moment': require('./paths/lakeside-riverside-moment'),
  'village-street-wandering': require('./paths/village-street-wandering'),
  'flower-shop': require('./paths/flower-shop'),
  'artisan-workshop': require('./paths/artisan-workshop'),
  'cozy-inn-interior': require('./paths/cozy-inn-interior'),
  'fishing-dock': require('./paths/fishing-dock'),
  'garden-vegetable-patch-tending': require('./paths/garden-vegetable-patch-tending'),
  'barn-animal-shelter-interior': require('./paths/barn-animal-shelter-interior'),
  'seasonal-festival': require('./paths/seasonal-festival'),
  'pineapple-field-afternoon': require('./paths/pineapple-field-afternoon'),
  'mango-orchard-harvest': require('./paths/mango-orchard-harvest'),
  'banana-grove-path': require('./paths/banana-grove-path'),
  'coconut-palm-grove': require('./paths/coconut-palm-grove'),
  'sugarcane-field': require('./paths/sugarcane-field'),
  'tropical-flower-garden': require('./paths/tropical-flower-garden'),
  'tropical-stream-crossing': require('./paths/tropical-stream-crossing'),
  'papaya-guava-orchard': require('./paths/papaya-guava-orchard'),

  // SEASONAL paths (Fall + Halloween, 2026-09-09 build) — required here so
  // buildBrief() can resolve them, but deliberately NOT listed in `paths`
  // below. They are drawn ONLY during their calendar holiday window via the
  // fleet-wide seasonal mechanism (scripts/lib/botSeasonal.js), from the
  // separate `seasonalPaths` export below — see that key's own comment.
  'farmbot-fall-hayride': require('./paths/farmbot-fall-hayride'),
  'farmbot-fall-corn-maze': require('./paths/farmbot-fall-corn-maze'),
  'farmbot-fall-campfire-evening': require('./paths/farmbot-fall-campfire-evening'),
  'farmbot-halloween-barn-party': require('./paths/farmbot-halloween-barn-party'),
  'farmbot-halloween-costume-parade': require('./paths/farmbot-halloween-costume-parade'),
  'farmbot-fall-cider-pressing': require('./paths/farmbot-fall-cider-pressing'),
};

module.exports = {
  username: 'farmbot',
  displayName: 'FarmBot',

  // Single medium — the look register (rolled per render) carries all visual
  // variety; this fragment only locks the cast/tone. See shared-blocks.js.
  mediums: ['farmbot_cozy_neutral'],
  mediumStyles: {
    farmbot_cozy_neutral: blocks.FARMBOT_COZY_NEUTRAL,
  },

  // Short anchor so the rolled look leads CLIP instead of a locked prefix.
  promptPrefixByMedium: {
    farmbot_cozy_neutral: 'cozy farm scene',
  },
  promptSuffixByMedium: {
    farmbot_cozy_neutral:
      'no text, no words, no letters, no numbers, no watermark, no signature, no artist tag, no logo, no stylized mark of any kind anywhere in the frame, gallery quality',
  },

  useModelPicker: true,
  // LOCKED to flux-2-flex only (Kevin 2026-09-08) — his favorite in both the
  // model head-to-head test and the real production confirmation batch
  // (after fixing the dream_mediums.allowed_models DB-gate bug — see
  // migration 486). gemini-2-image and gpt-image-2 both showed occasional
  // real-content misses (a chibi/toy-proportioned couple; a photoreal lamb
  // next to an anime character) even though they tested clean in the
  // controlled matrix — flux-2-flex was the one consistent performer across
  // both. flux-1.1-pro-ultra/flux-1.1-pro/flux-dev remain excluded (see
  // BOT_SCENE_QUALITY_PLAYBOOK.md-informed history above).
  allowedModels: ['black-forest-labs/flux-2-flex'],

  // Locked-model paths — none yet in the rebuild. Old FarmBot's Gemini locks
  // (farm-stand/farmhouse-garden/market-town-square/countryside-train) were
  // discarded with the rest of the pre-rebuild content; the QA that
  // justified them (signage-hallucination head-to-head) was against the old
  // paths/pools, not these. Re-test model behavior fresh once a market/shop
  // path is rebuilt — don't reapply the old lock by assumption.
  modelByPath: {},

  vibes: ['cozy', 'peaceful', 'whimsical', 'nostalgic', 'cinematic'],

  // Normal paths array (AlphaBot pattern) — safe to populate despite being
  // fully private: the dispatcher only ever runs a bot with a bot_schedules
  // row (none exists for FarmBot), so listing a path here can never trigger
  // an auto-post — safe to list a path the moment it's wired, even mid-QA.
  // Signed-off, see FARMBOT_PATH_BUILD_STATE.md for the full roster + build
  // status (16 more paths in progress as of 2026-09-09, autonomous multi-
  // agent push).
  // 'first-snowfall' DEACTIVATED 2026-09-09 (Kevin: "shut off the snowy paths
  // for farmbot for now - just deactivate, don't delete") — off-season for
  // real-world posting right now. Path builder, bespoke pools, and QA history
  // are untouched (still required in pathBuilders above) — restore by moving
  // 'first-snowfall' back into this array whenever it's seasonally right.
  paths: [
    'animal-feeding-time',
    'cozy-bakery-afternoon',
    'autumn-village-market',
    'quiet-sunset-on-the-porch',
    'summer-evening-by-the-pond',
    'harvest-festival',
    'spring-planting-day',
    'rainy-farmhouse-morning',
    'flower-field-wandering',
    'orchard-afternoon',
    'picnic-in-the-meadow',
    'woodland-walk',
    'lakeside-riverside-moment',
    'village-street-wandering',
    'flower-shop',
    'artisan-workshop',
    'cozy-inn-interior',
    'fishing-dock',
    'garden-vegetable-patch-tending',
    'barn-animal-shelter-interior',
    'seasonal-festival',
    'pineapple-field-afternoon',
    'mango-orchard-harvest',
    'banana-grove-path',
    'coconut-palm-grove',
    'sugarcane-field',
    'tropical-flower-garden',
    'tropical-stream-crossing',
    'papaya-guava-orchard',
  ],

  cycleAllPaths: true,

  // SEASONAL paths (2026-09-09) — NEVER mixed into `paths` above (that would
  // fire Halloween/Fall content year-round). Drawn only during each
  // holiday's live calendar window (public.holidays) via botSeasonal.js's
  // resolveSeasonalPath(), gated by engine_config.bots_seasonal_enabled
  // (master switch, defaults false — must be flipped on before any of these
  // ever draws in production) and engine_config.bots_seasonal_pct. See
  // FARMBOT_PATH_BUILD_STATE.md for the full build/QA status of each path.
  seasonalPaths: {
    fall: [
      'farmbot-fall-hayride',
      'farmbot-fall-corn-maze',
      'farmbot-fall-campfire-evening',
      'farmbot-fall-cider-pressing',
    ],
    halloween: ['farmbot-halloween-barn-party', 'farmbot-halloween-costume-parade'],
  },

  poolByName(name) {
    if (!(name in pools)) throw new Error(`FarmBot.poolByName: unknown pool "${name}"`);
    return pools[name];
  },

  rollSharedDNA({ picker }) {
    // Defensive fallback (2026-09-09) — two 2026-09-08 renders were traced
    // (via Kevin hearting them: "drifting from our anime look") to a
    // completely EMPTY lookOverride() output, silently dropping the anime-
    // style lead-in entirely (shared-blocks.js's lookOverride returns '' for
    // any falsy `look`). Root cause: those renders landed in a brief window
    // while farmbot_look_register.json was being hand-edited multiple times
    // that same session — picker.pickWithRecency on a momentarily-empty/
    // mid-write pool array can return undefined. The pool itself is fine
    // now (5 valid entries, verified), but nothing should ever again let a
    // render go out with zero anime-style direction — always fall back to
    // a guaranteed-valid entry rather than propagating a falsy pick.
    const lookRegister =
      (picker
        ? picker.pickWithRecency(pools.FARMBOT_LOOK_REGISTER, 'look_register')
        : pools.FARMBOT_LOOK_REGISTER[0]) || pools.FARMBOT_LOOK_REGISTER[0];
    return {
      // Bot-wide multi-media look mashup (2026-09-07). Rolled every render;
      // consumed by look-enabled path templates via shared-blocks.lookOverride.
      lookRegister,
      // TRACING ONLY (2026-09-08) — botEngine.js stores sharedDNA.scenePalette
      // verbatim into the render's recipe.scene_palette (recipeBuilder.js).
      // FarmBot doesn't otherwise use scenePalette, so this is a safe,
      // FarmBot-scoped way to record which look was actually rolled — Sonnet
      // sometimes paraphrases the look name away from its own prompt output,
      // so this is the only reliable way to trace a flagged render back to
      // its exact look afterward. Kept to just the SHORT look name (not the
      // full description) since scene_palette is technically one of the
      // fields DLT can replay, and this bot is fully private besides.
      scenePalette: lookRegister.split('—')[0].trim(),
    };
  },

  buildBrief({ path, sharedDNA, vibeDirective, vibeKey, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`FarmBot: unknown path "${path}"`);
    if (typeof builder !== 'function') {
      throw new Error(`FarmBot: path "${path}" has invalid export shape`);
    }
    return builder({ sharedDNA, vibeDirective, vibeKey, picker });
  },

  caption({ path }) {
    return `FarmBot › ${path}`;
  },
};
