/**
 * The pool-headroom guard is the throttle that keeps a render/seed burst from taking
 * the whole app non-responsive (DB_CONNECTION_SATURATION_PLAN.md — a recurring
 * incident class, not a hypothetical).
 *
 * THE HOLE THIS FILE EXISTS FOR (found 2026-09-16): the snapshot it reads is written
 * BY pg_cron. When the database is in trouble the cron stops, so the snapshot goes
 * stale — the guard is uninformed exactly when it matters — and `waitForHeadroom`
 * then FAILS OPEN and proceeds anyway. Seen for real during a ~7-minute Postgres
 * restart (04:38-04:45 UTC) that left the newest snapshot 8 minutes old while the
 * pool was in fact fine at 34/90.
 *
 * The fix is to REMOVE the blindness rather than argue about the fallback: a stale
 * snapshot forces a live `capture_db_health()` (the same SECURITY DEFINER function
 * the cron calls) and re-reads. These tests lock that, and lock that a genuinely
 * unreachable database still backs off.
 */
import path from 'path';

type Row = { total_conn: number; max_connections: number; captured_at: string };

/** Loads poolHeadroom with a stubbed supabase client. Fresh module per case so the
 *  memoized client never leaks between tests. */
function loadWith(opts: {
  rows: Row[][]; // one entry per readSnapshot() call, in order
  rpc?: () => { error: { message: string } | null };
}) {
  const reads: number[] = [];
  const rpcCalls: string[] = [];
  let readIdx = 0;

  const builder = {
    select: () => builder,
    order: () => builder,
    limit: () => builder,
    single: () => {
      const rows = opts.rows[Math.min(readIdx, opts.rows.length - 1)];
      readIdx += 1;
      reads.push(readIdx);
      return Promise.resolve(
        rows.length ? { data: rows[0], error: null } : { data: null, error: null }
      );
    },
  };
  const client = {
    from: () => builder,
    rpc: (name: string) => {
      rpcCalls.push(name);
      return Promise.resolve(opts.rpc ? opts.rpc() : { error: null });
    },
  };

  jest.resetModules();
  jest.doMock('@supabase/supabase-js', () => ({ createClient: () => client }));
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require(path.join(__dirname, '..', '..', 'scripts', 'lib', 'poolHeadroom.js'));
  return { mod, rpcCalls, readCount: () => readIdx };
}

const freshRow = (total: number): Row => ({
  total_conn: total,
  max_connections: 90,
  captured_at: new Date().toISOString(),
});
const staleRow = (total: number): Row => ({
  total_conn: total,
  max_connections: 90,
  captured_at: new Date(Date.now() - 8 * 60_000).toISOString(), // 8 min — the real incident's age
});

afterEach(() => {
  jest.dontMock('@supabase/supabase-js');
  jest.resetModules();
});

describe('a fresh snapshot is used as-is', () => {
  it('reports real headroom and does NOT burn an RPC', async () => {
    const { mod, rpcCalls } = loadWith({ rows: [[freshRow(34)]] });
    const h = await mod.getHeadroom();
    expect(h.headroom).toBe(56);
    expect(h.stale).toBe(false);
    // The happy path is the hot path — it must stay a single cheap indexed read.
    expect(rpcCalls).toEqual([]);
  });
});

describe('a stale snapshot forces a live reading instead of guessing', () => {
  it('captures live and returns the REAL number, not "assume tight"', async () => {
    // This is the 2026-09-16 shape exactly: snapshot 8 min old, pool actually fine.
    const { mod, rpcCalls } = loadWith({ rows: [[staleRow(34)], [freshRow(34)]] });
    const h = await mod.getHeadroom();
    expect(rpcCalls).toEqual(['capture_db_health']);
    expect(h.headroom).toBe(56); // NOT 0 — the old code returned 0 here and blocked/bursted blind
    expect(h.stale).toBe(false);
    expect(h.refreshed).toBe(true);
  });

  it('does the same when there is no snapshot row at all', async () => {
    const { mod, rpcCalls } = loadWith({ rows: [[], [freshRow(70)]] });
    const h = await mod.getHeadroom();
    expect(rpcCalls).toEqual(['capture_db_health']);
    expect(h.headroom).toBe(20);
  });

  it('still reports TIGHT when the live reading really is tight', async () => {
    // The refresh must not become a way to wave bursts through.
    const { mod } = loadWith({ rows: [[staleRow(20)], [freshRow(80)]] });
    const h = await mod.getHeadroom();
    expect(h.headroom).toBe(10);
    expect(h.stale).toBe(false);
  });
});

describe('a genuinely unreachable database still backs off', () => {
  it('reports stale when the live capture itself fails', async () => {
    const { mod } = loadWith({
      rows: [[staleRow(34)]],
      rpc: () => ({ error: { message: 'connection refused' } }),
    });
    const h = await mod.getHeadroom();
    expect(h.stale).toBe(true);
    expect(h.headroom).toBe(0);
    expect(h.reason).toMatch(/live capture failed/);
  });

  it('reports stale when the capture succeeds but the re-read is still stale', async () => {
    const { mod } = loadWith({ rows: [[staleRow(34)], [staleRow(34)]] });
    const h = await mod.getHeadroom();
    expect(h.stale).toBe(true);
    expect(h.headroom).toBe(0);
  });
});
