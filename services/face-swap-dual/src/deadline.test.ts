// Edge/Fly deadline alignment (NIGHTLY_ROBUSTNESS_PLAN.md item 6b, 2026-09-23). The engine used to work to at least
// receipt + 60 s even when the caller would give up sooner, and its Replicate poll counted polls instead of watching
// the clock (a 45 s cap ran ~50-55 s). Run: cd services/face-swap-dual/src && deno test --allow-net --allow-env
import { assert, assertEquals, assertRejects } from 'https://deno.land/std@0.224.0/assert/mod.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { effectiveSwapDeadline, faceSwapOnce, replicateBudgetMs } from './faceSwap.ts';

const T = 1_000_000;

Deno.test('works to the caller deadline + 4 s, not a 60 s floor (the drift)', () => {
  assertEquals(effectiveSwapDeadline(T + 30_000, T), T + 34_000);
  assertEquals(effectiveSwapDeadline(T + 70_000, T), T + 74_000);
});

Deno.test(
  'a tight re-swap keeps ~the old usable Replicate time; a normal one leaves room for a fallback',
  () => {
    // The live 09-23 failure: the caller had 32 s left. Old engine: 60 s floor, 15 s reserve, but the caller cut it at
    // 37 s, so Replicate had to finish by ~32 s. New: deadline 36 s, swap starts ~3 s in → 28 s (was 20 s).
    const tight = effectiveSwapDeadline(T + 32_000, T);
    assertEquals(replicateBudgetMs(tight, T + 3_000), 28_000);
    // A first swap with ~70 s left: 66 s, so a 45 s primary timeout still leaves 21 s (>= the 15 s fallback minimum).
    const normal = effectiveSwapDeadline(T + 70_000, T);
    assertEquals(replicateBudgetMs(normal, T + 3_000), 66_000);
    // Never below the 20 s floor.
    assertEquals(replicateBudgetMs(T + 10_000, T), 20_000);
  }
);

Deno.test(
  'a past deadline still gets 10 s; a huge one stops at the caller max wait; none = 60 s',
  () => {
    assertEquals(effectiveSwapDeadline(T - 5_000, T), T + 10_000);
    assertEquals(effectiveSwapDeadline(T + 200_000, T), T + 115_000);
    assertEquals(effectiveSwapDeadline(undefined, T), T + 60_000);
    assertEquals(effectiveSwapDeadline(Number.NaN, T), T + 60_000);
  }
);

const model = {
  name: 'test-model',
  version: 'v',
  buildInput: (s: string, t: string) => ({ s, t }),
  parseOutput: (o: unknown) => (typeof o === 'string' ? o : null),
};
// Built inside the tests that use it (no auth timers): a client created at load time starts a refresh timer that
// Deno's leak check then reports against whichever test runs first.
const makeClient = () =>
  createClient('http://localhost:1', 'test-key', {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
  });

/** A fake Replicate: every poll takes pollMs and reports `status`, until succeedOnPoll (if set). */
function fakeReplicate(pollMs: number, succeedOnPoll: number | null) {
  const calls: string[] = [];
  let polls = 0;
  const original = globalThis.fetch;
  globalThis.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
    const url = String(input instanceof Request ? input.url : input);
    calls.push(`${init?.method ?? 'GET'} ${url}`);
    if (url.endsWith('/predictions') && init?.method === 'POST') {
      return new Response(JSON.stringify({ id: 'pred-1' }), { status: 201 });
    }
    if (url.endsWith('/cancel')) return new Response('{}', { status: 200 });
    polls++;
    await new Promise((r) => setTimeout(r, pollMs));
    const done = succeedOnPoll !== null && polls >= succeedOnPoll;
    return new Response(
      JSON.stringify(
        done ? { status: 'succeeded', output: 'https://out/img.jpg' } : { status: 'processing' }
      ),
      { status: 200 }
    );
  }) as typeof fetch;
  return { calls, restore: () => (globalThis.fetch = original) };
}

Deno.test({
  name: 'a slow Replicate stops ON THE CLOCK and the abandoned prediction is cancelled',
  sanitizeOps: false,
  sanitizeResources: false,
  fn: async () => {
    const r = fakeReplicate(400, null);
    const t0 = Date.now();
    try {
      await assertRejects(
        () => faceSwapOnce('https://src', 'https://tgt', 'tok', makeClient(), 'u', model, 2_500),
        Error,
        'Face swap timed out (test-model)'
      );
      const elapsed = Date.now() - t0;
      // Counting polls, 3 polls x (1 s sleep + 0.4 s round trip) = 4.2 s. On the clock: <= 2.5 s + one round trip.
      assert(elapsed < 3_200, `stopped after ${elapsed} ms`);
      await new Promise((res) => setTimeout(res, 50));
      assert(
        r.calls.some((c) => c === 'POST https://api.replicate.com/v1/predictions/pred-1/cancel')
      );
    } finally {
      r.restore();
    }
  },
});

Deno.test({
  name: 'a prediction that succeeds returns its output and is not cancelled',
  sanitizeOps: false,
  sanitizeResources: false,
  fn: async () => {
    const r = fakeReplicate(50, 2);
    try {
      const url = await faceSwapOnce(
        'https://src',
        'https://tgt',
        'tok',
        makeClient(),
        'u',
        model,
        10_000
      );
      assertEquals(url, 'https://out/img.jpg');
      assert(!r.calls.some((c) => c.endsWith('/cancel')));
    } finally {
      r.restore();
    }
  },
});
