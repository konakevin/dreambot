/**
 * LIVE-DB test for dream_off_send_nudges (migration 416).
 *
 * Locks the nudge heartbeat: your_turn to unsubmitted players when submission is
 * closing soon, nudge to non-voters when voting is closing soon, only inside the
 * window, once per player per phase (dedup), and a no-op while dark.
 */

import { Pool, PoolClient } from 'pg';
import { makePool, migrationSql, extract } from './_support/pg';

const pool: Pool = makePool();
let db: PoolClient;

const OWNER = '00000000-0000-0000-0000-0000000000a1';
const BOB = '00000000-0000-0000-0000-0000000000b2';
let seq = 0;
const gid = () => `00000000-0000-0000-0000-0000000e${(seq++).toString().padStart(4, '0')}`;

async function mkGame(phase: string, expiresSql: string): Promise<string> {
  const id = gid();
  await db.query(
    `INSERT INTO public.dream_offs (id, owner_id, topic, topic_source, phase, invite_code, phase_expires_at)
     VALUES ($1,$2,'t','custom',$3,$4, ${expiresSql})`,
    [id, OWNER, phase, id.slice(-10)]
  );
  return id;
}
async function mkPlayer(
  g: string,
  uid: string,
  opts: { submitted?: boolean; voted?: boolean } = {}
) {
  await db.query(
    `INSERT INTO public.dream_off_players (game_id,user_id,status,submitted_at,voted_at)
     VALUES ($1,$2,'active',$3,$4)`,
    [g, uid, opts.submitted ? new Date() : null, opts.voted ? new Date() : null]
  );
}
const sweep = () =>
  db.query(`SELECT public.dream_off_send_nudges() AS n`).then((r) => r.rows[0].n as number);
const notifCount = (uid: string, type: string, game: string) =>
  db
    .query(
      `SELECT count(*)::int AS n FROM public.notifications WHERE recipient_id=$1 AND type=$2 AND reference_id=$3`,
      [uid, type, game]
    )
    .then((r) => r.rows[0].n as number);

beforeAll(async () => {
  db = await pool.connect();
  for (const t of ['notifications', 'dream_off_players', 'dream_offs', 'engine_config', 'users']) {
    await db.query(`DROP TABLE IF EXISTS public.${t} CASCADE`);
  }
  await db.query('CREATE TABLE public.users (id uuid PRIMARY KEY)');
  await db.query(
    `CREATE TABLE public.engine_config (id int PRIMARY KEY, dream_off_enabled boolean, dream_off_nudge_window_hours int)`
  );
  await db.query(`INSERT INTO public.engine_config VALUES (1, true, 6)`);
  await db.query(
    `CREATE TABLE public.notifications (id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
       recipient_id uuid, actor_id uuid, type text, reference_id uuid)`
  );
  const m400 = migrationSql('400_dream_off_core_schema.sql');
  await db.query(extract(m400, 'CREATE TABLE IF NOT EXISTS public.dream_offs (', ');'));
  await db.query(extract(m400, 'CREATE TABLE IF NOT EXISTS public.dream_off_players (', ');'));
  await db.query(
    extract(
      migrationSql('416_dream_off_nudges.sql'),
      'CREATE OR REPLACE FUNCTION public.dream_off_send_nudges()',
      '$$;'
    )
  );
  await db.query(`INSERT INTO public.users (id) VALUES ($1),($2)`, [OWNER, BOB]);
});

beforeEach(async () => {
  await db.query(`UPDATE public.engine_config SET dream_off_enabled=true WHERE id=1`);
});

afterAll(async () => {
  db.release();
  await pool.end();
});

describe('dream_off_send_nudges (migration 416)', () => {
  it('your_turn to an unsubmitted player when submission closes soon; once only', async () => {
    const g = await mkGame('submission', `now() + interval '2 hours'`);
    await mkPlayer(g, OWNER, { submitted: true }); // already submitted → no nudge
    await mkPlayer(g, BOB); // unsubmitted → nudge

    await sweep();
    expect(await notifCount(BOB, 'dream_off_your_turn', g)).toBe(1);
    expect(await notifCount(OWNER, 'dream_off_your_turn', g)).toBe(0);

    await sweep(); // dedup — no second nudge
    expect(await notifCount(BOB, 'dream_off_your_turn', g)).toBe(1);
  });

  it('nudge to a non-voter when voting closes soon', async () => {
    const g = await mkGame('voting', `now() + interval '3 hours'`);
    await mkPlayer(g, BOB); // hasn't voted
    await sweep();
    expect(await notifCount(BOB, 'dream_off_nudge', g)).toBe(1);
  });

  it('does not nudge when the deadline is outside the window', async () => {
    const g = await mkGame('submission', `now() + interval '2 days'`);
    await mkPlayer(g, BOB);
    await sweep();
    expect(await notifCount(BOB, 'dream_off_your_turn', g)).toBe(0);
  });

  it('no-ops while the feature is dark', async () => {
    const g = await mkGame('submission', `now() + interval '1 hour'`);
    await mkPlayer(g, BOB);
    await db.query(`UPDATE public.engine_config SET dream_off_enabled=false WHERE id=1`);
    expect(await sweep()).toBe(0);
    expect(await notifCount(BOB, 'dream_off_your_turn', g)).toBe(0);
  });
});
