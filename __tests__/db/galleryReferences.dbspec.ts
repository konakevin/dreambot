/**
 * LIVE-DB test for the gallery REFERENCE model (migrations 356 + 367 + 369).
 *
 * An album is a curated list of dreams: upload_media rows reference a SOURCE
 * dream (source_upload_id) and reuse its files — no copies. Consistency is
 * enforced entirely by DB triggers + FK cascades, so the client can't drift:
 *   - sync_upload_media_count (356): host.media_count = # member rows
 *   - heal_gallery_on_member_delete (367): member deleted → re-front the cover /
 *     delete an emptied album host
 *   - sync_album_ref_count (369): source.album_ref_count = # albums referencing
 *     it; when the last album releases it (delete), its created_at floats to now
 *   - FK cascades: delete a source → drops from every album; delete a host →
 *     members cascade, sources untouched
 *
 * Loads the real trigger fns + trigger DDL straight from the migration files.
 */

import { Pool } from 'pg';
import { makePool, migrationSql, extract } from './_support/pg';

const pool: Pool = makePool();

const OWNER = '00000000-0000-0000-0000-0000000000a1';
// source dreams
const S1 = '00000000-0000-0000-0000-0000000000d1';
const S2 = '00000000-0000-0000-0000-0000000000d2';
const S3 = '00000000-0000-0000-0000-0000000000d3';
// album hosts
const H1 = '00000000-0000-0000-0000-0000000000c1';
const H2 = '00000000-0000-0000-0000-0000000000c2';

async function upload(id: string): Promise<{
  media_count: number;
  album_ref_count: number;
  image_url: string | null;
  created_at: Date | null;
} | null> {
  const res = await pool.query(
    'SELECT media_count, album_ref_count, image_url, created_at FROM public.uploads WHERE id=$1',
    [id]
  );
  return res.rows[0] ?? null;
}

async function memberCount(hostId: string): Promise<number> {
  const res = await pool.query(
    'SELECT count(*)::int AS n FROM public.upload_media WHERE upload_id=$1',
    [hostId]
  );
  return res.rows[0].n;
}

/** Publish an album host with member rows referencing the given sources. */
async function publishAlbum(hostId: string, sources: string[]): Promise<void> {
  const cover = (await pool.query('SELECT image_url FROM public.uploads WHERE id=$1', [sources[0]]))
    .rows[0].image_url;
  await pool.query(
    `INSERT INTO public.uploads (id, user_id, image_url, is_public, media_count, album_ref_count)
     VALUES ($1,$2,$3,true,1,0)`,
    [hostId, OWNER, cover]
  );
  for (let i = 0; i < sources.length; i++) {
    const src = (await pool.query('SELECT * FROM public.uploads WHERE id=$1', [sources[i]]))
      .rows[0];
    await pool.query(
      `INSERT INTO public.upload_media (upload_id, source_upload_id, position, image_url,
         image_url_display, image_url_hq, thumbhash, width, height)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [
        hostId,
        src.id,
        i,
        src.image_url,
        src.image_url_display,
        src.image_url_hq,
        src.thumbhash,
        src.width,
        src.height,
      ]
    );
  }
}

beforeAll(async () => {
  const m356 = migrationSql('356_gallery_posts.sql');
  const m367 = migrationSql('367_gallery_reference_model.sql');
  const m369 = migrationSql('369_uploads_album_ref_count.sql');

  await pool.query('DROP TABLE IF EXISTS public.upload_media CASCADE');
  await pool.query('DROP TABLE IF EXISTS public.uploads CASCADE');

  // Stub uploads with the columns the triggers read/write.
  await pool.query(`CREATE TABLE public.uploads (
    id uuid PRIMARY KEY,
    user_id uuid,
    image_url text,
    image_url_display text,
    image_url_hq text,
    thumbhash text,
    width integer,
    height integer,
    is_public boolean NOT NULL DEFAULT false,
    posted_at timestamptz,
    media_count smallint NOT NULL DEFAULT 1,
    album_ref_count smallint NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now()
  )`);

  // upload_media with BOTH FKs (upload_id + source_upload_id), both ON DELETE
  // CASCADE — the membership + the reference.
  await pool.query(`CREATE TABLE public.upload_media (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    upload_id uuid NOT NULL REFERENCES public.uploads(id) ON DELETE CASCADE,
    source_upload_id uuid REFERENCES public.uploads(id) ON DELETE CASCADE,
    position smallint NOT NULL,
    image_url text NOT NULL,
    image_url_display text,
    image_url_hq text,
    thumbhash text,
    width integer,
    height integer,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (upload_id, position)
  )`);

  // Real trigger fns + triggers, verbatim from the migrations.
  await pool.query(
    extract(m356, 'CREATE OR REPLACE FUNCTION public.sync_upload_media_count', '$$;')
  );
  await pool.query(extract(m356, 'CREATE TRIGGER trg_sync_upload_media_count', ';'));
  await pool.query(
    extract(m367, 'CREATE OR REPLACE FUNCTION public.heal_gallery_on_member_delete', '$$;')
  );
  await pool.query(extract(m367, 'CREATE TRIGGER trg_heal_gallery_on_member_delete', ';'));
  await pool.query(extract(m369, 'CREATE OR REPLACE FUNCTION public.sync_album_ref_count', '$$;'));
  await pool.query(extract(m369, 'CREATE TRIGGER trg_sync_album_ref_count', ';'));
});

beforeEach(async () => {
  await pool.query('DELETE FROM public.upload_media');
  await pool.query('DELETE FROM public.uploads');
  // three source dreams, each with its own file, all private + unreferenced
  for (const [id, n] of [
    [S1, 1],
    [S2, 2],
    [S3, 3],
  ] as const) {
    await pool.query(
      `INSERT INTO public.uploads (id, user_id, image_url, image_url_display, image_url_hq,
         thumbhash, width, height, is_public, media_count, album_ref_count, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,768,1664,false,1,0, now() - ($7 || ' hours')::interval)`,
      [id, OWNER, `s${n}.png`, `s${n}.display.jpg`, `s${n}.hq.png`, `hash${n}`, String(n)]
    );
  }
});

afterAll(async () => {
  await pool.end();
});

describe('gallery reference model triggers', () => {
  test('publish: media_count synced, sources gain a reference', async () => {
    await publishAlbum(H1, [S1, S2, S3]);
    expect((await upload(H1))!.media_count).toBe(3);
    expect((await upload(S1))!.album_ref_count).toBe(1);
    expect((await upload(S2))!.album_ref_count).toBe(1);
    expect((await upload(S3))!.album_ref_count).toBe(1);
    // sources still exist, untouched
    expect(await memberCount(H1)).toBe(3);
  });

  test('delete the cover member → cover promoted to the next image', async () => {
    await publishAlbum(H1, [S1, S2, S3]);
    expect((await upload(H1))!.image_url).toBe('s1.png'); // cover = S1
    await pool.query('DELETE FROM public.upload_media WHERE upload_id=$1 AND position=0', [H1]);
    const host = await upload(H1);
    expect(host!.media_count).toBe(2);
    expect(host!.image_url).toBe('s2.png'); // promoted to next member
  });

  test('delete the last member → the empty album host is auto-deleted', async () => {
    await pool.query(
      `INSERT INTO public.uploads (id, user_id, image_url, is_public, media_count)
       VALUES ($1,$2,'s1.png',true,1)`,
      [H1, OWNER]
    );
    await pool.query(
      `INSERT INTO public.upload_media (upload_id, source_upload_id, position, image_url)
       VALUES ($1,$2,0,'s1.png')`,
      [H1, S1]
    );
    await pool.query('DELETE FROM public.upload_media WHERE upload_id=$1', [H1]);
    expect(await upload(H1)).toBeNull(); // host dissolved
  });

  test('delete a SOURCE dream → cascades out of the album; ref counts stay honest', async () => {
    await publishAlbum(H1, [S1, S2, S3]);
    await pool.query('DELETE FROM public.uploads WHERE id=$1', [S2]); // delete a member source
    expect(await upload(S2)).toBeNull();
    expect((await upload(H1))!.media_count).toBe(2); // album shrank
    expect(await memberCount(H1)).toBe(2);
    // the other sources are untouched, still referenced once
    expect((await upload(S1))!.album_ref_count).toBe(1);
    expect((await upload(S3))!.album_ref_count).toBe(1);
  });

  test('delete the HOST → members cascade, sources untouched and RELEASED to top', async () => {
    await publishAlbum(H1, [S1, S2, S3]);
    const before = (await upload(S1))!.created_at!.getTime();
    await pool.query('DELETE FROM public.uploads WHERE id=$1', [H1]);
    // sources survive (files/rows intact)
    expect(await upload(S1)).not.toBeNull();
    expect(await upload(S2)).not.toBeNull();
    expect(await upload(S3)).not.toBeNull();
    // ref count back to 0 → they return to the Dreams album
    expect((await upload(S1))!.album_ref_count).toBe(0);
    // created_at floated to now (released to the top of Dreams)
    expect((await upload(S1))!.created_at!.getTime()).toBeGreaterThan(before);
  });

  test('a dream in TWO albums returns to Dreams only when the LAST album is deleted', async () => {
    await publishAlbum(H1, [S1, S2]);
    await publishAlbum(H2, [S1, S3]);
    expect((await upload(S1))!.album_ref_count).toBe(2); // S1 in both
    await pool.query('DELETE FROM public.uploads WHERE id=$1', [H1]);
    expect((await upload(S1))!.album_ref_count).toBe(1); // still in H2 → stays out of Dreams
    await pool.query('DELETE FROM public.uploads WHERE id=$1', [H2]);
    expect((await upload(S1))!.album_ref_count).toBe(0); // now free → back in Dreams
  });
});
