/**
 * LIVE-DB test for users.timezone (migration 431) — the column that drives
 * timezone-aware nightly delivery. Proves the column exists and works as expected:
 * it round-trips an IANA name, and it's nullable (users with no captured tz fall
 * back to the 08:00 UTC fire). Loads the REAL ALTER from migration 431.
 */

import { Pool, PoolClient } from 'pg';
import { makePool, migrationSql, extract } from './_support/pg';

const pool: Pool = makePool();
let db: PoolClient;

const WITH_TZ = '00000000-0000-0000-0000-0000000000t1';
const NO_TZ = '00000000-0000-0000-0000-0000000000t2';

beforeAll(async () => {
  db = await pool.connect();
  await db.query('DROP TABLE IF EXISTS public.users CASCADE');
  // Minimal users table, then apply the REAL migration-431 ALTER on top of it.
  await db.query('CREATE TABLE public.users (id uuid PRIMARY KEY)');
  const m431 = migrationSql('431_users_timezone.sql');
  await db.query(extract(m431, 'ALTER TABLE public.users', ';'));
});

afterAll(async () => {
  db.release();
  await pool.end();
});

describe('users.timezone (migration 431)', () => {
  it('the column exists (information_schema)', async () => {
    const { rows } = await db.query(
      `SELECT data_type, is_nullable FROM information_schema.columns
       WHERE table_schema='public' AND table_name='users' AND column_name='timezone'`
    );
    expect(rows).toHaveLength(1);
    expect(rows[0].data_type).toBe('text');
    expect(rows[0].is_nullable).toBe('YES');
  });

  it('round-trips an IANA timezone name', async () => {
    await db.query('INSERT INTO public.users (id, timezone) VALUES ($1, $2)', [
      WITH_TZ,
      'America/Los_Angeles',
    ]);
    const { rows } = await db.query('SELECT timezone FROM public.users WHERE id=$1', [WITH_TZ]);
    expect(rows[0].timezone).toBe('America/Los_Angeles');
  });

  it('is nullable — a user with no captured timezone stores NULL', async () => {
    await db.query('INSERT INTO public.users (id) VALUES ($1)', [NO_TZ]);
    const { rows } = await db.query('SELECT timezone FROM public.users WHERE id=$1', [NO_TZ]);
    expect(rows[0].timezone).toBeNull();
  });

  it('can be updated (the client self-syncs on travel/move)', async () => {
    await db.query('UPDATE public.users SET timezone=$2 WHERE id=$1', [WITH_TZ, 'Asia/Tokyo']);
    const { rows } = await db.query('SELECT timezone FROM public.users WHERE id=$1', [WITH_TZ]);
    expect(rows[0].timezone).toBe('Asia/Tokyo');
  });
});
