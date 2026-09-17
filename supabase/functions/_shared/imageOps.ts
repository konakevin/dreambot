/**
 * imageOps.ts — the isolate's client for the Fly image-ops service (NO_PIXELS_IN_ISOLATE_PLAN.md).
 *
 * WHY. Every HTTP 546 on nightly-dreams is "CPU Time exceeded": the isolate decoding a render to RGBA in
 * WASM, re-encoding a display JPEG, hashing for dedup, and atob-looping provider base64 — inside a hard
 * 2 s CPU budget with no dial. This client hands all of that to a Fly machine by URL.
 *
 * CONTRACT. `persistViaFly()` NEVER throws and never blocks a render: any failure (no secret, timeout,
 * non-2xx, bad JSON) returns null with a `reason`, and the caller runs today's in-isolate path. The
 * caller stamps `image_ops:fly:<ms>` on success or `image_ops:fallback:<reason>` on fallback so the
 * rollout is measurable in ai_generation_log without touching the DB schema.
 *
 * ROLLOUT SWITCH. The secret IMAGE_OPS_FLY_URL. Unset → `persistViaFly` returns null immediately and
 * every function is on the old path with no deploy — the same switch DUAL_SWAP_FLY_URL already is.
 */

export interface PersistViaFlyOptions {
  sourceUrl?: string;
  sourceBase64?: string;
  mime?: string;
  userId: string;
  /** hash = no upload; the service returns sha256 + ahash + dims only (nightly dup-detect).
   *  perturb = the single-swap cache-bust copy of a cast photo under temp/ (faceSwap.ts). */
  mode: 'final' | 'temp' | 'hash' | 'perturb';
  objectKey?: string;
  variants?: { display?: boolean; thumbhash?: boolean; hashes?: boolean };
  traceId?: string;
  /** Bounded: the call is abandoned (and the caller falls back) after this. Default 25 s. */
  timeoutMs?: number;
}

export interface PersistViaFlyResult {
  /** null in hash mode. */
  url: string | null;
  /** Storage key of the written object (temp / perturb callers delete it after the swap). null in hash mode. */
  key: string | null;
  displayUrl: string | null;
  thumbhash: string | null;
  sha256: string | null;
  ahash: string | null;
  width: number | null;
  height: number | null;
  bytes: number;
  contentType: string;
  ms: { fetch: number; decode: number; encode: number; upload: number; total: number };
}

export type PersistViaFlyOutcome =
  | { ok: true; result: PersistViaFlyResult; ms: number; stamp: string }
  | { ok: false; reason: string; stamp: string };

const DEFAULT_TIMEOUT_MS = 25_000;

/** Secrets via Deno.env; the typeof guard keeps this module importable under jest (no Deno global). */
function env(name: string): string | undefined {
  return typeof Deno !== 'undefined' ? Deno.env.get(name) : undefined;
}

/** Is the service configured at all? Callers may skip work (e.g. not pre-fetching bytes) when it is. */
export function imageOpsEnabled(): boolean {
  return Boolean(env('IMAGE_OPS_FLY_URL'));
}

type FlyPost =
  | { ok: true; json: unknown; ms: number }
  | { ok: false; reason: string; stamp: string };

/** The one transport every image-ops call shares: bounded, Bearer-authed, and it never throws. */
async function postToFly(
  pathname: string,
  body: unknown,
  timeoutMs: number,
  traceId: string | undefined,
  fetchImpl: typeof fetch
): Promise<FlyPost> {
  const flyUrl = env('IMAGE_OPS_FLY_URL');
  const flyToken = env('IMAGE_OPS_FLY_TOKEN');
  if (!flyUrl) return { ok: false, reason: 'disabled', stamp: 'image_ops:fallback:disabled' };
  if (!flyToken) return { ok: false, reason: 'no_token', stamp: 'image_ops:fallback:no_token' };
  const t0 = Date.now();
  try {
    const res = await fetchImpl(`${flyUrl.replace(/\/$/, '')}${pathname}`, {
      method: 'POST',
      signal: AbortSignal.timeout(timeoutMs),
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${flyToken}` },
      body: JSON.stringify(body),
    });
    const ms = Date.now() - t0;
    if (!res.ok) {
      let code = `http_${res.status}`;
      try {
        const err = (await res.json()) as { code?: string };
        if (err && typeof err.code === 'string') code = `${code}:${err.code}`;
      } catch {
        /* body not JSON — keep the status */
      }
      console.warn(`[imageOps] ${pathname} ${code} after ${ms}ms (trace ${traceId ?? '-'})`);
      return { ok: false, reason: code, stamp: `image_ops:fallback:${code}` };
    }
    return { ok: true, json: await res.json(), ms };
  } catch (e) {
    const ms = Date.now() - t0;
    const reason = (e as Error).name === 'TimeoutError' ? 'timeout' : 'fetch_error';
    console.warn(`[imageOps] ${pathname} ${reason} after ${ms}ms: ${(e as Error).message}`);
    return { ok: false, reason, stamp: `image_ops:fallback:${reason}` };
  }
}

export async function persistViaFly(
  opts: PersistViaFlyOptions,
  fetchImpl: typeof fetch = fetch
): Promise<PersistViaFlyOutcome> {
  const { timeoutMs, ...body } = opts;
  // PHASE 3 (NO_PIXELS_IN_ISOLATE_PLAN.md): providers that return inline images (gemini / gpt-image / grok)
  // hand the isolate a `data:` URL. The service takes raw base64 for exactly this, so a data: source is
  // split here — header for the mime, payload as-is — and the isolate never runs an atob loop over it.
  // (Found on the first phase-2 Create job: a gemini-3 render, `sourceUrl must be https`, fell back.)
  if (typeof body.sourceUrl === 'string' && body.sourceUrl.startsWith('data:')) {
    const comma = body.sourceUrl.indexOf(',');
    const header = comma > 0 ? body.sourceUrl.slice(5, comma) : '';
    const mime = (header.match(/^image\/[a-z0-9.+-]+/i) || [undefined])[0];
    if (comma > 0 && /;base64$/i.test(header) && mime) {
      body.sourceBase64 = body.sourceUrl.slice(comma + 1);
      body.mime = mime;
      delete body.sourceUrl;
    } else {
      return { ok: false, reason: 'bad_data_url', stamp: 'image_ops:fallback:bad_data_url' };
    }
  }
  const post = await postToFly(
    '/persist',
    body,
    timeoutMs ?? DEFAULT_TIMEOUT_MS,
    opts.traceId,
    fetchImpl
  );
  if (!post.ok) return post;
  const result = post.json as PersistViaFlyResult;
  // A written object must come back as an https URL; a hash call must come back with a hash; a temp /
  // perturb object must come back with its key, or the caller could never delete it after the swap.
  const sane =
    result &&
    (opts.mode === 'hash'
      ? typeof result.ahash === 'string' && /^[0-9a-f]{16}$/.test(result.ahash)
      : typeof result.url === 'string' &&
        /^https:\/\//.test(result.url) &&
        (opts.mode === 'final' || (typeof result.key === 'string' && result.key.length > 0)));
  if (!sane) return { ok: false, reason: 'bad_response', stamp: 'image_ops:fallback:bad_response' };
  return { ok: true, result, ms: post.ms, stamp: `image_ops:fly:${post.ms}` };
}

// ── /composite — the holiday postcard overlay (phase 4b) ───────────────────────────────────────────

export interface CompositeViaFlyOptions {
  imageUrl: string;
  overlayUrl: string;
  /** The render's own Storage key — overwritten in place, so image_url stays valid. */
  objectKey: string;
  layout: { anchor: 'top' | 'bottom'; widthPct: number; marginPct: number; scrim: boolean };
  traceId?: string;
  timeoutMs?: number;
}

export interface CompositeViaFlyResult {
  key: string;
  placed: { x: number; y: number; width: number; height: number };
  width: number;
  height: number;
  ms: { fetch: number; decode: number; encode: number; upload: number; total: number };
}

export type CompositeViaFlyOutcome =
  | { ok: true; result: CompositeViaFlyResult; ms: number; stamp: string }
  | { ok: false; reason: string; stamp: string };

/** Same contract as persistViaFly: never throws; a failure is a stamp and the caller's own path. */
export async function compositeViaFly(
  opts: CompositeViaFlyOptions,
  fetchImpl: typeof fetch = fetch
): Promise<CompositeViaFlyOutcome> {
  const { timeoutMs, ...body } = opts;
  const post = await postToFly(
    '/composite',
    body,
    timeoutMs ?? DEFAULT_TIMEOUT_MS,
    opts.traceId,
    fetchImpl
  );
  if (!post.ok) return post;
  const result = post.json as CompositeViaFlyResult;
  const p = result && result.placed;
  const sane =
    result &&
    result.key === opts.objectKey &&
    p &&
    [p.x, p.y, p.width, p.height].every((n) => typeof n === 'number' && Number.isFinite(n));
  if (!sane) return { ok: false, reason: 'bad_response', stamp: 'image_ops:fallback:bad_response' };
  return { ok: true, result, ms: post.ms, stamp: `image_ops:fly:${post.ms}` };
}
