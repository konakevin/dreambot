import { useCallback } from 'react';
import { useFeedStore } from '@/store/feed';
import type { FeedItem, FriendVote } from '@/hooks/useFeed';

/**
 * Handles streak comparisons after voting in Streak feed mode.
 *
 * Owns: interaction with localStreaks in Zustand store.
 * Called by handleVote to update optimistic streak counts.
 */
export function useStreakVoting() {
  const localStreaks = useFeedStore((s) => s.localStreaks);
  const updateStreak = useFeedStore((s) => s.updateStreak);

  /** After voting, update local streak counts for each friend who voted on this post */
  const processVote = useCallback((item: FeedItem, vote: 'rad' | 'bad') => {
    if (!item.friend_votes?.length) return;
    for (const f of item.friend_votes) {
      updateStreak(f, f.vote === vote, vote);
    }
  }, [updateStreak]);

  /** Apply local streak overrides to friend_votes before passing to SwipeCard */
  const applyLocalStreaks = useCallback((friendVotes: FriendVote[] | undefined): FriendVote[] | undefined => {
    if (!friendVotes) return undefined;
    return friendVotes.map((f) => {
      const local = localStreaks.get(f.username);
      return {
        ...f,
        rad_streak: local?.radStreak ?? f.rad_streak,
        bad_streak: local?.badStreak ?? f.bad_streak,
      };
    });
  }, [localStreaks]);

  return { processVote, applyLocalStreaks };
}
