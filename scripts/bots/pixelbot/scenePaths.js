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

// Scene model set (PIXELBOT_SCENES_PLAN.md §2.2). Pruned twice on evidence:
// 2026-09-19 05:25 flux-1.1-pro dropped (smooth on 4 of 6 draws);
// 2026-09-19 05:55 flux-1.1-pro-ultra (smooth / flat on 5 draws across vista, harbor,
// cozy-room) and flux-dev (smooth on the HD voxel look, cartoon drift on SNES splash,
// soft on fine-dither) dropped. The flux-2 family held the pixel medium on every
// draw across four paths and every era look. Kevin's medium rule: pixels / near-pixel /
// voxel, never a digital painting.
const SCENE_MODELS = {
  'black-forest-labs/flux-2-pro': 1,
  'black-forest-labs/flux-2-max': 1,
  'black-forest-labs/flux-2-flex': 1,
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
const modelByPath = (m) => Object.fromEntries(Object.keys(m).map((k) => [k, SCENE_MODELS]));
const vibesByPath = (m) =>
  Object.fromEntries(Object.entries(m).map(([k, b]) => [k, b.vibes || ['nostalgic', 'enchanted']]));

/**
 * Patch a loaded bot IN MEMORY so a path that is not yet in index.js renders
 * exactly as it will once wired (used by scripts/_pixelbot-scene-render.js for
 * agent fan-out; never touches disk).
 */
function patchInMemory(bot, key, builder) {
  bot.shadowPaths = bot.shadowPaths || [];
  if (!bot.shadowPaths.includes(key) && !bot.paths.includes(key)) bot.shadowPaths.push(key);
  bot.mediumByPath = { ...(bot.mediumByPath || {}), [key]: SCENE_MEDIUM };
  bot.modelByPath = { ...(bot.modelByPath || {}), [key]: SCENE_MODELS };
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
