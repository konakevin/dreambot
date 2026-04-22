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
const SDXL_OVERRIDES = Object.freeze({
  width: 768,
  height: 1344,
  num_inference_steps: 30,
  guidance_scale: 7.5,
});
// Hardcoded mediums that ALWAYS use SDXL regardless of allowed_models.
// Empty today; mirrors the Deno sibling's SDXL_ALWAYS set for parity.
const SDXL_ALWAYS = new Set([]);

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
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY || envFile.SUPABASE_SERVICE_ROLE_KEY;
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
async function pickModel({
  renderMode = 'flux-dev',
  mediumKey,
  vibeKey,
  forceModel,
  allowedModels,
} = {}) {
  if (forceModel) {
    return {
      model: forceModel,
      inputOverrides: forceModel === 'sdxl' ? { ...SDXL_OVERRIDES } : {},
    };
  }

  if (renderMode === 'flux-kontext') {
    return {
      model: 'black-forest-labs/flux-kontext-pro',
      inputOverrides: {},
    };
  }

  if (mediumKey && SDXL_ALWAYS.has(mediumKey)) {
    return { model: 'sdxl', inputOverrides: { ...SDXL_OVERRIDES } };
  }

  await refreshCache();

  // Bot-scoped whitelist. If supplied, intersect every candidate pool with
  // this set before picking — lets a bot opt out of specific models (e.g.
  // GothBot banning flux-2-dev + flux-2-pro because of tensor bugs + safety).
  const filterByAllowed = (arr) => {
    if (!allowedModels || !Array.isArray(allowedModels) || allowedModels.length === 0) return arr;
    const allowedSet = new Set(allowedModels);
    return arr.filter((m) => allowedSet.has(m));
  };

  // medium+vibe override first
  if (mediumKey && vibeKey) {
    const overrideModels = overrideCache.get(`${mediumKey}|${vibeKey}`);
    const filtered = overrideModels ? filterByAllowed(overrideModels) : null;
    if (filtered && filtered.length > 0) {
      const picked = pickRandom(filtered);
      return {
        model: picked,
        inputOverrides: picked === 'sdxl' ? { ...SDXL_OVERRIDES } : {},
      };
    }
  }

  // Medium default pool
  if (mediumKey) {
    const mediumModels = mediumModelsCache.get(mediumKey);
    const filtered = mediumModels ? filterByAllowed(mediumModels) : null;
    if (filtered && filtered.length > 0) {
      const picked = pickRandom(filtered);
      return {
        model: picked,
        inputOverrides: picked === 'sdxl' ? { ...SDXL_OVERRIDES } : {},
      };
    }
  }

  // Fallback: pick from the bot's allowedModels whitelist itself, or DEFAULT.
  if (allowedModels && Array.isArray(allowedModels) && allowedModels.length > 0) {
    const picked = pickRandom(allowedModels);
    return {
      model: picked,
      inputOverrides: picked === 'sdxl' ? { ...SDXL_OVERRIDES } : {},
    };
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
  _resetCacheForTests,
};
