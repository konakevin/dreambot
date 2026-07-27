/**
 * LIVE-DB INTEGRATION test — one Dream Off game driven through its whole
 * lifecycle across the REAL functions from THREE migrations at once:
 *   advance_phase / maybe_advance / tally (405) + cast_votes (411) + the read
 *   RPCs get_game_room / get_game_gallery / get_game_results (410).
 *
 * The per-migration specs each test a piece; this locks the SEAMS between them —
 * the thing most likely to break when plumbing is redone. It also asserts the
 * BLINDNESS guarantee end-to-end: during voting the gallery hides authors, and at
 * results it reveals them with the tally + superlative.
 */

import { Pool, PoolClient } from 'pg';
import { makePool, migrationSql, extract } from './_support/pg';

const pool: Pool = makePool();
let db: PoolClient;

const OWNER = '00000000-0000-0000-0000-00000000a001';
const BOB = '00000000-0000-0000-0000-00000000b002';
const GAME = '00000000-0000-0000-0000-0000000c0001';

async function actAs(uid: string | null) {
  await db.query('SELECT set_config($1, $2, false)', ['test.uid', uid ?? '']);
}
const rpc = async (fn: string, args: Record<string, unknown>) => {
  const keys = Object.keys(args);
  const ph = keys.map((k, i) => `${k} => $${i + 1}`).join(', ');
  const r = await db.query(`SELECT public.${fn}(${ph}) AS r`, Object.values(args));
  return r.rows[0].r;
};

async function mkEntry(author: string): Promise<string> {
  const r = await db.query(
    `INSERT INTO public.dream_off_entries
       (game_id, author_id, author_name_snapshot, render_status, moderation_status, completed_at, game_image_ref)
     VALUES ($1,$2,$3,'completed','clean', clock_timestamp(), $4) RETURNING id`,
    [GAME, author, `name-${author.slice(-2)}`, `game/${author.slice(-2)}.png`]
  );
  return r.rows[0].id as string;
}

beforeAll(async () => {
  db = await pool.connect();
  for (const t of [
    'notifications',
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
    'CREATE TABLE public.users (id uuid PRIMARY KEY, display_name text, username text)'
  );
  await db.query('CREATE TABLE public.uploads (id uuid PRIMARY KEY)');
  await db.query(
    'CREATE TABLE public.engine_config (id int PRIMARY KEY, dream_off_deadline_hours int)'
  );
  await db.query('INSERT INTO public.engine_config VALUES (1, 24)');
  await db.query(
    `CREATE TABLE public.notifications (id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
       recipient_id uuid, actor_id uuid, type text, reference_id uuid)`
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

  const m405 = migrationSql('405_dream_off_phase_machine.sql');
  await db.query(extract(m405, 'CREATE OR REPLACE FUNCTION public.tally_results(', '$$;'));
  await db.query(
    extract(m405, 'CREATE OR REPLACE FUNCTION public.maybe_advance_dream_off(', '$$;')
  );
  await db.query(extract(m405, 'CREATE OR REPLACE FUNCTION public.advance_phase(', '$$;'));

  const m411 = migrationSql('411_dream_off_cast_votes.sql');
  await db.query(extract(m411, 'CREATE OR REPLACE FUNCTION public.cast_votes(', '$$;'));

  const m410 = migrationSql('410_dream_off_reads.sql');
  for (const fn of ['get_game_room(', 'get_game_gallery(', 'get_game_results(']) {
    await db.query(extract(m410, `CREATE OR REPLACE FUNCTION public.${fn}`, '$$;'));
  }

  await db.query(`INSERT INTO public.users (id, username) VALUES ($1,'owner'),($2,'bob')`, [
    OWNER,
    BOB,
  ]);
});

afterAll(async () => {
  db.release();
  await pool.end();
});

describe('Dream Off full lifecycle (405 + 411 + 410 seams)', () => {
  it('runs submission → voting → results with blind voting then a revealed podium', async () => {
    // A game already in submission with both players + both entries in.
    await db.query(
      `INSERT INTO public.dream_offs (id, owner_id, topic, topic_source, phase, invite_code, phase_expires_at)
       VALUES ($1,$2,'a cute taco','custom','submission',$3, now() + interval '1 day')`,
      [GAME, OWNER, GAME.slice(-10)]
    );
    for (const u of [OWNER, BOB]) {
      await db.query(
        `INSERT INTO public.dream_off_players (game_id, user_id, status, submitted_at) VALUES ($1,$2,'active', now())`,
        [GAME, u]
      );
    }
    const ownerEntry = await mkEntry(OWNER);
    await mkEntry(BOB);

    // Owner advances submission → voting.
    await actAs(OWNER);
    expect(await rpc('advance_phase', { p_game_id: GAME })).toBe('voting');
    expect((await rpc('get_game_room', { p_game_id: GAME })).phase).toBe('voting');

    // BLINDNESS: during voting Bob's gallery hides authors + tallies.
    await actAs(BOB);
    const votingGallery = (await rpc('get_game_gallery', { p_game_id: GAME })) as Array<
      Record<string, unknown>
    >;
    expect(votingGallery).toHaveLength(2);
    for (const e of votingGallery) {
      expect(e.author_name).toBeUndefined();
      expect(e.author_id).toBeUndefined();
      expect(e.rose_count).toBeUndefined();
      expect(e).toHaveProperty('roses_by_me');
    }

    // Bob stars the owner's entry (owner's entry → 1 rose; bob's → 0).
    await rpc('cast_votes', { p_game_id: GAME, p_entry_ids: [ownerEntry] });
    const ballotGallery = (await rpc('get_game_gallery', { p_game_id: GAME })) as Array<
      Record<string, unknown>
    >;
    const mine = ballotGallery.find((e) => e.entry_id === ownerEntry);
    expect(mine?.roses_by_me).toBe(true);

    // Owner reveals → results + tally.
    await actAs(OWNER);
    expect(await rpc('advance_phase', { p_game_id: GAME })).toBe('results');

    // Results: podium reveals the winner (the higher-rose entry).
    const results = await rpc('get_game_results', { p_game_id: GAME });
    expect(results.status).toBe('ok');
    const winner = (results.podium as Array<Record<string, unknown>>).find(
      (p) => p.key === 'winner'
    );
    expect(winner?.entry_id).toBe(ownerEntry);
    expect(winner?.rose_count).toBe(1);

    // REVEAL: the gallery now exposes author + tally + superlative.
    const revealGallery = (await rpc('get_game_gallery', { p_game_id: GAME })) as Array<
      Record<string, unknown>
    >;
    const revealedWinner = revealGallery.find((e) => e.entry_id === ownerEntry);
    expect(revealedWinner?.author_name).toBe('name-01');
    expect(revealedWinner?.rose_count).toBe(1);
    expect(revealedWinner?.superlative).toBe('winner');
  });
});
