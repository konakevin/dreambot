/**
 * LIVE-DB test for repost surfacing in get_feed (migration 243).
 *
 * Loads the real get_feed body on top of stub tables and verifies: a post by a
 * NON-followed author that a FOLLOWED user reposted shows up in the Following
 * feed as a 'repost' surface attributed to the reposter; a followed author's own
 * post stays 'original'; a non-followed, non-reposted post is absent; repost_count
 * is returned; forYou attributes a friend's repost. Dedup/collapse is implicit in
 * repost_agg's GROUP BY (one row per upload).
 */

import { Pool, PoolClient } from 'pg';
import { makePool, migrationSql, extract } from './_support/pg';

const pool: Pool = makePool();
let db: PoolClient;

const VIEWER = '00000000-0000-0000-0000-00000000a001';
const FOLLOWED = '00000000-0000-0000-0000-00000000a002'; // viewer follows this user
const AUTHOR = '00000000-0000-0000-0000-00000000a003'; // public, viewer does NOT follow

const POST_FOLLOWED = '00000000-0000-0000-0000-00000000b001'; // by FOLLOWED
const POST_AUTHOR = '00000000-0000-0000-0000-00000000b002'; // by AUTHOR, reposted by FOLLOWED
const POST_LONELY = '00000000-0000-0000-0000-00000000b003'; // by AUTHOR, not reposted

async function insertUpload(id: string, userId: string): Promise<void> {
  await db.query(
    `INSERT INTO public.uploads
       (id, user_id, image_url, is_public, posted_at, is_moderated, is_approved, is_ai_generated)
     VALUES ($1,$2,'http://img', true, now(), false, true, true)`,
    [id, userId]
  );
}

async function feed(tab: string): Promise<Record<string, unknown>[]> {
  const { rows } = await db.query(
    'SELECT * FROM public.get_feed(p_user_id := $1, p_tab := $2, p_limit := 50)',
    [VIEWER, tab]
  );
  return rows;
}

beforeAll(async () => {
  db = await pool.connect();
  const sql = migrationSql('243_get_feed_reposts.sql');

  await db.query('DROP TABLE IF EXISTS public.post_reposts CASCADE');
  await db.query('DROP TABLE IF EXISTS public.uploads CASCADE');
  await db.query('DROP TABLE IF EXISTS public.users CASCADE');
  await db.query('DROP TABLE IF EXISTS public.follows CASCADE');
  await db.query('DROP TABLE IF EXISTS public.blocked_users CASCADE');
  await db.query('DROP TABLE IF EXISTS public.reports CASCADE');

  await db.query(`CREATE TABLE public.users (
    id uuid PRIMARY KEY, username text, avatar_url text,
    is_public boolean NOT NULL DEFAULT true, is_bot boolean NOT NULL DEFAULT false
  )`);
  await db.query(`CREATE TABLE public.follows (follower_id uuid, following_id uuid)`);
  await db.query(`CREATE TABLE public.blocked_users (blocker_id uuid, blocked_id uuid)`);
  await db.query(`CREATE TABLE public.reports (reporter_id uuid, upload_id uuid)`);
  await db.query(`CREATE TABLE public.uploads (
    id uuid PRIMARY KEY, user_id uuid NOT NULL,
    image_url text, image_url_hq text, image_url_display text, thumbhash text,
    width integer, height integer, caption text, description text,
    created_at timestamptz NOT NULL DEFAULT now(), posted_at timestamptz,
    comment_count integer NOT NULL DEFAULT 0, like_count integer NOT NULL DEFAULT 0,
    fuse_count integer NOT NULL DEFAULT 0, share_count integer NOT NULL DEFAULT 0,
    save_count integer NOT NULL DEFAULT 0, view_count integer NOT NULL DEFAULT 0,
    repost_count integer NOT NULL DEFAULT 0,
    ai_prompt text, ai_concept jsonb, bot_message text,
    dream_medium text, dream_vibe text, model text,
    is_public boolean NOT NULL DEFAULT true, is_moderated boolean NOT NULL DEFAULT false,
    is_approved boolean, is_ai_generated boolean NOT NULL DEFAULT true
  )`);
  await db.query(`CREATE TABLE public.post_reposts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    reposter_id uuid NOT NULL, upload_id uuid NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
  )`);

  await db.query(extract(sql, 'CREATE FUNCTION public.get_feed', '$$;'));
});

afterAll(async () => {
  db.release();
  await pool.end();
});

beforeEach(async () => {
  for (const t of ['post_reposts', 'uploads', 'follows', 'users', 'blocked_users', 'reports']) {
    await db.query(`DELETE FROM public.${t}`);
  }
  await db.query(
    `INSERT INTO public.users (id, username, is_public, is_bot) VALUES
      ($1,'viewer',true,false), ($2,'followed_user',true,false), ($3,'author',true,false)`,
    [VIEWER, FOLLOWED, AUTHOR]
  );
  await db.query('INSERT INTO public.follows (follower_id, following_id) VALUES ($1,$2)', [
    VIEWER,
    FOLLOWED,
  ]);
  await insertUpload(POST_FOLLOWED, FOLLOWED);
  await insertUpload(POST_AUTHOR, AUTHOR);
  await insertUpload(POST_LONELY, AUTHOR);
  // FOLLOWED reposts AUTHOR's post; bump its denormalized repost_count.
  await db.query('INSERT INTO public.post_reposts (reposter_id, upload_id) VALUES ($1,$2)', [
    FOLLOWED,
    POST_AUTHOR,
  ]);
  await db.query('UPDATE public.uploads SET repost_count = 1 WHERE id = $1', [POST_AUTHOR]);
});

describe('get_feed — Following tab', () => {
  it("includes a follow's repost of a non-followed author as a 'repost' surface", async () => {
    const rows = await feed('following');
    const ids = rows.map((r) => r.id);
    expect(ids).toContain(POST_FOLLOWED); // own follow's original
    expect(ids).toContain(POST_AUTHOR); // surfaced via repost
    expect(ids).not.toContain(POST_LONELY); // non-followed, non-reposted → absent

    const reposted = rows.find((r) => r.id === POST_AUTHOR)!;
    expect(reposted.surface_type).toBe('repost');
    expect(reposted.reposter_name).toBe('followed_user');
    expect(reposted.reposter_id).toBe(FOLLOWED);
    expect(reposted.reposters_more).toBe(0);
    expect(reposted.repost_count).toBe(1);
  });

  it("a followed author's own post is an 'original' surface", async () => {
    const rows = await feed('following');
    const own = rows.find((r) => r.id === POST_FOLLOWED)!;
    expect(own.surface_type).toBe('original');
    expect(own.reposter_id).toBeNull();
  });

  it('collapses multiple followed reposters into reposters_more', async () => {
    // a second followed user also reposts POST_AUTHOR
    const FOLLOWED2 = '00000000-0000-0000-0000-00000000a004';
    await db.query('INSERT INTO public.users (id, username) VALUES ($1,$2)', [FOLLOWED2, 'second']);
    await db.query('INSERT INTO public.follows (follower_id, following_id) VALUES ($1,$2)', [
      VIEWER,
      FOLLOWED2,
    ]);
    await db.query('INSERT INTO public.post_reposts (reposter_id, upload_id) VALUES ($1,$2)', [
      FOLLOWED2,
      POST_AUTHOR,
    ]);
    const rows = await feed('following');
    const reposted = rows.filter((r) => r.id === POST_AUTHOR);
    expect(reposted).toHaveLength(1); // dedup: ONE card despite two reposters
    expect(reposted[0].reposters_more).toBe(1); // "and 1 other"
  });
});

describe('get_feed — forYou tab', () => {
  it("attributes a friend's repost (author not followed) as a 'repost' surface", async () => {
    const rows = await feed('forYou');
    const reposted = rows.find((r) => r.id === POST_AUTHOR);
    expect(reposted).toBeDefined();
    expect(reposted!.surface_type).toBe('repost');
    expect(reposted!.reposter_name).toBe('followed_user');
  });
});
