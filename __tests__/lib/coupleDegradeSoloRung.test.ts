/**
 * THE SOLO RUNG OF THE COUPLE LADDER — behavioural, not source-grep.
 *
 * Kevin's ladder (2026-09-17, watching a batch live): "it's supposed to fail back to a single on flux",
 * and then "it needs to construct it for a single - reroll from the cast".
 *
 * WHAT WAS BROKEN. `ensureSoloSwapTarget` probes attempt 0 BEFORE it re-renders anything. On the degrade
 * path attempt 0 is the COUPLE render that just failed its dual split — two people still in frame. So the
 * probe reads `solo_multi_face(faces=2)`, the guard returns unsafe, and the `rerender` callback that builds
 * a genuine single from the cast is never invoked. With `maxRerenders: 0` that is the ONLY iteration, so
 * the rung could not fire by construction.
 *
 * Measured on 5 consecutive organic couples, all identical:
 *   dual_degrade_single:attempt1 -> degrade_solo_multi_face(faces=2) -> degrade_solo_swap_unsafe
 *   -> dual_degrade_single:attempt1_refused_gender -> policy:couple:2:gemini-2-image:chain_2of2
 * The ladder read "couple on flux -> a solo attempt that always refuses -> couple on GEMINI", which is why
 * an 85/15 split kept shipping gemini couples. A code comment claimed the opposite behaviour.
 *
 * The source guard in coupleFallbackLadder.test.ts pins the call site's number. THIS file pins the actual
 * behaviour, so the rung stays reachable even if the call site is refactored somewhere else entirely.
 */
jest.mock('@engine/vision', () => ({ classifyDualGenders: jest.fn() }));

import { classifyDualGenders } from '@engine/vision';
import { ensureSoloSwapTarget } from '@engine/singleSwapGuard';

const mockClassify = classifyDualGenders as jest.Mock;
const read = (
  left: 'male' | 'female' | null,
  right: 'male' | 'female' | null,
  faceCount: number | null
) => ({ left, right, faceCount, twoDistinctFaces: faceCount === 2 });

/** The failed couple render: two people, mixed genders — exactly what the degrade path is handed. */
const FAILED_COUPLE = read('female', 'male', 2);
/** What assembleSoloFallbackFromDual produces: one person, cast gender, alone. */
const REBUILT_SOLO = read('male', null, 1);

const deps = (rerender: jest.Mock) => ({
  castGender: 'male' as const,
  replicateToken: 'tok',
  rerender,
  log: () => {},
});

beforeEach(() => mockClassify.mockReset());

describe('the solo rung actually fires', () => {
  it('re-renders a single when the couple image probes as multi-face', async () => {
    mockClassify.mockResolvedValueOnce(FAILED_COUPLE).mockResolvedValueOnce(REBUILT_SOLO);
    const rerender = jest.fn(async () => ({ url: 'rebuilt-solo', predictionId: 'p-solo' }));
    const r = await ensureSoloSwapTarget('failed-couple', deps(rerender), { maxRerenders: 1 });

    expect(rerender).toHaveBeenCalledTimes(1);
    expect(r.safe).toBe(true);
  });

  it('returns the REBUILT url, so the face swap lands on the single and not the couple', async () => {
    // If this regressed to returning the original url, the swap would paste self onto the two-person
    // render — the 2026-08-05 "her face on the man" shape.
    mockClassify.mockResolvedValueOnce(FAILED_COUPLE).mockResolvedValueOnce(REBUILT_SOLO);
    const rerender = jest.fn(async () => ({ url: 'rebuilt-solo', predictionId: 'p-solo' }));
    const r = await ensureSoloSwapTarget('failed-couple', deps(rerender), { maxRerenders: 1 });

    expect(r.url).toBe('rebuilt-solo');
    expect(r.predictionId).toBe('p-solo');
  });

  it('stamps the re-render so forensics can tell the rung fired', async () => {
    mockClassify.mockResolvedValueOnce(FAILED_COUPLE).mockResolvedValueOnce(REBUILT_SOLO);
    const rerender = jest.fn(async () => ({ url: 'rebuilt-solo', predictionId: 'p' }));
    const r = await ensureSoloSwapTarget('failed-couple', deps(rerender), { maxRerenders: 1 });

    expect(r.reasons).toContain('rerender_for_solo');
  });
});

describe('maxRerenders: 0 is the bug, and it is the ONLY iteration', () => {
  it('never calls rerender, so the rebuilt single is unreachable', async () => {
    // This is the production behaviour up to 2026-09-17. Kept as an executable description of the defect:
    // if someone sets it back to 0, this test still passes but the one above fails — which is the pair
    // that makes the cause obvious rather than just "the ladder broke".
    mockClassify.mockResolvedValue(FAILED_COUPLE);
    const rerender = jest.fn(async () => ({ url: 'rebuilt-solo', predictionId: 'p' }));
    const r = await ensureSoloSwapTarget('failed-couple', deps(rerender), { maxRerenders: 0 });

    expect(rerender).not.toHaveBeenCalled();
    expect(r.safe).toBe(false);
  });
});

describe('the rung never trades safety for a delivery', () => {
  it('a rebuild that STILL shows two mixed-gender faces stays unsafe', async () => {
    mockClassify.mockResolvedValue(FAILED_COUPLE);
    const rerender = jest.fn(async () => ({ url: 'still-two', predictionId: 'p' }));
    const r = await ensureSoloSwapTarget('failed-couple', deps(rerender), { maxRerenders: 1 });

    expect(rerender).toHaveBeenCalledTimes(1);
    expect(r.safe).toBe(false);
    expect(r.reasons).toContain('solo_swap_unsafe');
  });

  it('a rebuild showing the WRONG gender alone stays unsafe', async () => {
    mockClassify
      .mockResolvedValueOnce(FAILED_COUPLE)
      .mockResolvedValueOnce(read('female', null, 1));
    const rerender = jest.fn(async () => ({ url: 'wrong-gender', predictionId: 'p' }));
    const r = await ensureSoloSwapTarget('failed-couple', deps(rerender), { maxRerenders: 1 });

    expect(r.safe).toBe(false);
  });

  it('a re-render that throws does not crash the render — it settles unsafe and cascades', async () => {
    mockClassify.mockResolvedValue(FAILED_COUPLE);
    const rerender = jest.fn(async () => {
      throw new Error('replicate 500');
    });
    const r = await ensureSoloSwapTarget('failed-couple', deps(rerender), { maxRerenders: 1 });

    expect(r.safe).toBe(false);
  });
});

describe('the rung does not fire when it is not needed', () => {
  it('a couple render that already probes as a safe single is swapped as-is', async () => {
    mockClassify.mockResolvedValue(REBUILT_SOLO);
    const rerender = jest.fn(async () => ({ url: 'unused', predictionId: 'p' }));
    const r = await ensureSoloSwapTarget('already-solo', deps(rerender), { maxRerenders: 1 });

    expect(rerender).not.toHaveBeenCalled();
    expect(r.safe).toBe(true);
    expect(r.url).toBe('already-solo');
  });
});
