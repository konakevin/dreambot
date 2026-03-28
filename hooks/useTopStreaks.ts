import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useFeedStore } from '@/store/feed';

export interface VibeSyncStreak {
  friendId: string;
  friendUsername: string;
  friendAvatar: string | null;
  friendRank: string | null;
  currentStreak: number;
  bestStreak: number;
  streakType: 'rad' | 'bad' | null;
}

export function useTopStreaks(userId: string) {
  const localStreaks = useFeedStore((s) => s.localStreaks);

  const query = useQuery({
    queryKey: ['topStreaks', userId],
    queryFn: async (): Promise<VibeSyncStreak[]> => {
      const { data, error } = await supabase.rpc('get_top_streaks', { p_user_id: userId });
      if (error) throw error;

      return (data ?? []).map((row: Record<string, unknown>) => ({
        friendId: row.friend_id as string,
        friendUsername: row.friend_username as string,
        friendAvatar: (row.friend_avatar as string | null) ?? null,
        friendRank: (row.friend_rank as string | null) ?? null,
        currentStreak: row.current_streak as number,
        bestStreak: row.best_streak as number,
        streakType: (row.streak_type as 'rad' | 'bad' | null) ?? null,
      }));
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });

  // Merge local optimistic streaks with server data
  const serverUsernames = new Set((query.data ?? []).map((s) => s.friendUsername));

  const merged = (query.data ?? []).map((s) => {
    const local = localStreaks.get(s.friendUsername);
    if (local) {
      return {
        ...s,
        currentStreak: local.count,
        bestStreak: Math.max(s.bestStreak, local.count),
        streakType: local.streakType,
      };
    }
    return s;
  });

  // Add local-only streaks (new this session, no server row yet)
  for (const [username, local] of localStreaks) {
    if (!serverUsernames.has(username) && local.count > 0) {
      merged.push({
        friendId: '',
        friendUsername: local.username,
        friendAvatar: local.avatarUrl,
        friendRank: local.userRank,
        currentStreak: local.count,
        bestStreak: local.count,
        streakType: local.streakType,
      });
    }
  }

  // Sort by current streak descending
  merged.sort((a, b) => b.currentStreak - a.currentStreak);

  // Filter out zeroed-out streaks
  const filtered = merged.filter((s) => s.currentStreak > 0);

  return { ...query, data: filtered };
}
