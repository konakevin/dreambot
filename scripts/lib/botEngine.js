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

async function fluxOnce({ prompt, aspectRatio, model, replicateKey }) {
  const res = await fetch(`https://api.replicate.com/v1/models/${model}/predictions`, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + replicateKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      input: { prompt, aspect_ratio: aspectRatio, num_outputs: 1, output_format: 'jpg' },
    }),
  });
  if (!res.ok) {
    const body = (await res.text()).slice(0, 400);
    throw new Error(`Flux ${res.status}: ${body}`);
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
      throw new Error(`Flux ${pd.status}: ${pd.error || 'no error message'}`);
    }
  }
  throw new Error('Flux timed out after 90s');
}

/**
 * Flux with NSFW false-positive auto-retry. Flux's safety model occasionally
 * flags perfectly-fine cyborg renders as NSFW — retrying the same prompt
 * usually succeeds because diffusion is stochastic. We retry up to 2 times
 * on NSFW errors; other errors fail-fast.
 */
async function flux({
  prompt,
  aspectRatio = '9:16',
  model = 'black-forest-labs/flux-dev',
  replicateKey,
  nsfwRetries = 2,
}) {
  const key = replicateKey || getKey('REPLICATE_API_TOKEN');
  if (!key) throw new Error('REPLICATE_API_TOKEN missing');

  for (let attempt = 0; attempt <= nsfwRetries; attempt++) {
    try {
      return await fluxOnce({ prompt, aspectRatio, model, replicateKey: key });
    } catch (err) {
      const isNsfw = err && err.message && /NSFW/i.test(err.message);
      if (isNsfw && attempt < nsfwRetries) {
        console.warn(`  ⚠️ Flux NSFW false-positive, retry ${attempt + 1}/${nsfwRetries}`);
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
 * Resolve vibe for a render. Respects vibesByMedium override, else falls
 * back to bot.vibes. Weighted-random via repetition (array style).
 */
function resolveVibe({ bot, medium }) {
  const perMedium = bot.vibesByMedium?.[medium];
  const pool = (Array.isArray(perMedium) && perMedium.length > 0 ? perMedium : bot.vibes) || [];
  if (pool.length === 0) {
    throw new Error(`Bot ${bot.username} has no vibes configured (medium=${medium})`);
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Weighted path pick. bot.pathWeights can specify per-path weights;
 * unlisted paths default to 1.
 */
function resolvePath({ bot }) {
  if (!Array.isArray(bot.paths) || bot.paths.length === 0) {
    throw new Error(`Bot ${bot.username} has no paths configured`);
  }
  return weightedPick(bot.paths, bot.pathWeights);
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

  // Resolve path, medium, vibe
  const resolvedPath =
    pathArg === 'random'
      ? resolvePath({ bot })
      : (() => {
          if (!bot.paths.includes(pathArg)) {
            throw new Error(`Path '${pathArg}' not in bot.paths: ${bot.paths.join(', ')}`);
          }
          return pathArg;
        })();
  const medium = resolveMedium({ bot, path: resolvedPath });
  const vibeKey = vibeArg === 'random' ? resolveVibe({ bot, medium }) : vibeArg;

  const runMeta = {
    botName: bot.username,
    path: resolvedPath,
    vibe: vibeKey,
    medium,
  };

  let errorStage = null;
  let finalPrompt = null;
  let sharedDNA = null;
  let picker = null;
  let claudeMeta = { retries: 0, fellBackToSecondary: false };
  let localPath = null;
  let imageUrl = null;

  try {
    // 1. Fetch vibe directive
    errorStage = 'vibe-lookup';
    const vibeDirective = await fetchVibeDirective(sb, vibeKey);

    // 2. Create picker (pre-loads recency window)
    errorStage = 'picker-init';
    picker = await createPicker({ botName: bot.username, windowDays: 5, sb });

    // 3. Roll shared DNA (optional)
    errorStage = 'roll-shared-dna';
    sharedDNA = bot.rollSharedDNA
      ? bot.rollSharedDNA({ vibeKey, picker })
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

    // 5. Build brief
    errorStage = 'build-brief';
    const brief = bot.buildBrief({
      path: resolvedPath,
      sharedDNA,
      vibeDirective,
      vibeKey,
      picker,
    });
    if (!brief || typeof brief !== 'string' || brief.length < 50) {
      throw new Error(`buildBrief returned invalid brief (len=${brief?.length})`);
    }

    // 6. Call Sonnet
    errorStage = 'sonnet';
    const claude = await callClaude({ brief, maxTokens: 400 });
    claudeMeta = {
      retries: claude.retries,
      fellBackToSecondary: claude.fellBackToSecondary,
      modelUsed: claude.modelUsed,
    };
    let middle = claude.text;

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

    // 8. Compose final prompt with bot's prefix/suffix
    errorStage = 'compose-prompt';
    const prefix = bot.promptPrefix ? `${bot.promptPrefix}, ` : '';
    const suffix = bot.promptSuffix ? `, ${bot.promptSuffix}` : '';
    finalPrompt = `${prefix}${middle}${suffix}`.replace(/\s+,/g, ',').trim();

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

    // 9. Flux render
    errorStage = 'flux';
    const fluxUrl = await flux({ prompt: finalPrompt, aspectRatio: '9:16' });

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
