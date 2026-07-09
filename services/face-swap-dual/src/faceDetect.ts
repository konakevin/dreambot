/**
 * In-process face detection for the dual face-swap engine — YuNet (ONNX) run via
 * onnxruntime-web (WASM) inside the Fly Deno machine. NO Replicate call, NO cold
 * start (the model loads once at boot; the machine is kept warm), NO new external
 * dependency. Pure decode/NMS/split math lives in `faceDetectMath.ts` (unit-tested).
 *
 * Validated 2026-06-16: detects both faces (0.9+ score) on the stylized
 * gpt-image-2 / pencil couple renders that the prior Haiku face-count collapsed
 * to 1 — the bug that dropped the partner / pasted both faces on one person.
 *
 * Fallback-safe: callers treat ANY throw here (model load / inference error) as
 * "detection unavailable" and fall back to the legacy fixed-crop path, so the new
 * path can never be worse than before.
 */

import * as ort from 'https://esm.sh/onnxruntime-web@1.20.1';
import {
  decodeYuNet,
  nms,
  scaleBoxes,
  resizeRGBA,
  planDualSplit,
  YUNET_INPUT,
  YUNET_STRIDES,
  type FaceBox,
  type YuNetHeads,
  type DualSplit,
} from './faceDetectMath.ts';

export type { FaceBox, DualSplit };

// onnxruntime-web fetches its .wasm at runtime. Default to a pinned jsDelivr
// build; override with DUAL_SWAP_ORT_WASM_PATH to a vendored local dir for a
// fully self-contained image (no runtime CDN). numThreads=1 → single-CPU Fly.
ort.env.wasm.numThreads = 1;
// Run the WASM on the main thread — no proxy worker. Best on the single-CPU Fly
// machine (no worker spawn/message-port overhead) and avoids a dangling worker.
ort.env.wasm.proxy = false;
ort.env.wasm.wasmPaths =
  (globalThis as { Deno?: { env: { get(k: string): string | undefined } } }).Deno?.env.get(
    'DUAL_SWAP_ORT_WASM_PATH'
  ) ?? 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.20.1/dist/';

let sessionPromise: Promise<ort.InferenceSession> | null = null;

/** Lazily load + cache the YuNet session (once per machine lifetime). */
export function loadDetector(
  modelUrl: URL = new URL('./yunet.onnx', import.meta.url)
): Promise<ort.InferenceSession> {
  if (!sessionPromise) {
    sessionPromise = (async () => {
      const bytes = await Deno.readFile(modelUrl);
      return ort.InferenceSession.create(bytes, { executionProviders: ['wasm'] });
    })().catch((e) => {
      sessionPromise = null; // allow retry on a transient load failure
      throw e;
    });
  }
  return sessionPromise;
}

/**
 * Detect faces in an RGBA image. Returns boxes in ORIGINAL-image pixel space,
 * sorted by descending score. Empty array = no faces found (not an error).
 */
export async function detectFaces(
  rgba: Uint8Array,
  W: number,
  H: number,
  opts: { scoreThreshold?: number; iouThreshold?: number; modelUrl?: URL } = {}
): Promise<FaceBox[]> {
  const session = await loadDetector(opts.modelUrl);
  const resized = resizeRGBA(rgba, W, H, YUNET_INPUT, YUNET_INPUT);
  // YuNet wants BGR, NCHW, raw 0-255 float (no normalization).
  const data = new Float32Array(3 * YUNET_INPUT * YUNET_INPUT);
  const plane = YUNET_INPUT * YUNET_INPUT;
  for (let i = 0; i < plane; i++) {
    data[i] = resized[i * 4 + 2]; // B
    data[plane + i] = resized[i * 4 + 1]; // G
    data[2 * plane + i] = resized[i * 4]; // R
  }
  const out = await session.run({
    input: new ort.Tensor('float32', data, [1, 3, YUNET_INPUT, YUNET_INPUT]),
  });
  const heads: Record<number, YuNetHeads> = {};
  for (const s of YUNET_STRIDES) {
    heads[s] = {
      cls: out['cls_' + s].data as Float32Array,
      obj: out['obj_' + s].data as Float32Array,
      bbox: out['bbox_' + s].data as Float32Array,
      // Landmarks feed ArcFace alignment (Stage 8); absent on older exports.
      kps: out['kps_' + s] ? (out['kps_' + s].data as Float32Array) : undefined,
    };
  }
  const decoded = decodeYuNet(heads, opts.scoreThreshold ?? 0.6);
  const kept = nms(decoded, opts.iouThreshold ?? 0.3);
  return scaleBoxes(kept, W, H).sort((a, b) => b.score - a.score);
}

// ───────────────────── gender (InsightFace genderage) ─────────────────────
// In-process gender per face (so a mixed couple's male/female sources land on
// the correct body). genderage.onnx takes a 96×96 RGB face crop → [female,male,
// age]. Validated 2026-06-16: strong, correct gender on the stylized renders
// (a rough square crop is enough — no precise landmark alignment needed).

let genderSessionPromise: Promise<ort.InferenceSession> | null = null;
function loadGenderAge(modelUrl: URL): Promise<ort.InferenceSession> {
  if (!genderSessionPromise) {
    genderSessionPromise = (async () => {
      const bytes = await Deno.readFile(modelUrl);
      return ort.InferenceSession.create(bytes, { executionProviders: ['wasm'] });
    })().catch((e) => {
      genderSessionPromise = null;
      throw e;
    });
  }
  return genderSessionPromise;
}

export async function classifyFaceGender(
  rgba: Uint8Array,
  W: number,
  H: number,
  box: FaceBox,
  modelUrl: URL = new URL('./genderage.onnx', import.meta.url)
): Promise<'male' | 'female'> {
  const ga = await loadGenderAge(modelUrl);
  // square crop around the face (+15% margin), clamped to the image
  const s = Math.min(W, H, Math.round(Math.max(box.w, box.h) * 1.15));
  let x = Math.round(box.x + box.w / 2 - s / 2);
  let y = Math.round(box.y + box.h / 2 - s / 2);
  x = Math.max(0, Math.min(W - s, x));
  y = Math.max(0, Math.min(H - s, y));
  const crop = new Uint8Array(s * s * 4);
  for (let r = 0; r < s; r++) {
    const sy = Math.min(H - 1, y + r);
    crop.set(rgba.subarray((sy * W + x) * 4, (sy * W + x + s) * 4), r * s * 4);
  }
  const r96 = resizeRGBA(crop, s, s, 96, 96);
  const t = new Float32Array(3 * 96 * 96);
  const p = 96 * 96;
  for (let i = 0; i < p; i++) {
    t[i] = r96[i * 4]; // R
    t[p + i] = r96[i * 4 + 1]; // G
    t[2 * p + i] = r96[i * 4 + 2]; // B
  }
  const out = await ga.run({ data: new ort.Tensor('float32', t, [1, 3, 96, 96]) });
  const v = out['fc1'].data as Float32Array; // [female_logit, male_logit, age/100]
  return v[1] > v[0] ? 'male' : 'female';
}

export interface GenderedFace extends FaceBox {
  gender: 'male' | 'female';
}

/** Detect faces + classify each one's gender (in-process). */
export async function detectFacesWithGender(
  rgba: Uint8Array,
  W: number,
  H: number,
  opts?: { scoreThreshold?: number; iouThreshold?: number }
): Promise<GenderedFace[]> {
  const faces = await detectFaces(rgba, W, H, opts);
  const out: GenderedFace[] = [];
  for (const f of faces) out.push({ ...f, gender: await classifyFaceGender(rgba, W, H, f) });
  return out;
}

/** Convenience: detect + compute the dual-split plan in one call. */
export async function detectAndPlanSplit(
  rgba: Uint8Array,
  W: number,
  H: number,
  opts?: { scoreThreshold?: number; minGapFrac?: number; overlapFrac?: number; modelUrl?: URL }
): Promise<{ faces: FaceBox[]; split: DualSplit }> {
  const faces = await detectFaces(rgba, W, H, opts);
  return { faces, split: planDualSplit(faces, W, opts) };
}
