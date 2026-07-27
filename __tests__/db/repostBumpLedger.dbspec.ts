/**
 * LIVE-DB lock for the repost ONE-TIME-BUMP ledger (migrations 418 + 419).
 *
 * PRODUCT RULE (Kevin, 2026-07-26): a repost floats a dream to the top of the
 * reposter's FOLLOWERS' feed like a fresh post — but only ONCE per (reposter,
 * dream), ever. repost → un-repost → repost must NOT bump the feed a second time;
 * the re-repost stays in the reposter's album but never re-surfaces. This spec
 * pins the mechanism so a future rewrite can't quietly reopen the manipulation:
 *   • un-repost SOFT-deactivates (row kept, active=false) — never deletes;
 *   • re-repost sets active=true, activations=2, first_reposted_at FROZEN;
 *   • repost_count follows the ACTIVE set across all three transitions;
 *   • get_feed surfaces a followed user's FIRST repost, but NOT a re-repost.
 *
 * All function/get_feed DDL is loaded straight from the migration files — drift
 * fails loudly. auth.uid() is stubbed to a session GUC; one pooled client.
 */

import { Pool, PoolClient } from 'pg';
import { makePool, migrationSql, extract } from './_support/pg';

const pool: Pool = makePool();
let db: PoolClient;

const VIEWER = '00000000-0000-0000-0000-0000000000e1';
const AUTHOR = '00000000-0000-0000-0000-0000000000e2';
const REPOSTER = '00000000-0000-0000-0000-0000000000e3';
const POST = '00000000-0000-0000-0000-0000000000d1';

async function actAs(uid: string): Promise<void> {
  await db.query("SELECT set_config('test.uid', $1, false)", [uid]);
}

async function followingIds(): Promise<Map<string, { surface: string; reposter: string | null }>> {
  const { rows } = await db.query(
    `SELECT id, surface_type, reposter_id
       FROM public.get_feed($1, 50, 0, 0.0, 0.0, 'following', NULL, NULL, NULL, NULL, NULL)`,
    [VIEWER]
  );
  return new Map(
    rows.map((r) => [
      r.id as string,
      { surface: r.surface_type as string, reposter: (r.reposter_id as string) ?? null },
    ])
  );
}

beforeAll(async () => {
  db = await pool.connect();
  const sql418 = migrationSql('418_repost_bump_ledger.sql');

  await db.query('CREATE SCHEMA IF NOT EXISTS auth');
  await db.query(`CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE AS $fn$ SELECT nullif(current_setting('test.uid', true), '')::uuid $fn$`);

  for (const t of [
    'post_impressions',
    'post_reposts',
    'notifications',
    'follows',
    'reports',
    'blocked_users',
    'uploads',
    'users',
  ]) {
    await db.query(`DROP TABLE IF EXISTS public.${t} CASCADE`);
  }

  await db.query(`CREATE TABLE public.users (
    id uuid PRIMARY KEY, username text, avatar_url text,
    allow_reposts boolean NOT NULL DEFAULT true,
    allow_downloads boolean NOT NULL DEFAULT true,
    is_public boolean NOT NULL DEFAULT true,
    is_bot boolean NOT NULL DEFAULT false
  )`);
  await db.query(`CREATE TABLE public.uploads (
    id uuid PRIMARY KEY, user_id uuid NOT NULL REFERENCES public.users(id),
    image_url text, image_url_hq text, image_url_display text, thumbhash text,
    width integer, height integer, caption text, description text,
    created_at timestamptz NOT NULL DEFAULT now(), posted_at timestamptz,
    comment_count integer NOT NULL DEFAULT 0, like_count integer NOT NULL DEFAULT 0,
    share_count integer NOT NULL DEFAULT 0,
    save_count integer NOT NULL DEFAULT 0, view_count integer NOT NULL DEFAULT 0,
    repost_count integer NOT NULL DEFAULT 0,
    ai_prompt text, ai_concept jsonb, bot_message text,
    dream_medium text, dream_vibe text, model text, face_swap_mode text,
    is_public boolean NOT NULL DEFAULT true, is_moderated boolean NOT NULL DEFAULT false,
    is_approved boolean, is_ai_generated boolean NOT NULL DEFAULT true
  )`);
  await db.query(`CREATE TABLE public.blocked_users (blocker_id uuid, blocked_id uuid)`);
  await db.query(`CREATE TABLE public.reports (reporter_id uuid, upload_id uuid)`);
  await db.query(`CREATE TABLE public.follows (follower_id uuid, following_id uuid)`);
  await db.query(`CREATE TABLE public.notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id uuid, actor_id uuid, type text, upload_id uuid,
    created_at timestamptz NOT NULL DEFAULT now()
  )`);
  // The full ledger shape (matches migration 418's ALTER'd columns).
  await db.query(`CREATE TABLE public.post_reposts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    reposter_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    upload_id uuid NOT NULL REFERENCES public.uploads(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    active boolean NOT NULL DEFAULT true,
    activations integer NOT NULL DEFAULT 1,
    first_reposted_at timestamptz NOT NULL DEFAULT now(),
    last_reposted_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (reposter_id, upload_id)
  )`);
  await db.query(`CREATE TABLE public.post_impressions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL, upload_id uuid NOT NULL,
    view_count integer NOT NULL DEFAULT 1,
    first_seen timestamptz NOT NULL DEFAULT now(),
    last_seen timestamptz NOT NULL DEFAULT now(),
    UNIQUE(user_id, upload_id)
  )`);

  // Real DDL under test (418): the count + freeze triggers and the state machine.
  await db.query(
    extract(sql418, 'CREATE OR REPLACE FUNCTION public.freeze_repost_first_at', '$$;')
  );
  await db.query(extract(sql418, 'CREATE OR REPLACE FUNCTION public.update_repost_count', '$$;'));
  await db.query(extract(sql418, 'CREATE OR REPLACE FUNCTION public.toggle_repost', '$$;'));
  await db.query(`CREATE TRIGGER trg_repost_count
    AFTER INSERT OR UPDATE OR DELETE ON public.post_reposts
    FOR EACH ROW EXECUTE FUNCTION public.update_repost_count()`);
  await db.query(`CREATE TRIGGER trg_freeze_repost_first_at
    BEFORE UPDATE ON public.post_reposts
    FOR EACH ROW EXECUTE FUNCTION public.freeze_repost_first_at()`);

  // Clear any get_feed overload a sibling spec left, then load the real 419.
  await db.query(`DO $do$ DECLARE r record; BEGIN
    FOR r IN SELECT oid::regprocedure AS sig FROM pg_proc
      WHERE proname = 'get_feed' AND pronamespace = 'public'::regnamespace
    LOOP EXECUTE 'DROP FUNCTION ' || r.sig; END LOOP;
  END $do$`);
  await db.query(
    extract(
      migrationSql('419_get_feed_repost_bump.sql'),
      'DROP FUNCTION IF EXISTS public.get_feed',
      '$$;'
    )
  );
});

afterAll(async () => {
  db.release();
  await pool.end();
});

beforeEach(async () => {
  for (const t of [
    'post_impressions',
    'post_reposts',
    'notifications',
    'follows',
    'reports',
    'blocked_users',
    'uploads',
    'users',
  ]) {
    await db.query(`DELETE FROM public.${t}`);
  }
  await db.query(
    `INSERT INTO public.users (id, username, is_bot) VALUES
       ($1,'viewer',false), ($2,'author',false), ($3,'reposter',false)`,
    [VIEWER, AUTHOR, REPOSTER]
  );
  // AUTHOR's public post, 10 days old (inside the 60d window, past the 72h youth
  // waiver — none of that matters here; we assert presence/absence + attribution).
  await db.query(
    `INSERT INTO public.uploads (id, user_id, image_url, posted_at, created_at, view_count)
     VALUES ($1,$2,'https://x/i.png', now() - interval '10 days', now() - interval '10 days', 100)`,
    [POST, AUTHOR]
  );
});

describe('toggle_repost ledger', () => {
  it('first repost: active, activations=1, first_reposted_at set, count=1, author notified', async () => {
    await actAs(REPOSTER);
    const { rows } = await db.query('SELECT * FROM public.toggle_repost($1)', [POST]);
    expect(rows[0].reposted).toBe(true);
    expect(rows[0].repost_count).toBe(1);

    const r = await db.query('SELECT * FROM public.post_reposts WHERE upload_id=$1', [POST]);
    expect(r.rowCount).toBe(1);
    expect(r.rows[0].active).toBe(true);
    expect(r.rows[0].activations).toBe(1);
    expect(r.rows[0].first_reposted_at).not.toBeNull();

    const n = await db.query("SELECT * FROM public.notifications WHERE type='post_repost'");
    expect(n.rowCount).toBe(1);
    expect(n.rows[0].recipient_id).toBe(AUTHOR);
  });

  it('un-repost SOFT-deactivates: row kept (active=false), count back to 0', async () => {
    await actAs(REPOSTER);
    await db.query('SELECT public.toggle_repost($1)', [POST]);
    const { rows } = await db.query('SELECT * FROM public.toggle_repost($1)', [POST]);
    expect(rows[0].reposted).toBe(false);
    expect(rows[0].repost_count).toBe(0);

    const r = await db.query('SELECT * FROM public.post_reposts WHERE upload_id=$1', [POST]);
    expect(r.rowCount).toBe(1); // row is a tombstone, NOT deleted
    expect(r.rows[0].active).toBe(false);
    expect(r.rows[0].activations).toBe(1);
  });

  it('re-repost: activations=2, first_reposted_at FROZEN, count=1, NO new notification', async () => {
    await actAs(REPOSTER);
    await db.query('SELECT public.toggle_repost($1)', [POST]); // first
    const first = (
      await db.query('SELECT first_reposted_at FROM public.post_reposts WHERE upload_id=$1', [POST])
    ).rows[0].first_reposted_at;
    await db.query('SELECT public.toggle_repost($1)', [POST]); // un-repost
    const { rows } = await db.query('SELECT * FROM public.toggle_repost($1)', [POST]); // re-repost
    expect(rows[0].reposted).toBe(true);
    expect(rows[0].repost_count).toBe(1);

    const r = await db.query('SELECT * FROM public.post_reposts WHERE upload_id=$1', [POST]);
    expect(r.rows[0].active).toBe(true);
    expect(r.rows[0].activations).toBe(2);
    expect(new Date(r.rows[0].first_reposted_at).getTime()).toBe(new Date(first).getTime());

    // Only the first repost notifies; a re-repost must not re-ping the author.
    const n = await db.query("SELECT * FROM public.notifications WHERE type='post_repost'");
    expect(n.rowCount).toBe(1);
  });

  it('freeze trigger: a raw UPDATE of first_reposted_at is ignored', async () => {
    await actAs(REPOSTER);
    await db.query('SELECT public.toggle_repost($1)', [POST]);
    const before = (
      await db.query('SELECT first_reposted_at FROM public.post_reposts WHERE upload_id=$1', [POST])
    ).rows[0].first_reposted_at;
    await db.query(
      `UPDATE public.post_reposts SET first_reposted_at = now() - interval '100 days' WHERE upload_id=$1`,
      [POST]
    );
    const after = (
      await db.query('SELECT first_reposted_at FROM public.post_reposts WHERE upload_id=$1', [POST])
    ).rows[0].first_reposted_at;
    expect(new Date(after).getTime()).toBe(new Date(before).getTime());
  });
});

describe('get_feed one-time bump', () => {
  beforeEach(async () => {
    // VIEWER follows the REPOSTER but NOT the author — so the post can only reach
    // VIEWER via the repost surface, never as an original.
    await db.query('INSERT INTO public.follows (follower_id, following_id) VALUES ($1,$2)', [
      VIEWER,
      REPOSTER,
    ]);
  });

  it("a followed user's FIRST repost surfaces (following tab, attributed)", async () => {
    await actAs(REPOSTER);
    await db.query('SELECT public.toggle_repost($1)', [POST]);
    const feed = await followingIds();
    expect(feed.has(POST)).toBe(true);
    expect(feed.get(POST)!.surface).toBe('repost');
    expect(feed.get(POST)!.reposter).toBe(REPOSTER);
  });

  it('a RE-repost (activations>1) does NOT surface again — album-only', async () => {
    await actAs(REPOSTER);
    await db.query('SELECT public.toggle_repost($1)', [POST]); // first (bumps)
    await db.query('SELECT public.toggle_repost($1)', [POST]); // un-repost
    await db.query('SELECT public.toggle_repost($1)', [POST]); // re-repost (activations=2)
    const feed = await followingIds();
    // VIEWER doesn't follow AUTHOR and repost_agg now excludes activations>1, so
    // the post has no path into the feed — the second bump is denied.
    expect(feed.has(POST)).toBe(false);
  });
});
