/**
 * Gallery media mapping (migration 356) — lock the two shapes mapMedia must
 * handle and the single-post → [] invariant, so a future edit can't silently
 * regress single-image posts into carousel mounting (or scramble album order).
 */
import { mapRpcToDreamPost, mapToDreamPost } from '@/lib/mapPost';

const users = { username: 'ada', avatar_url: null, allow_reposts: true };

describe('gallery media mapping', () => {
  it('single-image post → media is empty (renders the scalar cover)', () => {
    const rpc = mapRpcToDreamPost({ id: '1', user_id: 'u', image_url: 'c.jpg', username: 'ada' });
    expect(rpc.media).toEqual([]);
    expect((rpc.media?.length ?? 0) > 1).toBe(false); // not a gallery

    const joined = mapToDreamPost({ id: '1', user_id: 'u', image_url: 'c.jpg', users });
    expect(joined.media).toEqual([]);
  });

  it('RPC `media` jsonb shape maps in order and detects a gallery', () => {
    const item = mapRpcToDreamPost({
      id: '1',
      user_id: 'u',
      image_url: 'a.jpg',
      username: 'ada',
      media: [
        { url: 'a.jpg', display: 'a.d.jpg', hq: null, thumbhash: 'ta' },
        { url: 'b.jpg', display: 'b.d.jpg', hq: 'b.hq.jpg', thumbhash: 'tb' },
        { url: 'c.jpg', display: null, hq: null, thumbhash: null },
      ],
    });
    expect(item.media?.map((m) => m.url)).toEqual(['a.jpg', 'b.jpg', 'c.jpg']);
    expect(item.media?.[1].hq).toBe('b.hq.jpg');
    expect((item.media?.length ?? 0) > 1).toBe(true); // gallery
  });

  it('PostgREST `upload_media` embed shape sorts by position', () => {
    const item = mapToDreamPost({
      id: '1',
      user_id: 'u',
      image_url: 'a.jpg',
      users,
      media_count: 3,
      // deliberately out of order — must sort by `position`
      upload_media: [
        { position: 2, image_url: 'c.jpg', image_url_display: null, thumbhash: null },
        { position: 0, image_url: 'a.jpg', image_url_display: 'a.d.jpg', image_url_hq: 'a.hq' },
        { position: 1, image_url: 'b.jpg', image_url_display: 'b.d.jpg' },
      ],
    });
    expect(item.media?.map((m) => m.url)).toEqual(['a.jpg', 'b.jpg', 'c.jpg']);
    expect(item.media?.[0].display).toBe('a.d.jpg');
    expect(item.media?.[0].hq).toBe('a.hq');
    expect(item.media_count).toBe(3);
  });

  it('drops malformed entries (no url) and tolerates non-arrays', () => {
    const item = mapRpcToDreamPost({
      id: '1',
      user_id: 'u',
      image_url: 'a.jpg',
      username: 'ada',
      media: [{ url: 'a.jpg' }, { display: 'orphan.jpg' }, null, 'nope'],
    });
    expect(item.media?.map((m) => m.url)).toEqual(['a.jpg']);

    const bad = mapRpcToDreamPost({
      id: '1',
      user_id: 'u',
      image_url: 'a.jpg',
      username: 'ada',
      media: 'not-an-array',
    });
    expect(bad.media).toEqual([]);
  });
});
