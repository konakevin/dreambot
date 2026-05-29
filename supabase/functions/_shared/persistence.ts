/**
 * Storage persistence — downloads the Replicate temp URL + uploads to
 * Supabase Storage, returning the permanent public URL. Used by all three
 * pipelines.
 *
 * Detects PNG vs JPEG from magic bytes so the content-type matches.
 */

import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';

export async function persistToStorage(
  tempUrl: string,
  userId: string,
  supabase: SupabaseClient
): Promise<string> {
  const resp = await fetch(tempUrl);
  if (!resp.ok) throw new Error(`Failed to download image: ${resp.status}`);
  const buf = await resp.arrayBuffer();
  return persistBufferToStorage(buf, userId, supabase);
}

/**
 * Build + persist a small JPEG "display variant" of an already-persisted image
 * and return its public URL. The feed serves this (~150KB) while image_url stays
 * the full-quality original (the upscale source — HD downloads unchanged). q80
 * re-encode at native dimensions (the win is quality, not resolution). BEST-
 * EFFORT: returns null on any failure (timeout / decode / upload) so the caller
 * simply falls back to serving image_url — this never blocks or fails a render.
 */
export async function buildDisplayVariant(
  imageUrl: string,
  userId: string,
  supabase: SupabaseClient
): Promise<string | null> {
  try {
    const res = await fetch(imageUrl);
    if (!res.ok) return null;
    const decoded = await decodeImage(await res.arrayBuffer());
    const jpeg = await encodeJpeg(decoded, 80);
    const key = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.display.jpg`;
    const { error } = await supabase.storage
      .from('uploads')
      .upload(key, jpeg, { contentType: 'image/jpeg', cacheControl: '2592000' });
    if (error) return null;
    return supabase.storage.from('uploads').getPublicUrl(key).data.publicUrl;
  } catch (_e) {
    return null;
  }
}

/**
 * Upload an already-fetched ArrayBuffer to Supabase Storage. Used by
 * nightly-dreams which needs to fetch + hash the bytes for duplicate
 * detection before persisting — same bytes, single fetch.
 */
export async function persistBufferToStorage(
  buf: ArrayBuffer,
  userId: string,
  supabase: SupabaseClient,
  objectKey?: string
): Promise<string> {
  // We force JPEG output across the pipeline (2026-05-09 revert from WebP).
  // PNG detection kept because Replicate occasionally returns PNG for
  // safety-redacted outputs, and we shouldn't repaint those as JPEG.
  const head = new Uint8Array(buf.slice(0, 4));
  const isPng = head[0] === 0x89 && head[1] === 0x50;
  const ext = isPng ? 'png' : 'jpg';
  const contentType = isPng ? 'image/png' : 'image/jpeg';

  // A caller-supplied deterministic key (e.g. the HQ cache path
  // `${userId}/hq/${uploadId}.png`) makes the write IDEMPOTENT: any re-run for
  // the same upload (stale-reclaim / failed-retry of an on-demand upscale)
  // OVERWRITES the single object instead of orphaning a new timestamped copy —
  // exactly one cached object per source image. The default (no key) keeps the
  // unique per-call name for original renders, which are genuinely distinct.
  const fileName = objectKey ?? `${userId}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from('uploads').upload(fileName, buf, {
    contentType,
    cacheControl: '2592000',
    upsert: objectKey !== undefined,
  });
  if (error) throw new Error(`Storage upload failed: ${error.message}`);

  const { data } = supabase.storage.from('uploads').getPublicUrl(fileName);
  return data.publicUrl;
}

/**
 * SHA-256 of an ArrayBuffer, hex-encoded. Used for duplicate detection
 * on face-swap outputs (yan-ops cache leak workaround).
 */
export async function sha256Hex(buf: ArrayBuffer): Promise<string> {
  const hash = await crypto.subtle.digest('SHA-256', buf);
  const arr = new Uint8Array(hash);
  let hex = '';
  for (let i = 0; i < arr.length; i++) hex += arr[i].toString(16).padStart(2, '0');
  return hex;
}

/**
 * Average-hash perceptual fingerprint for a JPEG. 64-bit signature stored
 * as 16-char hex. Two visually-identical images hash to the same value
 * (or within Hamming distance 1-2). Different scenes hash to distance 20+.
 *
 * Used to detect yan-ops/face_swap canned-output bug — bytes differ
 * (different JPEG re-encoding) but pixels match, defeating SHA-256.
 *
 * Algorithm:
 *   1. Decode JPEG
 *   2. Downsample to 8x8 grayscale (nearest neighbor)
 *   3. Compute average pixel value
 *   4. Each pixel: 1 if >= average, 0 otherwise
 *   5. Pack 64 bits into 16-char hex
 */
import { decodeImage, encodeJpeg } from './imageCodec.ts';

export async function aHashHex(buf: ArrayBuffer): Promise<string> {
  const decoded = await decodeImage(new Uint8Array(buf));
  const data = decoded.data;
  const w = decoded.width;
  const h = decoded.height;
  const N = 8;
  const small = new Uint8Array(N * N);
  // Downsample with simple nearest-neighbor + grayscale luminance
  for (let y = 0; y < N; y++) {
    const sy = Math.floor((y * h) / N);
    for (let x = 0; x < N; x++) {
      const sx = Math.floor((x * w) / N);
      const off = (sy * w + sx) * 4;
      // Rec. 601 luma
      small[y * N + x] = Math.round(
        0.299 * data[off] + 0.587 * data[off + 1] + 0.114 * data[off + 2]
      );
    }
  }
  // Average
  let total = 0;
  for (let i = 0; i < N * N; i++) total += small[i];
  const avg = total / (N * N);
  // 64-bit fingerprint
  let hi = 0;
  let lo = 0;
  for (let i = 0; i < 64; i++) {
    if (small[i] >= avg) {
      if (i < 32) hi |= 1 << i;
      else lo |= 1 << (i - 32);
    }
  }
  return (hi >>> 0).toString(16).padStart(8, '0') + (lo >>> 0).toString(16).padStart(8, '0');
}

/**
 * Hamming distance between two aHash hex strings. <=6 = visually identical.
 */
export function hammingDistance(a: string, b: string): number {
  if (a.length !== 16 || b.length !== 16) return 64;
  const aHi = parseInt(a.slice(0, 8), 16);
  const aLo = parseInt(a.slice(8, 16), 16);
  const bHi = parseInt(b.slice(0, 8), 16);
  const bLo = parseInt(b.slice(8, 16), 16);
  return popcount(aHi ^ bHi) + popcount(aLo ^ bLo);
}

function popcount(x: number): number {
  x = x - ((x >>> 1) & 0x55555555);
  x = (x & 0x33333333) + ((x >>> 2) & 0x33333333);
  x = (x + (x >>> 4)) & 0x0f0f0f0f;
  return ((x * 0x01010101) >>> 24) & 0x3f;
}
