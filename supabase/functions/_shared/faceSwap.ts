/**
 * Face swap — composites the source face onto the target image using
 * codeplugtech/face-swap (Replicate). Used by V4 (self-insert, photo
 * reimagine) and nightly (cast-bearing dreams).
 *
 * Single swap: faceSwap() — one face onto one image.
 * Dual swap: dualFaceSwap() — crop→swap→paste pipeline for two people.
 *
 * The source can be a public URL or a base64 data URL. Target must be a
 * public URL. Polling is generous (45 × 2s = 90s) because the model cold-
 * starts slowly.
 */

// deno-lint-ignore-file no-explicit-any
import { decode as decodeJpeg, encode as encodeJpeg } from 'https://esm.sh/jpeg-js@0.4.4';

const FACE_SWAP_VERSION = '278a81e7ebb22db98bcba54de985d22cc1abeead2754eb1f2af717247be69b34';

async function faceSwapOnce(
  sourceImageDataUrl: string,
  targetImageUrl: string,
  replicateToken: string
): Promise<string> {
  const res = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${replicateToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: FACE_SWAP_VERSION,
      input: {
        swap_image: sourceImageDataUrl,
        input_image: targetImageUrl,
      },
    }),
  });

  if (!res.ok) throw new Error(`Face swap create failed: ${res.status}`);
  const data = await res.json();
  if (!data.id) throw new Error('No prediction ID from face swap');

  for (let i = 0; i < 45; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const pollRes = await fetch(`https://api.replicate.com/v1/predictions/${data.id}`, {
      headers: { Authorization: `Bearer ${replicateToken}` },
    });
    const pollData = await pollRes.json();
    if (pollData.status === 'succeeded') {
      const url = typeof pollData.output === 'string' ? pollData.output : pollData.output?.[0];
      if (url) return url;
    }
    if (pollData.status === 'failed' || pollData.status === 'canceled') {
      throw new Error(`Face swap ${pollData.status}: ${pollData.error ?? 'unknown'}`);
    }
  }
  throw new Error('Face swap timed out');
}

/**
 * Ship C: wraps faceSwapOnce with a single retry on timeout. Cold-start
 * timeouts on Replicate's side are common and usually transient — the
 * first attempt warms the container, the second almost always succeeds.
 * Only retries on timeout (not on `failed` or `canceled` which are
 * deterministic errors that won't recover).
 */
export async function faceSwap(
  sourceImageDataUrl: string,
  targetImageUrl: string,
  replicateToken: string
): Promise<string> {
  try {
    return await faceSwapOnce(sourceImageDataUrl, targetImageUrl, replicateToken);
  } catch (err) {
    const msg = (err as Error).message || '';
    if (msg.includes('timed out')) {
      console.warn('[faceSwap] first attempt timed out — retrying once');
      return await faceSwapOnce(sourceImageDataUrl, targetImageUrl, replicateToken);
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
  const rightTake = outW - leftTake;
  const out = new Uint8Array(outW * h * 4);
  for (let y = 0; y < h; y++) {
    const dstRow = y * outW * 4;
    out.set(leftData.subarray(y * leftW * 4, y * leftW * 4 + leftTake * 4), dstRow);
    const rSrc = (y * rightW + rightSkip) * 4;
    out.set(rightData.subarray(rSrc, rSrc + rightTake * 4), dstRow + leftTake * 4);
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
 */
export async function dualFaceSwap(
  leftSourceUrl: string,
  rightSourceUrl: string,
  targetImageUrl: string,
  replicateToken: string,
  supabase: any,
  userId: string
): Promise<string> {
  console.log('[dualFaceSwap] Starting crop→swap→paste pipeline');

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
  const leftUri = `data:image/jpeg;base64,${toBase64(leftJpegData)}`;
  const rightUri = `data:image/jpeg;base64,${toBase64(rightJpegData)}`;

  console.log('[dualFaceSwap] Swapping both faces in parallel...');
  const [leftSwapUrl, rightSwapUrl] = await Promise.all([
    faceSwap(leftSourceUrl, leftUri, replicateToken),
    faceSwap(rightSourceUrl, rightUri, replicateToken),
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

  console.log('[dualFaceSwap] Pipeline complete');
  return urlData.publicUrl;
}
