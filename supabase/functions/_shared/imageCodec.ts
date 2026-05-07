/**
 * Image codec helper — format-agnostic decode + webp encode.
 *
 * The face-swap pipeline historically only handled JPEG (via jpeg-js). The
 * pipeline-webp migration (2026-05-06) moves Replicate Flux output from
 * forced JPEG to default WebP for source-quality + storage savings. The
 * face-swap pipeline must therefore decode whichever format Replicate
 * returns. This helper detects format from magic bytes and dispatches.
 *
 * Decode supports: JPEG, WebP, PNG.
 * Encode is webp-only (used by face-swap output, perturb, intermediate halves).
 *
 * Backed by:
 *   - jpeg-js (already in tree)
 *   - @jsquash/webp via esm.sh (WASM-based, Deno-compatible)
 *   - upng-js for PNG (lazy-loaded only if a PNG is encountered, which is
 *     rare — Replicate occasionally returns PNG for safety-redacted outputs).
 */

import { decode as decodeJpeg, encode as encodeJpegLib } from 'https://esm.sh/jpeg-js@0.4.4';
import decodeWebpLib from 'https://esm.sh/@jsquash/webp@1.4.0/decode';
import encodeWebpLib from 'https://esm.sh/@jsquash/webp@1.4.0/encode';

export interface DecodedImage {
  data: Uint8Array; // RGBA bytes, length = width * height * 4
  width: number;
  height: number;
}

export type ImageFormat = 'jpeg' | 'webp' | 'png' | 'unknown';

export function detectImageFormat(buf: ArrayBuffer | Uint8Array): ImageFormat {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  if (bytes.length < 12) return 'unknown';
  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'jpeg';
  // PNG: 89 50 4E 47
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47)
    return 'png';
  // WebP: "RIFF" at 0..3, "WEBP" at 8..11
  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  )
    return 'webp';
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
    const decoded = decodeJpeg(new Uint8Array(ab), { useTArray: true });
    return {
      data: decoded.data as Uint8Array,
      width: decoded.width,
      height: decoded.height,
    };
  }

  if (fmt === 'webp') {
    // @jsquash/webp returns ImageData with Uint8ClampedArray RGBA
    const imageData = await decodeWebpLib(new Uint8Array(ab) as Uint8Array<ArrayBuffer>);
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
    // returns JPEG/WebP for our flows; PNG only appears for safety redaction).
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

  throw new Error(`Unsupported image format (magic bytes did not match jpeg/webp/png)`);
}

/**
 * Encode RGBA pixel data as WebP. Quality 0-100; 90-95 ≈ near-lossless for
 * AI-rendered photographic content. Returns Uint8Array of WebP bytes.
 *
 * Used by faceSwap.ts for: perturbed source, L/R intermediate halves sent
 * to Replicate's swap model, and the final stitched output.
 */
export async function encodeWebp(
  image: { data: Uint8Array; width: number; height: number },
  quality = 95
): Promise<Uint8Array> {
  // @jsquash/webp expects ImageData-shaped input. Deno's strict ImageData
  // typing also requires `pixelFormat`, but jsquash doesn't read it — pass
  // a plain shape and cast through unknown to satisfy the strict type.
  const imageData = {
    data: new Uint8ClampedArray(image.data.buffer, image.data.byteOffset, image.data.byteLength),
    width: image.width,
    height: image.height,
    colorSpace: 'srgb' as const,
  };
  const ab = await encodeWebpLib(imageData as unknown as ImageData, { quality });
  return new Uint8Array(ab);
}

/**
 * Re-export jpeg-js encoder for callsites that intentionally want JPEG (rare
 * after the webp migration — kept for safety / fallback purposes).
 */
export function encodeJpeg(
  image: { data: Uint8Array; width: number; height: number },
  quality = 95
): { data: Uint8Array } {
  return encodeJpegLib(image, quality);
}
