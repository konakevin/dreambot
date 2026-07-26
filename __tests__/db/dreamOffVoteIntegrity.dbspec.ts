/**
 * LIVE-DB test for Dream Off vote + entry integrity (migration 400).
 *
 * Blind voting is only safe if the ballot rules are enforced by the DATABASE,
 * not the app (a hostile client hits PostgREST directly). This loads the REAL
 * DDL for dream_offs / dream_off_entries / dream_off_votes + the no-self-vote
 * trigger from migration 400 and asserts the structural invariants:
 *   - a voter gets at most 2 roses (PK on (game, voter, rose_index)),
 *   - a voter can't put both roses on ONE entry (UNIQUE (game, voter, entry)),
 *   - a voter can't vote their OWN entry (BEFORE-INSERT trigger),
 *   - one entry per player (UNIQUE (game, author)).
 *
 * Loading the production DDL (not a hand copy) means a drift in migration 400
 * fails here loudly — and it validates the migration's SQL before it's applied.
 */

import { Pool, PoolClient } from 'pg';
import { makePool, migrationSql, extract } from './_support/pg';

const pool: Pool = makePool();
let db: PoolClient;

const GAME = '00000000-0000-0000-0000-0000000000f1';
const ALICE = '00000000-0000-0000-0000-0000000000a1';
const BOB = '00000000-0000-0000-0000-0000000000b2';
const CAROL = '00000000-0000-0000-0000-0000000000c3';
const E_ALICE = '00000000-0000-0000-0000-0000000000e1'; // Alice's entry
const E_BOB = '00000000-0000-0000-0000-0000000000e2'; // Bob's entry

beforeAll(async () => {
  db = await pool.connect();

  await db.query('DROP TABLE IF EXISTS public.dream_off_votes CASCADE');
  await db.query('DROP TABLE IF EXISTS public.dream_off_entries CASCADE');
  await db.query('DROP TABLE IF EXISTS public.dream_offs CASCADE');
  await db.query('DROP TABLE IF EXISTS public.uploads CASCADE');
  await db.query('DROP TABLE IF EXISTS public.users CASCADE');

  // FK-target stubs (not under test).
  await db.query('CREATE TABLE public.users (id uuid PRIMARY KEY)');
  await db.query('CREATE TABLE public.uploads (id uuid PRIMARY KEY)');

  // The REAL DDL, loaded from migration 400 (drift → this throws).
  const sql = migrationSql('400_dream_off_core_schema.sql');
  await db.query(extract(sql, 'CREATE TABLE IF NOT EXISTS public.dream_offs (', ');'));
  await db.query(extract(sql, 'CREATE TABLE IF NOT EXISTS public.dream_off_entries (', ');'));
  await db.query(extract(sql, 'CREATE TABLE IF NOT EXISTS public.dream_off_votes (', ');'));
  await db.query(
    extract(sql, 'CREATE OR REPLACE FUNCTION public.dream_off_votes_no_self_vote()', '$$;')
  );
  await db.query(
    extract(sql, 'CREATE TRIGGER trg_dream_off_votes_no_self_vote', 'no_self_vote();')
  );

  await db.query(`INSERT INTO public.users (id) VALUES ($1), ($2), ($3)`, [ALICE, BOB, CAROL]);
  await db.query(
    `INSERT INTO public.dream_offs (id, topic, topic_source, invite_code)
     VALUES ($1, 'cursed sandwich', 'pack', 'ABC123XYZ0')`,
    [GAME]
  );
  await db.query(
    `INSERT INTO public.dream_off_entries (id, game_id, author_id, author_name_snapshot)
     VALUES ($1, $3, $4, 'alice'), ($2, $3, $5, 'bob')`,
    [E_ALICE, E_BOB, GAME, ALICE, BOB]
  );
});

afterEach(async () => {
  await db.query('DELETE FROM public.dream_off_votes');
});

afterAll(async () => {
  db.release();
  await pool.end();
});

describe('dream_off_votes — structural ballot integrity (migration 400)', () => {
  it('accepts a valid 2-rose ballot (rose_index 0 and 1, two distinct entries)', async () => {
    // Carol votes for Alice's + Bob's entries.
    await db.query(
      `INSERT INTO public.dream_off_votes (game_id, voter_id, entry_id, rose_index)
       VALUES ($1, $2, $3, 0), ($1, $2, $4, 1)`,
      [GAME, CAROL, E_ALICE, E_BOB]
    );
    const { rows } = await db.query(
      `SELECT count(*)::int AS n FROM public.dream_off_votes WHERE voter_id = $1`,
      [CAROL]
    );
    expect(rows[0].n).toBe(2);
  });

  it('caps a voter at 2 roses (rose_index CHECK rejects a 3rd)', async () => {
    await expect(
      db.query(
        `INSERT INTO public.dream_off_votes (game_id, voter_id, entry_id, rose_index)
         VALUES ($1, $2, $3, 2)`,
        [GAME, CAROL, E_ALICE]
      )
    ).rejects.toThrow();
  });

  it('blocks both roses on ONE entry (UNIQUE (game, voter, entry))', async () => {
    await expect(
      db.query(
        `INSERT INTO public.dream_off_votes (game_id, voter_id, entry_id, rose_index)
         VALUES ($1, $2, $3, 0), ($1, $2, $3, 1)`,
        [GAME, CAROL, E_ALICE]
      )
    ).rejects.toThrow();
  });

  it('blocks voting for your OWN entry (no-self-vote trigger)', async () => {
    await expect(
      db.query(
        `INSERT INTO public.dream_off_votes (game_id, voter_id, entry_id, rose_index)
         VALUES ($1, $2, $3, 0)`,
        [GAME, ALICE, E_ALICE] // Alice voting Alice's entry
      )
    ).rejects.toThrow(/own entry/);
  });
});

describe('dream_off_entries — one entry per player (migration 400)', () => {
  it('rejects a second entry by the same author in a game', async () => {
    await expect(
      db.query(
        `INSERT INTO public.dream_off_entries (game_id, author_id, author_name_snapshot)
         VALUES ($1, $2, 'alice-again')`,
        [GAME, ALICE]
      )
    ).rejects.toThrow();
  });
});
