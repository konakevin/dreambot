/**
 * LIVE-DB test for the Dream Off blinding read RPCs (migration 410).
 *
 * The mechanics tables are deny-all RLS; these DEFINER RPCs are the only read
 * path. This locks the BLINDNESS guarantees + visibility rules:
 *   - voting gallery hides author identity + rose tallies (only the viewer's own
 *     roses + is_mine), in a per-viewer order,
 *   - submission gallery shows only the viewer's own entry,
 *   - results gallery reveals authors + rose counts + superlatives,
 *   - non-members are blank on a live game but may read a finished one,
 *   - get_game_room (owner sees the invite code), get_game_results (not_ready
 *     before terminal), get_game_invite_preview (anon-safe fields + joinable).
 * Loads the REAL RPCs (410) over the real table DDL (400).
 */

import { Pool, PoolClient } from 'pg';
import { makePool, migrationSql, extract } from './_support/pg';

const pool: Pool = makePool();
let db: PoolClient;

const OWNER = '00000000-0000-0000-0000-0000000000a1';
const BOB = '00000000-0000-0000-0000-0000000000b2';
const CAROL = '00000000-0000-0000-0000-0000000000c3';
const STRANGER = '00000000-0000-0000-0000-0000000000d4';
let seq = 0;
const gid = () => `00000000-0000-0000-0000-0000000e${(seq++).toString().padStart(4, '0')}`;

async function actAs(uid: string | null) {
  await db.query('SELECT set_config($1, $2, false)', ['test.uid', uid ?? '']);
}
async function mkGame(phase: string): Promise<string> {
  const id = gid();
  await db.query(
    `INSERT INTO public.dream_offs (id, owner_id, topic, topic_source, phase, invite_code, max_players)
     VALUES ($1,$2,'the most cursed sandwich','custom',$3,$4,12)`,
    [id, OWNER, phase, id.slice(-10)]
  );
  return id;
}
async function mkPlayer(g: string, uid: string) {
  await db.query(
    `INSERT INTO public.dream_off_players (game_id,user_id,status) VALUES ($1,$2,'active')`,
    [g, uid]
  );
}
async function mkEntry(g: string, author: string): Promise<string> {
  const r = await db.query(
    `INSERT INTO public.dream_off_entries (game_id, author_id, author_name_snapshot, render_status, moderation_status, completed_at, game_image_ref)
     VALUES ($1,$2,$3,'completed','clean', now(), 'game/'||$2||'.png') RETURNING id`,
    [g, author, `name-${author.slice(-2)}`]
  );
  return r.rows[0].id;
}
async function rose(g: string, voter: string, entry: string, idx: number) {
  await db.query(
    `INSERT INTO public.dream_off_votes (game_id, voter_id, entry_id, rose_index) VALUES ($1,$2,$3,$4)`,
    [g, voter, entry, idx]
  );
}
const call = async (fn: string, ...args: unknown[]) => {
  const ph = args.map((_, i) => `$${i + 1}`).join(',');
  const r = await db.query(`SELECT public.${fn}(${ph}) AS r`, args);
  return r.rows[0].r;
};

beforeAll(async () => {
  db = await pool.connect();
  for (const t of [
    'dream_off_superlatives',
    'dream_off_votes',
    'dream_off_entries',
    'dream_off_events',
    'dream_off_players',
    'dream_offs',
    'uploads',
    'users',
  ]) {
    await db.query(`DROP TABLE IF EXISTS public.${t} CASCADE`);
  }
  await db.query(
    'CREATE TABLE public.users (id uuid PRIMARY KEY, display_name text, username text)'
  );
  await db.query('CREATE TABLE public.uploads (id uuid PRIMARY KEY)');
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

  const m410 = migrationSql('410_dream_off_reads.sql');
  for (const fn of [
    'public.get_game_room(',
    'public.get_game_gallery(',
    'public.get_my_ballot(',
    'public.get_game_activity(',
    'public.get_game_results(',
    'public.get_my_games(',
    'public.get_game_invite_preview(',
  ]) {
    await db.query(extract(m410, `CREATE OR REPLACE FUNCTION ${fn}`, '$$;'));
  }

  await db.query(
    `INSERT INTO public.users (id, username) VALUES ($1,'owner'),($2,'bob'),($3,'carol'),($4,'stranger')`,
    [OWNER, BOB, CAROL, STRANGER]
  );
});

afterAll(async () => {
  db.release();
  await pool.end();
});

describe('get_game_gallery blindness (migration 410)', () => {
  it('voting: hides authors + tallies, exposes only the viewer roses + is_mine', async () => {
    const g = await mkGame('voting');
    for (const u of [OWNER, BOB, CAROL]) await mkPlayer(g, u);
    const eOwner = await mkEntry(g, OWNER);
    await mkEntry(g, BOB);
    await rose(g, CAROL, eOwner, 0); // Carol roses the owner's entry

    await actAs(CAROL);
    const gallery = await call('get_game_gallery', g);
    expect(Array.isArray(gallery)).toBe(true);
    expect(gallery).toHaveLength(2);
    for (const item of gallery) {
      const keys = Object.keys(item).sort();
      expect(keys).toEqual(['entry_id', 'image', 'is_mine', 'roses_by_me']); // NO author_*, NO rose_count
    }
    const owned = gallery.find((x: Record<string, unknown>) => x.entry_id === eOwner);
    expect(owned.roses_by_me).toBe(true);
    expect(owned.is_mine).toBe(false);
  });

  it('submission: only the viewer sees their own entry', async () => {
    const g = await mkGame('submission');
    for (const u of [OWNER, BOB]) await mkPlayer(g, u);
    await mkEntry(g, OWNER);
    await mkEntry(g, BOB);
    await actAs(BOB);
    const gallery = await call('get_game_gallery', g);
    expect(gallery).toHaveLength(1);
    expect(gallery[0].is_mine).toBe(true);
  });

  it('results: reveals authors + rose counts + superlatives', async () => {
    const g = await mkGame('results');
    for (const u of [OWNER, BOB]) await mkPlayer(g, u);
    const eOwner = await mkEntry(g, OWNER);
    await mkEntry(g, BOB);
    await rose(g, BOB, eOwner, 0);
    await db.query(
      `INSERT INTO public.dream_off_superlatives (game_id, key, entry_id, rose_count) VALUES ($1,'winner',$2,1)`,
      [g, eOwner]
    );
    await actAs(BOB);
    const gallery = await call('get_game_gallery', g);
    const win = gallery.find((x: Record<string, unknown>) => x.entry_id === eOwner);
    expect(win.author_name).toBe('name-a1');
    expect(win.rose_count).toBe(1);
    expect(win.superlative).toBe('winner');
  });

  it('non-members are blank on a live game', async () => {
    const g = await mkGame('voting');
    await mkPlayer(g, OWNER);
    await mkEntry(g, OWNER);
    await actAs(STRANGER);
    expect(await call('get_game_gallery', g)).toEqual([]);
  });
});

describe('get_game_room + results + preview (migration 410)', () => {
  it('room: owner sees the invite code; a stranger on a live game is not_member', async () => {
    const g = await mkGame('submission');
    await mkPlayer(g, OWNER);
    await actAs(OWNER);
    const owner = await call('get_game_room', g);
    expect(owner.status).toBe('ok');
    expect(owner.is_owner).toBe(true);
    expect(owner.invite_code).toBeTruthy();

    await actAs(STRANGER);
    const stranger = await call('get_game_room', g);
    expect(stranger.status).toBe('not_member');
  });

  it('results: not_ready before terminal, podium after', async () => {
    const g = await mkGame('voting');
    await actAs(OWNER);
    expect((await call('get_game_results', g)).status).toBe('not_ready');
    await db.query(`UPDATE public.dream_offs SET phase='results' WHERE id=$1`, [g]);
    const e = await mkEntry(g, OWNER);
    await db.query(
      `INSERT INTO public.dream_off_superlatives (game_id, key, entry_id, rose_count) VALUES ($1,'winner',$2,3)`,
      [g, e]
    );
    const res = await call('get_game_results', g);
    expect(res.status).toBe('ok');
    expect(res.podium[0].key).toBe('winner');
    expect(res.podium[0].author_name).toBe('name-a1');
  });

  it('invite preview: anon-safe fields + joinable', async () => {
    const g = await mkGame('submission');
    await mkPlayer(g, OWNER);
    const code = (await db.query(`SELECT invite_code FROM public.dream_offs WHERE id=$1`, [g]))
      .rows[0].invite_code as string;
    await actAs(null); // anonymous
    const prev = await call('get_game_invite_preview', code);
    expect(prev).toMatchObject({ status: 'ok', topic: 'the most cursed sandwich', joinable: true });
    expect(prev.owner_name).toBe('owner');
    expect(prev).not.toHaveProperty('entries');
  });
});
