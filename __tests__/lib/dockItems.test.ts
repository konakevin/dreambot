import {
  deriveDockItems,
  inFlightIdleMs,
  isStaleInFlight,
  STALE_INFLIGHT_MS,
  DEFAULT_FINISHED_TTL_MS,
  type InFlightJob,
  type FinishedRingLike,
} from '@/lib/dockItems';

const T0 = 1_700_000_000_000; // fixed base ms (avoids Date.now())
const iso = (ms: number) => new Date(ms).toISOString();

// Small, explicit windows so the intent of each case is obvious.
const STALE = 600_000; // 10 min
const TTL = 1_700;

function job(id: string, createdAtMs: number, stageUpdatedAtMs?: number | null): InFlightJob {
  return {
    id,
    createdAt: iso(createdAtMs),
    stageUpdatedAt: stageUpdatedAtMs == null ? null : iso(stageUpdatedAtMs),
  };
}

function fin(
  jobId: string,
  kind: 'ready' | 'failed',
  createdAtMs: number,
  atMs: number
): FinishedRingLike {
  return { jobId, kind, createdAt: iso(createdAtMs), at: atMs };
}

describe('inFlightIdleMs', () => {
  it('is ~0 for a just-created job with no stage yet', () => {
    expect(inFlightIdleMs(job('a', T0), T0)).toBe(0);
  });

  it('measures from created_at when there is no stage stamp (queued)', () => {
    expect(inFlightIdleMs(job('a', T0 - 5_000, null), T0)).toBe(5_000);
  });

  it('measures from the LATER of created_at / stage_updated_at (recent stage = fresh)', () => {
    // Created 9 min ago but a stage advanced 3s ago → idle is 3s, not 9 min.
    expect(inFlightIdleMs(job('a', T0 - 9 * 60_000, T0 - 3_000), T0)).toBe(3_000);
  });

  it('uses created_at when the stage stamp is older than it (defensive)', () => {
    expect(inFlightIdleMs(job('a', T0 - 4_000, T0 - 10_000), T0)).toBe(4_000);
  });

  it('IGNORES a future stage stamp (clock skew) and falls back to created_at', () => {
    // A future stage stamp must not make the job look infinitely fresh.
    expect(inFlightIdleMs(job('a', T0 - 8_000, T0 + 60_000), T0)).toBe(8_000);
  });

  it('returns 0 (keep, do not judge) when both timestamps are in the future', () => {
    expect(inFlightIdleMs(job('a', T0 + 10_000, T0 + 20_000), T0)).toBe(0);
  });

  it('returns 0 (keep) on unparseable timestamps', () => {
    expect(inFlightIdleMs({ id: 'a', createdAt: 'not-a-date', stageUpdatedAt: 'nope' }, T0)).toBe(
      0
    );
  });
});

describe('isStaleInFlight boundary', () => {
  it('is NOT stale exactly AT the threshold', () => {
    expect(isStaleInFlight(job('a', T0 - STALE), T0, STALE)).toBe(false);
  });
  it('IS stale one ms past the threshold', () => {
    expect(isStaleInFlight(job('a', T0 - STALE - 1), T0, STALE)).toBe(true);
  });
  it('defaults to STALE_INFLIGHT_MS when no window is passed', () => {
    expect(isStaleInFlight(job('a', T0 - STALE_INFLIGHT_MS - 1), T0)).toBe(true);
    expect(isStaleInFlight(job('a', T0 - STALE_INFLIGHT_MS + 1), T0)).toBe(false);
  });
});

describe('deriveDockItems — basics', () => {
  const opts = { staleMs: STALE, finishedTtlMs: TTL };

  it('returns [] for empty inputs', () => {
    expect(deriveDockItems([], [], T0, opts)).toEqual([]);
  });

  it('shows a single fresh active ring', () => {
    const items = deriveDockItems([job('a', T0 - 5_000)], [], T0, opts);
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ jobId: 'a', finishedKind: null });
    expect(items[0].dream?.id).toBe('a');
  });

  it('shows a single finished ring within TTL', () => {
    const items = deriveDockItems([], [fin('a', 'ready', T0 - 5_000, T0 - 500)], T0, opts);
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ jobId: 'a', dream: null, finishedKind: 'ready' });
  });

  it('carries the failed kind through', () => {
    const items = deriveDockItems([], [fin('a', 'failed', T0 - 5_000, T0 - 500)], T0, opts);
    expect(items[0].finishedKind).toBe('failed');
  });
});

describe('deriveDockItems — the stale-dock guarantee (never sits on a phantom ring)', () => {
  const opts = { staleMs: STALE, finishedTtlMs: TTL };

  it('DROPS a zombie in-flight job idle past the stale window', () => {
    const items = deriveDockItems([job('zombie', T0 - STALE - 1)], [], T0, opts);
    expect(items).toEqual([]); // dock hides — self-heals
  });

  it('keeps a fresh job, drops a stale one, in the same set', () => {
    const items = deriveDockItems(
      [job('fresh', T0 - 10_000), job('stale', T0 - STALE - 60_000)],
      [],
      T0,
      opts
    );
    expect(items.map((i) => i.jobId)).toEqual(['fresh']);
  });

  it('does NOT drop a slow-but-progressing render (old created, recent stage)', () => {
    // 9 min old overall, but a stage advanced 2s ago → a legit long render, keep it.
    const items = deriveDockItems([job('slow', T0 - 9 * 60_000, T0 - 2_000)], [], T0, opts);
    expect(items.map((i) => i.jobId)).toEqual(['slow']);
  });

  it('drops a job frozen mid-render (stage stamp older than the window)', () => {
    // Entered a stage 11 min ago and never advanced → frozen → drop.
    const items = deriveDockItems([job('frozen', T0 - 20 * 60_000, T0 - STALE - 1)], [], T0, opts);
    expect(items).toEqual([]);
  });

  it('drops a job stuck in "queued" (no stage) past the window', () => {
    const items = deriveDockItems([job('stuckQueue', T0 - STALE - 1, null)], [], T0, opts);
    expect(items).toEqual([]);
  });

  it('self-heals over time: shown while fresh, hidden once it crosses the window', () => {
    const stuck = [job('stuck', T0)]; // no stage, never terminal
    // Right after enqueue: visible.
    expect(deriveDockItems(stuck, [], T0 + 30_000, opts)).toHaveLength(1);
    // Just before the window: still visible.
    expect(deriveDockItems(stuck, [], T0 + STALE, opts)).toHaveLength(1);
    // Past the window: gone, forever after.
    expect(deriveDockItems(stuck, [], T0 + STALE + 1, opts)).toEqual([]);
    expect(deriveDockItems(stuck, [], T0 + 60 * 60_000, opts)).toEqual([]);
  });
});

describe('deriveDockItems — finished ring TTL', () => {
  const opts = { staleMs: STALE, finishedTtlMs: TTL };

  it('drops a finished ring past its TTL', () => {
    const items = deriveDockItems([], [fin('a', 'ready', T0 - 5_000, T0 - TTL - 1)], T0, opts);
    expect(items).toEqual([]);
  });

  it('keeps a finished ring exactly one ms inside its TTL, drops it AT the TTL', () => {
    expect(deriveDockItems([], [fin('a', 'ready', T0, T0 - TTL + 1)], T0, opts)).toHaveLength(1);
    expect(deriveDockItems([], [fin('a', 'ready', T0, T0 - TTL)], T0, opts)).toEqual([]);
  });

  it('uses DEFAULT_FINISHED_TTL_MS when none is passed', () => {
    const withinDefault = fin('a', 'ready', T0, T0 - (DEFAULT_FINISHED_TTL_MS - 1));
    expect(deriveDockItems([], [withinDefault], T0, { staleMs: STALE })).toHaveLength(1);
  });
});

describe('deriveDockItems — dedup of a job in BOTH sets (mid-transition)', () => {
  const opts = { staleMs: STALE, finishedTtlMs: TTL };

  it('renders the finished ring only (never twice) when a job is active AND finished', () => {
    // Terminal event pushed a finished ring before useInFlightDreams refetched it away.
    const items = deriveDockItems(
      [job('x', T0 - 5_000)],
      [fin('x', 'ready', T0 - 5_000, T0 - 200)],
      T0,
      opts
    );
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ jobId: 'x', dream: null, finishedKind: 'ready' });
  });

  it('a terminal-then-expired job vanishes (not flipped back to active) while still in finished', () => {
    // Finished entry has aged past TTL but is still in the array; the active row is
    // still present (stale query). It must NOT reappear as an active ring.
    const items = deriveDockItems(
      [job('x', T0 - 5_000)],
      [fin('x', 'ready', T0 - 5_000, T0 - TTL - 1)],
      T0,
      opts
    );
    expect(items).toEqual([]);
  });

  it('once the finished entry is gone, a still-fresh active row CAN reappear (transient), then self-heals when stale', () => {
    // Models the flip-back window: finished ring removed from the store, but the
    // stale query still returns the (now-terminal) job. It briefly shows again...
    const fresh = deriveDockItems([job('x', T0 - 5_000)], [], T0, opts);
    expect(fresh).toHaveLength(1);
    // ...and is guaranteed to drop once it ages out, so it can't be permanent.
    const later = deriveDockItems([job('x', T0 - STALE - 1)], [], T0, opts);
    expect(later).toEqual([]);
  });
});

describe('deriveDockItems — ordering', () => {
  const opts = { staleMs: STALE, finishedTtlMs: TTL };

  it('orders oldest-first across active + finished by created_at', () => {
    const items = deriveDockItems(
      [job('mid', T0 - 3_000), job('newest', T0 - 1_000)],
      [fin('oldest', 'ready', T0 - 9_000, T0 - 200)],
      T0,
      opts
    );
    expect(items.map((i) => i.jobId)).toEqual(['oldest', 'mid', 'newest']);
  });
});

describe('deriveDockItems — mixed real-world snapshot', () => {
  it('filters, dedups, and orders all at once', () => {
    const opts = { staleMs: STALE, finishedTtlMs: TTL };
    const inFlight = [
      job('progressing', T0 - 8 * 60_000, T0 - 1_000), // slow but alive → keep
      job('zombie', T0 - STALE - 1), // frozen → drop
      job('dupe', T0 - 4_000), // also finished below → finished wins
      job('freshQueue', T0 - 2_000, null), // just queued → keep
    ];
    const finished = [
      fin('dupe', 'ready', T0 - 4_000, T0 - 300), // within TTL → finished ring
      fin('goneReady', 'ready', T0 - 6_000, T0 - TTL - 1), // expired → drop
    ];
    const items = deriveDockItems(inFlight, finished, T0, opts);
    // Kept: progressing (active), dupe (finished), freshQueue (active). Ordered by created_at.
    expect(items.map((i) => i.jobId)).toEqual(['progressing', 'dupe', 'freshQueue']);
    expect(items.find((i) => i.jobId === 'dupe')).toMatchObject({
      dream: null,
      finishedKind: 'ready',
    });
    expect(items.find((i) => i.jobId === 'progressing')?.finishedKind).toBeNull();
  });
});
