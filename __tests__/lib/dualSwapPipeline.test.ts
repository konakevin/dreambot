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

it('stamps the base render of every attempt (dual_target:<attempt>:<url>) for forensics', async () => {
  let n = 0;
  const dispatchDual = jest.fn(async () =>
    n++ === 0 ? { ok: false, reason: 'no_split', faces: 1 } : { ok: true, url: 'swapped.png' }
  );
  const deps = makeDeps({ dispatchDual, rerender: async () => ({ url: 'render-2.png' }) });
  const r = await genderSafeDualSwap('render-1.png', deps, { strict: false });
  expect(r.reasons).toContain('dual_target:0:render-1.png');
  expect(r.reasons).toContain('dual_target:1:render-2.png');
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

// ── recoverBudgetMs — the solo-fallback reservation (Kevin 2026-08-28) ────────
// Callers that reserve a downstream solo-fallback window pass a SHORTER dual
// re-render reserve so the dual phase degrades early enough to leave the solo
// room. These lock that the reserve is honored.
it('DEFAULT 85s reserve skips the re-render when only ~50s remain → degrades early', async () => {
  const dispatchDual = jest.fn().mockResolvedValue({ swappedUrl: null, faceCount: 1 });
  const deps = makeDeps({ dispatchDual });
  const r = await genderSafeDualSwap('render.jpg', deps, {
    strict: false,
    deadlineMs: Date.now() + 50_000, // < the default 85s reserve
  });
  expect(deps.rerender).not.toHaveBeenCalled();
  expect(r.reasons).toContain('recover_budget_exhausted');
  expect(r.outcome).toBe('single'); // degrades (leaving the reserved solo window)
});

it('a SHORTER recoverBudgetMs lets the dual re-render inside the same ~50s window', async () => {
  const dispatchDual = jest
    .fn()
    .mockResolvedValueOnce({ swappedUrl: null, faceCount: 1 }) // attempt 0 fails
    .mockResolvedValueOnce({ swappedUrl: 'OK.jpg', faceCount: 2 }); // re-render succeeds
  const deps = makeDeps({ dispatchDual });
  const r = await genderSafeDualSwap('render.jpg', deps, {
    strict: false,
    deadlineMs: Date.now() + 50_000,
    recoverBudgetMs: 30_000, // 30s reserve fits inside the 50s window → re-render allowed
  });
  expect(deps.rerender).toHaveBeenCalledTimes(1);
  expect(r.outcome).toBe('dual');
  expect(r.url).toBe('OK.jpg');
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

describe('side check — a dual needs TWO agreeing reads (2026-09-12, wardrobeSides.ts)', () => {
  const read = (left: 'male' | 'female' | null, right: 'male' | 'female' | null) =>
    jest.fn().mockResolvedValue({ left, right });
  const MF = { left: 'male', right: 'female' } as const;
  it('off / unset: byte-identical — the gender read alone becomes the override, no side stamps', async () => {
    const deps = {
      ...makeDeps(),
      confirmGenders: read('male', 'female'),
      confirmSides: read('female', 'male'),
    };
    const r = await genderSafeDualSwap('render.jpg', deps, { strict: false });
    expect(r.outcome).toBe('dual');
    expect(deps.dispatchDual).toHaveBeenCalledWith('render.jpg', MF);
    expect(deps.confirmSides).not.toHaveBeenCalled();
    expect(r.reasons.some((x) => /^side_|gender_side/.test(x))).toBe(false);
  });
  it('shadow: a conflict is stamped and the swap STILL dispatches on the gender read', async () => {
    const deps = {
      ...makeDeps(),
      confirmGenders: read('male', 'female'),
      confirmSides: read('female', 'male'),
    };
    const r = await genderSafeDualSwap('render.jpg', deps, {
      strict: false,
      sideCheckMode: 'shadow',
    });
    expect(r.outcome).toBe('dual');
    expect(deps.dispatchDual).toHaveBeenCalledWith('render.jpg', MF);
    expect(r.reasons).toContain('side_haiku:female/male');
    expect(r.reasons).toContain('gender_side_conflict:g=male/female,s=female/male');
    expect(r.reasons.some((x) => x.startsWith('side_check_reject'))).toBe(false);
  });
  it('enforce + agree: dispatches with the override and stamps gender_side_agree', async () => {
    const deps = {
      ...makeDeps(),
      confirmGenders: read('male', 'female'),
      confirmSides: read('male', 'female'),
    };
    const r = await genderSafeDualSwap('render.jpg', deps, {
      strict: false,
      sideCheckMode: 'enforce',
    });
    expect(r.outcome).toBe('dual');
    expect(deps.dispatchDual).toHaveBeenCalledWith('render.jpg', MF);
    expect(r.reasons).toContain('gender_side_agree');
  });
  it('enforce + conflict on the first render → NO dispatch, re-render; agree on the second → dual on the re-render', async () => {
    const confirmSides = jest
      .fn()
      .mockResolvedValueOnce({ left: 'female', right: 'male' })
      .mockResolvedValueOnce({ left: 'male', right: 'female' });
    const deps = { ...makeDeps(), confirmGenders: read('male', 'female'), confirmSides };
    const r = await genderSafeDualSwap('render.jpg', deps, {
      strict: false,
      sideCheckMode: 'enforce',
    });
    expect(r.outcome).toBe('dual');
    expect(deps.rerender).toHaveBeenCalledTimes(1);
    expect(deps.dispatchDual).toHaveBeenCalledTimes(1);
    expect(deps.dispatchDual).toHaveBeenCalledWith('RERENDER.jpg', MF);
    expect(r.reasons).toContain('side_check_reject:conflict');
    expect(r.reasons).toContain('gender_side_agree');
  });
  it('enforce + conflict on every render → never dispatched → gender-safe single (non-strict)', async () => {
    const deps = {
      ...makeDeps(),
      confirmGenders: read('male', 'female'),
      confirmSides: read('female', 'male'),
    };
    const r = await genderSafeDualSwap('render.jpg', deps, {
      strict: false,
      sideCheckMode: 'enforce',
      maxRerenders: 2,
    });
    expect(r.outcome).toBe('single');
    expect(deps.dispatchDual).not.toHaveBeenCalled();
    expect(deps.rerender).toHaveBeenCalledTimes(2);
    expect(r.reasons.filter((x) => x === 'side_check_reject:conflict').length).toBe(3);
  });
  it('enforce + an unresolved wardrobe read → reject (a lone gender read never routes a dual)', async () => {
    const deps = {
      ...makeDeps(),
      confirmGenders: read('male', 'female'),
      confirmSides: jest.fn().mockResolvedValue(null),
    };
    const r = await genderSafeDualSwap('render.jpg', deps, {
      strict: false,
      sideCheckMode: 'enforce',
      maxRerenders: 0,
    });
    expect(r.outcome).toBe('single');
    expect(deps.dispatchDual).not.toHaveBeenCalled();
    expect(r.reasons).toContain('side_haiku_unresolved');
    expect(r.reasons).toContain('side_check_reject:unresolved');
  });
  it('enforce + an unresolved gender read → reject even with a confident wardrobe read (no engine-only routing)', async () => {
    const deps = {
      ...makeDeps(),
      confirmGenders: read(null, null),
      confirmSides: read('male', 'female'),
    };
    const r = await genderSafeDualSwap('render.jpg', deps, {
      strict: false,
      sideCheckMode: 'enforce',
      maxRerenders: 0,
    });
    expect(r.outcome).toBe('single');
    expect(deps.dispatchDual).not.toHaveBeenCalled();
    expect(r.reasons).toContain('side_check_reject:unresolved');
  });
  it('enforce without a confirmSides dep (no wardrobes) → single read kept, stamped side_check:none', async () => {
    const deps = { ...makeDeps(), confirmGenders: read('male', 'female') };
    const r = await genderSafeDualSwap('render.jpg', deps, {
      strict: false,
      sideCheckMode: 'enforce',
    });
    expect(r.outcome).toBe('dual');
    expect(deps.dispatchDual).toHaveBeenCalledWith('render.jpg', MF);
    expect(r.reasons).toContain('side_check:none');
  });
  it('enforce + the probe throws → stamped, treated as unresolved → reject', async () => {
    const deps = {
      ...makeDeps(),
      confirmGenders: read('male', 'female'),
      confirmSides: jest.fn().mockRejectedValue(new Error('vision down')),
    };
    const r = await genderSafeDualSwap('render.jpg', deps, {
      strict: false,
      sideCheckMode: 'enforce',
      maxRerenders: 0,
    });
    expect(r.outcome).toBe('single');
    expect(r.reasons).toContain('side_haiku_error');
    expect(r.reasons).toContain('side_check_reject:unresolved');
  });
});

describe('gender read face count (2026-09-12, the mural cross)', () => {
  it('a read that counted 3 faces is NOT an override — the engine routes on its own detection (no override arg)', async () => {
    const deps = {
      ...makeDeps(),
      confirmGenders: jest.fn().mockResolvedValue({ left: 'female', right: 'male', faceCount: 3 }),
    };
    const r = await genderSafeDualSwap('render.jpg', deps, { strict: false });
    expect(r.outcome).toBe('dual');
    expect(deps.dispatchDual).toHaveBeenCalledWith('render.jpg');
    expect(r.reasons).toContain('gender_haiku_facecount:3');
    expect(r.reasons).toContain('gender_haiku_unresolved');
    expect(r.reasons.some((x) => x.startsWith('gender_haiku:'))).toBe(false);
  });
  it('faceCount 2 or absent keeps the override exactly as before', async () => {
    for (const faceCount of [2, null, undefined]) {
      const deps = {
        ...makeDeps(),
        confirmGenders: jest.fn().mockResolvedValue({ left: 'male', right: 'female', faceCount }),
      };
      const r = await genderSafeDualSwap('render.jpg', deps, { strict: false });
      expect(deps.dispatchDual).toHaveBeenCalledWith('render.jpg', {
        left: 'male',
        right: 'female',
      });
      expect(r.reasons).toContain('gender_haiku:male/female');
    }
  });
  it('enforce: a 3-face read is unresolved → rejected even when the wardrobe read is confident', async () => {
    const deps = {
      ...makeDeps(),
      confirmGenders: jest.fn().mockResolvedValue({ left: 'female', right: 'male', faceCount: 3 }),
      confirmSides: jest.fn().mockResolvedValue({ left: 'female', right: 'male' }),
    };
    const r = await genderSafeDualSwap('render.jpg', deps, {
      strict: false,
      sideCheckMode: 'enforce',
      maxRerenders: 0,
    });
    expect(r.outcome).toBe('single');
    expect(deps.dispatchDual).not.toHaveBeenCalled();
    expect(r.reasons).toContain('side_check_reject:unresolved');
  });
});

describe('identityMinSim override (parity loop round 7)', () => {
  it('a 0.45 dual re-renders under a 0.5 bar and ships when the re-render clears it; without the override it ships as-is', async () => {
    const dispatchDual = jest
      .fn()
      .mockResolvedValueOnce({
        swappedUrl: 'WEAK.jpg',
        faceCount: 2,
        identity: { left: 0.45, right: 0.49, ms: 1 },
      })
      .mockResolvedValueOnce({
        swappedUrl: 'GOOD.jpg',
        faceCount: 2,
        identity: { left: 0.7, right: 0.72, ms: 1 },
      });
    const deps = makeDeps({ dispatchDual });
    const r = await genderSafeDualSwap('render.jpg', deps, { strict: false, identityMinSim: 0.5 });
    expect(r.outcome).toBe('dual');
    expect(r.url).toBe('GOOD.jpg');
    expect(deps.rerender).toHaveBeenCalledTimes(1);
    expect(r.reasons).toContain('identity_below_threshold:0.45<0.5');
    // default (no env in jest → shadow, null threshold): the weak swap ships first try
    const deps2 = makeDeps({
      dispatchDual: jest.fn().mockResolvedValue({
        swappedUrl: 'WEAK.jpg',
        faceCount: 2,
        identity: { left: 0.45, right: 0.49, ms: 1 },
      }),
    });
    const r2 = await genderSafeDualSwap('render.jpg', deps2, { strict: false });
    expect(r2.url).toBe('WEAK.jpg');
    expect(deps2.rerender).not.toHaveBeenCalled();
  });

  it('never stamps a base64 data URI into fallback_reasons (it broke the forensics column)', () => {
    // gemini and grok return data: URIs. Stamping them put 56 MB across 34 of 120 sampled log rows and made a
    // plain select over recent renders hit the statement timeout — breaking check-forensics.js and the
    // dream_forensics RPCs, which read exactly that column. A data URI is not fetchable later, so it is not worth
    // storing; the stamp records that the attempt happened.
    const huge = 'data:image/png;base64,' + 'A'.repeat(50_000);
    const url = 'https://example.com/render.jpg';
    const stamp = (t: string, n: number) =>
      t.startsWith('data:') ? `dual_target:${n}:inline` : `dual_target:${n}:${t}`;
    expect(stamp(huge, 0)).toBe('dual_target:0:inline');
    expect(stamp(huge, 0).length).toBeLessThan(40);
    expect(stamp(url, 1)).toBe(`dual_target:1:${url}`);
  });
});

/**
 * LADDER ORDER (Kevin, 2026-09-17): "a flux couple failure falls back to a flux single, then to gemini".
 *
 * The rung has to be attempted on the CURRENT model before deps.rerender walks the model chain. If the
 * order inverts, an 85/15 split ships mostly gemini couples, because every flux couple that fails its
 * split is handed to the next model instead of being delivered as a flux single. That is exactly what
 * production did until 2026-09-17 — though there the cause was the solo rung silently refusing rather
 * than the order (see coupleDegradeSoloRung.test.ts). Both have to hold for the ladder to work.
 */
describe('ladder order — the single on THIS model comes before the move to the next one', () => {
  it('calls singleSwap before rerender when soloBetweenAttempts is on', async () => {
    const calls: string[] = [];
    const deps = {
      dispatchDual: jest.fn(async () => {
        calls.push('dual');
        return { swappedUrl: null, faceCount: 1 };
      }),
      singleSwap: jest.fn(async () => {
        calls.push('single');
        return { url: 'SINGLE.jpg', predictionId: 'solo-pid' };
      }),
      rerender: jest.fn(async () => {
        calls.push('rerender');
        return { url: 'RERENDER.jpg', predictionId: 'p2' };
      }),
      selfSource: 'self.jpg',
    };
    const r = await genderSafeDualSwap('render.jpg', deps, {
      strict: false,
      degradeToSingle: true,
      maxRerenders: 1,
      soloBetweenAttempts: true,
    });

    expect(calls[0]).toBe('dual');
    expect(calls[1]).toBe('single');
    expect(r.outcome).toBe('single');
    // The point of the rung: it ships without ever moving models.
    expect(deps.rerender).not.toHaveBeenCalled();
  });

  it('only moves to the next model once the single on this one has REFUSED', async () => {
    const calls: string[] = [];
    let dualN = 0;
    const deps = {
      dispatchDual: jest.fn(async () => {
        calls.push('dual');
        return dualN++ === 0
          ? { swappedUrl: null, faceCount: 1 }
          : { swappedUrl: 'SWAP2.jpg', faceCount: 2 };
      }),
      // null = the gender guard refused (what a two-person image produces).
      singleSwap: jest.fn(async () => {
        calls.push('single');
        return null;
      }),
      rerender: jest.fn(async () => {
        calls.push('rerender');
        return { url: 'RERENDER.jpg', predictionId: 'p2' };
      }),
      selfSource: 'self.jpg',
    };
    await genderSafeDualSwap('render.jpg', deps, {
      strict: false,
      degradeToSingle: true,
      maxRerenders: 1,
      soloBetweenAttempts: true,
    });

    expect(calls.slice(0, 3)).toEqual(['dual', 'single', 'rerender']);
  });

  it('without soloBetweenAttempts the move comes first — Create and onboarding keep chasing the couple', async () => {
    const calls: string[] = [];
    let dualN = 0;
    const deps = {
      dispatchDual: jest.fn(async () => {
        calls.push('dual');
        return dualN++ === 0
          ? { swappedUrl: null, faceCount: 1 }
          : { swappedUrl: 'SWAP2.jpg', faceCount: 2 };
      }),
      singleSwap: jest.fn(async () => {
        calls.push('single');
        return { url: 'SINGLE.jpg', predictionId: 'solo-pid' };
      }),
      rerender: jest.fn(async () => {
        calls.push('rerender');
        return { url: 'RERENDER.jpg', predictionId: 'p2' };
      }),
      selfSource: 'self.jpg',
    };
    await genderSafeDualSwap('render.jpg', deps, {
      strict: false,
      degradeToSingle: true,
      maxRerenders: 1,
    });

    expect(calls.slice(0, 2)).toEqual(['dual', 'rerender']);
  });
});

/**
 * THE IDENTITY ARM OF THE LADDER (2026-09-17). The identity-below-threshold branch ends in `continue`,
 * which jumps past the solo rung at the bottom of the loop. So until this was fixed, the rung was
 * reachable ONLY from the no_dual_split path: a couple whose swap came back as the wrong person went
 * flux-couple -> gemini-couple with no single ever attempted.
 *
 * Measured on two consecutive organic couples (identity 0.069 and -0.017 — not the cast member at all),
 * both of which shipped as gemini couples.
 *
 * The floor is what keeps this from fighting the "a weak dual beats a degrade" rule: between the floor
 * and the threshold the dual is kept and shipped at exhaustion; only below the floor is it unusable.
 */
describe('identity failure also tries the single on this model first', () => {
  const identityDeps = (sims: number[], single: unknown) => {
    let i = 0;
    return {
      dispatchDual: jest.fn(async () => ({
        swappedUrl: 'SWAP.jpg',
        faceCount: 2,
        identity: {
          left: sims[Math.min(i, sims.length - 1)],
          right: sims[Math.min(i++, sims.length - 1)],
        },
      })),
      singleSwap: jest.fn(async () => single),
      rerender: jest.fn(async () => ({ url: 'RERENDER.jpg', predictionId: 'p2' })),
      selfSource: 'self.jpg',
    };
  };

  it('a dual BELOW the degrade floor degrades to a single instead of moving models', async () => {
    const deps = identityDeps([0.05], { url: 'SINGLE.jpg', predictionId: 'solo-pid' });
    const r = await genderSafeDualSwap('render.jpg', deps, {
      strict: false,
      degradeToSingle: true,
      maxRerenders: 1,
      soloBetweenAttempts: true,
      identityMinSim: 0.35,
      identityDegradeFloor: 0.25,
    });

    expect(deps.singleSwap).toHaveBeenCalled();
    expect(r.outcome).toBe('single');
    expect(deps.rerender).not.toHaveBeenCalled();
    expect(r.reasons.some((x) => x.startsWith('dual_degrade_single:identity'))).toBe(true);
  });

  it('a WEAK dual above the floor is still protected — no degrade, it ships at exhaustion', async () => {
    // 0.30 sits between the floor (0.25) and the threshold (0.35): both faces are present and
    // gender-routed, so the existing rule says keep it rather than drop the +1.
    const deps = identityDeps([0.3], { url: 'SINGLE.jpg', predictionId: 'solo-pid' });
    const r = await genderSafeDualSwap('render.jpg', deps, {
      strict: false,
      degradeToSingle: true,
      maxRerenders: 1,
      soloBetweenAttempts: true,
      identityMinSim: 0.35,
      identityDegradeFloor: 0.25,
    });

    expect(deps.singleSwap).not.toHaveBeenCalled();
    expect(r.outcome).toBe('dual');
    expect(r.reasons.some((x) => x.startsWith('identity_shipped_best'))).toBe(true);
  });

  it('when the single REFUSES, it still moves to the next model — and in that ORDER', async () => {
    // Order matters and a bare "both were called" assertion cannot see it: the pipeline ALWAYS runs a tail
    // degrade after the loop, so singleSwap is called either way. Only the sequence proves the identity arm
    // ran before the model move rather than after it.
    const calls: string[] = [];
    let i = 0;
    const deps = {
      dispatchDual: jest.fn(async () => {
        calls.push('dual');
        i++;
        return { swappedUrl: 'SWAP.jpg', faceCount: 2, identity: { left: 0.05, right: 0.05 } };
      }),
      singleSwap: jest.fn(async () => {
        calls.push('single');
        return null;
      }),
      rerender: jest.fn(async () => {
        calls.push('rerender');
        return { url: 'RERENDER.jpg', predictionId: 'p2' };
      }),
      selfSource: 'self.jpg',
    };
    await genderSafeDualSwap('render.jpg', deps, {
      strict: false,
      degradeToSingle: true,
      maxRerenders: 1,
      soloBetweenAttempts: true,
      identityMinSim: 0.35,
      identityDegradeFloor: 0.25,
    });

    expect(calls.slice(0, 3)).toEqual(['dual', 'single', 'rerender']);
    expect(i).toBeGreaterThan(1);
  });
});

describe('the chain with a couple re-render BEFORE the solo rung (soloFromAttempt, Kevin 2026-09-17 late)', () => {
  it('first couple fails → the couple is re-rendered on the same model → holds → dual, NO single tried', async () => {
    const dispatchDual = jest
      .fn()
      .mockResolvedValueOnce({ swappedUrl: null, faceCount: 1, rejectReason: 'no_split:lt2_faces' })
      .mockResolvedValueOnce({ swappedUrl: 'SWAP2.jpg', faceCount: 2 });
    const deps = makeDeps({ dispatchDual });
    const r = await genderSafeDualSwap('render.jpg', deps, {
      strict: false,
      maxRerenders: 2,
      soloBetweenAttempts: true,
      soloFromAttempt: 1,
    });
    expect(r.outcome).toBe('dual');
    expect(deps.rerender).toHaveBeenCalledTimes(1);
    expect(deps.rerender).toHaveBeenCalledWith(1);
    expect(deps.singleSwap).not.toHaveBeenCalled();
    expect(r.reasons).toContain('dual_attempts:2');
  });

  it('two couple failures → the single is tried on attempt 1 (before the model move) and wins', async () => {
    const dispatchDual = jest
      .fn()
      .mockResolvedValueOnce({ swappedUrl: null, faceCount: 1, rejectReason: 'no_split:lt2_faces' })
      .mockResolvedValueOnce({
        swappedUrl: null,
        faceCount: 0,
        rejectReason: 'no_split:lt2_faces',
      });
    const deps = makeDeps({ dispatchDual });
    const r = await genderSafeDualSwap('render.jpg', deps, {
      strict: false,
      maxRerenders: 2,
      soloBetweenAttempts: true,
      soloFromAttempt: 1,
    });
    expect(r.outcome).toBe('single');
    expect(deps.dispatchDual).toHaveBeenCalledTimes(2);
    expect(deps.rerender).toHaveBeenCalledTimes(1); // attempt 1 only; the single won before attempt 2
    expect(deps.singleSwap).toHaveBeenCalledTimes(1);
  });

  it('with the default (0) the solo rung still fires after the FIRST failure — Create keeps its behaviour', async () => {
    const dispatchDual = jest.fn().mockResolvedValueOnce({
      swappedUrl: null,
      faceCount: 1,
      rejectReason: 'no_split:lt2_faces',
    });
    const deps = makeDeps({ dispatchDual });
    const r = await genderSafeDualSwap('render.jpg', deps, {
      strict: false,
      maxRerenders: 2,
      soloBetweenAttempts: true,
    });
    expect(r.outcome).toBe('single');
    expect(deps.rerender).not.toHaveBeenCalled();
  });
});
