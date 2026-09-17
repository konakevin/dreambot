/**
 * BIG_FACE_RECLAIM_PLAN.md Phase 1 — the big-face tier is wired end to end and ships DARK.
 *
 * Source guards (the failure modes here are plumbing gaps a unit test of either side cannot see):
 *  - engine_config.dual_big_face_max_hfrac defaults to 0.40 in code = today's behaviour;
 *  - the dispatcher forwards the ceiling in the request body and parses bigFace/maxFaceHFrac back;
 *  - the pipeline stamps `big_face:<frac>` so the rollout is measurable in ai_generation_log;
 *  - EVERY dispatch site (nightly ×3, Create ×1) passes the config value — a site that forgets it runs the old
 *    guard silently, exactly the kind of dormant-path gap that hid six fixes behind LOOKS_MINIMAL.
 */
import fs from 'fs';
import path from 'path';

const ROOT = path.join(__dirname, '..', '..');
const read = (p: string) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const strip = (s: string) => s.replace(/\s+/g, ' ');

describe('big-face tier — config', () => {
  const src = read('supabase/functions/_shared/engineConfig.ts');
  it('defaults to 0.40 (the giant guard) and reads dual_big_face_max_hfrac', () => {
    expect(src).toContain('dualBigFaceMaxHFrac: 0.4,');
    expect(strip(src)).toContain(
      'dualBigFaceMaxHFrac: Number( data.dual_big_face_max_hfrac ?? DEFAULT_ENGINE_CONFIG.dualBigFaceMaxHFrac ),'
    );
  });
  it('migration 524 adds the column with the same default and a 0.40-0.80 range', () => {
    const m = read('supabase/migrations/524_dual_big_face_max_hfrac.sql');
    expect(m).toContain(
      'ADD COLUMN IF NOT EXISTS dual_big_face_max_hfrac numeric NOT NULL DEFAULT 0.40'
    );
    expect(m).toContain(
      'CHECK (dual_big_face_max_hfrac >= 0.40 AND dual_big_face_max_hfrac <= 0.80)'
    );
  });
});

describe('big-face tier — dispatcher + pipeline', () => {
  it('the dispatcher forwards the ceiling and parses the tier back', () => {
    const d = strip(read('supabase/functions/_shared/dualSwapDispatch.ts'));
    expect(d).toContain('bigFaceMaxHFrac?: number | null ): Promise<DualDispatchResult>');
    expect(d).toContain('bigFaceMaxHFrac: bigFaceMaxHFrac ?? null,');
    expect(d).toContain("bigFace: typeof parsed.bigFace === 'boolean' ? parsed.bigFace : null,");
    expect(d).toContain(
      "maxFaceHFrac: typeof parsed.maxFaceHFrac === 'number' ? parsed.maxFaceHFrac : null,"
    );
  });
  it('the pipeline stamps big_face:<frac> on every dispatch that took the tier, and the fraction on giant rejections', () => {
    const p = strip(read('supabase/functions/_shared/dualSwapPipeline.ts'));
    expect(p).toContain(
      'if (res.rejectReason && /giant_face/.test(res.rejectReason) && res.maxFaceHFrac != null) reasons.push(`giant_face_hfrac:${res.maxFaceHFrac.toFixed(2)}`);'
    );
    expect(p).toContain(
      "if (res.bigFace) reasons.push(`big_face:${res.maxFaceHFrac == null ? '?' : res.maxFaceHFrac.toFixed(2)}`);"
    );
  });
});

describe('big-face tier — every dispatch site passes the config value', () => {
  it.each([
    ['nightly-dreams', 'supabase/functions/nightly-dreams/index.ts', 3],
    ['generate-dream', 'supabase/functions/generate-dream/index.ts', 1],
  ])('%s', (_name, rel, sites) => {
    const src = read(rel);
    const calls = (src.match(/dispatchDualFaceSwap\(/g) || []).length;
    const wired = (src.match(/\(await fetchEngineConfig\(supabase\)\)\.dualBigFaceMaxHFrac/g) || [])
      .length;
    expect(calls).toBe(sites);
    expect(wired).toBe(sites);
  });
});

describe('big-face tier — the Fly engine contract', () => {
  it('the engine reads bigFaceMaxHFrac (clamped 0.40-0.80) and answers with bigFace + maxFaceHFrac', () => {
    const e = strip(read('services/face-swap-dual/src/index.ts'));
    expect(e).toContain('Math.min(0.8, Math.max(0.4, bigFaceMaxHFrac))');
    expect(e).toContain('bigFace: bigFace ?? false,');
    expect(e).toContain('maxFaceHFrac: maxFaceHFrac ?? null,');
  });
  it('the split plan keeps the giant guard as the floor of the ceiling (a ceiling below 0.40 is 0.40)', () => {
    const m = read('services/face-swap-dual/src/faceDetectMath.ts');
    expect(m).toContain(
      'Math.max(GIANT_FACE_MAX_HFRAC, opts.bigFaceMaxHFrac ?? GIANT_FACE_MAX_HFRAC)'
    );
    expect(m).toContain('export const GIANT_FACE_MAX_HFRAC = 0.4;');
  });
  it('big faces never take the L/R stitch or the cropped per-face path', () => {
    const f = strip(read('services/face-swap-dual/src/faceSwap.ts'));
    expect(f).toContain('if (!split.ok || bigFace) {');
    expect(f).toContain(
      "const perFaceEligible = split.reason === 'overlap' || (split.ok && bigFace);"
    );
    expect(f).toContain(
      'const box = opts.bigFace ? { x: 0, y: 0, w: W, h: H } : faceCropBox(face, W, H);'
    );
    expect(f).toContain('if (opts.bigFace) { // Bounded pastes');
  });
});
