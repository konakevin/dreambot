import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';

/**
 * New posts in the Home "Following" tab since the user last opened it (migration 629; Kevin 2026-09-30: bots count
 * like anyone, "a follower is a follower"). Read ONCE per launch, never on focus or tab switches, because the Home
 * feed itself only reloads on a launch, pull-to-refresh or Home re-tap (feedback_home_feed_never_auto_refreshes): a
 * number that grew while the feed stayed put would promise posts the tab doesn't have. Home re-reads it after its
 * own refresh (`refresh`), and opening Following clears it (`markViewed`). Memory-only: not in PERSISTED_ROOTS, so
 * every launch starts from the server.
 */
export function useFollowingNewCount() {
  const userId = useAuthStore((s) => s.user?.id);
  const qc = useQueryClient();
  const key = ['followingNewCount', userId];

  const { data } = useQuery({
    queryKey: key,
    queryFn: async (): Promise<number> => {
      const { data: n, error } = await supabase.rpc('get_following_new_count');
      if (error) throw error;
      return n ?? 0;
    },
    enabled: !!userId,
    staleTime: Infinity,
  });

  // Opening Following: the number goes at once, then the server stamps the view. A post that lands between the
  // launch-time feed load and this stamp isn't counted next launch; it still sits near the top of the next fresh feed.
  const markViewed = useCallback(() => {
    if (!userId) return;
    qc.setQueryData(['followingNewCount', userId], 0);
    supabase.rpc('mark_following_viewed').then(({ error }) => {
      if (error && __DEV__) console.warn('[followingNewCount] mark viewed failed:', error.message);
    });
  }, [qc, userId]);

  // After a Home refresh (new seed = a fresh Following feed too): count again.
  const refresh = useCallback(() => {
    if (!userId) return;
    void qc.invalidateQueries({ queryKey: ['followingNewCount', userId] });
  }, [qc, userId]);

  return { count: data ?? 0, markViewed, refresh };
}
