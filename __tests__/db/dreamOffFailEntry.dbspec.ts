/**
 * LIVE-DB test for dream_off_fail_entry (migration 413) — the non-NSFW render
 * dead-letter seam. Locks: marks the entry failed, pot-aware refunds it (restores
 * the escrow slot), excludes it from the tally, and no-ops on an unknown job.
 * Loads the REAL fail/refund/settle/tally/maybe_advance + refund_sparkles.
 */

import { Pool, PoolClient } from 'pg';
import { makePool, migrationSql, extract } from './_support/pg';

const pool: Pool = makePool();
let db: PoolClient;

const OWNER = '00000000-0000-0000-0000-0000000000a1';
const BOB = '00000000-0000-0000-0000-0000000000b2';
let seq = 0;
const gid = () => `00000000-0000-0000-0000-0000000e${(seq++).toString().padStart(4, '0')}`;
const jid = () => `00000000-0000-0000-0000-0000000a${(seq++).toString().padStart(4, '0')}`;

async function mkGame(): Promise<string> {
  const id = gid();
  await db.query(
    `INSERT INTO public.dream_offs (id, owner_id, topic, topic_source, phase, invite_code, phase_expires_at)
     VALUES ($1,$2,'t','custom','submission',$3, now() + interval '1 day')`,
    [id, OWNER, id.slice(-10)]
  );
  await db.query(
    `INSERT INTO public.dream_off_pot (game_id, tier_key, slot_price, balance, funded_slots)
     VALUES ($1,'standard',1,2,3)`,
    [id]
  );
  return id;
}
async function mkPlayer(g: string, uid: string) {
  await db.query(
    `INSERT INTO public.dream_off_players (game_id,user_id,status) VALUES ($1,$2,'active')`,
    [g, uid]
  );
}
// A rendering entry paid from the pot (a 'spend' ledger row keyed by its job id).
async function potEntry(g: string, author: string, job: string): Promise<string> {
  const r = await db.query(
    `INSERT INTO public.dream_off_entries (game_id, author_id, author_name_snapshot, payment_reference, render_status, moderation_status)
     VALUES ($1,$2,'n',$3,'rendering','clean') RETURNING id`,
    [g, author, job]
  );
  const id = r.rows[0].id as string;
  await db.query(
    `INSERT INTO public.dream_off_pot_ledger (game_id, kind, amount, balance_after, reference_id, entry_id, actor_id)
     VALUES ($1,'spend',-1,2,$2,$3,$4)`,
    [g, job, id, author]
  );
  return id;
}
async function cleanEntry(g: string, author: string) {
  await db.query(
    `INSERT INTO public.dream_off_entries (game_id, author_id, author_name_snapshot, render_status, moderation_status, completed_at)
     VALUES ($1,$2,'n','completed','clean', now())`,
    [g, author]
  );
}

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
    `CREATE TABLE public.engine_config (id int PRIMARY KEY, dream_off_deadline_hours int)`
  );
  await db.query(`INSERT INTO public.engine_config VALUES (1, 24)`);
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
      migrationSql('278_security_hardening.sql'),
      'CREATE OR REPLACE FUNCTION public.refund_sparkles(',
      '$$;'
    )
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
  await db.query(
    extract(
      migrationSql('406_dream_off_entry_seam.sql'),
      'CREATE OR REPLACE FUNCTION public.dream_off_refund_entry(',
      '$$;'
    )
  );
  await db.query(
    extract(
      migrationSql('413_dream_off_fail_entry.sql'),
      'CREATE OR REPLACE FUNCTION public.dream_off_fail_entry(',
      '$$;'
    )
  );

  await db.query(`INSERT INTO public.users (id) VALUES ($1),($2)`, [OWNER, BOB]);
});

afterAll(async () => {
  db.release();
  await pool.end();
});

describe('dream_off_fail_entry (migration 413)', () => {
  it('marks the entry failed, restores the pot slot, and excludes it from the tally', async () => {
    const g = await mkGame();
    await mkPlayer(g, OWNER);
    await mkPlayer(g, BOB);
    const jFail = jid();
    await potEntry(g, BOB, jFail); // Bob's entry, pot-funded, rendering
    await cleanEntry(g, OWNER); // Owner has a good entry

    await db.query(`SELECT public.dream_off_fail_entry($1,$2)`, [g, jFail]);
    const failed = await db.query(
      `SELECT render_status, moderation_status FROM public.dream_off_entries WHERE payment_reference=$1`,
      [jFail]
    );
    expect(failed.rows[0]).toEqual({ render_status: 'failed', moderation_status: 'clean' });
    const pot = await db.query(`SELECT balance FROM public.dream_off_pot WHERE game_id=$1`, [g]);
    expect(pot.rows[0].balance).toBe(3); // 2 + 1 slot restored

    // Force to results — the failed entry can't win (only the owner's clean entry).
    await db.query(`SELECT public.maybe_advance_dream_off($1, true, 't')`, [g]);
    const winner = await db.query(
      `SELECT count(*)::int AS n FROM public.dream_off_superlatives s
       JOIN public.dream_off_entries e ON e.id=s.entry_id
       WHERE s.game_id=$1 AND s.key='winner' AND e.author_id=$2`,
      [g, OWNER]
    );
    expect(winner.rows[0].n).toBe(1);
  });

  it('no-ops on an unknown job id', async () => {
    const g = await mkGame();
    await expect(
      db.query(`SELECT public.dream_off_fail_entry($1,$2)`, [g, jid()])
    ).resolves.toBeDefined();
  });
});
