import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

/**
 * useReposters — the list of users who reposted a post, for the long-press
 * "Reposted by" sheet. Backed by the get_reposters RPC (newest-first).
 */
export interface RepostUser {
  id: string;
  username: string;
  avatar_url: string | null;
}

export function useReposters(uploadId: string | null) {
  return useQuery({
    queryKey: ['reposters', uploadId],
    queryFn: async (): Promise<RepostUser[]> => {
      if (!uploadId) return [];
      const { data, error } = await supabase.rpc('get_reposters', {
        p_upload_id: uploadId,
        p_limit: 100,
      });
      if (error) throw error;
      return (data ?? []).map((row: Record<string, unknown>) => ({
        id: row.user_id as string,
        username: row.username as string,
        avatar_url: (row.avatar_url as string | null) ?? null,
      }));
    },
    enabled: !!uploadId,
    staleTime: 30_000,
  });
}
