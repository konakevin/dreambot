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
  /** True when this result IS the current user — the search tab marks it "You". */
  isMe: boolean;
}

export function useSearchUsers(query: string, opts?: { includeSelf?: boolean }) {
  const user = useAuthStore((s) => s.user);
  // Users I've blocked shouldn't surface in search. (The reverse direction —
  // someone who blocked me — is already invisible: their blocked_users rows are
  // RLS-hidden from me, and get_public_profile blocks opening their profile.)
  const { data: blockedIds } = useBlockedIds();
  // The search tab shows YOU in your own results (marked "You"); @mentions + the
  // gift picker leave this off so you can't mention or gift yourself.
  const includeSelf = opts?.includeSelf ?? false;

  return useQuery({
    queryKey: ['searchUsers', query, blockedIds ? blockedIds.size : 0, includeSelf],
    queryFn: async (): Promise<SearchUser[]> => {
      let builder = supabase
        .from('users')
        .select('id, username, avatar_url, is_public')
        .ilike('username', `%${query}%`);
      if (!includeSelf) builder = builder.neq('id', user!.id);
      const { data, error } = await builder
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
            isMe: u.id === user!.id,
          }))
      );
    },
    enabled: !!user && query.trim().length >= 2,
    staleTime: 30_000,
  });
}
