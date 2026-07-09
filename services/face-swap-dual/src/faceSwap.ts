/**
 * Face swap — composites the source face onto the target image using
 * cdingram/face-swap (Replicate). Used by V4 (self-insert, photo
 * reimagine, DLT) and nightly (cast-bearing dreams).
 *
 * Single swap: faceSwap() — one face onto one image.
 * Dual swap: dualFaceSwap() — fixed left-55%/right-55% crop pipeline for
 *            two-character side-by-side compositions.
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
import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { decodeImage, encodeJpeg } from './imageCodec.ts';
import { verifyDualIdentity, type DualIdentityRead } from './faceEmbed.ts';
import { detectFacesWithGender, type GenderedFace } from './faceDetect.ts';
import {
  planDualSplit,
  faceCropBox,
  compositeFaceMasked,
  iou,
  type FaceBox,
} from './faceDetectMath.ts';

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
  const resp = await fetch(sourceImageUrl);
  if (!resp.ok) throw new Error(`Source download failed: ${resp.status}`);
  const buf = new Uint8Array(await resp.arrayBuffer());
  // Drift-parity with _shared/faceSwap.ts (Stage 0, 2026-07-08): oversized
  // sources skip the in-process decode (the perturb is only an anti-hash-cache
  // nicety). Fly has 2GB so this is belt-and-suspenders, but keeping the copies
  // byte-similar is the point — a future backport must not lose the guard.
  if (buf.length > 1_200_000) {
    console.warn(
      `[perturbSource] source ${buf.length}B exceeds decode budget — skipping perturb, passing URL through`
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
 * When called from dualFaceSwap, retry is disabled on the primary
 * (retry: false). Fallback chain still runs because dual-cast renders
 * are the worst affected by primary outages — yan-ops as a fallback is
 * exactly the use case Phase 2 unblocks. The orchestrator's outer 3x
 * retry loop wraps this whole function.
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
  // recurring canned scene). Default ON for single-cast; dual-cast
  // callers pass `perturb: false` to preserve CPU budget (2 parallel
  // target-half decode/encodes already fill it).
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
        console.warn(
          `[faceSwap] fallback ${fb.name} failed: ${(err as Error).message?.slice(0, 80)}`
        );
        // Continue to next fallback
      }
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

// ── Pixel helpers for dual face swap ──────────────────────────────────

function cropRegion(
  data: Uint8Array,
  srcW: number,
  h: number,
  startX: number,
  cropW: number
): Uint8Array {
  const out = new Uint8Array(cropW * h * 4);
  for (let y = 0; y < h; y++) {
    const srcOff = (y * srcW + startX) * 4;
    out.set(data.subarray(srcOff, srcOff + cropW * 4), y * cropW * 4);
  }
  return out;
}

/** Rectangular sub-crop (x,y,w,h) — used by the per-face composite path. */
function cropRect(
  data: Uint8Array,
  srcW: number,
  x: number,
  y: number,
  cw: number,
  ch: number
): Uint8Array {
  const out = new Uint8Array(cw * ch * 4);
  for (let row = 0; row < ch; row++) {
    const srcOff = ((y + row) * srcW + x) * 4;
    out.set(data.subarray(srcOff, srcOff + cw * 4), row * cw * 4);
  }
  return out;
}

function stitchHalves(
  leftData: Uint8Array,
  leftW: number,
  rightData: Uint8Array,
  rightW: number,
  h: number,
  leftTake: number,
  rightSkip: number,
  outW: number
): Uint8Array {
  const BLEND_PX = 40;
  // Clamp to rightSkip (= the crop overlap) too: with a dynamic split the overlap
  // can be narrower than the blend, and the blend reads rightData at
  // (x - leftTake + rightSkip) — halfBlend > rightSkip would read before column 0.
  const halfBlend = Math.min(BLEND_PX >> 1, leftTake, outW - leftTake, Math.max(0, rightSkip));
  const blendStart = leftTake - halfBlend;
  const blendEnd = leftTake + halfBlend;
  const blendWidth = blendEnd - blendStart;

  const rightTake = outW - leftTake;
  const out = new Uint8Array(outW * h * 4);
  for (let y = 0; y < h; y++) {
    const dstRow = y * outW * 4;
    // Pure left zone
    out.set(leftData.subarray(y * leftW * 4, y * leftW * 4 + blendStart * 4), dstRow);
    // Blend zone — linear crossfade between left and right
    for (let x = blendStart; x < blendEnd; x++) {
      const t = (x - blendStart) / blendWidth; // 0→1
      const lOff = (y * leftW + x) * 4;
      const rX = x - leftTake + rightSkip;
      const rOff = (y * rightW + rX) * 4;
      const dOff = dstRow + x * 4;
      out[dOff] = Math.round(leftData[lOff] * (1 - t) + rightData[rOff] * t);
      out[dOff + 1] = Math.round(leftData[lOff + 1] * (1 - t) + rightData[rOff + 1] * t);
      out[dOff + 2] = Math.round(leftData[lOff + 2] * (1 - t) + rightData[rOff + 2] * t);
      out[dOff + 3] = 255;
    }
    // Pure right zone
    const rSrc = (y * rightW + (blendEnd - leftTake + rightSkip)) * 4;
    out.set(rightData.subarray(rSrc, rSrc + (outW - blendEnd) * 4), dstRow + blendEnd * 4);
  }
  return out;
}

// Bilinear (was nearest-neighbor, 2026-07-08 Stage 0): the swap models
// occasionally return off-size output; nearest produced visible blockiness
// on the resize-back. Bilinear is ~free at these sizes.
function resizeBilinear(
  data: Uint8Array,
  srcW: number,
  srcH: number,
  dstW: number,
  dstH: number
): Uint8Array {
  if (srcW === dstW && srcH === dstH) return data;
  const out = new Uint8Array(dstW * dstH * 4);
  const xR = srcW / dstW;
  const yR = srcH / dstH;
  for (let y = 0; y < dstH; y++) {
    const fy = Math.min(srcH - 1, y * yR);
    const y0 = Math.floor(fy);
    const y1 = Math.min(srcH - 1, y0 + 1);
    const wy = fy - y0;
    for (let x = 0; x < dstW; x++) {
      const fx = Math.min(srcW - 1, x * xR);
      const x0 = Math.floor(fx);
      const x1 = Math.min(srcW - 1, x0 + 1);
      const wx = fx - x0;
      const d = (y * dstW + x) * 4;
      for (let c = 0; c < 4; c++) {
        const p00 = data[(y0 * srcW + x0) * 4 + c];
        const p10 = data[(y0 * srcW + x1) * 4 + c];
        const p01 = data[(y1 * srcW + x0) * 4 + c];
        const p11 = data[(y1 * srcW + x1) * 4 + c];
        out[d + c] = Math.round(
          p00 * (1 - wx) * (1 - wy) + p10 * wx * (1 - wy) + p01 * (1 - wx) * wy + p11 * wx * wy
        );
      }
    }
  }
  return out;
}

/**
 * PER-FACE COMPOSITE swap — the path for poses the vertical strip CAN'T separate:
 * faces vertically stacked or horizontally overlapping (piggyback, dip, one
 * partner above/behind the other, dancing close). Instead of splitting the whole
 * image into two strips, crop a padded box around EACH detected face, swap the
 * gender-matched source onto it, then composite each swapped face back onto the
 * original render MASKED to its own face region (overlapping crops never clobber
 * each other). Works for ANY 2-face layout where the boxes are distinguishable.
 *
 * Returns null when the two faces overlap too heavily to crop apart (high IoU) —
 * the swap model would catch the wrong face in each crop, so the caller re-renders.
 */
async function perFaceCompositeSwap(
  base: Uint8Array,
  W: number,
  H: number,
  faceL: GenderedFace,
  faceR: GenderedFace,
  leftSrc: string,
  rightSrc: string,
  replicateToken: string,
  supabase: SupabaseClient,
  userId: string,
  swapBudgetMs: number,
  skipPrimary: boolean
): Promise<string | null> {
  const overlap = iou(faceL, faceR);
  if (overlap > 0.35) {
    console.log(
      `[dualFaceSwap] per-face: boxes overlap too much (iou=${overlap.toFixed(2)}) — re-render`
    );
    return null;
  }

  const swapOne = async (src: string, face: FaceBox, label: string) => {
    const box = faceCropBox(face, W, H);
    const cropPixels = cropRect(base, W, box.x, box.y, box.w, box.h);
    const jpeg = await encodeJpeg({ data: cropPixels, width: box.w, height: box.h }, 92);
    const path = `temp/${userId}/face-${label}-${Date.now()}.jpg`;
    const up = await supabase.storage.from('uploads').upload(path, jpeg, {
      contentType: 'image/jpeg',
      upsert: true,
      cacheControl: '2592000',
    });
    if (up.error) throw new Error(`Upload ${label} face crop failed: ${up.error.message}`);
    const cropUrl = supabase.storage.from('uploads').getPublicUrl(path).data.publicUrl;
    const swapUrl = await faceSwap(src, cropUrl, replicateToken, supabase, userId, {
      maxWaitMs: swapBudgetMs,
      retry: false,
      skipPrimary,
      perturb: false,
    });
    const resp = await fetch(swapUrl);
    const img = await decodeImage(new Uint8Array(await resp.arrayBuffer()));
    let data = img.data;
    if (img.width !== box.w || img.height !== box.h) {
      data = resizeBilinear(data, img.width, img.height, box.w, box.h);
    }
    supabase.storage
      .from('uploads')
      .remove([path])
      .catch(() => {});
    return { data, box };
  };

  const [l, r] = await Promise.all([swapOne(leftSrc, faceL, 'l'), swapOne(rightSrc, faceR, 'r')]);
  console.log('[dualFaceSwap] per-face: both swaps complete, compositing');

  // Composite each swapped face back onto a COPY of the original, masked to its own
  // face region (feather ≈ 0.6× face width) so stacked/close crops blend cleanly.
  const composed = new Uint8Array(base);
  compositeFaceMasked(
    composed,
    W,
    H,
    l.data,
    l.box.x,
    l.box.y,
    l.box.w,
    l.box.h,
    faceL,
    faceL.w * 0.6
  );
  compositeFaceMasked(
    composed,
    W,
    H,
    r.data,
    r.box.x,
    r.box.y,
    r.box.w,
    r.box.h,
    faceR,
    faceR.w * 0.6
  );

  const bytes = await encodeJpeg({ data: composed, width: W, height: H }, 92);
  const tempFile = `temp/${userId}/composite-${Date.now()}.jpg`;
  const { error: upErr } = await supabase.storage.from('uploads').upload(tempFile, bytes, {
    contentType: 'image/jpeg',
    upsert: true,
    cacheControl: '2592000',
  });
  if (upErr) throw new Error(`Composite upload failed: ${upErr.message}`);
  return supabase.storage.from('uploads').getPublicUrl(tempFile).data.publicUrl;
}

export interface DualSwapResult {
  /** The stitched swapped image URL, or null when the render had no clean 2-face
   *  split (caller should re-render the couple). */
  swappedUrl: string | null;
  /** Faces detected in the render (legacy 55/55 path reports 2). */
  faceCount: number;
  /** Why swappedUrl is null (re-render signal) — distinguishes a detection
   *  shortfall from a gender-guard refusal in bench stats + forensics. */
  reason?: string;
  /** ArcFace identity similarities of the swapped faces vs their intended
   *  sources (Stage 8, IDENTITY_VERIFY=shadow|enforce). MEASUREMENT only —
   *  enforcement policy lives in the edge pipeline, which knows the medium. */
  identity?: DualIdentityRead | null;
}

/** Measure identity on a successful swap when IDENTITY_VERIFY is on. Never
 *  throws; ~1-2s (3 fetches + detect + 4 embeds), skipped entirely when off. */
async function maybeMeasureIdentity(
  swappedUrl: string,
  leftSrc: string,
  rightSrc: string
): Promise<DualIdentityRead | null | undefined> {
  const mode = Deno.env.get('IDENTITY_VERIFY');
  if (mode !== 'shadow' && mode !== 'enforce') return undefined;
  const read = await verifyDualIdentity(swappedUrl, leftSrc, rightSrc);
  if (read) console.log(`[identity] L=${read.left ?? '?'} R=${read.right ?? '?'} ${read.ms}ms`);
  return read;
}

/**
 * Dual face swap — crop→swap→paste for two people in one scene.
 *
 * When `DUAL_SWAP_DYNAMIC_SPLIT=true`: detect the two face boxes (in-process
 * YuNet) + each face's gender (genderage), split at the GAP BETWEEN the faces
 * (so each half holds exactly one face), put each cast member on their
 * matching-gender face, then stitch. Correct by construction — both-on-one and
 * wrong-gender are impossible. Returns `swappedUrl=null, faceCount<2` when the
 * render has no clean two-face split (→ caller re-renders the couple).
 *
 * Fallback-safe: flag off OR detection throws → the legacy fixed 55/55 positional
 * crop (never worse than before). A clean detection that finds <2 / overlapping
 * faces returns the re-render signal instead of doing a bad crop.
 *
 * `deadlineMs` is the absolute deadline. `genders` carries each source's gender
 * for the matching (left=cast[0], right=cast[1]).
 */
export async function dualFaceSwap(
  leftSourceUrl: string,
  rightSourceUrl: string,
  targetImageUrl: string,
  replicateToken: string,
  supabase: SupabaseClient,
  userId: string,
  deadlineMs?: number,
  skipPrimary = false,
  genders?: { left?: 'male' | 'female' | null; right?: 'male' | 'female' | null },
  // R2 (2026-07-09): caller-supplied read of the RENDERED faces' genders
  // (left/right by x-order), from a Haiku vision confirm after a
  // gender_unconfirmed reject. Substitutes for genderage on THIS attempt —
  // genderage misreads athletes/stylized faces where Haiku reads fine
  // (2026-07-08 action bench: 5/11 rejects were genderage misreads).
  genderOverride?: { left: 'male' | 'female'; right: 'male' | 'female' } | null
): Promise<DualSwapResult> {
  const deadline = deadlineMs ?? Date.now() + DEFAULT_MAX_WAIT_MS + 15_000;
  const dynamicSplit = Deno.env.get('DUAL_SWAP_DYNAMIC_SPLIT') === 'true';
  console.log(
    `[dualFaceSwap] Starting — budget ${Math.round((deadline - Date.now()) / 1000)}s dynamicSplit=${dynamicSplit}`
  );

  const targetResp = await fetch(targetImageUrl);
  if (!targetResp.ok) throw new Error(`Download target failed: ${targetResp.status}`);
  const targetImg = await decodeImage(new Uint8Array(await targetResp.arrayBuffer()));
  const W = targetImg.width;
  const H = targetImg.height;
  let imgData: Uint8Array | null = targetImg.data;
  console.log(`[dualFaceSwap] Target: ${W}x${H}`);

  // ── Crop geometry + per-crop source. Default = legacy fixed 55/55 positional
  // (also the fallback if detection is off or errors — never worse than before). ──
  let leftW = Math.floor(W * 0.55);
  let rightStart = Math.floor(W * 0.45);
  let leftTake = Math.floor(W / 2); // stitch boundary
  let leftSrc = leftSourceUrl;
  let rightSrc = rightSourceUrl;
  let faceCount = 2;

  if (dynamicSplit) {
    try {
      const faces = await detectFacesWithGender(imgData, W, H);
      faceCount = faces.length;
      const split = planDualSplit(faces, W);
      if (!split.ok) {
        // <2 faces → there's no second face to swap; must re-render.
        if (split.reason === 'lt2_faces' || !split.leftBox || !split.rightBox) {
          console.log(
            `[dualFaceSwap] no clean split (${split.reason}, faces=${faceCount}) — re-render`
          );
          return { swappedUrl: null, faceCount, reason: `no_split:${split.reason}` };
        }
        // reason==='overlap' → faces too close to split into vertical strips
        // (stacked / close pose: piggyback, dip, dancing). Use the PER-FACE
        // COMPOSITE path, which crops + swaps + composites each face independently.
        const fL = split.leftBox as GenderedFace;
        const fR = split.rightBox as GenderedFace;
        const gL = genderOverride?.left ?? fL.gender;
        const gR = genderOverride?.right ?? fR.gender;
        let lSrc = leftSourceUrl;
        let rSrc = rightSourceUrl;
        const mixed =
          (genders?.left === 'male' && genders?.right === 'female') ||
          (genders?.left === 'female' && genders?.right === 'male');
        if (mixed) {
          if (!(gL && gR && gL !== gR)) {
            console.log(
              `[dualFaceSwap] per-face: mixed cast but detected genders ${gL}/${gR}${genderOverride ? ' (override)' : ''} — re-render`
            );
            return {
              swappedUrl: null,
              faceCount,
              reason: `gender_unconfirmed:${gL ?? '?'}/${gR ?? '?'}`,
            };
          }
          const maleSrc = genders!.left === 'male' ? leftSourceUrl : rightSourceUrl;
          const femaleSrc = genders!.left === 'female' ? leftSourceUrl : rightSourceUrl;
          lSrc = gL === 'male' ? maleSrc : femaleSrc;
          rSrc = gL === 'male' ? femaleSrc : maleSrc;
        }
        const perFaceBudgetMs = Math.max(deadline - Date.now() - 15_000, 20_000);
        const composedUrl = await perFaceCompositeSwap(
          targetImg.data,
          W,
          H,
          fL,
          fR,
          lSrc,
          rSrc,
          replicateToken,
          supabase,
          userId,
          perFaceBudgetMs,
          skipPrimary
        );
        if (!composedUrl) return { swappedUrl: null, faceCount, reason: 'perface_swap_failed' };
        console.log(`[dualFaceSwap] per-face composite complete faces=${faceCount}`);
        return {
          swappedUrl: composedUrl,
          faceCount,
          identity: await maybeMeasureIdentity(composedUrl, lSrc, rSrc),
        };
      }
      const fL = split.leftBox as GenderedFace;
      const fR = split.rightBox as GenderedFace;
      const gL = genderOverride?.left ?? fL.gender;
      const gR = genderOverride?.right ?? fR.gender;
      const mixedCast =
        (genders?.left === 'male' && genders?.right === 'female') ||
        (genders?.left === 'female' && genders?.right === 'male');
      if (mixedCast) {
        // Detected faces must read one-of-each, else we can't place correctly
        // (genderage misread, or the render produced two same-gender bodies) → re-render.
        if (!(gL && gR && gL !== gR)) {
          console.log(
            `[dualFaceSwap] mixed cast but detected genders ${gL}/${gR}${genderOverride ? ' (override)' : ''} — re-render`
          );
          return {
            swappedUrl: null,
            faceCount,
            reason: `gender_unconfirmed:${gL ?? '?'}/${gR ?? '?'}`,
          };
        }
        const maleSrc = genders!.left === 'male' ? leftSourceUrl : rightSourceUrl;
        const femaleSrc = genders!.left === 'female' ? leftSourceUrl : rightSourceUrl;
        leftSrc = gL === 'male' ? maleSrc : femaleSrc;
        rightSrc = gL === 'male' ? femaleSrc : maleSrc;
      } // else same-sex / unknown → positional (leftSource→left face by x-order)
      leftW = Math.min(W, split.splitX + split.overlap);
      rightStart = Math.max(0, split.splitX - split.overlap);
      leftTake = split.splitX;
      console.log(
        `[dualFaceSwap] dynamic split @${split.splitX} overlap=${split.overlap} faces=${faceCount} L=${fL.gender} R=${fR.gender}`
      );
    } catch (e) {
      console.warn(
        `[dualFaceSwap] detection failed (${(e as Error).message.slice(0, 80)}) — 55/55 fallback`
      );
      // keep the legacy bounds + positional sources set above
    }
  }

  const rightW = W - rightStart;
  const rightSkip = leftTake - rightStart;

  let leftPixels: Uint8Array | null = cropRegion(imgData, W, H, 0, leftW);
  let rightPixels: Uint8Array | null = cropRegion(imgData, W, H, rightStart, rightW);
  // Drop the full target RGBA — we only need the crops from here on (~5MB freed)
  imgData = null;

  const [leftJpeg, rightJpeg] = await Promise.all([
    encodeJpeg({ data: leftPixels, width: leftW, height: H }, 92),
    encodeJpeg({ data: rightPixels, width: rightW, height: H }, 92),
  ]);
  // Drop the crop RGBA — we only need the encoded JPEGs for upload (~5.6MB freed)
  leftPixels = null;
  rightPixels = null;

  const ts = Date.now();
  const leftPath = `temp/${userId}/crop-left-${ts}.jpg`;
  const rightPath = `temp/${userId}/crop-right-${ts}.jpg`;
  const [leftUp, rightUp] = await Promise.all([
    supabase.storage.from('uploads').upload(leftPath, leftJpeg, {
      contentType: 'image/jpeg',
      upsert: true,
      cacheControl: '2592000',
    }),
    supabase.storage.from('uploads').upload(rightPath, rightJpeg, {
      contentType: 'image/jpeg',
      upsert: true,
      cacheControl: '2592000',
    }),
  ]);
  if (leftUp.error) throw new Error(`Upload left crop failed: ${leftUp.error.message}`);
  if (rightUp.error) throw new Error(`Upload right crop failed: ${rightUp.error.message}`);
  const leftCropUrl = supabase.storage.from('uploads').getPublicUrl(leftPath).data.publicUrl;
  const rightCropUrl = supabase.storage.from('uploads').getPublicUrl(rightPath).data.publicUrl;
  console.log(`[dualFaceSwap] Crops uploaded: ${leftPath}, ${rightPath}`);

  const swapBudgetMs = Math.max(deadline - Date.now() - 15_000, 20_000);
  console.log(`[dualFaceSwap] Swap budget: ${Math.round(swapBudgetMs / 1000)}s`);
  const [leftSwapUrl, rightSwapUrl] = await Promise.all([
    faceSwap(leftSrc, leftCropUrl, replicateToken, supabase, userId, {
      maxWaitMs: swapBudgetMs,
      retry: false,
      skipPrimary,
      // Skip byte-level source perturbation in the dual path — 2 parallel
      // decode/encodes of the source plus the 2 already-running target-half
      // encodes blow the per-isolate CPU budget (the 2026-05-09 reason
      // perturbSourceImage was originally disabled). Dual relies on the
      // dup-detect block in nightly-dreams to catch canned-output
      // collisions instead.
      perturb: false,
    }),
    faceSwap(rightSrc, rightCropUrl, replicateToken, supabase, userId, {
      maxWaitMs: swapBudgetMs,
      retry: false,
      skipPrimary,
      perturb: false,
    }),
  ]);
  console.log('[dualFaceSwap] Both swaps complete');

  // Sequential download + decode of the swap results — parallel here held
  // 2 encoded buffers + 2 RGBA arrays simultaneously (~12MB peak); sequential
  // halves the window at a cost of ~500ms wall-clock.
  const leftSwapResp = await fetch(leftSwapUrl);
  const leftSwapImg = await decodeImage(new Uint8Array(await leftSwapResp.arrayBuffer()));
  let leftSwapData: Uint8Array | null = leftSwapImg.data;
  if (leftSwapImg.width !== leftW || leftSwapImg.height !== H) {
    console.warn(
      `[dualFaceSwap] Left swap resize: ${leftSwapImg.width}x${leftSwapImg.height} -> ${leftW}x${H}`
    );
    leftSwapData = resizeBilinear(leftSwapData, leftSwapImg.width, leftSwapImg.height, leftW, H);
  }

  const rightSwapResp = await fetch(rightSwapUrl);
  const rightSwapImg = await decodeImage(new Uint8Array(await rightSwapResp.arrayBuffer()));
  let rightSwapData: Uint8Array | null = rightSwapImg.data;
  if (rightSwapImg.width !== rightW || rightSwapImg.height !== H) {
    console.warn(
      `[dualFaceSwap] Right swap resize: ${rightSwapImg.width}x${rightSwapImg.height} -> ${rightW}x${H}`
    );
    rightSwapData = resizeBilinear(
      rightSwapData,
      rightSwapImg.width,
      rightSwapImg.height,
      rightW,
      H
    );
  }

  const stitched = stitchHalves(
    leftSwapData,
    leftW,
    rightSwapData,
    rightW,
    H,
    leftTake,
    rightSkip,
    W
  );
  // Drop the half buffers — stitched is the only thing we need from here (~10MB freed)
  leftSwapData = null;
  rightSwapData = null;

  const stitchedBytes = await encodeJpeg({ data: stitched, width: W, height: H }, 92);
  const tempFile = `temp/${userId}/stitched-${Date.now()}.jpg`;
  const { error: upErr } = await supabase.storage.from('uploads').upload(tempFile, stitchedBytes, {
    contentType: 'image/jpeg',
    upsert: true,
    cacheControl: '2592000',
  });
  if (upErr) throw new Error(`Stitched upload failed: ${upErr.message}`);
  const { data: urlData } = supabase.storage.from('uploads').getPublicUrl(tempFile);

  supabase.storage
    .from('uploads')
    .remove([leftPath, rightPath])
    .catch(() => {});
  console.log('[dualFaceSwap] Pipeline complete');
  return {
    swappedUrl: urlData.publicUrl,
    faceCount,
    identity: await maybeMeasureIdentity(urlData.publicUrl, leftSrc, rightSrc),
  };
}
