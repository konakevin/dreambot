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

  for (const t of [
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
    is_approved boolean, is_ai_generated boolean NOT NULL DEFAULT true
  )`);
  await db.query(`CREATE TABLE public.blocked_users (blocker_id uuid, blocked_id uuid)`);
  await db.query(`CREATE TABLE public.reports (reporter_id uuid, upload_id uuid)`);
  await db.query(`CREATE TABLE public.follows (follower_id uuid, following_id uuid)`);
  await db.query(`CREATE TABLE public.post_reposts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    reposter_id uuid NOT NULL, upload_id uuid NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
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

  // The real definition (390 = 388 penalty + 389 jitter clamp + age-aware
  // waiver): its own DROP (11-arg) + CREATE, straight from the migration file.
  await db.query(
    extract(
      migrationSql('390_feed_age_aware_penalty.sql'),
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
       ($1, 'viewer', false), ($2, 'author', false), ($3, 'dragonbot', true)`,
    [VIEWER, AUTHOR, BOT]
  );
});

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
