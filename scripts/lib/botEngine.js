#!/usr/bin/env node
/**
 * botEngine.js — shared engine for the new bot-dream architecture.
 *
 * See docs/MIGRATE-BOT.md for how individual bots plug into this engine.
 *
 * Responsibilities (bots never reach into these directly — they call
 * runBot(), which orchestrates everything):
 *
 *   runBot({ bot, path, vibe, dryRun, outDir, label, idx })
 *     — roll path + vibe + medium; fetch vibe directive; create picker;
 *       call bot.rollSharedDNA + bot.buildBrief; Sonnet; Flux; download;
 *       upload; insert upload row; commit picks; write run log.
 *
 *   createPicker({ botName, windowDays, sb })
 *     — DB-backed recency picker. Pre-loads last N days of picks once;
 *       pickWithRecency(pool, axis) is sync; commit() writes queued
 *       picks only on successful render.
 *
 *   callClaude({ brief, maxTokens, anthropicKey, primaryModel, secondaryModel })
 *     — Sonnet with retry + Haiku fallback on exhaustion. Mirrors the
 *       pattern in supabase/functions/_shared/llm.ts.
 *
 * Bots import NOTHING from this file at require-time (they're pure data
 * modules). The engine calls their rollSharedDNA + buildBrief + postProcess.
 *
 * Isolation: this engine never calls the generate-dream Edge Function.
 * Fully standalone — Sonnet + Flux + Supabase direct. No coupling to
 * user-dream paths (V4, nightly, DLT).
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { createClient } = require('@supabase/supabase-js');
const { pickModel } = require('./modelPicker');

// ─────────────────────────────────────────────────────────────
// ENV + CLIENTS
// ─────────────────────────────────────────────────────────────

function loadEnv() {
  const env = {};
  try {
    const lines = fs.readFileSync('.env.local', 'utf8').split('\n');
    for (const l of lines) {
      const eq = l.indexOf('=');
      if (eq > 0) env[l.slice(0, eq).trim()] = l.slice(eq + 1).trim();
    }
  } catch (_) {
    // no .env.local in prod (GitHub Actions uses process.env)
  }
  return env;
}
const ENV = loadEnv();
const getKey = (n) => process.env[n] || ENV[n];

const SUPABASE_URL = 'https://jimftynwrinwenonjrlj.supabase.co';

function getSupabase() {
  const key = getKey('SUPABASE_SERVICE_ROLE_KEY');
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY missing');
  return createClient(SUPABASE_URL, key);
}

// ─────────────────────────────────────────────────────────────
// CLAUDE (Sonnet + Haiku fallback)
// ─────────────────────────────────────────────────────────────

const PRIMARY_MODEL = 'claude-sonnet-4-5-20250929';
const SECONDARY_MODEL = 'claude-haiku-4-5-20251001';
const RETRY_DELAYS_MS = [1000, 3000, 10000, 30000];
const RETRYABLE_STATUSES = new Set([429, 500, 502, 503, 504, 529]);

// Approximate pricing in cents/million tokens (input+output averaged).
// Just a budget estimate — adjust if pricing shifts materially.
const MODEL_COST_PER_CALL_CENTS = {
  [PRIMARY_MODEL]: 0.3, // rough avg for a 500-token-in / 250-token-out brief
  [SECONDARY_MODEL]: 0.05,
};

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function callModelWithRetry({ model, brief, maxTokens, anthropicKey }) {
  let lastErr = '';
  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        messages: [{ role: 'user', content: brief }],
      }),
    });
    if (res.ok) {
      const data = await res.json();
      const raw = data.content?.[0]?.text ?? '';
      const text = raw.trim().replace(/^["']|["']$/g, '');
      if (text.length < 10) throw new Error(`${model} response too short`);
      return { text, retries: attempt };
    }
    lastErr = `${res.status}: ${(await res.text()).slice(0, 200)}`;
    if (!RETRYABLE_STATUSES.has(res.status)) {
      throw new Error(`${model} ${lastErr}`);
    }
    if (attempt < RETRY_DELAYS_MS.length) {
      console.warn(
        `  ⏳ ${model} ${res.status} retry ${attempt + 1}/${RETRY_DELAYS_MS.length} in ${
          RETRY_DELAYS_MS[attempt] / 1000
        }s`
      );
      await sleep(RETRY_DELAYS_MS[attempt]);
    }
  }
  throw new Error(`${model} exhausted retries — ${lastErr}`);
}

/**
 * Sonnet with retry + Haiku fallback. Returns { text, modelUsed, retries,
 * fellBackToSecondary }. Throws if BOTH models exhausted.
 */
async function callClaude({
  brief,
  maxTokens = 400,
  primary = PRIMARY_MODEL,
  secondary = SECONDARY_MODEL,
  anthropicKey,
} = {}) {
  const key = anthropicKey || getKey('ANTHROPIC_API_KEY');
  if (!key) throw new Error('ANTHROPIC_API_KEY missing');
  try {
    const r = await callModelWithRetry({ model: primary, brief, maxTokens, anthropicKey: key });
    return { text: r.text, modelUsed: primary, retries: r.retries, fellBackToSecondary: false };
  } catch (primaryErr) {
    console.warn(`  ⚠️ ${primary} failed → falling back to ${secondary}: ${primaryErr.message}`);
    try {
      const r = await callModelWithRetry({ model: secondary, brief, maxTokens, anthropicKey: key });
      return {
        text: r.text,
        modelUsed: secondary,
        retries: r.retries,
        fellBackToSecondary: true,
      };
    } catch (secondaryErr) {
      // Both exhausted — caller is responsible for fail-loud behavior.
      const msg = `Claude exhausted: primary=${primaryErr.message}, secondary=${secondaryErr.message}`;
      throw new Error(msg);
    }
  }
}

// ─────────────────────────────────────────────────────────────
// FLUX (Replicate)
// ─────────────────────────────────────────────────────────────

// Approximate cost per Flux-dev render in cents.
const FLUX_COST_CENTS = 3; // $0.03 per render

const SDXL_VERSION = '7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc';

/**
 * Submit one Replicate prediction + poll until result. Dispatches on model
 * family: SDXL uses version-based `/v1/predictions` with different input
 * shape; Flux family uses model-based `/v1/models/{model}/predictions`.
 * Mirrors supabase/functions/_shared/generateImage.ts dispatch logic.
 */
async function fluxOnce({
  prompt,
  aspectRatio,
  model,
  replicateKey,
  inputOverrides = {},
}) {
  const isSDXL = model === 'sdxl';
  const input = {
    prompt,
    ...(isSDXL
      ? { num_outputs: 1 }
      : { aspect_ratio: aspectRatio, num_outputs: 1, output_format: 'jpg' }),
    ...inputOverrides,
  };
  const url = isSDXL
    ? 'https://api.replicate.com/v1/predictions'
    : `https://api.replicate.com/v1/models/${model}/predictions`;
  const body = isSDXL ? { version: SDXL_VERSION, input } : { input };

  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + replicateKey, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = (await res.text()).slice(0, 400);
    throw new Error(`Replicate ${res.status}: ${text}`);
  }
  const data = await res.json();
  // Poll prediction — 60 * 1.5s = 90s max
  for (let i = 0; i < 60; i++) {
    await sleep(1500);
    const p = await fetch('https://api.replicate.com/v1/predictions/' + data.id, {
      headers: { Authorization: 'Bearer ' + replicateKey },
    });
    const pd = await p.json();
    if (pd.status === 'succeeded') {
      return typeof pd.output === 'string' ? pd.output : pd.output[0];
    }
    if (pd.status === 'failed' || pd.status === 'canceled') {
      throw new Error(`Replicate ${pd.status}: ${pd.error || 'no error message'}`);
    }
  }
  throw new Error('Replicate timed out after 90s');
}

/**
 * Replicate render with NSFW false-positive auto-retry. Flux's safety
 * model occasionally flags clean prompts as NSFW — retrying the same
 * prompt usually succeeds due to stochastic diffusion. Up to 2 retries.
 *
 * Accepts `model` string directly. If bot opts into `useModelPicker`,
 * runBot calls pickModel() first to choose the model + inputOverrides
 * then passes them here.
 */
async function flux({
  prompt,
  aspectRatio = '9:16',
  model = 'black-forest-labs/flux-dev',
  inputOverrides = {},
  replicateKey,
  nsfwRetries = 2,
}) {
  const key = replicateKey || getKey('REPLICATE_API_TOKEN');
  if (!key) throw new Error('REPLICATE_API_TOKEN missing');

  for (let attempt = 0; attempt <= nsfwRetries; attempt++) {
    try {
      return await fluxOnce({
        prompt,
        aspectRatio,
        model,
        replicateKey: key,
        inputOverrides,
      });
    } catch (err) {
      // Match NSFW classic flag AND BFL's E005 "flagged as sensitive" — same
      // stochastic false-positive pattern, retry up to nsfwRetries times.
      const isSafetyFlag =
        err && err.message && /NSFW|sensitive|flagged|safety|E005/i.test(err.message);
      if (isSafetyFlag && attempt < nsfwRetries) {
        console.warn(`  ⚠️ Replicate safety-filter (possibly false-positive), retry ${attempt + 1}/${nsfwRetries}`);
        continue;
      }
      throw err;
    }
  }
  throw new Error('Flux: unreachable code path'); // for linter — loop always returns or throws
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (s) => {
        const f = fs.createWriteStream(dest);
        s.pipe(f)
          .on('finish', () => f.close(resolve))
          .on('error', reject);
      })
      .on('error', reject);
  });
}

// ─────────────────────────────────────────────────────────────
// PICKER — DB-backed 5-day recency with in-memory sync API
// ─────────────────────────────────────────────────────────────

/**
 * Create a picker scoped to one render. Reads the last `windowDays` of
 * picks for `botName` from bot_dedup up front, then provides synchronous
 * pick / pickWithRecency for use inside bot.rollSharedDNA + bot.buildBrief.
 *
 * Picks are queued in memory and committed to the DB ONLY if the caller
 * invokes commit() — runBot does this only after a successful post.
 *
 * Value stringification: strings pass through; objects use the `text`
 * field if present (matches MOMENTS shape convention), else `id`, else
 * JSON.stringify as last-resort. All bot pools with object values MUST
 * have a `text` property per the MIGRATE-BOT.md convention.
 */
async function createPicker({ botName, windowDays = 5, sb }) {
  const since = new Date(Date.now() - windowDays * 86400000).toISOString();
  const { data, error } = await sb
    .from('bot_dedup')
    .select('axis, value')
    .eq('bot_name', botName)
    .gte('picked_at', since);
  if (error) {
    console.warn(`  ⚠️ bot_dedup read failed (${error.message}); falling back to no recency`);
  }

  const dbRecent = {};
  for (const row of data || []) {
    (dbRecent[row.axis] ??= new Set()).add(row.value);
  }
  const runRecent = {}; // within-this-render dedup
  const pendingPicks = [];
  const warnings = [];

  function keyOf(v) {
    if (typeof v === 'string') return v;
    if (v && typeof v === 'object') {
      if (typeof v.text === 'string') return v.text;
      if (typeof v.id === 'string') return v.id;
      return JSON.stringify(v);
    }
    return String(v);
  }

  return {
    pick(pool) {
      if (!Array.isArray(pool) || pool.length === 0) {
        throw new Error('picker.pick: empty or invalid pool');
      }
      return pool[Math.floor(Math.random() * pool.length)];
    },

    pickWithRecency(pool, axis) {
      if (!Array.isArray(pool) || pool.length === 0) {
        throw new Error(`picker.pickWithRecency(${axis}): empty or invalid pool`);
      }
      const db = dbRecent[axis] || new Set();
      const run = runRecent[axis] || new Set();
      const filtered = pool.filter((v) => !db.has(keyOf(v)) && !run.has(keyOf(v)));
      let chosen;
      if (filtered.length > 0) {
        chosen = filtered[Math.floor(Math.random() * filtered.length)];
      } else {
        // Pool exhausted in window — fall back, warn once per axis.
        const warnKey = `exhausted:${axis}`;
        if (!runRecent[warnKey]) {
          warnings.push(
            `[picker] axis=${axis} pool (${pool.length} entries) exhausted in ${windowDays}-day window — falling back to full pool`
          );
          runRecent[warnKey] = true;
        }
        chosen = pool[Math.floor(Math.random() * pool.length)];
      }
      (runRecent[axis] ??= new Set()).add(keyOf(chosen));
      pendingPicks.push({ axis, value: keyOf(chosen) });
      return chosen;
    },

    getWarnings() {
      return warnings.slice();
    },

    async commit() {
      if (pendingPicks.length === 0) return;
      const rows = pendingPicks.map((p) => ({
        bot_name: botName,
        axis: p.axis,
        value: p.value,
      }));
      const { error: insErr } = await sb.from('bot_dedup').insert(rows);
      if (insErr) {
        console.warn(`  ⚠️ bot_dedup commit failed: ${insErr.message}`);
      }
    },
  };
}

// ─────────────────────────────────────────────────────────────
// WEIGHTED RANDOM HELPERS (paths + mediums)
// ─────────────────────────────────────────────────────────────

/**
 * weightedPick(items, weights) — uniform if weights undefined, otherwise
 * cumulative-weight pick. Unlisted items default to weight 1.
 */
function weightedPick(items, weights) {
  if (!items || items.length === 0) return undefined;
  if (!weights) return items[Math.floor(Math.random() * items.length)];
  const total = items.reduce((s, it) => s + (weights[it] ?? 1), 0);
  let r = Math.random() * total;
  for (const it of items) {
    r -= weights[it] ?? 1;
    if (r <= 0) return it;
  }
  return items[items.length - 1];
}

/**
 * Resolve medium for a render. Supports three bot patterns:
 *   1. defaultMedium (single fixed medium — VenusBot)
 *   2. mediums (weighted-random list — most bots)
 *   3. mediumByPath (path-locked — ToyBot lego→lego, or weighted array)
 */
function resolveMedium({ bot, path }) {
  // Path-specific override wins
  if (bot.mediumByPath && path in bot.mediumByPath) {
    const val = bot.mediumByPath[path];
    if (typeof val === 'string') return val;
    if (Array.isArray(val) && val.length > 0) {
      return val[Math.floor(Math.random() * val.length)];
    }
  }
  // Bot-wide mediums list
  if (Array.isArray(bot.mediums) && bot.mediums.length > 0) {
    return bot.mediums[Math.floor(Math.random() * bot.mediums.length)];
  }
  // Single hardcoded medium
  if (typeof bot.defaultMedium === 'string') return bot.defaultMedium;
  throw new Error(
    `Bot ${bot.username} has no medium strategy — set defaultMedium, mediums, or mediumByPath`
  );
}

/**
 * Resolve vibe for a render. Priority: vibesByPath > vibesByMedium > bot.vibes.
 * Weighted-random via repetition (array style).
 */
function resolveVibe({ bot, medium, path }) {
  const perPath = path && bot.vibesByPath && bot.vibesByPath[path];
  const perMedium = bot.vibesByMedium && bot.vibesByMedium[medium];
  const pool =
    (Array.isArray(perPath) && perPath.length > 0 ? perPath : null) ||
    (Array.isArray(perMedium) && perMedium.length > 0 ? perMedium : null) ||
    bot.vibes ||
    [];
  if (pool.length === 0) {
    throw new Error(`Bot ${bot.username} has no vibes configured (path=${path}, medium=${medium})`);
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Weighted path pick with rolling dedup window. Re-rolls if the picked
 * path appears in the last 5 posts (from DB + in-memory batch window).
 * Falls back to any path after 20 attempts to avoid infinite loops.
 */
function resolvePath({ bot, recentPaths }) {
  if (!Array.isArray(bot.paths) || bot.paths.length === 0) {
    throw new Error(`Bot ${bot.username} has no paths configured`);
  }
  const window = recentPaths || [];
  const maxAttempts = 20;
  for (let i = 0; i < maxAttempts; i++) {
    const pick = weightedPick(bot.paths, bot.pathWeights);
    if (!window.includes(pick)) return pick;
  }
  console.warn('  ⚠️ path dedup exhausted after 20 attempts — using last pick');
  return weightedPick(bot.paths, bot.pathWeights);
}

// Shuffle-bag path selection: cycle through ALL paths before any repeats.
// Opt in via `cycleAllPaths: true` in bot config.
function resolvePathCycled({ bot, recentPaths }) {
  if (!Array.isArray(bot.paths) || bot.paths.length === 0) {
    throw new Error(`Bot ${bot.username} has no paths configured`);
  }
  const used = new Set(recentPaths || []);
  const remaining = bot.paths.filter((p) => !used.has(p));

  if (remaining.length === 0) {
    return weightedPick(bot.paths, bot.pathWeights);
  }

  return weightedPick(remaining, bot.pathWeights);
}

// In-memory batch path window — shared across renders in a single batch run.
// Persists for the lifetime of the process so consecutive iter-bot renders dedup.
const _batchPathWindow = {};

// Separate cycle tracker for cycleAllPaths bots — resets when cycle completes.
const _batchCycleTracker = {};

async function getRecentPaths(sb, botName, limit = 5) {
  const { data, error } = await sb
    .from('bot_run_log')
    .select('path')
    .eq('bot_name', botName)
    .eq('status', 'ok')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) {
    console.warn(`  ⚠️ recent paths query failed: ${error.message}`);
    return [];
  }
  return (data || []).map((r) => r.path);
}

async function getCycledUsedPaths(sb, botName, pathCount) {
  const { count, error } = await sb
    .from('bot_run_log')
    .select('*', { count: 'exact', head: true })
    .eq('bot_name', botName)
    .eq('status', 'ok');
  if (error || !count) return [];
  const position = count % pathCount;
  if (position === 0) return [];
  const { data } = await sb
    .from('bot_run_log')
    .select('path')
    .eq('bot_name', botName)
    .eq('status', 'ok')
    .order('created_at', { ascending: false })
    .limit(position);
  return (data || []).map((r) => r.path);
}

function pushBatchPath(botName, path) {
  if (!_batchPathWindow[botName]) _batchPathWindow[botName] = [];
  _batchPathWindow[botName].push(path);
  if (_batchPathWindow[botName].length > 5) _batchPathWindow[botName].shift();
}

// ─────────────────────────────────────────────────────────────
// SUPABASE HELPERS
// ─────────────────────────────────────────────────────────────

async function fetchVibeDirective(sb, vibeKey) {
  const { data, error } = await sb
    .from('dream_vibes')
    .select('key, directive')
    .eq('key', vibeKey)
    .maybeSingle();
  if (error) throw new Error(`dream_vibes lookup failed: ${error.message}`);
  if (!data) throw new Error(`Vibe not found: ${vibeKey}`);
  return data.directive || '';
}

async function fetchMediumFluxFragment(sb, mediumKey) {
  const { data, error } = await sb
    .from('dream_mediums')
    .select('key, flux_fragment')
    .eq('key', mediumKey)
    .maybeSingle();
  if (error) throw new Error(`dream_mediums lookup failed: ${error.message}`);
  if (!data) return '';
  return data.flux_fragment || '';
}

async function lookupBotUserId(sb, username) {
  const { data, error } = await sb
    .from('users')
    .select('id')
    .ilike('username', username)
    .maybeSingle();
  if (error) throw new Error(`users lookup failed: ${error.message}`);
  if (!data) throw new Error(`Bot account not found: ${username}`);
  return data.id;
}

async function postAsBot({ sb, userId, username, localPath, prompt, vibeKey, medium, caption }) {
  const bytes = fs.readFileSync(localPath);
  const key = `${userId}/${Date.now()}-${username}-${Math.random().toString(36).slice(2, 8)}.jpg`;
  const up = await sb.storage.from('uploads').upload(key, bytes, { contentType: 'image/jpeg' });
  if (up.error) throw new Error(`storage upload failed: ${up.error.message}`);
  const publicUrl = sb.storage.from('uploads').getPublicUrl(key).data.publicUrl;

  const { error: insErr } = await sb.from('uploads').insert({
    user_id: userId,
    image_url: publicUrl,
    thumbnail_url: null,
    ai_prompt: prompt,
    dream_medium: medium,
    dream_vibe: vibeKey,
    width: 768,
    height: 1344,
    is_active: true,
    is_posted: true,
    is_public: true,
    is_ai_generated: true,
    posted_at: new Date().toISOString(),
    caption: caption || null,
  });
  if (insErr) throw new Error(`uploads insert failed: ${insErr.message}`);
  return publicUrl;
}

async function writeRunLog(sb, row) {
  const { error } = await sb.from('bot_run_log').insert(row);
  if (error) {
    // Don't throw — run log write failing is not worth aborting.
    console.warn(`  ⚠️ bot_run_log write failed: ${error.message}`);
  }
}

// ─────────────────────────────────────────────────────────────
// ORCHESTRATOR
// ─────────────────────────────────────────────────────────────

/**
 * Options for runBot:
 *   bot       — bot module (required; see docs/MIGRATE-BOT.md for contract)
 *   path      — specific path to render, or 'random' (default)
 *   vibe      — specific vibe key, or 'random' (default)
 *   dryRun    — if true, skip flux + upload + DB writes (brief-only debug)
 *   outDir    — local directory to save rendered image (for iter-bot dev batches)
 *   label     — string to include in save filenames
 *   idx       — index within a batch (for filename uniqueness)
 *   post      — if outDir is set, still post to DB (for `iter-bot --post`)
 *   sbOverride — inject a supabase client (tests)
 *
 * Returns: { ok, finalPrompt, dna, path, vibeKey, medium, imageUrl?, localPath?, error?, errorStage? }
 * Throws on production failure (fail-loud per policy) UNLESS outDir is
 * set (iter-bot batch mode — we log + continue).
 */
async function runBot(opts) {
  const {
    bot,
    path: pathArg = 'random',
    vibe: vibeArg = 'random',
    dryRun = false,
    outDir,
    label,
    idx,
    post = false,
    sbOverride,
  } = opts;

  if (!bot || !bot.username) throw new Error('runBot: bot module required');

  const sb = sbOverride || getSupabase();
  const startedAt = Date.now();
  const isBatchMode = Boolean(outDir); // iter-bot sets this
  const shouldPostToDB = !dryRun && (!isBatchMode || post);

  // Resolve path — shuffle-bag cycle or rolling dedup window
  let resolvedPath;
  if (pathArg === 'random') {
    if (bot.cycleAllPaths) {
      const pathCount = bot.paths.length;
      if (!_batchCycleTracker[bot.username]) {
        _batchCycleTracker[bot.username] = await getCycledUsedPaths(sb, bot.username, pathCount);
      }
      const used = new Set(_batchCycleTracker[bot.username]);
      const remaining = bot.paths.filter((p) => !used.has(p));
      if (remaining.length === 0) {
        _batchCycleTracker[bot.username] = [];
        resolvedPath = weightedPick(bot.paths, bot.pathWeights);
      } else {
        resolvedPath = weightedPick(remaining, bot.pathWeights);
      }
      _batchCycleTracker[bot.username].push(resolvedPath);
    } else {
      const dbRecent = await getRecentPaths(sb, bot.username);
      const batchRecent = _batchPathWindow[bot.username] || [];
      const combined = [...new Set([...batchRecent, ...dbRecent])].slice(0, 5);
      resolvedPath = resolvePath({ bot, recentPaths: combined });
      pushBatchPath(bot.username, resolvedPath);
    }
  } else {
    if (!bot.paths.includes(pathArg)) {
      throw new Error(`Path '${pathArg}' not in bot.paths: ${bot.paths.join(', ')}`);
    }
    resolvedPath = pathArg;
  }
  const medium = resolveMedium({ bot, path: resolvedPath });
  const vibeKey = vibeArg === 'random' ? resolveVibe({ bot, medium, path: resolvedPath }) : vibeArg;

  const runMeta = {
    botName: bot.username,
    path: resolvedPath,
    vibe: vibeKey,
    medium,
  };

  let errorStage = null;
  let finalPrompt = null;
  let renderModel = 'black-forest-labs/flux-dev';
  let sharedDNA = null;
  let picker = null;
  let claudeMeta = { retries: 0, fellBackToSecondary: false };
  let localPath = null;
  let imageUrl = null;

  try {
    // 1. Fetch vibe directive + medium flux fragment
    errorStage = 'vibe-lookup';
    const vibeDirective = await fetchVibeDirective(sb, vibeKey);
    const mediumFluxFragment = await fetchMediumFluxFragment(sb, medium);

    // 2. Create picker (pre-loads recency window)
    errorStage = 'picker-init';
    picker = await createPicker({ botName: bot.username, windowDays: 5, sb });

    // 3. Roll shared DNA (optional)
    errorStage = 'roll-shared-dna';
    sharedDNA = bot.rollSharedDNA
      ? bot.rollSharedDNA({ vibeKey, medium, path: resolvedPath, picker })
      : {};

    // 4. Optional text content (HumanBot/MuseBot thinking-bot pattern)
    let textContent = null;
    if (bot.generateTextContent) {
      errorStage = 'text-content';
      textContent = await bot.generateTextContent({
        picker,
        sharedDNA,
        path: resolvedPath,
        vibeKey,
      });
      sharedDNA.textContent = textContent;
    }

    // 5. Build brief (or direct prompt if path opts out of Sonnet)
    errorStage = 'build-brief';
    const briefResult = bot.buildBrief({
      path: resolvedPath,
      sharedDNA,
      vibeDirective,
      vibeKey,
      medium,
      picker,
    });

    let middle;
    const isDirectPrompt = briefResult && typeof briefResult === 'object' && briefResult.direct;

    if (isDirectPrompt) {
      // Path composed the Flux prompt directly — skip Sonnet entirely
      middle = briefResult.prompt;
      if (!middle || middle.length < 30) {
        throw new Error(`direct prompt too short (len=${middle?.length})`);
      }
      console.log('  ⚡ direct prompt (Sonnet bypassed)');
    } else {
      // Standard path: brief → Sonnet → scene description
      const brief = typeof briefResult === 'string' ? briefResult : String(briefResult);
      if (!brief || brief.length < 50) {
        throw new Error(`buildBrief returned invalid brief (len=${brief.length})`);
      }

      // 6. Call Sonnet
      errorStage = 'sonnet';
      const claude = await callClaude({ brief, maxTokens: 400 });
      claudeMeta = {
        retries: claude.retries,
        fellBackToSecondary: claude.fellBackToSecondary,
        modelUsed: claude.modelUsed,
      };
      middle = claude.text;

      // 6b. Sonnet refusal detection — retry up to 3 times
      const REFUSAL_PATTERNS = [
        'I cannot create',
        "I'm not able to",
        'I appreciate your',
        "I'd be happy to help",
        'violate content policies',
        'sexually suggestive',
        'not able to generate',
        'alternative approaches',
      ];
      const isRefusal = (t) => REFUSAL_PATTERNS.some((p) => t.includes(p));
      {
        let refusalRetries = 0;
        while (refusalRetries < 3 && isRefusal(middle)) {
          refusalRetries += 1;
          console.warn(`  ⚠️ Sonnet content refusal, retrying (${refusalRetries}/3)`);
          const retry = await callClaude({ brief, maxTokens: 400 });
          middle = retry.text;
        }
        if (isRefusal(middle)) {
          throw new Error('Sonnet refused after 3 retries (content policy)');
        }
      }

      // 7. Banned-phrase retry (up to 3 total Sonnet attempts)
      if (bot.bannedPhrases && bot.bannedPhrases.length > 0) {
        errorStage = 'banned-phrase-check';
        const lower = (s) => s.toLowerCase();
        let retries = 0;
        while (retries < 2 && bot.bannedPhrases.some((p) => lower(middle).includes(lower(p)))) {
          retries += 1;
          console.warn(`  ⚠️ banned phrase detected, retrying Sonnet (${retries}/2)`);
          const retry = await callClaude({ brief, maxTokens: 400 });
          middle = retry.text;
        }
        if (bot.bannedPhrases.some((p) => lower(middle).includes(lower(p)))) {
          throw new Error(`banned phrase still present after retries`);
        }
      }
    }

    // 8. Compose final prompt with bot's prefix + per-medium-style + suffix
    errorStage = 'compose-prompt';
    // Per-medium prefix/suffix override — if bot.promptPrefixByMedium/promptSuffixByMedium[medium]
    // is set, use it INSTEAD of bot.promptPrefix/bot.promptSuffix. Lets a specific medium use
    // a totally different stylistic anchor (e.g. gothic-whimsy uses Tim-Burton-whimsical prefix
    // instead of the bot's default Castlevania-manga prefix).
    const rawPrefix =
      (bot.promptPrefixByMedium && bot.promptPrefixByMedium[medium]) ||
      bot.promptPrefix || '';
    const rawSuffix =
      (bot.promptSuffixByMedium && bot.promptSuffixByMedium[medium]) ||
      bot.promptSuffix || '';
    const prefix = rawPrefix ? `${rawPrefix}, ` : '';
    const suffix = rawSuffix ? `, ${rawSuffix}` : '';
    // Per-path prefix — prepended BEFORE style prefix so it's the first tokens Flux sees.
    // Use case: gender lock for cyborg-man needs to appear before "beauty" in style prefix.
    const pathPrefix = bot.promptPrefixByPath && bot.promptPrefixByPath[resolvedPath]
      ? `${bot.promptPrefixByPath[resolvedPath]}, `
      : '';
    // Per-medium style injection — bot.mediumStyles overrides DB flux_fragment if set.
    // Otherwise falls back to the DB's flux_fragment for this medium.
    const mediumStyle = bot.mediumStyles && bot.mediumStyles[medium]
      ? `${bot.mediumStyles[medium]}, `
      : mediumFluxFragment
        ? `${mediumFluxFragment}, `
        : '';
    finalPrompt = `${pathPrefix}${prefix}${mediumStyle}${middle}${suffix}`.replace(/\s+,/g, ',').trim();

    if (dryRun) {
      return {
        ok: true,
        dryRun: true,
        finalPrompt,
        sharedDNA,
        path: resolvedPath,
        vibeKey,
        medium,
      };
    }

    // 9. Replicate render — opt-in per-medium routing via pickModel().
    // Priority: bot.modelByPath > pickModel (medium+vibe → pool) > flux-dev default.
    // If bot.useModelPicker is true, pickModel() reads dream_mediums.allowed_models
    // (with bot-scope, includes bot-only mediums) and random-picks a Flux/SDXL model.
    // Bot.modelByPath HARDCODES a specific model for a specific path, overriding
    // the medium pool — use this when a path's aesthetic needs a specific model.
    errorStage = 'flux';
    let renderInputOverrides = {};
    if (bot.modelByPath && bot.modelByPath[resolvedPath]) {
      const modelVal = bot.modelByPath[resolvedPath];
      // Support three formats:
      //   string: 'flux-dev' — locked to one model
      //   array:  ['flux-dev', 'flux-1.1-pro'] — uniform random pick
      //   weighted object: { 'flux-1.1-pro': 65, 'flux-dev': 35 } — weighted random
      if (typeof modelVal === 'object' && !Array.isArray(modelVal)) {
        const entries = Object.entries(modelVal);
        const totalW = entries.reduce((s, [, w]) => s + w, 0);
        let roll = Math.random() * totalW;
        renderModel = entries[entries.length - 1][0];
        for (const [m, w] of entries) { roll -= w; if (roll <= 0) { renderModel = m; break; } }
      } else {
        renderModel = Array.isArray(modelVal)
          ? modelVal[Math.floor(Math.random() * modelVal.length)]
          : modelVal;
      }
      // No input overrides for Flux; SDXL would need width/height/steps
      if (renderModel === 'sdxl') renderInputOverrides = { width: 768, height: 1344, num_inference_steps: 30, guidance_scale: 7.5 };
      console.log(`  🎨 model=${renderModel} (path-locked for path=${resolvedPath})`);
    } else if (bot.useModelPicker) {
      const picked = await pickModel({
        mediumKey: medium,
        vibeKey: vibeKey,
        allowedModels: bot.allowedModels,
      });
      renderModel = picked.model;
      renderInputOverrides = picked.inputOverrides;
      console.log(`  🎨 model=${renderModel} (picked for medium=${medium}, vibe=${vibeKey})`);
    }
    const fluxUrl = await flux({
      prompt: finalPrompt,
      aspectRatio: '9:16',
      model: renderModel,
      inputOverrides: renderInputOverrides,
    });

    // 10. Download
    errorStage = 'download';
    const filename = `${String(idx ?? 1).padStart(2, '0')}-${label || 'run'}.jpg`;
    const saveDir = outDir || `/tmp/${bot.username}-${label || 'run'}`;
    fs.mkdirSync(saveDir, { recursive: true });
    localPath = path.join(saveDir, filename);
    await download(fluxUrl, localPath);

    // 11. Optional post-process (HumanBot/MuseBot text overlay)
    if (bot.postProcess) {
      errorStage = 'post-process';
      const pp = await bot.postProcess({
        localPath,
        textContent,
        sharedDNA,
        path: resolvedPath,
      });
      if (pp && pp.newLocalPath) localPath = pp.newLocalPath;
    }

    // 12. Post to DB (skipped in dev batch mode unless --post)
    if (shouldPostToDB) {
      errorStage = 'post-to-db';
      const userId = await lookupBotUserId(sb, bot.username);
      const caption = bot.caption ? bot.caption({ sharedDNA, path: resolvedPath }) : null;
      imageUrl = await postAsBot({
        sb,
        userId,
        username: bot.username,
        localPath,
        prompt: finalPrompt,
        vibeKey,
        medium,
        caption,
      });

      // 13. Commit dedup picks ONLY on successful post
      errorStage = 'commit-dedup';
      await picker.commit();
    }

    const durationMs = Date.now() - startedAt;
    const costCents = Math.round(
      (MODEL_COST_PER_CALL_CENTS[claudeMeta.modelUsed] || 0) + FLUX_COST_CENTS
    );

    // 14. Write run log (success)
    if (shouldPostToDB) {
      await writeRunLog(sb, {
        bot_name: bot.username,
        path: resolvedPath,
        vibe: vibeKey,
        medium,
        model: renderModel,
        status: 'ok',
        image_url: imageUrl,
        duration_ms: durationMs,
        cost_cents: costCents,
        prompt_preview: finalPrompt.slice(0, 300),
        sonnet_retries: claudeMeta.retries,
        sonnet_fell_back_to_secondary: claudeMeta.fellBackToSecondary,
      });
    }

    // Surface picker warnings
    for (const w of picker.getWarnings()) console.warn(w);

    return {
      ok: true,
      finalPrompt,
      sharedDNA,
      path: resolvedPath,
      vibeKey,
      medium,
      imageUrl,
      localPath,
      durationMs,
      costCents,
    };
  } catch (err) {
    const durationMs = Date.now() - startedAt;
    const errStr = err && err.message ? err.message : String(err);

    // Always write run log on failure (for monitoring), except in dry run
    if (!dryRun) {
      try {
        await writeRunLog(sb, {
          bot_name: bot.username,
          path: resolvedPath,
          vibe: vibeKey,
          medium,
          model: renderModel,
          status: 'failed',
          error: errStr.slice(0, 2000),
          error_stage: errorStage,
          duration_ms: durationMs,
          prompt_preview: finalPrompt ? finalPrompt.slice(0, 300) : null,
          sonnet_retries: claudeMeta.retries,
          sonnet_fell_back_to_secondary: claudeMeta.fellBackToSecondary,
        });
      } catch (logErr) {
        console.warn(`  ⚠️ failed to write bot_run_log: ${logErr.message}`);
      }
    }

    // Batch mode (iter-bot) — log and continue, don't throw
    if (isBatchMode) {
      console.error(`  ❌ [${bot.username}] stage=${errorStage}: ${errStr}`);
      return {
        ok: false,
        error: errStr,
        errorStage,
        path: resolvedPath,
        vibeKey,
        medium,
        sharedDNA,
        finalPrompt,
      };
    }

    // Prod mode — fail loud so GitHub Actions exits non-zero
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────

module.exports = {
  runBot,
  createPicker,
  callClaude,
  flux,
  download,
  weightedPick,
  resolveMedium,
  resolveVibe,
  resolvePath,
  resolvePathCycled,
  fetchVibeDirective,
  lookupBotUserId,
  postAsBot,
  writeRunLog,
  getSupabase,
  getKey,
  // Model constants for tests / ai_generation_log alignment
  PRIMARY_MODEL,
  SECONDARY_MODEL,
};
