/**
 * useMyDreams — fetches the current user's AI-generated dreams (both posted and saved).
 * Paginated with useInfiniteQuery for performance.
 * Used by the My Dreams tab on the profile screen.
 */

import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { POST_SELECT, mapToDreamPost, castRows } from '@/lib/mapPost';

const PAGE_SIZE = 18;

export function useMyDreams() {
  const userId = useAuthStore((s) => s.user?.id);

  return useInfiniteQuery({
    queryKey: ['my-dreams', userId],
    queryFn: async ({ pageParam }) => {
      const offset = pageParam as number;
      if (!userId) return { rows: [], offset };
      const { data, error } = await supabase
        .from('uploads')
        .select(POST_SELECT)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + PAGE_SIZE - 1);
      if (error) throw error;
      const rows = castRows(data).map((row) => ({
        ...mapToDreamPost(row),
        is_public: (row.is_public as boolean) ?? false,
        posted_at: (row.posted_at as string | null) ?? null,
        description: (row.description as string | null) ?? null,
      }));
      return { rows, offset };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      !lastPage?.rows?.length || lastPage.rows.length < PAGE_SIZE
        ? undefined
        : lastPage.offset + PAGE_SIZE,
    enabled: !!userId,
    staleTime: 60_000,
  });
}
