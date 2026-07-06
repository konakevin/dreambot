/**
 * singleSwapGuard — the guarantee that the SINGLE face-swap path never pastes a
 * cast face onto an invented second person or a wrong-gender figure (the
 * 2026-07-05 "wife's face on the man" incident). The single-swap models are
 * face-blind, so this guard probes the pre-swap render (face count + gender) and
 * only reports `safe` when a paste cannot land wrong.
 *
 * Regression lock: a future edit that drops the multi-face check, breaks the
 * gender match, loses the re-render budget, or flips a fail-closed default to
 * fail-open must break one of these tests.
 */

// Mock the vision probe so we control what the rendered image "reads" as.
jest.mock('@engine/vision', () => ({
  classifyDualGenders: jest.fn(),
}));

import { classifyDualGenders } from '@engine/vision';
import { ensureSoloSwapTarget } from '@engine/singleSwapGuard';

const mockClassify = classifyDualGenders as jest.Mock;

// classifyDualGenders's shape — the guard reads left/right/faceCount only.
const read = (
  left: 'male' | 'female' | null,
  right: 'male' | 'female' | null,
  faceCount: number | null
) => ({ left, right, faceCount, twoDistinctFaces: faceCount === 2 });

const makeDeps = (
  castGender: 'male' | 'female' | null,
  rerender = jest.fn(async () => ({ url: 'rerendered', predictionId: 'p1' }))
) => ({
  castGender,
  replicateToken: 'tok',
  rerender,
  log: () => {},
});

beforeEach(() => mockClassify.mockReset());

describe('ensureSoloSwapTarget — happy path', () => {
  it('one clean face matching the cast gender → safe, no re-render', async () => {
    mockClassify.mockResolvedValue(read('female', null, 1));
    const deps = makeDeps('female');
    const r = await ensureSoloSwapTarget('render', deps);
    expect(r.safe).toBe(true);
    expect(r.faceCount).toBe(1);
    expect(deps.rerender).not.toHaveBeenCalled();
  });

  it('one face + unknown cast gender → safe (an unknown gender can never mismatch)', async () => {
    mockClassify.mockResolvedValue(read('male', null, 1));
    const deps = makeDeps(null);
    const r = await ensureSoloSwapTarget('render', deps);
    expect(r.safe).toBe(true);
    expect(deps.rerender).not.toHaveBeenCalled();
  });
});

describe('ensureSoloSwapTarget — the invented-second-person failure', () => {
  it('two faces of the wrong gender → NEVER safe, re-renders up to the cap, then unsafe', async () => {
    // The exact "wife (female) solo prompt rendered a couple with a man" case.
    mockClassify.mockResolvedValue(read('female', 'male', 2));
    const deps = makeDeps('female');
    const r = await ensureSoloSwapTarget('render', deps, { maxRerenders: 2 });
    expect(r.safe).toBe(false);
    expect(deps.rerender).toHaveBeenCalledTimes(2); // attempt0 + 2 re-renders
    expect(mockClassify).toHaveBeenCalledTimes(3);
    expect(r.reasons).toContain('solo_swap_unsafe');
  });

  it('re-render recovers to a clean single face → safe', async () => {
    mockClassify
      .mockResolvedValueOnce(read('female', 'male', 2)) // couple
      .mockResolvedValueOnce(read('female', null, 1)); // clean solo after re-render
    const deps = makeDeps('female');
    const r = await ensureSoloSwapTarget('render', deps);
    expect(r.safe).toBe(true);
    expect(r.url).toBe('rerendered');
    expect(deps.rerender).toHaveBeenCalledTimes(1);
  });

  it('a single face of the WRONG gender is unsafe (scene replaced the character)', async () => {
    mockClassify.mockResolvedValue(read('male', null, 1));
    const deps = makeDeps('female');
    const r = await ensureSoloSwapTarget('render', deps, { maxRerenders: 1 });
    expect(r.safe).toBe(false);
    expect(r.reasons.some((x) => x.startsWith('solo_gender_mismatch'))).toBe(true);
  });
});

describe('ensureSoloSwapTarget — same-gender bystander is a quality miss, not a catastrophe', () => {
  it('two SAME-gender faces matching the cast → accepted at exhaustion (soft-safe)', async () => {
    // Both faces female + cast is female → a paste cannot land on a wrong gender.
    mockClassify.mockResolvedValue(read('female', 'female', 2));
    const deps = makeDeps('female');
    const r = await ensureSoloSwapTarget('render', deps, { maxRerenders: 2 });
    expect(r.safe).toBe(true);
    expect(r.reasons).toContain('solo_multiface_samegender_accepted');
    expect(deps.rerender).toHaveBeenCalledTimes(2); // it TRIED to get a clean solo first
  });

  it('two same-gender faces but cast gender UNKNOWN → not safe (cannot prove a match)', async () => {
    mockClassify.mockResolvedValue(read('female', 'female', 2));
    const deps = makeDeps(null);
    const r = await ensureSoloSwapTarget('render', deps, { maxRerenders: 1 });
    expect(r.safe).toBe(false);
  });
});

describe('ensureSoloSwapTarget — fail-closed / benefit-of-the-doubt boundaries', () => {
  it('zero faces → hard, re-renders, still unsafe if none appear', async () => {
    mockClassify.mockResolvedValue(read(null, null, 0));
    const deps = makeDeps('female');
    const r = await ensureSoloSwapTarget('render', deps, { maxRerenders: 1 });
    expect(r.safe).toBe(false);
    expect(deps.rerender).toHaveBeenCalledTimes(1);
  });

  it('a completely unreadable probe → benefit of the doubt (safe), no re-render', async () => {
    mockClassify.mockResolvedValue(read(null, null, null));
    const deps = makeDeps('female');
    const r = await ensureSoloSwapTarget('render', deps);
    expect(r.safe).toBe(true);
    expect(r.reasons).toContain('solo_probe_unread');
    expect(deps.rerender).not.toHaveBeenCalled();
  });

  it('vision THROWS → benefit of the doubt (safe), never blocks a good render on a probe outage', async () => {
    mockClassify.mockRejectedValue(new Error('vision 500'));
    const deps = makeDeps('female');
    const r = await ensureSoloSwapTarget('render', deps);
    expect(r.safe).toBe(true);
    expect(r.reasons).toContain('solo_probe_error');
    expect(deps.rerender).not.toHaveBeenCalled();
  });

  it('within the recover budget of the deadline → stops re-rendering instead of blowing the render timeout', async () => {
    mockClassify.mockResolvedValue(read('female', 'male', 2));
    const deps = makeDeps('female');
    // Deadline is closer than RECOVER_BUDGET_MS (75s) → no budget to re-render.
    const r = await ensureSoloSwapTarget('render', deps, {
      maxRerenders: 2,
      deadlineMs: Date.now() + 10_000,
    });
    expect(r.safe).toBe(false);
    expect(deps.rerender).not.toHaveBeenCalled();
    expect(r.reasons).toContain('solo_recover_budget_exhausted');
  });
});
