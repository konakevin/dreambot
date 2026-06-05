/**
 * LIVE-DB test for the upscale_requests partial unique index (migration 225).
 *
 * Guards the structural fix for the duplicate-download_ready-push bug Kevin
 * reported. Without this constraint, a double-tap / rapid client retry on
 * "Save in HD" would insert two upscale_requests rows for the same
 * (upload_id, user_id), and the notify loop would then fire two
 * download_ready pushes.
 *
 * Contract: at most ONE row per (upload_id, user_id) where notified_at IS
 * NULL. A user can still re-request the same upload AFTER a previous request
 * was notified — the partial predicate releases the index for that case.
 *
 * upscale-image's UPSERT (ON CONFLICT (upload_id, user_id) DO NOTHING)
 * silently collapses races on top of this constraint.
 */

import { Pool, PoolClient } from 'pg';
import { makePool, migrationSql, extract } from './_support/pg';

const pool: Pool = makePool();
let db: PoolClient;

const UPLOAD = '00000000-0000-0000-0000-0000000000aa';
const ALICE = '00000000-0000-0000-0000-0000000000a1';
const BOB = '00000000-0000-0000-0000-0000000000b2';

beforeAll(async () => {
  db = await pool.connect();
  const sql = migrationSql('225_dedup_download_ready.sql');
  const indexDdl = extract(
    sql,
    'CREATE UNIQUE INDEX IF NOT EXISTS uq_upscale_requests_pending',
    'WHERE notified_at IS NULL;'
  );

  // Minimal fixture — FK-stub uploads + users, real upscale_requests DDL
  // (rebuilt locally to avoid replaying migration 182's full history).
  await db.query('DROP TABLE IF EXISTS public.upscale_requests CASCADE');
  await db.query('DROP TABLE IF EXISTS public.uploads CASCADE');
  await db.query('DROP TABLE IF EXISTS public.users CASCADE');
  await db.query('CREATE TABLE public.uploads (id uuid PRIMARY KEY)');
  await db.query('CREATE TABLE public.users (id uuid PRIMARY KEY)');
  await db.query(`CREATE TABLE public.upscale_requests (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    upload_id   uuid NOT NULL REFERENCES public.uploads(id),
    user_id     uuid NOT NULL REFERENCES public.users(id),
    notified_at timestamptz,
    created_at  timestamptz NOT NULL DEFAULT now()
  )`);
  await db.query(indexDdl);
  await db.query('INSERT INTO public.uploads (id) VALUES ($1)', [UPLOAD]);
  await db.query('INSERT INTO public.users (id) VALUES ($1), ($2)', [ALICE, BOB]);
});

afterAll(async () => {
  db.release();
  await pool.end();
});

beforeEach(async () => {
  await db.query('DELETE FROM public.upscale_requests');
});

describe('uq_upscale_requests_pending — partial unique index', () => {
  it('blocks a second un-notified row for the same (upload, user)', async () => {
    // Alice's first request lands fine.
    await db.query(`INSERT INTO public.upscale_requests (upload_id, user_id) VALUES ($1, $2)`, [
      UPLOAD,
      ALICE,
    ]);
    // Her rapid second tap — should be rejected by the unique index.
    await expect(
      db.query(`INSERT INTO public.upscale_requests (upload_id, user_id) VALUES ($1, $2)`, [
        UPLOAD,
        ALICE,
      ])
    ).rejects.toThrow(/uq_upscale_requests_pending|duplicate key/);
  });

  it("does NOT block a different user's request for the same upload", async () => {
    // Multi-user upscale request flow: Alice and Bob each request the same
    // upload — both rows must coexist so each can be notified.
    await db.query(`INSERT INTO public.upscale_requests (upload_id, user_id) VALUES ($1, $2)`, [
      UPLOAD,
      ALICE,
    ]);
    await db.query(`INSERT INTO public.upscale_requests (upload_id, user_id) VALUES ($1, $2)`, [
      UPLOAD,
      BOB,
    ]);
    const { rows } = await db.query<{ n: string }>(
      `SELECT COUNT(*)::text AS n FROM public.upscale_requests WHERE upload_id=$1`,
      [UPLOAD]
    );
    expect(rows[0].n).toBe('2');
  });

  it('releases the slot once notified_at is set (re-request allowed)', async () => {
    // Alice's first request gets notified.
    await db.query(
      `INSERT INTO public.upscale_requests (upload_id, user_id, notified_at) VALUES ($1, $2, now())`,
      [UPLOAD, ALICE]
    );
    // A separate save session weeks later — un-notified row should land fine,
    // the partial predicate (WHERE notified_at IS NULL) doesn't match the
    // older row.
    await db.query(`INSERT INTO public.upscale_requests (upload_id, user_id) VALUES ($1, $2)`, [
      UPLOAD,
      ALICE,
    ]);
    const { rows } = await db.query<{ n: string }>(
      `SELECT COUNT(*)::text AS n FROM public.upscale_requests WHERE upload_id=$1 AND user_id=$2`,
      [UPLOAD, ALICE]
    );
    expect(rows[0].n).toBe('2');
  });

  it('the loser of a race sees a 23505 unique_violation (caught by upscale-image)', async () => {
    // The exact failure mode upscale-image catches: first INSERT lands, second
    // INSERT for the same (upload, user) raises Postgres code 23505. The Edge
    // Function treats this as "joined the existing request" and returns
    // {status: 'processing'} instead of a 500.
    await db.query(`INSERT INTO public.upscale_requests (upload_id, user_id) VALUES ($1, $2)`, [
      UPLOAD,
      ALICE,
    ]);
    try {
      await db.query(`INSERT INTO public.upscale_requests (upload_id, user_id) VALUES ($1, $2)`, [
        UPLOAD,
        ALICE,
      ]);
      throw new Error('expected unique_violation, got success');
    } catch (e) {
      // pg surfaces { code: '23505' } on unique_violation.
      expect((e as { code?: string }).code).toBe('23505');
    }
  });
});
