/**
 * SWAP CAPACITY GATE + CAPACITY RETRY (NIGHTLY_ROBUSTNESS_PLAN.md items 1 + 2, migration 549).
 *
 * Measured before this existed: 1-2 couples swapping at once → 0 errors in 21 nights; 3-4 at once → 31% swap
 * errors and 42% shipped as a solo, because nothing coordinated the Fly service and a swap error was never
 * retried. These tests lock: a swap WAITS for a slot inside its deadline; the gate is fail-open; a capacity
 * failure (busy / slow service) sends a nightly job back to the queue instead of shipping a solo, while content
 * failures keep today's ladder; and every caller is wired.
 */
import fs from 'fs';
import path from 'path';
import {
  acquireSwapSlot,
  releaseSwapSlot,
  isSwapCapacityError,
  SwapCapacityBusyError,
  SwapCapacityRetryError,
} from '@engine/swapCapacityGate';
import { genderSafeDualSwap } from '@engine/dualSwapPipeline';

type RpcResult = { data: unknown; error: { message: string } | null };
function fakeSupabase(results: RpcResult[]) {
  const calls: Array<{ fn: string; args: Record<string, unknown> }> = [];
  let i = 0;
  const client = {
    rpc: jest.fn(async (fn: string, args: Record<string, unknown>) => {
      calls.push({ fn, args });
      return results[Math.min(i++, results.length - 1)];
    }),
  };
  return { client, calls };
}
function clock(start = 1_000_000) {
  let t = start;
  return {
    now: () => t,
    sleep: async (ms: number) => {
      t += ms;
    },
  };
}
const ON = { enabled: true, maxWaitMs: 45_000 };

describe('acquireSwapSlot', () => {
  it('disabled → runs un-gated, never touches the DB', async () => {
    const { client, calls } = fakeSupabase([{ data: 'x', error: null }]);
    const r = await acquireSwapSlot(client, {
      priority: 'batch',
      holder: 'job-1',
      ttlMs: 60_000,
      waitUntilMs: Date.now() + 60_000,
      settings: { enabled: false, maxWaitMs: 45_000 },
    });
    expect(r).toEqual({ leaseId: null, waitedMs: 0, mode: 'disabled' });
    expect(calls).toHaveLength(0);
  });

  it('a free slot is taken at once, with the caller’s priority and lease lifetime', async () => {
    const { client, calls } = fakeSupabase([{ data: 'lease-1', error: null }]);
    const c = clock();
    const r = await acquireSwapSlot(client, {
      priority: 'interactive',
      holder: 'job-1',
      ttlMs: 90_000.4,
      waitUntilMs: c.now() + 60_000,
      settings: ON,
      ...c,
    });
    expect(r).toEqual({ leaseId: 'lease-1', waitedMs: 0, mode: 'acquired' });
    expect(calls[0]).toEqual({
      fn: 'acquire_swap_slot',
      args: { p_holder: 'job-1', p_priority: 'interactive', p_ttl_ms: 90_000 },
    });
  });

  it('a busy service → WAITS (polls) and takes the slot when it frees', async () => {
    const { client, calls } = fakeSupabase([
      { data: null, error: null },
      { data: null, error: null },
      { data: 'lease-2', error: null },
    ]);
    const c = clock();
    const r = await acquireSwapSlot(client, {
      priority: 'batch',
      holder: 'job-2',
      ttlMs: 60_000,
      waitUntilMs: c.now() + 60_000,
      settings: ON,
      ...c,
    });
    expect(r.mode).toBe('acquired');
    expect(r.leaseId).toBe('lease-2');
    expect(r.waitedMs).toBe(3_000);
    expect(calls).toHaveLength(3);
  });

  it('no slot before the deadline → SwapCapacityBusyError (a capacity error), never a hang', async () => {
    const { client } = fakeSupabase([{ data: null, error: null }]);
    const c = clock();
    await expect(
      acquireSwapSlot(client, {
        priority: 'batch',
        holder: 'job-3',
        ttlMs: 60_000,
        waitUntilMs: c.now() + 10_000,
        settings: ON,
        ...c,
      })
    ).rejects.toBeInstanceOf(SwapCapacityBusyError);
  });

  it('the wait never exceeds swap_gate_max_wait_ms even with a far deadline', async () => {
    const { client, calls } = fakeSupabase([{ data: null, error: null }]);
    const c = clock();
    const t0 = c.now();
    await expect(
      acquireSwapSlot(client, {
        priority: 'batch',
        holder: 'job-4',
        ttlMs: 60_000,
        waitUntilMs: t0 + 600_000,
        settings: { enabled: true, maxWaitMs: 6_000 },
        ...c,
      })
    ).rejects.toThrow(/swap_capacity_busy/);
    expect(c.now() - t0).toBeLessThanOrEqual(6_000);
    expect(calls.length).toBeLessThanOrEqual(5);
  });

  it('FAIL-OPEN: an RPC error runs the swap un-gated instead of failing it', async () => {
    const { client } = fakeSupabase([
      { data: null, error: { message: 'function does not exist' } },
    ]);
    const c = clock();
    const r = await acquireSwapSlot(client, {
      priority: 'batch',
      holder: 'job-5',
      ttlMs: 60_000,
      waitUntilMs: c.now() + 60_000,
      settings: ON,
      ...c,
    });
    expect(r.mode).toBe('gate_error');
    expect(r.leaseId).toBeNull();
  });
});

describe('releaseSwapSlot', () => {
  it('releases a held lease', async () => {
    const { client, calls } = fakeSupabase([{ data: null, error: null }]);
    await releaseSwapSlot(client, 'lease-9');
    expect(calls).toEqual([{ fn: 'release_swap_slot', args: { p_id: 'lease-9' } }]);
  });
  it('nothing to release when the swap ran un-gated', async () => {
    const { client, calls } = fakeSupabase([{ data: null, error: null }]);
    await releaseSwapSlot(client, null);
    expect(calls).toHaveLength(0);
  });
  it('never throws (an unreleased lease expires on its own)', async () => {
    const client = {
      rpc: jest.fn(async (): Promise<RpcResult> => {
        throw new Error('network');
      }),
    };
    await expect(releaseSwapSlot(client, 'lease-10')).resolves.toBeUndefined();
  });
});

describe('isSwapCapacityError — busy service vs the image itself', () => {
  it.each([
    'swap_capacity_busy: no Fly swap slot after 45000ms',
    'face-swap-dual@fly returned 503 after 36823ms: ',
    'face-swap-dual@fly returned 502 after 12000ms: bad gateway',
    'face-swap-dual@fly returned 504 after 60000ms',
    'face-swap-dual@fly returned 500 after 50515ms: {"error":"Face swap timed out (cdingram)"}',
    'Signal timed out.',
    'TimeoutError: The operation timed out.',
    'The operation was aborted.',
  ])('capacity: %s', (m) => expect(isSwapCapacityError(m)).toBe(true));

  it.each([
    'face-swap-dual@fly returned 500 after 3000ms: {"error":"no face in source"}',
    'face-swap-dual@fly returned 400 after 20ms: bad request',
    'DUAL_SWAP_FLY_URL / DUAL_SWAP_FLY_TOKEN unset',
    'face-swap-dual@fly returned invalid JSON (200 after 900ms): <html>',
  ])('not capacity: %s', (m) => expect(isSwapCapacityError(m)).toBe(false));
});

describe('genderSafeDualSwap — what a capacity failure does', () => {
  const deps = (dispatchDual: jest.Mock) => ({
    dispatchDual,
    singleSwap: jest.fn().mockResolvedValue({ url: 'SINGLE.jpg', predictionId: 'solo' }),
    rerender: jest.fn().mockResolvedValue({ url: 'RERENDER.jpg', predictionId: 'p2' }),
    selfSource: 'self.jpg',
  });
  const busy = () =>
    jest.fn().mockRejectedValue(new Error('face-swap-dual@fly returned 503 after 36823ms: '));

  it("'retry_later' (nightly with retries left): throws SwapCapacityRetryError, never ships a solo", async () => {
    const d = deps(busy());
    const err = await genderSafeDualSwap('render.jpg', d, {
      strict: false,
      maxRerenders: 1,
      capacityFailure: 'retry_later',
    }).catch((e) => e);
    expect(err).toBeInstanceOf(SwapCapacityRetryError);
    expect(err.message).toMatch(/^nightly_swap_capacity_retry: face-swap-dual@fly returned 503/);
    expect(err.reasons).toEqual(
      expect.arrayContaining([
        'dual_target:0:render.jpg',
        expect.stringMatching(/^dual_swap_error:face-swap-dual@fly returned 503/),
        'swap_capacity_retry_later',
      ])
    );
    expect(d.singleSwap).not.toHaveBeenCalled();
    expect(d.rerender).not.toHaveBeenCalled();
  });

  it("default 'degrade' (Create, or no retries left): today's ladder, no throw", async () => {
    const d = deps(busy());
    const r = await genderSafeDualSwap('render.jpg', d, { strict: false, maxRerenders: 1 });
    expect(r.outcome).toBe('single');
    expect(r.reasons.some((x) => x.startsWith('dual_swap_error:'))).toBe(true);
    expect(r.reasons).not.toContain('swap_capacity_retry_later');
  });

  it('a CONTENT swap error keeps the re-render ladder even when retry_later is allowed', async () => {
    const dispatchDual = jest
      .fn()
      .mockRejectedValueOnce(
        new Error('face-swap-dual@fly returned 500 after 900ms: no face in source')
      )
      .mockResolvedValueOnce({ swappedUrl: 'SWAP2.jpg', faceCount: 2 });
    const d = deps(dispatchDual);
    const r = await genderSafeDualSwap('render.jpg', d, {
      strict: false,
      maxRerenders: 1,
      capacityFailure: 'retry_later',
    });
    expect(r.outcome).toBe('dual');
    expect(d.rerender).toHaveBeenCalledTimes(1);
  });

  it('a gate wait is stamped on the successful swap', async () => {
    const d = deps(
      jest.fn().mockResolvedValue({
        swappedUrl: 'SWAP.jpg',
        faceCount: 2,
        gateMode: 'acquired',
        gateWaitMs: 4500,
      })
    );
    const r = await genderSafeDualSwap('render.jpg', d, { strict: false });
    expect(r.reasons).toContain('swap_gate:acquired:4500');
  });
});

describe('wiring (source guards — the edge functions cannot run in jest)', () => {
  const ROOT = path.join(__dirname, '..', '..');
  const read = (p: string) => fs.readFileSync(path.join(ROOT, p), 'utf8');
  const strip = (s: string) => s.replace(/\s+/g, ' ');

  it('the dispatcher takes a slot before calling Fly and always gives it back', () => {
    const d = strip(read('supabase/functions/_shared/dualSwapDispatch.ts'));
    expect(d).toContain("priority: SwapPriority = 'batch' ): Promise<DualDispatchResult>");
    expect(d).toContain('const lease = await acquireSwapSlot(supabase, {');
    expect(d).toContain('await releaseSwapSlot(supabase, leaseId);');
    // the fetch budget is computed AFTER the wait, so waiting shrinks it instead of overrunning the deadline
    expect(d.indexOf('acquireSwapSlot(supabase')).toBeLessThan(d.indexOf('const fetchBudgetMs'));
  });

  it('Create swaps are interactive (may use the reserved slots)', () => {
    expect(strip(read('supabase/functions/generate-dream/index.ts'))).toContain(
      "(await fetchEngineConfig(supabase)).dualBigFaceMaxHFrac, // Swap capacity gate (mig 549): a user is watching, so Create may use the reserved slots. 'interactive' )"
    );
  });

  it('nightly re-queues a capacity failure only on the cron path, and logs why', () => {
    const n = strip(read('supabase/functions/nightly-dreams/index.ts'));
    expect(n).toContain("capacityFailure: capacityRetryAllowed ? 'retry_later' : 'degrade',");
    expect(n).toContain(
      'if (!queueJobId || isFirstDream || strict_face_swap || maxRetries <= 0) return false;'
    );
    expect(n).toContain('const capacityRetry = err instanceof SwapCapacityRetryError;');
    expect(n).toContain('if (capacityRetry) fallbackReasons.push(...err.reasons);');
  });

  it('migration 549 ships the gate and the retry INERT, and removes the arms-wide pose', () => {
    const m = read('supabase/migrations/549_swap_capacity_gate.sql');
    expect(m).toContain(
      'ADD COLUMN IF NOT EXISTS swap_gate_enabled boolean NOT NULL DEFAULT false'
    );
    expect(m).toContain(
      'ADD COLUMN IF NOT EXISTS nightly_swap_capacity_retries integer NOT NULL DEFAULT 0'
    );
    expect(m).toContain('UPDATE public.action_poses SET disabled = true WHERE id = 3508;');
    expect(m).toContain(
      'GRANT EXECUTE ON FUNCTION public.acquire_swap_slot(text, text, integer) TO service_role;'
    );
    expect(read('supabase/functions/_shared/pools/dual_actions.ts')).not.toContain(
      "'both with arms spread wide and open as if taking in a vast view"
    );
  });
});
