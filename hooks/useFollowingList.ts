import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { PRIVATE_BOT_USERNAMES } from '@/hooks/useBotUsers';
import type { FollowUser } from './useFollowersList';

export function useFollowingList(userId: string) {
  return useQuery({
    queryKey: ['followingList', userId],
    queryFn: async () => {
      // Paginate in 1000-row chunks (PostgREST's hard 1000-row cap made the old
      // .limit(500) silently truncate the following list past 500).
      const all: FollowUser[] = [];
      const PAGE = 1000;
      for (let offset = 0; ; offset += PAGE) {
        const { data, error } = await supabase
          .from('follows')
          .select('users!following_id(id, username, avatar_url)')
          .eq('follower_id', userId)
          .order('created_at', { ascending: false })
          .range(offset, offset + PAGE - 1);
        if (error) throw error;
        if (!data || data.length === 0) break;
        // Same null-join guard as useFollowersList (2026-07-05): RLS hides
        // rows the viewer has blocked → users:null → keyExtractor crash.
        // AlphaBot (private proving ground, ALPHABOT.md) must not leak via the
        // supreme admin's public following list. Retired-but-public bots stay
        // listed (their posts are still visible), so this filters ONLY the
        // private set.
        for (const r of data) {
          if (!r.users) continue;
          const u = r.users as FollowUser;
          if (PRIVATE_BOT_USERNAMES.has((u.username ?? '').toLowerCase())) continue;
          all.push(u);
        }
        if (data.length < PAGE) break;
      }
      return all;
    },
    enabled: !!userId,
    staleTime: 60_000,
  });
}
