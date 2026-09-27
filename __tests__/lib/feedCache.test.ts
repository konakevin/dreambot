/**
 * Live feed-cache maintenance (lib/feedCache.ts), against a real QueryClient.
 *
 * 1. pruneStaleFeedCaches keeps BOTH live seeds. Home (feedSeed) and Bots/Explore
 *    (browseSeed) rotate independently since 2026-09-26; pruning on one seed alone
 *    would throw away the other side's warm cache (the Bots tab's prewarmed feeds,
 *    Home's prefetched Following tab) and slow those tabs down.
 * 2. removePostsFromFeeds removes posts IN PLACE (report / block / admin): no
 *    refetch, so the loaded feed keeps its order and the user keeps their spot.
 */
import { QueryClient, QueryObserver } from '@tanstack/react-query';
import { pruneStaleFeedCaches, removePostsFromFeeds } from '@/lib/feedCache';
import { useFeedStore } from '@/store/feed';

type Row = { id: string; user_id: string };
const rows = (...ids: string[]): Row[] => ids.map((id) => ({ id, user_id: `u-${id}` }));

function seedFeed(qc: QueryClient, key: readonly unknown[], pages: unknown[]) {
  qc.setQueryData(key, { pages, pageParams: pages.map(() => null) });
}

describe('pruneStaleFeedCaches', () => {
  let qc: QueryClient;
  beforeEach(() => {
    qc = new QueryClient();
    useFeedStore.setState({ feedSeed: 0.1, browseSeed: 0.2 });
  });
  afterEach(() => qc.clear());

  it('keeps the active seed AND both live store seeds, drops the rest', () => {
    seedFeed(qc, ['dreamFeed', 'forYou', 'u', 0.1, 0.15, null], [{ rows: rows('a') }]);
    seedFeed(qc, ['dreamFeed', 'following', 'u', 0.1, 0.15, null], [{ rows: rows('b') }]);
    seedFeed(qc, ['dreamFeed', 'bots', 'u', 0.2, 0.15, 'bot1'], [{ rows: rows('c') }]);
    seedFeed(qc, ['explore', '', '', 0.2, 0.15], [rows('d')]);
    seedFeed(qc, ['dreamFeed', 'bots', 'u', 0.9, 0.15, null], [{ rows: rows('stale') }]);
    seedFeed(qc, ['dreamFeed', 'forYou', 'u', 0.5, 0.15, null], [{ rows: rows('new') }]);

    // A Home refresh prunes with its NEW seed (0.5) before committing it.
    pruneStaleFeedCaches(qc, 0.5);

    const seeds = qc
      .getQueryCache()
      .getAll()
      .map((q) => q.queryKey[3])
      .sort();
    // Home's current (0.1), browse (0.2, the Bots + Explore warm cache), the new
    // Home seed (0.5) all survive; only the orphaned 0.9 entry goes.
    expect(seeds).toEqual([0.1, 0.1, 0.2, 0.2, 0.5]);
  });

  it('never drops an entry a mounted feed is still showing', () => {
    const key = ['dreamFeed', 'bots', 'u', 0.9, 0.15, null];
    seedFeed(qc, key, [{ rows: rows('shown') }]);
    const observer = new QueryObserver(qc, { queryKey: key, enabled: false });
    const unsubscribe = observer.subscribe(() => {});
    pruneStaleFeedCaches(qc, 0.5);
    expect(qc.getQueryData(key)).toBeDefined();
    unsubscribe();
  });
});

describe('removePostsFromFeeds', () => {
  let qc: QueryClient;
  beforeEach(() => {
    qc = new QueryClient();
    useFeedStore.setState({ pinnedPost: null });
  });
  afterEach(() => qc.clear());

  it('removes a post from every loaded feed in place, keeping order and page metadata', async () => {
    const home = ['dreamFeed', 'forYou', 'u', 0.1, 0.15, null];
    const explore = ['explore', '', '', 0.2, 0.15];
    seedFeed(qc, home, [
      { rows: rows('a', 'b', 'c'), nextCursor: { score: 1, id: 'c' } },
      { rows: rows('d', 'e'), nextCursor: null },
    ]);
    seedFeed(qc, explore, [rows('b', 'x')]);

    await removePostsFromFeeds(qc, (p) => p.id === 'b');

    const homeData = qc.getQueryData<{ pages: { rows: Row[]; nextCursor: unknown }[] }>(home);
    expect(homeData?.pages.map((p) => p.rows.map((r) => r.id))).toEqual([
      ['a', 'c'],
      ['d', 'e'],
    ]);
    expect(homeData?.pages[0].nextCursor).toEqual({ score: 1, id: 'c' });
    const exploreData = qc.getQueryData<{ pages: Row[][] }>(explore);
    expect(exploreData?.pages[0].map((r) => r.id)).toEqual(['x']);
  });

  it('removes every post by a blocked or banned user', async () => {
    const home = ['dreamFeed', 'forYou', 'u', 0.1, 0.15, null];
    seedFeed(qc, home, [
      {
        rows: [
          { id: '1', user_id: 'bad' },
          { id: '2', user_id: 'ok' },
          { id: '3', user_id: 'bad' },
        ],
      },
    ]);
    await removePostsFromFeeds(qc, (p) => p.user_id === 'bad');
    const data = qc.getQueryData<{ pages: { rows: Row[] }[] }>(home);
    expect(data?.pages[0].rows.map((r) => r.id)).toEqual(['2']);
  });

  it('leaves a feed that has nothing to remove untouched (same object, no re-render)', async () => {
    const home = ['dreamFeed', 'forYou', 'u', 0.1, 0.15, null];
    seedFeed(qc, home, [{ rows: rows('a', 'b') }]);
    const before = qc.getQueryData(home);
    await removePostsFromFeeds(qc, (p) => p.id === 'zzz');
    expect(qc.getQueryData(home)).toBe(before);
  });

  it('clears the pinned post when it is the one removed', async () => {
    useFeedStore.setState({
      pinnedPost: {
        id: 'p',
        user_id: 'u-p',
        image_url: '',
        caption: null,
        username: 'x',
        avatar_url: null,
        created_at: '',
      },
    });
    await removePostsFromFeeds(qc, (p) => p.id === 'p');
    expect(useFeedStore.getState().pinnedPost).toBeNull();
  });
});
