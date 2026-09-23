/**
 * LIVE-DB test for record_capacity_retry_pin (migration 553): a nightly couple re-queued for swap capacity keeps
 * its couple on the retry. Real function DDL from the migration file; stub dream_queue.
 */
import { Pool } from 'pg';
import { makePool, migrationSql, extract } from './_support/pg';

const pool: Pool = makePool();
const sql = migrationSql('553_capacity_retry_pin.sql');
const JOB = '11111111-1111-1111-1111-111111111111';

beforeAll(async () => {
  await pool.query('DROP TABLE IF EXISTS public.dream_queue CASCADE');
  await pool.query(`CREATE TABLE public.dream_queue (
    id uuid PRIMARY KEY, status text NOT NULL, payload jsonb
  )`);
  await pool.query(
    extract(sql, 'CREATE OR REPLACE FUNCTION public.record_capacity_retry_pin', '$$;')
  );
});

afterAll(async () => {
  await pool.end();
});

beforeEach(async () => {
  await pool.query('DELETE FROM public.dream_queue');
});

async function payload(): Promise<Record<string, unknown>> {
  const { rows } = await pool.query('SELECT payload FROM public.dream_queue WHERE id = $1', [JOB]);
  return rows[0].payload;
}

it('merges the pin into an in-progress job and keeps every other payload key', async () => {
  await pool.query(
    `INSERT INTO public.dream_queue (id, status, payload) VALUES ($1, 'in_progress', '{"redream": {"look_key": "x"}}')`,
    [JOB]
  );
  const { rows } = await pool.query('SELECT public.record_capacity_retry_pin($1, $2) AS ok', [
    JOB,
    'partner-1',
  ]);
  expect(rows[0].ok).toBe(true);
  expect(await payload()).toEqual({
    redream: { look_key: 'x' },
    capacity_retry: { cast_role: 'dual', partner_id: 'partner-1' },
  });
});

it('works on a null payload and a null partner', async () => {
  await pool.query(
    `INSERT INTO public.dream_queue (id, status, payload) VALUES ($1, 'in_progress', NULL)`,
    [JOB]
  );
  await pool.query('SELECT public.record_capacity_retry_pin($1, NULL)', [JOB]);
  expect(await payload()).toEqual({ capacity_retry: { cast_role: 'dual', partner_id: null } });
});

it('leaves a job that is no longer in_progress alone', async () => {
  await pool.query(
    `INSERT INTO public.dream_queue (id, status, payload) VALUES ($1, 'completed', '{}')`,
    [JOB]
  );
  const { rows } = await pool.query('SELECT public.record_capacity_retry_pin($1, $2) AS ok', [
    JOB,
    'p',
  ]);
  expect(rows[0].ok).toBe(false);
  expect(await payload()).toEqual({});
});
