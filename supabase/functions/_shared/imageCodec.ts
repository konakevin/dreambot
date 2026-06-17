/**
 * Image codec helper — JPEG decode + encode.
 *
 * Pre-alpha: WebP support fully removed 2026-05-09. The pipeline produces
 * JPEG end-to-end. PNG is kept as a decode-only fallback because Replicate
 * occasionally returns PNG for safety-redacted outputs.
 *
 * Backed by:
 *   - @jsquash/jpeg via esm.sh (WASM-based, decode + encode, ~6x faster
 *     than pure-JS jpeg-js — critical for keeping the dual-face-swap
 *     pipeline under Supabase's 2 s per-invocation CPU budget)
 *   - upng-js for PNG (lazy-loaded — rare, safety-redaction edge case)
 */

import decodeJpegLib from 'https://esm.sh/@jsquash/jpeg@1.5.0/decode';
import encodeJpegLib from 'https://esm.sh/@jsquash/jpeg@1.5.0/encode';

export interface DecodedImage {
  data: Uint8Array; // RGBA bytes, length = width * height * 4
  width: number;
  height: number;
}

export type ImageFormat = 'jpeg' | 'png' | 'unknown';

export function detectImageFormat(buf: ArrayBuffer | Uint8Array): ImageFormat {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  if (bytes.length < 4) return 'unknown';
  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'jpeg';
  // PNG: 89 50 4E 47
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47)
    return 'png';
  return 'unknown';
}

export async function decodeImage(buf: ArrayBuffer | Uint8Array): Promise<DecodedImage> {
  // Normalize to a plain ArrayBuffer (Deno's strict typings reject the
  // implicit `ArrayBuffer | SharedArrayBuffer` union from `.buffer.slice()`).
  // We never use SharedArrayBuffer at runtime, so the cast is sound.
  const ab = (
    buf instanceof Uint8Array
      ? buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)
      : buf
  ) as ArrayBuffer;
  const fmt = detectImageFormat(ab);

  if (fmt === 'jpeg') {
    // @jsquash/jpeg returns ImageData (Uint8ClampedArray RGBA).
    const imageData = await decodeJpegLib(ab);
    return {
      data: new Uint8Array(
        imageData.data.buffer,
        imageData.data.byteOffset,
        imageData.data.byteLength
      ),
      width: imageData.width,
      height: imageData.height,
    };
  }

  if (fmt === 'png') {
    // PNG path — lazy-load upng since it's rarely needed (Replicate normally
    // returns JPEG; PNG only appears for safety redaction).
    const upngMod = await import('https://esm.sh/upng-js@2.1.0');
    const upng = (upngMod as { default?: unknown }).default ?? upngMod;
    interface UPNG {
      decode: (b: ArrayBuffer) => { width: number; height: number };
      toRGBA8: (img: { width: number; height: number }) => ArrayBuffer[];
    }
    const u = upng as UPNG;
    const img = u.decode(ab);
    const rgba = u.toRGBA8(img)[0];
    return {
      data: new Uint8Array(rgba),
      width: img.width,
      height: img.height,
    };
  }

  throw new Error(`Unsupported image format (magic bytes did not match jpeg/png)`);
}

/**
 * Encode RGBA pixel data as JPEG. Quality 0-100; 92-95 ≈ near-lossless for
 * AI-rendered photographic content. Returns Uint8Array of JPEG bytes.
 *
 * Used by faceSwap.ts for: perturbed source, L/R intermediate halves sent
 * to Replicate's swap model, and the final stitched output.
 */
export async function encodeJpeg(
  image: { data: Uint8Array; width: number; height: number },
  quality = 95
): Promise<Uint8Array> {
  // @jsquash/jpeg expects ImageData-shaped input.
  const imageData = {
    data: new Uint8ClampedArray(image.data.buffer, image.data.byteOffset, image.data.byteLength),
    width: image.width,
    height: image.height,
    colorSpace: 'srgb' as const,
  };
  // Accepted boundary: `imageData` is a structural ImageData, but the DOM
  // `ImageData` lib type isn't available in the Deno edge runtime, so we cast to
  // satisfy @jsquash's param type. Shape is correct (data/width/height/colorSpace).
  const ab = await encodeJpegLib(imageData as unknown as ImageData, { quality });
  return new Uint8Array(ab);
}
