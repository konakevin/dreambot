/**
 * PixelBot scene paths — shared helpers (PIXELBOT_SCENES_PLAN.md).
 *
 * A scene path is a FUNCTION-FORM path file (paths/<key>.js) that exports a
 * builder fn with `.vibes` (array) attached. Its pools are path-bespoke JSON
 * files `seeds/pixelbot_<prefix>_<slot>.json`, loaded here lazily so the bot
 * module still loads before a path's pools exist. index.js derives ALL wiring
 * for scene paths from its SCENE_PATHS map through the helpers below:
 * painting medium, pinned model set, vibes, chaos + polish off, shadow lane.
 */
const fs = require('fs');
const path = require('path');

const SEEDS = path.join(__dirname, 'seeds');

// Scene model set (PIXELBOT_SCENES_PLAN.md §2.2). History: 2026-09-19 05:25 flux-1.1-pro
// dropped (smooth on 4 of 6 draws); 05:55 flux-1.1-pro-ultra + flux-dev dropped for the same
// reason; 06:35 BOTH RESTORED on Kevin's word: he hearted an ultra + VGA-look render and a
// flux-dev + Ultima-look render as "slightly pixelated, like when old computers first rendered
// high-def scenes" and said "it's okay to be mildly not true pixel ... keep these looks in".
// The medium hard fail is now only a FULLY smooth painting / vector illustration / photo / 3D.
// flux-1.1-pro (non-ultra) stays out (smooth vector illustration with no pixel structure).
const SCENE_MODELS = {
  'black-forest-labs/flux-2-pro': 1,
  'black-forest-labs/flux-2-max': 1,
  'black-forest-labs/flux-2-flex': 1,
  'black-forest-labs/flux-1.1-pro-ultra': 1,
  'black-forest-labs/flux-dev': 1,
};
const SCENE_MEDIUM = 'pixelbot_painting';

function loadPool(prefix, slot) {
  const p = path.join(SEEDS, `pixelbot_${prefix}_${slot}.json`);
  if (!fs.existsSync(p)) return [];
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

/** { slot: entries[] } for every slot; missing files load as []. */
function loadScenePools(prefix, slots) {
  const out = {};
  for (const s of slots) out[s] = loadPool(prefix, s);
  return out;
}

/** Pick with recency, or throw a clear error if the pool is empty. */
function pick(picker, pools, slot, axisKey) {
  const pool = pools[slot];
  if (!pool || !pool.length) throw new Error(`scene pool empty: ${slot} (${axisKey})`);
  return picker.pickWithRecency(pool, axisKey);
}

/** Gated pick: returns null (1 - p) of the time. */
function gated(picker, pools, slot, axisKey, p) {
  if (Math.random() >= p) return null;
  return pick(picker, pools, slot, axisKey);
}

// ─── wiring derived from a SCENE_PATHS map { key: builder } ───
const mediumByPath = (m) => Object.fromEntries(Object.keys(m).map((k) => [k, SCENE_MEDIUM]));
/**
 * Derive `modelByPath` for the scene paths, honouring a path's OWN declared pin.
 *
 * This used to be `Object.keys(m).map(k => [k, SCENE_MODELS])` — it threw the
 * builder away and hard-assigned all five models, so a path that self-declares
 * `module.exports.models` rendered correctly under the QA wrapper (which does
 * honour it) and then SILENTLY LOST THE PIN the moment it was merged. That is
 * the worst shape of divergence: it works in testing and regresses in
 * production, with nothing failing.
 *
 * It matters on this bot specifically because flux-dev and flux-1.1-pro-ultra
 * are excluded here, measured independently on volcano-forge, ice-cavern,
 * campfire-night, floating-market-canal and castle-town-gate: they return
 * smooth paintings with no pixel structure, and ultra stamps a gibberish
 * signature. An explicit `modelByPath` entry in index.js still overrides this,
 * since it is spread first.
 */
const modelByPath = (m) =>
  Object.fromEntries(Object.entries(m).map(([k, b]) => [k, b.models || SCENE_MODELS]));
const vibesByPath = (m) =>
  Object.fromEntries(Object.entries(m).map(([k, b]) => [k, b.vibes || ['nostalgic', 'enchanted']]));

/**
 * Patch a loaded bot IN MEMORY so a path that is not yet in index.js renders
 * exactly as it will once wired (used by scripts/_pixelbot-scene-render.js for
 * agent fan-out; never touches disk).
 */
/**
 * @param opts.models  Optional model set for this path. Defaults to the builder's
 *   own declared `builder.models`, then to the full SCENE_MODELS.
 *
 * WHY THE OVERRIDE EXISTS. This used to hard-assign `SCENE_MODELS` (all five),
 * which silently CLOBBERED any pin a path declared for itself — so an agent
 * testing in memory always rendered round 0 across flux-dev and
 * flux-1.1-pro-ultra even when its own header declared a flux-2 pin. Both of
 * those carry a standing exclusion on this bot, measured independently on
 * volcano-forge, ice-cavern, floating-market-canal and campfire-night: they
 * return fully SMOOTH paintings with no pixel structure, and ultra stamps a
 * gibberish signature. It cost `castle-town-gate` 3 of its 5 round-0 renders
 * before anyone noticed the wrapper was overriding the path.
 *
 * A path self-declares by exporting `models` on its builder function:
 *   module.exports.models = { 'black-forest-labs/flux-2-pro': 1, … };
 */
function patchInMemory(bot, key, builder, opts = {}) {
  bot.shadowPaths = bot.shadowPaths || [];
  if (!bot.shadowPaths.includes(key) && !bot.paths.includes(key)) bot.shadowPaths.push(key);
  bot.mediumByPath = { ...(bot.mediumByPath || {}), [key]: SCENE_MEDIUM };
  const models = opts.models || builder.models || SCENE_MODELS;
  bot.modelByPath = { ...(bot.modelByPath || {}), [key]: models };
  if (models !== SCENE_MODELS) {
    console.log(`⚡ model pin honoured for ${key}: ${Object.keys(models).join(', ')}`);
  }
  bot.vibesByPath = { ...(bot.vibesByPath || {}), [key]: builder.vibes || ['nostalgic', 'enchanted'] };
  bot.vibes = Array.from(new Set([...(bot.vibes || []), ...(builder.vibes || [])]));
  if (bot.chaos && Array.isArray(bot.chaos.skipPaths) && !bot.chaos.skipPaths.includes(key)) {
    bot.chaos.skipPaths = [...bot.chaos.skipPaths, key];
  }
  if (bot.twoPassPolish && Array.isArray(bot.twoPassPolish.skipPaths) && !bot.twoPassPolish.skipPaths.includes(key)) {
    bot.twoPassPolish.skipPaths = [...bot.twoPassPolish.skipPaths, key];
  }
  const orig = bot.buildBrief;
  bot.buildBrief = (o) =>
    o.path === key
      ? builder({ sharedDNA: o.sharedDNA, vibeDirective: o.vibeDirective, vibeKey: o.vibeKey, picker: o.picker })
      : orig(o);
}

module.exports = { SCENE_MODELS, SCENE_MEDIUM, loadScenePools, pick, gated, mediumByPath, modelByPath, vibesByPath, patchInMemory };
