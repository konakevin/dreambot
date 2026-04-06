/**
 * usePostLikes — fetches the list of users who liked a specific post.
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface LikeUser {
  id: string;
  username: string;
  avatar_url: string | null;
}

export function usePostLikes(uploadId: string | null) {
  return useQuery({
    queryKey: ['postLikes', uploadId],
    queryFn: async (): Promise<LikeUser[]> => {
      if (!uploadId) return [];
      const { data, error } = await supabase
        .from('likes')
        .select('user_id, users!inner(username, avatar_url)')
        .eq('upload_id', uploadId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []).map((row: Record<string, unknown>) => {
        const u = row.users as Record<string, unknown>;
        return {
          id: row.user_id as string,
          username: u.username as string,
          avatar_url: (u.avatar_url as string | null) ?? null,
        };
      });
    },
    enabled: !!uploadId,
    staleTime: 30_000,
  });
}
