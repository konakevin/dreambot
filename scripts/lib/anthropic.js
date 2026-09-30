/**
 * anthropic.js — the Node Anthropic Messages client (LLM_MIGRATION.md; Sonnet 4.6 → 5.5 plan, step 0).
 *
 * The Node MIRROR of supabase/functions/_shared/anthropic.ts: the same model profiles, request bodies, reply
 * parsing, chain and stamps, for the bot fleet and the offline tools. __tests__/lib/anthropicClientParity.test.ts
 * fails CI if the two send different bodies or read replies differently. Change both together.
 *
 * Callers name a JOB, never a model. A job's model comes from, highest first:
 *   1. an explicit override (a script's --llm-model / LLM_MODEL_OVERRIDE; "model" or "model@effort"), for the
 *      jobs whose default is Sonnet 4.6 (Haiku jobs keep Haiku),
 *   2. engine_config.llm_preview_models, for a user in llm_preview_user_ids (a BOT is a user: this is how AlphaBot
 *      canaries a model before the fleet),
 *   3. engine_config.llm_models[job],
 *   4. the job's code default below (the model that call used before this file existed).
 *
 * Sonnet 4.6 and Haiku get exactly the body the call sites sent before. Sonnet 5.5 gets
 * `thinking: {type: 'between_tools'}` (it thinks by default otherwise, and the text arrives after the thinking
 * blocks), `output_config.effort`, and max_tokens x1.6 (its tokenizer counts its own prompt output 1.44-1.62x 4.6's). Never a prefill or temperature/top_p/top_k.
 * Replies are every text block joined, never content[0]. A refusal, an empty reply, or one under minChars fails
 * that model and the chain moves on: routed → the job's default → its fallbacks.
 *
 * Stamps (ctx.stamp, once each) → bot_run_log.llm_models:
 *   llm:<job>:<model> · llm_fallback:<job>:<from>→<to>:<kind> · llm_refusal:<job>:<model>:<category>
 *   llm_truncated:<job>:<model> · llm_failed:<job>:<kind> · llm_config_invalid:<job>:<value>
 */

const { SONNET, HAIKU, SONNET_5_5, SONNET_5 } = require('./models');

const RETRY_DELAYS_MS = [1000, 3000, 10000, 30000];
const RETRYABLE_STATUSES = new Set([429, 500, 502, 503, 504, 529]);

// ── Models ─────────────────────────────────────────────────────────────

const EFFORTS = ['low', 'medium', 'high'];

const MODEL_PROFILES = {
  [SONNET]: { tokenScale: 1, extraBody: () => ({}) },
  [HAIKU]: { tokenScale: 1, extraBody: () => ({}) },
  [SONNET_5_5]: {
    tokenScale: 1.6,
    extraBody: (effort) => ({
      thinking: { type: 'between_tools' },
      output_config: { effort },
    }),
  },
  // Sonnet 5 (the cast race read only): 5.5's tokenizer; rejects between_tools, so thinking is disabled.
  [SONNET_5]: { tokenScale: 1.6, extraBody: () => ({ thinking: { type: 'disabled' } }) },
};

function isKnownModel(model) {
  return Object.prototype.hasOwnProperty.call(MODEL_PROFILES, model);
}

// ── Jobs ───────────────────────────────────────────────────────────────

/** Every production Node Anthropic call, by job. Offline tools use the generic `script` / `seed_gen` jobs. */
const LLM_JOBS = {
  // textOut: the reply IS the output (a Flux prompt): a message to the user in its place fails the model.
  bot_prompt: { model: SONNET, fallbacks: [HAIKU], textOut: true }, // botEngine: the bot brief → Flux prompt
  bot_polish: { model: HAIKU, fallbacks: [SONNET], textOut: true }, // botEngine two-pass: Haiku polishes Sonnet's concept
  bot_nudity: { model: HAIKU, fallbacks: [] }, // nudityCheck: the post-render nudity read
  bot_style_distill: { model: HAIKU, fallbacks: [] }, // styleDistiller (DLT fingerprint for bot posts)
  seed_gen: { model: SONNET, fallbacks: [] }, // seedGenHelper.generatePool (offline)
  reseed: { model: SONNET, fallbacks: [] }, // reseed/lib/core.js (offline)
  script: { model: SONNET, fallbacks: [] }, // any other offline script
};

function isLlmJob(v) {
  return Object.prototype.hasOwnProperty.call(LLM_JOBS, v);
}

// ── Routing config ─────────────────────────────────────────────────────

const EMPTY_LLM_ROUTING = { models: {}, previewUserIds: [], previewModels: {} };

function parseRouteString(raw) {
  const s = String(raw).trim();
  if (!s) return null;
  const at = s.lastIndexOf('@');
  if (at <= 0) return { model: s };
  const model = s.slice(0, at).trim();
  const effort = s.slice(at + 1).trim();
  if (!model) return null;
  return EFFORTS.includes(effort) ? { model, effort } : { model };
}

function parseRoute(v) {
  if (typeof v === 'string') return parseRouteString(v);
  if (v && typeof v === 'object' && !Array.isArray(v)) {
    if (typeof v.model !== 'string' || !v.model.trim()) return null;
    return typeof v.effort === 'string' && EFFORTS.includes(v.effort)
      ? { model: v.model.trim(), effort: v.effort }
      : { model: v.model.trim() };
  }
  return null;
}

/** A jsonb job map; keys that are not Node jobs are dropped (the Edge jobs share the column). */
function parseLlmRoutes(raw) {
  const out = {};
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return out;
  for (const [job, v] of Object.entries(raw)) {
    if (!isLlmJob(job)) continue;
    const route = parseRoute(v);
    if (route) out[job] = route;
  }
  return out;
}

function parseLlmOverride(raw) {
  if (typeof raw !== 'string') return null;
  const route = parseRouteString(raw);
  return route && isKnownModel(route.model) ? route : null;
}

let routingCache = null;
/**
 * engine_config's LLM routing, read on its OWN (not in engineConfig.js's explicit column list, where one missing
 * column would 400 the whole select and default every other field). Any error → empty routing = code defaults.
 */
async function fetchLlmRouting(sb) {
  if (routingCache) return routingCache;
  try {
    const { data, error } = await sb
      .from('engine_config')
      .select('llm_models, llm_preview_user_ids, llm_preview_models')
      .eq('id', 1)
      .single();
    if (error || !data) {
      routingCache = EMPTY_LLM_ROUTING;
    } else {
      routingCache = {
        models: parseLlmRoutes(data.llm_models),
        previewUserIds: Array.isArray(data.llm_preview_user_ids)
          ? data.llm_preview_user_ids.filter((x) => typeof x === 'string')
          : [],
        previewModels: parseLlmRoutes(data.llm_preview_models),
      };
    }
  } catch (_e) {
    routingCache = EMPTY_LLM_ROUTING;
  }
  return routingCache;
}

/**
 * For offline tools that pick their own model (seedGenHelper, reseed): a Sonnet 4.6 call becomes the script's
 * --llm-model / LLM_MODEL_OVERRIDE when one is set; every other model (a Haiku judge) is left alone.
 */
function offlineModel(model, argv = process.argv, env = process.env) {
  const o = parseLlmOverride(llmOverrideFromArgs(argv, env));
  return model === SONNET && o ? o : { model };
}

/** A pre-client offline body for a model with no profile (whatever id a script pinned); the profile's otherwise. */
function offlineBody(route, content, maxTokens) {
  return isKnownModel(route.model)
    ? buildRequestBody(route.model, { content, maxTokens }, route.effort || 'high')
    : { model: route.model, max_tokens: maxTokens, messages: [{ role: 'user', content }] };
}

/** The override a script was started with: `--llm-model <m>` / `--llm-model=<m>`, else LLM_MODEL_OVERRIDE. */
function llmOverrideFromArgs(argv = process.argv, env = process.env) {
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--llm-model' && argv[i + 1]) return argv[i + 1];
    if (a.startsWith('--llm-model=')) return a.slice('--llm-model='.length);
  }
  return env.LLM_MODEL_OVERRIDE || null;
}

// ── Request context ────────────────────────────────────────────────────

function createLlmContext({ routing, userId, override, stamp } = {}) {
  const r = routing || EMPTY_LLM_ROUTING;
  const preview = !!userId && r.previewUserIds.includes(userId);
  const routes = preview ? { ...r.models, ...r.previewModels } : { ...r.models };
  const parsedOverride = parseLlmOverride(override);
  const seen = new Set();
  const all = [];
  const ctxStamp = (s) => {
    if (seen.has(s)) return;
    seen.add(s);
    all.push(s);
    if (stamp) stamp(s);
  };
  if (parsedOverride) {
    ctxStamp(
      `qa:llm_model:${parsedOverride.model}${parsedOverride.effort ? '@' + parsedOverride.effort : ''}`
    );
  } else if (override !== undefined && override !== null && override !== '') {
    ctxStamp(`qa:llm_model_ignored:${String(override).slice(0, 40)}`);
  }
  if (preview && Object.keys(r.previewModels).length > 0) ctxStamp('llm_preview');
  return { routes, override: parsedOverride, stamp: ctxStamp, stamps: () => all.slice() };
}

// ── Resolution ─────────────────────────────────────────────────────────

function resolveRoute(job, llm) {
  const spec = LLM_JOBS[job];
  // The override swaps the SONNET jobs only; a Haiku job (the polish pass, the nudity read) keeps its model.
  if (llm && llm.override && spec.model === SONNET) return { route: llm.override, source: 'qa' };
  const configured = llm ? llm.routes[job] : undefined;
  if (configured) {
    if (isKnownModel(configured.model)) return { route: configured, source: 'config' };
    return { route: { model: spec.model }, source: 'default', invalid: configured.model };
  }
  return { route: { model: spec.model }, source: 'default' };
}

function modelChain(job, routedModel) {
  const spec = LLM_JOBS[job];
  const chain = [];
  for (const m of [routedModel, spec.model, ...spec.fallbacks]) {
    if (!chain.includes(m)) chain.push(m);
  }
  return chain;
}

// ── Request body / reply ───────────────────────────────────────────────

/** Key order matches the pre-client call sites (model, max_tokens, system, messages). */
function buildRequestBody(model, req, effort = 'high') {
  const profile = MODEL_PROFILES[model];
  if (!profile) throw new Error(`No model profile for ${model}`);
  const body = { model, max_tokens: Math.ceil(req.maxTokens * profile.tokenScale) };
  if (req.system !== undefined) body.system = req.system;
  body.messages = [{ role: 'user', content: req.content }];
  return Object.assign(body, profile.extraBody(effort));
}

function parseReply(data) {
  const d = data && typeof data === 'object' ? data : {};
  const blocks = Array.isArray(d.content) ? d.content : [];
  let raw = '';
  for (const b of blocks) {
    if (b && typeof b === 'object' && b.type === 'text' && typeof b.text === 'string')
      raw += b.text;
  }
  const stopReason = typeof d.stop_reason === 'string' ? d.stop_reason : null;
  let refusalCategory = null;
  if (stopReason === 'refusal') {
    const details = d.stop_details && typeof d.stop_details === 'object' ? d.stop_details : null;
    refusalCategory = details && typeof details.category === 'string' ? details.category : null;
  }
  const u = d.usage && typeof d.usage === 'object' ? d.usage : null;
  const usage = u
    ? { inputTokens: Number(u.input_tokens) || 0, outputTokens: Number(u.output_tokens) || 0 }
    : null;
  return { raw, stopReason, refusalCategory, usage };
}

/** Mirror of _shared/anthropic.ts META_REPLY_RE (parity-tested): a reply that talks TO the user instead of doing
 *  the job ("I can't write this one as specified…"), which on a text-out job would ship as the Flux prompt. */
const META_REPLY_RE =
  /^\s*["'“]?(?:I can(?:'|’)?t|I cannot|I won(?:'|’)?t|I'm not (?:able|going)|I’m not (?:able|going)|I am not able|I(?:'|’)?m unable|I am unable|I(?:'|’)?ll (?:have to )?pass|I(?:'|’)?d rather not|I(?:'|’)?m going to pass|I don(?:'|’)?t (?:think I can|feel comfortable)|Unfortunately|Sorry|I apologi[sz]e|Could you clarify|Before I write)\b/i;
const isMetaReply = (text) => META_REPLY_RE.test(text);

// ── Errors ─────────────────────────────────────────────────────────────

class LlmError extends Error {
  constructor(kind, message, status = null, category = null) {
    super(message);
    this.name = 'LlmError';
    this.kind = kind;
    this.status = status;
    this.category = category;
    /** Set on the error callClaude throws: every model's failure, in chain order. */
    this.failures = [];
  }
}

// ── The call ───────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/** Equal jitter, as _shared/jitter.ts: [ms/2, ms]; 0 stays 0. */
function jitter(ms) {
  if (ms <= 0) return 0;
  return Math.round(ms / 2 + Math.random() * (ms / 2));
}

async function callOneModel(model, effort, opts, key) {
  const body = JSON.stringify(buildRequestBody(model, opts, effort));
  const delays = opts.retryDelaysMs || [];
  const minChars = opts.minChars === undefined ? 1 : opts.minChars;
  let lastErr = '';
  for (let attempt = 0; attempt <= delays.length; attempt++) {
    let res;
    const controller = opts.timeoutMs ? new AbortController() : null;
    const timer = controller ? setTimeout(() => controller.abort(), opts.timeoutMs) : null;
    try {
      res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': key,
          'anthropic-version': '2023-06-01',
        },
        body,
        ...(controller ? { signal: controller.signal } : {}),
      });
    } catch (e) {
      if (timer) clearTimeout(timer);
      const aborted = e && e.name === 'AbortError';
      if (!aborted && opts.retryNetworkErrors && attempt < delays.length) {
        await sleep(jitter(delays[attempt]));
        continue;
      }
      throw new LlmError(aborted ? 'timeout' : 'network', `${model} ${e.message}`);
    }
    if (res.ok) {
      let data;
      try {
        data = await res.json();
      } finally {
        if (timer) clearTimeout(timer);
      }
      const reply = parseReply(data);
      if (reply.stopReason === 'refusal') {
        throw new LlmError(
          'refusal',
          `${model} refused (${reply.refusalCategory || 'unknown'})`,
          null,
          reply.refusalCategory
        );
      }
      const text = reply.raw.trim();
      if (text.length === 0) throw new LlmError('empty', `${model} response empty`);
      if (text.length < minChars) throw new LlmError('short', `${model} response too short`);
      if (LLM_JOBS[opts.job].textOut === true && isMetaReply(text)) {
        throw new LlmError(
          'refusal',
          `${model} wrote a message instead of the output`,
          null,
          'text'
        );
      }
      return {
        text,
        raw: reply.raw,
        stopReason: reply.stopReason,
        retries: attempt,
        usage: reply.usage,
      };
    }
    if (timer) clearTimeout(timer);
    lastErr = `${res.status}: ${(await res.text()).slice(0, 200)}`;
    if (!RETRYABLE_STATUSES.has(res.status))
      throw new LlmError('http', `${model} ${lastErr}`, res.status);
    if (attempt < delays.length) {
      console.warn(
        `  ⏳ ${model} ${res.status} retry ${attempt + 1}/${delays.length} in ${delays[attempt] / 1000}s`
      );
      await sleep(jitter(delays[attempt]));
    }
  }
  throw new LlmError(
    'http',
    `${model} exhausted retries — ${lastErr}`,
    Number(lastErr.split(':')[0]) || null
  );
}

/**
 * One Anthropic call for a job.
 * opts: { job, content, system?, maxTokens, llm?, key?, retryDelaysMs?, retryNetworkErrors?, minChars?, timeoutMs? }
 * Returns { text, raw, model, stopReason, retries, fellBackFrom, usage }. Throws LlmError (with .failures) only
 * when every model in the chain failed.
 */
async function callClaude(opts) {
  const llm = opts.llm || null;
  const stamp = (s) => {
    if (llm) llm.stamp(s);
  };
  const key = opts.key !== undefined ? opts.key : process.env.ANTHROPIC_API_KEY;
  if (!key) throw new LlmError('no_key', 'ANTHROPIC_API_KEY missing');
  if (!isLlmJob(opts.job)) throw new Error(`Unknown LLM job: ${opts.job}`);

  const spec = LLM_JOBS[opts.job];
  const resolved = resolveRoute(opts.job, llm);
  if (resolved.invalid) stamp(`llm_config_invalid:${opts.job}:${resolved.invalid.slice(0, 40)}`);
  const chain = modelChain(opts.job, resolved.route.model);

  const failures = [];
  for (let i = 0; i < chain.length; i++) {
    const model = chain[i];
    const effort =
      model === resolved.route.model
        ? resolved.route.effort || spec.effort || 'high'
        : spec.effort || 'high';
    try {
      const r = await callOneModel(model, effort, opts, key);
      stamp(`llm:${opts.job}:${model}`);
      if (r.stopReason === 'max_tokens') stamp(`llm_truncated:${opts.job}:${model}`);
      if (i > 0) stamp(`llm_fallback:${opts.job}:${chain[0]}→${model}:${failures[0].kind}`);
      return { ...r, model, fellBackFrom: i > 0 ? chain[0] : null };
    } catch (e) {
      const err = e instanceof LlmError ? e : new LlmError('network', `${model} ${e.message}`);
      if (err.kind === 'refusal')
        stamp(`llm_refusal:${opts.job}:${model}:${err.category || 'unknown'}`);
      failures.push({ model, kind: err.kind, message: err.message });
      if (i < chain.length - 1) {
        console.warn(`  ⚠️ ${opts.job}: ${err.message} → falling back to ${chain[i + 1]}`);
      }
    }
  }
  const lastF = failures[failures.length - 1];
  const out = new LlmError(
    lastF ? lastF.kind : 'network',
    lastF ? lastF.message : 'no model answered'
  );
  out.failures = failures;
  stamp(`llm_failed:${opts.job}:${out.kind}`);
  throw out;
}

module.exports = {
  RETRY_DELAYS_MS,
  RETRYABLE_STATUSES,
  MODEL_PROFILES,
  LLM_JOBS,
  EMPTY_LLM_ROUTING,
  isKnownModel,
  isLlmJob,
  parseRouteString,
  parseLlmRoutes,
  parseLlmOverride,
  fetchLlmRouting,
  llmOverrideFromArgs,
  offlineModel,
  offlineBody,
  createLlmContext,
  resolveRoute,
  modelChain,
  buildRequestBody,
  parseReply,
  isMetaReply,
  LlmError,
  callClaude,
};
