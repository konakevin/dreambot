/**
 * Guard: the Saved, Hearted and Reposts albums sort, open a month, and count their month
 * tiles by the SAME date (when you saved / hearted / reposted). If the grid's column and
 * get_album_months' column ever drift apart, a month tile's count stops matching the
 * month it opens (migration 562, ALBUM_DISCOVERY_PLAN.md).
 *
 * Also locks the privacy rule in the LATEST get_album_months: Saved and Hearted are yours
 * alone (likes are readable by everyone, so the function itself must refuse others).
 */
import * as fs from 'fs';
import * as path from 'path';
import { latestFunctionBody } from '../helpers/latestMigration';

const ROOT = path.join(__dirname, '..', '..');

const ALBUMS = [
  { hook: 'hooks/useFavoritePosts.ts', table: 'favorites', alias: 'f', column: 'created_at' },
  { hook: 'hooks/useLikedPosts.ts', table: 'likes', alias: 'l', column: 'created_at' },
  {
    hook: 'hooks/useUserReposts.ts',
    table: 'post_reposts',
    alias: 'r',
    column: 'last_reposted_at',
  },
];

describe('Saved / Hearted / Reposts: one date for sort, month albums and month tiles', () => {
  it.each(ALBUMS)('$hook orders and filters months by $column', ({ hook, column }) => {
    const src = fs.readFileSync(path.join(ROOT, hook), 'utf-8');
    const used = [...src.matchAll(/\.(order|gte|lt)\(\s*'([a-z_]+)'/g)].map((m) => [m[1], m[2]]);
    expect(used.map(([call]) => call).sort()).toEqual(['gte', 'lt', 'order']);
    for (const [call, col] of used)
      expect({ hook, call, col }).toEqual({ hook, call, col: column });
  });

  it.each(ALBUMS)(
    'get_album_months buckets $table by $alias.$column',
    ({ table, alias, column }) => {
      const { file, body } = latestFunctionBody('get_album_months');
      const branch = new RegExp(
        `SELECT\\s+${alias}\\.${column}\\b[\\s\\S]*?FROM\\s+public\\.${table}\\s+${alias}\\b`,
        'i'
      );
      expect({ file, bucketsBySaveDate: branch.test(body) }).toEqual({
        file,
        bucketsBySaveDate: true,
      });
    }
  );

  it("get_album_months refuses someone else's Saved and Hearted", () => {
    const { file, body } = latestFunctionBody('get_album_months');
    const guard =
      /IF\s*\([^)]*p_scope\s+IN\s*\(\s*'saved'\s*,\s*'hearted'\s*\)\s*\)\s*AND\s+p_user_id\s*<>\s*auth\.uid\(\)\s+THEN\s+RETURN;/i;
    expect({ file, refusesOthers: guard.test(body) }).toEqual({ file, refusesOthers: true });
  });

  it('get_album_months stays SECURITY INVOKER (row-level security decides what you see)', () => {
    const { file, body } = latestFunctionBody('get_album_months');
    expect({ file, invoker: /SECURITY\s+INVOKER/i.test(body) }).toEqual({ file, invoker: true });
  });
});
