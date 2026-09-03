/**
 * LIVE-DB test for admin_quarantine_upload — the bad-render quarantine RPC
 * (migration 449).
 *
 * The Architect audit (2026-09-03, A6) flagged this gate as UNTESTED: the single
 * `is_admin = true` check is the only barrier stopping any authenticated user from
 * hiding any post in the app (quarantine flips is_public off). A guard exactly like
 * this regressed unnoticed once before (refund_sparkles), so the behavior gets a
 * lock, not just a content grep. This locks:
 *
 *   AUTH    — only an is_admin user may quarantine; a regular user is rejected for
 *             ANOTHER user's post AND their own; unauthenticated is rejected.
 *   EFFECT  — quarantine stamps quarantined_at + quarantine_reason (default
 *             'bad_render', custom honored) and flips is_public to false.
 *   SAFETY  — a rejected call mutates NOTHING; a nonexistent id is a no-op;
 *             re-quarantining is safe (no error, stamp refreshed).
 *
 * Loads the real DDL from migration 449 on top of stub tables + an auth.uid()
 * stub (mirrors refundSparkles.dbspec.ts).
 */

import { Pool } from 'pg';
import { makePool, migrationSql, extract } from './_support/pg';

const pool: Pool = makePool();

// Simple deterministic UUIDs.
function uid(n: number): string {
  return `00000000-0000-0000-0000-${String(n).padStart(12, '0')}`;
}

async function makeUser(id: string, isAdmin: boolean): Promise<string> {
  await pool.query('INSERT INTO public.users (id, is_admin) VALUES ($1, $2)', [id, isAdmin]);
  return id;
}

async function makeUpload(id: string, ownerId: string): Promise<string> {
  await pool.query('INSERT INTO public.uploads (id, user_id, is_public) VALUES ($1, $2, true)', [
    id,
    ownerId,
  ]);
  return id;
}

async function uploadState(id: string): Promise<{
  is_public: boolean;
  quarantined_at: Date | null;
  quarantine_reason: string | null;
}> {
  const r = await pool.query(
    'SELECT is_public, quarantined_at, quarantine_reason FROM public.uploads WHERE id = $1',
    [id]
  );
  return r.rows[0];
}

/** Call the RPC as `actingAs` (auth.uid() via the test.uid GUC). */
async function quarantineAs(
  actingAs: string | null,
  uploadId: string,
  reason?: string
): Promise<void> {
  await pool.query('SELECT set_config($1, $2, false)', ['test.uid', actingAs ?? '']);
  if (reason === undefined) {
    await pool.query('SELECT public.admin_quarantine_upload($1)', [uploadId]);
  } else {
    await pool.query('SELECT public.admin_quarantine_upload($1, $2)', [uploadId, reason]);
  }
}

beforeAll(async () => {
  const fn = extract(
    migrationSql('449_quarantine_bad_renders.sql'),
    'CREATE OR REPLACE FUNCTION public.admin_quarantine_upload',
    '$$;'
  );

  await pool.query('DROP TABLE IF EXISTS public.uploads CASCADE');
  await pool.query('DROP TABLE IF EXISTS public.users CASCADE');

  await pool.query(`CREATE TABLE public.users (
    id uuid PRIMARY KEY,
    is_admin boolean NOT NULL DEFAULT false
  )`);
  await pool.query(`CREATE TABLE public.uploads (
    id uuid PRIMARY KEY,
    user_id uuid NOT NULL,
    is_public boolean NOT NULL DEFAULT true,
    quarantined_at timestamptz,
    quarantine_reason text
  )`);

  // auth.uid() stub — reads the test.uid GUC (NULL when unset/empty).
  await pool.query('CREATE SCHEMA IF NOT EXISTS auth');
  await pool.query(
    `CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE
     AS $f$ SELECT NULLIF(current_setting('test.uid', true), '')::uuid $f$`
  );

  await pool.query(fn);
});

afterAll(async () => {
  await pool.end();
});

describe('admin_quarantine_upload (migration 449)', () => {
  it("ADMIN quarantines ANOTHER user's upload: is_public flips off, stamps land", async () => {
    const admin = await makeUser(uid(1), true);
    const owner = await makeUser(uid(2), false);
    const up = await makeUpload(uid(3), owner);

    await quarantineAs(admin, up);

    const s = await uploadState(up);
    expect(s.is_public).toBe(false);
    expect(s.quarantined_at).not.toBeNull();
    expect(s.quarantine_reason).toBe('bad_render'); // default reason
  });

  it('ADMIN quarantine honors a custom reason', async () => {
    const admin = await makeUser(uid(11), true);
    const owner = await makeUser(uid(12), false);
    const up = await makeUpload(uid(13), owner);

    await quarantineAs(admin, up, 'wrong_face');

    expect((await uploadState(up)).quarantine_reason).toBe('wrong_face');
  });

  it("NON-ADMIN quarantining another's post raises 'Not authorized' and mutates NOTHING", async () => {
    const regular = await makeUser(uid(21), false);
    const owner = await makeUser(uid(22), false);
    const up = await makeUpload(uid(23), owner);

    await expect(quarantineAs(regular, up)).rejects.toThrow(/Not authorized/);

    const s = await uploadState(up);
    expect(s.is_public).toBe(true);
    expect(s.quarantined_at).toBeNull();
    expect(s.quarantine_reason).toBeNull();
  });

  it('NON-ADMIN cannot quarantine even their OWN post', async () => {
    const regular = await makeUser(uid(31), false);
    const up = await makeUpload(uid(32), regular);

    await expect(quarantineAs(regular, up)).rejects.toThrow(/Not authorized/);
    expect((await uploadState(up)).quarantined_at).toBeNull();
  });

  it('UNAUTHENTICATED (auth.uid() null) is rejected', async () => {
    const owner = await makeUser(uid(41), false);
    const up = await makeUpload(uid(42), owner);

    await expect(quarantineAs(null, up)).rejects.toThrow(/Not authorized/);
    expect((await uploadState(up)).quarantined_at).toBeNull();
  });

  it('re-quarantining an already-quarantined post is safe (no error, stamp refreshed)', async () => {
    const admin = await makeUser(uid(51), true);
    const owner = await makeUser(uid(52), false);
    const up = await makeUpload(uid(53), owner);

    await quarantineAs(admin, up, 'first');
    const t1 = (await uploadState(up)).quarantined_at!;
    await pool.query('SELECT pg_sleep(0.01)');
    await quarantineAs(admin, up, 'second');

    const s = await uploadState(up);
    expect(s.quarantine_reason).toBe('second');
    expect(s.quarantined_at!.getTime()).toBeGreaterThanOrEqual(t1.getTime());
  });

  it('a nonexistent upload id is a silent no-op for an admin (no throw)', async () => {
    const admin = await makeUser(uid(61), true);
    await expect(quarantineAs(admin, uid(62))).resolves.toBeUndefined();
  });
});
