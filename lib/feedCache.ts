/**
 * Live feed-cache maintenance shared by the Home, Bots and Explore feeds
 * ('dreamFeed' + 'explore' query roots; the seed sits at key position 3 in both).
 */
import type { InfiniteData, QueryClient } from '@tanstack/react-query';
import { removePostsFromPages } from '@/lib/feedHelpers';
import { useFeedStore } from '@/store/feed';

const FEED_ROOTS = ['dreamFeed', 'explore'] as const;

type FeedRowLike = { id: string; user_id?: string | null };
type FeedPageLike = { rows: FeedRowLike[] } | FeedRowLike[];

/**
 * Drop cached feed entries from seeds that are no longer live. Feed keys include
 * the seed, so each reshuffle mints a whole new key family and ORPHANS the old
 * one; with a 24h gcTime nothing left the cache, a heavy session piled up ~1,600
 * entries, and every optimistic sweep (likes, counts) walked them all: 6+ s of
 * blocked JS per double-tap (Kevin 2026-07-21). Call at every seed rotation.
 *
 * Keeps `activeSeed` AND both live store seeds. Home (feedSeed) and Bots/Explore
 * (browseSeed) rotate independently, so a prune keyed on only one of them would
 * throw away the other side's WARM cache: a Home refresh would empty the Bots
 * tab's prewarmed feeds, a Bots refresh would empty Home's prefetched Following
 * tab. The observer guard is load-bearing too: an entry a mounted feed still
 * shows (keepPreviousData during a reseed) survives and is collected on a later
 * rotation, once its observers have re-keyed.
 */
export function pruneStaleFeedCaches(queryClient: QueryClient, activeSeed: number): void {
  const { feedSeed, browseSeed } = useFeedStore.getState();
  const live = new Set<unknown>([activeSeed, feedSeed, browseSeed]);
  for (const root of FEED_ROOTS) {
    queryClient.removeQueries({
      queryKey: [root],
      predicate: (q) => !live.has(q.queryKey[3]) && q.getObserversCount() === 0,
    });
  }
}

/**
 * Remove posts from every loaded feed IN PLACE, without a refetch: report, block
 * and admin hide/delete/ban. A refetch recomputes LIVE scores (age decay +
 * the seen penalty) and re-sorts every loaded page under the user, which is what
 * made the feed pop to a different post (Kevin 2026-09-26). get_feed already
 * filters reported / blocked / moderated content on the NEXT fetch; this makes
 * it vanish from the current view now.
 *
 * A page load that is mid-flight would land on the pre-removal pages and bring
 * the post back, so those fetches are cancelled first (only ones that already
 * have data: cancelling a first load would leave the feed stuck empty).
 */
export async function removePostsFromFeeds(
  queryClient: QueryClient,
  shouldRemove: (post: FeedRowLike) => boolean
): Promise<void> {
  for (const root of FEED_ROOTS) {
    for (const query of queryClient.getQueryCache().findAll({ queryKey: [root] })) {
      if (query.state.fetchStatus === 'fetching' && query.state.data !== undefined) {
        await queryClient.cancelQueries({ queryKey: query.queryKey, exact: true });
      }
    }
    queryClient.setQueriesData<InfiniteData<FeedPageLike>>({ queryKey: [root] }, (prev) => {
      if (!prev) return prev;
      const pages = removePostsFromPages(prev.pages, shouldRemove) as FeedPageLike[];
      return pages === prev.pages ? prev : { ...prev, pages };
    });
  }
  // The pinned post lives outside the query cache.
  const pinned = useFeedStore.getState().pinnedPost;
  if (pinned && shouldRemove(pinned)) useFeedStore.getState().setPinnedPost(null);
}
