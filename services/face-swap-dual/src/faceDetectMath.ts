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
  /** 5-point landmarks [x0,y0,...,x4,y4] (right eye, left eye, nose, right
   *  mouth corner, left mouth corner), same coordinate space as the box.
   *  Present when the kps heads were decoded (Stage 8 identity verify). */
  kps?: number[];
}

export const YUNET_INPUT = 640;
export const YUNET_STRIDES = [8, 16, 32] as const;

/** Per-stride YuNet head outputs (flat Float32Arrays straight from onnxruntime). */
export interface YuNetHeads {
  cls: Float32Array; // [rows*cols] face confidence (post-sigmoid, 0..1)
  obj: Float32Array; // [rows*cols] objectness (post-sigmoid, 0..1)
  bbox: Float32Array; // [rows*cols*4] (dx, dy, log-w, log-h) per anchor
  /** [rows*cols*10] optional 5-point landmark offsets ((dx,dy) per point,
   *  anchor-relative like bbox). The 2023mar ONNX exports kps_8/16/32. */
  kps?: Float32Array;
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
        const box: FaceBox = { x: cx - w / 2, y: cy - h / 2, w, h, score };
        if (heads.kps) {
          const kps: number[] = [];
          for (let k = 0; k < 5; k++) {
            kps.push((c + heads.kps[i * 10 + k * 2]) * stride);
            kps.push((r + heads.kps[i * 10 + k * 2 + 1]) * stride);
          }
          box.kps = kps;
        }
        out.push(box);
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
    ...(b.kps ? { kps: b.kps.map((v, i) => v * (i % 2 === 0 ? sx : sy)) } : {}),
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
  // overlap = faces too close / x-overlapping (→ per-face composite path)
  // giant_face = a chosen face absurdly large for the frame (→ re-render)
  // face_clipped = a chosen face hangs off the frame edge (→ re-render)
  reason: 'ok' | 'lt2_faces' | 'overlap' | 'giant_face' | 'face_clipped';
  faceCount: number;
  splitX: number; // boundary; left crop = [0, splitX+overlap], right = [splitX-overlap, W]
  overlap: number;
  leftIsFirstBox: boolean; // true if the lower-x face is boxes[0]
  leftBox?: FaceBox;
  rightBox?: FaceBox;
  /** Big-face tier (BIG_FACE_RECLAIM_PLAN.md, 2026-09-17): the taller chosen face is above
   *  GIANT_FACE_MAX_HFRAC but within the caller's `bigFaceMaxHFrac` ceiling → swappable, but ONLY via the
   *  full-frame per-face path (never the L/R stitch, never the cropped per-face path). */
  bigFace?: boolean;
  /** The taller chosen face as a fraction of frame height (when H is known). */
  maxFaceHFrac?: number;
}

// ── Broken-composition guards (2026-09-02) ─────────────────────────────────
// Root-caused from a live corrupted render (Great Wall dual): Flux violated the
// framing brief and drew one face ~55% of frame height, half off the left edge.
// Detection found 2 faces, the gap check read 'overlap', and the per-face
// composite path swapped it — pasting the ~128px swap-model output onto a
// ~700px face = a giant pixelated smear, while every downstream gate passed
// (identity 0.674 — it WAS the right person's face — face_restore ok). A face
// this large (or hanging off the frame) means the BASE COMPOSITION is broken;
// no swap path can produce an acceptable result. Only correct move: re-render.

/** A chosen face taller than this fraction of frame height = broken composition.
 * Calibration: healthy duals run ~0.15-0.30 of frame height; the corrupted
 * render was ~0.55. The swap model outputs ~128px — above ~0.4×H the paste
 * upscale turns visibly mushy even when everything else succeeds. */
export const GIANT_FACE_MAX_HFRAC = 0.4;

/** Max fraction of a face box allowed to hang outside the frame (per axis,
 * measured against the box's own size). A face meaningfully cut by the frame
 * edge can't be cleanly swapped or restored. */
export const FACE_CLIP_MAX_FRAC = 0.15;

/** True when the face is absurdly large for the frame (GIANT_FACE_MAX_HFRAC). */
export function isGiantFace(face: FaceBox, H: number): boolean {
  return H > 0 && face.h > GIANT_FACE_MAX_HFRAC * H;
}

/** True when more than FACE_CLIP_MAX_FRAC of the box hangs outside the frame
 * on either axis. */
export function isClippedFace(face: FaceBox, W: number, H: number): boolean {
  if (face.w <= 0 || face.h <= 0) return false;
  const overX = Math.max(0, -face.x) + Math.max(0, face.x + face.w - W);
  const overY = Math.max(0, -face.y) + Math.max(0, face.y + face.h - H);
  return overX / face.w > FACE_CLIP_MAX_FRAC || overY / face.h > FACE_CLIP_MAX_FRAC;
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
  opts: {
    minGapFrac?: number;
    overlapFrac?: number;
    H?: number;
    bigFaceMaxHFrac?: number;
  } = {}
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
  // Broken-composition guards — BEFORE the gap logic, because a giant/clipped
  // face makes the gap read 'overlap' and mis-routes the render into the
  // per-face composite path (the corrupted-paste bug). H is optional for
  // backward compatibility; without it these guards are inert (clip check
  // still applies horizontally via W).
  const H = opts.H ?? 0;
  const maxFaceHFrac = H > 0 ? Math.max(faceL.h, faceR.h) / H : 0;
  // Big-face tier (BIG_FACE_RECLAIM_PLAN.md, 2026-09-17): faces in (GIANT_FACE_MAX_HFRAC, ceiling] are NOT a
  // broken composition — Phase 0 swapped 9 of 11 such couples at normal identity once the per-face path stopped
  // crossing into the neighbouring face. The ceiling defaults to the giant guard (today's behaviour); the isolate
  // raises it from engine_config.dual_big_face_max_hfrac. Above the ceiling stays giant_face (re-render).
  const ceiling = Math.max(GIANT_FACE_MAX_HFRAC, opts.bigFaceMaxHFrac ?? GIANT_FACE_MAX_HFRAC);
  if (H > 0 && maxFaceHFrac > ceiling) {
    return {
      ok: false,
      reason: 'giant_face',
      faceCount: boxes.length,
      splitX: 0,
      overlap: 0,
      leftIsFirstBox: faceL === a,
      leftBox: faceL,
      rightBox: faceR,
      maxFaceHFrac,
    };
  }
  const tier =
    H > 0 && maxFaceHFrac > GIANT_FACE_MAX_HFRAC
      ? { bigFace: true as const, maxFaceHFrac }
      : { maxFaceHFrac };
  const clipH = H > 0 ? H : Number.MAX_SAFE_INTEGER; // no vertical clip check without H
  if (isClippedFace(faceL, W, clipH) || isClippedFace(faceR, W, clipH)) {
    return {
      ok: false,
      reason: 'face_clipped',
      faceCount: boxes.length,
      splitX: 0,
      overlap: 0,
      leftIsFirstBox: faceL === a,
      leftBox: faceL,
      rightBox: faceR,
      ...tier,
    };
  }
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
      ...tier,
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
    ...tier,
  };
}

// ── Big-face per-face helpers (BIG_FACE_RECLAIM_PLAN.md, 2026-09-17) ─────────
// Why these exist: on a giant couple the per-face path's crop (2.4× the face, clamped to the frame width) holds
// BOTH faces — the swap model then picks its own target — and any square crop cuts a face taller than the frame
// is wide. So a big face is swapped on the FULL frame with the neighbour painted out (outside our own box), the
// painted pixels restored after the swap, and pasted back with a mask that stops at the neighbour.

/** Frame pixels that belong to the OTHER face (its box +15%) but NOT to ours (box unexpanded — expanding it let
 *  the neighbour's half-face stay detectable). Null when the two regions do not meet. */
export function occlusionMask(
  W: number,
  H: number,
  face: FaceBox,
  other: FaceBox
): Uint8Array | null {
  const ox0 = other.x - other.w * 0.15;
  const ox1 = other.x + other.w * 1.15;
  const oy0 = other.y - other.h * 0.15;
  const oy1 = other.y + other.h * 1.15;
  const fx0 = face.x;
  const fx1 = face.x + face.w;
  const fy0 = face.y;
  const fy1 = face.y + face.h;
  const m = new Uint8Array(W * H);
  let n = 0;
  const y0 = Math.max(0, Math.floor(oy0));
  const y1 = Math.min(H, Math.ceil(oy1));
  const x0 = Math.max(0, Math.floor(ox0));
  const x1 = Math.min(W, Math.ceil(ox1));
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      if (x >= fx0 && x < fx1 && y >= fy0 && y < fy1) continue;
      m[y * W + x] = 1;
      n++;
    }
  }
  return n ? m : null;
}

/** Fill the masked pixels with the frame's mean colour (a flat patch has no face for the swap model to find). */
export function paintMasked(rgba: Uint8Array, mask: Uint8Array): number {
  let r = 0;
  let g = 0;
  let b = 0;
  let n = 0;
  for (let i = 0; i < rgba.length; i += 64) {
    r += rgba[i];
    g += rgba[i + 1];
    b += rgba[i + 2];
    n++;
  }
  r = Math.round(r / Math.max(1, n));
  g = Math.round(g / Math.max(1, n));
  b = Math.round(b / Math.max(1, n));
  let painted = 0;
  for (let i = 0; i < mask.length; i++) {
    if (!mask[i]) continue;
    const o = i * 4;
    rgba[o] = r;
    rgba[o + 1] = g;
    rgba[o + 2] = b;
    rgba[o + 3] = 255;
    painted++;
  }
  return painted;
}

/** Copy the masked pixels of `src` into `dst` (same geometry) — undoes paintMasked after the swap. */
export function restoreMasked(dst: Uint8Array, src: Uint8Array, mask: Uint8Array): void {
  for (let i = 0; i < mask.length; i++) {
    if (!mask[i]) continue;
    const o = i * 4;
    dst[o] = src[o];
    dst[o + 1] = src[o + 1];
    dst[o + 2] = src[o + 2];
    dst[o + 3] = src[o + 3];
  }
}

/** compositeFaceMasked, but the paste never crosses into the neighbour: bounded at the neighbour's box edge,
 *  or at the midline of the overlap when the two boxes overlap. (The unbounded mask's box+30% core reaches across
 *  a giant neighbour, so the second paste overwrote the first with original pixels — Phase 0, v4.) */
export function compositeFaceMaskedBounded(
  base: Uint8Array,
  baseW: number,
  baseH: number,
  crop: Uint8Array,
  cropX: number,
  cropY: number,
  cropW: number,
  cropH: number,
  face: FaceBox,
  feather: number,
  other: FaceBox
): void {
  const otherIsRight = other.x + other.w / 2 > face.x + face.w / 2;
  let lo = -Infinity;
  let hi = Infinity;
  if (otherIsRight) {
    const fR = face.x + face.w;
    hi = fR > other.x ? (other.x + fR) / 2 : other.x;
  } else {
    const oR = other.x + other.w;
    lo = face.x < oR ? (oR + face.x) / 2 : oR;
  }
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
      if (bx < 0 || bx >= baseW || bx < lo || bx >= hi) continue;
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
