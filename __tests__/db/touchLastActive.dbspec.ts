/**
 * LIVE-DB test for touch_last_active() (migration 224).
 *
 * The activity heartbeat the app fires on every AppState 'active' transition.
 * send-push reads users.last_active_at and skips the Expo POST if it's within
 * the 30s threshold (the in-app indicators already cover it). So this RPC
 * has TWO contracts that matter:
 *
 *   1. It updates the caller's last_active_at to ~now() (the activity gate
 *      reads this value).
 *   2. It is SECURITY DEFINER + scoped to auth.uid() — caller A can't touch
 *      caller B's row. (If this regressed, anyone could perpetually suppress
 *      another user's pushes.)
 *
 * auth.uid() doesn't exist on vanilla PG, so the fixture stubs it via a session
 * GUC (the same pattern notificationOptIn.dbspec.ts uses).
 */

import { Pool, PoolClient } from 'pg';
import { makePool, migrationSql, extract } from './_support/pg';

const pool: Pool = makePool();
let db: PoolClient;

const ALICE = '00000000-0000-0000-0000-0000000000a1';
const BOB = '00000000-0000-0000-0000-0000000000b2';

async function actAs(uid: string): Promise<void> {
  await db.query("SELECT set_config('test.uid', $1, false)", [uid]);
}

async function lastActiveAt(userId: string): Promise<Date | null> {
  const { rows } = await db.query<{ last_active_at: Date | null }>(
    'SELECT last_active_at FROM public.users WHERE id = $1',
    [userId]
  );
  return rows[0]?.last_active_at ?? null;
}

beforeAll(async () => {
  db = await pool.connect();
  const sql = migrationSql('224_touch_last_active_rpc.sql');
  const touchFn = extract(sql, 'CREATE OR REPLACE FUNCTION public.touch_last_active', '$$;');

  // Stub auth.uid() to read a session GUC.
  await db.query('CREATE SCHEMA IF NOT EXISTS auth');
  await db.query(`CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE AS $fn$ SELECT nullif(current_setting('test.uid', true), '')::uuid $fn$`);

  await db.query('DROP TABLE IF EXISTS public.users CASCADE');
  await db.query(`CREATE TABLE public.users (
    id uuid PRIMARY KEY,
    last_active_at timestamptz
  )`);
  await db.query(touchFn);
});

afterAll(async () => {
  db.release();
  await pool.end();
});

beforeEach(async () => {
  await db.query('DELETE FROM public.users');
  await db.query(`INSERT INTO public.users (id, last_active_at) VALUES ($1, NULL), ($2, NULL)`, [
    ALICE,
    BOB,
  ]);
});

describe('touch_last_active', () => {
  it("sets the caller's last_active_at to ~now()", async () => {
    expect(await lastActiveAt(ALICE)).toBeNull();
    await actAs(ALICE);
    const before = Date.now();
    await db.query('SELECT public.touch_last_active()');
    const after = Date.now();
    const stamped = await lastActiveAt(ALICE);
    expect(stamped).not.toBeNull();
    const stampedMs = stamped!.getTime();
    // Allow a small clock skew between this Node process and Postgres; the
    // important assertion is "it landed in the window we just observed".
    expect(stampedMs).toBeGreaterThanOrEqual(before - 1000);
    expect(stampedMs).toBeLessThanOrEqual(after + 1000);
  });

  it("does NOT touch another user's row (auth.uid scoping)", async () => {
    // If this regressed, Alice could perpetually suppress Bob's pushes by
    // hammering touch_last_active in a loop. Make sure the WHERE clause
    // anchors to auth.uid().
    await actAs(ALICE);
    await db.query('SELECT public.touch_last_active()');
    expect(await lastActiveAt(BOB)).toBeNull();
  });

  it('a fresh call overwrites a previous timestamp (heartbeat semantics)', async () => {
    // The client debounces to ~10s, but the server-side write must always
    // overwrite — old value can't poison a later check.
    await actAs(ALICE);
    await db.query('SELECT public.touch_last_active()');
    const first = await lastActiveAt(ALICE);
    expect(first).not.toBeNull();
    // Manually backdate to simulate a stale value.
    await db.query(
      `UPDATE public.users SET last_active_at = now() - interval '1 hour' WHERE id = $1`,
      [ALICE]
    );
    const backdated = await lastActiveAt(ALICE);
    expect(backdated!.getTime()).toBeLessThan(first!.getTime());

    await db.query('SELECT public.touch_last_active()');
    const refreshed = await lastActiveAt(ALICE);
    expect(refreshed!.getTime()).toBeGreaterThan(backdated!.getTime());
  });

  it('is a no-op when auth.uid() is null (no session)', async () => {
    // The RPC is GRANT'd to authenticated; in practice unauthenticated calls
    // wouldn't reach it. But if they did, the UPDATE matches 0 rows — no error,
    // no side effect.
    await db.query("SELECT set_config('test.uid', '', false)");
    await db.query('SELECT public.touch_last_active()');
    expect(await lastActiveAt(ALICE)).toBeNull();
    expect(await lastActiveAt(BOB)).toBeNull();
  });
});
