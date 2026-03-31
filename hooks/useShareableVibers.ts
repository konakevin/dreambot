import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';

export interface ShareableViber {
  userId: string;
  username: string;
  avatarUrl: string | null;
  interactionCount: number;
  vibeScore: number;
}

export function useShareableVibers() {
  const user = useAuthStore((s) => s.user);

  return useQuery({
    queryKey: ['shareableVibers', user?.id],
    queryFn: async (): Promise<ShareableViber[]> => {
      const { data, error } = await supabase.rpc('get_shareable_vibers', {
        p_user_id: user!.id,
      });

      if (error) throw error;

      return (data ?? []).map((row: Record<string, unknown>) => ({
        userId: row.user_id as string,
        username: row.username as string,
        avatarUrl: (row.avatar_url as string | null) ?? null,
        interactionCount: Number(row.interaction_count),
        vibeScore: Number(row.vibe_score),
      }));
    },
    enabled: !!user,
    staleTime: 60_000,
  });
}
