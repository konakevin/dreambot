/**
 * LIVE-DB test for the swap capacity gate's semaphore (migration 549, NIGHTLY_ROBUSTNESS_PLAN.md item 1).
 *
 * acquire_swap_slot / release_swap_slot are the ONLY coordination the Fly dual-swap service has: if they let a
 * third swap in, the 10:18 nightly burst hits the measured 3-at-once failure cliff again; if a crashed render's
 * lease never expired, one crash would shrink capacity forever. This locks the slot count, the interactive
 * reserve, batch's guaranteed slot, expiry, and release — on the real DDL loaded from the migration file.
 */
import { Pool } from 'pg';
import { makePool, migrationSql, extract } from './_support/pg';

const pool: Pool = makePool();
const sql = migrationSql('549_swap_capacity_gate.sql');

async function setSlots(slots: number, reserve: number) {
  await pool.query(
    'UPDATE public.engine_config SET fly_dual_swap_slots = $1, fly_dual_swap_interactive_reserve = $2 WHERE id = 1',
    [slots, reserve]
  );
}
async function acquire(priority: 'interactive' | 'batch', ttlMs = 60_000): Promise<string | null> {
  const { rows } = await pool.query('SELECT public.acquire_swap_slot($1, $2, $3) AS id', [
    `test-${priority}`,
    priority,
    ttlMs,
  ]);
  return rows[0].id;
}

beforeAll(async () => {
  await pool.query('DROP TABLE IF EXISTS public.swap_slot_leases CASCADE');
  await pool.query('DROP TABLE IF EXISTS public.engine_config CASCADE');
  await pool.query(`CREATE TABLE public.engine_config (
    id integer PRIMARY KEY,
    fly_dual_swap_slots integer NOT NULL DEFAULT 2,
    fly_dual_swap_interactive_reserve integer NOT NULL DEFAULT 1
  )`);
  await pool.query('INSERT INTO public.engine_config (id) VALUES (1)');
  await pool.query(extract(sql, 'CREATE TABLE IF NOT EXISTS public.swap_slot_leases', ');'));
  await pool.query(extract(sql, 'CREATE OR REPLACE FUNCTION public.acquire_swap_slot', '$$;'));
  await pool.query(extract(sql, 'CREATE OR REPLACE FUNCTION public.release_swap_slot', '$$;'));
});

afterAll(async () => {
  await pool.end();
});

beforeEach(async () => {
  await pool.query('DELETE FROM public.swap_slot_leases');
  await setSlots(2, 1);
});

it('2 slots, 1 reserved: batch takes one, then waits; Create still gets the reserved slot', async () => {
  expect(await acquire('batch')).toEqual(expect.any(String));
  expect(await acquire('batch')).toBeNull(); // the nightly burst cannot take the second slot
  expect(await acquire('interactive')).toEqual(expect.any(String)); // a live Create can
  expect(await acquire('interactive')).toBeNull(); // and never a third swap at once
});

it('release frees the slot for the next caller', async () => {
  const a = await acquire('batch');
  expect(await acquire('batch')).toBeNull();
  await pool.query('SELECT public.release_swap_slot($1)', [a]);
  expect(await acquire('batch')).toEqual(expect.any(String));
});

it("a crashed holder's lease expires, so one crash never shrinks capacity for good", async () => {
  await pool.query(
    `INSERT INTO public.swap_slot_leases (holder, priority, expires_at)
     VALUES ('crashed-1', 'batch', now() - interval '1 second'),
            ('crashed-2', 'interactive', now() - interval '1 second')`
  );
  expect(await acquire('batch')).toEqual(expect.any(String));
  const { rows } = await pool.query(
    "SELECT count(*)::int AS n FROM public.swap_slot_leases WHERE holder LIKE 'crashed%'"
  );
  expect(rows[0].n).toBe(0);
});

it('batch always keeps at least one slot, whatever the reserve says', async () => {
  await setSlots(1, 1);
  expect(await acquire('batch')).toEqual(expect.any(String));
  expect(await acquire('interactive')).toBeNull();
});

it('reserve 0: batch may use every slot', async () => {
  await setSlots(3, 0);
  expect(await acquire('batch')).toEqual(expect.any(String));
  expect(await acquire('batch')).toEqual(expect.any(String));
  expect(await acquire('batch')).toEqual(expect.any(String));
  expect(await acquire('batch')).toBeNull();
});

it('the lease lifetime is clamped (5 s to 5 min), so a bad caller cannot pin a slot for hours', async () => {
  const id = await acquire('batch', 10 * 60 * 60 * 1000);
  const { rows } = await pool.query(
    'SELECT extract(epoch FROM expires_at - acquired_at) AS s FROM public.swap_slot_leases WHERE id = $1',
    [id]
  );
  expect(Number(rows[0].s)).toBeLessThanOrEqual(300.5);
});
