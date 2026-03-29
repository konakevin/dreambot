import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Comment } from '@/hooks/useComments';

function mapRow(row: Record<string, unknown>): Comment {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    username: row.username as string,
    avatarUrl: (row.avatar_url as string | null) ?? null,
    userRank: (row.user_rank as string | null) ?? null,
    body: row.body as string,
    likeCount: row.like_count as number,
    replyCount: 0,
    createdAt: row.created_at as string,
    isLiked: row.is_liked as boolean,
    parentId: (row.parent_id as string | undefined) ?? undefined,
  };
}

export function useReplies(commentId: string, enabled: boolean) {
  return useQuery({
    queryKey: ['replies', commentId],
    queryFn: async (): Promise<Comment[]> => {
      const { data, error } = await supabase.rpc('get_replies', {
        p_comment_id: commentId,
        p_limit: 50,
      });
      if (error) throw error;
      return (data ?? []).map(mapRow);
    },
    enabled: enabled && !!commentId,
    staleTime: 30_000,
  });
}
