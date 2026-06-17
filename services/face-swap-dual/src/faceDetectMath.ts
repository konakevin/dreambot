/**
 * Pure (ONNX-free) math for in-process face detection — decode + NMS + resize.
 *
 * Kept dependency-free so it can be unit-tested with synthetic tensors (no model
 * load, no WASM). The ONNX session + preprocessing live in `faceDetect.ts`.
 *
 * Detector: YuNet (`face_detection_yunet_2023mar.onnx`, ~230 KB) — OpenCV's
 * standard lightweight face detector. Fixed 640×640 input; multi-scale heads at
 * strides 8/16/32. Validated 2026-06-16 to box both faces (0.9+ score) on the
 * stylized gpt-image-2 / pencil couple renders that Haiku face-counting collapsed
 * to 1 (the bug that dropped the partner).
 */

export interface FaceBox {
  /** Top-left x in the coordinate space the box is expressed in. */
  x: number;
  y: number;
  w: number;
  h: number;
  score: number;
}

export const YUNET_INPUT = 640;
export const YUNET_STRIDES = [8, 16, 32] as const;

/** Per-stride YuNet head outputs (flat Float32Arrays straight from onnxruntime). */
export interface YuNetHeads {
  cls: Float32Array; // [rows*cols] face confidence (post-sigmoid, 0..1)
  obj: Float32Array; // [rows*cols] objectness (post-sigmoid, 0..1)
  bbox: Float32Array; // [rows*cols*4] (dx, dy, log-w, log-h) per anchor
}

/** Intersection-over-union of two axis-aligned boxes. */
export function iou(a: FaceBox, b: FaceBox): number {
  const x1 = Math.max(a.x, b.x);
  const y1 = Math.max(a.y, b.y);
  const x2 = Math.min(a.x + a.w, b.x + b.w);
  const y2 = Math.min(a.y + a.h, b.y + b.h);
  const inter = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
  const union = a.w * a.h + b.w * b.h - inter;
  return union <= 0 ? 0 : inter / union;
}

/** Greedy non-max suppression, highest score first. */
export function nms(boxes: FaceBox[], iouThreshold = 0.3): FaceBox[] {
  const sorted = [...boxes].sort((p, q) => q.score - p.score);
  const keep: FaceBox[] = [];
  for (const b of sorted) {
    if (keep.every((k) => iou(k, b) < iouThreshold)) keep.push(b);
  }
  return keep;
}

/**
 * Decode the raw YuNet multi-scale heads into face boxes in the 640×640 INPUT
 * space (caller scales back to the original image). Standard YuNet decode:
 * score = sqrt(cls·obj); box center = (gridCol + dx, gridRow + dy)·stride; size
 * = exp(log-wh)·stride.
 */
export function decodeYuNet(
  headsByStride: Record<number, YuNetHeads>,
  scoreThreshold = 0.6,
  inputSize = YUNET_INPUT,
  strides: readonly number[] = YUNET_STRIDES
): FaceBox[] {
  const out: FaceBox[] = [];
  for (const stride of strides) {
    const heads = headsByStride[stride];
    if (!heads) continue;
    const cols = inputSize / stride;
    const rows = inputSize / stride;
    const { cls, obj, bbox } = heads;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c;
        const score = Math.sqrt(Math.max(0, cls[i]) * Math.max(0, obj[i]));
        if (score < scoreThreshold) continue;
        const cx = (c + bbox[i * 4]) * stride;
        const cy = (r + bbox[i * 4 + 1]) * stride;
        const w = Math.exp(bbox[i * 4 + 2]) * stride;
        const h = Math.exp(bbox[i * 4 + 3]) * stride;
        out.push({ x: cx - w / 2, y: cy - h / 2, w, h, score });
      }
    }
  }
  return out;
}

/** Scale boxes from `inputSize`-square space back to original WxH pixels. */
export function scaleBoxes(
  boxes: FaceBox[],
  W: number,
  H: number,
  inputSize = YUNET_INPUT
): FaceBox[] {
  const sx = W / inputSize;
  const sy = H / inputSize;
  return boxes.map((b) => ({
    x: Math.round(b.x * sx),
    y: Math.round(b.y * sy),
    w: Math.round(b.w * sx),
    h: Math.round(b.h * sy),
    score: b.score,
  }));
}

/** Bilinear resize of an RGBA buffer (used to feed the fixed 640² detector input). */
export function resizeRGBA(
  src: Uint8Array,
  sw: number,
  sh: number,
  dw: number,
  dh: number
): Uint8Array {
  const out = new Uint8Array(dw * dh * 4);
  for (let y = 0; y < dh; y++) {
    const fy = ((y + 0.5) * sh) / dh - 0.5;
    const y0 = Math.max(0, Math.floor(fy));
    const y1 = Math.min(sh - 1, y0 + 1);
    const wy = fy - y0;
    for (let x = 0; x < dw; x++) {
      const fx = ((x + 0.5) * sw) / dw - 0.5;
      const x0 = Math.max(0, Math.floor(fx));
      const x1 = Math.min(sw - 1, x0 + 1);
      const wx = fx - x0;
      for (let ch = 0; ch < 4; ch++) {
        const p00 = src[(y0 * sw + x0) * 4 + ch];
        const p01 = src[(y0 * sw + x1) * 4 + ch];
        const p10 = src[(y1 * sw + x0) * 4 + ch];
        const p11 = src[(y1 * sw + x1) * 4 + ch];
        out[(y * dw + x) * 4 + ch] =
          (p00 * (1 - wx) + p01 * wx) * (1 - wy) + (p10 * (1 - wx) + p11 * wx) * wy;
      }
    }
  }
  return out;
}

/**
 * THE LOAD-BEARING DUAL-SPLIT MATH. Given detected face boxes (original-image
 * space) and the image width, decide how to split a two-person render so each
 * half contains EXACTLY one face. Returns the split plan, or a reason the render
 * can't be cleanly split (→ caller re-renders the couple).
 *
 * - Picks the two largest boxes (foreground couple) if >2 detected.
 * - Splits at the midpoint of the GAP between the two faces.
 * - `overlap = min(OVERLAP, gap/2)` — NEVER lets a crop re-cross the other face
 *   (the fixed-55% engine's constant 10% overlap is exactly what dragged a 2nd
 *   face into both crops → both-on-one).
 */
export interface DualSplit {
  ok: boolean;
  reason: 'ok' | 'lt2_faces' | 'overlap'; // overlap = faces too close / x-overlapping
  faceCount: number;
  splitX: number; // boundary; left crop = [0, splitX+overlap], right = [splitX-overlap, W]
  overlap: number;
  leftIsFirstBox: boolean; // true if the lower-x face is boxes[0]
  leftBox?: FaceBox;
  rightBox?: FaceBox;
}

/**
 * A square crop around a face (+padding), clamped to the image — the region fed
 * to the swap model for the PER-FACE composite path (poses the vertical strip
 * can't separate: piggyback, dip, faces vertically stacked). Padding gives the
 * swap model context; centering keeps the TARGET face the most prominent one.
 */
export function faceCropBox(
  face: FaceBox,
  W: number,
  H: number,
  pad = 2.4
): { x: number; y: number; w: number; h: number } {
  const s = Math.min(W, H, Math.round(Math.max(face.w, face.h) * pad));
  let x = Math.round(face.x + face.w / 2 - s / 2);
  let y = Math.round(face.y + face.h / 2 - s / 2);
  x = Math.max(0, Math.min(W - s, x));
  y = Math.max(0, Math.min(H - s, y));
  return { x, y, w: s, h: s };
}

/**
 * Paste a swapped face crop back onto the base image, MASKED to the face region
 * with a feathered border. Only the area around THIS face is affected, so two
 * overlapping per-face crops never clobber each other's swapped face — that's
 * what lets the composite handle ANY layout (stacked/close), not just
 * horizontally-separable ones. Mutates `base` in place.
 *
 * @param face the detected face box, in BASE-image coordinates
 * @param feather px over which the mask fades from full (over the face) to 0
 */
export function compositeFaceMasked(
  base: Uint8Array,
  baseW: number,
  baseH: number,
  crop: Uint8Array,
  cropX: number,
  cropY: number,
  cropW: number,
  cropH: number,
  face: FaceBox,
  feather: number
): void {
  // Full-opacity core = the face box expanded 30%; fade to 0 over `feather`.
  const ex = face.w * 0.3;
  const ey = face.h * 0.3;
  const fx0 = face.x - ex;
  const fy0 = face.y - ey;
  const fx1 = face.x + face.w + ex;
  const fy1 = face.y + face.h + ey;
  for (let y = 0; y < cropH; y++) {
    const by = cropY + y;
    if (by < 0 || by >= baseH) continue;
    for (let x = 0; x < cropW; x++) {
      const bx = cropX + x;
      if (bx < 0 || bx >= baseW) continue;
      const dx = Math.max(0, fx0 - bx, bx - fx1);
      const dy = Math.max(0, fy0 - by, by - fy1);
      const d = Math.max(dx, dy);
      const a = d <= 0 ? 1 : d >= feather ? 0 : 1 - d / feather;
      if (a <= 0) continue;
      const bi = (by * baseW + bx) * 4;
      const ci = (y * cropW + x) * 4;
      base[bi] = Math.round(base[bi] * (1 - a) + crop[ci] * a);
      base[bi + 1] = Math.round(base[bi + 1] * (1 - a) + crop[ci + 1] * a);
      base[bi + 2] = Math.round(base[bi + 2] * (1 - a) + crop[ci + 2] * a);
    }
  }
}

export function planDualSplit(
  boxes: FaceBox[],
  W: number,
  opts: { minGapFrac?: number; overlapFrac?: number } = {}
): DualSplit {
  // minGap == overlapFrac so a clean split always affords an overlap ≥ the
  // stitch blend half-width (≈2% of W) — narrower gaps read as 'overlap' → re-render.
  const minGap = (opts.minGapFrac ?? 0.04) * W;
  const overlapMax = (opts.overlapFrac ?? 0.04) * W;
  if (boxes.length < 2) {
    return {
      ok: false,
      reason: 'lt2_faces',
      faceCount: boxes.length,
      splitX: 0,
      overlap: 0,
      leftIsFirstBox: true,
    };
  }
  // two largest by area, then order by x
  const [a, b] = [...boxes].sort((p, q) => q.w * q.h - p.w * p.h).slice(0, 2);
  const faceL = a.x <= b.x ? a : b;
  const faceR = a.x <= b.x ? b : a;
  const gap = faceR.x - (faceL.x + faceL.w);
  if (gap < minGap) {
    return {
      ok: false,
      reason: 'overlap',
      faceCount: boxes.length,
      splitX: 0,
      overlap: 0,
      leftIsFirstBox: true,
      leftBox: faceL,
      rightBox: faceR,
    };
  }
  const splitX = Math.round(faceL.x + faceL.w + gap / 2);
  const overlap = Math.round(Math.min(overlapMax, gap / 2));
  return {
    ok: true,
    reason: 'ok',
    faceCount: boxes.length,
    splitX,
    overlap,
    leftIsFirstBox: faceL === a,
    leftBox: faceL,
    rightBox: faceR,
  };
}
