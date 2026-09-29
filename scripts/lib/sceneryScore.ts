/**
 * sceneryScore.ts — how much visible scenery surrounds the people in a render (LLM_5_5_TUNING_PLAN.md phase 0).
 *
 * Kevin: "I prefer to see some scenery along with the couples", "detailed/full backgrounds". This turns that into a
 * number. It uses the production face detector (YuNet, services/face-swap-dual) to find the people, masks each
 * person's body region (from the face box down to the bottom of the frame), and measures edge detail (Sobel gradient)
 * in everything else. A plain wall or a blank watercolour wash scores low; a town, a mountain range or a forest scores
 * high. It also reports the tallest face as a fraction of the height, because more scenery must never come from
 * smaller faces the swap can't read.
 *
 * Validated against hand labels before use (scripts/qa-scenery-score.ts --validate).
 */
import { decodeImage } from '../../services/face-swap-dual/src/imageCodec.ts';
import { detectFaces } from '../../services/face-swap-dual/src/faceDetect.ts';

const MODEL = new URL('../../services/face-swap-dual/src/yunet.onnx', import.meta.url);
const WORK_W = 256;

export interface Scenery {
  /** Mean Sobel magnitude over the background, 0-255. The score. */
  detail: number;
  /** Share of background pixels with a clear edge (magnitude > 24). */
  busy: number;
  /** Share of the frame that is background (outside the people masks). */
  bgFrac: number;
  faces: number;
  /** Tallest face height / image height. */
  faceHFrac: number | null;
}

export async function sceneryScore(bytes: Uint8Array): Promise<Scenery> {
  const img = await decodeImage(bytes);
  const { width: W, height: H } = img;
  const faces = await detectFaces(img.data, W, H, { modelUrl: MODEL, scoreThreshold: 0.6 });

  // Grayscale, box-downscaled to WORK_W wide.
  const s = WORK_W / W;
  const w = WORK_W;
  const h = Math.max(1, Math.round(H * s));
  const gray = new Float32Array(w * h);
  const counts = new Float32Array(w * h);
  for (let y = 0; y < H; y++) {
    const gy = Math.min(h - 1, Math.floor(y * s));
    for (let x = 0; x < W; x++) {
      const gx = Math.min(w - 1, Math.floor(x * s));
      const i = (y * W + x) * 4;
      gray[gy * w + gx] += 0.299 * img.data[i] + 0.587 * img.data[i + 1] + 0.114 * img.data[i + 2];
      counts[gy * w + gx]++;
    }
  }
  for (let i = 0; i < gray.length; i++) gray[i] /= Math.max(1, counts[i]);

  // People mask: each face box widened to the shoulders and extended to the bottom of the frame.
  const mask = new Uint8Array(w * h);
  for (const f of faces) {
    const x0 = Math.max(0, Math.floor((f.x - 1.0 * f.w) * s));
    const x1 = Math.min(w - 1, Math.ceil((f.x + 2.0 * f.w) * s));
    const y0 = Math.max(0, Math.floor((f.y - 0.5 * f.h) * s));
    for (let y = y0; y < h; y++) for (let x = x0; x <= x1; x++) mask[y * w + x] = 1;
  }

  let sum = 0;
  let n = 0;
  let busy = 0;
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      if (mask[i]) continue;
      const gx =
        -gray[i - w - 1] -
        2 * gray[i - 1] -
        gray[i + w - 1] +
        gray[i - w + 1] +
        2 * gray[i + 1] +
        gray[i + w + 1];
      const gy =
        -gray[i - w - 1] -
        2 * gray[i - w] -
        gray[i - w + 1] +
        gray[i + w - 1] +
        2 * gray[i + w] +
        gray[i + w + 1];
      const m = Math.sqrt(gx * gx + gy * gy) / 4;
      sum += m;
      n++;
      if (m > 24) busy++;
    }
  }
  return {
    detail: n ? sum / n : 0,
    busy: n ? busy / n : 0,
    bgFrac: n / ((w - 2) * (h - 2)),
    faces: faces.length,
    faceHFrac: faces.length ? Math.max(...faces.map((f) => f.h)) / H : null,
  };
}
