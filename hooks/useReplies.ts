import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Comment } from '@/hooks/useComments';
import type { Database } from '@/types/database';

// Generated get_replies RETURN row — mapping from this (not a Record<string,unknown>
// cast) makes a dropped client-read column a tsc error, same lock as useComments.
// (get_replies has no reply_count — a reply has no nested replies — so it's 0 here.)
type GetRepliesRow = Database['public']['Functions']['get_replies']['Returns'][number];

function mapRow(row: GetRepliesRow): Comment {
  return {
    id: row.id,
    userId: row.user_id,
    username: row.username,
    avatarUrl: row.avatar_url ?? null,
    body: row.body,
    likeCount: row.like_count,
    replyCount: 0,
    createdAt: row.created_at,
    isLiked: row.is_liked,
    parentId: row.parent_id ?? undefined,
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
