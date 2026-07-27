/**
 * LIVE-DB test for the repost feature — Phase 1 (migration 242).
 *
 * Loads the REAL post_reposts DDL + the update_repost_count / enforce_repost_rules
 * / toggle_repost functions straight from the migration file, on top of stub
 * users/uploads/notifications tables. Verifies the toggle semantics + the
 * integrity guards (no self-repost, public-only, author opt-out, bots-can't-repost),
 * the denormalized count trigger, the author notification, and FK cascade-delete.
 *
 * auth.uid() doesn't exist on vanilla PG, so it's stubbed to read a session GUC;
 * everything runs on ONE pooled client so the GUC sticks.
 */

import { Pool, PoolClient } from 'pg';
import { makePool, migrationSql, extract } from './_support/pg';

const pool: Pool = makePool();
let db: PoolClient;

const AUTHOR = '00000000-0000-0000-0000-0000000000a1';
const USER1 = '00000000-0000-0000-0000-0000000000b2';
const BOTUSER = '00000000-0000-0000-0000-0000000000c3';

const POST = '00000000-0000-0000-0000-0000000000d4'; // AUTHOR's public post
const PRIVATE = '00000000-0000-0000-0000-0000000000e5'; // AUTHOR's private post
const NOREPOST = '00000000-0000-0000-0000-0000000000f6'; // post by an opt-out author

/** Run the next statements as `uid` (sets the stubbed auth.uid() source). */
async function actAs(uid: string): Promise<void> {
  await db.query("SELECT set_config('test.uid', $1, false)", [uid]);
}

beforeAll(async () => {
  db = await pool.connect();
  const sql = migrationSql('242_reposts_phase1.sql');

  // Stub auth.uid() → session GUC.
  await db.query('CREATE SCHEMA IF NOT EXISTS auth');
  await db.query(`CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE AS $fn$ SELECT nullif(current_setting('test.uid', true), '')::uuid $fn$`);

  // FK-stub tables (just enough columns the DDL under test touches).
  await db.query('DROP TABLE IF EXISTS public.post_reposts CASCADE');
  await db.query('DROP TABLE IF EXISTS public.notifications CASCADE');
  await db.query('DROP TABLE IF EXISTS public.uploads CASCADE');
  await db.query('DROP TABLE IF EXISTS public.users CASCADE');
  await db.query(`CREATE TABLE public.users (
    id uuid PRIMARY KEY,
    username text,
    avatar_url text,
    is_bot boolean NOT NULL DEFAULT false,
    allow_reposts boolean NOT NULL DEFAULT true
  )`);
  await db.query(`CREATE TABLE public.uploads (
    id uuid PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES public.users(id),
    is_public boolean NOT NULL DEFAULT true,
    repost_count integer NOT NULL DEFAULT 0
  )`);
  await db.query(`CREATE TABLE public.notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id uuid,
    actor_id uuid,
    type text,
    upload_id uuid,
    created_at timestamptz NOT NULL DEFAULT now()
  )`);

  // Real DDL under test, pulled from the migration.
  await db.query(extract(sql, 'CREATE TABLE IF NOT EXISTS public.post_reposts', ');'));
  await db.query(extract(sql, 'CREATE OR REPLACE FUNCTION public.update_repost_count', '$$;'));
  await db.query(extract(sql, 'CREATE OR REPLACE FUNCTION public.enforce_repost_rules', '$$;'));
  // repostBumpLedger.dbspec.ts sorts BEFORE this suite and creates its own
  // toggle_repost in the shared test DB; migration 242 uses bare CREATE FUNCTION
  // (not OR REPLACE), so drop any leftover copy first (a DROP TABLE ... CASCADE
  // does NOT drop the plpgsql function). Mirrors the feed specs' drop-first guard.
  await db.query('DROP FUNCTION IF EXISTS public.toggle_repost(uuid)');
  await db.query('DROP FUNCTION IF EXISTS public.get_reposters(uuid, integer, timestamptz)');
  await db.query(extract(sql, 'CREATE FUNCTION public.toggle_repost', '$$;'));
  await db.query(extract(sql, 'CREATE FUNCTION public.get_reposters', '$$;'));
  // Wire the triggers (trivial wiring; functions above carry the logic).
  await db.query(`CREATE TRIGGER trg_repost_count
    AFTER INSERT OR DELETE ON public.post_reposts
    FOR EACH ROW EXECUTE FUNCTION public.update_repost_count()`);
  await db.query(`CREATE TRIGGER trg_enforce_repost_rules
    BEFORE INSERT ON public.post_reposts
    FOR EACH ROW EXECUTE FUNCTION public.enforce_repost_rules()`);
});

afterAll(async () => {
  db.release();
  await pool.end();
});

beforeEach(async () => {
  await db.query('DELETE FROM public.post_reposts');
  await db.query('DELETE FROM public.notifications');
  await db.query('DELETE FROM public.uploads');
  await db.query('DELETE FROM public.users');
  await db.query(
    `INSERT INTO public.users (id, username, is_bot, allow_reposts) VALUES
      ($1,'author',false,true), ($2,'user1',false,true), ($3,'somebot',true,true)`,
    [AUTHOR, USER1, BOTUSER]
  );
  await db.query(
    `INSERT INTO public.uploads (id, user_id, is_public) VALUES
      ($1,$4,true), ($2,$4,false), ($3,$4,true)`,
    [POST, PRIVATE, NOREPOST, AUTHOR]
  );
});

describe('toggle_repost', () => {
  it('reposts: creates the row, bumps repost_count, notifies the author', async () => {
    await actAs(USER1);
    const { rows } = await db.query('SELECT * FROM public.toggle_repost($1)', [POST]);
    expect(rows[0].reposted).toBe(true);
    expect(rows[0].repost_count).toBe(1);

    const reposts = await db.query('SELECT * FROM public.post_reposts WHERE upload_id=$1', [POST]);
    expect(reposts.rowCount).toBe(1);
    expect(reposts.rows[0].reposter_id).toBe(USER1);

    const notifs = await db.query("SELECT * FROM public.notifications WHERE type='post_repost'");
    expect(notifs.rowCount).toBe(1);
    expect(notifs.rows[0].recipient_id).toBe(AUTHOR);
    expect(notifs.rows[0].actor_id).toBe(USER1);
  });

  it('un-reposts on the second toggle: row gone, count back to 0', async () => {
    await actAs(USER1);
    await db.query('SELECT public.toggle_repost($1)', [POST]);
    const { rows } = await db.query('SELECT * FROM public.toggle_repost($1)', [POST]);
    expect(rows[0].reposted).toBe(false);
    expect(rows[0].repost_count).toBe(0);
    const reposts = await db.query('SELECT * FROM public.post_reposts WHERE upload_id=$1', [POST]);
    expect(reposts.rowCount).toBe(0);
  });

  it('rejects reposting your OWN post', async () => {
    await actAs(AUTHOR);
    await expect(db.query('SELECT public.toggle_repost($1)', [POST])).rejects.toThrow(
      /cannot repost your own post/
    );
  });

  it('rejects reposting a PRIVATE post', async () => {
    await actAs(USER1);
    await expect(db.query('SELECT public.toggle_repost($1)', [PRIVATE])).rejects.toThrow(
      /cannot repost a private post/
    );
  });

  it('rejects when the author has DISABLED reposts', async () => {
    await db.query('UPDATE public.users SET allow_reposts=false WHERE id=$1', [AUTHOR]);
    await actAs(USER1);
    await expect(db.query('SELECT public.toggle_repost($1)', [NOREPOST])).rejects.toThrow(
      /author has disabled reposts/
    );
  });

  it('rejects a BOT actor', async () => {
    await actAs(BOTUSER);
    await expect(db.query('SELECT public.toggle_repost($1)', [POST])).rejects.toThrow(
      /bots cannot repost/
    );
  });

  it('reposting a BOT-authored post does not notify the bot, but still reposts', async () => {
    // make POST authored by the bot
    await db.query('UPDATE public.uploads SET user_id=$1 WHERE id=$2', [BOTUSER, POST]);
    await actAs(USER1);
    const { rows } = await db.query('SELECT * FROM public.toggle_repost($1)', [POST]);
    expect(rows[0].reposted).toBe(true);
    const notifs = await db.query("SELECT * FROM public.notifications WHERE type='post_repost'");
    expect(notifs.rowCount).toBe(0); // bot author gets no inbox notification
  });

  it('enforce_repost_rules trigger blocks a DIRECT insert that bypasses the RPC', async () => {
    // self-repost via raw insert should still be rejected by the BEFORE-INSERT trigger
    await expect(
      db.query('INSERT INTO public.post_reposts (reposter_id, upload_id) VALUES ($1,$2)', [
        AUTHOR,
        POST,
      ])
    ).rejects.toThrow(/cannot repost your own post/);
  });
});

describe('cascade + reposters list', () => {
  it('cascade-deletes reposts when the original upload is deleted', async () => {
    await actAs(USER1);
    await db.query('SELECT public.toggle_repost($1)', [POST]);
    await db.query('DELETE FROM public.uploads WHERE id=$1', [POST]);
    const reposts = await db.query('SELECT * FROM public.post_reposts WHERE upload_id=$1', [POST]);
    expect(reposts.rowCount).toBe(0);
  });

  it('get_reposters lists reposters newest-first', async () => {
    await actAs(USER1);
    await db.query('SELECT public.toggle_repost($1)', [POST]);
    const { rows } = await db.query('SELECT * FROM public.get_reposters($1, 30, NULL)', [POST]);
    expect(rows).toHaveLength(1);
    expect(rows[0].user_id).toBe(USER1);
    expect(rows[0].username).toBe('user1');
  });
});
