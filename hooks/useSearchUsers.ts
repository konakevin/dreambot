import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { useBlockedIds } from '@/hooks/useBlockUser';
import { SEARCH_HIDDEN_BOT_USERNAMES } from '@/hooks/useBotUsers';

export interface SearchUser {
  id: string;
  username: string;
  avatarUrl: string | null;
  isPublic: boolean;
}

export function useSearchUsers(query: string) {
  const user = useAuthStore((s) => s.user);
  // Users I've blocked shouldn't surface in search. (The reverse direction —
  // someone who blocked me — is already invisible: their blocked_users rows are
  // RLS-hidden from me, and get_public_profile blocks opening their profile.)
  const { data: blockedIds } = useBlockedIds();

  return useQuery({
    queryKey: ['searchUsers', query, blockedIds ? blockedIds.size : 0],
    queryFn: async (): Promise<SearchUser[]> => {
      const { data, error } = await supabase
        .from('users')
        .select('id, username, avatar_url, is_public')
        .ilike('username', `%${query}%`)
        .neq('id', user!.id)
        // Hide PRIVATE BOTS (retired / AlphaBot / MechBot) from search by their
        // is_public flag — so a bot retired via is_public=false is auto-hidden and
        // can't drift out of the hardcoded SEARCH_HIDDEN list below (that's how
        // OutlawBot + RetroBot leaked, 2026-07-20). Private HUMANS stay findable
        // (needed to send a follow request): show a row when it's NOT a bot OR it's
        // public. The hardcoded list still covers public-but-retired bots (GlowBot,
        // HumanBot, whose old posts stay public).
        .or('is_bot.eq.false,is_public.eq.true')
        .limit(20);

      if (error) throw error;
      return (
        (data ?? [])
          .filter((u) => !blockedIds?.has(u.id))
          // Retired bots stay out of search (same as the pills), and AlphaBot
          // (private proving ground) is search-hidden for EVERYONE.
          .filter((u) => !SEARCH_HIDDEN_BOT_USERNAMES.has((u.username ?? '').toLowerCase()))
          .map((u) => ({
            id: u.id,
            username: u.username,
            avatarUrl: u.avatar_url,
            isPublic: ((u as Record<string, unknown>).is_public as boolean) ?? true,
          }))
      );
    },
    enabled: !!user && query.trim().length >= 2,
    staleTime: 30_000,
  });
}
