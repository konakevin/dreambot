/**
 * genderSafeDualSwap — the dual face-swap orchestrator. The Fly engine now does
 * real face detection + gender + gap-split (correct by construction), so the
 * orchestrator's job is: dual-swap → if the engine found no clean 2-face split,
 * RE-RENDER the couple and retry → else degrade (strict → cascade; non-strict →
 * single self). These tests lock that loop + the per-flow degrade.
 */

import { genderSafeDualSwap } from '@engine/dualSwapPipeline';

const okRender = { url: 'RERENDER.jpg', predictionId: 'p2' };

const makeDeps = (over: Partial<Record<string, jest.Mock>> = {}) => ({
  dispatchDual:
    over.dispatchDual ?? jest.fn().mockResolvedValue({ swappedUrl: 'SWAP.jpg', faceCount: 2 }),
  singleSwap:
    over.singleSwap ?? jest.fn().mockResolvedValue({ url: 'SINGLE.jpg', predictionId: 'solo-pid' }),
  rerender: over.rerender ?? jest.fn().mockResolvedValue(okRender),
  selfSource: 'self.jpg',
});

it('HAPPY PATH — engine returns a swapped url → dual, no re-render', async () => {
  const deps = makeDeps();
  const r = await genderSafeDualSwap('render.jpg', deps, { strict: false });
  expect(r.outcome).toBe('dual');
  expect(r.url).toBe('SWAP.jpg');
  expect(r.faceCount).toBe(2);
  expect(deps.dispatchDual).toHaveBeenCalledTimes(1);
  expect(deps.dispatchDual).toHaveBeenCalledWith('render.jpg');
  expect(deps.rerender).not.toHaveBeenCalled();
  expect(deps.singleSwap).not.toHaveBeenCalled();
});

it('NO clean split → re-render the couple → succeeds → dual', async () => {
  const dispatchDual = jest
    .fn()
    .mockResolvedValueOnce({ swappedUrl: null, faceCount: 1 }) // clustered / 1 face
    .mockResolvedValueOnce({ swappedUrl: 'SWAP2.jpg', faceCount: 2 }); // fresh render is clean
  const deps = makeDeps({ dispatchDual });
  const r = await genderSafeDualSwap('render.jpg', deps, { strict: false });
  expect(r.outcome).toBe('dual');
  expect(r.url).toBe('SWAP2.jpg');
  expect(deps.rerender).toHaveBeenCalledTimes(1);
  expect(deps.dispatchDual).toHaveBeenCalledTimes(2);
  expect(r.predictionId).toBe('p2');
  expect(r.reasons).toContain('no_dual_split(faces=1)');
});

it('STRICT + never a clean split → cascade (no single swap; caller → solo-self / refund)', async () => {
  const dispatchDual = jest.fn().mockResolvedValue({ swappedUrl: null, faceCount: 1 });
  const deps = makeDeps({ dispatchDual });
  const r = await genderSafeDualSwap('render.jpg', deps, { strict: true, maxRerenders: 2 });
  expect(r.outcome).toBe('cascade');
  expect(deps.dispatchDual).toHaveBeenCalledTimes(3); // original + 2 re-renders
  expect(deps.rerender).toHaveBeenCalledTimes(2);
  expect(deps.singleSwap).not.toHaveBeenCalled();
});

it('NON-STRICT + never a clean split → single self-swap', async () => {
  const dispatchDual = jest.fn().mockResolvedValue({ swappedUrl: null, faceCount: 1 });
  const deps = makeDeps({ dispatchDual });
  const r = await genderSafeDualSwap('render.jpg', deps, { strict: false, maxRerenders: 1 });
  expect(r.outcome).toBe('single');
  expect(r.url).toBe('SINGLE.jpg');
  expect(deps.singleSwap).toHaveBeenCalledWith('self.jpg', expect.any(String));
  // #3: singleSwap's own predictionId (its SOLO re-render) rides back as the
  // outcome's predictionId — forensics point at the render we actually persisted,
  // not the dual loop's abandoned couple re-render.
  expect(r.predictionId).toBe('solo-pid');
});

it('STRICT + degradeToSingle + never a clean split → single self-swap (Create degrades, no refund)', async () => {
  // Kevin 2026-07-24: Create now prefers a gender-safe self-only swap over a
  // refund / a wrong-face dual. Same inputs as the strict-cascade case above, but
  // the opt flips the degrade from cascade → single.
  const dispatchDual = jest.fn().mockResolvedValue({ swappedUrl: null, faceCount: 1 });
  const deps = makeDeps({ dispatchDual });
  const r = await genderSafeDualSwap('render.jpg', deps, {
    strict: true,
    degradeToSingle: true,
    maxRerenders: 1,
  });
  expect(r.outcome).toBe('single');
  expect(r.url).toBe('SINGLE.jpg');
  expect(deps.singleSwap).toHaveBeenCalledWith('self.jpg', expect.any(String));
  expect(r.reasons).toContain('dual_degrade_single');
});

it('STRICT + degradeToSingle + single swap ALSO fails → cascade (never ships nothing)', async () => {
  const dispatchDual = jest.fn().mockResolvedValue({ swappedUrl: null, faceCount: 1 });
  const singleSwap = jest.fn().mockRejectedValue(new Error('single engine down'));
  const deps = makeDeps({ dispatchDual, singleSwap });
  const r = await genderSafeDualSwap('render.jpg', deps, {
    strict: true,
    degradeToSingle: true,
    maxRerenders: 0,
  });
  expect(r.outcome).toBe('cascade');
  expect(r.reasons.some((x) => x.startsWith('single_fallback_failed'))).toBe(true);
});

it('NON-STRICT + dual fails + guard REFUSES self (wrong-gender target) → cascade, never pastes on the wrong body', async () => {
  // 2026-08-05 (sunnysteph "face on the man"): the degrade single swap is now
  // gender-guarded and returns null when self cannot land on a same-gender face.
  // The pipeline MUST cascade (ship the unswapped scene) rather than paste self
  // onto the wrong-gender body.
  const dispatchDual = jest.fn().mockResolvedValue({ swappedUrl: null, faceCount: 1 });
  const singleSwap = jest.fn().mockResolvedValue(null); // guard refused: no safe same-gender face
  const deps = makeDeps({ dispatchDual, singleSwap });
  const r = await genderSafeDualSwap('render.jpg', deps, { strict: false, maxRerenders: 0 });
  expect(r.outcome).toBe('cascade');
  expect(r.reasons).toContain('dual_degrade_single_refused_gender');
  expect(r.reasons).not.toContain('single_fallback_failed'); // a refusal is not an error
  expect(deps.singleSwap).toHaveBeenCalledWith('self.jpg', expect.any(String));
});

it('engine THROWS → retry via re-render → recovers', async () => {
  const dispatchDual = jest
    .fn()
    .mockRejectedValueOnce(new Error('engine 500'))
    .mockResolvedValueOnce({ swappedUrl: 'SWAP3.jpg', faceCount: 2 });
  const deps = makeDeps({ dispatchDual });
  const r = await genderSafeDualSwap('render.jpg', deps, { strict: false });
  expect(r.outcome).toBe('dual');
  expect(r.url).toBe('SWAP3.jpg');
  expect(deps.rerender).toHaveBeenCalledTimes(1);
});

it('DEADLINE exhausted → skips the re-render, degrades immediately', async () => {
  const dispatchDual = jest.fn().mockResolvedValue({ swappedUrl: null, faceCount: 1 });
  const deps = makeDeps({ dispatchDual });
  const r = await genderSafeDualSwap('render.jpg', deps, {
    strict: false,
    deadlineMs: Date.now() + 1_000, // far less than the recover budget
  });
  expect(deps.rerender).not.toHaveBeenCalled();
  expect(r.reasons).toContain('recover_budget_exhausted');
  expect(r.outcome).toBe('single');
});

it('non-strict, dual fails AND single fails → cascade', async () => {
  const dispatchDual = jest.fn().mockResolvedValue({ swappedUrl: null, faceCount: 0 });
  const singleSwap = jest.fn().mockRejectedValue(new Error('no face'));
  const deps = makeDeps({ dispatchDual, singleSwap });
  const r = await genderSafeDualSwap('render.jpg', deps, { strict: false, maxRerenders: 0 });
  expect(r.outcome).toBe('cascade');
});

// ── Stage 8c — identity enforcement (IDENTITY_MIN_SIM) ──────────────────────
// The pipeline reads the threshold from Deno.env, which doesn't exist under
// jest → identityThreshold() returns null → these tests exercise the SHADOW
// (no-enforcement) behavior unless we polyfill Deno.

describe('identity enforcement (Stage 8c)', () => {
  const withDeno = (value: string | undefined, fn: () => Promise<void>) => async () => {
    (globalThis as Record<string, unknown>).Deno = {
      env: { get: (k: string) => (k === 'IDENTITY_MIN_SIM' ? value : undefined) },
    };
    try {
      await fn();
    } finally {
      delete (globalThis as Record<string, unknown>).Deno;
    }
  };

  it(
    'below-threshold dual → re-render; a passing take ships',
    withDeno('0.35', async () => {
      const dispatchDual = jest
        .fn()
        .mockResolvedValueOnce({
          swappedUrl: 'WEAK.jpg',
          faceCount: 2,
          identity: { left: 0.6, right: 0.1, ms: 900 },
        })
        .mockResolvedValueOnce({
          swappedUrl: 'GOOD.jpg',
          faceCount: 2,
          identity: { left: 0.62, right: 0.55, ms: 900 },
        });
      const deps = makeDeps({ dispatchDual });
      const r = await genderSafeDualSwap('render.jpg', deps, { strict: false });
      expect(r.outcome).toBe('dual');
      expect(r.url).toBe('GOOD.jpg');
      expect(r.reasons.some((x) => x.startsWith('identity_below_threshold:'))).toBe(true);
      expect(deps.rerender).toHaveBeenCalledTimes(1);
    })
  );

  it(
    'every attempt below threshold → ships the BEST sub-threshold dual, not a degrade',
    withDeno('0.35', async () => {
      const dispatchDual = jest
        .fn()
        .mockResolvedValueOnce({
          swappedUrl: 'A.jpg',
          faceCount: 2,
          identity: { left: 0.2, right: 0.1, ms: 900 },
        })
        .mockResolvedValueOnce({
          swappedUrl: 'B.jpg',
          faceCount: 2,
          identity: { left: 0.3, right: 0.25, ms: 900 }, // best
        })
        .mockResolvedValueOnce({
          swappedUrl: 'C.jpg',
          faceCount: 2,
          identity: { left: 0.15, right: 0.2, ms: 900 },
        });
      const deps = makeDeps({ dispatchDual });
      const r = await genderSafeDualSwap('render.jpg', deps, { strict: false });
      expect(r.outcome).toBe('dual');
      expect(r.url).toBe('B.jpg');
      expect(r.reasons.some((x) => x.startsWith('identity_shipped_best:0.25'))).toBe(true);
      expect(deps.singleSwap).not.toHaveBeenCalled();
    })
  );

  it(
    'a MISSING side counts as 0 (skiing-4 rule) → reject',
    withDeno('0.35', async () => {
      const dispatchDual = jest
        .fn()
        .mockResolvedValueOnce({
          swappedUrl: 'ONEFACE.jpg',
          faceCount: 2,
          identity: { left: 0.6, right: null, ms: 900 },
        })
        .mockResolvedValueOnce({
          swappedUrl: 'GOOD.jpg',
          faceCount: 2,
          identity: { left: 0.5, right: 0.5, ms: 900 },
        });
      const deps = makeDeps({ dispatchDual });
      const r = await genderSafeDualSwap('render.jpg', deps, { strict: false });
      expect(r.url).toBe('GOOD.jpg');
    })
  );

  it(
    'BOTH sides null = measurement absent → fail-open, ships as today',
    withDeno('0.35', async () => {
      const dispatchDual = jest.fn().mockResolvedValueOnce({
        swappedUrl: 'SWAP.jpg',
        faceCount: 2,
        identity: { left: null, right: null, ms: 900 },
      });
      const deps = makeDeps({ dispatchDual });
      const r = await genderSafeDualSwap('render.jpg', deps, { strict: false });
      expect(r.url).toBe('SWAP.jpg');
      expect(deps.rerender).not.toHaveBeenCalled();
    })
  );

  it(
    'threshold unset → shadow: weak dual ships untouched',
    withDeno(undefined, async () => {
      const dispatchDual = jest.fn().mockResolvedValueOnce({
        swappedUrl: 'WEAK.jpg',
        faceCount: 2,
        identity: { left: 0.1, right: 0.05, ms: 900 },
      });
      const deps = makeDeps({ dispatchDual });
      const r = await genderSafeDualSwap('render.jpg', deps, { strict: false });
      expect(r.url).toBe('WEAK.jpg');
      expect(deps.rerender).not.toHaveBeenCalled();
    })
  );

  // ── IDENTITY_DEGRADE_FLOOR (0.15) — the exact Michele 2026-08-27 path ────────
  // A best sub-threshold dual BELOW 0.15 is a WRONG-person face (a watercolor
  // self-face ArcFace-scored 0.057, then -0.069). It must NOT ship the dual and
  // must NOT go faceless: degrade to a self-only single.
  it(
    'catastrophic identity (best < 0.15 floor) NON-STRICT → degrades to SINGLE, never ships the stranger dual',
    withDeno('0.35', async () => {
      const dispatchDual = jest.fn().mockResolvedValue({
        swappedUrl: 'STRANGER.jpg',
        faceCount: 2,
        identity: { left: 0.44, right: 0.057, ms: 900 }, // min 0.057 < 0.15 floor
      });
      const deps = makeDeps({ dispatchDual });
      const r = await genderSafeDualSwap('render.jpg', deps, { strict: false, maxRerenders: 2 });
      expect(r.outcome).toBe('single');
      expect(r.url).toBe('SINGLE.jpg');
      expect(r.reasons.some((x) => x.startsWith('identity_degrade_floor:'))).toBe(true);
      expect(r.url).not.toBe('STRANGER.jpg'); // never ship the wrong person
      expect(deps.singleSwap).toHaveBeenCalledWith('self.jpg', expect.any(String));
    })
  );

  it(
    'catastrophic identity + singleSwap REFUSES → cascade (the OLD faceless path; now prevented upstream by a real solo re-render)',
    withDeno('0.35', async () => {
      // This is the branch that shipped Michele a faceless beach: the degrade
      // single swap re-rendered the COUPLE prompt, the guard saw a wrong-gender
      // partner and returned null → cascade. The nightly caller now feeds a
      // genuine SOLO prompt (assembleSoloFallbackFromDual), so this null path is
      // no longer reached in practice — but the pipeline still fails SAFE here.
      const dispatchDual = jest.fn().mockResolvedValue({
        swappedUrl: 'STRANGER.jpg',
        faceCount: 2,
        identity: { left: 0.44, right: 0.057, ms: 900 },
      });
      const singleSwap = jest.fn().mockResolvedValue(null); // guard refused
      const deps = makeDeps({ dispatchDual, singleSwap });
      const r = await genderSafeDualSwap('render.jpg', deps, { strict: false, maxRerenders: 0 });
      expect(r.outcome).toBe('cascade');
      expect(r.reasons).toContain('dual_degrade_single_refused_gender');
      expect(r.url).not.toBe('STRANGER.jpg');
    })
  );
});

// ── #2 — PROACTIVE Haiku gender routing (2026-08-05, sunnysteph) ─────────────
// Haiku reads the rendered faces' genders BEFORE the swap and, when confident,
// hands the engine a genderOverride so each source lands on its matching-gender
// face — instead of trusting the engine's genderage, which misreads painterly
// faces. Ambiguous/errored reads pass NO override (engine unchanged).

describe('proactive Haiku gender routing (#2)', () => {
  it('confident one-of-each → dispatch WITH the override, first try succeeds (no re-render)', async () => {
    const dispatchDual = jest.fn().mockResolvedValue({ swappedUrl: 'OK.jpg', faceCount: 2 });
    const confirmGenders = jest.fn().mockResolvedValue({ left: 'male', right: 'female' });
    const deps = { ...makeDeps({ dispatchDual }), confirmGenders };
    const r = await genderSafeDualSwap('render.jpg', deps, { strict: false });
    expect(r.outcome).toBe('dual');
    expect(r.url).toBe('OK.jpg');
    expect(confirmGenders).toHaveBeenCalledWith('render.jpg');
    expect(dispatchDual).toHaveBeenCalledWith('render.jpg', { left: 'male', right: 'female' });
    expect(deps.rerender).not.toHaveBeenCalled();
    expect(r.reasons).toContain('gender_haiku:male/female');
  });

  it('ambiguous read (same gender) → NO override, engine dispatched as-is', async () => {
    const dispatchDual = jest.fn().mockResolvedValue({ swappedUrl: 'OK.jpg', faceCount: 2 });
    const confirmGenders = jest.fn().mockResolvedValue({ left: 'male', right: 'male' });
    const deps = { ...makeDeps({ dispatchDual }), confirmGenders };
    const r = await genderSafeDualSwap('render.jpg', deps, { strict: false });
    expect(r.outcome).toBe('dual');
    expect(dispatchDual).toHaveBeenCalledWith('render.jpg'); // single arg — no override
    expect(r.reasons).toContain('gender_haiku_unresolved');
  });

  it('null read → NO override, dispatch as-is', async () => {
    const dispatchDual = jest.fn().mockResolvedValue({ swappedUrl: 'OK.jpg', faceCount: 2 });
    const confirmGenders = jest.fn().mockResolvedValue(null);
    const deps = { ...makeDeps({ dispatchDual }), confirmGenders };
    const r = await genderSafeDualSwap('render.jpg', deps, { strict: false });
    expect(dispatchDual).toHaveBeenCalledWith('render.jpg');
    expect(r.reasons).toContain('gender_haiku_unresolved');
  });

  it('confirm THROWS → NO override, fail-open, dispatch proceeds', async () => {
    const dispatchDual = jest.fn().mockResolvedValue({ swappedUrl: 'OK.jpg', faceCount: 2 });
    const confirmGenders = jest.fn().mockRejectedValue(new Error('vision down'));
    const deps = { ...makeDeps({ dispatchDual }), confirmGenders };
    const r = await genderSafeDualSwap('render.jpg', deps, { strict: false });
    expect(r.outcome).toBe('dual');
    expect(dispatchDual).toHaveBeenCalledWith('render.jpg'); // no override
    expect(r.reasons).toContain('gender_haiku_error');
  });

  it('re-read per attempt: a re-render gets a FRESH Haiku read + override', async () => {
    const dispatchDual = jest
      .fn()
      .mockResolvedValueOnce({ swappedUrl: null, faceCount: 1 }) // attempt 0: no clean split
      .mockResolvedValueOnce({ swappedUrl: 'OK2.jpg', faceCount: 2 }); // attempt 1: clean
    const confirmGenders = jest
      .fn()
      .mockResolvedValueOnce({ left: 'male', right: 'female' }) // read of original
      .mockResolvedValueOnce({ left: 'female', right: 'male' }); // read of the re-render
    const deps = { ...makeDeps({ dispatchDual }), confirmGenders };
    const r = await genderSafeDualSwap('render.jpg', deps, { strict: false });
    expect(r.outcome).toBe('dual');
    expect(confirmGenders).toHaveBeenCalledTimes(2); // one per attempt
    expect(dispatchDual).toHaveBeenNthCalledWith(1, 'render.jpg', {
      left: 'male',
      right: 'female',
    });
    expect(dispatchDual).toHaveBeenNthCalledWith(2, 'RERENDER.jpg', {
      left: 'female',
      right: 'male',
    });
  });

  it('no confirmGenders dep → unchanged single-arg dispatch (back-compat)', async () => {
    const dispatchDual = jest.fn().mockResolvedValue({ swappedUrl: 'OK.jpg', faceCount: 2 });
    const deps = makeDeps({ dispatchDual }); // no confirmGenders
    const r = await genderSafeDualSwap('render.jpg', deps, { strict: false });
    expect(r.outcome).toBe('dual');
    expect(dispatchDual).toHaveBeenCalledWith('render.jpg');
    expect(r.reasons.some((x) => x.startsWith('gender_haiku'))).toBe(false);
  });
});
