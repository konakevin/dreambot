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
  // Signed-off (3): animal-feeding-time, cozy-bakery-afternoon,
  // autumn-village-market. In QA (3, 2026-09-08): quiet-sunset-on-the-porch,
  // summer-evening-by-the-pond, first-snowfall — see FARMBOT_PATH_BUILD_STATE.md.
  paths: [
    'animal-feeding-time',
    'cozy-bakery-afternoon',
    'autumn-village-market',
    'quiet-sunset-on-the-porch',
    'summer-evening-by-the-pond',
    'first-snowfall',
  ],

  cycleAllPaths: true,

  poolByName(name) {
    if (!(name in pools)) throw new Error(`FarmBot.poolByName: unknown pool "${name}"`);
    return pools[name];
  },

  rollSharedDNA({ picker }) {
    const lookRegister = picker
      ? picker.pickWithRecency(pools.FARMBOT_LOOK_REGISTER, 'look_register')
      : pools.FARMBOT_LOOK_REGISTER[0];
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
