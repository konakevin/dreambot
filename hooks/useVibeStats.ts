import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';

export interface VibeStats {
  vibeScore: number | null;   // 0-100 %, null if < 5 shared votes
  bestStreak: number;
  sharedCount: number;
  isVibing: boolean;
}

export function useVibeStats(otherUserId: string) {
  const currentUser = useAuthStore((s) => s.user);

  return useQuery({
    queryKey: ['vibeStats', currentUser?.id, otherUserId],
    queryFn: async (): Promise<VibeStats> => {
      const { data, error } = await supabase.rpc('get_vibe_stats', {
        p_user_id: currentUser!.id,
        p_other_id: otherUserId,
      });

      if (error) throw error;

      const row = Array.isArray(data) ? data[0] : data;
      return {
        vibeScore: row?.vibe_score ?? null,
        bestStreak: row?.best_streak ?? 0,
        sharedCount: row?.shared_count ?? 0,
        isVibing: row?.is_vibing ?? false,
      };
    },
    enabled: !!currentUser && !!otherUserId && currentUser.id !== otherUserId,
    staleTime: 60_000,
  });
}
