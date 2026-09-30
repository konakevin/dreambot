/**
 * anthropic.ts — the ONE Anthropic Messages client for Edge (LLM_MIGRATION.md; Sonnet 4.6 → 5.5 plan, step 0).
 *
 * Callers name a JOB, never a model. A job's model comes from, highest first:
 *   1. the request's QA override (Create `qa_llm_model`, nightly `force_llm_model`; "model" or "model@effort"),
 *      for the jobs whose default is Sonnet 4.6 (Haiku jobs keep Haiku, so a parity render moves one variable),
 *   2. engine_config.llm_preview_models, for an account in llm_preview_user_ids,
 *   3. engine_config.llm_models[job],
 *   4. the job's code default in LLM_JOBS (the model that call used before this file existed).
 * So moving a job is a config row and rolling it back is deleting the key: no deploy, live within the 60 s
 * engine_config cache.
 *
 * MODEL PROFILES own the request body. Sonnet 4.6 and Haiku send exactly the body every call site sent before
 * (locked by __tests__/lib/anthropicClient.test.ts). Sonnet 5.5 differs in three ways, each of which breaks a
 * plain model-id swap:
 *   - it THINKS by default when no `thinking` field is sent, and thinking blocks come before the text and count
 *     against max_tokens. `thinking: {type: 'between_tools'}` keeps upfront thinking off (we send no tools, so
 *     the reply is text only);
 *   - `output_config.effort` is set per job (default high);
 *   - its tokenizer counts the same text more: ~1.35x on our brief INPUT (2342 vs 1738 tokens) and 1.44-1.62x
 *     (median 1.54) on the comma-heavy prompts it WRITES (LLM_5_5_TUNING.md 3.2), so max_tokens (an output budget) scales
 *     by the profile's tokenScale or every word budget quietly shrinks.
 * Sonnet 5 (one job, the cast race read) shares 5.5's tokenizer (tokenScale 1.6) but rejects `between_tools`, so
 * its profile sends `thinking: {type: 'disabled'}`: no hidden thinking can eat a 30-token reply.
 * No profile ever sends an assistant prefill or temperature / top_p / top_k: 5.5 rejects each, and 4.6 already
 * rejects the prefill (essenceCards.ts wrote no card from 2026-05-11 because of it).
 *
 * REPLIES are read by joining every `text` block, never content[0]. A refusal, an empty reply, or a reply under the
 * call's minChars fails that model, and the chain moves on: the routed model → the job's default → the job's
 * fallbacks (brief jobs keep today's Haiku safety net). The call throws only when the whole chain fails.
 *
 * STAMPS go to LlmContext.stamp (→ ai_generation_log.fallback_reasons), each once per request:
 *   llm:<job>:<model>                          who answered
 *   llm_fallback:<job>:<from>→<to>:<kind>      a model failed and a later one answered
 *   llm_refusal:<job>:<model>:<category>       a refusal (5.5 can decline benign work as general_harms)
 *   llm_truncated:<job>:<model>                stop_reason max_tokens (the caller still gets the text)
 *   llm_failed:<job>:<kind>                    the whole chain failed
 *   llm_config_invalid:<job>:<value>           a configured model with no profile here (ignored)
 *
 * The context is passed as a parameter, never held in module state: one isolate serves concurrent requests.
 */

import { SONNET, SONNET_5_5, SONNET_5, HAIKU } from './models.ts';
import { jitter } from './jitter.ts';

// ── Retry ladder (shared with the vision path) ─────────────────────────

export const RETRY_DELAYS_MS: readonly number[] = [1000, 3000, 10000, 30000];
export const RETRYABLE_STATUSES = new Set([429, 500, 502, 503, 504, 529]);

// ── Models ─────────────────────────────────────────────────────────────

export type LlmEffort = 'low' | 'medium' | 'high';
const EFFORTS: readonly LlmEffort[] = ['low', 'medium', 'high'];

interface ModelProfile {
  /** Multiplier on the caller's max_tokens, for a tokenizer that counts the same text as more tokens. */
  tokenScale: number;
  /** Request-body fields this model needs beyond model / max_tokens / system / messages. */
  extraBody: (effort: LlmEffort) => Record<string, unknown>;
}

export const MODEL_PROFILES: Readonly<Record<string, ModelProfile>> = {
  [SONNET]: { tokenScale: 1, extraBody: () => ({}) },
  [HAIKU]: { tokenScale: 1, extraBody: () => ({}) },
  [SONNET_5_5]: {
    tokenScale: 1.6,
    extraBody: (effort) => ({
      thinking: { type: 'between_tools' },
      output_config: { effort },
    }),
  },
  // Sonnet 5: 5.5's tokenizer (count_tokens 5039 vs 4.6's 3752 on the same text); rejects between_tools.
  [SONNET_5]: { tokenScale: 1.6, extraBody: () => ({ thinking: { type: 'disabled' } }) },
};

export function isKnownModel(model: string): boolean {
  return Object.prototype.hasOwnProperty.call(MODEL_PROFILES, model);
}

// ── Jobs ───────────────────────────────────────────────────────────────

interface JobSpec {
  /** The model this call used before the client existed. */
  model: string;
  /** Tried in order after the routed model and the default. */
  fallbacks: readonly string[];
  /** Default 5.5 effort for this job. */
  effort?: LlmEffort;
  /** The reply IS the output (a Flux prompt, an action beat): a message to the user in its place fails the model. */
  textOut?: boolean;
}

const BRIEF: JobSpec = { model: SONNET, fallbacks: [HAIKU] };
const TEXT_OUT: JobSpec = { model: SONNET, fallbacks: [HAIKU], textOut: true };
const SONNET_ONLY: JobSpec = { model: SONNET, fallbacks: [] };
const HAIKU_ONLY: JobSpec = { model: HAIKU, fallbacks: [] };

/** Every Edge Anthropic call, by job. Haiku jobs are listed so every call is named and stamped; none moves. */
export const LLM_JOBS = {
  // Sonnet writers (callSonnet): fall back to Haiku, as before.
  create_brief: TEXT_OUT, // generate-dream: description / new-scene / dual / solo / text prompts
  create_slots: BRIEF, // characterSlotPrompt on Create
  nightly_brief: TEXT_OUT, // nightly-dreams brief
  nightly_slots: BRIEF, // characterSlotPrompt on nightly (and first dream)
  outfit_reader: BRIEF, // outfitSpec: what the user asked each person to wear
  scene_split: BRIEF, // promptSceneSplit: SETTING / ACTION
  location_beat: TEXT_OUT, // locationActionBeat: Option B action at the exact place
  restyle_brief: TEXT_OUT, // restyle-photo
  // Sonnet readers and judges: no fallback (each fails safe on its own).
  essence_card: SONNET_ONLY, // essenceCards: a location card on first encounter
  quality_gate: SONNET_ONLY, // qualityGate: BROKEN / PROFILE
  scene_people: SONNET_ONLY, // qualityGate: people in a must-be-empty fallback scene
  cast_describe: SONNET_ONLY, // describe-photo: a cast member's description
  cast_ethnicity: SONNET_ONLY, // describe-photo
  cast_hair: SONNET_ONLY, // describe-photo
  // Haiku.
  pet_describe: HAIKU_ONLY, // describe-photo, pets
  photo_describe: HAIKU_ONLY, // uploaded-photo dreams + restyle: describe the photo
  photo_classify: HAIKU_ONLY, // classify-photo
  probe_genders: HAIKU_ONLY, // classifyDualGenders
  probe_wardrobe: HAIKU_ONLY, // classifyWardrobeSides
  style_distill: HAIKU_ONLY, // styleDistiller (DLT fingerprint)
  style_extract: HAIKU_ONLY, // extract-style (no request context: code default only)
  inbox_title: HAIKU_ONLY, // queue worker's nightly inbox title (no request context: code default only)
  prompt_enhance: HAIKU_ONLY, // generate-dream enhanceViaHaiku
} as const satisfies Record<string, JobSpec>;

export type LlmJob = keyof typeof LLM_JOBS;

export function isLlmJob(v: string): v is LlmJob {
  return Object.prototype.hasOwnProperty.call(LLM_JOBS, v);
}

// ── Routing config ─────────────────────────────────────────────────────

export interface LlmRoute {
  model: string;
  effort?: LlmEffort;
}

/** engine_config's LLM routing, parsed (engineConfig.ts). */
export interface LlmRoutingConfig {
  /** engine_config.llm_models: job → route. */
  models: Readonly<Record<string, LlmRoute>>;
  /** engine_config.llm_preview_user_ids: accounts that get previewModels on top of models. */
  previewUserIds: readonly string[];
  /** engine_config.llm_preview_models. */
  previewModels: Readonly<Record<string, LlmRoute>>;
}

export const EMPTY_LLM_ROUTING: LlmRoutingConfig = {
  models: {},
  previewUserIds: [],
  previewModels: {},
};

/** "model" or "model@effort" → a route. Unknown effort words are dropped, the model is kept (validated later). */
export function parseRouteString(raw: string): LlmRoute | null {
  const s = raw.trim();
  if (!s) return null;
  const at = s.lastIndexOf('@');
  if (at <= 0) return { model: s };
  const model = s.slice(0, at).trim();
  const effort = s.slice(at + 1).trim() as LlmEffort;
  if (!model) return null;
  return EFFORTS.includes(effort) ? { model, effort } : { model };
}

function parseRoute(v: unknown): LlmRoute | null {
  if (typeof v === 'string') return parseRouteString(v);
  if (v && typeof v === 'object' && !Array.isArray(v)) {
    const o = v as Record<string, unknown>;
    if (typeof o.model !== 'string' || !o.model.trim()) return null;
    const effort = typeof o.effort === 'string' ? (o.effort as LlmEffort) : undefined;
    return effort && EFFORTS.includes(effort)
      ? { model: o.model.trim(), effort }
      : { model: o.model.trim() };
  }
  return null;
}

/** A jsonb job map: {"create_brief": "claude-sonnet-5-5@medium"} or {"create_brief": {"model": …, "effort": …}}.
 *  Keys that are not jobs are dropped here; model ids are checked at call time so a typo is stamped, not hidden. */
export function parseLlmRoutes(raw: unknown): Record<string, LlmRoute> {
  const out: Record<string, LlmRoute> = {};
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return out;
  for (const [job, v] of Object.entries(raw as Record<string, unknown>)) {
    if (!isLlmJob(job)) continue;
    const route = parseRoute(v);
    if (route) out[job] = route;
  }
  return out;
}

/** A QA override value. Only a model with a profile here counts; anything else is ignored (null). */
export function parseLlmOverride(raw: unknown): LlmRoute | null {
  if (typeof raw !== 'string') return null;
  const route = parseRouteString(raw);
  return route && isKnownModel(route.model) ? route : null;
}

// ── Request context ────────────────────────────────────────────────────

export type LlmSurface = 'create' | 'nightly' | 'restyle' | 'cast' | 'other';

// ── Prompt overlays (LLM_5_5_TUNING_PLAN.md) ───────────────────────────
// Model-specific tuning text, as DATA (table llm_prompt_overlays, mig 577). An overlay changes the prompt for ONE
// job on ONE model, so tuning 5.5 can never change what 4.6 is sent. Applied inside callClaude, per model in the chain
// (a fallback to 4.6 gets 4.6's own text). active = every request for that job + model; inactive = QA only, picked per
// request (Create qa_llm_overlays, nightly force_llm_overlays), so a tuning round needs no deploy.

export interface LlmOverlay {
  key: string;
  job: string;
  model: string;
  mode: 'append' | 'prepend' | 'replace';
  /** replace: the exact text the body replaces (first occurrence). */
  find: string | null;
  body: string;
  active: boolean;
}

export function parseLlmOverlays(raw: unknown): LlmOverlay[] {
  if (!Array.isArray(raw)) return [];
  const out: LlmOverlay[] = [];
  for (const r of raw) {
    if (!r || typeof r !== 'object') continue;
    const o = r as Record<string, unknown>;
    const mode = o.mode === 'prepend' || o.mode === 'replace' ? o.mode : 'append';
    if (typeof o.key !== 'string' || typeof o.job !== 'string' || typeof o.model !== 'string')
      continue;
    if (typeof o.body !== 'string') continue;
    const find = typeof o.find === 'string' && o.find.length > 0 ? o.find : null;
    if (mode === 'replace' && !find) continue;
    out.push({
      key: o.key,
      job: o.job,
      model: o.model,
      mode,
      find,
      body: o.body,
      active: o.active === true,
    });
  }
  return out.sort((a, b) => a.key.localeCompare(b.key));
}

/** A QA overlay list: "a,b" or ["a", "b"]. */
export function parseOverlayKeys(raw: unknown): string[] {
  const list = Array.isArray(raw) ? raw : typeof raw === 'string' ? raw.split(',') : [];
  return list
    .filter((x): x is string => typeof x === 'string')
    .map((x) => x.trim())
    .filter(Boolean);
}

/** The overlays for (job, model) applied to one text, in key order. */
export function applyOverlays(
  text: string,
  job: string,
  model: string,
  overlays: readonly LlmOverlay[]
): { text: string; applied: string[]; missed: string[] } {
  let out = text;
  const applied: string[] = [];
  const missed: string[] = [];
  for (const o of overlays) {
    if (o.job !== job || o.model !== model) continue;
    if (o.mode === 'append') out = `${out}\n\n${o.body}`;
    else if (o.mode === 'prepend') out = `${o.body}\n\n${out}`;
    else if (o.find && out.includes(o.find)) out = out.replace(o.find, o.body);
    else {
      missed.push(o.key);
      continue;
    }
    applied.push(o.key);
  }
  return { text: out, applied, missed };
}

export interface LlmContext {
  /** Which surface this request renders: shared modules pick their job by it (slots on Create vs nightly). */
  readonly surface: LlmSurface;
  /** The overlays in force for this request: active ones + the QA-picked keys. */
  readonly overlays: readonly LlmOverlay[];
  /** job → route for THIS request (config, with the preview map merged in for a preview account). */
  readonly routes: Readonly<Record<string, LlmRoute>>;
  /** QA override: every Sonnet-default job in this request runs on it (Haiku jobs keep Haiku). */
  readonly override: LlmRoute | null;
  /** Deduplicated: each stamp string is recorded once per request. */
  readonly stamp: (s: string) => void;
}

export function createLlmContext(opts: {
  surface: LlmSurface;
  routing?: LlmRoutingConfig | null;
  userId?: string | null;
  /** Raw QA value from the request body. */
  override?: unknown;
  stamp?: (s: string) => void;
  /** Every overlay row (fetchLlmOverlays), and the QA-picked keys (raw request value). */
  overlays?: readonly LlmOverlay[] | null;
  overlayKeys?: unknown;
}): LlmContext {
  const routing = opts.routing ?? EMPTY_LLM_ROUTING;
  const preview = !!opts.userId && routing.previewUserIds.includes(opts.userId);
  const routes = preview ? { ...routing.models, ...routing.previewModels } : { ...routing.models };
  const override = parseLlmOverride(opts.override);
  const seen = new Set<string>();
  const sink = opts.stamp;
  const stamp = (s: string) => {
    if (seen.has(s)) return;
    seen.add(s);
    if (sink) sink(s);
  };
  if (override)
    stamp(`qa:llm_model:${override.model}${override.effort ? '@' + override.effort : ''}`);
  else if (opts.override !== undefined && opts.override !== null && opts.override !== '') {
    stamp(`qa:llm_model_ignored:${String(opts.override).slice(0, 40)}`);
  }
  if (preview && Object.keys(routing.previewModels).length > 0) stamp('llm_preview');
  const allOverlays = opts.overlays ?? [];
  const keys = parseOverlayKeys(opts.overlayKeys);
  for (const k of keys) {
    stamp(
      allOverlays.some((o) => o.key === k) ? `qa:llm_overlay:${k}` : `qa:llm_overlay_unknown:${k}`
    );
  }
  const overlays = allOverlays.filter((o) => o.active || keys.includes(o.key));
  return { surface: opts.surface, overlays, routes, override, stamp };
}

/** The slot pipeline's job on this surface. */
export function slotsJob(llm: LlmContext | null | undefined): LlmJob {
  return llm && llm.surface === 'create' ? 'create_slots' : 'nightly_slots';
}

// ── Resolution ─────────────────────────────────────────────────────────

export interface ResolvedRoute {
  route: LlmRoute;
  source: 'qa' | 'config' | 'default';
  /** A configured model id with no profile here: ignored, the default ran. */
  invalid?: string;
}

export function resolveRoute(job: LlmJob, llm?: LlmContext | null): ResolvedRoute {
  const spec: JobSpec = LLM_JOBS[job];
  // The QA override swaps the SONNET jobs only (the migration's scope). A Haiku job (the swap probes, the style
  // distiller) keeps its model, so a parity render changes one variable. Config can still move any job.
  if (llm && llm.override && spec.model === SONNET) return { route: llm.override, source: 'qa' };
  const configured = llm ? llm.routes[job] : undefined;
  if (configured) {
    if (isKnownModel(configured.model)) return { route: configured, source: 'config' };
    return { route: { model: spec.model }, source: 'default', invalid: configured.model };
  }
  return { route: { model: spec.model }, source: 'default' };
}

/** routed model → the job's default (the known-good baseline) → the job's fallbacks, deduplicated. */
export function modelChain(job: LlmJob, routedModel: string): string[] {
  const spec: JobSpec = LLM_JOBS[job];
  const chain: string[] = [];
  for (const m of [routedModel, spec.model, ...spec.fallbacks]) {
    if (!chain.includes(m)) chain.push(m);
  }
  return chain;
}

// ── Request body ───────────────────────────────────────────────────────

export type LlmContentBlock =
  | { type: 'text'; text: string }
  | {
      type: 'image';
      source: { type: 'url'; url: string } | { type: 'base64'; media_type: string; data: string };
    };

export interface LlmRequest {
  content: string | LlmContentBlock[];
  system?: string;
  maxTokens: number;
}

/** The exact JSON body for one model. Key order matches the pre-client call sites (model, max_tokens, system,
 *  messages), so a 4.6 / Haiku body serializes byte-for-byte as it did. */
export function buildRequestBody(
  model: string,
  req: LlmRequest,
  effort: LlmEffort = 'high'
): Record<string, unknown> {
  const profile = MODEL_PROFILES[model];
  if (!profile) throw new Error(`No model profile for ${model}`);
  const body: Record<string, unknown> = {
    model,
    max_tokens: Math.ceil(req.maxTokens * profile.tokenScale),
  };
  if (req.system !== undefined) body.system = req.system;
  body.messages = [{ role: 'user', content: req.content }];
  return Object.assign(body, profile.extraBody(effort));
}

// ── Reply ──────────────────────────────────────────────────────────────

export interface ParsedReply {
  /** Every text block joined, untrimmed. */
  raw: string;
  stopReason: string | null;
  /** Set on a refusal when the API names the category; null otherwise. */
  refusalCategory: string | null;
  usage: { inputTokens: number; outputTokens: number } | null;
}

export function parseReply(data: unknown): ParsedReply {
  const d = data && typeof data === 'object' ? (data as Record<string, unknown>) : {};
  const blocks = Array.isArray(d.content) ? (d.content as unknown[]) : [];
  let raw = '';
  for (const b of blocks) {
    if (b && typeof b === 'object') {
      const blk = b as Record<string, unknown>;
      if (blk.type === 'text' && typeof blk.text === 'string') raw += blk.text;
    }
  }
  const stopReason = typeof d.stop_reason === 'string' ? d.stop_reason : null;
  let refusalCategory: string | null = null;
  if (stopReason === 'refusal') {
    const details =
      d.stop_details && typeof d.stop_details === 'object'
        ? (d.stop_details as Record<string, unknown>)
        : null;
    refusalCategory = details && typeof details.category === 'string' ? details.category : null;
  }
  const u = d.usage && typeof d.usage === 'object' ? (d.usage as Record<string, unknown>) : null;
  const usage = u
    ? { inputTokens: Number(u.input_tokens) || 0, outputTokens: Number(u.output_tokens) || 0 }
    : null;
  return { raw, stopReason, refusalCategory, usage };
}

/**
 * A reply that talks TO the user instead of doing the job. Sonnet 5.5 does this when a brief contradicts itself
 * ("I can't write this one as specified… the two requests conflict", the LLM parity bench, 2026-09-29), and on a
 * text-out job that sentence would ship to the image model as the prompt. Prompts and beats never open like this.
 */
export const META_REPLY_RE =
  /^\s*["'“]?(?:I can(?:'|’)?t|I cannot|I won(?:'|’)?t|I'm not (?:able|going)|I’m not (?:able|going)|I am not able|I(?:'|’)?m unable|I am unable|I(?:'|’)?ll (?:have to )?pass|I(?:'|’)?d rather not|I(?:'|’)?m going to pass|I don(?:'|’)?t (?:think I can|feel comfortable)|Unfortunately|Sorry|I apologi[sz]e|Could you clarify|Before I write)\b/i;

export function isMetaReply(text: string): boolean {
  return META_REPLY_RE.test(text);
}

// ── Errors ─────────────────────────────────────────────────────────────

export type LlmErrorKind =
  | 'no_key'
  | 'http'
  | 'network'
  | 'timeout'
  | 'refusal'
  | 'empty'
  | 'short';

export class LlmError extends Error {
  readonly kind: LlmErrorKind;
  readonly status: number | null;
  readonly category: string | null;
  constructor(
    kind: LlmErrorKind,
    message: string,
    status: number | null = null,
    category: string | null = null
  ) {
    super(message);
    this.name = 'LlmError';
    this.kind = kind;
    this.status = status;
    this.category = category;
  }
}

// ── The call ───────────────────────────────────────────────────────────

export interface LlmCallOptions extends LlmRequest {
  job: LlmJob;
  llm?: LlmContext | null;
  /** Defaults to the ANTHROPIC_API_KEY secret. */
  key?: string;
  /** Backoff before each retry of a 429/5xx on the same model. Default: no retry. */
  retryDelaysMs?: readonly number[];
  /** Also retry a thrown fetch (network) on the ladder. Default false. */
  retryNetworkErrors?: boolean;
  /** A trimmed reply shorter than this fails the model. Default 1 (empty fails). */
  minChars?: number;
  /** Abort one request after this long (a timeout is not retried). */
  timeoutMs?: number;
}

export interface LlmResult {
  /** Joined text, trimmed. */
  text: string;
  /** Joined text, untrimmed. */
  raw: string;
  /** The model that answered. */
  model: string;
  stopReason: string | null;
  /** Retries on the answering model (0 = first try). */
  retries: number;
  /** The routed model, when a later model in the chain answered instead; else null. */
  fellBackFrom: string | null;
  usage: ParsedReply['usage'];
}

function envKey(): string | undefined {
  // typeof guard: this module also loads under Node (jest), where there is no Deno.
  return typeof Deno !== 'undefined' ? Deno.env.get('ANTHROPIC_API_KEY') : undefined;
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function callOneModel(
  model: string,
  effort: LlmEffort,
  opts: LlmCallOptions,
  key: string
): Promise<Omit<LlmResult, 'model' | 'fellBackFrom'>> {
  const body = JSON.stringify(buildRequestBody(model, opts, effort));
  const delays = opts.retryDelaysMs ?? [];
  const minChars = opts.minChars ?? 1;
  let lastErr = '';
  for (let attempt = 0; attempt <= delays.length; attempt++) {
    let res: Response;
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
      const aborted = (e as Error).name === 'AbortError';
      if (!aborted && opts.retryNetworkErrors && attempt < delays.length) {
        console.warn(`[llm] ${opts.job} ${model} network error, retrying: ${(e as Error).message}`);
        await sleep(jitter(delays[attempt]));
        continue;
      }
      throw new LlmError(aborted ? 'timeout' : 'network', `${model} ${(e as Error).message}`);
    }
    if (res.ok) {
      let data: unknown;
      try {
        data = await res.json();
      } finally {
        if (timer) clearTimeout(timer);
      }
      const reply = parseReply(data);
      if (reply.stopReason === 'refusal') {
        throw new LlmError(
          'refusal',
          `${model} refused (${reply.refusalCategory ?? 'unknown'})`,
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
    if (!RETRYABLE_STATUSES.has(res.status)) {
      throw new LlmError('http', `${model} ${lastErr}`, res.status);
    }
    if (attempt < delays.length) {
      console.warn(
        `[llm] ${opts.job} ${model} ${res.status} on attempt ${attempt + 1}/${delays.length + 1}, retrying in ${
          delays[attempt] / 1000
        }s`
      );
      await sleep(jitter(delays[attempt]));
    }
  }
  throw new LlmError(
    'http',
    `${model} retries exhausted — ${lastErr}`,
    Number(lastErr.split(':')[0]) || null
  );
}

/** The request as THIS model is sent it: its overlays applied (a string content, or the last text block). */
function withOverlays(
  opts: LlmCallOptions,
  model: string,
  llm: LlmContext | null,
  stamp: (s: string) => void
): LlmCallOptions {
  if (!llm || llm.overlays.length === 0) return opts;
  const apply = (text: string) => {
    const r = applyOverlays(text, opts.job, model, llm.overlays);
    for (const k of r.applied) stamp(`llm_overlay:${opts.job}:${k}`);
    for (const k of r.missed) stamp(`llm_overlay_miss:${opts.job}:${k}`);
    return r.text;
  };
  if (typeof opts.content === 'string') return { ...opts, content: apply(opts.content) };
  const blocks = [...opts.content];
  for (let i = blocks.length - 1; i >= 0; i--) {
    const b = blocks[i];
    if (b.type === 'text') {
      blocks[i] = { type: 'text', text: apply(b.text) };
      break;
    }
  }
  return { ...opts, content: blocks };
}

/** One Anthropic call for a job. Throws LlmError only when every model in the chain failed. */
export async function callClaude(opts: LlmCallOptions): Promise<LlmResult> {
  const llm = opts.llm ?? null;
  const stamp = (s: string) => {
    if (llm) llm.stamp(s);
  };
  const key = opts.key ?? envKey();
  if (!key) throw new LlmError('no_key', 'No Anthropic API key');

  const spec: JobSpec = LLM_JOBS[opts.job];
  const resolved = resolveRoute(opts.job, llm);
  if (resolved.invalid) stamp(`llm_config_invalid:${opts.job}:${resolved.invalid.slice(0, 40)}`);
  const chain = modelChain(opts.job, resolved.route.model);

  let first: LlmError | null = null;
  let last: LlmError | null = null;
  for (let i = 0; i < chain.length; i++) {
    const model = chain[i];
    const effort =
      model === resolved.route.model
        ? (resolved.route.effort ?? spec.effort ?? 'high')
        : (spec.effort ?? 'high');
    try {
      const r = await callOneModel(model, effort, withOverlays(opts, model, llm, stamp), key);
      stamp(`llm:${opts.job}:${model}`);
      if (r.stopReason === 'max_tokens') stamp(`llm_truncated:${opts.job}:${model}`);
      if (i > 0 && first) stamp(`llm_fallback:${opts.job}:${chain[0]}→${model}:${first.kind}`);
      return { ...r, model, fellBackFrom: i > 0 ? chain[0] : null };
    } catch (e) {
      const err =
        e instanceof LlmError ? e : new LlmError('network', `${model} ${(e as Error).message}`);
      if (err.kind === 'refusal') {
        stamp(`llm_refusal:${opts.job}:${model}:${err.category ?? 'unknown'}`);
      }
      if (!first) first = err;
      last = err;
      if (i < chain.length - 1) {
        console.warn(`[llm] ${opts.job}: ${err.message} — falling back to ${chain[i + 1]}`);
      }
    }
  }
  const failure = last ?? new LlmError('network', `${opts.job}: no model answered`);
  stamp(`llm_failed:${opts.job}:${failure.kind}`);
  throw failure;
}
