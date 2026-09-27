/**
 * LIVE-DB test for keeping track of bots (migration 559, ALBUM_DISCOVERY_PLAN.md phase 2).
 *
 * The Bots tab shows "12 new" on each bot's pill, a bot's profile marks the posts that
 * arrived since your last visit (NEW + the "You're caught up" line), and "Haven't seen"
 * lists the bot's posts you never looked at full size. All of it reads post_impressions,
 * which the app can't read directly, so the four functions are SECURITY DEFINER and
 * scoped to auth.uid(). This loads their real bodies and locks what they return:
 *
 *   - day one starts every bot at 0 new (visits seeded at now()), never "3,600 new"
 *   - "new" = posted after your last visit AND not already seen by YOU
 *   - leaving a bot resets only that bot's count
 *   - get_bot_visit hands back the previous visit + the unseen posts newer than it
 *   - get_bot_unseen_posts = this bot's public, live posts you haven't seen
 *   - the definer functions never read a private bot's or a member's posts
 *   - one person's visits and views never move another person's counts
 *
 * Not loaded: the bot_visits RLS policy and the GRANT / REVOKE lines (they need the
 * Supabase `authenticated` / `anon` roles a vanilla Postgres lacks). The tests call the
 * functions as the owner, which is what SECURITY DEFINER does in production anyway.
 * auth.uid() is stubbed from the `test.uid` setting, like the sibling specs.
 */

import { Pool, PoolClient } from 'pg';
import { makePool, migrationSql, extract } from './_support/pg';

const pool: Pool = makePool();
let db: PoolClient;

const VIEWER = '00000000-0000-0000-0000-00000000e001';
const VIEWER2 = '00000000-0000-0000-0000-00000000e002';
const MEMBER = '00000000-0000-0000-0000-00000000e003';
const BOT_A = '00000000-0000-0000-0000-00000000e0a1';
const BOT_B = '00000000-0000-0000-0000-00000000e0b1';
const BOT_PRIVATE = '00000000-0000-0000-0000-00000000e0c1';

/** Post ids: readable in failures, e.g. post(1) = ...f001. */
const post = (n: number) => `00000000-0000-0000-0000-00000000f${String(n).padStart(3, '0')}`;

const SQL = migrationSql('559_bot_visits.sql');

async function asUser(uid: string | null): Promise<void> {
  await db.query("SELECT set_config('test.uid', $1, false)", [uid ?? '']);
}

interface PostOpts {
  owner: string;
  minutesAgo: number;
  isPublic?: boolean;
  quarantined?: boolean;
  isActive?: boolean | null;
}

async function addPost(id: string, o: PostOpts): Promise<void> {
  await db.query(
    `INSERT INTO public.uploads (id, user_id, is_public, quarantined_at, is_active, posted_at)
     VALUES ($1, $2, $3, CASE WHEN $4 THEN now() END, $5, now() - make_interval(mins => $6))`,
    [
      id,
      o.owner,
      o.isPublic ?? true,
      o.quarantined ?? false,
      o.isActive === undefined ? true : o.isActive,
      o.minutesAgo,
    ]
  );
}

async function sawFullSize(user: string, uploadId: string): Promise<void> {
  await db.query('INSERT INTO public.post_impressions (user_id, upload_id) VALUES ($1, $2)', [
    user,
    uploadId,
  ]);
}

/** Put the viewer's last visit to a bot `minutesAgo` minutes in the past. */
async function visitedAgo(user: string, bot: string, minutesAgo: number): Promise<void> {
  await db.query(
    `UPDATE public.bot_visits SET last_visited_at = now() - make_interval(mins => $3)
      WHERE user_id = $1 AND bot_id = $2`,
    [user, bot, minutesAgo]
  );
}

/** get_bot_new_counts() as `user`, as { botId: count }. */
async function newCounts(user: string): Promise<Record<string, number>> {
  await asUser(user);
  const { rows } = await db.query<{ bot_id: string; new_count: number }>(
    'SELECT bot_id, new_count FROM public.get_bot_new_counts()'
  );
  return Object.fromEntries(rows.map((r) => [r.bot_id, r.new_count]));
}

async function unseenIds(user: string, bot: string): Promise<string[]> {
  await asUser(user);
  const { rows } = await db.query<{ id: string }>(
    'SELECT id FROM public.get_bot_unseen_posts($1) ORDER BY id',
    [bot]
  );
  return rows.map((r) => r.id);
}

async function visitRows(user: string): Promise<string[]> {
  const { rows } = await db.query<{ bot_id: string }>(
    'SELECT bot_id FROM public.bot_visits WHERE user_id = $1 ORDER BY bot_id',
    [user]
  );
  return rows.map((r) => r.bot_id);
}

beforeAll(async () => {
  db = await pool.connect();

  // All dbspecs share ONE database; other specs build their own users/uploads shapes.
  // Drop first (CASCADE also drops get_bot_unseen_posts, which is SETOF uploads).
  for (const t of ['bot_visits', 'post_impressions', 'uploads', 'users']) {
    await db.query(`DROP TABLE IF EXISTS public.${t} CASCADE`);
  }
  for (const f of [
    'get_bot_new_counts()',
    'mark_bot_visited(uuid)',
    'get_bot_visit(uuid)',
    'get_bot_unseen_posts(uuid)',
  ]) {
    await db.query(`DROP FUNCTION IF EXISTS public.${f} CASCADE`);
  }

  await db.query('CREATE SCHEMA IF NOT EXISTS auth');
  await db.query(`CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE AS 'SELECT NULLIF(current_setting(''test.uid'', true), '''')::uuid'`);

  await db.query(`CREATE TABLE public.users (
    id uuid PRIMARY KEY, is_bot boolean NOT NULL DEFAULT false, is_public boolean NOT NULL DEFAULT true
  )`);
  await db.query(`CREATE TABLE public.uploads (
    id uuid PRIMARY KEY, user_id uuid NOT NULL, is_public boolean NOT NULL DEFAULT true,
    quarantined_at timestamptz, is_active boolean, posted_at timestamptz
  )`);
  await db.query(
    `CREATE TABLE public.post_impressions (user_id uuid NOT NULL, upload_id uuid NOT NULL)`
  );

  // Real DDL from the migration: the table, then the four functions.
  await db.query(extract(SQL, 'CREATE TABLE IF NOT EXISTS public.bot_visits', '\n);'));
  await db.query(extract(SQL, 'CREATE FUNCTION public.get_bot_new_counts()', '$$;'));
  await db.query(extract(SQL, 'CREATE FUNCTION public.mark_bot_visited(', '$$;'));
  await db.query(extract(SQL, 'CREATE FUNCTION public.get_bot_visit(', '$$;'));
  await db.query(extract(SQL, 'CREATE FUNCTION public.get_bot_unseen_posts(', '$$;'));
});

afterAll(async () => {
  db.release();
  await pool.end();
});

beforeEach(async () => {
  for (const t of ['bot_visits', 'post_impressions', 'uploads', 'users']) {
    await db.query(`DELETE FROM public.${t}`);
  }
  await db.query(
    `INSERT INTO public.users (id, is_bot, is_public) VALUES
       ($1, false, true), ($2, false, true), ($3, false, true),
       ($4, true, true), ($5, true, true), ($6, true, false)`,
    [VIEWER, VIEWER2, MEMBER, BOT_A, BOT_B, BOT_PRIVATE]
  );
  await asUser(null);
});

it('the first look at the Bots tab starts every public bot at 0 new, whatever they posted before', async () => {
  await addPost(post(1), { owner: BOT_A, minutesAgo: 60 * 24 });
  await addPost(post(2), { owner: BOT_A, minutesAgo: 60 * 5 });
  await addPost(post(3), { owner: BOT_B, minutesAgo: 60 });

  expect(await newCounts(VIEWER)).toEqual({ [BOT_A]: 0, [BOT_B]: 0 });

  // Seeded one visit per PUBLIC bot, at now(): no private bot, no member account.
  expect(await visitRows(VIEWER)).toEqual([BOT_A, BOT_B].sort());
  const { rows } = await db.query<{ fresh: boolean }>(
    `SELECT bool_and(last_visited_at > now() - interval '1 minute') AS fresh
       FROM public.bot_visits WHERE user_id = $1`,
    [VIEWER]
  );
  expect(rows[0].fresh).toBe(true);
});

it('a bot post made after your visit counts as new, but not one you already saw full size', async () => {
  await newCounts(VIEWER);
  await visitedAgo(VIEWER, BOT_A, 60);

  await addPost(post(1), { owner: BOT_A, minutesAgo: 30 }); // new
  await addPost(post(2), { owner: BOT_A, minutesAgo: 20 }); // new, but seen in the feed
  await sawFullSize(VIEWER, post(2));
  await addPost(post(3), { owner: BOT_A, minutesAgo: 120 }); // before the visit
  await addPost(post(4), { owner: BOT_A, minutesAgo: 10, isPublic: false });
  await addPost(post(5), { owner: BOT_A, minutesAgo: 10, quarantined: true });
  await addPost(post(6), { owner: BOT_A, minutesAgo: 10, isActive: false });

  expect((await newCounts(VIEWER))[BOT_A]).toBe(1);
});

it('a post whose active flag is unset still counts as a live post', async () => {
  await newCounts(VIEWER);
  await visitedAgo(VIEWER, BOT_A, 60);
  await addPost(post(1), { owner: BOT_A, minutesAgo: 30, isActive: null });

  expect((await newCounts(VIEWER))[BOT_A]).toBe(1);
});

it('leaving a bot resets its count to 0 and leaves the other bots alone', async () => {
  await newCounts(VIEWER);
  await visitedAgo(VIEWER, BOT_A, 60);
  await visitedAgo(VIEWER, BOT_B, 60);
  await addPost(post(1), { owner: BOT_A, minutesAgo: 30 });
  await addPost(post(2), { owner: BOT_B, minutesAgo: 30 });
  expect(await newCounts(VIEWER)).toEqual({ [BOT_A]: 1, [BOT_B]: 1 });

  await asUser(VIEWER);
  await db.query('SELECT public.mark_bot_visited($1)', [BOT_A]);

  expect(await newCounts(VIEWER)).toEqual({ [BOT_A]: 0, [BOT_B]: 1 });
});

it('get_bot_visit returns your previous visit and only the unseen posts newer than it, newest first', async () => {
  await newCounts(VIEWER);
  await visitedAgo(VIEWER, BOT_A, 60);

  await addPost(post(1), { owner: BOT_A, minutesAgo: 50 }); // new
  await addPost(post(2), { owner: BOT_A, minutesAgo: 10 }); // new (newest)
  await addPost(post(3), { owner: BOT_A, minutesAgo: 20 }); // new, but seen
  await sawFullSize(VIEWER, post(3));
  await addPost(post(4), { owner: BOT_A, minutesAgo: 120 }); // before the visit
  await addPost(post(5), { owner: BOT_A, minutesAgo: 5, isPublic: false });
  await addPost(post(6), { owner: BOT_B, minutesAgo: 5 }); // another bot

  await asUser(VIEWER);
  const { rows } = await db.query<{ same_visit: boolean; new_ids: string[] }>(
    `SELECT g.last_visited_at = (SELECT last_visited_at FROM public.bot_visits
                                   WHERE user_id = $1 AND bot_id = $2) AS same_visit,
            to_json(g.new_ids) AS new_ids
       FROM public.get_bot_visit($2) g`,
    [VIEWER, BOT_A]
  );
  expect(rows).toHaveLength(1);
  expect(rows[0].same_visit).toBe(true);
  expect(rows[0].new_ids).toEqual([post(2), post(1)]);
});

it('get_bot_visit for a bot you never visited returns no visit and no NEW marks', async () => {
  await addPost(post(1), { owner: BOT_A, minutesAgo: 10 });

  await asUser(VIEWER);
  const { rows } = await db.query<{ last_visited_at: Date | null; new_ids: string[] }>(
    'SELECT last_visited_at, to_json(new_ids) AS new_ids FROM public.get_bot_visit($1)',
    [BOT_A]
  );
  expect(rows).toHaveLength(1);
  expect(rows[0].last_visited_at).toBeNull();
  expect(rows[0].new_ids).toEqual([]);
});

it("Haven't seen lists this bot's public posts you haven't looked at, never another bot's or a hidden one", async () => {
  await addPost(post(1), { owner: BOT_A, minutesAgo: 300 }); // unseen, old: still listed
  await addPost(post(2), { owner: BOT_A, minutesAgo: 200 }); // seen
  await sawFullSize(VIEWER, post(2));
  await addPost(post(3), { owner: BOT_A, minutesAgo: 100, isActive: null }); // unseen
  await addPost(post(4), { owner: BOT_A, minutesAgo: 50, isPublic: false });
  await addPost(post(5), { owner: BOT_A, minutesAgo: 50, quarantined: true });
  await addPost(post(6), { owner: BOT_A, minutesAgo: 50, isActive: false });
  await addPost(post(7), { owner: BOT_B, minutesAgo: 50 }); // another bot
  // Someone ELSE seeing a post doesn't hide it from you.
  await sawFullSize(VIEWER2, post(1));

  expect(await unseenIds(VIEWER, BOT_A)).toEqual([post(1), post(3)]);
});

it("the definer functions never read a private bot's or a member's posts", async () => {
  await addPost(post(1), { owner: BOT_PRIVATE, minutesAgo: 10 });
  await addPost(post(2), { owner: MEMBER, minutesAgo: 10 });

  await asUser(VIEWER);
  for (const account of [BOT_PRIVATE, MEMBER]) {
    const visit = await db.query('SELECT * FROM public.get_bot_visit($1)', [account]);
    expect(visit.rows).toHaveLength(0);
    expect(await unseenIds(VIEWER, account)).toEqual([]);
  }

  // Leaving a member's profile records nothing; a private bot never shows a count.
  await db.query('SELECT public.mark_bot_visited($1)', [MEMBER]);
  await db.query('SELECT public.mark_bot_visited($1)', [BOT_PRIVATE]);
  expect(await visitRows(VIEWER)).not.toContain(MEMBER);
  const counted = Object.keys(await newCounts(VIEWER));
  expect(counted).not.toContain(BOT_PRIVATE);
  expect(counted).not.toContain(MEMBER);
});

it('signed out, nothing is returned and nothing is written', async () => {
  await addPost(post(1), { owner: BOT_A, minutesAgo: 10 });
  await asUser(null);

  expect((await db.query('SELECT * FROM public.get_bot_new_counts()')).rows).toHaveLength(0);
  await db.query('SELECT public.mark_bot_visited($1)', [BOT_A]);
  expect((await db.query('SELECT * FROM public.get_bot_visit($1)', [BOT_A])).rows).toHaveLength(0);
  expect(
    (await db.query('SELECT * FROM public.get_bot_unseen_posts($1)', [BOT_A])).rows
  ).toHaveLength(0);
  expect((await db.query('SELECT count(*)::int AS n FROM public.bot_visits')).rows[0].n).toBe(0);
});

it("one person's visits and views never change another person's counts", async () => {
  await newCounts(VIEWER);
  await newCounts(VIEWER2);
  await visitedAgo(VIEWER, BOT_A, 60);
  await visitedAgo(VIEWER2, BOT_A, 60);
  await addPost(post(1), { owner: BOT_A, minutesAgo: 30 });
  await addPost(post(2), { owner: BOT_A, minutesAgo: 20 });

  // VIEWER sees one post and then leaves the bot entirely.
  await sawFullSize(VIEWER, post(1));
  await asUser(VIEWER);
  await db.query('SELECT public.mark_bot_visited($1)', [BOT_A]);

  expect((await newCounts(VIEWER))[BOT_A]).toBe(0);
  expect((await newCounts(VIEWER2))[BOT_A]).toBe(2);
  expect(await unseenIds(VIEWER2, BOT_A)).toEqual([post(1), post(2)]);
  expect(await unseenIds(VIEWER, BOT_A)).toEqual([post(2)]);
});
