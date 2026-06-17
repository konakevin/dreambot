/**
 * Tests for in-process face detection (YuNet ONNX).
 *   • Pure-math unit tests (decode / NMS / IoU / dual-split) — synthetic tensors.
 *   • Integration tests — run the REAL model on committed fixture renders and
 *     assert the face COUNT (2 on a couple, 0 on a scene, 1 on a single person),
 *     plus that the dual-split lands cleanly between the two faces.
 *
 * Run: `cd services/face-swap-dual && deno test -A src/faceDetect.test.ts`
 */

import { assert, assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';
import decodeJpeg from 'https://esm.sh/@jsquash/jpeg@1.5.0/decode';
import {
  decodeYuNet,
  nms,
  iou,
  planDualSplit,
  faceCropBox,
  compositeFaceMasked,
  type FaceBox,
  type YuNetHeads,
} from './faceDetectMath.ts';
import { detectFaces, detectFacesWithGender } from './faceDetect.ts';

// ───────────────────────── pure math ─────────────────────────

Deno.test('iou — disjoint=0, identical=1, half-overlap', () => {
  const a: FaceBox = { x: 0, y: 0, w: 10, h: 10, score: 1 };
  assertEquals(iou(a, { x: 100, y: 100, w: 10, h: 10, score: 1 }), 0);
  assertEquals(iou(a, a), 1);
  // b shifted right by 5 → overlap 5x10=50, union 200-50=150 → 1/3
  assert(Math.abs(iou(a, { x: 5, y: 0, w: 10, h: 10, score: 1 }) - 1 / 3) < 1e-9);
});

Deno.test('nms — suppresses an overlapping lower-score box, keeps a disjoint one', () => {
  const boxes: FaceBox[] = [
    { x: 0, y: 0, w: 10, h: 10, score: 0.9 },
    { x: 1, y: 1, w: 10, h: 10, score: 0.5 }, // overlaps the first
    { x: 100, y: 0, w: 10, h: 10, score: 0.8 }, // disjoint
  ];
  const kept = nms(boxes, 0.3);
  assertEquals(kept.length, 2);
  assertEquals(kept[0].score, 0.9);
  assertEquals(kept[1].score, 0.8);
});

Deno.test('decodeYuNet — one synthetic detection decodes to the right box + score', () => {
  // stride 32 → 20x20 grid. Put a hit at grid (col=10,row=10), bbox offsets 0.
  const n = 20 * 20;
  const cls = new Float32Array(n);
  const obj = new Float32Array(n);
  const bbox = new Float32Array(n * 4); // all zeros → w=h=exp(0)*32=32, center=(c,r)*32
  const i = 10 * 20 + 10;
  cls[i] = 0.99;
  obj[i] = 0.99;
  const heads: Record<number, YuNetHeads> = { 8: empty(80), 16: empty(40), 32: { cls, obj, bbox } };
  const out = decodeYuNet(heads, 0.6);
  assertEquals(out.length, 1);
  const b = out[0];
  assertEquals([b.x, b.y, b.w, b.h], [320 - 16, 320 - 16, 32, 32]); // cx=cy=320, 32px box
  assert(Math.abs(b.score - 0.99) < 1e-6);
});

function empty(side: number): YuNetHeads {
  const n = side * side;
  return { cls: new Float32Array(n), obj: new Float32Array(n), bbox: new Float32Array(n * 4) };
}

Deno.test('planDualSplit — clean gap → split at gap midpoint, overlap clamped to gap/2', () => {
  const W = 1000;
  // faceL [100..200], faceR [700..800] → gap 500, midpoint at 200+250=450
  const p = planDualSplit(
    [
      { x: 100, y: 300, w: 100, h: 140, score: 0.9 },
      { x: 700, y: 320, w: 100, h: 140, score: 0.9 },
    ],
    W
  );
  assert(p.ok);
  assertEquals(p.reason, 'ok');
  assertEquals(p.splitX, 450);
  assertEquals(p.overlap, 40); // min(0.04*1000=40, gap/2=250) = 40
});

Deno.test('planDualSplit — <2 faces and overlapping faces both refuse (→ re-render)', () => {
  assertEquals(planDualSplit([{ x: 0, y: 0, w: 50, h: 50, score: 0.9 }], 1000).reason, 'lt2_faces');
  // two faces touching (gap < 3% of W) → overlap
  const o = planDualSplit(
    [
      { x: 400, y: 0, w: 100, h: 100, score: 0.9 },
      { x: 505, y: 0, w: 100, h: 100, score: 0.9 },
    ],
    1000
  );
  assertEquals(o.reason, 'overlap');
  assert(!o.ok);
});

Deno.test('faceCropBox — square, centered on the face, clamped inside the image', () => {
  // face near the top-left corner → crop clamps to (0,0), stays square
  const b = faceCropBox({ x: 10, y: 10, w: 100, h: 120, score: 0.9 }, 800, 1000, 2.4);
  assertEquals(b.w, b.h); // square
  assertEquals(b.w, Math.round(120 * 2.4)); // side = max(w,h)*pad
  assert(b.x >= 0 && b.y >= 0);
  assert(b.x + b.w <= 800 && b.y + b.h <= 1000);
  // a centered face → crop is centered on the face center
  const c = faceCropBox({ x: 400, y: 500, w: 100, h: 100, score: 0.9 }, 1000, 1200, 2.0);
  assertEquals(c.x + c.w / 2, 450); // face center x = 450
  assertEquals(c.y + c.h / 2, 550);
});

Deno.test('compositeFaceMasked — full opacity over the face, original preserved far away', () => {
  const W = 40,
    H = 40;
  const base = new Uint8Array(W * H * 4).fill(0); // all black, alpha 0
  for (let i = 0; i < base.length; i += 4) base[i + 3] = 255;
  // crop = a 20×20 swapped patch (all white) placed at (10,10)
  const cropW = 20,
    cropH = 20;
  const crop = new Uint8Array(cropW * cropH * 4).fill(255);
  const face: FaceBox = { x: 16, y: 16, w: 8, h: 8, score: 0.9 }; // centered in the patch
  compositeFaceMasked(base, W, H, crop, 10, 10, cropW, cropH, face, 4);
  // center of the face → fully white (alpha 1)
  const cIdx = (20 * W + 20) * 4;
  assertEquals(base[cIdx], 255);
  // a pixel OUTSIDE the patch entirely → untouched (still black)
  const farIdx = (2 * W + 2) * 4;
  assertEquals(base[farIdx], 0);
});

Deno.test('compositeFaceMasked — overlapping patches each keep their OWN face (no clobber)', () => {
  const W = 60,
    H = 40;
  const base = new Uint8Array(W * H * 4);
  for (let i = 0; i < base.length; i += 4) base[i + 3] = 255; // black, opaque
  // Two faces close together (overlapping pads). Patch A = red, patch B = green.
  const faceA: FaceBox = { x: 18, y: 16, w: 8, h: 8, score: 0.9 };
  const faceB: FaceBox = { x: 34, y: 16, w: 8, h: 8, score: 0.9 };
  const mk = (r: number, g: number, b: number, w: number, h: number) => {
    const a = new Uint8Array(w * h * 4);
    for (let i = 0; i < a.length; i += 4) {
      a[i] = r;
      a[i + 1] = g;
      a[i + 2] = b;
      a[i + 3] = 255;
    }
    return a;
  };
  const cropA = mk(255, 0, 0, 28, 28);
  const cropB = mk(0, 255, 0, 28, 28);
  compositeFaceMasked(base, W, H, cropA, 8, 6, 28, 28, faceA, 4);
  compositeFaceMasked(base, W, H, cropB, 24, 6, 28, 28, faceB, 4);
  // faceA center stays RED (B's overlapping pad didn't overwrite A's face)
  const aIdx = (20 * W + 22) * 4;
  assert(
    base[aIdx] > 200 && base[aIdx + 1] < 60,
    `faceA center not red: ${base[aIdx]},${base[aIdx + 1]}`
  );
  // faceB center is GREEN
  const bIdx = (20 * W + 38) * 4;
  assert(
    base[bIdx + 1] > 200 && base[bIdx] < 60,
    `faceB center not green: ${base[bIdx]},${base[bIdx + 1]}`
  );
});

Deno.test('planDualSplit — picks the two LARGEST boxes when a 3rd (bystander) is detected', () => {
  const p = planDualSplit(
    [
      { x: 100, y: 300, w: 120, h: 160, score: 0.9 }, // big
      { x: 700, y: 300, w: 120, h: 160, score: 0.9 }, // big
      { x: 460, y: 50, w: 20, h: 24, score: 0.7 }, // tiny background face — ignored
    ],
    1000
  );
  assert(p.ok);
  assertEquals(p.faceCount, 3); // reports all detected
  // split between the two big faces (220..700 gap), not influenced by the tiny one
  assertEquals(p.splitX, 460);
});

// ───────────────────────── real model integration ─────────────────────────

async function rgbaOf(name: string): Promise<{ rgba: Uint8Array; W: number; H: number }> {
  const buf = await Deno.readFile(new URL(`./fixtures/${name}`, import.meta.url));
  const img = await decodeJpeg(buf.buffer);
  return { rgba: new Uint8Array(img.data.buffer), W: img.width, H: img.height };
}

// onnxruntime-web's WASM init holds resources Deno's leak-detector flags; the
// session is a process-lifetime singleton in production, so disable the per-test
// resource/op sanitizers for the model-backed tests.
const II = { sanitizeResources: false, sanitizeOps: false };

Deno.test(
  { name: 'YuNet — a COUPLE render detects exactly 2 faces, cleanly splittable', ...II },
  async () => {
    const { rgba, W, H } = await rgbaOf('couple.jpg');
    const faces = await detectFaces(rgba, W, H);
    assertEquals(
      faces.length,
      2,
      `expected 2 faces, got ${faces.length}: ${JSON.stringify(faces)}`
    );
    for (const f of faces) assert(f.score > 0.7, `low score ${f.score}`);
    const split = planDualSplit(faces, W);
    assert(split.ok, `couple should be cleanly splittable: ${JSON.stringify(split)}`);
    assert(split.splitX > 0 && split.splitX < W);
  }
);

Deno.test({ name: 'YuNet — a no-people SCENE detects 0 faces', ...II }, async () => {
  const { rgba, W, H } = await rgbaOf('scene_no_faces.jpg');
  const faces = await detectFaces(rgba, W, H);
  assertEquals(faces.length, 0, `expected 0 faces, got ${faces.length}: ${JSON.stringify(faces)}`);
});

Deno.test(
  { name: 'YuNet — a SINGLE person detects 1 face → not dual-splittable', ...II },
  async () => {
    const { rgba, W, H } = await rgbaOf('solo.jpg');
    const faces = await detectFaces(rgba, W, H);
    assertEquals(faces.length, 1, `expected 1 face, got ${faces.length}: ${JSON.stringify(faces)}`);
    assertEquals(planDualSplit(faces, W).reason, 'lt2_faces');
  }
);

Deno.test(
  { name: 'genderage — the mixed couple reads male (left) + female (right)', ...II },
  async () => {
    const { rgba, W, H } = await rgbaOf('couple.jpg');
    const faces = (await detectFacesWithGender(rgba, W, H)).sort((a, b) => a.x - b.x);
    assertEquals(faces.length, 2);
    // couple.jpg: man on the left, woman on the right
    assertEquals(faces[0].gender, 'male', `left should be male: ${JSON.stringify(faces[0])}`);
    assertEquals(faces[1].gender, 'female', `right should be female: ${JSON.stringify(faces[1])}`);
  }
);
