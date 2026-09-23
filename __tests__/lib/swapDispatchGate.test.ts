/**
 * dispatchDualFaceSwap + the swap capacity gate, RUN (not just source-guarded) — NIGHTLY_ROBUSTNESS_PLAN.md item 1.
 *
 * The slot must be taken BEFORE Fly is called and given back on EVERY exit (success, a Fly 5xx, a network throw),
 * or one bad swap would leak a slot until its lease expires and the nightly burst would queue behind a ghost.
 * A swap that never gets a slot must not call Fly at all. The gate is fail-open: switched off or erroring, the
 * swap runs exactly as before.
 */
jest.mock('@engine/engineConfig', () => ({ fetchEngineConfig: jest.fn() }));
jest.mock('@engine/faceSwap', () => ({
  ensureHttpsImageUrl: jest.fn(async (url: string) => ({ url, tempPath: null })),
}));

import { dispatchDualFaceSwap } from '@engine/dualSwapDispatch';
import { fetchEngineConfig } from '@engine/engineConfig';

const mockConfig = fetchEngineConfig as jest.MockedFunction<typeof fetchEngineConfig>;
type Cfg = Awaited<ReturnType<typeof fetchEngineConfig>>;
const setGate = (enabled: boolean) =>
  mockConfig.mockResolvedValue({ swapGateEnabled: enabled, swapGateMaxWaitMs: 45_000 } as Cfg);

type RpcCall = { fn: string; args: Record<string, unknown> };
function fakeSupabase(acquire: { data: unknown; error: { message: string } | null }) {
  const calls: RpcCall[] = [];
  const client = {
    rpc: jest.fn(async (fn: string, args: Record<string, unknown>) => {
      calls.push({ fn, args });
      return fn === 'acquire_swap_slot' ? acquire : { data: null, error: null };
    }),
    storage: { from: () => ({ remove: () => Promise.resolve({}) }) },
  };
  return { client, calls };
}

const okBody = JSON.stringify({
  swappedUrl: 'https://x/swapped.jpg',
  faceCount: 2,
  variant: 'dynamic',
});
const realFetch = global.fetch;
let fetchMock: jest.Mock;

beforeAll(() => {
  Object.defineProperty(globalThis, 'Deno', {
    configurable: true,
    value: {
      env: {
        get: (k: string) =>
          ({ DUAL_SWAP_FLY_URL: 'https://fly.invalid/swap', DUAL_SWAP_FLY_TOKEN: 't' })[k],
      },
    },
  });
});
afterAll(() => {
  Reflect.deleteProperty(globalThis, 'Deno');
  global.fetch = realFetch;
});
beforeEach(() => {
  mockConfig.mockReset();
  fetchMock = jest.fn();
  global.fetch = fetchMock;
});

// dispatchDualFaceSwap(left, right, target, replicateToken, supabase, userId, deadlineMs, skipPrimary, genders,
//                      traceId, genderOverride, bigFaceMaxHFrac, priority)
const call = (client: unknown, deadlineMs: number, priority: 'interactive' | 'batch' = 'batch') =>
  dispatchDualFaceSwap(
    'https://x/left.jpg',
    'https://x/right.jpg',
    'https://x/render.jpg',
    'r8',
    client as Parameters<typeof dispatchDualFaceSwap>[4],
    'user-1',
    deadlineMs,
    false,
    undefined,
    'job-1',
    null,
    null,
    priority
  );

it('takes a slot (with its priority) BEFORE calling Fly, and gives it back after a success', async () => {
  setGate(true);
  const { client, calls } = fakeSupabase({ data: 'lease-1', error: null });
  fetchMock.mockImplementation(async () => {
    // At the moment Fly is called, the slot is held and not yet released.
    expect(calls.map((c) => c.fn)).toEqual(['acquire_swap_slot']);
    return new Response(okBody, { status: 200 });
  });
  const r = await call(client, Date.now() + 90_000, 'interactive');
  expect(r.swappedUrl).toBe('https://x/swapped.jpg');
  expect(r.gateMode).toBe('acquired');
  expect(calls[0].args).toMatchObject({ p_priority: 'interactive', p_holder: 'job-1' });
  expect(calls[1]).toEqual({ fn: 'release_swap_slot', args: { p_id: 'lease-1' } });
});

it('gives the slot back when Fly answers 503 (and the error is a capacity error)', async () => {
  setGate(true);
  const { client, calls } = fakeSupabase({ data: 'lease-2', error: null });
  fetchMock.mockResolvedValue(new Response('busy', { status: 503 }));
  await expect(call(client, Date.now() + 90_000)).rejects.toThrow(/returned 503/);
  expect(calls.map((c) => c.fn)).toEqual(['acquire_swap_slot', 'release_swap_slot']);
});

it('gives the slot back when the Fly call itself throws (network / abort)', async () => {
  setGate(true);
  const { client, calls } = fakeSupabase({ data: 'lease-3', error: null });
  fetchMock.mockRejectedValue(new Error('The operation was aborted.'));
  await expect(call(client, Date.now() + 90_000)).rejects.toThrow(/aborted/);
  expect(calls.map((c) => c.fn)).toEqual(['acquire_swap_slot', 'release_swap_slot']);
});

it('no slot in time → swap_capacity_busy, and Fly is never called', async () => {
  setGate(true);
  const { client, calls } = fakeSupabase({ data: null, error: null });
  // Deadline so close there is no time to wait: the swap needs ~25 s once it starts.
  await expect(call(client, Date.now() + 10_000)).rejects.toThrow(/^swap_capacity_busy/);
  expect(fetchMock).not.toHaveBeenCalled();
  expect(calls.map((c) => c.fn)).toEqual(['acquire_swap_slot']);
});

it('gate switched off → no DB call, the swap runs exactly as before', async () => {
  setGate(false);
  const { client, calls } = fakeSupabase({ data: 'unused', error: null });
  fetchMock.mockResolvedValue(new Response(okBody, { status: 200 }));
  const r = await call(client, Date.now() + 90_000);
  expect(r.swappedUrl).toBe('https://x/swapped.jpg');
  expect(r.gateMode).toBe('disabled');
  expect(calls).toHaveLength(0);
});

it('FAIL-OPEN: a gate RPC error still runs the swap', async () => {
  setGate(true);
  const { client } = fakeSupabase({ data: null, error: { message: 'permission denied' } });
  fetchMock.mockResolvedValue(new Response(okBody, { status: 200 }));
  const r = await call(client, Date.now() + 90_000);
  expect(r.swappedUrl).toBe('https://x/swapped.jpg');
  expect(r.gateMode).toBe('gate_error');
});
