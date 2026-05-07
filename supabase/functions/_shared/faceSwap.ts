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
import { decode as decodeJpeg, encode as encodeJpeg } from 'https://esm.sh/jpeg-js@0.4.4';

const DEFAULT_MAX_WAIT_MS = 90_000;
const POLL_INTERVAL_MS = 1000;

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
// We try them in order. Primary is cdingram (existing production model).
// Fallbacks are tried single-shot when primary exhausts retries on a
// transient Replicate error. Order chosen by 2026-04-30 benchmark:
// yan-ops has 200x cdingram's run count (more likely to stay warm globally).
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
  // deno-lint-ignore no-explicit-any
  supabase: any,
  userId: string
): Promise<{ url: string; path: string }> {
  const resp = await fetch(sourceImageUrl);
  if (!resp.ok) throw new Error(`Source download failed: ${resp.status}`);
  const buf = new Uint8Array(await resp.arrayBuffer());
  const decoded = decodeJpeg(buf, { useTArray: true });
  const data = decoded.data as Uint8Array;
  const w = decoded.width;
  const h = decoded.height;
  // Perturb a random pixel near the bottom-right corner — face is upper-half so unaffected
  const px = w - 1 - Math.floor(Math.random() * 4);
  const py = h - 1 - Math.floor(Math.random() * 4);
  const off = (py * w + px) * 4;
  data[off] = Math.floor(Math.random() * 256);
  data[off + 1] = Math.floor(Math.random() * 256);
  data[off + 2] = Math.floor(Math.random() * 256);
  const quality = 94 + Math.floor(Math.random() * 4); // 94-97, near-lossless
  const encoded = encodeJpeg({ data, width: w, height: h }, quality);
  const bytes = encoded.data instanceof Uint8Array ? encoded.data : new Uint8Array(encoded.data);

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

async function faceSwapOnce(
  sourceImageUrl: string,
  targetImageUrl: string,
  replicateToken: string,
  // deno-lint-ignore no-explicit-any
  supabase: any,
  userId: string,
  model: FaceSwapModel,
  maxWaitMs: number = DEFAULT_MAX_WAIT_MS
): Promise<string> {
  // Perturb + upload the source so Replicate cannot lock onto a stale
  // prediction output. The returned URL is what we hand Replicate;
  // `path` is the storage location we delete in finally.
  const { url: sourceForReplicate, path: perturbedPath } = await perturbSourceImage(
    sourceImageUrl,
    supabase,
    userId
  );

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
    // Fire-and-forget cleanup of the perturbed source upload
    supabase.storage
      .from('uploads')
      .remove([perturbedPath])
      .catch(() => {});
  }
}

/**
 * Public face swap with retries on the primary model + fallback chain.
 *
 * Resilience strategy (in order):
 *   1. Try primary model (cdingram). Retry up to MAX_PRIMARY_ATTEMPTS times
 *      with backoff on transient Replicate errors (5xx / 429 / timeout /
 *      "no face found" empty output).
 *   2. If primary still fails, try each fallback model in
 *      FACE_SWAP_MODELS[1..] single-shot, in order. Skip a fallback if
 *      remaining time budget is below MIN_FALLBACK_TIME_MS.
 *   3. If all models fail, throw the most-recent error.
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
  // deno-lint-ignore no-explicit-any
  supabase: any,
  userId: string,
  opts?: { maxWaitMs?: number; retry?: boolean }
): Promise<string> {
  const maxWaitMs = opts?.maxWaitMs ?? DEFAULT_MAX_WAIT_MS;
  const retry = opts?.retry ?? true;
  const startedAt = Date.now();
  const deadline = startedAt + maxWaitMs;

  const [primary, ...fallbacks] = FACE_SWAP_MODELS;
  const maxPrimaryAttempts = retry ? MAX_PRIMARY_ATTEMPTS : 1;

  // ── Primary with retries ──
  let lastErr: Error | null = null;
  for (let attempt = 1; attempt <= maxPrimaryAttempts; attempt++) {
    try {
      const remaining = deadline - Date.now();
      if (remaining <= 0) throw new Error(`Face swap deadline exceeded (${primary.name})`);
      const url = await faceSwapOnce(
        sourceImageUrl,
        targetImageUrl,
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

  // ── Fallback chain (single-shot each) ──
  for (const fb of fallbacks) {
    const remaining = deadline - Date.now();
    if (remaining < MIN_FALLBACK_TIME_MS) {
      console.warn(`[faceSwap] skipping fallback ${fb.name}: only ${remaining}ms budget remaining`);
      continue;
    }
    try {
      console.log(`[faceSwap] trying fallback ${fb.name} (${remaining}ms budget remaining)`);
      const url = await faceSwapOnce(
        sourceImageUrl,
        targetImageUrl,
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
  const halfBlend = Math.min(BLEND_PX >> 1, leftTake, outW - leftTake);
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

function resizeNearest(
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
    const sy = Math.floor(y * yR);
    for (let x = 0; x < dstW; x++) {
      const sx = Math.floor(x * xR);
      const s = (sy * srcW + sx) * 4;
      const d = (y * dstW + x) * 4;
      out[d] = data[s];
      out[d + 1] = data[s + 1];
      out[d + 2] = data[s + 2];
      out[d + 3] = data[s + 3];
    }
  }
  return out;
}

/**
 * Dual face swap — crop→swap→paste for two people in one scene.
 *
 * Crops left 55% and right 55% (10% overlap at center), swaps each face
 * independently in parallel, stitches left half + right half at midpoint.
 * Uploads stitched result to Supabase temp storage, returns public URL.
 *
 * `deadlineMs` is the absolute deadline (Date.now() + remaining). The swap
 * budget is computed from whatever time remains, minus 15s reserved for
 * download/stitch/upload. No retry on individual swaps — retrying in
 * parallel doubles total time and blows the Edge Function limit.
 */
export async function dualFaceSwap(
  leftSourceUrl: string,
  rightSourceUrl: string,
  targetImageUrl: string,
  replicateToken: string,
  supabase: any,
  userId: string,
  deadlineMs?: number
): Promise<string> {
  const deadline = deadlineMs ?? Date.now() + DEFAULT_MAX_WAIT_MS + 15_000;
  console.log(`[dualFaceSwap] Starting — budget ${Math.round((deadline - Date.now()) / 1000)}s`);

  const targetResp = await fetch(targetImageUrl);
  if (!targetResp.ok) throw new Error(`Download target failed: ${targetResp.status}`);
  const targetImg = decodeJpeg(new Uint8Array(await targetResp.arrayBuffer()), {
    formatAsRGBA: true,
  });
  const W = targetImg.width;
  const H = targetImg.height;
  let imgData: Uint8Array | null =
    targetImg.data instanceof Uint8Array ? targetImg.data : new Uint8Array(targetImg.data);
  console.log(`[dualFaceSwap] Target: ${W}x${H}`);

  const leftW = Math.floor(W * 0.55);
  const rightStart = Math.floor(W * 0.45);
  const rightW = W - rightStart;
  const midX = Math.floor(W / 2);

  let leftPixels: Uint8Array | null = cropRegion(imgData, W, H, 0, leftW);
  let rightPixels: Uint8Array | null = cropRegion(imgData, W, H, rightStart, rightW);
  // Drop the full target RGBA — we only need the crops from here on (~5MB freed)
  imgData = null;

  const leftJpeg = encodeJpeg({ data: leftPixels, width: leftW, height: H }, 95);
  const rightJpeg = encodeJpeg({ data: rightPixels, width: rightW, height: H }, 95);
  const leftJpegData =
    leftJpeg.data instanceof Uint8Array ? leftJpeg.data : new Uint8Array(leftJpeg.data);
  const rightJpegData =
    rightJpeg.data instanceof Uint8Array ? rightJpeg.data : new Uint8Array(rightJpeg.data);
  // Drop the crop RGBA — we only need the encoded JPEGs for upload (~5.6MB freed)
  leftPixels = null;
  rightPixels = null;

  const ts = Date.now();
  const leftPath = `temp/${userId}/crop-left-${ts}.jpg`;
  const rightPath = `temp/${userId}/crop-right-${ts}.jpg`;
  const [leftUp, rightUp] = await Promise.all([
    supabase.storage.from('uploads').upload(leftPath, leftJpegData, {
      contentType: 'image/jpeg',
      upsert: true,
      cacheControl: '2592000',
    }),
    supabase.storage.from('uploads').upload(rightPath, rightJpegData, {
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
    faceSwap(leftSourceUrl, leftCropUrl, replicateToken, supabase, userId, {
      maxWaitMs: swapBudgetMs,
      retry: false,
    }),
    faceSwap(rightSourceUrl, rightCropUrl, replicateToken, supabase, userId, {
      maxWaitMs: swapBudgetMs,
      retry: false,
    }),
  ]);
  console.log('[dualFaceSwap] Both swaps complete');

  // Sequential download + decode of the swap results — parallel here held
  // 2 JPEG buffers + 2 RGBA arrays simultaneously (~12MB peak); sequential
  // halves the window at a cost of ~500ms wall-clock.
  const leftSwapResp = await fetch(leftSwapUrl);
  const leftSwapImg = decodeJpeg(new Uint8Array(await leftSwapResp.arrayBuffer()), {
    formatAsRGBA: true,
  });
  let leftSwapData: Uint8Array | null =
    leftSwapImg.data instanceof Uint8Array ? leftSwapImg.data : new Uint8Array(leftSwapImg.data);
  if (leftSwapImg.width !== leftW || leftSwapImg.height !== H) {
    console.warn(
      `[dualFaceSwap] Left swap resize: ${leftSwapImg.width}x${leftSwapImg.height} -> ${leftW}x${H}`
    );
    leftSwapData = resizeNearest(leftSwapData, leftSwapImg.width, leftSwapImg.height, leftW, H);
  }

  const rightSwapResp = await fetch(rightSwapUrl);
  const rightSwapImg = decodeJpeg(new Uint8Array(await rightSwapResp.arrayBuffer()), {
    formatAsRGBA: true,
  });
  let rightSwapData: Uint8Array | null =
    rightSwapImg.data instanceof Uint8Array ? rightSwapImg.data : new Uint8Array(rightSwapImg.data);
  if (rightSwapImg.width !== rightW || rightSwapImg.height !== H) {
    console.warn(
      `[dualFaceSwap] Right swap resize: ${rightSwapImg.width}x${rightSwapImg.height} -> ${rightW}x${H}`
    );
    rightSwapData = resizeNearest(
      rightSwapData,
      rightSwapImg.width,
      rightSwapImg.height,
      rightW,
      H
    );
  }

  const rightStitchSkip = midX - rightStart;
  const stitched = stitchHalves(
    leftSwapData,
    leftW,
    rightSwapData,
    rightW,
    H,
    midX,
    rightStitchSkip,
    W
  );
  // Drop the half buffers — stitched is the only thing we need from here (~10MB freed)
  leftSwapData = null;
  rightSwapData = null;

  const stitchedJpeg = encodeJpeg({ data: stitched, width: W, height: H }, 95);
  const stitchedBytes =
    stitchedJpeg.data instanceof Uint8Array ? stitchedJpeg.data : new Uint8Array(stitchedJpeg.data);
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
  return urlData.publicUrl;
}
