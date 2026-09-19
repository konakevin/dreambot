/**
 * resolveHasRecipe — the two invariants from lib/bootRecipeResolver.ts:
 *   1. NEVER GUESS: only a confirmed read resolves true/false; failure → null.
 *   2. BOUNDED: per-attempt abort, bounded backoff, no attempt past the deadline.
 * Plus the recovery case the old loop could not do (backend returns later).
 */
import { resolveHasRecipe, type RecipeReadResult } from '@/lib/bootRecipeResolver';

const OK_TRUE: RecipeReadResult = { data: { has_ai_recipe: true }, error: null };
const OK_FALSE: RecipeReadResult = { data: { has_ai_recipe: false }, error: null };
const FAIL: RecipeReadResult = { data: null, error: new Error('fetch failed') };

function makeClock(start = 0) {
  let t = start;
  const sleeps: number[] = [];
  return {
    now: () => t,
    sleep: async (ms: number) => {
      sleeps.push(ms);
      t += ms;
    },
    advance: (ms: number) => {
      t += ms;
    },
    sleeps,
  };
}

type Clock = ReturnType<typeof makeClock>;

/** A reader that returns the scripted results in order (last one repeats). */
function scripted(results: RecipeReadResult[], clock: Clock, costMs = 0) {
  let i = 0;
  const callTimes: number[] = [];
  const read = jest.fn(async (_signal: AbortSignal): Promise<RecipeReadResult> => {
    callTimes.push(clock.now());
    clock.advance(costMs);
    const r = results[Math.min(i, results.length - 1)] as RecipeReadResult;
    i++;
    return r;
  });
  return { read, callTimes };
}

const BACKOFF = [1_000, 2_000, 4_000, 8_000] as const;

function opts(clock: Clock, read: (s: AbortSignal) => Promise<RecipeReadResult>, extra = {}) {
  return {
    read,
    isCancelled: () => false,
    deadlineMs: 45_000,
    timeoutMs: 10_000,
    backoffMs: BACKOFF,
    jitterMs: 1_000,
    random: () => 0,
    now: clock.now,
    sleep: clock.sleep,
    ...extra,
  };
}

describe('resolveHasRecipe — confirmed reads', () => {
  it('resolves true from one clean read', async () => {
    const clock = makeClock();
    const { read } = scripted([OK_TRUE], clock);
    await expect(resolveHasRecipe(opts(clock, read))).resolves.toBe(true);
    expect(read).toHaveBeenCalledTimes(1);
  });

  it('resolves false from one clean read (a CONFIRMED false is allowed → onboarding)', async () => {
    const clock = makeClock();
    const { read } = scripted([OK_FALSE], clock);
    await expect(resolveHasRecipe(opts(clock, read))).resolves.toBe(false);
  });

  it('a clean read with no row resolves false (matches the old `?? false`)', async () => {
    const clock = makeClock();
    const { read } = scripted([{ data: null, error: null }], clock);
    await expect(resolveHasRecipe(opts(clock, read))).resolves.toBe(false);
  });
});

describe('resolveHasRecipe — NEVER GUESS (sunnysteph invariant)', () => {
  it('any run of failures resolves null, never false', async () => {
    const clock = makeClock();
    const { read } = scripted([FAIL], clock);
    const result = await resolveHasRecipe(opts(clock, read));
    expect(result).toBeNull();
    expect(read.mock.calls.length).toBeGreaterThan(1);
  });

  it('a reader that THROWS is a failure, not a false', async () => {
    const clock = makeClock();
    const read = jest.fn(async () => {
      throw new Error('network down');
    });
    await expect(resolveHasRecipe(opts(clock, read))).resolves.toBeNull();
    expect(read.mock.calls.length).toBeGreaterThan(1); // it retried
  });
});

describe('resolveHasRecipe — BOUNDED (thundering-herd guard)', () => {
  it('follows the backoff schedule, then repeats the last value with jitter', async () => {
    const clock = makeClock();
    const { read } = scripted([FAIL], clock);
    await resolveHasRecipe(opts(clock, read, { random: () => 0.5, deadlineMs: 60_000 }));
    // [1000, 2000, 4000, 8000+500, 8500, ...]
    expect(clock.sleeps.slice(0, 5)).toEqual([1_000, 2_000, 4_000, 8_500, 8_500]);
  });

  it('never starts an attempt at or after the deadline', async () => {
    const clock = makeClock();
    const { read, callTimes } = scripted([FAIL], clock);
    await resolveHasRecipe(opts(clock, read));
    expect(callTimes.length).toBeGreaterThan(0);
    for (const t of callTimes) expect(t).toBeLessThan(45_000);
    // With zero jitter: 0, 1s, 3s, 7s, 15s, 23s, 31s, 39s → next would be 47s → stop.
    expect(callTimes).toEqual([0, 1_000, 3_000, 7_000, 15_000, 23_000, 31_000, 39_000]);
  });

  it('does not sleep past the deadline just to be refused (bails early)', async () => {
    const clock = makeClock();
    const { read } = scripted([FAIL], clock);
    await resolveHasRecipe(opts(clock, read));
    // The last sleep would have landed at 47s ≥ 45s, so it was never taken.
    expect(clock.now()).toBeLessThan(45_000);
  });

  it('makes ZERO attempts when the deadline has already passed', async () => {
    const clock = makeClock(50_000);
    const { read } = scripted([OK_TRUE], clock);
    await expect(resolveHasRecipe(opts(clock, read))).resolves.toBeNull();
    expect(read).not.toHaveBeenCalled();
  });

  it('stops immediately when cancelled mid-backoff', async () => {
    const clock = makeClock();
    let cancelled = false;
    const { read } = scripted([FAIL], clock);
    const result = await resolveHasRecipe(
      opts(clock, read, {
        isCancelled: () => cancelled,
        sleep: async (ms: number) => {
          cancelled = true; // the effect cleaned up while we were backing off
          clock.advance(ms);
        },
      })
    );
    expect(result).toBeNull();
    expect(read).toHaveBeenCalledTimes(1);
  });

  it('aborts a hung read at timeoutMs and retries', async () => {
    jest.useFakeTimers();
    try {
      const clock = makeClock();
      let firstSignal: AbortSignal | null = null;
      let calls = 0;
      const read = (signal: AbortSignal): Promise<RecipeReadResult> => {
        calls++;
        if (calls === 1) {
          firstSignal = signal;
          // Hangs forever unless aborted — the iOS 60s default would let it.
          return new Promise((_, reject) => {
            signal.addEventListener('abort', () => reject(new Error('AbortError')));
          });
        }
        return Promise.resolve(OK_TRUE);
      };
      const p = resolveHasRecipe(opts(clock, read));
      await jest.advanceTimersByTimeAsync(10_000);
      await expect(p).resolves.toBe(true);
      expect(firstSignal).not.toBeNull();
      expect((firstSignal as unknown as AbortSignal).aborted).toBe(true);
      expect(calls).toBe(2);
    } finally {
      jest.useRealTimers();
    }
  });
});

describe('resolveHasRecipe — recovery', () => {
  it('lets the user in when the backend comes back on a later attempt', async () => {
    // The old 5-attempt loop gave up and stranded the user on the logo forever.
    const clock = makeClock();
    const { read, callTimes } = scripted([FAIL, FAIL, FAIL, OK_TRUE], clock);
    await expect(resolveHasRecipe(opts(clock, read))).resolves.toBe(true);
    expect(read).toHaveBeenCalledTimes(4);
    expect(callTimes[3]).toBe(7_000); // recovered ~7s in, well before the hard state
  });

  it('reports each failed attempt to onAttempt with the elapsed time', async () => {
    const clock = makeClock();
    const { read } = scripted([FAIL, OK_TRUE], clock);
    const onAttempt = jest.fn();
    await resolveHasRecipe(opts(clock, read, { onAttempt }));
    expect(onAttempt).toHaveBeenCalledTimes(1);
    expect(onAttempt).toHaveBeenCalledWith({ attempt: 1, error: FAIL.error, elapsedMs: 0 });
  });
});
