/**
 * LIVE-DB lock for get_feed's impression discounting (migration 388).
 *
 * The seen-post penalty existed in feed v3 (migration 104) and was silently
 * DROPPED in a later rewrite — nobody noticed for months while the same posts
 * re-served every session (the 2026-07-21 stuck-posts audit; the reporting
 * user had posts served 34x). This spec locks the restored behavior so no
 * future get_feed rewrite can lose it again:
 *   • forYou: seen posts rank below identical unseen posts (x0.55/x0.35/x0.20)
 *   • recovery: the penalty relaxes to 1.0 by 21 days since last_seen
 *   • following: gentler curve (x0.75 first view)
 *   • bots timeline: NO penalty
 *
 * Since migration 544 it also locks the fresher For You mix:
 *   • unseen posts under feed_unseen_fresh_hours get +feed_unseen_fresh_bonus (0 = off)
 *   • posts past feed_older_post_hours ignore engagement (breaks the self-like throwback loop)
 *   • older posts take turns between authors (feed_older_turn_step per within-author rank)
 *
 * p_shuffle is passed as 0 so scores are fully deterministic (no jitter term).
 * All loaded DDL comes from the real migration file — drift fails loudly.
 */

import { Pool, PoolClient } from 'pg';
import { makePool, migrationSql, extract } from './_support/pg';

const pool: Pool = makePool();
let db: PoolClient;

const VIEWER = '00000000-0000-0000-0000-00000000f001';
const AUTHOR = '00000000-0000-0000-0000-00000000f002';
const BOT = '00000000-0000-0000-0000-00000000f003';
const AUTHOR2 = '00000000-0000-0000-0000-00000000f004';

const P_UNSEEN = '00000000-0000-0000-0000-00000000aa01';
const P_SEEN3 = '00000000-0000-0000-0000-00000000aa02';
const P_RECOVERED = '00000000-0000-0000-0000-00000000aa03';
const P_SEEN1 = '00000000-0000-0000-0000-00000000aa04';

async function feedScores(
  tab: 'forYou' | 'following' | 'bots',
  botUserId: string | null = null
): Promise<Map<string, number>> {
  const { rows } = await db.query(
    `SELECT id, feed_score FROM public.get_feed($1, 50, 0, 0.0, 0.0, $2, NULL, NULL, NULL, NULL, $3)`,
    [VIEWER, tab, botUserId]
  );
  return new Map(rows.map((r) => [r.id as string, Number(r.feed_score)]));
}

beforeAll(async () => {
  db = await pool.connect();

  // 492+ guards get_feed with auth.uid(); vanilla PG has no auth schema, so stub it to a GUC.
  await db.query('CREATE SCHEMA IF NOT EXISTS auth');
  await db.query(`CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE AS $fn$ SELECT nullif(current_setting('test.uid', true), '')::uuid $fn$`);
  await db.query("SELECT set_config('test.uid', $1, false)", [VIEWER]);

  for (const t of [
    'upload_media',
    'post_impressions',
    'post_reposts',
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
  // Same shape the sibling feed spec uses + face_swap_mode (migration 386).
  await db.query(`CREATE TABLE public.uploads (
    id uuid PRIMARY KEY, user_id uuid NOT NULL,
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
    is_approved boolean, is_ai_generated boolean NOT NULL DEFAULT true,
    media_count smallint NOT NULL DEFAULT 0
  )`);
  await db.query(`CREATE TABLE public.upload_media (
    upload_id uuid NOT NULL, position integer NOT NULL DEFAULT 0,
    image_url text, image_url_display text, image_url_hq text, thumbhash text,
    width integer, height integer
  )`);
  await db.query(`CREATE TABLE public.blocked_users (blocker_id uuid, blocked_id uuid)`);
  await db.query(`CREATE TABLE public.reports (reporter_id uuid, upload_id uuid)`);
  await db.query(`CREATE TABLE public.follows (follower_id uuid, following_id uuid)`);
  await db.query(`CREATE TABLE public.post_reposts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    reposter_id uuid NOT NULL, upload_id uuid NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    active boolean NOT NULL DEFAULT true,
    activations integer NOT NULL DEFAULT 1,
    first_reposted_at timestamptz NOT NULL DEFAULT now()
  )`);
  await db.query(`CREATE TABLE public.post_impressions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL, upload_id uuid NOT NULL,
    view_count integer NOT NULL DEFAULT 1,
    first_seen timestamptz NOT NULL DEFAULT now(),
    last_seen timestamptz NOT NULL DEFAULT now(),
    UNIQUE(user_id, upload_id)
  )`);

  // Drop EVERY get_feed overload first. The sibling feed spec creates a
  // 253-era get_feed with a different arity; once two overloads coexist in the
  // shared test DB, named-arg calls become AMBIGUOUS ("function ... is not
  // unique") and whichever spec runs second fails. Both feed specs start by
  // clearing the overload set, so suite order can't matter.
  await db.query(`DO $do$ DECLARE r record; BEGIN
    FOR r IN SELECT oid::regprocedure AS sig FROM pg_proc
      WHERE proname = 'get_feed' AND pronamespace = 'public'::regnamespace
    LOOP EXECUTE 'DROP FUNCTION ' || r.sig; END LOOP;
  END $do$`);

  // engine_config singleton — only the 544 feed knobs get_feed reads, with the
  // migration's defaults (the column DDL comes from the migration file itself).
  await db.query('DROP TABLE IF EXISTS public.engine_config CASCADE');
  await db.query('CREATE TABLE public.engine_config (id integer PRIMARY KEY)');
  const sql544 = migrationSql('544_feed_fresh_first_throwback_turns.sql');
  await db.query(extract(sql544, 'ALTER TABLE public.engine_config', ';'));

  // The real, current definition (544 = 388 penalty + 389 jitter clamp + 390
  // age-aware waiver + 391 windowing + 492 auth guard + 544 fresh/throwback
  // mix), straight from the migration file. Test posts are 12h-10d old —
  // inside the 60d window, so the windowing never filters them.
  await db.query(extract(sql544, 'create or replace function public.get_feed', '$$;'));
});

afterAll(async () => {
  db.release();
  await pool.end();
});

beforeEach(async () => {
  for (const t of [
    'post_impressions',
    'post_reposts',
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
       ($1, 'viewer', false), ($2, 'author', false), ($3, 'dragonbot', true), ($4, 'author2', false)`,
    [VIEWER, AUTHOR, BOT, AUTHOR2]
  );
  // Fresh defaults every test (a DEFAULT VALUES row = the migration's defaults).
  await db.query('DELETE FROM public.engine_config');
  await db.query('INSERT INTO public.engine_config (id) VALUES (1)');
});

async function setConfig(col: string, value: number | boolean) {
  await db.query(`UPDATE public.engine_config SET ${col} = $1 WHERE id = 1`, [value]);
}

/** Insert identical public posts by AUTHOR (same age/engagement, differing only
 *  by id) so any score difference is purely the seen-penalty. Default age is 5
 *  days — PAST the 72h youth window, so the full penalty applies (migration
 *  390's waiver only affects younger posts). */
async function insertIdenticalPosts(ids: string[], authorId = AUTHOR, age = '5 days') {
  for (const id of ids) {
    await db.query(
      `INSERT INTO public.uploads
         (id, user_id, image_url, posted_at, created_at, like_count, view_count, is_ai_generated)
       VALUES ($1, $2, 'https://x/i.png', now() - $4::interval,
               now() - $4::interval, 40, 200, $3)`,
      [id, authorId, authorId === BOT, age]
    );
  }
}

it('forYou: a seen post ranks below an identical unseen post (x0.20 at 3+ views)', async () => {
  await insertIdenticalPosts([P_UNSEEN, P_SEEN3]);
  await db.query(
    `INSERT INTO public.post_impressions (user_id, upload_id, view_count, last_seen)
     VALUES ($1, $2, 3, now())`,
    [VIEWER, P_SEEN3]
  );
  const scores = await feedScores('forYou');
  const unseen = scores.get(P_UNSEEN)!;
  const seen = scores.get(P_SEEN3)!;
  expect(seen).toBeLessThan(unseen);
  // Multiplicative factor: identical posts, jitter off → exact ratio.
  expect(seen / unseen).toBeCloseTo(0.2, 5);
});

it('forYou: the penalty RECOVERS — 30 days since last view scores like unseen (callbacks)', async () => {
  await insertIdenticalPosts([P_UNSEEN, P_RECOVERED]);
  await db.query(
    `INSERT INTO public.post_impressions (user_id, upload_id, view_count, last_seen)
     VALUES ($1, $2, 3, now() - interval '30 days')`,
    [VIEWER, P_RECOVERED]
  );
  const scores = await feedScores('forYou');
  expect(scores.get(P_RECOVERED)!).toBeCloseTo(scores.get(P_UNSEEN)!, 6);
});

it('following: gentler penalty (x0.75 after one view)', async () => {
  await db.query(`INSERT INTO public.follows (follower_id, following_id) VALUES ($1, $2)`, [
    VIEWER,
    AUTHOR,
  ]);
  await insertIdenticalPosts([P_UNSEEN, P_SEEN1]);
  await db.query(
    `INSERT INTO public.post_impressions (user_id, upload_id, view_count, last_seen)
     VALUES ($1, $2, 1, now())`,
    [VIEWER, P_SEEN1]
  );
  const scores = await feedScores('following');
  expect(scores.get(P_SEEN1)! / scores.get(P_UNSEEN)!).toBeCloseTo(0.75, 5);
});

it('age-aware waiver: a 12h-old post seen 3x keeps ~87% of its score (migration 390)', async () => {
  // youth = 1 - 12/72 = 0.8333 → factor = 0.20 + 0.80 * 0.8333 = 0.8667.
  // Fresh posts may repeat (small-catalog reality); the full x0.20 suppression
  // only applies once a post ages past the 72h window (see the 5-day tests).
  // The 544 unseen-fresh bonus would lift only P_UNSEEN — off here to isolate the waiver.
  await setConfig('feed_unseen_fresh_bonus', 0);
  await insertIdenticalPosts([P_UNSEEN, P_SEEN3], AUTHOR, '12 hours');
  await db.query(
    `INSERT INTO public.post_impressions (user_id, upload_id, view_count, last_seen)
     VALUES ($1, $2, 3, now())`,
    [VIEWER, P_SEEN3]
  );
  const scores = await feedScores('forYou');
  expect(scores.get(P_SEEN3)! / scores.get(P_UNSEEN)!).toBeCloseTo(0.8667, 3);
});

it('jitter is clamped: shuffle 0.45 scores identically to 0.15 (migration 389)', async () => {
  await insertIdenticalPosts([P_UNSEEN, P_SEEN1]);
  const at = async (shuffle: number) => {
    const { rows } = await db.query(
      `SELECT id, feed_score FROM public.get_feed($1, 50, 0, 0.7, $2, 'forYou', NULL, NULL, NULL, NULL, NULL)`,
      [VIEWER, shuffle]
    );
    return new Map(rows.map((r) => [r.id as string, Number(r.feed_score)]));
  };
  const wild = await at(0.45);
  const clamped = await at(0.15);
  for (const [id, score] of wild) expect(clamped.get(id)!).toBeCloseTo(score, 8);
});

it('bots timeline: NO seen penalty (chronological order untouched)', async () => {
  await insertIdenticalPosts([P_UNSEEN, P_SEEN3], BOT);
  await db.query(
    `INSERT INTO public.post_impressions (user_id, upload_id, view_count, last_seen)
     VALUES ($1, $2, 5, now())`,
    [VIEWER, P_SEEN3]
  );
  const scores = await feedScores('bots');
  expect(scores.get(P_SEEN3)!).toBeCloseTo(scores.get(P_UNSEEN)!, 8);
});

// ---------------------------------------------------------------------------
// Migration 544 — fresher For You + diverse throwbacks
// ---------------------------------------------------------------------------

const P_A1 = '00000000-0000-0000-0000-00000000bb01';
const P_A2 = '00000000-0000-0000-0000-00000000bb02';
const P_A3 = '00000000-0000-0000-0000-00000000bb03';
const P_B1 = '00000000-0000-0000-0000-00000000bb04';

async function insertPost(id: string, authorId: string, age: string, likes: number) {
  await db.query(
    `INSERT INTO public.uploads
       (id, user_id, image_url, posted_at, created_at, like_count, view_count, is_ai_generated)
     VALUES ($1, $2, 'https://x/i.png', now() - $3::interval, now() - $3::interval, $4, 200, false)`,
    [id, authorId, age, likes]
  );
}

// Cross-call comparisons use 5 decimals: now() advances between the two get_feed
// calls, so time-decayed terms drift ~1e-8. Real effects here are >= 0.04.
it('544: an UNSEEN post under 24h gets exactly +0.40; 0 turns it off', async () => {
  await insertIdenticalPosts([P_UNSEEN], AUTHOR, '12 hours');
  const on = (await feedScores('forYou')).get(P_UNSEEN)!;
  await setConfig('feed_unseen_fresh_bonus', 0);
  const off = (await feedScores('forYou')).get(P_UNSEEN)!;
  expect(on - off).toBeCloseTo(0.4, 5);
});

it("544: a SEEN fresh post gets no bonus (no re-serving today's posts every open)", async () => {
  await insertIdenticalPosts([P_SEEN1], AUTHOR, '12 hours');
  await db.query(
    `INSERT INTO public.post_impressions (user_id, upload_id, view_count, last_seen)
     VALUES ($1, $2, 1, now())`,
    [VIEWER, P_SEEN1]
  );
  const on = (await feedScores('forYou')).get(P_SEEN1)!;
  await setConfig('feed_unseen_fresh_bonus', 0);
  const off = (await feedScores('forYou')).get(P_SEEN1)!;
  expect(on).toBeCloseTo(off, 5);
});

it('544: older posts (7d+) ignore engagement — 40 likes scores like 0 likes', async () => {
  await insertPost(P_A1, AUTHOR, '10 days', 40);
  await insertPost(P_B1, AUTHOR2, '10 days', 0);
  let s = await feedScores('forYou');
  expect(s.get(P_A1)!).toBeCloseTo(s.get(P_B1)!, 8);
  // The switch restores engagement ranking for older posts.
  await setConfig('feed_older_ignore_engagement', false);
  s = await feedScores('forYou');
  expect(s.get(P_A1)!).toBeGreaterThan(s.get(P_B1)!);
});

it('544: engagement still lifts posts younger than 7 days', async () => {
  await insertPost(P_A1, AUTHOR, '5 days', 40);
  await insertPost(P_B1, AUTHOR2, '5 days', 0);
  const s = await feedScores('forYou');
  expect(s.get(P_A1)!).toBeGreaterThan(s.get(P_B1)!);
});

it("544: older posts take turns — every author's first pick before anyone's second", async () => {
  for (const id of [P_A1, P_A2, P_A3]) await insertPost(id, AUTHOR, '10 days', 0);
  await insertPost(P_B1, AUTHOR2, '10 days', 0);
  let s = await feedScores('forYou');
  const a = [P_A1, P_A2, P_A3].map((id) => s.get(id)!).sort((x, y) => y - x);
  const b = s.get(P_B1)!;
  // Identical base scores (jitter off): AUTHOR's picks step down 0.04 per rank.
  expect(a[0]).toBeCloseTo(b, 8);
  expect(a[0] - a[1]).toBeCloseTo(0.04, 8);
  expect(a[0] - a[2]).toBeCloseTo(0.08, 8);
  // 0 = off: all four tie again.
  await setConfig('feed_older_turn_step', 0);
  s = await feedScores('forYou');
  for (const id of [P_A1, P_A2, P_A3]) expect(s.get(id)!).toBeCloseTo(b, 5);
});

it('544: the fresh/throwback knobs never touch the Following tab', async () => {
  await db.query(`INSERT INTO public.follows (follower_id, following_id) VALUES ($1, $2)`, [
    VIEWER,
    AUTHOR,
  ]);
  await insertPost(P_A1, AUTHOR, '12 hours', 40);
  await insertPost(P_A2, AUTHOR, '10 days', 40);
  const before = await feedScores('following');
  await setConfig('feed_unseen_fresh_bonus', 0);
  await setConfig('feed_older_ignore_engagement', false);
  await setConfig('feed_older_turn_step', 0);
  const after = await feedScores('following');
  for (const id of [P_A1, P_A2]) expect(after.get(id)!).toBeCloseTo(before.get(id)!, 5);
});
