/**
 * LIVE-DB test for the Dream Off deadline sweep (migration 412).
 *
 * Locks advance_expired_dream_offs + dream_off_stuck_count:
 *   - no-ops when the kill-switch is off,
 *   - resolves overdue games through maybe_advance (submission past deadline with
 *     2 entries → voting) and leaves not-yet-due games alone,
 *   - the stuck-count monitor sees overdue games + unsettled terminal pots.
 * Loads the REAL sweep (412) + wired maybe_advance/tally/settle (409/405). The
 * cron.schedule DO-block is intentionally NOT loaded (pg_cron may be absent here).
 */

import { Pool, PoolClient } from 'pg';
import { makePool, migrationSql, extract } from './_support/pg';

const pool: Pool = makePool();
let db: PoolClient;

const OWNER = '00000000-0000-0000-0000-0000000000a1';
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
async function mkEntry(g: string, author: string) {
  await db.query(
    `INSERT INTO public.dream_off_entries (game_id, author_id, author_name_snapshot, render_status, moderation_status, completed_at)
     VALUES ($1,$2,'n','completed','clean', now())`,
    [g, author]
  );
}
const A2 = '00000000-0000-0000-0000-0000000000b2';
const A3 = '00000000-0000-0000-0000-0000000000c3';
const sweep = () =>
  db.query(`SELECT public.advance_expired_dream_offs() AS n`).then((r) => r.rows[0].n as number);
const phaseOf = (g: string) =>
  db.query(`SELECT phase FROM public.dream_offs WHERE id=$1`, [g]).then((r) => r.rows[0].phase);

beforeAll(async () => {
  db = await pool.connect();
  for (const t of [
    'notifications',
    'sparkle_transactions',
    'dream_off_pot_ledger',
    'dream_off_pot',
    'dream_off_tiers',
    'dream_off_superlatives',
    'dream_off_votes',
    'dream_off_entries',
    'dream_off_events',
    'dream_off_players',
    'dream_offs',
    'uploads',
    'engine_config',
    'users',
  ]) {
    await db.query(`DROP TABLE IF EXISTS public.${t} CASCADE`);
  }
  await db.query(
    'CREATE TABLE public.users (id uuid PRIMARY KEY, sparkle_balance int NOT NULL DEFAULT 0)'
  );
  await db.query('CREATE TABLE public.uploads (id uuid PRIMARY KEY)');
  await db.query(
    `CREATE TABLE public.engine_config (id int PRIMARY KEY, dream_off_enabled boolean, dream_off_deadline_hours int)`
  );
  await db.query(`INSERT INTO public.engine_config VALUES (1, true, 24)`);
  await db.query(
    `CREATE TABLE public.notifications (id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
       recipient_id uuid, actor_id uuid, type text, reference_id uuid)`
  );
  await db.query(
    `CREATE TABLE public.sparkle_transactions (id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
       user_id uuid, amount int, reason text, reference_id uuid, balance_after int,
       created_at timestamptz NOT NULL DEFAULT now())`
  );

  const m400 = migrationSql('400_dream_off_core_schema.sql');
  for (const tbl of [
    'dream_offs',
    'dream_off_players',
    'dream_off_entries',
    'dream_off_votes',
    'dream_off_events',
    'dream_off_superlatives',
  ]) {
    await db.query(extract(m400, `CREATE TABLE IF NOT EXISTS public.${tbl} (`, ');'));
  }
  const m402 = migrationSql('402_dream_off_economy_tables.sql');
  await db.query(extract(m402, 'CREATE TABLE IF NOT EXISTS public.dream_off_tiers (', ');'));
  await db.query(extract(m402, 'CREATE TABLE IF NOT EXISTS public.dream_off_pot (', ');'));
  await db.query(extract(m402, 'CREATE TABLE IF NOT EXISTS public.dream_off_pot_ledger (', ');'));
  await db.query(
    `INSERT INTO public.dream_off_tiers (key, label, model_ids, slot_price) VALUES ('standard','Standard','{}',1)`
  );

  await db.query(
    extract(
      migrationSql('405_dream_off_phase_machine.sql'),
      'CREATE OR REPLACE FUNCTION public.tally_results(',
      '$$;'
    )
  );
  const m409 = migrationSql('409_dream_off_settle.sql');
  await db.query(extract(m409, 'CREATE OR REPLACE FUNCTION public.dream_off_credit(', '$$;'));
  await db.query(extract(m409, 'CREATE OR REPLACE FUNCTION public.dream_off_settle_pot(', '$$;'));
  await db.query(
    extract(m409, 'CREATE OR REPLACE FUNCTION public.maybe_advance_dream_off(', '$$;')
  );
  const m412 = migrationSql('412_dream_off_cron.sql');
  await db.query(
    extract(m412, 'CREATE OR REPLACE FUNCTION public.advance_expired_dream_offs()', '$$;')
  );
  await db.query(extract(m412, 'CREATE OR REPLACE FUNCTION public.dream_off_stuck_count()', '$$;'));

  await db.query(`INSERT INTO public.users (id) VALUES ($1),($2),($3)`, [OWNER, A2, A3]);
});

beforeEach(async () => {
  await db.query(`UPDATE public.engine_config SET dream_off_enabled=true WHERE id=1`);
});

afterAll(async () => {
  db.release();
  await pool.end();
});

describe('advance_expired_dream_offs (migration 412)', () => {
  it('no-ops while the kill-switch is off', async () => {
    const g = await mkGame('submission', `now() - interval '1 hour'`);
    await mkEntry(g, OWNER);
    await mkEntry(g, A2);
    await db.query(`UPDATE public.engine_config SET dream_off_enabled=false WHERE id=1`);
    expect(await sweep()).toBe(0);
    expect(await phaseOf(g)).toBe('submission'); // untouched
  });

  it('resolves overdue games and leaves not-yet-due ones alone', async () => {
    const due = await mkGame('submission', `now() - interval '1 hour'`);
    await mkEntry(due, OWNER);
    await mkEntry(due, A2);
    const fresh = await mkGame('submission', `now() + interval '1 day'`);
    await mkEntry(fresh, OWNER);
    await mkEntry(fresh, A2);

    const n = await sweep();
    expect(n).toBeGreaterThanOrEqual(1);
    expect(await phaseOf(due)).toBe('voting'); // 2 entries past deadline → voting
    expect(await phaseOf(fresh)).toBe('submission'); // not due
  });
});

describe('dream_off_stuck_count (migration 412)', () => {
  it('counts overdue games and unsettled terminal pots', async () => {
    // Overdue by > 5 min, not advanced (simulating a cron outage).
    await mkGame('voting', `now() - interval '30 minutes'`);
    // A finished game whose pot never settled.
    const done = await mkGame('results', `NULL`);
    await db.query(
      `INSERT INTO public.dream_off_pot (game_id, tier_key, slot_price, balance, status)
       VALUES ($1,'standard',1,3,'open')`,
      [done]
    );

    const stuck = (await db.query(`SELECT public.dream_off_stuck_count() AS s`)).rows[0].s;
    expect(stuck.overdue_games).toBeGreaterThanOrEqual(1);
    expect(stuck.unsettled_pots).toBeGreaterThanOrEqual(1);
  });
});
