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
      // Cap the read. PostgREST silently truncates at 1000 rows, so an
      // unbounded select on a viral post (10k+ likes) would return an
      // arbitrary 1000 and read like the whole list. The overlay only ever
      // shows the most-recent likers, so bound it explicitly — add a
      // "load more" page if this ever needs the full set.
      const { data, error } = await supabase
        .from('likes')
        .select('user_id, users!inner(username, avatar_url)')
        .eq('upload_id', uploadId)
        .order('created_at', { ascending: false })
        .range(0, 199);
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
