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
  singleSwap: over.singleSwap ?? jest.fn().mockResolvedValue('SINGLE.jpg'),
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
});

// ── R2 — Haiku gender-confirm fallback ──────────────────────────────────────

describe('gender-confirm fallback (R2)', () => {
  it('gender_unconfirmed reject + Haiku confirms one-of-each → re-dispatch with override, same target', async () => {
    const dispatchDual = jest
      .fn()
      .mockResolvedValueOnce({
        swappedUrl: null,
        faceCount: 2,
        rejectReason: 'gender_unconfirmed:male/male',
      })
      .mockResolvedValueOnce({ swappedUrl: 'OVERRIDE.jpg', faceCount: 2 });
    const confirmGenders = jest.fn().mockResolvedValue({ left: 'male', right: 'female' });
    const deps = { ...makeDeps({ dispatchDual }), confirmGenders };
    const r = await genderSafeDualSwap('render.jpg', deps, { strict: false });
    expect(r.outcome).toBe('dual');
    expect(r.url).toBe('OVERRIDE.jpg');
    expect(confirmGenders).toHaveBeenCalledWith('render.jpg');
    expect(dispatchDual).toHaveBeenNthCalledWith(2, 'render.jpg', {
      left: 'male',
      right: 'female',
    });
    expect(deps.rerender).not.toHaveBeenCalled(); // no re-render burned
    expect(r.reasons).toContain('gender_confirm_haiku:male/female');
  });

  it('Haiku reads same-gender → unresolved, falls through to the re-render ladder', async () => {
    const dispatchDual = jest
      .fn()
      .mockResolvedValueOnce({
        swappedUrl: null,
        faceCount: 2,
        rejectReason: 'gender_unconfirmed:male/male',
      })
      .mockResolvedValueOnce({ swappedUrl: 'FRESH.jpg', faceCount: 2 });
    const confirmGenders = jest.fn().mockResolvedValue({ left: 'male', right: 'male' });
    const deps = { ...makeDeps({ dispatchDual }), confirmGenders };
    const r = await genderSafeDualSwap('render.jpg', deps, { strict: false });
    expect(r.url).toBe('FRESH.jpg');
    expect(deps.rerender).toHaveBeenCalledTimes(1);
    expect(r.reasons).toContain('gender_confirm_haiku_unresolved');
  });

  it('confirm throws → reason logged, ladder continues (fail-open)', async () => {
    const dispatchDual = jest
      .fn()
      .mockResolvedValueOnce({
        swappedUrl: null,
        faceCount: 2,
        rejectReason: 'gender_unconfirmed:female/female',
      })
      .mockResolvedValueOnce({ swappedUrl: 'FRESH.jpg', faceCount: 2 });
    const confirmGenders = jest.fn().mockRejectedValue(new Error('vision down'));
    const deps = { ...makeDeps({ dispatchDual }), confirmGenders };
    const r = await genderSafeDualSwap('render.jpg', deps, { strict: false });
    expect(r.url).toBe('FRESH.jpg');
    expect(r.reasons).toContain('gender_confirm_haiku_error');
  });

  it('no_split rejects do NOT trigger the confirm (wrong failure class)', async () => {
    const dispatchDual = jest
      .fn()
      .mockResolvedValueOnce({
        swappedUrl: null,
        faceCount: 1,
        rejectReason: 'no_split:lt2_faces',
      })
      .mockResolvedValueOnce({ swappedUrl: 'FRESH.jpg', faceCount: 2 });
    const confirmGenders = jest.fn();
    const deps = { ...makeDeps({ dispatchDual }), confirmGenders };
    await genderSafeDualSwap('render.jpg', deps, { strict: false });
    expect(confirmGenders).not.toHaveBeenCalled();
  });
});
