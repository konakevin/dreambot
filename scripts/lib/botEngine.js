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
const { isOpenAIModel, generateOpenAIImage } = require('./providers/openai');
const { isGeminiModel, generateGeminiImage } = require('./providers/gemini');
const { rollChaos, buildChaosBriefBlock } = require('./chaosLayer');
const { rollSensoryAnchors, buildSensoryBriefBlock } = require('./sensoryAnchors');
const { extendBriefForConcept, buildPolishBrief } = require('./twoPassPolish');
const { distillStyle } = require('./styleDistiller');
const { upscaleAndCache } = require('./upscaleClarity');
const { buildRecipe } = require('./recipeBuilder');
const { SONNET, HAIKU } = require('./models');

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

const PRIMARY_MODEL = SONNET;
const SECONDARY_MODEL = HAIKU;
const RETRY_DELAYS_MS = [1000, 3000, 10000, 30000];
const RETRYABLE_STATUSES = new Set([429, 500, 502, 503, 504, 529]);

// Approximate pricing in cents/million tokens (input+output averaged).
// Just a budget estimate — adjust if pricing shifts materially.
const MODEL_COST_PER_CALL_CENTS = {
  [PRIMARY_MODEL]: 0.3, // rough avg for a 500-token-in / 250-token-out brief
  [SECONDARY_MODEL]: 0.05,
};

/**
 * Wrap an image-generation call with NSFW false-positive retry. Each
 * provider has its own safety filter that occasionally false-positives
 * on clean prompts (Flux's "E005 sensitive", OpenAI's
 * "content_policy_violation", Gemini's "SAFETY"). Retrying the same
 * prompt usually succeeds because diffusion is stochastic. The provider
 * modules throw with an "NSFW_CONTENT:" prefix on safety errors; this
 * helper detects that + retries up to `nsfwRetries` times.
 *
 * Non-safety errors propagate immediately (no retry).
 */
async function withNsfwRetry(nsfwRetries, fn) {
  for (let attempt = 0; attempt <= nsfwRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const isSafetyFlag =
        err && err.message && /NSFW|sensitive|flagged|safety|E005/i.test(err.message);
      if (isSafetyFlag && attempt < nsfwRetries) {
        console.warn(
          `  ⚠️ safety-filter (possibly false-positive), retry ${attempt + 1}/${nsfwRetries}`
        );
        continue;
      }
      throw err;
    }
  }
}

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
async function fluxOnce({ prompt, aspectRatio, model, replicateKey, inputOverrides = {} }) {
  const isSDXL = model === 'sdxl';
  // Replicate-wrapped non-Flux models accept a DIFFERENT input schema than
  // the Flux family. Flux's `num_outputs` / `output_quality` / 'jpg' aren't
  // valid keys/values on these wrappers — sending them yields HTTP 422.
  //   openai/gpt-image-2 → aspect_ratio ∈ {1:1,3:2,2:3}, output_format ∈ {png,jpeg,webp}
  //   google/nano-banana → aspect_ratio defaults to match_input_image (needs
  //                        an override for text-to-image), output_format: jpg ok
  // Per-model defaults live in modelPicker.MODEL_INPUT_DEFAULTS and arrive
  // here as `inputOverrides` from pickModel() — we just need to AVOID
  // injecting Flux-specific keys for these models.
  const isOpenAI = typeof model === 'string' && model.startsWith('openai/');
  const isGoogle = typeof model === 'string' && model.startsWith('google/');
  const isReplicateWrapper = isOpenAI || isGoogle;

  let input;
  if (isSDXL) {
    input = { prompt, num_outputs: 1, ...inputOverrides };
  } else if (isReplicateWrapper) {
    // Minimal shape — picker-supplied overrides own aspect_ratio + output_format.
    // No num_outputs (gpt-image-2 uses number_of_images instead) and no
    // output_quality (rejected). Prompt + caller overrides only.
    input = { prompt, ...inputOverrides };
  } else {
    // Flux family
    input = {
      prompt,
      aspect_ratio: aspectRatio,
      num_outputs: 1,
      // JPEG q95 (was PNG q100 2026-05-29). Storage masters are now JPEG
      // across the app (matches user-dream pipeline). At q95, Clarity
      // (diffusion-based) upscales effectively identically to PNG input;
      // the visible HD download is unchanged. Cuts bot master from ~2MB
      // PNG to ~400KB JPEG — smaller storage AND a smaller feed-card
      // fallback when image_url_display is ever null.
      output_format: 'jpg',
      output_quality: 95,
      ...inputOverrides,
    };
  }
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
  // Poll prediction. Flux models finish in ~20–30s so 90s was historically
  // plenty. Replicate-wrapped non-Flux models (gpt-image-2, nano-banana)
  // run on the wrapped provider's pipeline + Replicate's queuing, which
  // can push past 90s — 2026-05-30 we lost 2/3 gpt-image-2 renders to a
  // 90s ceiling. 240s for wrappers, 90s for Flux.
  const maxPollMs = isReplicateWrapper ? 240_000 : 90_000;
  const intervalMs = 1500;
  const maxPolls = Math.floor(maxPollMs / intervalMs);
  for (let i = 0; i < maxPolls; i++) {
    await sleep(intervalMs);
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
  throw new Error(`Replicate timed out after ${Math.round(maxPollMs / 1000)}s`);
}

/**
 * Multi-provider image render with NSFW false-positive auto-retry. Routes
 * by model prefix:
 *   openai/*  → native OpenAI API (providers/openai.js)
 *   google/*  → native Gemini API (providers/gemini.js)
 *   anything else → Replicate (fluxOnce)
 *
 * Native routing matches the user-dream Edge Function
 * (`_shared/generateImage.ts`) — bots used to be Replicate-only, which
 * forced the OpenAI + Gemini renders through Replicate's wrappers and
 * added 20-40s of queueing on already-slow models. 2026-05-30.
 *
 * NSFW retry: Flux's safety model occasionally flags clean prompts as
 * NSFW; same with the OpenAI + Gemini safety filters. Retrying often
 * passes because diffusion is stochastic. Up to `nsfwRetries` attempts.
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
  // Native OpenAI route. Lazy-required so a bot that never touches OpenAI
  // doesn't pay the parse cost — and an environment without OPENAI_API_KEY
  // still loads the engine.
  if (isOpenAIModel(model)) {
    const key = getKey('OPENAI_API_KEY');
    if (!key) throw new Error('OPENAI_API_KEY missing — set it in .env.local or env');
    return await withNsfwRetry(nsfwRetries, async () => {
      const r = await generateOpenAIImage(model, prompt, key);
      return r.url;
    });
  }

  // Native Gemini route.
  if (isGeminiModel(model)) {
    const key = getKey('GEMINI_API_KEY');
    if (!key) throw new Error('GEMINI_API_KEY missing — set it in .env.local or env');
    return await withNsfwRetry(nsfwRetries, async () => {
      const r = await generateGeminiImage(model, prompt, key);
      return r.url;
    });
  }

  // Replicate (Flux + SDXL + Kontext + any Replicate-hosted wrapper).
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
        console.warn(
          `  ⚠️ Replicate safety-filter (possibly false-positive), retry ${attempt + 1}/${nsfwRetries}`
        );
        continue;
      }
      throw err;
    }
  }
  throw new Error('Flux: unreachable code path'); // for linter — loop always returns or throws
}

/**
 * Download an image to `dest`. Supports two URL schemes:
 *   - https://...           → standard HTTP GET (Replicate, Supabase Storage)
 *   - data:image/...;base64 → decode in-process, no network
 *
 * The native OpenAI + Gemini providers return base64-inline images as
 * `data:image/png;base64,...` URLs (same shape as the Deno providers in
 * `supabase/functions/_shared/providers/*.ts`). Without this dual-mode
 * downloader, those providers blew up at this step with `Protocol "data:"
 * not supported. Expected "https:"`. 2026-05-30.
 */
function download(url, dest) {
  if (typeof url === 'string' && url.startsWith('data:')) {
    // Format: data:<mime>;base64,<payload>
    const comma = url.indexOf(',');
    if (comma < 0) return Promise.reject(new Error('Invalid data URL: no payload'));
    const header = url.slice(5, comma); // e.g. "image/png;base64"
    if (!/;base64$/i.test(header)) {
      return Promise.reject(new Error(`Unsupported data URL encoding: ${header}`));
    }
    const payload = url.slice(comma + 1);
    return fs.promises.writeFile(dest, Buffer.from(payload, 'base64'));
  }
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
// PICKER — shuffle-bag round-robin with exhaustion-reset
// ─────────────────────────────────────────────────────────────

/**
 * Create a picker scoped to one render. Reads ALL prior picks for `botName`
 * from bot_dedup up front (no date window — see below), then provides
 * synchronous pick / pickWithRecency for use inside bot.rollSharedDNA +
 * bot.buildBrief.
 *
 * Per-axis behavior is a SHUFFLE-BAG (2026-06-05): every entry in the pool
 * is picked exactly once before any repeats. When the pool exhausts
 * (filtered set empty), the in-memory recent set is reset for that axis
 * and the axis is marked for DB-side dedup-row deletion on commit(). The
 * next pick draws from the full pool fresh — wash, rinse, repeat forever.
 * Same wash/rinse/repeat the path-level cycle has had since 2026-05-26,
 * now uniformly applied at axis level too.
 *
 * No date window — the historical 5-day rolling window meant entries
 * aged out by clock time instead of by pool coverage, which caused
 * partial cycles at small pool sizes (entries became eligible again
 * before the bag had been emptied). Exhaustion-reset is the right model
 * for round-robin coverage independent of post cadence.
 *
 * Picks are queued in memory and committed to the DB ONLY if the caller
 * invokes commit() — runBot does this only after a successful post.
 * Failed renders don't burn cycle slots.
 *
 * Value stringification: strings pass through; objects use the `text`
 * field if present (matches MOMENTS shape convention), else `id`, else
 * JSON.stringify as last-resort. All bot pools with object values MUST
 * have a `text` property per the MIGRATE-BOT.md convention.
 */
async function createPicker({ botName, sb }) {
  const { data, error } = await sb
    .from('bot_dedup')
    .select('axis, value')
    .eq('bot_name', botName);
  if (error) {
    console.warn(`  ⚠️ bot_dedup read failed (${error.message}); falling back to no recency`);
  }

  const dbRecent = {};
  for (const row of data || []) {
    (dbRecent[row.axis] ??= new Set()).add(row.value);
  }
  const runRecent = {}; // within-this-render dedup
  const pendingPicks = [];
  const exhaustedAxes = new Set(); // axes whose cycle completed this render → DB reset on commit
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
        // Pool exhausted — cycle complete. Reset in-memory db-recent set
        // for this axis (so subsequent within-render picks see the fresh
        // pool too) and mark axis for DB-side deletion on commit. Then
        // draw from the full pool to start the new cycle.
        warnings.push(
          `[picker] axis=${axis} cycle complete after ${db.size} picks — resetting (pool=${pool.length})`
        );
        dbRecent[axis] = new Set();
        exhaustedAxes.add(axis);
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
      if (pendingPicks.length === 0 && exhaustedAxes.size === 0) return;

      // For each axis whose cycle exhausted this render, DELETE its
      // prior dedup rows first — the new pick below seeds the fresh
      // cycle. Scoped to (bot_name, axis) so other bots / other axes
      // are untouched.
      for (const axis of exhaustedAxes) {
        const { error: delErr } = await sb
          .from('bot_dedup')
          .delete()
          .eq('bot_name', botName)
          .eq('axis', axis);
        if (delErr) {
          console.warn(`  ⚠️ bot_dedup cycle-reset (axis=${axis}) failed: ${delErr.message}`);
        }
      }

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
 *   1. defaultMedium (single fixed medium)
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
  // Deterministically exclude recent paths when alternatives exist; fall back
  // to the full set ONLY when every path is in the window. The previous
  // approach rejection-sampled (pick-from-all, retry if recent, 20× cap) and
  // its fallback could return a recent path ~(recent/total)^20 of the time —
  // a rare repeat in prod and the source of the flaky test. Filtering first is
  // equivalent in distribution (weighting preserved) but never repeats a
  // recent path while a fresh one is available.
  const available = bot.paths.filter((p) => !window.includes(p));
  const candidates = available.length > 0 ? available : bot.paths;
  return weightedPick(candidates, bot.pathWeights);
}

// Cycle size = total slots per cycle. With pathWeights, each path occupies
// (weight) slots per cycle (default 1). Without weights, every path gets 1 slot
// and cycle size = bot.paths.length (legacy behavior).
function computeCycleSize(bot) {
  if (!bot.pathWeights) return bot.paths.length;
  return bot.paths.reduce((sum, p) => sum + (bot.pathWeights[p] ?? 1), 0);
}

// Count occurrences of each path in the cycle-history array.
function countOccurrences(arr) {
  const counts = {};
  for (const p of arr || []) {
    counts[p] = (counts[p] || 0) + 1;
  }
  return counts;
}

// Paths with remaining slots in the current cycle (used count < weight).
function getRemainingSlots(bot, usedCounts) {
  return bot.paths.filter((p) => {
    const w = bot.pathWeights ? (bot.pathWeights[p] ?? 1) : 1;
    return (usedCounts[p] || 0) < w;
  });
}

// Pick from remaining paths, weighting by REMAINING slots (paths with more
// slots left get picked more often — this keeps category ratios roughly
// balanced throughout the cycle rather than back-loading the heavy category).
function pickFromRemaining(bot, remaining, usedCounts) {
  if (!bot.pathWeights) {
    return remaining[Math.floor(Math.random() * remaining.length)];
  }
  const slotWeights = {};
  for (const p of remaining) {
    const total = bot.pathWeights[p] ?? 1;
    slotWeights[p] = total - (usedCounts[p] || 0);
  }
  return weightedPick(remaining, slotWeights);
}

// Shuffle-bag path selection: cycle through ALL paths before any repeats.
// Opt in via `cycleAllPaths: true` in bot config. Respects `pathWeights` —
// each path occupies (weight) slots per cycle.
function resolvePathCycled({ bot, recentPaths }) {
  if (!Array.isArray(bot.paths) || bot.paths.length === 0) {
    throw new Error(`Bot ${bot.username} has no paths configured`);
  }
  const usedCounts = countOccurrences(recentPaths);
  const remaining = getRemainingSlots(bot, usedCounts);

  if (remaining.length === 0) {
    return weightedPick(bot.paths, bot.pathWeights);
  }

  return pickFromRemaining(bot, remaining, usedCounts);
}

// In-memory batch path window — shared across renders in a single batch run.
// Persists for the lifetime of the process so consecutive iter-bot renders dedup.
const _batchPathWindow = {};

// Separate cycle tracker for cycleAllPaths bots — resets when cycle completes.
const _batchCycleTracker = {};

// 2026-06-05 — cycle reads filter to source='dispatcher' so iter-bot /
// qa-matrix test runs (source='iter-bot') don't pollute the production
// path cycle. See migration 226_bot_run_log_source.sql for the column
// addition + backfill semantics.
async function getRecentPaths(sb, botName, limit = 5) {
  const { data, error } = await sb
    .from('bot_run_log')
    .select('path')
    .eq('bot_name', botName)
    .eq('status', 'ok')
    .eq('source', 'dispatcher')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) {
    console.warn(`  ⚠️ recent paths query failed: ${error.message}`);
    return [];
  }
  return (data || []).map((r) => r.path);
}

async function getCycledUsedPaths(sb, botName, cycleSize) {
  const { count, error } = await sb
    .from('bot_run_log')
    .select('*', { count: 'exact', head: true })
    .eq('bot_name', botName)
    .eq('status', 'ok')
    .eq('source', 'dispatcher');
  if (error || !count) return [];
  const position = count % cycleSize;
  if (position === 0) return [];
  const { data } = await sb
    .from('bot_run_log')
    .select('path')
    .eq('bot_name', botName)
    .eq('status', 'ok')
    .eq('source', 'dispatcher')
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

async function postAsBot({
  sb,
  userId,
  username,
  localPath,
  prompt,
  vibeKey,
  medium,
  caption,
  recipe,
  fluxSeed,
  model,
}) {
  const bytes = fs.readFileSync(localPath);
  // Pipeline produces JPG (post 2026-05-09 webp revert). PNG kept as a
  // fallback because Replicate occasionally returns PNG for safety-redacted
  // outputs.
  const isPng = bytes[0] === 0x89 && bytes[1] === 0x50;
  const ext = isPng ? 'png' : 'jpg';
  const contentType = isPng ? 'image/png' : 'image/jpeg';
  const key = `${userId}/${Date.now()}-${username}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const up = await sb.storage
    .from('uploads')
    .upload(key, bytes, { contentType, cacheControl: '2592000' });
  if (up.error) throw new Error(`storage upload failed: ${up.error.message}`);
  const publicUrl = sb.storage.from('uploads').getPublicUrl(key).data.publicUrl;

  // Small JPEG DISPLAY variant for the feed (~150KB vs the 1-2MB PNG). image_url
  // above stays the full image (the upscale source — HD downloads unchanged);
  // the feed serves image_url_display. Best-effort: any failure leaves it null
  // and the client coalesces to image_url, so a missing encoder never blocks a post.
  let displayUrl = null;
  let thumbhash = null;
  try {
    const sharp = require('sharp');

    // Display JPEG variant.
    const displayBuf = await sharp(bytes)
      .resize({ width: 768, withoutEnlargement: true })
      .jpeg({ quality: 80, mozjpeg: true })
      .toBuffer();
    const displayKey = `${key.replace(/\.[^.]+$/, '')}.display.jpg`;
    const dUp = await sb.storage
      .from('uploads')
      .upload(displayKey, displayBuf, { contentType: 'image/jpeg', cacheControl: '2592000' });
    if (!dUp.error) {
      displayUrl = sb.storage.from('uploads').getPublicUrl(displayKey).data.publicUrl;
    }

    // Thumbhash — tiny ~25-byte base64 preview hash for the expo-image
    // `placeholder` prop. Resize to fit a 100×100 box (thumbhash spec),
    // ensureAlpha so we always feed it RGBA, then base64-encode the
    // hash bytes. Failure → null; client falls back to surface-tinted
    // placeholder.
    try {
      const meta = await sharp(bytes).metadata();
      if (meta.width && meta.height) {
        const ratio = Math.min(100 / meta.width, 100 / meta.height, 1);
        const tw = Math.max(1, Math.round(meta.width * ratio));
        const th = Math.max(1, Math.round(meta.height * ratio));
        const { data: rgba } = await sharp(bytes)
          .resize(tw, th, { fit: 'fill' })
          .ensureAlpha()
          .raw()
          .toBuffer({ resolveWithObject: true });
        const { rgbaToThumbHash } = require('thumbhash');
        const hashBytes = rgbaToThumbHash(tw, th, rgba);
        thumbhash = Buffer.from(hashBytes).toString('base64');
      }
    } catch (e) {
      if (process.env.DEBUG) console.warn(`[botEngine] thumbhash skipped: ${e.message}`);
    }
  } catch (e) {
    if (process.env.DEBUG) console.warn(`[botEngine] display variant skipped: ${e.message}`);
  }

  // Insert uploads row + select id back so we can populate style_summary after.
  const { data: insRow, error: insErr } = await sb
    .from('uploads')
    .insert({
      user_id: userId,
      image_url: publicUrl,
      image_url_display: displayUrl,
      thumbhash,
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
      recipe: recipe || null,
      flux_seed: fluxSeed ?? null,
      model: model || null,
    })
    .select('id')
    .single();
  if (insErr) throw new Error(`uploads insert failed: ${insErr.message}`);
  const uploadId = insRow.id;

  // Plan C — distill the unified style fingerprint (medium + vibe + ai_prompt)
  // via Haiku and write to uploads.style_summary. AWAITED (cron-safe — without
  // await the script exits before the UPDATE lands). Failure → null → DLT
  // falls back to ai_prompt with the existing weaker filtering. Zero-regression.
  // Mirrors supabase/functions/_shared/styleDistiller.ts (Edge fires-and-forget;
  // bot context awaits because there's no user response to block).
  try {
    const anthropicKey = getKey('ANTHROPIC_API_KEY');
    const summary = await distillStyle(
      { rawPrompt: prompt, mediumKey: medium, vibeKey },
      anthropicKey,
      sb
    );
    if (summary) {
      const { error: updErr } = await sb
        .from('uploads')
        .update({ style_summary: summary })
        .eq('id', uploadId);
      if (updErr) {
        console.warn(`  ⚠️ style_summary update failed: ${updErr.message}`);
      } else {
        console.log(
          `  🎨 style_summary: ${summary.slice(0, 100)}${summary.length > 100 ? '…' : ''}`
        );
      }
    } else {
      console.log(`  ⚠️ style_summary: NULL (DLT will fall back to ai_prompt)`);
    }
  } catch (err) {
    console.warn(`  ⚠️ style_summary distill failed: ${err.message}`);
  }

  // No pre-upscale (2026-05-25). Nothing is auto-upscaled; the HD upscale runs
  // ON DEMAND the first time a Pro user downloads a post (request-upscale /
  // upscale-image Edge Function), then caches on uploads.image_url_hq so every
  // later download is instant. Bots post with image_url_hq=NULL. Inline
  // upscaling here used to block the bot render ~17-70s for no reason (bots are
  // cron-dispatched, nobody waiting). See UPSCALE_QUEUE_PLAN.md.
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
 *   source    — bot_run_log source tag ('dispatcher' | 'iter-bot' | 'qa-matrix'
 *               | 'run-bot' | 'manual'). Default 'dispatcher' for the
 *               production cron path. iter-bot passes 'iter-bot' so its test
 *               runs are excluded from the cycle math (see getCycledUsedPaths
 *               + getRecentPaths) and don't pollute production round-robin.
 *               Migration 226_bot_run_log_source.sql adds the column.
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
    source = 'dispatcher',
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
      const cycleSize = computeCycleSize(bot);
      if (!_batchCycleTracker[bot.username]) {
        _batchCycleTracker[bot.username] = await getCycledUsedPaths(sb, bot.username, cycleSize);
      }
      const usedCounts = countOccurrences(_batchCycleTracker[bot.username]);
      const remaining = getRemainingSlots(bot, usedCounts);
      if (remaining.length === 0) {
        _batchCycleTracker[bot.username] = [];
        resolvedPath = weightedPick(bot.paths, bot.pathWeights);
      } else {
        resolvedPath = pickFromRemaining(bot, remaining, usedCounts);
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
  let medium = resolveMedium({ bot, path: resolvedPath });
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

  // Accumulator for the DLT recipe — populated as the engine rolls/builds.
  // Path-builders may also contribute lighting/camera/blow-it-up via the
  // optional briefMeta return shape (see step 5 below). Phase 1 captures
  // what the engine itself can see; missing fields stay null and can be
  // progressively enriched in a follow-up.
  const recipeBlocks = {
    chaosBlock: null,
    sensoryBlock: null,
    blowItUpBlock: null,
    camera: null,
    lighting: null,
  };

  try {
    // 1. Fetch vibe directive + medium flux fragment
    errorStage = 'vibe-lookup';
    const vibeDirective = await fetchVibeDirective(sb, vibeKey);
    const mediumFluxFragment = await fetchMediumFluxFragment(sb, medium);

    // NSFW-recovery loop: if Flux flags the prompt as NSFW after its own
    // internal same-prompt retries (2 attempts), re-roll all pool picks and
    // rebuild the brief from scratch. Up to 3 outer recoveries × 3 inner
    // flux attempts = up to 9 total flux calls per render before giving up.
    // Used by iter-bot, run-bot, generate-bot-dreams, and nightly via the
    // shared runBot pipeline.
    let fluxUrl;
    let recipe; // built inside while, used after it
    let textContent = null; // built inside while, used in postProcess after
    let chaosProfile = { intensity: 0, injections: [], channelKey: null };
    let sensoryProfile = { anchors: [], channelKeys: [], context: null };
    let nsfwRecoveryAttempt = 0;
    const MAX_NSFW_RECOVERY = 3;
    // 2026-06-06 — bot-level nudity-check gating (e.g. faebot character paths,
    // oceanbot mystical-mermaid). Haiku-vision classifier runs on downloaded
    // image; if it flags bare chest / visible nipples, the whole render
    // re-rolls (fresh picker + fresh brief). See scripts/lib/nudityCheck.js.
    let nudityRecoveryAttempt = 0;
    const MAX_NUDITY_RECOVERY = bot.nudityCheck?.maxRetries ?? 2;
    const isNudityGated = !!(
      bot.nudityCheck?.enabled && bot.nudityCheck?.paths?.includes(resolvedPath)
    );
    while (true) {
      if (nsfwRecoveryAttempt > 0) {
        console.warn(
          `  🔄 NSFW recovery #${nsfwRecoveryAttempt}/${MAX_NSFW_RECOVERY}: re-rolling all pool picks`
        );
      }

      // 2. Create picker — shuffle-bag with exhaustion-reset (2026-06-05).
      // Loads all prior bot_dedup picks for this bot at start; resets axis
      // cycles when their pool exhausts during the render.
      errorStage = 'picker-init';
      picker = await createPicker({ botName: bot.username, sb });

      // 3. Roll shared DNA (optional)
      errorStage = 'roll-shared-dna';
      sharedDNA = bot.rollSharedDNA
        ? bot.rollSharedDNA({ vibeKey, medium, path: resolvedPath, picker })
        : {};

      // 4. Optional text content (HumanBot/GlowBot thinking-bot pattern)
      textContent = null;
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
      // Reset chaosProfile and sensoryProfile each NSFW retry — outer-scoped
      // so they survive after the while loop exits.
      chaosProfile = { intensity: 0, injections: [], channelKey: null };
      sensoryProfile = { anchors: [], channelKeys: [], context: null };
      const isDirectPrompt = briefResult && typeof briefResult === 'object' && briefResult.direct;

      // briefMeta — optional path-builder-supplied recipe enrichment.
      // Path builders may return either:
      //   string  — the brief (legacy)
      //   { direct: true, prompt: string, briefMeta? } — Sonnet-bypass with optional meta
      //   { brief: string, briefMeta: {...} } — brief + recipe metadata (camera/lighting/blowItUpBlock)
      // briefMeta fields populate the recipe's per-path look anchors so DLT
      // can replay them. If a builder doesn't return briefMeta, those fields
      // stay null in the recipe (ai_prompt fallback covers them).
      const briefMeta =
        briefResult && typeof briefResult === 'object' && briefResult.briefMeta
          ? briefResult.briefMeta
          : {};
      if (briefMeta.camera) recipeBlocks.camera = briefMeta.camera;
      if (briefMeta.lighting) recipeBlocks.lighting = briefMeta.lighting;
      if (briefMeta.blowItUpBlock) recipeBlocks.blowItUpBlock = briefMeta.blowItUpBlock;

      if (isDirectPrompt) {
        // Path composed the Flux prompt directly — skip Sonnet entirely
        middle = briefResult.prompt;
        if (!middle || middle.length < 30) {
          throw new Error(`direct prompt too short (len=${middle?.length})`);
        }
        console.log('  ⚡ direct prompt (Sonnet bypassed)');
      } else {
        // Standard path: brief → (optional chaos block) → Sonnet → scene description
        // Support shape { brief, briefMeta } too — brief lives at .brief.
        let brief;
        if (typeof briefResult === 'string') {
          brief = briefResult;
        } else if (briefResult && typeof briefResult.brief === 'string') {
          brief = briefResult.brief;
        } else {
          brief = String(briefResult);
        }
        if (!brief || brief.length < 50) {
          throw new Error(`buildBrief returned invalid brief (len=${brief.length})`);
        }

        // 5b. Roll chaos and append distortion block to the brief.
        // bot.chaos.allowSubjectChaosPaths controls which paths permit subject-level
        // chaos (silhouette/echo distortions). Default: subject chaos OFF (safe for
        // character-centric paths). Scenery paths can opt in via allowSubjectChaosPaths.
        const allowSubjectChaos = Boolean(
          bot.chaos &&
          bot.chaos.allowSubjectChaosPaths &&
          bot.chaos.allowSubjectChaosPaths.includes(resolvedPath)
        );
        chaosProfile = rollChaos({ path: resolvedPath, botChaos: bot.chaos, allowSubjectChaos });
        const chaosBlock = buildChaosBriefBlock(chaosProfile);
        if (chaosBlock) {
          brief = brief + chaosBlock;
          recipeBlocks.chaosBlock = chaosBlock;
          console.log(
            `  🌀 chaos: ${chaosProfile.channelKey} (intensity=${chaosProfile.intensity.toFixed(2)}, n=${chaosProfile.injections.length})`
          );
        }

        // 5c. Roll sensory anchors and append. Layered after chaos (chaos warps
        // perception, sensory grounds it). Opt-in via bot.sensoryAnchors — bots
        // without the config block get nothing here.
        sensoryProfile = rollSensoryAnchors({ path: resolvedPath, botSensory: bot.sensoryAnchors });
        const sensoryBlock = buildSensoryBriefBlock(sensoryProfile);
        if (sensoryBlock) {
          brief = brief + sensoryBlock;
          recipeBlocks.sensoryBlock = sensoryBlock;
          console.log(
            `  🌿 sensory: ${sensoryProfile.channelKeys.join('+')} [${sensoryProfile.context}] (n=${sensoryProfile.anchors.length})`
          );
        }

        // 6. Generate "middle" — either single-pass Sonnet OR two-pass Sonnet→Haiku.
        // Two-pass is opt-in via bot.twoPassPolish — see README/docs for the contract.
        // Reusable across bots: any bot can add the same config block to enable.
        errorStage = 'sonnet';
        const tp = bot.twoPassPolish;
        const useTwoPass = Boolean(
          tp && tp.enabled && !(tp.skipPaths && tp.skipPaths.includes(resolvedPath))
        );

        const generateMiddle = async () => {
          if (useTwoPass) {
            // Pass 1: Sonnet writes a vivid extended concept (no compression pressure)
            const conceptWords = tp.conceptWords || 150;
            const conceptBrief = extendBriefForConcept(brief, conceptWords);
            const sonnet = await callClaude({ brief: conceptBrief, maxTokens: 600 });
            // Pass 2: Haiku polishes to Flux-ready length, preserving anchor phrases.
            // Per-path word range overrides global (vampire-girls-2 needs more headroom).
            const polishedWords =
              (tp.polishedWordsByPath && tp.polishedWordsByPath[resolvedPath]) ||
              tp.polishedWords ||
              '65-90';
            // Merge bot-config preserve phrases with the sensory anchors actually
            // rolled this turn — Haiku gets explicit instruction to keep both.
            const basePreserve =
              (tp.preservePhrasesByPath && tp.preservePhrasesByPath[resolvedPath]) ||
              tp.preservePhrases ||
              [];
            const sensoryPreserve = (sensoryProfile.anchors || []).map((a) => a.phrase);
            const preservePhrases = [...basePreserve, ...sensoryPreserve];
            const polishBrief = buildPolishBrief({
              concept: sonnet.text,
              polishedWords,
              preservePhrases,
            });
            const haiku = await callClaude({
              brief: polishBrief,
              maxTokens: 400,
              primary: SECONDARY_MODEL,
              secondary: PRIMARY_MODEL,
            });
            return {
              text: haiku.text,
              modelUsed: `${sonnet.modelUsed}+${haiku.modelUsed}`,
              retries: sonnet.retries + haiku.retries,
              fellBackToSecondary: sonnet.fellBackToSecondary || haiku.fellBackToSecondary,
            };
          }
          // Standard single-pass
          return callClaude({ brief, maxTokens: 400 });
        };

        const claude = await generateMiddle();
        claudeMeta = {
          retries: claude.retries,
          fellBackToSecondary: claude.fellBackToSecondary,
          modelUsed: claude.modelUsed,
        };
        middle = claude.text;
        if (useTwoPass) {
          console.log(
            `  🔁 two-pass polish: concept→Haiku-polished (${middle.split(/\s+/).length} words)`
          );
        }

        // 6b. Refusal detection — retry full pipeline up to 3 times.
        //
        // Patterns cover BOTH content-policy refusals (the original Sonnet
        // case) AND polite-clarification refusals from the two-pass polish
        // step (the Haiku case). The polite ones bit MangaBot magical-girl
        // on 2026-05-29 — Haiku was force-fed off-genre sensory anchors via
        // preservePhrases (noir cigarette/convenience-store on a magical-girl
        // cloudscape) and responded with "I notice... Could you clarify?"
        // The full refusal text shipped as the Flux prompt. preservePhrases
        // mandate also softened (see twoPassPolish.js) to prevent the
        // mismatch upstream.
        const REFUSAL_PATTERNS = [
          // Content-policy refusals (Sonnet primary failure mode)
          'I cannot create',
          "I'm not able to",
          'I appreciate your',
          "I'd be happy to help",
          'violate content policies',
          'sexually suggestive',
          'not able to generate',
          'alternative approaches',
          // Polite-clarification refusals (Haiku polish failure mode)
          'I notice the mandatory',
          'I appreciate the detailed',
          'Could you clarify',
          'please confirm the correct',
          'I want to deliver',
          'Should I incorporate',
          'Should I proceed',
          'absent from the input',
        ];
        const isRefusal = (t) => REFUSAL_PATTERNS.some((p) => t.includes(p));
        {
          let refusalRetries = 0;
          while (refusalRetries < 3 && isRefusal(middle)) {
            refusalRetries += 1;
            console.warn(`  ⚠️ content refusal, retrying (${refusalRetries}/3)`);
            const retry = await generateMiddle();
            middle = retry.text;
          }
          if (isRefusal(middle)) {
            throw new Error('Content refusal after 3 retries (policy)');
          }
        }

        // 7. Banned-phrase retry (up to 2 retries = 3 total attempts)
        if (bot.bannedPhrases && bot.bannedPhrases.length > 0) {
          errorStage = 'banned-phrase-check';
          const lower = (s) => s.toLowerCase();
          let retries = 0;
          while (retries < 2 && bot.bannedPhrases.some((p) => lower(middle).includes(lower(p)))) {
            retries += 1;
            console.warn(`  ⚠️ banned phrase detected, retrying (${retries}/2)`);
            const retry = await generateMiddle();
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
      let rawPrefix =
        (bot.promptPrefixByMedium && bot.promptPrefixByMedium[medium]) || bot.promptPrefix || '';
      let rawSuffix =
        (bot.promptSuffixByPath && bot.promptSuffixByPath[resolvedPath]) ||
        (bot.promptSuffixByMedium && bot.promptSuffixByMedium[medium]) ||
        bot.promptSuffix ||
        '';
      const prefix = rawPrefix ? `${rawPrefix}, ` : '';
      const suffix = rawSuffix ? `, ${rawSuffix}` : '';
      // Per-path prefix — prepended BEFORE style prefix so it's the first tokens Flux sees.
      // Use case: gender lock for cyborg-man needs to appear before "beauty" in style prefix.
      const pathPrefix =
        bot.promptPrefixByPath && bot.promptPrefixByPath[resolvedPath]
          ? `${bot.promptPrefixByPath[resolvedPath]}, `
          : '';
      // Per-medium style injection — bot.mediumStyles overrides DB flux_fragment if set.
      // Otherwise falls back to the DB's flux_fragment for this medium.
      const mediumStyle =
        bot.mediumStyles && bot.mediumStyles[medium]
          ? `${bot.mediumStyles[medium]}, `
          : mediumFluxFragment
            ? `${mediumFluxFragment}, `
            : '';
      finalPrompt = `${pathPrefix}${prefix}${mediumStyle}${middle}${suffix}`
        .replace(/\s+,/g, ',')
        .trim();

      // Resolve the render model BEFORE building the recipe — buildRecipe
      // freezes recipe.model into the upload row, and DLT replay reads it
      // back to pick the model on replay. Resolving after recipe-build
      // (the prior order) silently stamped every recipe with the unmodified
      // default ('flux-dev'), even on paths that modelByPath locked to
      // flux-1.1-pro. DLT replay then re-rolled on flux-dev. See May 2026.
      //
      // Priority: bot.modelByPath > pickModel (medium+vibe → pool) > default.
      // If bot.useModelPicker is true, pickModel() reads dream_mediums.allowed_models
      // (with bot-scope, includes bot-only mediums) and random-picks a Flux/SDXL model.
      // Bot.modelByPath HARDCODES a specific model for a specific path, overriding
      // the medium pool — use this when a path's aesthetic needs a specific model.
      let renderInputOverrides = {};
      // Conditional-layer override: when the brief composer's night_mode (or
      // future similar signal) fired, swap to a model that handles dark scenes
      // better than the default. flux-dev locks into bright kawaii-pastel
      // daytime lighting regardless of prompt content; flux-1.1-pro-ultra
      // honors night/dark scene language. Takes priority over modelByPath +
      // useModelPicker (a fired conditional layer wins).
      if (briefMeta && briefMeta.nightModeFired) {
        renderModel = 'black-forest-labs/flux-1.1-pro-ultra';
        renderInputOverrides = {};
        console.log(`  🌙 model=${renderModel} (night_mode fired — flux-1.1-pro-ultra override)`);
      } else if (bot.modelByPath && bot.modelByPath[resolvedPath]) {
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
          for (const [m, w] of entries) {
            roll -= w;
            if (roll <= 0) {
              renderModel = m;
              break;
            }
          }
        } else {
          renderModel = Array.isArray(modelVal)
            ? modelVal[Math.floor(Math.random() * modelVal.length)]
            : modelVal;
        }
        // PNG output is the global Flux default (set in fluxOnce, 2026-05-15).
        // SDXL needs explicit dimensions.
        if (renderModel === 'sdxl')
          renderInputOverrides = {
            width: 768,
            height: 1344,
            num_inference_steps: 30,
            guidance_scale: 7.5,
          };
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

      // mediumByModel override: when the rolled model is keyed in
      // bot.mediumByModel, swap to that bot-only "clean" medium and
      // rebuild the prompt. Model is unchanged (picker has already
      // chosen) — only the prompt's stylistic register changes.
      //
      // Why: certain models (notably GPT-Image-2) read most bots' default
      // mediums + promptPrefix as "go full abstract / over-stylized" and
      // produce renders that don't read as the bot's actual content. A
      // per-bot _gpt_clean medium with a positive-only directive +
      // promptPrefixByMedium override neutralizes the bot's normal
      // painterly anchors so GPT-Image-2's output is recognizable. Mirrors
      // the 2026-06-05 OceanBot mystical-mermaid cleanup.
      //
      // The new medium MUST declare bot.mediumStyles[newMedium] (no DB
      // re-fetch here). promptPrefixByMedium / promptSuffixByMedium are
      // honored for the new medium, so the swap can replace prefix+suffix
      // too — necessary for bots whose default promptPrefix carries
      // strong stylistic anchors (gothic horror, steampunk brass, etc.).
      if (bot.mediumByModel && bot.mediumByModel[renderModel]) {
        const overrideMedium = bot.mediumByModel[renderModel];
        console.log(
          `  🎨 medium override: ${medium} → ${overrideMedium} (model=${renderModel} via mediumByModel)`
        );
        medium = overrideMedium;
        rawPrefix =
          (bot.promptPrefixByMedium && bot.promptPrefixByMedium[medium]) ||
          bot.promptPrefix ||
          '';
        rawSuffix =
          (bot.promptSuffixByPath && bot.promptSuffixByPath[resolvedPath]) ||
          (bot.promptSuffixByMedium && bot.promptSuffixByMedium[medium]) ||
          bot.promptSuffix ||
          '';
        const newPrefix = rawPrefix ? `${rawPrefix}, ` : '';
        const newSuffix = rawSuffix ? `, ${rawSuffix}` : '';
        const newMediumStyle =
          bot.mediumStyles && bot.mediumStyles[medium] ? `${bot.mediumStyles[medium]}, ` : '';
        finalPrompt = `${pathPrefix}${newPrefix}${newMediumStyle}${middle}${newSuffix}`
          .replace(/\s+,/g, ',')
          .trim();
      }

      // Build the DLT recipe — frozen LOOK anchors captured at posting time.
      // See docs/DLT_RECIPE_PLAN.md for full architecture. Stored on the
      // upload row as JSONB; replayed at DLT time to reproduce source's
      // medium + look against a new user's subject/cast.
      recipe = buildRecipe({
        model: renderModel,
        mediumKey: medium,
        vibeKey,
        aiPrompt: finalPrompt,
        // fluxSeed left null in Phase 1 — Replicate response capture is a
        // follow-up enrichment (see DLT_RECIPE_PLAN Phase 1.5).
        fluxSeed: null,
        promptPrefix: pathPrefix
          ? `${bot.promptPrefixByPath[resolvedPath]}, ${rawPrefix}`
          : rawPrefix,
        mediumStyleOverride:
          bot.mediumStyles && bot.mediumStyles[medium]
            ? bot.mediumStyles[medium]
            : mediumFluxFragment || '',
        promptSuffix: rawSuffix,
        camera: recipeBlocks.camera,
        lighting: recipeBlocks.lighting || '',
        scenePalette: sharedDNA?.scenePalette || '',
        colorPalette: sharedDNA?.colorPalette || '',
        chaosBlock: recipeBlocks.chaosBlock,
        sensoryBlock: recipeBlocks.sensoryBlock,
        blowItUpBlock: recipeBlocks.blowItUpBlock,
        botUsername: bot.username,
        path: resolvedPath,
      });

      if (dryRun) {
        return {
          ok: true,
          dryRun: true,
          finalPrompt,
          sharedDNA,
          path: resolvedPath,
          vibeKey,
          medium,
          recipe,
        };
      }

      // 9. Replicate render — uses the renderModel + inputOverrides resolved above.
      // Wrapped in NSFW-recovery try/catch: on safety-filter trip (after flux's
      // own internal same-prompt retries), re-roll picker + rebuild brief.
      errorStage = 'flux';
      try {
        fluxUrl = await flux({
          prompt: finalPrompt,
          aspectRatio: '9:16',
          model: renderModel,
          inputOverrides: renderInputOverrides,
        });
      } catch (err) {
        const isNsfw =
          err && err.message && /NSFW|sensitive|flagged|safety|E005/i.test(err.message);
        if (isNsfw && nsfwRecoveryAttempt < MAX_NSFW_RECOVERY) {
          nsfwRecoveryAttempt++;
          continue; // back to top of while — re-creates picker + re-rolls
        }
        throw err;
      }

      // 9b. Download — moved inside the loop 2026-06-06 so the optional
      // bare-chest classifier (step 9c) can re-trigger this whole loop.
      errorStage = 'download';
      const filename = `${String(idx ?? 1).padStart(2, '0')}-${label || 'run'}.jpg`;
      const saveDir = outDir || `/tmp/${bot.username}-${label || 'run'}`;
      fs.mkdirSync(saveDir, { recursive: true });
      localPath = path.join(saveDir, filename);
      await download(fluxUrl, localPath);

      // 9c. Optional nudity check — Haiku vision classifier. Only fires when
      // the bot's nudityCheck config gates this path. On flag, re-roll the
      // whole render (fresh picker + brief + flux). Fails open on classifier
      // errors so a transient API outage doesn't strand renders.
      if (isNudityGated) {
        errorStage = 'nudity-check';
        const { classifyImageForNudity } = require('./nudityCheck');
        const result = await classifyImageForNudity({ localPath });
        if (result.flagged) {
          if (nudityRecoveryAttempt < MAX_NUDITY_RECOVERY) {
            nudityRecoveryAttempt++;
            console.warn(
              `  🚫 nudity flagged (${result.raw}) — re-roll ${nudityRecoveryAttempt}/${MAX_NUDITY_RECOVERY}`
            );
            continue; // back to top of while — re-creates picker + re-rolls
          }
          // Exhausted: fail loudly so the render is dropped (not posted).
          throw new Error(
            `nudity-check: max retries exhausted (${MAX_NUDITY_RECOVERY}) — last result ${result.raw}`
          );
        }
      }

      break; // success — exit NSFW + nudity recovery loop
    } // end NSFW-recovery while

    // 11. Optional post-process (HumanBot/GlowBot text overlay)
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
        recipe,
        fluxSeed: null,
        model: renderModel,
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
        source,
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
      chaos: chaosProfile,
      sensory: sensoryProfile,
      recipe,
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
          source,
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
