/**
 * ArcFace identity embeddings — "did the swapped face actually take?"
 *
 * Stage 8 (FACE_SWAP_UPGRADE_PLAN.md, 2026-07-08). The engine has always
 * reported mechanical success (an image came back); the action depth QA's
 * owner review found renders where a swapped face carried none of the cast
 * member's identity. This module measures identity: align each face to the
 * ArcFace 112×112 template via its YuNet 5-point landmarks (umeyama
 * similarity transform), embed with InsightFace MobileFaceNet
 * (w600k_mbf.onnx, 512-d), and cosine-compare against the cast source.
 *
 * Pure-math pieces (umeyama, warp) are exported for unit tests.
 */

import * as ort from 'https://esm.sh/onnxruntime-web@1.20.1';
import type { FaceBox } from './faceDetectMath.ts';

// Canonical ArcFace 112×112 destination landmarks (right eye, left eye, nose,
// right mouth corner, left mouth corner) — the standard InsightFace template.
export const ARCFACE_TEMPLATE_112: readonly number[] = [
  38.2946, 51.6963, 73.5318, 51.5014, 56.0252, 71.7366, 41.5493, 92.3655, 70.7299, 92.2041,
];

export const EMBED_INPUT = 112;

let embedSessionPromise: Promise<ort.InferenceSession> | null = null;
function loadEmbedder(
  modelUrl: URL = new URL('./w600k_mbf.onnx', import.meta.url)
): Promise<ort.InferenceSession> {
  if (!embedSessionPromise) {
    embedSessionPromise = (async () => {
      const bytes = await (await fetch(modelUrl)).arrayBuffer();
      return ort.InferenceSession.create(new Uint8Array(bytes), {
        executionProviders: ['wasm'],
      });
    })().catch((e) => {
      embedSessionPromise = null; // allow retry on transient load failure
      throw e;
    });
  }
  return embedSessionPromise;
}

/**
 * Umeyama similarity transform (rotation + uniform scale + translation) mapping
 * src 5-point landmarks onto dst. Returns [a, b, tx, ty] for
 *   x' = a·x − b·y + tx
 *   y' = b·x + a·y + ty
 * (least-squares over the point pairs; the standard face-alignment estimator).
 */
export function similarityTransform(src: readonly number[], dst: readonly number[]): number[] {
  const n = src.length / 2;
  let sx = 0,
    sy = 0,
    dx = 0,
    dy = 0;
  for (let i = 0; i < n; i++) {
    sx += src[i * 2];
    sy += src[i * 2 + 1];
    dx += dst[i * 2];
    dy += dst[i * 2 + 1];
  }
  sx /= n;
  sy /= n;
  dx /= n;
  dy /= n;

  // Accumulate cross-covariance terms of the centered pairs.
  let a = 0,
    b = 0,
    norm = 0;
  for (let i = 0; i < n; i++) {
    const xs = src[i * 2] - sx;
    const ys = src[i * 2 + 1] - sy;
    const xd = dst[i * 2] - dx;
    const yd = dst[i * 2 + 1] - dy;
    a += xs * xd + ys * yd;
    b += xs * yd - ys * xd;
    norm += xs * xs + ys * ys;
  }
  if (norm === 0) return [1, 0, dx - sx, dy - sy];
  a /= norm;
  b /= norm;
  const tx = dx - (a * sx - b * sy);
  const ty = dy - (b * sx + a * sy);
  return [a, b, tx, ty];
}

/**
 * Warp an RGBA image through the INVERSE of the similarity transform into a
 * 112×112 RGBA crop (bilinear sampling; out-of-bounds → black). `t` maps
 * source→template, so each destination pixel pulls from t⁻¹(dest).
 */
export function warpToTemplate(
  rgba: Uint8Array,
  W: number,
  H: number,
  t: readonly number[],
  size = EMBED_INPUT
): Uint8Array {
  const [a, b, tx, ty] = t;
  const det = a * a + b * b;
  // Inverse of [[a,-b],[b,a]] is [[a,b],[-b,a]]/det.
  const ia = a / det;
  const ib = b / det;
  const out = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const rx = x - tx;
      const ry = y - ty;
      const sxf = ia * rx + ib * ry;
      const syf = -ib * rx + ia * ry;
      const o = (y * size + x) * 4;
      if (sxf < 0 || syf < 0 || sxf > W - 1 || syf > H - 1) {
        out[o + 3] = 255;
        continue;
      }
      const x0 = Math.floor(sxf);
      const y0 = Math.floor(syf);
      const x1 = Math.min(x0 + 1, W - 1);
      const y1 = Math.min(y0 + 1, H - 1);
      const fx = sxf - x0;
      const fy = syf - y0;
      for (let ch = 0; ch < 3; ch++) {
        const p00 = rgba[(y0 * W + x0) * 4 + ch];
        const p10 = rgba[(y0 * W + x1) * 4 + ch];
        const p01 = rgba[(y1 * W + x0) * 4 + ch];
        const p11 = rgba[(y1 * W + x1) * 4 + ch];
        out[o + ch] =
          p00 * (1 - fx) * (1 - fy) + p10 * fx * (1 - fy) + p01 * (1 - fx) * fy + p11 * fx * fy;
      }
      out[o + 3] = 255;
    }
  }
  return out;
}

/** L2-normalize in place; returns the same array. */
export function l2normalize(v: Float32Array): Float32Array {
  let s = 0;
  for (let i = 0; i < v.length; i++) s += v[i] * v[i];
  const inv = s > 0 ? 1 / Math.sqrt(s) : 0;
  for (let i = 0; i < v.length; i++) v[i] *= inv;
  return v;
}

/** Cosine similarity of two L2-normalized embeddings. */
export function cosine(a: Float32Array, b: Float32Array): number {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
}

/**
 * Embed one detected face. Requires landmarks (returns null without them —
 * unaligned crops produce garbage similarities, worse than no signal).
 * Input convention: RGB, (x − 127.5) / 127.5 (InsightFace swapRB blob).
 */
export async function embedFace(
  rgba: Uint8Array,
  W: number,
  H: number,
  face: FaceBox
): Promise<Float32Array | null> {
  if (!face.kps || face.kps.length !== 10) return null;
  const session = await loadEmbedder();
  const t = similarityTransform(face.kps, ARCFACE_TEMPLATE_112);
  const crop = warpToTemplate(rgba, W, H, t);
  const plane = EMBED_INPUT * EMBED_INPUT;
  const data = new Float32Array(3 * plane);
  for (let i = 0; i < plane; i++) {
    data[i] = (crop[i * 4] - 127.5) / 127.5; // R
    data[plane + i] = (crop[i * 4 + 1] - 127.5) / 127.5; // G
    data[2 * plane + i] = (crop[i * 4 + 2] - 127.5) / 127.5; // B
  }
  const out = await session.run({
    [session.inputNames[0]]: new ort.Tensor('float32', data, [1, 3, EMBED_INPUT, EMBED_INPUT]),
  });
  return l2normalize(new Float32Array(out[session.outputNames[0]].data as Float32Array));
}

// ───────────────────── identity verification helpers ─────────────────────

import { decodeImage } from './imageCodec.ts';
import { detectFaces } from './faceDetect.ts';

async function fetchRGBA(url: string) {
  const res = await fetch(url, { signal: AbortSignal.timeout(15_000) });
  if (!res.ok) throw new Error(`identity fetch ${res.status}`);
  const img = await decodeImage(new Uint8Array(await res.arrayBuffer()));
  return { rgba: img.data, W: img.width, H: img.height };
}

/** Embed the largest detected face in an image URL (a cast source photo). */
export async function embedReference(url: string): Promise<Float32Array | null> {
  const { rgba, W, H } = await fetchRGBA(url);
  const faces = await detectFaces(rgba, W, H);
  if (!faces.length) return null;
  const biggest = faces.reduce((a, b) => (b.w * b.h > a.w * a.h ? b : a));
  return embedFace(rgba, W, H, biggest);
}

export interface DualIdentityRead {
  /** Cosine similarity of the left/right swapped face vs its intended source
   *  (null = that face or its reference couldn't be embedded). */
  left: number | null;
  right: number | null;
  ms: number;
}

/**
 * Measure whether a dual swap actually carried each cast identity: detect the
 * two faces in the swapped image (x-order = left/right, matching the swap's
 * side assignment) and cosine-compare each against its source photo's
 * embedding. Never throws — identity verification must not break a swap.
 */
export async function verifyDualIdentity(
  swappedUrl: string,
  leftSourceUrl: string,
  rightSourceUrl: string
): Promise<DualIdentityRead | null> {
  const t0 = Date.now();
  try {
    const [{ rgba, W, H }, leftRef, rightRef] = await Promise.all([
      fetchRGBA(swappedUrl),
      embedReference(leftSourceUrl),
      embedReference(rightSourceUrl),
    ]);
    const faces = (await detectFaces(rgba, W, H)).slice(0, 2).sort((a, b) => a.x - b.x);
    const embeds = await Promise.all(faces.map((f) => embedFace(rgba, W, H, f)));
    const simOf = (e: Float32Array | null | undefined, ref: Float32Array | null) =>
      e && ref ? Math.round(cosine(e, ref) * 1000) / 1000 : null;
    return {
      left: simOf(embeds[0], leftRef),
      right: simOf(embeds[1], rightRef),
      ms: Date.now() - t0,
    };
  } catch (err) {
    console.warn(`[identity] verify failed: ${(err as Error).message}`);
    return null;
  }
}
