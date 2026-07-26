/**
 * LIVE-DB test for the Dream Off roster RPCs (migration 404).
 *
 * Locks the join_game_by_code choke point (join / already-member / roster-lock
 * spectator / full / revoked / not-found / approval) + invite_players (seats +
 * notifies, respects the cap) + leave/cancel. Loads the REAL RPCs from migration
 * 404 over the real table DDL (400) so it validates the SQL.
 */

import { Pool, PoolClient } from 'pg';
import { makePool, migrationSql, extract } from './_support/pg';

const pool: Pool = makePool();
let db: PoolClient;

const OWNER = '00000000-0000-0000-0000-0000000000a1';
const BOB = '00000000-0000-0000-0000-0000000000b2';
const CAROL = '00000000-0000-0000-0000-0000000000c3';
let seq = 0;

async function actAs(uid: string | null) {
  await db.query('SELECT set_config($1, $2, false)', ['test.uid', uid ?? '']);
}

/** Insert a game directly (bypass create_game to skip topic-trigger/pot deps). */
async function makeGame(opts: {
  phase?: string;
  code: string;
  maxPlayers?: number;
  joinApproval?: boolean;
  revoked?: boolean;
}): Promise<string> {
  const id = `00000000-0000-0000-0000-00000000f${(seq++).toString().padStart(3, '0')}`;
  await db.query(
    `INSERT INTO public.dream_offs
       (id, owner_id, topic, topic_source, phase, invite_code, max_players, join_approval, invite_revoked_at)
     VALUES ($1,$2,'t','custom',$3,$4,$5,$6,$7)`,
    [
      id,
      OWNER,
      opts.phase ?? 'submission',
      opts.code,
      opts.maxPlayers ?? 12,
      opts.joinApproval ?? false,
      opts.revoked ? new Date() : null,
    ]
  );
  await db.query(
    `INSERT INTO public.dream_off_players (game_id, user_id, status, joined_via) VALUES ($1,$2,'active','owner')`,
    [id, OWNER]
  );
  return id;
}

beforeAll(async () => {
  db = await pool.connect();
  for (const t of [
    'notifications',
    'dream_off_events',
    'dream_off_players',
    'dream_offs',
    'engine_config',
    'users',
  ]) {
    await db.query(`DROP TABLE IF EXISTS public.${t} CASCADE`);
  }
  await db.query('CREATE TABLE public.users (id uuid PRIMARY KEY)');
  await db.query(
    `CREATE TABLE public.engine_config (id int PRIMARY KEY, dream_off_enabled boolean)`
  );
  await db.query(`INSERT INTO public.engine_config VALUES (1, true)`);
  await db.query(
    `CREATE TABLE public.notifications (
       id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
       recipient_id uuid, actor_id uuid, type text, reference_id uuid)`
  );
  await db.query('CREATE SCHEMA IF NOT EXISTS auth');
  await db.query(
    `CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE
     AS $f$ SELECT NULLIF(current_setting('test.uid', true), '')::uuid $f$`
  );

  const m400 = migrationSql('400_dream_off_core_schema.sql');
  await db.query(extract(m400, 'CREATE TABLE IF NOT EXISTS public.dream_offs (', ');'));
  await db.query(extract(m400, 'CREATE TABLE IF NOT EXISTS public.dream_off_players (', ');'));
  await db.query(extract(m400, 'CREATE TABLE IF NOT EXISTS public.dream_off_events (', ');'));

  const m404 = migrationSql('404_dream_off_roster.sql');
  for (const fn of [
    'CREATE OR REPLACE FUNCTION public.invite_players(',
    'CREATE OR REPLACE FUNCTION public.join_game_by_code(',
    'CREATE OR REPLACE FUNCTION public.leave_game(',
    'CREATE OR REPLACE FUNCTION public.cancel_game(',
  ]) {
    await db.query(extract(m404, fn, '$$;'));
  }

  await db.query(`INSERT INTO public.users (id) VALUES ($1),($2),($3)`, [OWNER, BOB, CAROL]);
});

afterAll(async () => {
  db.release();
  await pool.end();
});

describe('join_game_by_code (migration 404)', () => {
  it('joins an open game during submission', async () => {
    const g = await makeGame({ code: 'JOINCODE01' });
    await actAs(BOB);
    const { rows } = await db.query(`SELECT public.join_game_by_code('JOINCODE01') AS r`);
    expect(rows[0].r.status).toBe('joined');
    const p = await db.query(
      `SELECT status, joined_via FROM public.dream_off_players WHERE game_id=$1 AND user_id=$2`,
      [g, BOB]
    );
    expect(p.rows[0]).toEqual({ status: 'active', joined_via: 'link' });
  });

  it('is idempotent for an existing member', async () => {
    await makeGame({ code: 'JOINCODE02' });
    await actAs(BOB);
    await db.query(`SELECT public.join_game_by_code('JOINCODE02')`);
    const { rows } = await db.query(`SELECT public.join_game_by_code('JOINCODE02') AS r`);
    expect(rows[0].r.status).toBe('already_member');
  });

  it('returns spectator (no row) for a non-member after the roster locks', async () => {
    const g = await makeGame({ code: 'VOTINGCODE', phase: 'voting' });
    await actAs(BOB);
    const { rows } = await db.query(`SELECT public.join_game_by_code('VOTINGCODE') AS r`);
    expect(rows[0].r.status).toBe('spectator');
    const p = await db.query(
      `SELECT count(*)::int AS n FROM public.dream_off_players WHERE game_id=$1 AND user_id=$2`,
      [g, BOB]
    );
    expect(p.rows[0].n).toBe(0);
  });

  it('rejects when the game is full (cap)', async () => {
    await makeGame({ code: 'FULLCODE00', maxPlayers: 1 }); // only the owner fits
    await actAs(BOB);
    const { rows } = await db.query(`SELECT public.join_game_by_code('FULLCODE00') AS r`);
    expect(rows[0].r.status).toBe('full');
  });

  it('rejects a revoked link + an unknown code', async () => {
    await makeGame({ code: 'REVOKED000', revoked: true });
    await actAs(BOB);
    const revoked = await db.query(`SELECT public.join_game_by_code('REVOKED000') AS r`);
    expect(revoked.rows[0].r.status).toBe('revoked');
    const missing = await db.query(`SELECT public.join_game_by_code('NOSUCHCODE') AS r`);
    expect(missing.rows[0].r.status).toBe('not_found');
  });

  it('lands pending when the owner requires approval', async () => {
    await makeGame({ code: 'APPROVAL01', joinApproval: true });
    await actAs(CAROL);
    const { rows } = await db.query(`SELECT public.join_game_by_code('APPROVAL01') AS r`);
    expect(rows[0].r.status).toBe('pending_approval');
  });
});

describe('invite_players / leave / cancel (migration 404)', () => {
  it('owner seats invitees + fires a notification, respecting the cap', async () => {
    const g = await makeGame({ code: 'INVITECODE', maxPlayers: 2 }); // owner + 1 more
    await actAs(OWNER);
    const { rows } = await db.query(`SELECT public.invite_players($1, $2::uuid[]) AS r`, [
      g,
      [BOB, CAROL],
    ]);
    expect(rows[0].r.invited).toBe(1); // cap 2 - owner = 1 seat
    const notif = await db.query(
      `SELECT count(*)::int AS n FROM public.notifications WHERE reference_id=$1 AND type='dream_off_invite'`,
      [g]
    );
    expect(notif.rows[0].n).toBe(1);
  });

  it('a non-owner cannot invite', async () => {
    const g = await makeGame({ code: 'NOTOWNER01' });
    await actAs(BOB);
    await expect(
      db.query(`SELECT public.invite_players($1, $2::uuid[])`, [g, [CAROL]])
    ).rejects.toThrow(/not your game/);
  });

  it('leave sets status left; cancel flips the phase', async () => {
    const g = await makeGame({ code: 'LEAVECODE0' });
    await actAs(BOB);
    await db.query(`SELECT public.join_game_by_code('LEAVECODE0')`);
    await db.query(`SELECT public.leave_game($1)`, [g]);
    const left = await db.query(
      `SELECT status FROM public.dream_off_players WHERE game_id=$1 AND user_id=$2`,
      [g, BOB]
    );
    expect(left.rows[0].status).toBe('left');

    await actAs(OWNER);
    await db.query(`SELECT public.cancel_game($1)`, [g]);
    const phase = await db.query(`SELECT phase FROM public.dream_offs WHERE id=$1`, [g]);
    expect(phase.rows[0].phase).toBe('cancelled');
  });
});
