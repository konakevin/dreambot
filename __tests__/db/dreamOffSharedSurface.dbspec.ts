/**
 * LIVE-DB test for the Dream Off shared-surface CHECK widenings (migration 401).
 *
 * Both CHECKs must be strict SUPERSETS — every existing value still passes, plus
 * the new Dream Off values. A regression that rebuilds either from a stale list
 * (silently dropping a value) fails here. Loads the REAL ALTER…ADD CONSTRAINT
 * statements from migration 401 so this validates the migration's SQL before it
 * touches the live dream_queue / notifications tables.
 */

import { Pool, PoolClient } from 'pg';
import { makePool, migrationSql, extract } from './_support/pg';

const pool: Pool = makePool();
let db: PoolClient;

const EXISTING_SOURCES = ['first_dream', 'nightly', 'create', 'dlt'];
const EXISTING_TYPES = ['dream_generated', 'post_mention', 'basic_reminder', 'sparkle_gift'];
const DREAM_OFF_TYPES = [
  'dream_off_invite',
  'dream_off_your_turn',
  'dream_off_voting_open',
  'dream_off_results',
  'dream_off_nudge',
  'dream_off_pot_refund',
];

beforeAll(async () => {
  db = await pool.connect();
  await db.query('DROP TABLE IF EXISTS public.dream_queue CASCADE');
  await db.query('DROP TABLE IF EXISTS public.notifications CASCADE');
  await db.query(
    'CREATE TABLE public.dream_queue (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), source text NOT NULL)'
  );
  await db.query(
    'CREATE TABLE public.notifications (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), type text NOT NULL)'
  );

  const sql = migrationSql('401_dream_off_shared_surface.sql');
  await db.query(
    extract(sql, 'ALTER TABLE public.dream_queue ADD CONSTRAINT dream_queue_source_check', '));')
  );
  await db.query(
    extract(sql, 'ALTER TABLE public.notifications ADD CONSTRAINT notifications_type_check', '));')
  );
});

afterAll(async () => {
  db.release();
  await pool.end();
});

describe('dream_queue.source CHECK (migration 401)', () => {
  it('accepts dream_off + every existing source (superset)', async () => {
    for (const s of [...EXISTING_SOURCES, 'dream_off']) {
      await expect(
        db.query('INSERT INTO public.dream_queue (source) VALUES ($1)', [s])
      ).resolves.toBeDefined();
    }
  });

  it('rejects an unknown source', async () => {
    await expect(
      db.query('INSERT INTO public.dream_queue (source) VALUES ($1)', ['garbage'])
    ).rejects.toThrow();
  });
});

describe('notifications.type CHECK (migration 401)', () => {
  it('accepts the 6 dream_off_* types + existing types (superset)', async () => {
    for (const t of [...DREAM_OFF_TYPES, ...EXISTING_TYPES]) {
      await expect(
        db.query('INSERT INTO public.notifications (type) VALUES ($1)', [t])
      ).resolves.toBeDefined();
    }
  });

  it('rejects an unknown type', async () => {
    await expect(
      db.query('INSERT INTO public.notifications (type) VALUES ($1)', ['garbage_type'])
    ).rejects.toThrow();
  });
});
