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
  /** hash = no upload; the service returns sha256 + ahash + dims only (nightly dup-detect). */
  mode: 'final' | 'temp' | 'hash';
  objectKey?: string;
  variants?: { display?: boolean; thumbhash?: boolean; hashes?: boolean };
  traceId?: string;
  /** Bounded: the call is abandoned (and the caller falls back) after this. Default 25 s. */
  timeoutMs?: number;
}

export interface PersistViaFlyResult {
  /** null in hash mode. */
  url: string | null;
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

export async function persistViaFly(
  opts: PersistViaFlyOptions,
  fetchImpl: typeof fetch = fetch
): Promise<PersistViaFlyOutcome> {
  const flyUrl = env('IMAGE_OPS_FLY_URL');
  const flyToken = env('IMAGE_OPS_FLY_TOKEN');
  if (!flyUrl) return { ok: false, reason: 'disabled', stamp: 'image_ops:fallback:disabled' };
  if (!flyToken) return { ok: false, reason: 'no_token', stamp: 'image_ops:fallback:no_token' };

  const t0 = Date.now();
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
  try {
    const res = await fetchImpl(`${flyUrl.replace(/\/$/, '')}/persist`, {
      method: 'POST',
      signal: AbortSignal.timeout(timeoutMs ?? DEFAULT_TIMEOUT_MS),
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
      console.warn(`[imageOps] persist ${code} after ${ms}ms (trace ${opts.traceId ?? '-'})`);
      return { ok: false, reason: code, stamp: `image_ops:fallback:${code}` };
    }
    const result = (await res.json()) as PersistViaFlyResult;
    // A written object must come back as an https URL; a hash call must come back with a hash.
    const sane =
      opts.mode === 'hash'
        ? typeof result.ahash === 'string' && /^[0-9a-f]{16}$/.test(result.ahash)
        : typeof result.url === 'string' && /^https:\/\//.test(result.url);
    if (!result || !sane) {
      return { ok: false, reason: 'bad_response', stamp: 'image_ops:fallback:bad_response' };
    }
    return { ok: true, result, ms, stamp: `image_ops:fly:${ms}` };
  } catch (e) {
    const ms = Date.now() - t0;
    const reason = (e as Error).name === 'TimeoutError' ? 'timeout' : 'fetch_error';
    console.warn(`[imageOps] persist ${reason} after ${ms}ms: ${(e as Error).message}`);
    return { ok: false, reason, stamp: `image_ops:fallback:${reason}` };
  }
}
