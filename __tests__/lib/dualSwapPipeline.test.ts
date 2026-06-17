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
