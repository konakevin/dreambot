import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

// The generated RETURN row shape of the get_comments RPC. Mapping from THIS
// (instead of a Record<string,unknown> cast) is the compile-time lock for the
// 2026-08-18 is_liked regression: if a future migration drops a column the client
// reads, `row.<col>` becomes a tsc error here — not a silent runtime `undefined`.
// Keep types/database.ts regenerated after get_comments migrations so this holds.
type GetCommentsRow = Database['public']['Functions']['get_comments']['Returns'][number];

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

function mapRow(row: GetCommentsRow): Comment {
  return {
    id: row.id,
    userId: row.user_id,
    username: row.username,
    avatarUrl: row.avatar_url ?? null,
    body: row.body,
    likeCount: row.like_count,
    replyCount: row.reply_count,
    createdAt: row.created_at,
    isLiked: row.is_liked,
    parentId: row.parent_id ?? undefined,
  };
}

export interface CommentsPage {
  rows: Comment[];
  hasMore: boolean;
  nextOffset: number;
}

export function useComments(uploadId: string) {
  return useInfiniteQuery({
    queryKey: ['comments', uploadId],
    queryFn: async ({ pageParam = 0 }): Promise<CommentsPage> => {
      const { data, error } = await supabase.rpc('get_comments', {
        p_upload_id: uploadId,
        p_limit: PAGE_SIZE,
        p_offset: pageParam,
      });
      if (error) throw error;
      const rows = (data ?? []).map(mapRow);
      // Both hasMore and nextOffset captured at fetch time so optimistic
      // mutations (delete-comment, like-comment) don't break pagination by
      // shrinking rows.length below PAGE_SIZE.
      return {
        rows,
        hasMore: rows.length === PAGE_SIZE,
        nextOffset: (pageParam as number) + rows.length,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextOffset : undefined),
    enabled: !!uploadId,
    staleTime: 30_000,
  });
}
