/**
 * Thumbhash generator — produces a tiny ~25-byte hash that decodes to a
 * recognizable blurry preview of the source image. Used as the
 * `placeholder` prop on expo-image so the user sees a sharp instant
 * preview while the full display variant loads, instead of a black or
 * surface-tinted void.
 *
 * Why thumbhash (not blurhash):
 *   • Sharper, more recognizable preview at the same payload size
 *   • Bundled aspect ratio (single value carries shape)
 *   • Better expo-image support (the placeholder prop accepts thumbhash
 *     directly)
 *
 * The library wants ≤100×100 RGBA input. We feed it the already-decoded
 * DecodedImage from imageCodec.ts (callers always have one in hand
 * because buildDisplayVariant decodes the source anyway), nearest-
 * neighbor downsample to a 100-fit box, then call rgbaToThumbHash and
 * base64-encode the resulting ~25 bytes for DB storage.
 *
 * BEST-EFFORT: returns null on any failure (downscale, hash, encode).
 * Callers persist the upload row with thumbhash=null in that case; the
 * client falls back to the surface-tinted placeholder.
 */

import { rgbaToThumbHash } from 'https://esm.sh/thumbhash@0.1.1';
import type { DecodedImage } from './imageCodec.ts';

const MAX_DIM = 100; // thumbhash spec wants ≤100×100 input

/** Nearest-neighbor downsample RGBA to fit within a 100×100 box, preserving
 *  aspect ratio. Cheap (no JS bridge across), preserves the source's
 *  proportions so the decoded preview's aspect ratio matches the real
 *  image. */
function downsampleRgba(src: DecodedImage): {
  data: Uint8Array;
  width: number;
  height: number;
} {
  const ratio = Math.min(MAX_DIM / src.width, MAX_DIM / src.height, 1);
  const w = Math.max(1, Math.round(src.width * ratio));
  const h = Math.max(1, Math.round(src.height * ratio));
  if (w === src.width && h === src.height) {
    // Already within bounds — pass through (avoid the loop).
    return { data: src.data, width: w, height: h };
  }
  const out = new Uint8Array(w * h * 4);
  for (let y = 0; y < h; y++) {
    const sy = Math.floor((y * src.height) / h);
    const srcRowOff = sy * src.width * 4;
    const dstRowOff = y * w * 4;
    for (let x = 0; x < w; x++) {
      const sx = Math.floor((x * src.width) / w);
      const srcOff = srcRowOff + sx * 4;
      const dstOff = dstRowOff + x * 4;
      out[dstOff] = src.data[srcOff];
      out[dstOff + 1] = src.data[srcOff + 1];
      out[dstOff + 2] = src.data[srcOff + 2];
      out[dstOff + 3] = src.data[srcOff + 3];
    }
  }
  return { data: out, width: w, height: h };
}

/** Base64-encode a small Uint8Array (thumbhash output is ~25 bytes, well
 *  within the safe range for the spread + btoa pattern). */
function uint8ArrayToBase64(arr: Uint8Array): string {
  let bin = '';
  for (let i = 0; i < arr.length; i++) bin += String.fromCharCode(arr[i]);
  return btoa(bin);
}

/** Compute a thumbhash base64 string from a decoded RGBA image. Returns
 *  null on any failure — caller persists `thumbhash: null` and the
 *  client falls back to the surface-tinted placeholder. */
export function computeThumbhash(decoded: DecodedImage): string | null {
  try {
    const small = downsampleRgba(decoded);
    const hash = rgbaToThumbHash(small.width, small.height, small.data);
    return uint8ArrayToBase64(hash);
  } catch (_e) {
    return null;
  }
}
