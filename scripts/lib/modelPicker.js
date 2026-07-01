/**
 * scripts/lib/modelPicker.js — Node-side model picker for the bot engine.
 *
 * Mirrors supabase/functions/_shared/modelPicker.ts but runs in Node with
 * scope='bot' → reads bot-only mediums AND user-facing mediums from
 * dream_mediums.allowed_models. Bot-only mediums (is_bot_only=true) are
 * hidden from V4/nightly/restyle by the Deno sibling's is_bot_only=false
 * filter.
 *
 * KEEP IN SYNC with supabase/functions/_shared/modelPicker.ts — both
 * implement the same priority ladder:
 *   1. force_model (test-mode override via explicit renderMode)
 *   2. kontext mode → flux-kontext-pro
 *   3. SDXL-always hardcoded set (anime, pixels) — currently empty
 *   4. model_overrides table — medium+vibe combo (random from pool)
 *   5. dream_mediums.allowed_models — medium default (random from pool)
 *   6. Default: flux-2-dev
 *
 * Cache: 60s TTL, refreshed transparently.
 *
 * Usage:
 *   const { pickModel } = require('./modelPicker');
 *   const { model, inputOverrides } = await pickModel({
 *     renderMode: 'flux-dev',
 *     mediumKey: 'gothic-realistic',
 *     vibeKey: 'macabre',
 *   });
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// ── Constants (mirrors Deno sibling) ────────────────────────────────────

const CACHE_TTL_MS = 60_000;
const DEFAULT_MODEL = 'black-forest-labs/flux-2-dev';

// HARD BAN — these models are permanently banned for ALL bots (Kevin 2026-06-22).
// Stripped from EVERY candidate pool below regardless of bot.allowedModels OR
// dream_mediums.allowed_models, so no bot can ever render them even if a bot
// config is missing/empty or the DB still lists them. This is the bot-side
// picker (scope='bot'); the user-facing V4/nightly Deno sibling
// (_shared/modelPicker.ts) is intentionally NOT affected.
const BOT_BANNED_MODELS = new Set([
  'google/gemini-2-image', // Nano Banana
  'google/nano-banana',
  'openai/gpt-image-2', // GPT Image 2
]);
const SDXL_OVERRIDES = Object.freeze({
  width: 768,
  height: 1344,
  num_inference_steps: 30,
  guidance_scale: 7.5,
});
// Hardcoded mediums that ALWAYS use SDXL regardless of allowed_models.
// Empty today; mirrors the Deno sibling's SDXL_ALWAYS set for parity.
const SDXL_ALWAYS = new Set([]);

// Per-model Replicate input defaults for non-Flux wrappers. These models
// have DIFFERENT input schemas than the Flux family — sending Flux's
// `aspect_ratio: '9:16'` or `output_format: 'jpg'` to gpt-image-2 yields
// HTTP 422. Defaults below pin each wrapper to portrait output in its
// nearest-supported ratio + a sensible output format. botEngine.fluxOnce()
// also skips Flux-specific keys (num_outputs, output_quality) for any
// `openai/*` or `google/*` model. SOURCE OF TRUTH: each model's Replicate
// `openapi_schema.components.Input.properties` enum values.
const MODEL_INPUT_DEFAULTS = Object.freeze({
  // Replicate's gpt-image-2 wrapper: aspect ∈ {1:1,3:2,2:3}; 9:16 is NOT
  // accepted. 2:3 = 1024×1536 portrait, our canonical Flux size.
  'openai/gpt-image-2': Object.freeze({ aspect_ratio: '2:3', output_format: 'jpeg' }),
  // Nano Banana defaults aspect_ratio to `match_input_image`, which fails
  // on text-to-image with no input. Pin to 9:16.
  'google/nano-banana': Object.freeze({ aspect_ratio: '9:16', output_format: 'jpg' }),
});

/** Returns a fresh {...overrides} or {} for a given model id. */
function defaultsForModel(model) {
  if (model === 'sdxl') return { ...SDXL_OVERRIDES };
  const m = MODEL_INPUT_DEFAULTS[model];
  return m ? { ...m } : {};
}

// ── Env loading (Node may not have process.env populated in CLI runs) ───

function loadEnvFile() {
  try {
    const raw = fs.readFileSync('.env.local', 'utf8');
    const env = {};
    for (const line of raw.split('\n')) {
      const eq = line.indexOf('=');
      if (eq > 0) env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
    }
    return env;
  } catch (_) {
    return {};
  }
}

let cachedClient = null;
function getSupabase() {
  if (cachedClient) return cachedClient;
  const envFile = loadEnvFile();
  const url =
    process.env.EXPO_PUBLIC_SUPABASE_URL ||
    envFile.EXPO_PUBLIC_SUPABASE_URL ||
    'https://jimftynwrinwenonjrlj.supabase.co';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || envFile.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY missing for modelPicker');
  cachedClient = createClient(url, key, { auth: { persistSession: false } });
  return cachedClient;
}

// ── Cache (per-process, per-bot-scope) ──────────────────────────────────

let mediumModelsCache = new Map();
let overrideCache = new Map();
let cacheTimestamp = 0;

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function refreshCache() {
  const now = Date.now();
  if (now - cacheTimestamp <= CACHE_TTL_MS) return;

  try {
    const sb = getSupabase();
    // BOT SCOPE: read rows that are EITHER user-facing active mediums OR
    // bot-only mediums. Both have allowed_models populated and can be used
    // by the bot engine. Dormant rows (is_active=false, is_bot_only=false,
    // no allowed_models) are naturally filtered by the post-query check.
    const [mediumsRes, overridesRes] = await Promise.all([
      sb
        .from('dream_mediums')
        .select('key, allowed_models, is_active, is_bot_only')
        .or('is_active.eq.true,is_bot_only.eq.true'),
      sb.from('model_overrides').select('medium_key, vibe_key, allowed_models'),
    ]);

    const newMediumCache = new Map();
    if (mediumsRes.data) {
      for (const row of mediumsRes.data) {
        const models = row.allowed_models;
        if (models && Array.isArray(models) && models.length > 0) {
          newMediumCache.set(row.key, models);
        }
      }
    }
    mediumModelsCache = newMediumCache;

    const newOverrideCache = new Map();
    if (overridesRes.data) {
      for (const row of overridesRes.data) {
        const models = row.allowed_models;
        if (models && Array.isArray(models) && models.length > 0) {
          newOverrideCache.set(`${row.medium_key}|${row.vibe_key}`, models);
        }
      }
    }
    overrideCache = newOverrideCache;

    cacheTimestamp = now;
  } catch (err) {
    console.warn('[modelPicker] Cache refresh failed:', err.message);
  }
}

// ── Main export ─────────────────────────────────────────────────────────

/**
 * Pick a Replicate model + per-model input overrides for a bot render.
 *
 * @param {Object} opts
 * @param {string} [opts.renderMode='flux-dev'] — 'flux-kontext' triggers
 *   kontext routing; anything else uses the normal flux+sdxl ladder.
 * @param {string} [opts.mediumKey] — e.g. 'gothic', 'gothic-realistic'.
 * @param {string} [opts.vibeKey] — e.g. 'macabre'.
 * @param {string} [opts.forceModel] — override for testing (e.g. 'sdxl').
 * @returns {Promise<{ model: string, inputOverrides: Object }>}
 */
// Weighted pick over a candidate array using a model-weight map. Falls back
// to uniform random when no weight is provided for any candidate.
function pickWeighted(candidates, weights) {
  if (!weights || typeof weights !== 'object') return pickRandom(candidates);
  const entries = candidates.map((c) => [c, weights[c] ?? 0]);
  const totalWeight = entries.reduce((s, [, w]) => s + w, 0);
  if (totalWeight <= 0) return pickRandom(candidates);
  let roll = Math.random() * totalWeight;
  for (const [c, w] of entries) {
    roll -= w;
    if (roll <= 0) return c;
  }
  return entries[entries.length - 1][0];
}

async function pickModel({
  renderMode = 'flux-dev',
  mediumKey,
  vibeKey,
  forceModel,
  allowedModels,
  modelWeights,
  // Per-bot opt-out of BOT_BANNED_MODELS (bot.modelBanExemptions). The fleet
  // ban stays the default; a bot re-enables a banned model ONLY by listing it
  // here AND in its allowedModels (2026-07-01: dinobot banana; chibibot +
  // yumbot banana + gpt-2).
  banExemptions = [],
} = {}) {
  if (forceModel) {
    return {
      model: forceModel,
      inputOverrides: defaultsForModel(forceModel),
    };
  }

  if (renderMode === 'flux-kontext') {
    return {
      model: 'black-forest-labs/flux-kontext-pro',
      inputOverrides: {},
    };
  }

  if (mediumKey && SDXL_ALWAYS.has(mediumKey)) {
    return { model: 'sdxl', inputOverrides: defaultsForModel('sdxl') };
  }

  await refreshCache();

  // Bot-scoped whitelist. If supplied, intersect every candidate pool with
  // this set before picking — lets a bot opt out of specific models (e.g.
  // GothBot banning flux-2-dev + flux-2-pro because of tensor bugs + safety).
  const isBannedHere = (m) =>
    BOT_BANNED_MODELS.has(m) && !(Array.isArray(banExemptions) && banExemptions.includes(m));
  const filterByAllowed = (arr) => {
    // ALWAYS strip the hard-banned bot models first — applies even when the bot
    // supplied no allowedModels (so a DB medium pool can never serve them).
    let out = arr.filter((m) => !isBannedHere(m));
    if (!allowedModels || !Array.isArray(allowedModels) || allowedModels.length === 0) return out;
    const allowedSet = new Set(allowedModels);
    return out.filter((m) => allowedSet.has(m));
  };

  // medium+vibe override first
  if (mediumKey && vibeKey) {
    const overrideModels = overrideCache.get(`${mediumKey}|${vibeKey}`);
    const filtered = overrideModels ? filterByAllowed(overrideModels) : null;
    if (filtered && filtered.length > 0) {
      const picked = pickWeighted(filtered, modelWeights);
      return {
        model: picked,
        inputOverrides: defaultsForModel(picked),
      };
    }
  }

  // Medium default pool
  if (mediumKey) {
    const mediumModels = mediumModelsCache.get(mediumKey);
    const filtered = mediumModels ? filterByAllowed(mediumModels) : null;
    if (filtered && filtered.length > 0) {
      const picked = pickWeighted(filtered, modelWeights);
      return {
        model: picked,
        inputOverrides: defaultsForModel(picked),
      };
    }
  }

  // Fallback: pick from the bot's allowedModels whitelist itself, or DEFAULT.
  // Strip banned here too in case a bot's allowedModels still lists one.
  if (allowedModels && Array.isArray(allowedModels) && allowedModels.length > 0) {
    const safe = allowedModels.filter((m) => !isBannedHere(m));
    if (safe.length > 0) {
      const picked = pickWeighted(safe, modelWeights);
      return {
        model: picked,
        inputOverrides: defaultsForModel(picked),
      };
    }
  }
  return { model: DEFAULT_MODEL, inputOverrides: {} };
}

// Test hook — lets tests force a cache refresh window
function _resetCacheForTests() {
  mediumModelsCache = new Map();
  overrideCache = new Map();
  cacheTimestamp = 0;
  cachedClient = null;
}

module.exports = {
  pickModel,
  SDXL_OVERRIDES,
  DEFAULT_MODEL,
  BOT_BANNED_MODELS,
  _resetCacheForTests,
};
