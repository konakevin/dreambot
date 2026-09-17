/**
 * Face swap — composites the source face onto the target image using
 * cdingram/face-swap (Replicate). Used by V4 (self-insert, photo
 * reimagine, DLT) and nightly (cast-bearing dreams).
 *
 * Single swap: faceSwap() — one face onto one image.
 * Dual swap: runs ONLY on the Fly `face-swap-dual` engine (services/face-swap-dual, face detection +
 *            identity + gender checks), routed by _shared/dualSwapDispatch.ts. The in-isolate 55/55
 *            crop-and-stitch engine that lived in this file was deleted 2026-09-17
 *            (NO_PIXELS_IN_ISOLATE_PLAN.md phase 5): no pixel work in the isolate.
 *
 * Both source and target are passed to Replicate as public URLs. Source
 * is perturbed (one bottom-right pixel randomized) and uploaded to a
 * temp storage path before each swap to defeat Replicate's input-hash
 * cache; the temp file is deleted in a finally block. Earlier versions
 * inlined the perturbed source as a base64 data URI but the ~5-7 MB
 * string per call pushed the function past Supabase's 150 MB ceiling
 * during dual swaps (two parallel calls = 10-14 MB of base64 alone).
 */

// deno-lint-ignore-file no-explicit-any
import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.100.0';
import { decodeImage, encodeJpeg } from './imageCodec.ts';
import { imageOpsEnabled, persistViaFly } from './imageOps.ts';

const DEFAULT_MAX_WAIT_MS = 90_000;
const POLL_INTERVAL_MS = 1000;

/**
 * Replicate's face-swap models need a PUBLIC HTTPS URL — they download the
 * target image from inside Replicate's infra. Our native OpenAI + Gemini
 * providers return base64-inline `data:image/...;base64,...` URLs from
 * `_shared/providers/{openai,gemini}.ts` (the API responses are b64), so a
 * data URL would be unreachable. This helper detects that, uploads the
 * decoded bytes to a temp Supabase Storage path, and returns the public
 * HTTPS URL the face-swap model can actually fetch.
 *
 * Returns `{ url, tempPath }` — `tempPath` is non-null only when a temp
 * upload happened, so callers can clean up in a finally block (or leave
 * it; it's ~1-2 MB and the temp/ prefix can be swept later).
 *
 * Wired 2026-05-30 to unblock face-swap on OpenAI/Gemini-rendered scenes;
 * the same path is also used by dispatchDualFaceSwap so we don't blow up
 * the cross-Edge-Function POST body by carrying ~6-8 MB of base64.
 */
export async function ensureHttpsImageUrl(
  url: string,
  supabase: SupabaseClient,
  userId: string,
  bucket = 'uploads'
): Promise<{ url: string; tempPath: string | null }> {
  if (typeof url !== 'string') throw new Error('ensureHttpsImageUrl: url is not a string');
  if (!url.startsWith('data:')) return { url, tempPath: null };

  // PHASE 3b (NO_PIXELS_IN_ISOLATE_PLAN.md): the base64 → bytes loop below is CPU the isolate does not
  // have to spare (a 2 s budget, shared with everything else in the render). The image-ops service takes
  // the data: URL, decodes it and writes the SAME swap-target key; the caller's cleanup is unchanged.
  // Fail-open: service off / error → the loop below, as before.
  if (bucket === 'uploads' && imageOpsEnabled()) {
    const r = await persistViaFly({ sourceUrl: url, userId, mode: 'temp', timeoutMs: 10_000 });
    if (r.ok && r.result.url && r.result.key) {
      console.log(`[ensureHttpsImageUrl] ${r.stamp}`);
      return { url: r.result.url, tempPath: r.result.key };
    }
    console.warn(
      `[ensureHttpsImageUrl] ${r.ok ? 'image_ops:fallback:bad_response' : r.stamp} — decoding in the isolate`
    );
  }

  // Parse: data:<mime>;base64,<payload>
  const comma = url.indexOf(',');
  if (comma < 0) throw new Error('ensureHttpsImageUrl: malformed data URL (no payload)');
  const header = url.slice(5, comma); // e.g. "image/png;base64"
  const mimeMatch = header.match(/^image\/(png|jpeg|jpg|webp)/i);
  if (!mimeMatch) throw new Error(`ensureHttpsImageUrl: unsupported mime in data URL: ${header}`);
  if (!/;base64$/i.test(header)) {
    throw new Error(`ensureHttpsImageUrl: only base64 data URLs supported, got: ${header}`);
  }
  const ext = mimeMatch[1].toLowerCase() === 'jpeg' ? 'jpg' : mimeMatch[1].toLowerCase();
  const contentType = `image/${ext === 'jpg' ? 'jpeg' : ext}`;

  // Decode b64 → Uint8Array via atob (ample for ~5MB images).
  const b64 = url.slice(comma + 1);
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);

  const tempPath = `${userId}/swap-target-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error: upErr } = await supabase.storage
    .from(bucket)
    .upload(tempPath, bytes, { contentType, upsert: false, cacheControl: '300' });
  if (upErr) throw new Error(`ensureHttpsImageUrl: temp upload failed: ${upErr.message}`);
  const { data: pub } = supabase.storage.from(bucket).getPublicUrl(tempPath);
  return { url: pub.publicUrl, tempPath };
}

// ── Model registry — primary + fallback chain ──────────────────────────
//
// All entries use the same underlying face-swap technology (InsightFace's
// inswapper) and produce visually-indistinguishable outputs in our 2026-04-30
// benchmark (scripts/benchmark-face-swap-models.js). They differ in:
//   - Replicate model warmth / availability (some go cold, some have outages)
//   - Latency
//   - Input parameter names
//   - Output shape
//
// We try them in order. Primary is cdingram (root-cause fix for yan-ops's
// "canned-output bug" — yan-ops intermittently ignores target_image and
// returns a hardcoded scene for certain face embeddings). The bug was
// originally fixed in commit 98f59e94 (2026-04-29) by switching primary
// to cdingram; later (7475e6a0) yan-ops was bumped back to primary as
// a warmth/cold-start optimization, defended only by the dup-detect block
// in nightly-dreams. generate-dream (paid Create) never got that defense,
// so users hit the canned-output bug on Create with no fallback. Reverted
// to cdingram-primary 2026-05-30 to make ALL paths safe by default; the
// occasional cold-start cost is acceptable vs. paid-feature duplicates.
//
// yan-ops kept in the fallback chain — it's still useful when cdingram
// itself is cold or rate-limited. pikachupichu25 is the third option.
//
// To swap primary: reorder the array. The first entry is always primary.

interface FaceSwapModel {
  name: string;
  /** Replicate model version hash. Always pin to a hash, never `:latest`. */
  version: string;
  /** Build the `input` object for Replicate's POST /predictions call. */
  buildInput: (sourceUrl: string, targetUrl: string) => Record<string, unknown>;
  /** Extract the swapped-image URL from a succeeded prediction's output. */
  parseOutput: (output: unknown) => string | null;
}

function parseUrlOrFirst(out: unknown): string | null {
  if (typeof out === 'string') return out || null;
  if (Array.isArray(out) && out.length > 0 && typeof out[0] === 'string') return out[0] || null;
  return null;
}

const FACE_SWAP_MODELS: FaceSwapModel[] = [
  {
    name: 'cdingram',
    version: 'd1d6ea8c8be89d664a07a457526f7128109dee7030fdac424788d762c71ed111',
    buildInput: (source, target) => ({ swap_image: source, input_image: target }),
    parseOutput: parseUrlOrFirst,
  },
  {
    name: 'yan-ops',
    version: 'd5900f9ebed33e7ae08a07f17e0d98b4ebc68ab9528a70462afc3899cfe23bab',
    buildInput: (source, target) => ({
      source_image: source,
      target_image: target,
      weight: 0.5,
      det_thresh: 0.1,
    }),
    // yan-ops returns { code, image, msg, status }. status=='failed' or
    // code==500 means the model rejected the input (e.g., "no face found").
    parseOutput: (out) => {
      if (out && typeof out === 'object') {
        const obj = out as Record<string, unknown>;
        if (obj.status === 'failed' || obj.code === 500) return null;
        if (typeof obj.image === 'string' && obj.image.length > 0) return obj.image;
      }
      return parseUrlOrFirst(out);
    },
  },
  {
    name: 'pikachupichu25',
    version: '94b109952d4dd3cb6e9947340a6a099cc9a4821af8807a879c1f7af92e2a3b00',
    buildInput: (source, target) => ({ swap_image: source, target_image: target }),
    parseOutput: parseUrlOrFirst,
  },
];

/**
 * The ordered list of model NAMES faceSwap() will attempt for the given opts.
 * Pure + exported for unit testing the model-selection logic without hitting
 * Replicate. `skipPrimary` drops whatever is currently primary (cdingram
 * since 2026-05-30) and runs only the fallback chain. The dup-detect retry
 * in nightly-dreams uses this to escape canned-output bugs at the cost of
 * potentially cold-starting the next model down.
 */
export function faceSwapAttemptOrder(skipPrimary = false): string[] {
  const names = FACE_SWAP_MODELS.map((m) => m.name);
  return skipPrimary ? names.slice(1) : names;
}

/**
 * Cache-bust the source image bytes by re-encoding the JPEG with a random
 * quality and perturbing one corner pixel by a random amount. The bytes
 * differ on every call, so Replicate's input-hash cache can't lock us
 * onto a stale prediction output (the duplicate-render bug we saw 2026-04-29).
 *
 * Uploads the perturbed JPEG to a temp storage path and returns its public
 * URL. Earlier versions returned a base64 data URI, which held ~5-7 MB of
 * string in heap per call; with two parallel calls during dual face swap
 * that pushed the function past Supabase's 150 MB memory ceiling.
 *
 * Caller is responsible for deleting `path` from storage after the swap
 * completes (faceSwapOnce does this in a finally block).
 */
async function perturbSourceImage(
  sourceImageUrl: string,
  supabase: SupabaseClient,
  userId: string
): Promise<{ url: string; path: string }> {
  // PHASE 4 (NO_PIXELS_IN_ISOLATE_PLAN.md): this decode + re-encode is the solo path's single biggest CPU
  // spend (forced-solo batch: 5 of 10 died with 546 while couples, which swap on Fly, died 0 of 10). The
  // image-ops service does the identical perturb and writes the identical temp/<user>/perturbed-… key,
  // so the caller's cleanup is unchanged. Fail-open: service off / error → the in-isolate code below.
  if (imageOpsEnabled()) {
    const r = await persistViaFly({
      sourceUrl: sourceImageUrl,
      userId,
      mode: 'perturb',
      timeoutMs: 10_000,
    });
    if (r.ok && r.result.url && r.result.key) {
      console.log(`[perturbSource] ${r.stamp}`);
      return { url: r.result.url, path: r.result.key };
    }
    console.warn(
      `[perturbSource] ${r.ok ? 'image_ops:fallback:bad_response' : r.stamp} — perturbing in the isolate`
    );
  }
  const resp = await fetch(sourceImageUrl);
  if (!resp.ok) throw new Error(`Source download failed: ${resp.status}`);
  const buf = new Uint8Array(await resp.arrayBuffer());
  // A large source (e.g. a full-res cast photo stored as the thumb_url) decodes
  // into a huge RGBA buffer that blows the 256MB Edge isolate → 546
  // WORKER_RESOURCE_LIMIT. The perturb is only an anti-hash-cache nicety, so for
  // oversized sources skip the in-process decode and pass the URL straight through
  // (Replicate fetches + handles it server-side). 1.2MB ≈ a comfortably big thumb.
  if (buf.length > 1_200_000) {
    console.warn(
      `[perturbSource] source ${buf.length}B exceeds in-isolate decode budget — skipping perturb, passing URL through`
    );
    return { url: sourceImageUrl, path: '' };
  }
  const decoded = await decodeImage(buf);
  const data = decoded.data;
  const w = decoded.width;
  const h = decoded.height;
  // Perturb a random pixel near the bottom-right corner — face is upper-half so unaffected
  const px = w - 1 - Math.floor(Math.random() * 4);
  const py = h - 1 - Math.floor(Math.random() * 4);
  const off = (py * w + px) * 4;
  data[off] = Math.floor(Math.random() * 256);
  data[off + 1] = Math.floor(Math.random() * 256);
  data[off + 2] = Math.floor(Math.random() * 256);
  const quality = 90 + Math.floor(Math.random() * 6); // 90-95, near-lossless JPEG
  const bytes = await encodeJpeg({ data, width: w, height: h }, quality);

  const path = `temp/${userId}/perturbed-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
  const { error } = await supabase.storage
    .from('uploads')
    .upload(path, bytes, { contentType: 'image/jpeg', upsert: true, cacheControl: '2592000' });
  if (error) throw new Error(`Perturbed source upload failed: ${error.message}`);
  return {
    url: supabase.storage.from('uploads').getPublicUrl(path).data.publicUrl,
    path,
  };
}

/**
 * HEAD-fetch the source URL to confirm it's reachable + an image before
 * burning a Replicate call. Catches the "deleted cast photo / orphan URL
 * in recipe → Replicate 404 → canned-output fallback" failure chain that
 * the 2026-05-31 audit surfaced. Cheap (~100-200ms) compared to a wasted
 * face-swap call (~5-15s) that returns a hardcoded scene.
 *
 * Throws with a precise reason — caller's outer catch refunds the
 * sparkle and surfaces to the user instead of silently returning a
 * canned image.
 */
async function validateSourceUrl(url: string, ctx: string): Promise<void> {
  if (!url || typeof url !== 'string' || !url.startsWith('http')) {
    throw new Error(`${ctx} invalid source URL: ${url || '(empty)'}`);
  }
  let res: Response;
  try {
    res = await fetch(url, { method: 'HEAD' });
  } catch (e) {
    throw new Error(
      `${ctx} source fetch failed: ${url.slice(-50)} (${(e as Error).message.slice(0, 60)})`
    );
  }
  if (!res.ok) {
    throw new Error(`${ctx} source unreachable: ${url.slice(-50)} (HTTP ${res.status})`);
  }
  const ct = (res.headers.get('content-type') || '').toLowerCase();
  // Be permissive on content-type — some Supabase Storage responses have a
  // generic application/octet-stream label even for valid images. Reject
  // only obvious non-image types (text/html = 404 page from CDN, application/json
  // = error response, etc).
  if (
    ct.startsWith('text/') ||
    ct.startsWith('application/json') ||
    ct.startsWith('application/xml')
  ) {
    throw new Error(`${ctx} source not an image: ${url.slice(-50)} (content-type: ${ct})`);
  }
}

async function faceSwapOnce(
  sourceImageUrl: string,
  targetImageUrl: string,
  replicateToken: string,
  supabase: SupabaseClient,
  userId: string,
  model: FaceSwapModel,
  maxWaitMs: number = DEFAULT_MAX_WAIT_MS
): Promise<string> {
  // Source is sent as-is. Cache-busting (when needed) is now done UPFRONT
  // in faceSwap() via perturbSourceImage — byte-level perturbation
  // genuinely defeats Replicate's content-hash cache, unlike the previous
  // URL query-string trick which Replicate ignores (it hashes downloaded
  // bytes, not the URL — that's why the 2026-05-31 canned-output bug
  // recurred even after the cdingram-primary swap). Gated to single-cast
  // only via the perturb option on faceSwap() to preserve the dual CPU
  // budget (2 parallel target-half decode/encodes already fill it).
  const sourceForReplicate = sourceImageUrl;
  const perturbedPath: string | null = null;

  try {
    const res = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${replicateToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: model.version,
        input: model.buildInput(sourceForReplicate, targetImageUrl),
      }),
    });

    if (!res.ok) throw new Error(`Face swap create failed: ${res.status} (${model.name})`);
    const data = await res.json();
    if (!data.id) throw new Error(`No prediction ID from face swap (${model.name})`);

    const maxPolls = Math.ceil(maxWaitMs / POLL_INTERVAL_MS);
    for (let i = 0; i < maxPolls; i++) {
      await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
      const pollRes = await fetch(`https://api.replicate.com/v1/predictions/${data.id}`, {
        headers: { Authorization: `Bearer ${replicateToken}` },
      });
      const pollData = await pollRes.json();
      if (pollData.status === 'succeeded') {
        const url = model.parseOutput(pollData.output);
        if (url) return url;
        // Succeeded with empty output — usually "no face found" in the target.
        // Throw so the caller can decide whether to fall back to another model.
        throw new Error(`Face swap empty output (${model.name}: no face found)`);
      }
      if (pollData.status === 'failed' || pollData.status === 'canceled') {
        throw new Error(
          `Face swap ${pollData.status} (${model.name}): ${pollData.error ?? 'unknown'}`
        );
      }
    }
    throw new Error(`Face swap timed out (${model.name})`);
  } finally {
    // Cleanup of perturbed source upload — no-op now that we use query-string
    // cache-bust. perturbedPath is null. Kept block for future toggle.
    if (perturbedPath) {
      supabase.storage
        .from('uploads')
        .remove([perturbedPath as string])
        .catch((e) => console.warn('[faceSwap] temp-storage cleanup failed:', e));
    }
  }
}

/**
 * Public face swap with retries on the primary model + fallback chain.
 *
 * Resilience strategy (in order):
 *   1. Try primary model (FACE_SWAP_MODELS[0] — cdingram since 2026-05-30;
 *      yan-ops was demoted for the canned-output bug). Retry up to
 *      MAX_PRIMARY_ATTEMPTS times with backoff on transient Replicate errors
 *      (5xx / 429 / timeout / "no face found" empty output).
 *   2. If primary still fails, try each fallback model in
 *      FACE_SWAP_MODELS[1..] (cdingram, pikachupichu25) single-shot, in order.
 *      Skip a fallback if remaining time budget is below MIN_FALLBACK_TIME_MS.
 *   3. If all models fail, throw the most-recent error.
 *
 * `opts.skipPrimary` skips step 1 entirely and runs only the fallback chain —
 * the dup-detect retry uses it to escape yan-ops's canned-output bug.
 *
 * Retry-on-transient signals:
 *   - 'timed out'    → cold-start prediction polled past maxWaitMs
 *   - 5xx            → Replicate platform error (boot queue overload)
 *   - 429            → rate limit
 *   - 'empty output' → model succeeded but found no face (try a different
 *                      face detector — different models handle stylized
 *                      targets differently)
 *
 * `retry: false` disables the primary retries (the Fly dual engine's copy of
 * this file uses it for its two parallel half-swaps); the fallback chain
 * still runs. The orchestrator's outer 3x retry loop wraps this whole
 * function.
 */
const TRANSIENT_REPLICATE_ERRORS = [
  'timed out',
  ' 500',
  ' 502',
  ' 503',
  ' 504',
  ' 429',
  'empty output',
  'no face found',
];
const MAX_PRIMARY_ATTEMPTS = 3;
const BACKOFF_MS = [2_000, 4_000]; // before primary attempt 2, attempt 3
const MIN_FALLBACK_TIME_MS = 15_000; // skip remaining fallbacks if budget below this

function isTransientReplicateError(msg: string): boolean {
  return TRANSIENT_REPLICATE_ERRORS.some((sig) => msg.includes(sig));
}

export async function faceSwap(
  sourceImageUrl: string,
  targetImageUrl: string,
  replicateToken: string,
  supabase: SupabaseClient,
  userId: string,
  opts?: { maxWaitMs?: number; retry?: boolean; skipPrimary?: boolean; perturb?: boolean }
): Promise<string> {
  const maxWaitMs = opts?.maxWaitMs ?? DEFAULT_MAX_WAIT_MS;
  const retry = opts?.retry ?? true;
  // skipPrimary routes straight to the fallback models (yan-ops →
  // pikachupichu25), skipping the cdingram primary entirely. Used by the
  // dup-detect retry to escape canned-output collisions — re-running the
  // primary returns the same canned scene, so the only escape is a
  // different model. See nightly-dreams dup-detect block.
  const skipPrimary = opts?.skipPrimary ?? false;
  // perturb: byte-level source-image perturbation that defeats Replicate's
  // content-hash cache (the URL query-string cache-bust we'd been using
  // since 2026-05-09 was a placebo — Replicate hashes downloaded BYTES,
  // not the URL, so the canned-output bug for stuck face embeddings was
  // free to recur. Restored 2026-05-31 after Kevin's nightly hit a
  // recurring canned scene). Default ON — the perturb itself runs on the
  // image-ops service since phase 4a; the Fly dual engine's copy of this
  // file passes `perturb: false` for its two parallel half-swaps.
  const perturb = opts?.perturb ?? true;
  const startedAt = Date.now();
  const deadline = startedAt + maxWaitMs;

  // ── Pre-flight: validate the source URL before any expensive work ──
  // Catches deleted/orphaned cast photo URLs (recipe still points to a
  // file that was deleted from storage). Without this, Replicate fetches
  // 404 and the face-swap model returns a hardcoded canned scene — the
  // 2026-05-31 root cause Kevin chased down.
  await validateSourceUrl(sourceImageUrl, '[faceSwap]');

  // Convert data: URL target → temp HTTPS upload. Replicate's face-swap
  // models can't reach data: URIs (they fetch from inside Replicate's infra).
  // Native OpenAI + Gemini providers return b64-inline data URLs — without
  // this step, any OpenAI/Gemini-rendered scene would fail face swap.
  const { url: httpsTarget, tempPath: targetTempPath } = await ensureHttpsImageUrl(
    targetImageUrl,
    supabase,
    userId
  );

  // ── Perturb source ONCE upfront (single-cast path only) ──
  // The perturbed URL is reused across primary + fallback attempts so we
  // pay the decode/encode cost once per face-swap call, not per attempt.
  let perturbedSource: { url: string; path: string } | null = null;
  if (perturb) {
    try {
      perturbedSource = await perturbSourceImage(sourceImageUrl, supabase, userId);
    } catch (e) {
      // Perturbation failure isn't fatal — fall back to the raw URL. The
      // canned-output cache hit will recur but we don't compound it with
      // a hard failure (Kevin's plus_one face would still render with
      // their unperturbed photo, just possibly into the canned scene).
      console.warn(
        `[faceSwap] perturbSourceImage failed (continuing unperturbed): ${(e as Error).message.slice(0, 80)}`
      );
    }
  }
  const effectiveSource = perturbedSource?.url ?? sourceImageUrl;

  const [primary, ...fallbacks] = FACE_SWAP_MODELS;
  const maxPrimaryAttempts = retry ? MAX_PRIMARY_ATTEMPTS : 1;

  let lastErr: Error | null = null;
  // Record every provider outcome so the surfaced error names the WHOLE chain
  // (cdingram → yan-ops → pikachupichu25), not just the last. Otherwise a
  // breadcrumb reads "pikachupichu25: no face found" and hides that cdingram +
  // yan-ops already failed the same way — i.e. it's the RENDER (no detectable
  // face), not one broken model. See 2026-07-10 -ultra 4MP investigation.
  const providerAttempts: string[] = [];
  const classifyFail = (m: string): string =>
    /no face found/i.test(m) ? 'no_face' : /timed out|deadline/i.test(m) ? 'timeout' : 'err';

  try {
    // ── Primary with retries (skipped when skipPrimary is set) ──
    if (!skipPrimary) {
      for (let attempt = 1; attempt <= maxPrimaryAttempts; attempt++) {
        try {
          const remaining = deadline - Date.now();
          if (remaining <= 0) throw new Error(`Face swap deadline exceeded (${primary.name})`);
          const url = await faceSwapOnce(
            effectiveSource,
            httpsTarget,
            replicateToken,
            supabase,
            userId,
            primary,
            remaining
          );
          if (attempt > 1)
            console.log(`[faceSwap] primary recovered on attempt ${attempt}/${maxPrimaryAttempts}`);
          return url;
        } catch (err) {
          lastErr = err as Error;
          const msg = lastErr.message || '';
          if (attempt < maxPrimaryAttempts && isTransientReplicateError(msg)) {
            const delay = BACKOFF_MS[attempt - 1] ?? BACKOFF_MS[BACKOFF_MS.length - 1];
            console.warn(
              `[faceSwap] primary ${primary.name} attempt ${attempt}/${maxPrimaryAttempts} failed (${msg.slice(0, 80)}) — retrying in ${delay}ms`
            );
            await new Promise((r) => setTimeout(r, delay));
            continue;
          }
          // Non-transient OR primary exhausted: break out and try fallbacks
          console.warn(
            `[faceSwap] primary ${primary.name} exhausted after ${attempt}/${maxPrimaryAttempts} (${msg.slice(0, 80)})`
          );
          providerAttempts.push(`${primary.name}:${classifyFail(msg)}`);
          break;
        }
      }
    }

    // ── Fallback chain (single-shot each) ──
    for (const fb of fallbacks) {
      const remaining = deadline - Date.now();
      if (remaining < MIN_FALLBACK_TIME_MS) {
        console.warn(
          `[faceSwap] skipping fallback ${fb.name}: only ${remaining}ms budget remaining`
        );
        continue;
      }
      try {
        console.log(`[faceSwap] trying fallback ${fb.name} (${remaining}ms budget remaining)`);
        const url = await faceSwapOnce(
          effectiveSource,
          httpsTarget,
          replicateToken,
          supabase,
          userId,
          fb,
          remaining
        );
        console.log(`[faceSwap] fallback ${fb.name} succeeded`);
        return url;
      } catch (err) {
        lastErr = err as Error;
        providerAttempts.push(`${fb.name}:${classifyFail((err as Error).message || '')}`);
        console.warn(
          `[faceSwap] fallback ${fb.name} failed: ${(err as Error).message?.slice(0, 80)}`
        );
        // Continue to next fallback
      }
    }

    // Enrich the surfaced error with the full attempt chain, as a SUFFIX so
    // callers still substring-match the original "no face found" / "timed out".
    if (lastErr && providerAttempts.length > 0) {
      lastErr.message = `${lastErr.message} [providers: ${providerAttempts.join(' → ')}]`;
    }
    throw lastErr ?? new Error('faceSwap: all models exhausted');
  } finally {
    // Clean up the temp data-URL conversion if we made one. Fire-and-forget;
    // a failed delete just leaves a small file in temp/ for a later sweep.
    if (targetTempPath) {
      supabase.storage
        .from('uploads')
        .remove([targetTempPath])
        .catch((e) => console.warn('[faceSwap] temp target cleanup failed:', (e as Error).message));
    }
    // Clean up the perturbed source temp upload — restored 2026-05-31.
    if (perturbedSource?.path) {
      supabase.storage
        .from('uploads')
        .remove([perturbedSource.path])
        .catch((e) =>
          console.warn('[faceSwap] perturbed source cleanup failed:', (e as Error).message)
        );
    }
  }
}
