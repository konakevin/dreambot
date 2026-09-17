/**
 * hashes.ts — the two hashes nightly uses for duplicate detection, ported verbatim from
 * supabase/functions/_shared/persistence.ts so the values are IDENTICAL to what the isolate computed
 * (a render persisted here must dedup against renders persisted there). A parity test in the main repo
 * fails CI if either implementation drifts.
 */
import type { DecodedImage } from './imageCodec.ts';

/** SHA-256 of the raw bytes, hex-encoded — exact-duplicate detection. */
export async function sha256Hex(buf: ArrayBuffer | Uint8Array): Promise<string> {
  const view = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  // A fresh, plainly-backed copy: newer TypeScript types a Uint8Array over an ArrayBufferLike (possibly
  // shared) and refuses it as BufferSource; the copy is typed Uint8Array<ArrayBuffer> and is what
  // digest() wants. A few MB at most, once per render — cheap here, and this never runs in an isolate.
  const copy = new Uint8Array(view.byteLength);
  copy.set(view);
  const hash = await crypto.subtle.digest('SHA-256', copy);
  const arr = new Uint8Array(hash);
  let hex = '';
  for (let i = 0; i < arr.length; i++) hex += arr[i].toString(16).padStart(2, '0');
  return hex;
}

/**
 * 8×8 average-hash of the decoded RGBA, 16 hex chars — near-duplicate detection (same scene, different
 * JPEG bytes). Must stay byte-for-byte the algorithm in persistence.ts:aHashFromDecoded.
 */
export function aHashFromDecoded(decoded: DecodedImage): string {
  const data = decoded.data;
  const w = decoded.width;
  const h = decoded.height;
  const N = 8;
  const small = new Uint8Array(N * N);
  for (let y = 0; y < N; y++) {
    const sy = Math.floor((y * h) / N);
    for (let x = 0; x < N; x++) {
      const sx = Math.floor((x * w) / N);
      const off = (sy * w + sx) * 4;
      small[y * N + x] = Math.round(
        0.299 * data[off] + 0.587 * data[off + 1] + 0.114 * data[off + 2]
      );
    }
  }
  let total = 0;
  for (let i = 0; i < N * N; i++) total += small[i];
  const avg = total / (N * N);
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
