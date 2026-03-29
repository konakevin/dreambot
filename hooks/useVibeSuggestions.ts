import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';

export interface VibeSuggestion {
  userId: string;
  username: string;
  avatarUrl: string | null;
  userRank: string | null;
  vibeScore: number;
  sharedCount: number;
}

export function useVibeSuggestions() {
  const user = useAuthStore((s) => s.user);

  return useQuery({
    queryKey: ['vibeSuggestions', user?.id],
    queryFn: async (): Promise<VibeSuggestion[]> => {
      const { data, error } = await supabase.rpc('get_vibe_suggestions', {
        p_user_id: user!.id,
        p_limit: 20,
      });

      if (error) throw error;

      return (data ?? []).map((row: Record<string, unknown>) => ({
        userId: row.user_id as string,
        username: row.username as string,
        avatarUrl: (row.avatar_url as string | null) ?? null,
        userRank: (row.user_rank as string | null) ?? null,
        vibeScore: row.vibe_score as number,
        sharedCount: row.shared_count as number,
      }));
    },
    enabled: !!user,
    staleTime: 300_000, // 5 min — not real-time critical
  });
}
