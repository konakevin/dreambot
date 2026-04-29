/**
 * Face swap — composites the source face onto the target image using
 * yan-ops/face_swap (Replicate). Used by V4 (self-insert, photo
 * reimagine) and nightly (cast-bearing dreams).
 *
 * Single swap: faceSwap() — one face onto one image.
 * Dual swap: dualFaceSwap() — crop→swap→paste pipeline for two people.
 *
 * Both source and target must be public URLs (no base64 data URIs).
 */

// deno-lint-ignore-file no-explicit-any
import { decode as decodeJpeg, encode as encodeJpeg } from 'https://esm.sh/jpeg-js@0.4.4';

// cdingram/face-swap (replaces yan-ops/face_swap which had a canned-output
// bug for some face embeddings). Different param names: swap_image/input_image.
const FACE_SWAP_VERSION = 'd1d6ea8c8be89d664a07a457526f7128109dee7030fdac424788d762c71ed111';
const DEFAULT_MAX_WAIT_MS = 90_000;
const POLL_INTERVAL_MS = 1000;

/**
 * Cache-bust the source image bytes by re-encoding the JPEG with a random
 * quality and perturbing one corner pixel by a random amount. The bytes
 * differ on every call, so Replicate's input-hash cache can't lock us
 * onto a stale prediction output (the duplicate-render bug we saw 2026-04-29).
 *
 * Visually identical — face is untouched, only the bottom-right pixel
 * shifts by a few RGB values, well below perceptible.
 */
async function perturbSourceImage(sourceImageUrl: string): Promise<string> {
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
  const quality = 89 + Math.floor(Math.random() * 4); // 89-92, hugs the existing 90 baseline
  const encoded = encodeJpeg({ data, width: w, height: h }, quality);
  const bytes = encoded.data as Uint8Array;
  const parts: string[] = [];
  for (let i = 0; i < bytes.length; i += 4096) {
    parts.push(String.fromCharCode(...bytes.subarray(i, Math.min(i + 4096, bytes.length))));
  }
  return `data:image/jpeg;base64,${btoa(parts.join(''))}`;
}

async function faceSwapOnce(
  sourceImageDataUrl: string,
  targetImageUrl: string,
  replicateToken: string,
  maxWaitMs: number = DEFAULT_MAX_WAIT_MS
): Promise<string> {
  // Cache-bust the source image so Replicate cannot lock onto a stale
  // prediction output. Skip if already a data URI (dualFaceSwap passes
  // already-perturbed crops as data URIs).
  const sourceForReplicate = sourceImageDataUrl.startsWith('data:')
    ? sourceImageDataUrl
    : await perturbSourceImage(sourceImageDataUrl);

  const res = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${replicateToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: FACE_SWAP_VERSION,
      input: {
        // cdingram/face-swap param names
        swap_image: sourceForReplicate,
        input_image: targetImageUrl,
      },
    }),
  });

  if (!res.ok) throw new Error(`Face swap create failed: ${res.status}`);
  const data = await res.json();
  if (!data.id) throw new Error('No prediction ID from face swap');

  const maxPolls = Math.ceil(maxWaitMs / POLL_INTERVAL_MS);
  for (let i = 0; i < maxPolls; i++) {
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
    const pollRes = await fetch(`https://api.replicate.com/v1/predictions/${data.id}`, {
      headers: { Authorization: `Bearer ${replicateToken}` },
    });
    const pollData = await pollRes.json();
    if (pollData.status === 'succeeded') {
      const output = pollData.output;
      let url: string | undefined;
      if (typeof output === 'string') {
        url = output;
      } else if (Array.isArray(output)) {
        url = output[0];
      } else if (output && typeof output === 'object') {
        if (output.status === 'failed' || output.code === 500) {
          throw new Error(`Face swap model error: ${output.msg || 'unknown'}`);
        }
        url = output.image;
      }
      if (url) return url;
    }
    if (pollData.status === 'failed' || pollData.status === 'canceled') {
      throw new Error(`Face swap ${pollData.status}: ${pollData.error ?? 'unknown'}`);
    }
  }
  throw new Error('Face swap timed out');
}

/**
 * Single face swap with retry on timeout. Cold-start timeouts on
 * Replicate are common and transient — first attempt warms the
 * container, second almost always succeeds.
 *
 * When called from dualFaceSwap, retry is disabled (retrying two
 * parallel swaps would double the total time and blow the Edge
 * Function limit).
 */
export async function faceSwap(
  sourceImageDataUrl: string,
  targetImageUrl: string,
  replicateToken: string,
  opts?: { maxWaitMs?: number; retry?: boolean }
): Promise<string> {
  const maxWaitMs = opts?.maxWaitMs ?? DEFAULT_MAX_WAIT_MS;
  const retry = opts?.retry ?? true;
  try {
    return await faceSwapOnce(sourceImageDataUrl, targetImageUrl, replicateToken, maxWaitMs);
  } catch (err) {
    const msg = (err as Error).message || '';
    if (retry && msg.includes('timed out')) {
      console.warn('[faceSwap] first attempt timed out — retrying once');
      return await faceSwapOnce(sourceImageDataUrl, targetImageUrl, replicateToken, maxWaitMs);
    }
    throw err;
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

function toBase64(bytes: Uint8Array): string {
  const parts: string[] = [];
  for (let i = 0; i < bytes.length; i += 1024) {
    parts.push(String.fromCharCode(...bytes.subarray(i, Math.min(i + 1024, bytes.length))));
  }
  return btoa(parts.join(''));
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
  const imgData =
    targetImg.data instanceof Uint8Array ? targetImg.data : new Uint8Array(targetImg.data);
  console.log(`[dualFaceSwap] Target: ${W}x${H}`);

  const leftW = Math.floor(W * 0.55);
  const rightStart = Math.floor(W * 0.45);
  const rightW = W - rightStart;
  const midX = Math.floor(W / 2);

  const leftPixels = cropRegion(imgData, W, H, 0, leftW);
  const rightPixels = cropRegion(imgData, W, H, rightStart, rightW);

  const leftJpeg = encodeJpeg({ data: leftPixels, width: leftW, height: H }, 90);
  const rightJpeg = encodeJpeg({ data: rightPixels, width: rightW, height: H }, 90);
  const leftJpegData =
    leftJpeg.data instanceof Uint8Array ? leftJpeg.data : new Uint8Array(leftJpeg.data);
  const rightJpegData =
    rightJpeg.data instanceof Uint8Array ? rightJpeg.data : new Uint8Array(rightJpeg.data);

  const ts = Date.now();
  const leftPath = `temp/${userId}/crop-left-${ts}.jpg`;
  const rightPath = `temp/${userId}/crop-right-${ts}.jpg`;
  const [leftUp, rightUp] = await Promise.all([
    supabase.storage
      .from('uploads')
      .upload(leftPath, leftJpegData, { contentType: 'image/jpeg', upsert: true }),
    supabase.storage
      .from('uploads')
      .upload(rightPath, rightJpegData, { contentType: 'image/jpeg', upsert: true }),
  ]);
  if (leftUp.error) throw new Error(`Upload left crop failed: ${leftUp.error.message}`);
  if (rightUp.error) throw new Error(`Upload right crop failed: ${rightUp.error.message}`);
  const leftCropUrl = supabase.storage.from('uploads').getPublicUrl(leftPath).data.publicUrl;
  const rightCropUrl = supabase.storage.from('uploads').getPublicUrl(rightPath).data.publicUrl;
  console.log(`[dualFaceSwap] Crops uploaded: ${leftPath}, ${rightPath}`);

  const swapBudgetMs = Math.max(deadline - Date.now() - 15_000, 20_000);
  console.log(`[dualFaceSwap] Swap budget: ${Math.round(swapBudgetMs / 1000)}s`);
  const [leftSwapUrl, rightSwapUrl] = await Promise.all([
    faceSwap(leftSourceUrl, leftCropUrl, replicateToken, { maxWaitMs: swapBudgetMs, retry: false }),
    faceSwap(rightSourceUrl, rightCropUrl, replicateToken, {
      maxWaitMs: swapBudgetMs,
      retry: false,
    }),
  ]);
  console.log('[dualFaceSwap] Both swaps complete');

  const [leftSwapResp, rightSwapResp] = await Promise.all([
    fetch(leftSwapUrl),
    fetch(rightSwapUrl),
  ]);
  const leftSwapImg = decodeJpeg(new Uint8Array(await leftSwapResp.arrayBuffer()), {
    formatAsRGBA: true,
  });
  const rightSwapImg = decodeJpeg(new Uint8Array(await rightSwapResp.arrayBuffer()), {
    formatAsRGBA: true,
  });

  let leftSwapData =
    leftSwapImg.data instanceof Uint8Array ? leftSwapImg.data : new Uint8Array(leftSwapImg.data);
  if (leftSwapImg.width !== leftW || leftSwapImg.height !== H) {
    console.warn(
      `[dualFaceSwap] Left swap resize: ${leftSwapImg.width}x${leftSwapImg.height} -> ${leftW}x${H}`
    );
    leftSwapData = resizeNearest(leftSwapData, leftSwapImg.width, leftSwapImg.height, leftW, H);
  }

  let rightSwapData =
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

  const stitchedJpeg = encodeJpeg({ data: stitched, width: W, height: H }, 90);
  const stitchedBytes =
    stitchedJpeg.data instanceof Uint8Array ? stitchedJpeg.data : new Uint8Array(stitchedJpeg.data);
  const tempFile = `temp/${userId}/stitched-${Date.now()}.jpg`;
  const { error: upErr } = await supabase.storage
    .from('uploads')
    .upload(tempFile, stitchedBytes, { contentType: 'image/jpeg', upsert: true });
  if (upErr) throw new Error(`Stitched upload failed: ${upErr.message}`);
  const { data: urlData } = supabase.storage.from('uploads').getPublicUrl(tempFile);

  supabase.storage
    .from('uploads')
    .remove([leftPath, rightPath])
    .catch(() => {});
  console.log('[dualFaceSwap] Pipeline complete');
  return urlData.publicUrl;
}
