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
 * Upload an already-fetched ArrayBuffer to Supabase Storage. Used by
 * nightly-dreams which needs to fetch + hash the bytes for duplicate
 * detection before persisting — same bytes, single fetch.
 */
export async function persistBufferToStorage(
  buf: ArrayBuffer,
  userId: string,
  supabase: SupabaseClient
): Promise<string> {
  const bytes = new Uint8Array(buf.slice(0, 4));
  const isPng = bytes[0] === 0x89 && bytes[1] === 0x50;
  const ext = isPng ? 'png' : 'jpg';
  const contentType = isPng ? 'image/png' : 'image/jpeg';

  const fileName = `${userId}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from('uploads').upload(fileName, buf, { contentType });
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
import { decode as decodeJpeg } from 'https://esm.sh/jpeg-js@0.4.4';

export function aHashHex(buf: ArrayBuffer): string {
  const decoded = decodeJpeg(new Uint8Array(buf), { useTArray: true });
  const data = decoded.data as Uint8Array;
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
