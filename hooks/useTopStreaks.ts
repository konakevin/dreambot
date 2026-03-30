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
  radStreak: number;
  badStreak: number;
  bestRadStreak: number;
  bestBadStreak: number;
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
        radStreak: (row.rad_streak as number) ?? 0,
        badStreak: (row.bad_streak as number) ?? 0,
        bestRadStreak: (row.best_rad_streak as number) ?? 0,
        bestBadStreak: (row.best_bad_streak as number) ?? 0,
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
      const radS = local.radStreak;
      const badS = local.badStreak;
      return {
        ...s,
        radStreak: radS,
        badStreak: badS,
        bestRadStreak: Math.max(s.bestRadStreak, radS),
        bestBadStreak: Math.max(s.bestBadStreak, badS),
        currentStreak: Math.max(radS, badS),
        bestStreak: Math.max(s.bestStreak, radS, badS),
        streakType: radS >= badS ? 'rad' as const : 'bad' as const,
      };
    }
    return s;
  });

  // Add local-only streaks (new this session, no server row yet)
  for (const [, local] of localStreaks) {
    if (!serverUsernames.has(local.username) && (local.radStreak > 0 || local.badStreak > 0)) {
      merged.push({
        friendId: local.userId,
        friendUsername: local.username,
        friendAvatar: local.avatarUrl,
        friendRank: local.userRank,
        radStreak: local.radStreak,
        badStreak: local.badStreak,
        bestRadStreak: local.radStreak,
        bestBadStreak: local.badStreak,
        currentStreak: Math.max(local.radStreak, local.badStreak),
        bestStreak: Math.max(local.radStreak, local.badStreak),
        streakType: local.radStreak >= local.badStreak ? 'rad' : 'bad',
      });
    }
  }

  // Sort by highest active streak descending
  merged.sort((a, b) => b.currentStreak - a.currentStreak);

  // Filter out entries with no active streaks
  const filtered = merged.filter((s) => s.radStreak > 0 || s.badStreak > 0);

  return { ...query, data: filtered };
}
