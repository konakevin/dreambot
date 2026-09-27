/**
 * LIVE-DB lock for Search (migrations 557 + 558, ALBUM_DISCOVERY_PLAN.md).
 *
 * Kevin 2026-09-26: search must NEVER match people's physical characteristics. A member's
 * dream is cast from real photos, so its engine prompt (and usually its caption) describes
 * the people in it: age, skin tone, freckles, beard. This spec locks:
 *   • members' dreams match ONLY person-free text: their own description + medium + vibe
 *     (member_search_tsv, computed from the row), never ai_prompt or caption, and never a
 *     stale stored search_tsv written before 557
 *   • bots' posts match their full stored prompt (fictional characters)
 *   • the trigger keeps stored text person-free for members, and rewrites on going public
 *   • search_dreams scopes: all / mine / bots / people
 *   • visibility, applied by hand inside the SECURITY DEFINER function: your own rows;
 *     public posts of public accounts; public posts of private accounts you follow;
 *     nothing blocked either way; quarantined / deactivated rows never match
 *   • get_random_posts (the 🎲): limit, exclude list, public single-image posts only
 *
 * get_random_posts is SECURITY INVOKER: a private account's posts are hidden from
 * non-followers by the uploads RLS policies, which vanilla PG here does not load. This
 * spec covers the function's own filters; the follower gate is RLS's job.
 *
 * All function / trigger DDL is loaded from the real migration files — drift fails loudly.
 */

import { Pool, PoolClient } from 'pg';
import { makePool, migrationSql, extract } from './_support/pg';

const pool: Pool = makePool();
let db: PoolClient;

const VIEWER = '00000000-0000-0000-0000-00000000e001';
const STRANGER = '00000000-0000-0000-0000-00000000e002'; // public member
const PRIVATE_MEMBER = '00000000-0000-0000-0000-00000000e003'; // private account
const BLOCKER = '00000000-0000-0000-0000-00000000e004'; // blocks the viewer
const BLOCKED = '00000000-0000-0000-0000-00000000e005'; // blocked by the viewer
const BOT = '00000000-0000-0000-0000-00000000e006'; // public bot
const HIDDEN_BOT = '00000000-0000-0000-0000-00000000e007'; // private bot (AlphaBot-style)

type Scope = 'all' | 'mine' | 'bots' | 'people';

interface UploadSeed {
  id?: string;
  user: string;
  prompt?: string | null;
  caption?: string | null;
  description?: string | null;
  medium?: string | null;
  vibe?: string | null;
  isPublic?: boolean;
  quarantined?: boolean;
  active?: boolean | null;
  mediaCount?: number | null;
}

async function asUser(uid: string | null): Promise<void> {
  await db.query("SELECT set_config('test.uid', $1, false)", [uid ?? '']);
}

async function insertUpload(u: UploadSeed): Promise<string> {
  const { rows } = await db.query(
    `INSERT INTO public.uploads
       (id, user_id, ai_prompt, caption, description, dream_medium, dream_vibe,
        is_public, quarantined_at, is_active, media_count)
     VALUES (COALESCE($1::uuid, gen_random_uuid()), $2, $3, $4, $5, $6, $7, $8,
             CASE WHEN $9 THEN now() END, $10, $11)
     RETURNING id`,
    [
      u.id ?? null,
      u.user,
      u.prompt ?? null,
      u.caption ?? null,
      u.description ?? null,
      u.medium ?? null,
      u.vibe ?? null,
      u.isPublic ?? true,
      u.quarantined ?? false,
      u.active === undefined ? true : u.active,
      u.mediaCount === undefined ? 1 : u.mediaCount,
    ]
  );
  return rows[0].id as string;
}

async function search(
  query: string,
  scope: Scope = 'all',
  opts: { uid?: string | null; medium?: string | null; vibe?: string | null } = {}
): Promise<string[]> {
  await asUser(opts.uid === undefined ? VIEWER : opts.uid);
  const { rows } = await db.query(
    'SELECT id FROM public.search_dreams($1, $2, $3, $4) ORDER BY id',
    [query, scope, opts.medium ?? null, opts.vibe ?? null]
  );
  return rows.map((r) => r.id as string);
}

async function randomPosts(
  userId: string,
  limit: number | null,
  exclude: string[] = [],
  uid: string | null = VIEWER
): Promise<{ id: string; user_id: string }[]> {
  await asUser(uid);
  const { rows } = await db.query(
    'SELECT id, user_id FROM public.get_random_posts($1, $2, $3::uuid[])',
    [userId, limit, exclude]
  );
  return rows.map((r) => ({ id: r.id as string, user_id: r.user_id as string }));
}

async function storedTsvMatches(id: string, word: string): Promise<boolean> {
  const { rows } = await db.query(
    `SELECT search_tsv @@ to_tsquery('english', $2) AS hit FROM public.uploads WHERE id = $1`,
    [id, word]
  );
  return rows[0].hit as boolean;
}

// A member's face-swapped dream: the engine prompt + caption describe the real person.
const PERSON_PROMPT = 'a freckled woman with red hair and a grey beard, standing at a lighthouse';
const PERSON_CAPTION = 'freckles redhead portrait';

beforeAll(async () => {
  db = await pool.connect();

  await db.query('CREATE SCHEMA IF NOT EXISTS auth');
  await db.query(`CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE AS $fn$ SELECT nullif(current_setting('test.uid', true), '')::uuid $fn$`);

  // Supabase roles a vanilla PG lacks — created so the migration's REVOKE/GRANT resolve.
  for (const role of ['anon', 'authenticated']) {
    await db.query(
      `DO $$ BEGIN
         IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = '${role}') THEN
           CREATE ROLE ${role} NOLOGIN;
         END IF;
       END $$;`
    );
  }

  // All dbspecs share ONE database: drop first so this spec is order-independent.
  await db.query('DROP FUNCTION IF EXISTS public.search_dreams(text, text, text, text) CASCADE');
  await db.query('DROP FUNCTION IF EXISTS public.get_random_posts(uuid, integer, uuid[]) CASCADE');
  await db.query('DROP FUNCTION IF EXISTS public.uploads_search_tsv_trigger() CASCADE');
  await db.query('DROP FUNCTION IF EXISTS public.member_search_tsv(text, text, text) CASCADE');
  for (const t of ['follows', 'blocked_users', 'uploads', 'users']) {
    await db.query(`DROP TABLE IF EXISTS public.${t} CASCADE`);
  }

  await db.query(`CREATE TABLE public.users (
    id uuid PRIMARY KEY,
    is_public boolean NOT NULL DEFAULT true,
    is_bot boolean NOT NULL DEFAULT false
  )`);
  await db.query(`CREATE TABLE public.uploads (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES public.users(id),
    ai_prompt text,
    caption text,
    description text,
    dream_medium text,
    dream_vibe text,
    is_public boolean NOT NULL DEFAULT false,
    quarantined_at timestamptz,
    is_active boolean DEFAULT true,
    media_count integer,
    search_tsv tsvector,
    created_at timestamptz NOT NULL DEFAULT now()
  )`);
  await db.query(
    `CREATE TABLE public.follows (follower_id uuid NOT NULL, following_id uuid NOT NULL)`
  );
  await db.query(
    `CREATE TABLE public.blocked_users (blocker_id uuid NOT NULL, blocked_id uuid NOT NULL)`
  );

  const m557 = migrationSql('557_search_never_matches_people.sql');
  await db.query(extract(m557, 'CREATE OR REPLACE FUNCTION public.member_search_tsv', '$$;'));
  await db.query(
    extract(m557, 'CREATE OR REPLACE FUNCTION public.uploads_search_tsv_trigger', '$$;')
  );
  await db.query(
    extract(
      m557,
      'CREATE TRIGGER trg_uploads_search_tsv',
      'EXECUTE FUNCTION public.uploads_search_tsv_trigger();'
    )
  );

  const m558 = migrationSql('558_search_scopes_and_random_posts.sql');
  await db.query(extract(m558, 'CREATE FUNCTION public.search_dreams', '$$;'));
  await db.query(extract(m558, 'REVOKE ALL ON FUNCTION public.search_dreams', 'TO authenticated;'));
  await db.query(extract(m558, 'CREATE FUNCTION public.get_random_posts', '$$;'));
  await db.query(
    extract(m558, 'REVOKE ALL ON FUNCTION public.get_random_posts', 'TO authenticated;')
  );
});

afterAll(async () => {
  db.release();
  await pool.end();
});

beforeEach(async () => {
  for (const t of ['follows', 'blocked_users', 'uploads', 'users']) {
    await db.query(`DELETE FROM public.${t}`);
  }
  await db.query(
    `INSERT INTO public.users (id, is_public, is_bot) VALUES
       ($1, true, false), ($2, true, false), ($3, false, false), ($4, true, false),
       ($5, true, false), ($6, true, true), ($7, false, true)`,
    [VIEWER, STRANGER, PRIVATE_MEMBER, BLOCKER, BLOCKED, BOT, HIDDEN_BOT]
  );
});

describe("members' dreams never match people's physical characteristics", () => {
  it('a member post is never found by words that only appear in its engine prompt or caption', async () => {
    await insertUpload({
      user: STRANGER,
      prompt: PERSON_PROMPT,
      caption: PERSON_CAPTION,
      description: 'sunset over the lighthouse',
      medium: 'watercolor',
      vibe: 'cozy',
    });
    for (const scope of ['all', 'people'] as const) {
      for (const q of ['freckled', 'freckles', 'red hair', 'redhead', 'grey beard', 'woman']) {
        expect(await search(q, scope)).toEqual([]);
      }
    }
  });

  it('a member post IS found by its own description, medium and vibe', async () => {
    const id = await insertUpload({
      user: STRANGER,
      prompt: PERSON_PROMPT,
      caption: PERSON_CAPTION,
      description: 'sunset over the lighthouse',
      medium: 'watercolor',
      vibe: 'cozy',
    });
    for (const scope of ['all', 'people'] as const) {
      expect(await search('lighthouse', scope)).toEqual([id]);
      expect(await search('watercolor', scope)).toEqual([id]);
      expect(await search('cozy', scope)).toEqual([id]);
    }
  });

  it('your own dreams, private or public, are never found by their engine prompt either', async () => {
    const priv = await insertUpload({
      user: VIEWER,
      prompt: PERSON_PROMPT,
      caption: PERSON_CAPTION,
      description: 'my lighthouse dream',
      isPublic: false,
    });
    const pub = await insertUpload({
      user: VIEWER,
      prompt: PERSON_PROMPT,
      caption: PERSON_CAPTION,
      description: 'another lighthouse dream',
      isPublic: true,
    });
    for (const scope of ['all', 'mine'] as const) {
      expect(await search('freckles', scope)).toEqual([]);
      expect(await search('red hair', scope)).toEqual([]);
      expect(await search('lighthouse', scope)).toEqual([priv, pub].sort());
    }
  });

  it('a stale stored search text from before 557 cannot leak a member post', async () => {
    const id = await insertUpload({
      user: STRANGER,
      prompt: PERSON_PROMPT,
      description: 'sunset over the lighthouse',
    });
    const mine = await insertUpload({
      user: VIEWER,
      prompt: PERSON_PROMPT,
      description: 'my lighthouse dream',
      isPublic: false,
    });
    // Old-style stored text (prompt included), written without firing the trigger —
    // the private rows 557 deliberately did not rewrite.
    await db.query(
      `UPDATE public.uploads SET search_tsv = to_tsvector('english', ai_prompt) WHERE id IN ($1, $2)`,
      [id, mine]
    );
    expect(await storedTsvMatches(id, 'freckles')).toBe(true); // the leak is really stored
    for (const scope of ['all', 'people', 'mine'] as const) {
      expect(await search('freckled', scope)).toEqual([]);
      expect(await search('beard', scope)).toEqual([]);
    }
  });
});

describe('the stored search text (uploads_search_tsv trigger)', () => {
  it("a member row's stored text holds only its description, medium and vibe", async () => {
    const id = await insertUpload({
      user: STRANGER,
      prompt: PERSON_PROMPT,
      caption: PERSON_CAPTION,
      description: 'sunset over the lighthouse',
      medium: 'watercolor',
      vibe: 'cozy',
    });
    expect(await storedTsvMatches(id, 'freckles')).toBe(false);
    expect(await storedTsvMatches(id, 'beard')).toBe(false);
    expect(await storedTsvMatches(id, 'redhead')).toBe(false);
    expect(await storedTsvMatches(id, 'lighthouse')).toBe(true);
    expect(await storedTsvMatches(id, 'watercolor')).toBe(true);
    expect(await storedTsvMatches(id, 'cozy')).toBe(true);
  });

  it("a bot row's stored text holds its full prompt and caption", async () => {
    const id = await insertUpload({
      user: BOT,
      prompt: 'a copper dragon asleep on a hoard',
      caption: 'treasure nap',
      medium: 'oil',
      vibe: 'epic',
    });
    expect(await storedTsvMatches(id, 'dragon')).toBe(true);
    expect(await storedTsvMatches(id, 'treasure')).toBe(true);
    expect(await storedTsvMatches(id, 'oil')).toBe(true);
    expect(await storedTsvMatches(id, 'epic')).toBe(true);
  });

  it('making a dream public rewrites its stored text, dropping any old prompt words', async () => {
    const id = await insertUpload({
      user: STRANGER,
      prompt: PERSON_PROMPT,
      description: 'sunset over the lighthouse',
      isPublic: false,
    });
    await db.query(
      `UPDATE public.uploads SET search_tsv = to_tsvector('english', ai_prompt) WHERE id = $1`,
      [id]
    );
    expect(await storedTsvMatches(id, 'freckles')).toBe(true);
    await db.query('UPDATE public.uploads SET is_public = true WHERE id = $1', [id]);
    expect(await storedTsvMatches(id, 'freckles')).toBe(false);
    expect(await storedTsvMatches(id, 'lighthouse')).toBe(true);
  });

  it('editing the description rewrites the stored text', async () => {
    const id = await insertUpload({ user: STRANGER, description: 'sunset over the lighthouse' });
    await db.query(`UPDATE public.uploads SET description = 'a quiet harbor' WHERE id = $1`, [id]);
    expect(await storedTsvMatches(id, 'lighthouse')).toBe(false);
    expect(await storedTsvMatches(id, 'harbor')).toBe(true);
  });
});

describe('scopes', () => {
  it("a bot's post is found by words in its prompt, in Bots and All", async () => {
    const id = await insertUpload({ user: BOT, prompt: 'a copper dragon asleep on a hoard' });
    expect(await search('dragon', 'bots')).toEqual([id]);
    expect(await search('dragon', 'all')).toEqual([id]);
  });

  it('People never returns bot posts, and Bots never returns member posts', async () => {
    const bot = await insertUpload({ user: BOT, prompt: 'a lighthouse in a storm' });
    const member = await insertUpload({ user: STRANGER, description: 'a lighthouse at dawn' });
    expect(await search('lighthouse', 'people')).toEqual([member]);
    expect(await search('lighthouse', 'bots')).toEqual([bot]);
    expect(await search('lighthouse', 'all')).toEqual([bot, member].sort());
  });

  it('My dreams returns only your own dreams', async () => {
    const mine = await insertUpload({ user: VIEWER, description: 'lighthouse', isPublic: false });
    await insertUpload({ user: STRANGER, description: 'lighthouse' });
    await insertUpload({ user: BOT, prompt: 'lighthouse' });
    expect(await search('lighthouse', 'mine')).toEqual([mine]);
  });

  it('your own public post appears once in All, not twice', async () => {
    const mine = await insertUpload({ user: VIEWER, description: 'lighthouse', isPublic: true });
    expect(await search('lighthouse', 'all')).toEqual([mine]);
    expect(await search('lighthouse', 'people')).toEqual([]);
  });

  it("a private bot's posts show nowhere to someone who does not follow it", async () => {
    await insertUpload({ user: HIDDEN_BOT, prompt: 'a secret lighthouse' });
    for (const scope of ['all', 'bots', 'people', 'mine'] as const) {
      expect(await search('lighthouse', scope)).toEqual([]);
    }
  });
});

describe('visibility', () => {
  it("another member's private dream is never found", async () => {
    await insertUpload({ user: STRANGER, description: 'lighthouse', isPublic: false });
    for (const scope of ['all', 'people', 'mine'] as const) {
      expect(await search('lighthouse', scope)).toEqual([]);
    }
  });

  it("a private account's public posts are hidden until you follow it", async () => {
    const id = await insertUpload({ user: PRIVATE_MEMBER, description: 'lighthouse' });
    expect(await search('lighthouse', 'people')).toEqual([]);
    await db.query('INSERT INTO public.follows (follower_id, following_id) VALUES ($1, $2)', [
      VIEWER,
      PRIVATE_MEMBER,
    ]);
    expect(await search('lighthouse', 'people')).toEqual([id]);
    expect(await search('lighthouse', 'all')).toEqual([id]);
  });

  it('blocking hides posts either way, for members and bots', async () => {
    await insertUpload({ user: BLOCKER, description: 'lighthouse' });
    await insertUpload({ user: BLOCKED, description: 'lighthouse' });
    await insertUpload({ user: BOT, prompt: 'lighthouse' });
    await db.query(
      `INSERT INTO public.blocked_users (blocker_id, blocked_id) VALUES ($1, $2), ($3, $4), ($3, $5)`,
      [BLOCKER, VIEWER, VIEWER, BLOCKED, BOT]
    );
    for (const scope of ['all', 'people', 'bots'] as const) {
      expect(await search('lighthouse', scope)).toEqual([]);
    }
  });

  it('quarantined and deactivated posts never match', async () => {
    for (const user of [VIEWER, STRANGER]) {
      await insertUpload({ user, description: 'lighthouse', quarantined: true });
      await insertUpload({ user, description: 'lighthouse', active: false });
    }
    await insertUpload({ user: BOT, prompt: 'lighthouse', quarantined: true });
    await insertUpload({ user: BOT, prompt: 'lighthouse', active: false });
    for (const scope of ['all', 'mine', 'people', 'bots'] as const) {
      expect(await search('lighthouse', scope)).toEqual([]);
    }
  });

  it('a post with is_active NULL still matches (only an explicit false hides it)', async () => {
    const id = await insertUpload({ user: STRANGER, description: 'lighthouse', active: null });
    expect(await search('lighthouse', 'people')).toEqual([id]);
  });
});

describe('the query', () => {
  it('every word must match, and the last word matches as a prefix', async () => {
    const id = await insertUpload({ user: STRANGER, description: 'sunset over the lighthouse' });
    expect(await search('light', 'people')).toEqual([id]); // prefix on the last word
    expect(await search('sunset light', 'people')).toEqual([id]);
    expect(await search('sunset castle', 'people')).toEqual([]); // every word must match
    expect(await search('light sunset', 'people')).toEqual([]); // only the LAST word is a prefix
  });

  it('punctuation is ignored', async () => {
    const id = await insertUpload({ user: STRANGER, description: 'sunset over the lighthouse' });
    expect(await search('  Sunset, lighthouse!! ', 'people')).toEqual([id]);
  });

  it('returns nothing when signed out, or for a query under two characters or only symbols', async () => {
    await insertUpload({ user: STRANGER, description: 'a lighthouse' });
    expect(await search('lighthouse', 'all', { uid: null })).toEqual([]);
    expect(await search('l', 'all')).toEqual([]);
    expect(await search('!!', 'all')).toEqual([]);
  });

  it('the medium and vibe filters narrow the results', async () => {
    const water = await insertUpload({
      user: STRANGER,
      description: 'lighthouse',
      medium: 'watercolor',
      vibe: 'cozy',
    });
    const oil = await insertUpload({
      user: STRANGER,
      description: 'lighthouse',
      medium: 'oil',
      vibe: 'epic',
    });
    expect(await search('lighthouse', 'people', { medium: 'watercolor' })).toEqual([water]);
    expect(await search('lighthouse', 'people', { vibe: 'epic' })).toEqual([oil]);
    expect(await search('lighthouse', 'people', { medium: 'oil', vibe: 'cozy' })).toEqual([]);
  });
});

describe('permissions', () => {
  it('signed-in users can run search_dreams and get_random_posts; anonymous visitors cannot', async () => {
    const { rows } = await db.query(`SELECT
      has_function_privilege('authenticated', 'public.search_dreams(text,text,text,text)', 'EXECUTE') AS auth_search,
      has_function_privilege('anon', 'public.search_dreams(text,text,text,text)', 'EXECUTE') AS anon_search,
      has_function_privilege('authenticated', 'public.get_random_posts(uuid,integer,uuid[])', 'EXECUTE') AS auth_random,
      has_function_privilege('anon', 'public.get_random_posts(uuid,integer,uuid[])', 'EXECUTE') AS anon_random`);
    expect(rows[0]).toEqual({
      auth_search: true,
      anon_search: false,
      auth_random: true,
      anon_random: false,
    });
  });
});

describe('get_random_posts (the 🎲)', () => {
  async function seedPosts(user: string, n: number): Promise<string[]> {
    const ids: string[] = [];
    for (let i = 0; i < n; i++) ids.push(await insertUpload({ user, description: `post ${i}` }));
    return ids;
  }

  it("returns at most the limit, all from that profile's posts", async () => {
    await seedPosts(STRANGER, 10);
    await seedPosts(VIEWER, 5);
    const rows = await randomPosts(STRANGER, 4);
    expect(rows).toHaveLength(4);
    expect(new Set(rows.map((r) => r.user_id))).toEqual(new Set([STRANGER]));
    expect(new Set(rows.map((r) => r.id)).size).toBe(4);
  });

  it('never returns the ids already on screen', async () => {
    const ids = await seedPosts(STRANGER, 10);
    const exclude = ids.slice(0, 8);
    const rows = await randomPosts(STRANGER, 12, exclude);
    expect(rows.map((r) => r.id).sort()).toEqual(ids.slice(8).sort());
  });

  it('draws only public, live, single-image posts', async () => {
    const keep = await insertUpload({ user: STRANGER, description: 'single' });
    const keepNullCount = await insertUpload({
      user: STRANGER,
      description: 'no count',
      mediaCount: null,
    });
    await insertUpload({ user: STRANGER, description: 'private', isPublic: false });
    await insertUpload({ user: STRANGER, description: 'quarantined', quarantined: true });
    await insertUpload({ user: STRANGER, description: 'deactivated', active: false });
    await insertUpload({ user: STRANGER, description: 'album', mediaCount: 3 });
    const rows = await randomPosts(STRANGER, 12);
    expect(rows.map((r) => r.id).sort()).toEqual([keep, keepNullCount].sort());
  });

  it('keeps the limit between 1 and 48 (12 when not given)', async () => {
    await seedPosts(STRANGER, 50);
    expect(await randomPosts(STRANGER, 0)).toHaveLength(1);
    expect(await randomPosts(STRANGER, -5)).toHaveLength(1);
    expect(await randomPosts(STRANGER, 100)).toHaveLength(48);
    expect(await randomPosts(STRANGER, null)).toHaveLength(12);
  });

  it('returns nothing when signed out', async () => {
    await seedPosts(STRANGER, 3);
    expect(await randomPosts(STRANGER, 12, [], null)).toEqual([]);
  });
});
