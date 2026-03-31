import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface Comment {
  id: string;
  userId: string;
  username: string;
  avatarUrl: string | null;
  body: string;
  likeCount: number;
  replyCount: number;
  createdAt: string;
  isLiked: boolean;
  parentId?: string;
}

const PAGE_SIZE = 20;

function mapRow(row: Record<string, unknown>): Comment {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    username: row.username as string,
    avatarUrl: (row.avatar_url as string | null) ?? null,
    body: row.body as string,
    likeCount: row.like_count as number,
    replyCount: row.reply_count as number,
    createdAt: row.created_at as string,
    isLiked: row.is_liked as boolean,
    parentId: (row.parent_id as string | undefined) ?? undefined,
  };
}

export function useComments(uploadId: string) {
  return useInfiniteQuery({
    queryKey: ['comments', uploadId],
    queryFn: async ({ pageParam = 0 }): Promise<Comment[]> => {
      const { data, error } = await supabase.rpc('get_comments', {
        p_upload_id: uploadId,
        p_limit: PAGE_SIZE,
        p_offset: pageParam,
      });
      if (error) throw error;
      return (data ?? []).map(mapRow);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < PAGE_SIZE) return undefined;
      return allPages.reduce((total, page) => total + page.length, 0);
    },
    enabled: !!uploadId,
    staleTime: 30_000,
  });
}
