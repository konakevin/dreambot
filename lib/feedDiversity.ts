/**
 * applyDiversity — content-diversity post-processing for the home feed.
 *
 * Reorders a SINGLE PAGE of scored feed rows to prevent monotonous sequences:
 * - No more than 2 consecutive posts from the same user
 * - No more than 3 consecutive posts of the same medium
 *
 * Greedy left-to-right walk. Posts that would extend a streak get deferred,
 * then appended at the end of the result.
 *
 * IMPORTANT: this function is applied PER-PAGE inside useDreamFeed.queryFn,
 * NOT to the full pages.flat() array. Per-page application makes each page
 * order-stable on its own — earlier pages never reshuffle when a new page
 * arrives via fetchNextPage. This fixes the "wrong post pops in mid-scroll
 * at the page boundary" bug. Trade-off: streak detection is within-page
 * only, so cross-page-boundary streaks (last 3 of page N + first 3 of page
 * N+1) are possible. Acceptable at PAGE_SIZE=20.
 */

interface DiversityCandidate {
  user_id: string;
  dream_medium?: string | null;
}

export function applyDiversity<T extends DiversityCandidate>(posts: T[]): T[] {
  if (posts.length <= 2) return posts;
  const result: T[] = [];
  const deferred: T[] = [];

  for (const post of posts) {
    const len = result.length;
    // Check same-user streak (max 2)
    const sameUser =
      len >= 2 &&
      result[len - 1].user_id === post.user_id &&
      result[len - 2].user_id === post.user_id;
    // Check same-medium streak (max 3)
    const sameMedium =
      len >= 3 &&
      post.dream_medium != null &&
      result[len - 1].dream_medium === post.dream_medium &&
      result[len - 2].dream_medium === post.dream_medium &&
      result[len - 3].dream_medium === post.dream_medium;

    if (sameUser || sameMedium) {
      deferred.push(post);
    } else {
      result.push(post);
    }
  }
  // Append deferred posts at the end (still visible, just not in a streak)
  return result.concat(deferred);
}
