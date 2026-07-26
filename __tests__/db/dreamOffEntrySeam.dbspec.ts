/**
 * LIVE-DB test for the Dream Off entry seam (migration 406).
 *
 * Locks the render-path lifecycle RPCs:
 *   - dream_off_create_entry: phase gate (submission-only), membership gate,
 *     payment_reference == job_id, ON CONFLICT redo,
 *   - dream_off_attach_render: completed + player submitted_at + 'submitted' event
 *     + funnels through the phase machine (all-submitted, 2 entries → voting),
 *   - dream_off_refund_entry: pot-aware (restores the escrow slot; idempotent) and
 *     self-paid (routes to the real refund_sparkles),
 *   - dream_off_forfeit_entry: marks failed/forfeit_nsfw, refunds, excluded from tally.
 * Loads the REAL RPCs + table DDL (400/402/405/406) + the real refund_sparkles (278).
 */

import { Pool, PoolClient } from 'pg';
import { makePool, migrationSql, extract } from './_support/pg';

const pool: Pool = makePool();
let db: PoolClient;

const OWNER = '00000000-0000-0000-0000-0000000000a1';
const BOB = '00000000-0000-0000-0000-0000000000b2';
let seq = 0;

const gid = () => `00000000-0000-0000-0000-0000000e${(seq++).toString().padStart(4, '0')}`;
const jid = () =>
  `00000000-0000-0000-0000-0000000j${(seq++).toString().padStart(4, '0')}`.replace('j', 'd');

async function actAs(uid: string | null) {
  await db.query('SELECT set_config($1, $2, false)', ['test.uid', uid ?? '']);
}

async function mkGame(phase = 'submission'): Promise<string> {
  const id = gid();
  await db.query(
    `INSERT INTO public.dream_offs (id, owner_id, topic, topic_source, phase, invite_code, phase_expires_at)
     VALUES ($1,$2,'t','custom',$3,$4, now() + interval '1 day')`,
    [id, OWNER, phase, id.slice(-10)]
  );
  return id;
}
async function mkPlayer(game: string, uid: string) {
  await db.query(
    `INSERT INTO public.dream_off_players (game_id, user_id, status) VALUES ($1,$2,'active')`,
    [game, uid]
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
    `CREATE TABLE public.users (id uuid PRIMARY KEY, sparkle_balance int NOT NULL DEFAULT 0,
       display_name text, username text)`
  );
  // FK target of dream_off_entries.upload_id.
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
  await db.query('CREATE SCHEMA IF NOT EXISTS auth');
  await db.query(
    `CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE
     AS $f$ SELECT NULLIF(current_setting('test.uid', true), '')::uuid $f$`
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

  const m405 = migrationSql('405_dream_off_phase_machine.sql');
  await db.query(extract(m405, 'CREATE OR REPLACE FUNCTION public.tally_results(', '$$;'));
  await db.query(
    extract(m405, 'CREATE OR REPLACE FUNCTION public.maybe_advance_dream_off(', '$$;')
  );

  const m406 = migrationSql('406_dream_off_entry_seam.sql');
  await db.query(extract(m406, 'CREATE OR REPLACE FUNCTION public.dream_off_create_entry(', '$$;'));
  await db.query(
    extract(m406, 'CREATE OR REPLACE FUNCTION public.dream_off_attach_render(', '$$;')
  );
  await db.query(extract(m406, 'CREATE OR REPLACE FUNCTION public.dream_off_refund_entry(', '$$;'));
  await db.query(
    extract(m406, 'CREATE OR REPLACE FUNCTION public.dream_off_forfeit_entry(', '$$;')
  );

  await db.query(
    `INSERT INTO public.users (id, username, sparkle_balance) VALUES ($1,'own',0),($2,'bob',10)`,
    [OWNER, BOB]
  );
});

afterAll(async () => {
  db.release();
  await pool.end();
});

describe('dream_off_create_entry (migration 406)', () => {
  it('seeds a rendering entry keyed by the job id, then redoes on conflict', async () => {
    const g = await mkGame();
    await mkPlayer(g, OWNER);
    const j1 = jid();
    const e1 = await db.query(`SELECT public.dream_off_create_entry($1,$2,$3) AS id`, [
      g,
      OWNER,
      j1,
    ]);
    const entryId = e1.rows[0].id as string;
    const row = await db.query(
      `SELECT render_status, payment_reference FROM public.dream_off_entries WHERE id=$1`,
      [entryId]
    );
    expect(row.rows[0]).toEqual({ render_status: 'rendering', payment_reference: j1 });

    const j2 = jid();
    const e2 = await db.query(`SELECT public.dream_off_create_entry($1,$2,$3) AS id`, [
      g,
      OWNER,
      j2,
    ]);
    expect(e2.rows[0].id).toBe(entryId); // same row (one entry per player)
    const redo = await db.query(
      `SELECT payment_reference, completed_at FROM public.dream_off_entries WHERE id=$1`,
      [entryId]
    );
    expect(redo.rows[0]).toEqual({ payment_reference: j2, completed_at: null });
  });

  it('rejects entries outside submission + from non-members', async () => {
    const setup = await mkGame('setup');
    await mkPlayer(setup, OWNER);
    await expect(
      db.query(`SELECT public.dream_off_create_entry($1,$2,$3)`, [setup, OWNER, jid()])
    ).rejects.toThrow(/not accepting entries/);

    const g = await mkGame();
    await expect(
      db.query(`SELECT public.dream_off_create_entry($1,$2,$3)`, [g, BOB, jid()])
    ).rejects.toThrow(/not a member/);
  });
});

describe('dream_off_attach_render (migration 406)', () => {
  it('completes the entry, records the submission, and advances when all submit', async () => {
    const g = await mkGame();
    await mkPlayer(g, OWNER);
    await mkPlayer(g, BOB);
    const jA = jid();
    const jB = jid();
    await db.query(`SELECT public.dream_off_create_entry($1,$2,$3)`, [g, OWNER, jA]);
    await db.query(`SELECT public.dream_off_create_entry($1,$2,$3)`, [g, BOB, jB]);

    await db.query(`SELECT public.dream_off_attach_render($1,$2,$3,$4)`, [
      g,
      jA,
      null,
      'game/a.png',
    ]);
    const p1 = await db.query(
      `SELECT submitted_at FROM public.dream_off_players WHERE game_id=$1 AND user_id=$2`,
      [g, OWNER]
    );
    expect(p1.rows[0].submitted_at).not.toBeNull();
    const ev = await db.query(
      `SELECT count(*)::int AS n FROM public.dream_off_events WHERE game_id=$1 AND kind='submitted'`,
      [g]
    );
    expect(ev.rows[0].n).toBe(1);
    const stillSub = await db.query(`SELECT phase FROM public.dream_offs WHERE id=$1`, [g]);
    expect(stillSub.rows[0].phase).toBe('submission'); // Bob hasn't submitted

    await db.query(`SELECT public.dream_off_attach_render($1,$2,$3,$4)`, [
      g,
      jB,
      null,
      'game/b.png',
    ]);
    const advanced = await db.query(`SELECT phase FROM public.dream_offs WHERE id=$1`, [g]);
    expect(advanced.rows[0].phase).toBe('voting'); // 2 clean entries → voting
  });

  it('raises when no entry matches the job id', async () => {
    const g = await mkGame();
    await expect(
      db.query(`SELECT public.dream_off_attach_render($1,$2,$3,$4)`, [g, jid(), null, 'x'])
    ).rejects.toThrow(/entry not found/);
  });
});

describe('dream_off_refund_entry (migration 406)', () => {
  it('pot-funded: restores the escrow slot and is idempotent', async () => {
    const g = await mkGame();
    await mkPlayer(g, OWNER);
    const j = jid();
    const eId = (
      await db.query(`SELECT public.dream_off_create_entry($1,$2,$3) AS id`, [g, OWNER, j])
    ).rows[0].id as string;
    await db.query(
      `INSERT INTO public.dream_off_pot (game_id, tier_key, slot_price, balance) VALUES ($1,'standard',1,4)`,
      [g]
    );
    await db.query(
      `INSERT INTO public.dream_off_pot_ledger (game_id, kind, amount, balance_after, reference_id, entry_id, actor_id)
       VALUES ($1,'spend',-1,4,$2,$3,$4)`,
      [g, j, eId, OWNER]
    );

    await db.query(`SELECT public.dream_off_refund_entry($1,$2)`, [g, j]);
    const pot1 = await db.query(`SELECT balance FROM public.dream_off_pot WHERE game_id=$1`, [g]);
    expect(pot1.rows[0].balance).toBe(5);

    await db.query(`SELECT public.dream_off_refund_entry($1,$2)`, [g, j]); // idempotent
    const pot2 = await db.query(`SELECT balance FROM public.dream_off_pot WHERE game_id=$1`, [g]);
    expect(pot2.rows[0].balance).toBe(5);
    const refunds = await db.query(
      `SELECT count(*)::int AS n FROM public.dream_off_pot_ledger WHERE game_id=$1 AND kind='refund'`,
      [g]
    );
    expect(refunds.rows[0].n).toBe(1);
  });

  it('self-paid: routes to refund_sparkles (actual recorded spend only)', async () => {
    const g = await mkGame();
    await mkPlayer(g, BOB);
    const j = jid();
    await db.query(`SELECT public.dream_off_create_entry($1,$2,$3)`, [g, BOB, j]);
    // Bob self-paid 1 sparkle for this job (a real recorded debit); no pot spend row.
    await db.query(`UPDATE public.users SET sparkle_balance = 9 WHERE id = $1`, [BOB]);
    await db.query(
      `INSERT INTO public.sparkle_transactions (user_id, amount, reason, reference_id, balance_after)
       VALUES ($1,-1,'dream_off_entry',$2,9)`,
      [BOB, j]
    );
    await actAs(BOB); // refund_sparkles self-check: auth.uid() == payer
    await db.query(`SELECT public.dream_off_refund_entry($1,$2)`, [g, j]);
    await actAs(null);
    const bal = await db.query(`SELECT sparkle_balance FROM public.users WHERE id=$1`, [BOB]);
    expect(bal.rows[0].sparkle_balance).toBe(10); // 9 + 1 refunded
  });
});

describe('dream_off_forfeit_entry (migration 406)', () => {
  it('marks the entry failed/forfeit, refunds, and excludes it from the tally', async () => {
    const g = await mkGame();
    await mkPlayer(g, OWNER);
    await mkPlayer(g, BOB);
    const jGood = jid();
    const jBad = jid();
    await db.query(`SELECT public.dream_off_create_entry($1,$2,$3)`, [g, OWNER, jGood]);
    await db.query(`SELECT public.dream_off_create_entry($1,$2,$3)`, [g, BOB, jBad]);
    await db.query(`SELECT public.dream_off_attach_render($1,$2,$3,$4)`, [
      g,
      jGood,
      null,
      'game/g.png',
    ]);

    await actAs(BOB); // forfeit → self-refund routes through refund_sparkles (payer self-check)
    await db.query(`SELECT public.dream_off_forfeit_entry($1,$2)`, [g, jBad]);
    await actAs(null);
    const bad = await db.query(
      `SELECT render_status, moderation_status FROM public.dream_off_entries
       WHERE game_id=$1 AND payment_reference=$2`,
      [g, jBad]
    );
    expect(bad.rows[0]).toEqual({ render_status: 'failed', moderation_status: 'forfeit_nsfw' });

    // One clean entry remains → force results → the forfeited entry never wins.
    await db.query(`SELECT public.maybe_advance_dream_off($1, true, 'test')`, [g]);
    const winner = await db.query(
      `SELECT e.payment_reference AS ref FROM public.dream_off_superlatives s
       JOIN public.dream_off_entries e ON e.id = s.entry_id
       WHERE s.game_id=$1 AND s.key='winner'`,
      [g]
    );
    expect(winner.rows[0].ref).toBe(jGood);
  });
});
