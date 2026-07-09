/**
 * Tests for ArcFace identity embedding (Stage 8).
 *   • Pure-math: umeyama similarity transform + template warp.
 *   • Integration: the REAL w600k_mbf model — same face twice ≈ 1.0 cosine;
 *     two different fixture people score clearly lower.
 *
 * Run: `cd services/face-swap-dual && deno test -A src/faceEmbed.test.ts`
 */

import { assert, assertAlmostEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';
import decodeJpeg from 'https://esm.sh/@jsquash/jpeg@1.5.0/decode';
import {
  ARCFACE_TEMPLATE_112,
  similarityTransform,
  warpToTemplate,
  cosine,
  l2normalize,
  embedFace,
} from './faceEmbed.ts';
import { detectFaces } from './faceDetect.ts';

// ───────────────────────── pure math ─────────────────────────

Deno.test('similarityTransform — identity when src == dst', () => {
  const t = similarityTransform(ARCFACE_TEMPLATE_112, ARCFACE_TEMPLATE_112);
  assertAlmostEquals(t[0], 1, 1e-9); // a (cos·scale)
  assertAlmostEquals(t[1], 0, 1e-9); // b (sin·scale)
  assertAlmostEquals(t[2], 0, 1e-6); // tx
  assertAlmostEquals(t[3], 0, 1e-6); // ty
});

Deno.test('similarityTransform — recovers a known scale+shift exactly', () => {
  // dst = src·2 + (10, 20): a=2, b=0, t=(10,20)
  const src = ARCFACE_TEMPLATE_112;
  const dst = src.map((v, i) => v * 2 + (i % 2 === 0 ? 10 : 20));
  const t = similarityTransform(src, dst);
  assertAlmostEquals(t[0], 2, 1e-9);
  assertAlmostEquals(t[1], 0, 1e-9);
  assertAlmostEquals(t[2], 10, 1e-6);
  assertAlmostEquals(t[3], 20, 1e-6);
});

Deno.test('similarityTransform — recovers a 90° rotation', () => {
  // (x,y) → (−y, x): a=0, b=1, t=0
  const src = ARCFACE_TEMPLATE_112;
  const dst: number[] = [];
  for (let i = 0; i < 5; i++) {
    dst.push(-src[i * 2 + 1], src[i * 2]);
  }
  const t = similarityTransform(src, dst);
  assertAlmostEquals(t[0], 0, 1e-9);
  assertAlmostEquals(t[1], 1, 1e-9);
  assertAlmostEquals(t[2], 0, 1e-6);
  assertAlmostEquals(t[3], 0, 1e-6);
});

Deno.test('warpToTemplate — identity transform copies pixels', () => {
  // A 112×112 gradient warped through the identity should round-trip.
  const W = 112;
  const src = new Uint8Array(W * W * 4);
  for (let i = 0; i < W * W; i++) {
    src[i * 4] = i % 251;
    src[i * 4 + 1] = (i * 7) % 251;
    src[i * 4 + 2] = (i * 13) % 251;
    src[i * 4 + 3] = 255;
  }
  const out = warpToTemplate(src, W, W, [1, 0, 0, 0]);
  let maxDiff = 0;
  for (let i = 0; i < out.length; i++) maxDiff = Math.max(maxDiff, Math.abs(out[i] - src[i]));
  assert(maxDiff <= 1, `identity warp should round-trip, maxDiff=${maxDiff}`);
});

Deno.test('cosine — orthogonal 0, identical 1 after l2normalize', () => {
  const a = l2normalize(new Float32Array([3, 0, 0, 0]));
  const b = l2normalize(new Float32Array([0, 4, 0, 0]));
  assertAlmostEquals(cosine(a, a), 1, 1e-6);
  assertAlmostEquals(cosine(a, b), 0, 1e-6);
});

// ─────────────────── integration (real model + fixtures) ───────────────────
// onnxruntime-web keeps a WASM worker message port open; disable the
// resource/op sanitizers for the model-backed tests (same as faceDetect.test.ts).
const II = { sanitizeResources: false, sanitizeOps: false };

async function loadFixtureRGBA(name: string) {
  const bytes = await Deno.readFile(new URL(`./fixtures/${name}`, import.meta.url));
  const img = await decodeJpeg(bytes.buffer as ArrayBuffer);
  return { rgba: new Uint8Array(img.data.buffer), W: img.width, H: img.height };
}

Deno.test({ name: 'embedFace — same face embeds to cosine ≈ 1 with itself', ...II }, async () => {
  const { rgba, W, H } = await loadFixtureRGBA('solo.jpg');
  const faces = await detectFaces(rgba, W, H);
  assert(faces.length >= 1, 'fixture should contain a face');
  assert(faces[0].kps, 'detector should surface landmarks');
  const e1 = await embedFace(rgba, W, H, faces[0]);
  const e2 = await embedFace(rgba, W, H, faces[0]);
  assert(e1 && e2);
  assertAlmostEquals(cosine(e1, e2), 1, 1e-4);
});

Deno.test(
  { name: 'embedFace — two different people score well below same-person', ...II },
  async () => {
    const { rgba, W, H } = await loadFixtureRGBA('couple.jpg');
    const faces = await detectFaces(rgba, W, H);
    assert(faces.length >= 2, 'couple fixture should contain two faces');
    const e1 = await embedFace(rgba, W, H, faces[0]);
    const e2 = await embedFace(rgba, W, H, faces[1]);
    assert(e1 && e2);
    const sim = cosine(e1, e2);
    assert(sim < 0.5, `different people should not match strongly, got ${sim}`);
  }
);
