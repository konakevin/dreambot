import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface FollowUser {
  id: string;
  username: string;
  avatar_url: string | null;
  is_bot?: boolean;
}

/**
 * Shared follow-list ordering (Kevin 2026-07-08): people first, alphabetical,
 * then bots, alphabetical, at the bottom. One flat list — no section headers.
 */
export function sortPeopleThenBots(list: FollowUser[]): FollowUser[] {
  return [...list].sort((a, b) => {
    if (!!a.is_bot !== !!b.is_bot) return a.is_bot ? 1 : -1;
    return (a.username ?? '').localeCompare(b.username ?? '', undefined, {
      sensitivity: 'base',
    });
  });
}

export function useFollowersList(userId: string) {
  return useQuery({
    queryKey: ['followersList', userId],
    queryFn: async () => {
      // Paginate in 1000-row chunks (PostgREST's hard 1000-row cap made the old
      // .limit(500) silently truncate the followers list past 500).
      const all: FollowUser[] = [];
      const PAGE = 1000;
      for (let offset = 0; ; offset += PAGE) {
        const { data, error } = await supabase
          .from('follows')
          .select('users!follower_id(id, username, avatar_url, is_bot)')
          .eq('following_id', userId)
          .order('created_at', { ascending: false })
          .range(offset, offset + PAGE - 1);
        if (error) throw error;
        if (!data || data.length === 0) break;
        // The embedded join yields users:null for rows RLS hides from the
        // CALLER (e.g. a follower the viewer has BLOCKED) — pushing the null
        // crashed keyExtractor (null.id) via the error boundary (2026-07-05,
        // "kev" repro: viewer had blocked one of the followers). Blocked
        // users simply don't appear in the list.
        for (const r of data) if (r.users) all.push(r.users as FollowUser);
        if (data.length < PAGE) break;
      }
      return sortPeopleThenBots(all);
    },
    enabled: !!userId,
    staleTime: 60_000,
  });
}
