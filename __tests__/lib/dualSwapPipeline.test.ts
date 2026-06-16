/**
 * genderSafeDualSwap — the shared, fully-hardened dual face-swap orchestrator.
 * Kevin 2026-06-16: "code red catastrophic if the face swap ever fucks up or
 * fails." These tests lock every belt-and-suspenders branch: confirm → swap →
 * VERIFY the output → re-render+re-swap on verify-fail → gender-safe degrade,
 * plus deadline-aware load-shedding. The orchestrator NEVER returns a dual it
 * couldn't verify.
 */

jest.mock('@engine/vision', () => ({
  classifyDualGenders: jest.fn(),
}));

import { classifyDualGenders } from '@engine/vision';
import { genderSafeDualSwap } from '@engine/dualSwapPipeline';

const mockClassify = classifyDualGenders as jest.Mock;

const SELF_F = { sourceUrl: 'self-female.jpg', gender: 'female' as const, role: 'self' };
const PLUS_M = { sourceUrl: 'plus-male.jpg', gender: 'male' as const, role: 'plus_one' };

const read = (
  left: 'male' | 'female' | null,
  right: 'male' | 'female' | null,
  twoDistinctFaces: boolean,
  faceCount: number | null = twoDistinctFaces ? 2 : 1
) => ({ left, right, faceCount, twoDistinctFaces });

const makeDeps = (over: Partial<Record<string, jest.Mock>> = {}) => ({
  replicateToken: 'tok',
  dispatchDual: over.dispatchDual ?? jest.fn().mockResolvedValue('SWAPPED.jpg'),
  singleSwap: over.singleSwap ?? jest.fn().mockResolvedValue('SINGLE.jpg'),
  rerender:
    over.rerender ?? jest.fn().mockResolvedValue({ url: 'RERENDER.jpg', predictionId: 'p2' }),
});

beforeEach(() => mockClassify.mockReset());

it('HAPPY PATH — confirmed dual + output verifies → dual', async () => {
  // call 1 = route (female left, male right), call 2 = verify output (same).
  mockClassify
    .mockResolvedValueOnce(read('female', 'male', true))
    .mockResolvedValueOnce(read('female', 'male', true));
  const deps = makeDeps();
  const r = await genderSafeDualSwap(SELF_F, PLUS_M, 'render.jpg', deps, { strict: false });
  expect(r.outcome).toBe('dual');
  expect(r.url).toBe('SWAPPED.jpg');
  expect(r.verified).toBe(true);
  expect(deps.dispatchDual).toHaveBeenCalledTimes(1);
  expect(deps.dispatchDual).toHaveBeenCalledWith(SELF_F.sourceUrl, PLUS_M.sourceUrl, 'render.jpg');
  expect(deps.singleSwap).not.toHaveBeenCalled();
});

it('VERIFY FAILS → re-render + re-route + re-swap + re-verify → dual', async () => {
  mockClassify
    .mockResolvedValueOnce(read('female', 'male', true)) // route 1
    .mockResolvedValueOnce(read('male', 'male', true)) // verify 1 → BAD (two males on a mixed cast)
    .mockResolvedValueOnce(read('female', 'male', true)) // route 2 (post re-render)
    .mockResolvedValueOnce(read('female', 'male', true)); // verify 2 → good
  const deps = makeDeps();
  const r = await genderSafeDualSwap(SELF_F, PLUS_M, 'render.jpg', deps, { strict: false });
  expect(r.outcome).toBe('dual');
  expect(deps.rerender).toHaveBeenCalledTimes(1);
  expect(deps.dispatchDual).toHaveBeenCalledTimes(2);
  expect(r.reasons).toContain('dual_swap_verify_failed');
  expect(r.predictionId).toBe('p2');
});

it('UNCONFIRMED route → re-render → confirmed dual', async () => {
  mockClassify
    .mockResolvedValueOnce(read(null, null, false, null)) // route 1 → unreadable
    .mockResolvedValueOnce(read('female', 'male', true)) // route 2 (post re-render) → confirmed
    .mockResolvedValueOnce(read('female', 'male', true)); // verify
  const deps = makeDeps();
  const r = await genderSafeDualSwap(SELF_F, PLUS_M, 'render.jpg', deps, { strict: false });
  expect(r.outcome).toBe('dual');
  expect(deps.rerender).toHaveBeenCalledTimes(1);
});

it('STRICT + unconfirmable → cascade (no single swap, caller hard-fails to solo-self)', async () => {
  mockClassify
    .mockResolvedValueOnce(read(null, null, false, null)) // route 1
    .mockResolvedValueOnce(read(null, null, false, null)); // route 2 (post re-render) still unreadable
  const deps = makeDeps();
  const r = await genderSafeDualSwap(SELF_F, PLUS_M, 'render.jpg', deps, { strict: true });
  expect(r.outcome).toBe('cascade');
  expect(deps.singleSwap).not.toHaveBeenCalled();
  expect(deps.dispatchDual).not.toHaveBeenCalled();
});

it('NON-STRICT + unconfirmable → gender-safe single swap', async () => {
  mockClassify
    .mockResolvedValueOnce(read(null, null, false, null)) // route 1
    .mockResolvedValueOnce(read(null, null, false, null)); // route 2 still unreadable
  const deps = makeDeps();
  const r = await genderSafeDualSwap(SELF_F, PLUS_M, 'render.jpg', deps, { strict: false });
  expect(r.outcome).toBe('single');
  expect(r.url).toBe('SINGLE.jpg');
  expect(deps.singleSwap).toHaveBeenCalledWith(SELF_F.sourceUrl, expect.any(String)); // self is the safe default
});

it('DEADLINE exhausted → skips the re-render, degrades immediately', async () => {
  mockClassify.mockResolvedValueOnce(read(null, null, false, null)); // route 1 unconfirmed
  const deps = makeDeps();
  const r = await genderSafeDualSwap(SELF_F, PLUS_M, 'render.jpg', deps, {
    strict: false,
    deadlineMs: Date.now() + 1_000, // far less than the recover budget
  });
  expect(deps.rerender).not.toHaveBeenCalled(); // no time to re-render
  expect(r.reasons).toContain('recover_budget_exhausted');
  expect(r.outcome).toBe('single'); // degrades with what it has
});

it('all swap attempts fail → re-render escape → dual', async () => {
  mockClassify
    .mockResolvedValueOnce(read('female', 'male', true)) // route 1
    .mockResolvedValueOnce(read('female', 'male', true)) // route 2 (post recover re-render)
    .mockResolvedValueOnce(read('female', 'male', true)); // verify 2
  const dispatchDual = jest
    .fn()
    .mockRejectedValueOnce(new Error('no face found'))
    .mockRejectedValueOnce(new Error('no face found'))
    .mockRejectedValueOnce(new Error('no face found'))
    .mockResolvedValueOnce('SWAPPED2.jpg');
  const deps = makeDeps({ dispatchDual });
  const r = await genderSafeDualSwap(SELF_F, PLUS_M, 'render.jpg', deps, {
    strict: false,
    backoffMs: [0, 0],
  });
  expect(r.outcome).toBe('dual');
  expect(r.url).toBe('SWAPPED2.jpg');
  expect(deps.rerender).toHaveBeenCalledTimes(1);
});

it('same-sex cast (two males) → positional dual, never gender-confused', async () => {
  const PLUS_M2 = { sourceUrl: 'bro.jpg', gender: 'male' as const, role: 'plus_one' };
  mockClassify
    .mockResolvedValueOnce(read('male', 'male', true)) // route
    .mockResolvedValueOnce(read('male', 'male', true)); // verify (two males = correct for same-sex)
  const deps = makeDeps();
  const r = await genderSafeDualSwap(PLUS_M, PLUS_M2, 'render.jpg', deps, { strict: false });
  expect(r.outcome).toBe('dual');
});
